# ClickForge — AI Creator Operating System (Vision 2030)

ClickForge is an AI Operating System for creators, businesses, freelancers, students, researchers, and entrepreneurs. Our mission is to enable one person to perform the work of an entire digital company using AI — from research and content creation to publishing, analytics, and business operations.

This repository contains the first vertical of ClickForge: an AI-powered content engine that helps creators generate high-CTR YouTube thumbnails, hooks, and related content artifacts. While thumbnails are a focused feature today, ClickForge is designed and architected to grow into a complete AI OS over time.

---

## Core Mission

Enable one person to perform the work of an entire digital company using AI.

ClickForge helps users:
- Research topics and compile sources
- Create content (thumbnails, titles, scripts, short-form clips)
- Build brands and businesses
- Manage social publishing and analytics
- Learn and teach through AI-driven curricula
- Automate workflows and delegate to AI agents

We prioritize working software, clean architecture, modular components, and incremental delivery aligned to the long-term vision.

---

## Current Focus (MVP)

1. Fix thumbnail generation pipeline (upload → generate hooks → generate thumbnails → preview → download)
2. Complete the content generation workflow (hooks, titles, descriptions, scripts)
3. Launch an MVP and get real users
4. Collect data and iterate toward Jarvis (the conversational task-execution core)

This repository implements the thumbnail/content MVP and the APIs required to support it.

---

## Quick Start (developer)

Prerequisites
- Node.js 18+
- A Cloudinary account (for image hosting and transformations)
- An OpenAI API key (for hook/title generation)

Local setup

1. Clone:

```bash
git clone https://github.com/ajaiacharyaa-dot/clickforge.git
cd clickforge
```

2. Install:

```bash
npm ci
```

3. Create `.env.local` with these values (copy `.env.example` as a starting point):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-...
```

4. Run the app:

```bash
npm run dev
```

Open http://localhost:3000 and follow the three-step flow: Upload → Generate Hooks → Generate Thumbnails.

---

## Architecture Overview

ClickForge is designed as a modular Next.js application with a clear separation of concerns:

- Frontend: Next.js (app router), React, TypeScript, Tailwind CSS
- Server: Next.js API routes (server runtime — Node) for image processing and AI orchestration
- Image Processing: Cloudinary for uploading and server-side fetch overlays
- AI: OpenAI (hooks/title/script generation) with graceful fallbacks when API keys are missing
- Persistence: Optional Supabase integration for saving user artifacts and metrics

Key modules (src/lib):
- cloudinary.ts — Image upload + overlay generation
- ai.ts — OpenAI calls and parsers (hook generation)
- api routes: upload, generate-hooks, generate-thumbnail, calculate-ctr

Design principles:
- Keep server-side heavy operations in Node (not edge) because of SDK and binary APIs.
- Use Cloudinary for transformations; cache results via CDN.
- Keep business logic small and testable.

---

## API Endpoints (developer reference)

- `POST /api/upload` — upload an image (FormData: file)
- `POST /api/generate-hooks` — generate text hooks (body: { videoTitle })
- `POST /api/generate-thumbnail` — produce 3 thumbnail variations (body: { imageUrl, hooks: string[], styles: string[] })
- `POST /api/calculate-ctr` — compute a CTR score for a hook+style pair

Responses are JSON with `{ success: boolean, data: ... }` or errors with explanatory messages.

---

## Testing & Validation

- Run `npm run build` to catch TypeScript/build issues.
- Use `curl` or the UI to exercise API endpoints.
- Thumbnail generation must produce valid Cloudinary fetch URLs that render as 1280x720 images.

When modifying the Cloudinary overlay code keep the following in mind:
- Use a single font token in `font_family` (no comma-separated fallback lists)
- Avoid unsupported overlay properties that some Cloudinary accounts reject
- Validate the generated URL by opening it in a browser — Cloudinary error pages help diagnose malformed transformations

---

## Contributing

We follow a pragmatic workflow:
- Keep changes focused and small
- Prioritize working, tested changes
- Add/update tests when introducing new behaviors

To contribute:
1. Fork the repo
2. Create a branch `feature/your-feature`
3. Make changes with small, atomic commits
4. Open a pull request with a description and testing notes

---

## Roadmap (high level)

- Short-term (MVP): robust thumbnail pipeline, content generation, MVP launch
- Mid-term: content engine (script, voice, short-form generator), A/B testing and CTR model
- Long-term: Jarvis core (multi-agent orchestration), Research Engine, Social OS, Marketplace, Jobs & Business Builder

---

## License & Support

- License: MIT
- Support: support@clickforge.dev

---

Made with ❤️ by the ClickForge team
