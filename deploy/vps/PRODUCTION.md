# Production deployment

This runbook deploys the accepted static build to `https://listcontrast.com`.
Production is a separate Compose project/container. Do not reuse, rename or expose
the protected preview container.

`CURRENT_STATE.md` records the currently verified live surface. During Expansion
V2, production remains the previous 42-URL surface until the release is actually
deployed and live-smoked; the accepted release target is 66 canonical URLs.

## Topology

```text
Internet
  ↓
existing Caddy (:80/:443)
  ├── automatic HTTPS for listcontrast.com and www.listcontrast.com
  ├── www → apex redirect
  └── public reverse proxy (no Basic Auth, no noindex)
  ↓
external Docker network: vps_booking_network
  ↓
listcontrast-production:8080
  ↓
nginx
  ↓
static Astro dist/
```

The application service exposes port 8080 only inside Docker. It publishes no
host port and contains no Caddy, TLS keys, application secrets, Node.js backend
or database.

## Release order

1. Merge the accepted release PR only after repository CI and review pass.
2. Update the dedicated VPS checkout to the accepted `main` commit.
3. Build and start the production Compose service.
4. Verify the container through the shared Docker network.
5. Run public route, redirect, privacy and SEO smoke.
6. Verify the complete live sitemap surface.
7. Update Search Console / Yandex Webmaster only after live verification.

The protected preview stays running throughout deployment.

## Repository/generated-output gate

Before merge or deployment:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Inspect generated production SEO output:

```bash
mapfile -t INDEXABLE_HTML < <(find dist -type f -name index.html | sort)

if [ "${#INDEXABLE_HTML[@]}" -ne 66 ]; then
  echo "Expected 66 indexable HTML pages, found ${#INDEXABLE_HTML[@]}" >&2
  exit 1
fi

rg -n 'https://listcontrast\.com' \
  "${INDEXABLE_HTML[@]}" \
  dist/robots.txt \
  dist/sitemap.xml

if rg -n 'example\.com|preview\.listcontrast\.com' dist; then
  echo "Unexpected placeholder or preview hostname in dist" >&2
  exit 1
fi

if rg -n 'noindex' "${INDEXABLE_HTML[@]}"; then
  echo "Unexpected noindex on an indexable production page" >&2
  exit 1
fi

rg -n 'noindex,nofollow' dist/404.html

SITEMAP_COUNT=$(grep -o '<loc>' dist/sitemap.xml | wc -l)
[ "$SITEMAP_COUNT" -eq 66 ] || {
  echo "Expected 66 sitemap URLs, got $SITEMAP_COUNT" >&2
  exit 1
}
```

Required generated-output state:

- canonical and Open Graph URLs use only `https://listcontrast.com`;
- all 66 indexable routes contain no `noindex` directive;
- 404 remains `noindex,nofollow` and has no canonical or `og:url`;
- robots allows crawling and references the production sitemap;
- sitemap contains exactly the 66 canonical routes from the typed route registry;
- no rejected synonym route such as `/compare-lists`, `/list-diff`,
  `/random-group-generator` or `/remove-newlines` appears.

Do not commit `dist/`.

## Update the VPS checkout

```bash
cd /opt/listcontrast-preview
git fetch origin main
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

The printed SHA must equal the accepted release commit. Record it in the release
notes before continuing.

## Validate and start production

```bash
cd /opt/listcontrast-preview
docker compose -f deploy/vps/compose.production.yml config
docker compose -f deploy/vps/compose.production.yml up -d --build
docker compose -f deploy/vps/compose.production.yml ps
```

Wait for `healthy`, then smoke every English page identity through the shared
Docker network:

```bash
for path in \
  / \
  /alphabetize-list \
  /randomize-list \
  /remove-duplicate-lines \
  /random-team-generator \
  /random-pair-generator \
  /remove-line-breaks \
  /column-to-comma-separated-list \
  /tools \
  /about \
  /privacy; do
  docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
    -fsS -o /dev/null -w "$path -> %{http_code}\n" \
    "http://listcontrast-production:8080$path"
done

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -sS -o /dev/null -w '/missing-production-check -> %{http_code}\n' \
  http://listcontrast-production:8080/missing-production-check
```

Expected: all 11 English routes return `200`; the unknown route returns `404`.
If this fails, inspect logs and stop before touching ingress:

```bash
docker compose -f deploy/vps/compose.production.yml logs --tail=150 \
  listcontrast-production
```

## External Caddy production blocks

The live Caddyfile is owned outside this repository. Keep the existing ingress
project and protected preview block intact.

```caddyfile
www.listcontrast.com {
    redir https://listcontrast.com{uri} permanent
}

listcontrast.com {
    encode zstd gzip

    header {
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    reverse_proxy listcontrast-production:8080
}
```

The production blocks intentionally contain no Basic Auth, no
`X-Robots-Tag: noindex`, no TLS secret path and no published nginx host port.

Validate and gracefully reload the existing Caddy container only if ingress
configuration actually changed:

```bash
CADDY_CONTAINER=<EXISTING_CADDY_CONTAINER>
docker exec "$CADDY_CONTAINER" \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec "$CADDY_CONTAINER" \
  caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Do not run Compose down for the ingress project.

## DNS

Expansion V2 normally requires no DNS change. If DNS must be re-verified, the
intended Beget records remain:

```text
@     A       <VPS_IPV4>
www   CNAME   listcontrast.com.
```

Do not change the existing `preview` record. Confirm resolution when relevant:

```bash
getent ahostsv4 listcontrast.com
getent ahostsv4 www.listcontrast.com
```

## Public smoke

```bash
for path in \
  / \
  /alphabetize-list \
  /randomize-list \
  /remove-duplicate-lines \
  /random-team-generator \
  /random-pair-generator \
  /remove-line-breaks \
  /column-to-comma-separated-list \
  /tools \
  /about \
  /privacy; do
  curl -fsS -o /dev/null -w "$path %{http_code}\n" \
    "https://listcontrast.com$path"
done

curl -sS -o /dev/null -w 'missing %{http_code}\n' \
  https://listcontrast.com/missing-production-check
curl -sSI https://www.listcontrast.com/a-test-path
```

Required:

- all 11 English page identities return `200`;
- unknown apex route returns `404`;
- `www` permanently redirects to the equivalent apex path;
- production has no Basic Auth challenge or `X-Robots-Tag: noindex`;
- protected preview behavior is unchanged.

Verify every canonical locale URL from the live sitemap rather than manually
maintaining a second 66-entry route list:

```bash
SITEMAP_URLS=$(curl -fsS https://listcontrast.com/sitemap.xml | \
  grep -oE '<loc>[^<]+' | sed 's#<loc>##')

COUNT=$(printf '%s\n' "$SITEMAP_URLS" | sed '/^$/d' | wc -l)
[ "$COUNT" -eq 66 ] || {
  echo "Expected 66 sitemap URLs, got $COUNT" >&2
  exit 1
}

while IFS= read -r url; do
  [ -n "$url" ] || continue
  curl -fsS -o /dev/null -w "$url -> %{http_code}\n" "$url"
done <<EOF
$SITEMAP_URLS
EOF
```

Expected: all 66 canonical URLs return `200`.

Then verify representative browser behavior:

- Compare Lists: both inputs, options, counters, result tabs, Swap, Clear,
  example, Copy and Download;
- Alphabetizer, List Randomizer and Remove Duplicate Lines core regressions;
- Random Team Generator: team-count and people-per-team modes, balanced output,
  reroll, invalid team count, Copy and Download;
- Random Pair Generator: even and odd input, explicit Unpaired result, reroll,
  Copy and Download;
- Remove Line Breaks: default space replacement, paragraph preservation,
  replacement presets/custom separator, Copy and Download;
- Column to Comma Separated List: trim/empty-line defaults, delimiter presets,
  custom separator, duplicate preservation, Copy and Download;
- at least one non-English version of each new tool family;
- desktop and narrow/mobile layout, Tools, About, Privacy and an unknown route.

## Live SEO verification

```bash
curl -fsS https://listcontrast.com/robots.txt
curl -fsS https://listcontrast.com/sitemap.xml

for path in \
  / \
  /alphabetize-list \
  /randomize-list \
  /remove-duplicate-lines \
  /random-team-generator \
  /random-pair-generator \
  /remove-line-breaks \
  /column-to-comma-separated-list \
  /tools \
  /about \
  /privacy; do
  curl -fsS "https://listcontrast.com$path" | \
    rg 'canonical|og:url|noindex|example\.com|preview\.listcontrast\.com'
done

curl -fsS https://listcontrast.com/404-does-not-exist | \
  rg 'canonical|og:url|noindex'
```

Required:

- robots contains `Allow: /` and
  `Sitemap: https://listcontrast.com/sitemap.xml`;
- sitemap has exactly 66 production `<loc>` values;
- every indexable page self-canonicalizes and has production `og:url`;
- every page has the expected reciprocal `en`, `de`, `fr`, `es`, `pt-BR`, `ru`
  and `x-default` alternates;
- indexable pages contain no `noindex`;
- live 404 contains `noindex,nofollow` and no canonical/`og:url`;
- neither placeholder nor preview hostname appears;
- homepage remains the only page with the accepted `WebSite` JSON-LD entity.

## Search Console and Yandex Webmaster

Only after public smoke and SEO verification pass:

1. verify the existing `listcontrast.com` property remains healthy;
2. submit or re-submit `https://listcontrast.com/sitemap.xml` if needed;
3. inspect `/` and representative new English routes;
4. spot-check new localized routes, especially PT-BR and RU;
5. request indexing only after the live URL reports the intended canonical and
   indexability;
6. use approximately 7/14/28-day Search Console and Yandex Webmaster windows as
   the next evidence source instead of immediately changing titles/slugs.

Product analytics remains optional and must not delay release.

## Rollback

Application rollback uses the last known-good commit:

```bash
cd /opt/listcontrast-preview
git switch --detach <PREVIOUS_GOOD_COMMIT>
docker compose -f deploy/vps/compose.production.yml up -d --build
docker compose -f deploy/vps/compose.production.yml ps
```

If public ingress itself is wrong, restore the Caddyfile backup, validate it and
gracefully reload Caddy. Do not remove the preview block.

To stop only production:

```bash
cd /opt/listcontrast-preview
docker compose -f deploy/vps/compose.production.yml stop
```

Do not remove `vps_booking_network`, the shared Caddy container or the preview
Compose project.

## Release record

Record:

- deployed Git commit;
- deployment time;
- internal results for every shipped English route identity;
- public 66-URL sitemap smoke and redirect results;
- live canonical/hreflang/robots/sitemap results;
- representative browser behavior results for the four new tools;
- Search Console / Yandex Webmaster follow-up state;
- rollback commit.

Never record credentials, bcrypt hashes, tokens or the VPS IP in Git.
