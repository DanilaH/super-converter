# Protected preview deployment

This runbook covers only the isolated List Contrast preview service. It must
not recreate, restart or remove the existing Caddy ingress or any unrelated
service on the VPS.

## Topology

```text
Internet
  ↓
existing Caddy (:80/:443)
  ├── automatic HTTPS
  ├── Basic Auth
  └── X-Robots-Tag: noindex, nofollow, noarchive
  ↓
external Docker network: vps_booking_network
  ↓
listcontrast-preview:8080
  ↓
nginx
  ↓
static Astro dist/
```

`deploy/vps/compose.preview.yml` runs a separate Compose project. The service
uses the network alias `listcontrast-preview`, exposes port 8080 only inside
Docker and publishes no port on the host.

Caddy is owned outside this repository and is shared with another project.
Preserve the preview site block whenever that external Caddyfile is deployed or
updated.

## Prerequisites

- Docker Engine with Compose v2;
- the external network `vps_booking_network`;
- the existing Caddy container attached to that network;
- DNS for `preview.listcontrast.com` resolving to the VPS;
- repository access from the VPS.

Confirm the network before the first deploy:

```bash
docker network inspect vps_booking_network >/dev/null
```

Do not create a similarly named replacement network if this check fails.
Investigate the existing ingress stack instead.

## First checkout and deploy

Use a dedicated checkout. Authentication must use the host's configured Git
credential or SSH key; never place a token in the clone URL or this repository.

```bash
git clone git@github.com:DanilaH/super-converter.git /opt/listcontrast-preview
cd /opt/listcontrast-preview
git switch main
git pull --ff-only origin main
docker compose -f deploy/vps/compose.preview.yml up -d --build
```

The application build needs no runtime secrets.

## Status and internal route verification

```bash
cd /opt/listcontrast-preview
docker compose -f deploy/vps/compose.preview.yml ps
docker compose -f deploy/vps/compose.preview.yml logs --tail=100 listcontrast-preview
```

Wait until the service is healthy, then check it through the shared network:

```bash
docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/ -> %{http_code}\n' \
  http://listcontrast-preview:8080/

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/about -> %{http_code}\n' \
  http://listcontrast-preview:8080/about

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -fsS -o /dev/null -w '/privacy -> %{http_code}\n' \
  http://listcontrast-preview:8080/privacy

docker run --rm --network vps_booking_network curlimages/curl:8.11.1 \
  -sS -o /dev/null -w '/missing-preview-check -> %{http_code}\n' \
  http://listcontrast-preview:8080/missing-preview-check
```

Expected statuses are `200`, `200`, `200` and `404`.

## External Caddy integration

The live Caddyfile is not stored in this repository. Add a separate site block
to the externally owned Caddyfile; do not replace its existing global options
or other site blocks.

```caddyfile
preview.listcontrast.com {
    encode zstd gzip

    header {
        X-Robots-Tag "noindex, nofollow, noarchive"
    }

    basic_auth {
        <PREVIEW_USERNAME> <BCRYPT_PASSWORD_HASH>
    }

    reverse_proxy listcontrast-preview:8080
}
```

Generate the hash directly on the host and keep both the password and generated
hash out of Git, shell history, screenshots and chat logs. Do not reuse an
account, SSH, GitHub or production password.

Validate and gracefully reload the existing instance. Substitute the actual
container name only in the shell; do not save it in repository files.

```bash
CADDY_CONTAINER=<EXISTING_CADDY_CONTAINER>
docker exec "$CADDY_CONTAINER" \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec "$CADDY_CONTAINER" \
  caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Do not run `docker compose down` in the ingress project's directory.

## Public verification

From a workstation outside the VPS, verify:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' \
  https://preview.listcontrast.com/

curl -sSI -u '<PREVIEW_USERNAME>:<PREVIEW_PASSWORD>' \
  https://preview.listcontrast.com/
```

Expected behavior:

- no credentials: `401`;
- valid credentials: `200`;
- authenticated response includes
  `X-Robots-Tag: noindex, nofollow, noarchive`;
- HTTPS certificate is valid;
- `/about` and `/privacy` return `200`;
- an unknown route returns `404`.

Do not paste a real password into a shared terminal transcript or issue.

## Safe update

Record the current revision before updating so rollback remains possible:

```bash
cd /opt/listcontrast-preview
PREVIOUS_REVISION=$(git rev-parse HEAD)
git fetch origin main
git switch main
git pull --ff-only origin main
docker compose -f deploy/vps/compose.preview.yml up -d --build
docker compose -f deploy/vps/compose.preview.yml ps
printf 'Previous revision: %s\n' "$PREVIOUS_REVISION"
```

Run the internal and public verification again. Updating the preview service
does not require a Caddy restart or reload when its hostname, network alias and
port are unchanged.

## Rollback

Use the revision recorded immediately before the update:

```bash
cd /opt/listcontrast-preview
git switch --detach <PREVIOUS_REVISION>
docker compose -f deploy/vps/compose.preview.yml up -d --build
docker compose -f deploy/vps/compose.preview.yml ps
```

After verification, restore the checkout to `main` before the next normal
update:

```bash
git switch main
```

Rollback affects only the List Contrast preview project.

## Stop or remove only the preview

```bash
cd /opt/listcontrast-preview
docker compose -f deploy/vps/compose.preview.yml stop
```

To remove its container and project network attachments while keeping the built
image and shared external network:

```bash
docker compose -f deploy/vps/compose.preview.yml down
```

Never add `--remove-orphans` and never remove `vps_booking_network`.

## Verified owner evidence

The owner manually confirmed the following against the protected preview:

- DNS resolves and HTTPS is valid;
- unauthenticated access returns `401`;
- authenticated access returns `200`;
- the noindex header is present;
- `/`, `/about` and `/privacy` return `200`;
- an unknown path returns `404`;
- client-side JavaScript loads;
- counters, comparison options, result tabs, Copy and Download work.

These are owner-provided manual observations, not automated CI evidence. An
initial asset load during certificate setup required a hard refresh and did not
reproduce afterward.

## Production boundary

The preview hostname is never a canonical or sitemap origin. The application
configuration intentionally remains on the reserved `https://example.com`
origin until CL-036 passes. Production domain/redirect configuration, Search
Console verification and sitemap submission belong only to that final audit.
