import { Router, type IRouter } from 'express'
import { db } from '@workspace/db'
import { postsTable, dmsTable } from '@workspace/db'
import { gte } from 'drizzle-orm'

const router: IRouter = Router()

const PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', connected: true, handle: '@yourhandle', followerCount: 4820 },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', connected: true, handle: '@yourhandle', followerCount: 12400 },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', connected: false, handle: null, followerCount: null },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', connected: false, handle: null, followerCount: null },
]

// GET /stats
router.get('/stats', async (req, res) => {
  try {
    const allPosts = await db.select().from(postsTable)
    const allDms = await db.select().from(dmsTable)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const totalScheduled = allPosts.filter((p) => p.status === 'scheduled').length
    const sentToday = allPosts.filter(
      (p) => p.status === 'sent' && p.sentAt && p.sentAt >= todayStart
    ).length
    const failedTotal = allPosts.filter((p) => p.status === 'failed').length
    const draftCount = allPosts.filter((p) => p.status === 'draft').length
    const dmScheduled = allDms.filter((d) => d.status === 'scheduled').length
    const dmSentToday = allDms.filter(
      (d) => d.status === 'sent' && d.sentAt && d.sentAt >= todayStart
    ).length

    const now = new Date()
    const upcomingCount = [
      ...allPosts.filter((p) => p.status === 'scheduled' && p.scheduledAt > now),
      ...allDms.filter((d) => d.status === 'scheduled' && d.scheduledAt > now),
    ].length

    // Platform breakdown from posts
    const platformMap: Record<string, number> = {}
    for (const post of allPosts) {
      const platforms = (post.platforms as string[]) ?? []
      for (const p of platforms) {
        platformMap[p] = (platformMap[p] ?? 0) + 1
      }
    }
    const platformBreakdown = Object.entries(platformMap).map(([platform, count]) => ({
      platform,
      count,
    }))

    res.json({
      totalScheduled,
      sentToday,
      failedTotal,
      draftCount,
      dmScheduled,
      dmSentToday,
      upcomingCount,
      platformBreakdown,
    })
  } catch (err) {
    req.log.error({ err }, 'getStats error')
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /calendar
router.get('/calendar', async (req, res) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string }
    const fromDate = from ? new Date(from) : new Date()
    const toDate = to ? new Date(to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const posts = await db.select().from(postsTable).where(gte(postsTable.scheduledAt, fromDate))
    const dms = await db.select().from(dmsTable).where(gte(dmsTable.scheduledAt, fromDate))

    const items = [
      ...posts
        .filter((p) => p.scheduledAt <= toDate)
        .map((p) => ({
          id: p.id,
          type: 'post' as const,
          title: (p.content ?? '').slice(0, 80),
          scheduledAt: p.scheduledAt.toISOString(),
          status: p.status,
          platforms: (p.platforms as string[]) ?? [],
        })),
      ...dms
        .filter((d) => d.scheduledAt <= toDate)
        .map((d) => ({
          id: d.id,
          type: 'dm' as const,
          title: (d.message ?? '').slice(0, 80),
          scheduledAt: d.scheduledAt.toISOString(),
          status: d.status,
          platforms: [d.platform],
        })),
    ].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

    res.json(items)
  } catch (err) {
    req.log.error({ err }, 'getCalendar error')
    res.status(500).json({ error: 'Failed to get calendar' })
  }
})

// GET /platforms
router.get('/platforms', async (_req, res) => {
  res.json(PLATFORMS)
})

export default router
