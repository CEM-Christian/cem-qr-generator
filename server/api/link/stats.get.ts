import type { H3Event } from 'h3'
import { z } from 'zod'

const LinkStatsQuerySchema = z.object({
  slug: z.string(),
})

const { select, eq } = SqlBricks

function query2sql(slug: string, event: H3Event): string {
  const { dataset } = useRuntimeConfig(event)
  const filter = eq(logsMap.slug!, slug)
  const sql = select('SUM(_sample_interval) as scans')
    .from(dataset)
    .where(filter)
  return sql.toString()
}

export default eventHandler(async (event) => {
  try {
    const { slug } = await getValidatedQuery(event, LinkStatsQuerySchema.parse)
    const sql = query2sql(slug, event)
    const result = await useWAE(event, sql) as any

    // Extract scan count from result
    const scans = result?.data?.[0]?.scans || 0

    return {
      slug,
      scans: Number(scans),
      lastUpdated: new Date().toISOString(),
    }
  }
  catch (error) {
    // Log error but don't throw - this allows graceful degradation
    console.error('Failed to fetch link stats:', error)

    // Return null to indicate stats are unavailable
    return null
  }
})
