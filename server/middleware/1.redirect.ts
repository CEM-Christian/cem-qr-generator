import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'
import { parsePath, withQuery } from 'ufo'

export default eventHandler(async (event) => {
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, '')) // remove leading and trailing slashes
  const { slugRegex, reserveSlug } = useAppConfig(event)
  const { homeURL, linkCacheTtl, redirectWithQuery, caseSensitive } = useRuntimeConfig(event)
  const { cloudflare } = event.context

  console.log('🌐 [REDIRECT] Processing request:', {
    path: event.path,
    pathname: slug,
    userAgent: getHeader(event, 'user-agent'),
    referer: getHeader(event, 'referer')
  })

  if (event.path === '/' && homeURL) {
    console.log('🏠 [REDIRECT] Redirecting to home URL:', homeURL)
    return sendRedirect(event, homeURL)
  }

  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug) && cloudflare) {
    console.log('🔍 [REDIRECT] Valid slug detected, looking up link:', slug)
    const { KV } = cloudflare.env

    let link: z.infer<typeof LinkSchema> | null = null

    const getLink = async (key: string) =>
      await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

    const lowerCaseSlug = slug.toLowerCase()
    link = await getLink(caseSensitive ? slug : lowerCaseSlug)

    // fallback to original slug if caseSensitive is false and the slug is not found
    if (!caseSensitive && !link && lowerCaseSlug !== slug) {
      console.log('🔄 [REDIRECT] Case-insensitive fallback:', `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`)
      link = await getLink(slug)
    }

    console.log('🔍 [REDIRECT] Database lookup result:', {
      slug,
      found: !!link,
      linkId: link?.id,
      linkUrl: link?.url
    })

    if (link) {
      event.context.link = link
      console.log('📊 [REDIRECT] Attempting to log access...')
      
      try {
        await useAccessLog(event)
        console.log('✅ [REDIRECT] Access log completed successfully')
      }
      catch (logError: any) {
        console.error('❌ [REDIRECT] Access log failed:', {
          error: logError.message,
          stack: logError.stack,
          linkSlug: link.slug,
          linkId: link.id
        })
        // Don't block redirect on logging failure
      }

      // Build UTM parameters from the link
      const utmParams: Record<string, string> = {}
      if (link.utm_source)
        utmParams.utm_source = link.utm_source
      if (link.utm_medium)
        utmParams.utm_medium = link.utm_medium
      if (link.utm_campaign)
        utmParams.utm_campaign = link.utm_campaign
      if (link.utm_id)
        utmParams.utm_id = link.utm_id

      // Combine query parameters and UTM parameters
      const queryParams = redirectWithQuery ? getQuery(event) : {}
      const allParams = { ...queryParams, ...utmParams }

      const target = Object.keys(allParams).length > 0 ? withQuery(link.url, allParams) : link.url
      
      console.log('↪️ [REDIRECT] Redirecting to:', target)
      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode)
    }
    else {
      console.log('🚫 [REDIRECT] Link not found for slug:', slug)
    }
  }
  else {
    console.log('📍 [REDIRECT] Skipping - invalid slug or no cloudflare context:', {
      slug,
      hasCloudflare: !!cloudflare,
      isReserved: reserveSlug.includes(slug),
      matchesRegex: slugRegex.test(slug)
    })
  }
})
