# Production deployment

This runbook cuts the accepted static build over to
`https://listcontrast.com`. Production is a separate Compose project and
container. Do not reuse, rename or expose the protected preview container.

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
host port and does not contain Caddy, TLS keys, application secrets, Node.js,
a backend or a database.

## Release order

Use this order so production can be verified internally before DNS sends public
traffic:

1. merge the accepted production-cutover PR;
2. update the dedicated VPS checkout;
3. build and start the production Compose service;
4. verify the container through the shared Docker network;
5. add and validate the external Caddy production blocks;
6. create/confirm Beget DNS records;
7. wait for DNS and certificate issuance;
8. run public smoke and SEO checks;
9. verify Search Console and submit the sitemap.

The protected preview stays running throughout the cutover.

## Local generated-output gate

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

Inspect the generated production SEO output:

```bash
rg -n 'https://listcontrast\.com' \
  dist/index.html \
  dist/about/index.html \
  dist/privacy/index.html \
  dist/robots.txt \
  dist/sitemap.xml

if rg -n 'example\.com|preview\.listcontrast\.com' dist; then
  echo "Unexpected placeholder or preview hostname in dist" >&2
  exit 1
fi

if rg -n 'noindex' \
  dist/index.html dist/about/index.html dist/privacy/index.html; then
  echo "Unexpected noindex on an indexable production page" >&2
  exit 1
fi

rg -n 'noindex,nofollow' dist/404.html
```

Expected:

- canonical and Open Graph URLs use only `https://listcontrast.com`;
- `/`, `/about` and `/privacy` have no noindex directive;
- 404 remains `noindex,nofollow` and has no canonical or `og:url`;
- robots allows crawling and references the production sitemap;
- sitemap contains exactly the three indexable production URLs.

Do not commit `dist/`.

## Update the VPS checkout

The current checkout is shared only as source; preview and production remain
separate Compose projects.

```bash
cd /opt/listcontrast-preview
git fetch origin main
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Record the printed commit SHA in the release notes before continuing.

## Validate and start production

```bash
cd /opt/listcontrast-preview
docker compose -f deploy/vps/compose.production.yml config
docker compose -f deploy/vps/compose.production.yml up -d --build
docker compose -f deploy/vps/compose.production.yml ps
```

Wait for `healthy`, then check internal routes:

```bash
docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/ -> %{http_code}\n' \
  http://listcontrast-production:8080/

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/about -> %{http_code}\n' \
  http://listcontrast-production:8080/about

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/privacy -> %{http_code}\n' \
  http://listcontrast-production:8080/privacy

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -sS -o /dev/null -w '/missing-production-check -> %{http_code}\n' \
  http://listcontrast-production:8080/missing-production-check
```

Expected: `200`, `200`, `200`, `404`.

If this gate fails, inspect logs and stop before changing Caddy or DNS:

```bash
docker compose -f deploy/vps/compose.production.yml logs --tail=150 \
  listcontrast-production
```

## External Caddy production blocks

The live Caddyfile is owned outside this repository. Append separate production
blocks without replacing its global options, API site or protected preview
block.

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

The production blocks intentionally contain:

- no Basic Auth;
- no `X-Robots-Tag` noindex directive;
- no TLS certificate path or secret;
- no published nginx host port.

Validate and gracefully reload the existing Caddy container:

```bash
CADDY_CONTAINER=<EXISTING_CADDY_CONTAINER>
docker exec "$CADDY_CONTAINER" \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec "$CADDY_CONTAINER" \
  caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Do not restart or run Compose down for the ingress project.

## Beget DNS

In the DNS zone for `listcontrast.com`, configure:

```text
@     A       <VPS_IPV4>
www   CNAME   listcontrast.com.
```

Remove conflicting Beget parking/hosting records for the same names. Do not
change the existing `preview` record.

Confirm from more than one resolver:

```bash
getent ahostsv4 listcontrast.com
getent ahostsv4 www.listcontrast.com
```

Both names must lead to the selected VPS, directly or through the documented
CNAME.

## Public smoke

Certificate issuance can take a short time after DNS becomes visible. Do not
disable TLS validation or replace public HTTPS with an insecure workaround.

```bash
curl -fsS -o /dev/null -w 'home %{http_code}\n' \
  https://listcontrast.com/
curl -fsS -o /dev/null -w 'about %{http_code}\n' \
  https://listcontrast.com/about
curl -fsS -o /dev/null -w 'privacy %{http_code}\n' \
  https://listcontrast.com/privacy
curl -sS -o /dev/null -w 'missing %{http_code}\n' \
  https://listcontrast.com/missing-production-check
curl -sSI https://www.listcontrast.com/a-test-path
```

Expected:

- apex routes: `200`, `200`, `200`, `404`;
- `www` permanently redirects to
  `https://listcontrast.com/a-test-path`;
- no Basic Auth challenge on production;
- no `X-Robots-Tag: noindex` on production;
- preview still returns `401` without credentials.

Then verify in a browser:

- both inputs and all four options;
- live counts and all five result tabs;
- Swap, Clear and Load example;
- Copy and Download;
- desktop and narrow/mobile layout;
- About, Privacy and unknown route.

## Live SEO verification

```bash
curl -fsS https://listcontrast.com/robots.txt
curl -fsS https://listcontrast.com/sitemap.xml
curl -fsS https://listcontrast.com/ | \
  rg 'canonical|og:url|noindex|example\.com|preview\.listcontrast\.com'
curl -fsS https://listcontrast.com/404-does-not-exist | \
  rg 'canonical|og:url|noindex'
```

Required:

- robots contains `Allow: /` and
  `Sitemap: https://listcontrast.com/sitemap.xml`;
- sitemap has exactly three production `<loc>` values;
- homepage canonical and `og:url` use the apex origin;
- indexable pages contain no noindex;
- live 404 contains `noindex,nofollow` and no canonical/`og:url`;
- neither placeholder nor preview hostname appears.

## Search Console

Only after public smoke and SEO verification pass:

1. create or verify the `listcontrast.com` domain property;
2. complete the DNS TXT verification requested by Google;
3. submit `https://listcontrast.com/sitemap.xml`;
4. inspect `https://listcontrast.com/`;
5. request indexing only after the live URL reports the expected canonical and
   indexability.

Product analytics remains optional and must not delay launch.

## Rollback

Application rollback uses the last known-good commit:

```bash
cd /opt/listcontrast-preview
git switch --detach <PREVIOUS_GOOD_COMMIT>
docker compose -f deploy/vps/compose.production.yml up -d --build
docker compose -f deploy/vps/compose.production.yml ps
```

If the public ingress itself is wrong, restore the Caddyfile backup, validate
it and gracefully reload Caddy. Do not remove the preview block.

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
- internal route results;
- public route and redirect results;
- live canonical/robots/sitemap results;
- Search Console property verification and sitemap submission;
- rollback commit.

Never record credentials, bcrypt hashes, tokens or the VPS IP in Git.
