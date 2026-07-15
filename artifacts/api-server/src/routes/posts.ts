import { Router, type IRouter } from 'express'
import { db } from '@workspace/db'
import { postsTable } from '@workspace/db'
import { eq, desc } from 'drizzle-orm'
import {
  ListPostsQueryParams,
  CreatePostBody,
  UpdatePostBody,
  GetPostParams,
  UpdatePostParams,
  DeletePostParams,
} from '@workspace/api-zod'

const router: IRouter = Router()

// GET /posts
router.get('/posts', async (req, res) => {
  try {
    const query = ListPostsQueryParams.safeParse(req.query)
    const { status, platform } = query.success ? query.data : {}

    let rows = await db.select().from(postsTable).orderBy(desc(postsTable.scheduledAt))

    if (status) rows = rows.filter((r) => r.status === status)
    if (platform) rows = rows.filter((r) => (r.platforms as string[]).includes(platform))

    res.json(rows.map(serialize))
  } catch (err) {
    req.log.error({ err }, 'listPosts error')
    res.status(500).json({ error: 'Failed to list posts' })
  }
})

// POST /posts
router.post('/posts', async (req, res) => {
  try {
    const parsed = CreatePostBody.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid body', details: parsed.error.issues })
      return
    }
    const { content, platforms, scheduledAt, imageUrl, hashtags, status } = parsed.data
    const [row] = await db
      .insert(postsTable)
      .values({
        content,
        platforms: platforms as string[],
        scheduledAt: new Date(scheduledAt),
        imageUrl: imageUrl ?? null,
        hashtags: (hashtags ?? []) as string[],
        status: status ?? 'scheduled',
      })
      .returning()

    res.status(201).json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'createPost error')
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// GET /posts/:id
router.get('/posts/:id', async (req, res) => {
  try {
    const params = GetPostParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    const [row] = await db.select().from(postsTable).where(eq(postsTable.id, params.data.id))
    if (!row) { res.status(404).json({ error: 'Not found' }); return }
    res.json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'getPost error')
    res.status(500).json({ error: 'Failed to get post' })
  }
})

// PATCH /posts/:id
router.patch('/posts/:id', async (req, res) => {
  try {
    const params = UpdatePostParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    const parsed = UpdatePostBody.safeParse(req.body)
    if (!parsed.success) { res.status(400).json({ error: 'Invalid body' }); return }

    const updates: Record<string, any> = {}
    const d = parsed.data
    if (d.content !== undefined) updates.content = d.content
    if (d.platforms !== undefined) updates.platforms = d.platforms
    if (d.scheduledAt !== undefined) updates.scheduledAt = new Date(d.scheduledAt)
    if (d.imageUrl !== undefined) updates.imageUrl = d.imageUrl ?? null
    if (d.hashtags !== undefined) updates.hashtags = d.hashtags
    if (d.status !== undefined) updates.status = d.status

    const [row] = await db
      .update(postsTable)
      .set(updates)
      .where(eq(postsTable.id, params.data.id))
      .returning()

    if (!row) { res.status(404).json({ error: 'Not found' }); return }
    res.json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'updatePost error')
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// DELETE /posts/:id
router.delete('/posts/:id', async (req, res) => {
  try {
    const params = DeletePostParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    await db.delete(postsTable).where(eq(postsTable.id, params.data.id))
    res.status(204).send()
  } catch (err) {
    req.log.error({ err }, 'deletePost error')
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

function serialize(row: typeof postsTable.$inferSelect) {
  return {
    id: row.id,
    content: row.content,
    platforms: row.platforms ?? [],
    scheduledAt: row.scheduledAt?.toISOString(),
    status: row.status,
    imageUrl: row.imageUrl ?? null,
    hashtags: row.hashtags ?? [],
    createdAt: row.createdAt?.toISOString(),
    sentAt: row.sentAt?.toISOString() ?? null,
  }
}

export default router
