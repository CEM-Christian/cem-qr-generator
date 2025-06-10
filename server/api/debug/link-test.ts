import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'
import { getAccessLog, logs2blobs, logs2doubles } from '../../utils/access-log'

type Link = z.infer<typeof LinkSchema>

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const testSlug = query.slug as string
  
  if (!testSlug) {
    return { error: 'Please provide a slug parameter: ?slug=your-test-slug' }
  }
  
  console.log('🔗 [LINK-TEST] Testing slug:', testSlug)
  
  try {
    // Test KV retrieval
    const link = await useStorage('kv').getItem<Link>(`link:${testSlug}`)
    
    if (!link) {
      return {
        success: false,
        error: 'Link not found in KV storage',
        slug: testSlug,
        kvKey: `link:${testSlug}`
      }
    }
    
    // Simulate access log generation
    const mockEvent = {
      node: {
        req: {
          url: `/${testSlug}`,
          headers: {
            'user-agent': 'Debug-Test-Agent/1.0',
            'referer': 'https://debug-test.com'
          }
        }
      },
      context: { 
        link,
        cloudflare: {
          request: {
            cf: {
              country: 'US',
              region: 'California',
              city: 'San Francisco',
              timezone: 'America/Los_Angeles',
              colo: 'SFO',
              latitude: '37.7749',
              longitude: '-122.4194'
            }
          }
        }
      }
    } as any
    
    const accessLogs = getAccessLog(mockEvent)
    
    return {
      success: true,
      link: {
        id: link.id,
        slug: link.slug,
        url: link.url
      },
      accessLogs,
      analyticsData: {
        indexes: [link.id],
        blobs: logs2blobs(accessLogs),
        doubles: logs2doubles(accessLogs)
      },
      environment: {
        isProduction: process.env.NODE_ENV === 'production',
        dataset: useRuntimeConfig().dataset
      }
    }
  }
  catch (error: any) {
    console.error('❌ [LINK-TEST] Error:', error)
    return {
      success: false,
      error: error.message,
      slug: testSlug
    }
  }
})
