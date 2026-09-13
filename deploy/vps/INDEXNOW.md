# IndexNow deployment hook

ListContrast publishes an IndexNow ownership key at the site root and provides a
curl-only helper for notifying participating search engines after a successful
production deployment.

## Ownership key

The production key file is:

```text
https://listcontrast.com/7f03778ac87cd20aed1fda50f491df61.txt
```

It must return exactly:

```text
7f03778ac87cd20aed1fda50f491df61
```

The file is intentionally public: IndexNow fetches it to verify that the
submission is authorized for `listcontrast.com`.

## When to submit

Submit only after the new production build is live and the normal production
smoke checks have passed.

Use IndexNow when indexable content or URLs were added, changed or deleted.
Do not submit for infrastructure-only changes such as Caddy, Docker network,
runbook or monitoring updates that do not change the public site content.

For a site-wide release where shared layout/content/metadata changed, submit the
current sitemap surface:

```bash
cd /opt/listcontrast-preview
bash deploy/vps/indexnow-submit.sh --sitemap
```

For a narrow release, submit only affected URLs:

```bash
bash deploy/vps/indexnow-submit.sh \
  /random-team-generator \
  /de/zufaelliger-teamgenerator \
  /fr/generateur-equipes-aleatoires
```

Full `https://listcontrast.com/...` URLs are accepted too. URLs on another host
are rejected by the helper.

For deleted pages, pass the old URL explicitly after the deletion is live so
IndexNow can discover the `404`/`410` state.

## Deployment order

1. Pull the accepted `main` commit on the VPS.
2. Build and start production.
3. Wait for the production container to become healthy.
4. Run internal/public/security/sitemap smoke checks.
5. Verify the IndexNow key file is live.
6. Submit changed URLs with `indexnow-submit.sh`.
7. Confirm an HTTP `200` or `202` response from IndexNow.
8. Monitor submissions in Bing Webmaster Tools → IndexNow.

The helper verifies the key file before sending anything, limits each request to
10,000 URLs, validates that every URL belongs to `listcontrast.com`, and treats
HTTP `200` and `202` as accepted responses.

IndexNow notification does not guarantee crawling, indexing or ranking. Keep the
normal sitemap and robots configuration in place.
