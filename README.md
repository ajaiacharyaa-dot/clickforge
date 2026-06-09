🚀 ClickForge — The AI Creator Operating System

[![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=_18-brightgreen)](https://nodejs.org)

The AI Creator Operating System — helping creators, entrepreneurs, and teams research, create, optimize, publish, and scale digital content faster.

Tagline: Enable one person to perform the work of an entire digital company using AI.

---

## Quick badges & status

- Project: ClickForge
- Focus: Thumbnail & Content MVP (Phase 1)

---

## Getting started (short)

Requirements
- Node.js 18+
- Cloudinary account (for production transforms)
- OpenAI API Key (for hook/title generation)

Clone & install

```bash
git clone https://github.com/ajaiacharyaa-dot/clickforge.git
cd clickforge
npm ci
```

Create `.env.local` (example values are in `.env.example`)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-...
```

Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Compact API examples (curl)

1) Upload an image

```bash
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -F "file=@/full/path/to/test.jpg" http://localhost:3000/api/upload -o upload.json
cat upload.json
```

Response example
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/.../test.jpg"
  }
}
```

2) Generate hooks (from a title)

```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"videoTitle":"My awesome video"}' http://localhost:3000/api/generate-hooks | jq .
```

Response example
```json
{
  "success": true,
  "data": { "hooks": ["YOU WONT BELIEVE","SHOCKING TRUTH", ...] }
}
```

3) Generate thumbnail variations (use an imageUrl from upload or a public image)

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png","hooks":["INSANE RESULT"],"styles":["bold-red"]}' \
  http://localhost:3000/api/generate-thumbnail | jq .
```

Response example
```json
{
  "success": true,
  "data": {
    "variations": [
      {
        "variant_number": 1,
        "text_hook": "INSANE RESULT",
        "style_applied": "bold-red",
        "image_url": "https://res.cloudinary.com/.../image/fetch/...."
      }
    ]
  }
}
```

4) Calculate CTR score

```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"text":"INSANE RESULT","style":"bold-red"}' http://localhost:3000/api/calculate-ctr | jq .
```

Response example
```json
{ "success": true, "data": { "ctrScore": 72, "factors": { ... } } }
```

---

## CI smoke-test script

A lightweight smoke-test is included at `scripts/smoke_test.sh`. It calls `/api/generate-thumbnail` with a public image and validates the returned image URL loads with HTTP 200 and an image content-type. It is intended for local CI or manual testing. See `scripts/smoke_test.sh --help`.

Run it locally:

```bash
bash scripts/smoke_test.sh
```

Or provide a custom image URL:

```bash
SAMPLE_IMAGE_URL="https://example.com/my.jpg" bash scripts/smoke_test.sh
```

---

## Development principles

- Never ship placeholder features: every feature must work end-to-end.
- Keep changes small, testable, and revertible.
- Prefer Node server runtime for cloudinary/SDK operations (not Edge).
- Instrument errors and surface Cloudinary transformation errors in logs.

---

## Contributing

Fork → branch → small PR → tests. Keep commits focused and include validation steps.

---

## License

MIT
