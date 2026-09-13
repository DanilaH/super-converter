#!/usr/bin/env bash
set -euo pipefail

ORIGIN="https://listcontrast.com"
HOST="listcontrast.com"
KEY="7f03778ac87cd20aed1fda50f491df61"
KEY_LOCATION="$ORIGIN/$KEY.txt"
ENDPOINT="https://api.indexnow.org/IndexNow"

usage() {
  cat <<'EOF'
Usage:
  bash deploy/vps/indexnow-submit.sh --sitemap
  bash deploy/vps/indexnow-submit.sh /path [/another-path ...]
  bash deploy/vps/indexnow-submit.sh https://listcontrast.com/path [...]

Use --sitemap only for releases where the whole indexable surface changed.
For smaller releases, submit only the URLs that were added, updated or deleted.
EOF
}

if [ "$#" -eq 0 ]; then
  usage >&2
  exit 2
fi

KEY_BODY=$(curl -fsS "$KEY_LOCATION")
if [ "$KEY_BODY" != "$KEY" ]; then
  echo "IndexNow key verification failed at $KEY_LOCATION" >&2
  exit 1
fi

URLS=()

if [ "$1" = "--sitemap" ]; then
  if [ "$#" -ne 1 ]; then
    echo "--sitemap cannot be combined with explicit URLs" >&2
    exit 2
  fi

  while IFS= read -r url; do
    [ -n "$url" ] && URLS+=("$url")
  done < <(
    curl -fsS "$ORIGIN/sitemap.xml" \
      | grep -oE '<loc>[^<]+' \
      | sed 's#<loc>##'
  )
else
  for value in "$@"; do
    case "$value" in
      /*)
        URLS+=("$ORIGIN$value")
        ;;
      "$ORIGIN"|"$ORIGIN"/*)
        URLS+=("$value")
        ;;
      *)
        echo "Refusing URL outside $HOST: $value" >&2
        exit 2
        ;;
    esac
  done
fi

COUNT=${#URLS[@]}
if [ "$COUNT" -eq 0 ]; then
  echo "No URLs to submit" >&2
  exit 1
fi

if [ "$COUNT" -gt 10000 ]; then
  echo "IndexNow allows at most 10000 URLs per request; got $COUNT" >&2
  exit 1
fi

for url in "${URLS[@]}"; do
  case "$url" in
    "$ORIGIN"|"$ORIGIN"/*) ;;
    *)
      echo "Sitemap returned URL outside $HOST: $url" >&2
      exit 1
      ;;
  esac
done

JSON_URLS=$(printf '%s\n' "${URLS[@]}" \
  | sed 's/\\/\\\\/g; s/"/\\"/g; s/^/"/; s/$/"/' \
  | paste -sd, -)

PAYLOAD=$(printf '{"host":"%s","key":"%s","keyLocation":"%s","urlList":[%s]}' \
  "$HOST" "$KEY" "$KEY_LOCATION" "$JSON_URLS")

RESPONSE_FILE=$(mktemp)
trap 'rm -f "$RESPONSE_FILE"' EXIT

STATUS=$(curl -sS \
  -o "$RESPONSE_FILE" \
  -w '%{http_code}' \
  -X POST \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data "$PAYLOAD" \
  "$ENDPOINT")

case "$STATUS" in
  200|202)
    echo "IndexNow accepted $COUNT URL(s) with HTTP $STATUS"
    ;;
  *)
    echo "IndexNow submission failed with HTTP $STATUS" >&2
    cat "$RESPONSE_FILE" >&2
    exit 1
    ;;
esac
