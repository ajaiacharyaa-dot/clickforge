#!/usr/bin/env bash
set -euo pipefail

# scripts/smoke_test.sh
# Lightweight smoke test for ClickForge thumbnail pipeline.
# Usage:
#   SAMPLE_IMAGE_URL="https://.../image.png" bash scripts/smoke_test.sh
# Exits 0 on success, non-zero on failure.

HOST="${HOST:-http://localhost:3000}"
SAMPLE_IMAGE_URL="${SAMPLE_IMAGE_URL:-https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png}"

echo "Running ClickForge smoke test against $HOST"

# 1) Call generate-thumbnail with a single hook/style
REQ_PAYLOAD=$(jq -n --arg img "$SAMPLE_IMAGE_URL" '{imageUrl: $img, hooks: ["SMOKE TEST HOOK"], styles: ["bold-red"]}')

echo "Request payload: $REQ_PAYLOAD"

GEN_RESP=$(curl -s -X POST -H "Content-Type: application/json" -d "$REQ_PAYLOAD" "$HOST/api/generate-thumbnail") || {
  echo "ERROR: Failed to call /api/generate-thumbnail"
  exit 2
}

echo "generate-thumbnail response: $GEN_RESP"

# Parse response
SUCCESS=$(echo "$GEN_RESP" | jq -r '.success // empty') || SUCCESS=""
if [[ "$SUCCESS" != "true" ]]; then
  echo "ERROR: API did not return success=true"
  echo "$GEN_RESP" | jq .
  exit 3
fi

IMAGE_URL=$(echo "$GEN_RESP" | jq -r '.data.variations[0].image_url // empty')
if [[ -z "$IMAGE_URL" || "$IMAGE_URL" == "null" ]]; then
  echo "ERROR: No image_url returned in variations"
  exit 4
fi

echo "Generated image URL: $IMAGE_URL"

# 2) HEAD request to image URL and validate status and content-type
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I "$IMAGE_URL" || true)
CONTENT_TYPE=$(curl -s -I "$IMAGE_URL" | tr -d '\r' | awk '/Content-Type:/ {print $2}' | tr -d '\n' || echo "")

echo "Image HEAD status: $HTTP_STATUS"
echo "Image Content-Type: $CONTENT_TYPE"

if [[ "$HTTP_STATUS" != "200" ]]; then
  echo "ERROR: Image URL did not return 200. Saving response body for debugging..."
  curl -s "$IMAGE_URL" -o /tmp/smoke_image_response.html || true
  echo "Saved to /tmp/smoke_image_response.html"
  exit 5
fi

if [[ ! "$CONTENT_TYPE" =~ ^image/ ]]; then
  echo "ERROR: Returned content-type is not an image: $CONTENT_TYPE"
  exit 6
fi

# 3) Optional: download image and check dimensions using identify (if available)
if command -v identify >/dev/null 2>&1; then
  curl -s "$IMAGE_URL" -o /tmp/smoke_thumb.jpg
  echo "Downloaded image to /tmp/smoke_thumb.jpg"
  identify /tmp/smoke_thumb.jpg
else
  echo "ImageMagick 'identify' not found; skipping local dimension check"
fi

echo "SMOKE TEST PASSED"
exit 0
