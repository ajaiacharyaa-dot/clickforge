import { Router, type IRouter } from 'express'
import { db } from '@workspace/db'
import { dmsTable } from '@workspace/db'
import { eq, desc } from 'drizzle-orm'
import {
  ListDmsQueryParams,
  CreateDmBody,
  UpdateDmBody,
  GetDmParams,
  UpdateDmParams,
  DeleteDmParams,
} from '@workspace/api-zod'

const router: IRouter = Router()

// GET /dms
router.get('/dms', async (req, res) => {
  try {
    const query = ListDmsQueryParams.safeParse(req.query)
    const { status } = query.success ? query.data : {}

    let rows = await db.select().from(dmsTable).orderBy(desc(dmsTable.scheduledAt))
    if (status) rows = rows.filter((r) => r.status === status)

    res.json(rows.map(serialize))
  } catch (err) {
    req.log.error({ err }, 'listDms error')
    res.status(500).json({ error: 'Failed to list DMs' })
  }
})

// POST /dms
router.post('/dms', async (req, res) => {
  try {
    const parsed = CreateDmBody.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid body', details: parsed.error.issues })
      return
    }
    const { message, recipients, platform, scheduledAt, status } = parsed.data
    const [row] = await db
      .insert(dmsTable)
      .values({
        message,
        recipients: recipients as string[],
        platform,
        scheduledAt: new Date(scheduledAt),
        status: status ?? 'scheduled',
      })
      .returning()

    res.status(201).json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'createDm error')
    res.status(500).json({ error: 'Failed to create DM' })
  }
})

// GET /dms/:id
router.get('/dms/:id', async (req, res) => {
  try {
    const params = GetDmParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    const [row] = await db.select().from(dmsTable).where(eq(dmsTable.id, params.data.id))
    if (!row) { res.status(404).json({ error: 'Not found' }); return }
    res.json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'getDm error')
    res.status(500).json({ error: 'Failed to get DM' })
  }
})

// PATCH /dms/:id
router.patch('/dms/:id', async (req, res) => {
  try {
    const params = UpdateDmParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    const parsed = UpdateDmBody.safeParse(req.body)
    if (!parsed.success) { res.status(400).json({ error: 'Invalid body' }); return }

    const updates: Record<string, any> = {}
    const d = parsed.data
    if (d.message !== undefined) updates.message = d.message
    if (d.recipients !== undefined) updates.recipients = d.recipients
    if (d.platform !== undefined) updates.platform = d.platform
    if (d.scheduledAt !== undefined) updates.scheduledAt = new Date(d.scheduledAt)
    if (d.status !== undefined) updates.status = d.status

    const [row] = await db
      .update(dmsTable)
      .set(updates)
      .where(eq(dmsTable.id, params.data.id))
      .returning()

    if (!row) { res.status(404).json({ error: 'Not found' }); return }
    res.json(serialize(row))
  } catch (err) {
    req.log.error({ err }, 'updateDm error')
    res.status(500).json({ error: 'Failed to update DM' })
  }
})

// DELETE /dms/:id
router.delete('/dms/:id', async (req, res) => {
  try {
    const params = DeleteDmParams.safeParse({ id: Number(req.params.id) })
    if (!params.success) { res.status(400).json({ error: 'Invalid id' }); return }

    await db.delete(dmsTable).where(eq(dmsTable.id, params.data.id))
    res.status(204).send()
  } catch (err) {
    req.log.error({ err }, 'deleteDm error')
    res.status(500).json({ error: 'Failed to delete DM' })
  }
})

function serialize(row: typeof dmsTable.$inferSelect) {
  return {
    id: row.id,
    message: row.message,
    recipients: row.recipients ?? [],
    platform: row.platform,
    scheduledAt: row.scheduledAt?.toISOString(),
    status: row.status,
    createdAt: row.createdAt?.toISOString(),
    sentAt: row.sentAt?.toISOString() ?? null,
  }
}

export default router
