# Production deployment

This runbook deploys the accepted static build to `https://listcontrast.com`.
Production is a separate Compose project/container. Do not reuse, rename or expose
the protected preview container.

The current accepted production surface contains 66 canonical URLs.

## Topology

```text
Internet
  ↓
existing Caddy (:80/:443)
  ├── automatic HTTPS for listcontrast.com and www.listcontrast.com
  ├── www → apex redirect
  └── public reverse proxy (no Basic Auth, no noindex)
  ↓
external Docker network: web_proxy
  ↓
listcontrast-production:8080
  ↓
nginx
  ↓
static Astro dist/
```

The application service exposes port 8080 only inside Docker. It publishes no
host port and contains no TLS keys, application secrets, Node.js backend or
database.

## Release order

1. Merge the accepted release PR only after repository CI and review pass.
2. Update the dedicated VPS checkout to the accepted `main` commit.
3. Build and start the production Compose service.
4. Verify the container through the shared `web_proxy` network.
5. Run public route, redirect, security-header and SEO smoke.
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
- sitemap contains exactly the 66 canonical routes from the typed route registry.

Do not commit `dist/`.

## Update the VPS checkout

```bash
cd /opt/listcontrast-preview
git fetch origin main
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Record the deployed SHA before continuing.

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
  docker run --rm --network web_proxy curlimages/curl:8.11.1 \
    -fsS -o /dev/null -w "$path -> %{http_code}\n" \
    "http://listcontrast-production:8080$path"
done

docker run --rm --network web_proxy curlimages/curl:8.11.1 \
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
project and protected preview block intact. Caddy and ListContrast must both be
attached to the external `web_proxy` network.

Representative production routing:

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

The application nginx layer supplies:

- `Strict-Transport-Security: max-age=31536000`;
- `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(), usb=()`;
- `X-Frame-Options: DENY`;
- `server_tokens off`.

Do not add a duplicate HSTS header in Caddy unless the nginx-owned header is
removed deliberately.

Validate and gracefully reload the existing Caddy container only if ingress
configuration actually changed:

```bash
CADDY_CONTAINER=caddy
docker exec "$CADDY_CONTAINER" \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec "$CADDY_CONTAINER" \
  caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Do not run Compose down for the ingress project.

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

## Security-header smoke

```bash
curl -sSI https://listcontrast.com/ | grep -Ei \
'^(HTTP/|strict-transport-security:|permissions-policy:|x-frame-options:|x-content-type-options:|referrer-policy:|server:)'
```

Required:

- exactly one `Strict-Transport-Security` header with `max-age=31536000`;
- expected `Permissions-Policy` and `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`;
- no nginx version disclosure such as `nginx/1.x.x`.

## Complete sitemap smoke

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

- robots contains `Allow: /` and `Sitemap: https://listcontrast.com/sitemap.xml`;
- sitemap has exactly 66 production `<loc>` values;
- every indexable page self-canonicalizes and has production `og:url`;
- every page has reciprocal `en`, `de`, `fr`, `es`, `pt-BR`, `ru` and `x-default` alternates;
- indexable pages contain no `noindex`;
- live 404 contains `noindex,nofollow` and no canonical/`og:url`;
- neither placeholder nor preview hostname appears.

## Search Console and Yandex Webmaster

After public smoke and SEO verification pass, use roughly 7/14/28-day Search
Console and Yandex Webmaster windows as the next evidence source instead of
immediately changing titles/slugs. Yandex ownership is already verified via
Beget; no HTML verification file is required.

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

Do not remove `web_proxy`, the shared Caddy container or the preview Compose
project.

Never record credentials, hashes, tokens or the VPS IP in Git.
