---
name: ClickForge Vercel port
description: Key decisions made during the Next.js → Vite+React migration for ClickForge
---

# ClickForge Vercel Port

## Env var renames
- `NEXT_PUBLIC_SUPABASE_URL` → `VITE_SUPABASE_URL` (frontend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `VITE_SUPABASE_ANON_KEY` (frontend)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` → `CLOUDINARY_CLOUD_NAME` (api-server only, not exposed to frontend)
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` → server-side only in api-server

**Why:** NEXT_PUBLIC_ vars move to VITE_ for frontend; server-only vars stay in api-server.

## Cloudinary fallback
If `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` are missing, `uploadImageBuffer` returns a base64 data URL; `addTextToImage` returns the original URL unmodified.

**Why:** Graceful degradation so the app works without Cloudinary configured.

## Packages removed from frontend
`next`, `next-cloudinary`, `@supabase/auth-helpers-nextjs`, `cloudinary` — all server-only; removed from `artifacts/clickforge`.

## Supabase client
Frontend uses `@supabase/supabase-js` directly via `createClient()` from `src/lib/supabase-client.ts` (no auth helpers shim).

## API routes
Converted to Express in `artifacts/api-server/src/routes/thumbnail.ts`. File upload uses `multer` (memoryStorage).
