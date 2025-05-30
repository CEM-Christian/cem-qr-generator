import type { LinkSchema } from '@/schemas/link'
import type { z } from 'zod'
import { parsePath, withQuery } from 'ufo'

export default eventHandler(async (event) => {
  // Extract the slug from the request path, removing leading and trailing slashes
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, ''))
  const { slugRegex, reserveSlug } = useAppConfig(event) // Get app-specific configurations
  const { homeURL, linkCacheTtl, redirectWithQuery, caseSensitive } = useRuntimeConfig(event) // Get runtime configurations
  const { cloudflare } = event.context // Access Cloudflare-specific bindings

  // Redirect to the home URL if the root path is accessed and homeURL is defined
  if (event.path === '/' && homeURL)
    return sendRedirect(event, homeURL)

  // Process the slug if it exists, is not reserved, matches the regex, and Cloudflare is available
  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug) && cloudflare) {
    const { KV } = cloudflare.env // Access the KV storage binding

    let link: z.infer<typeof LinkSchema> | null = null

    // Helper function to fetch a link from KV storage
    const getLink = async (key: string) =>
      await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

    const lowerCaseSlug = slug.toLowerCase() // Convert slug to lowercase for case-insensitive matching
    link = await getLink(caseSensitive ? slug : lowerCaseSlug)

    // Fallback to the original slug if case sensitivity is disabled and the lowercase slug is not found
    if (!caseSensitive && !link && lowerCaseSlug !== slug) {
      console.log('original slug fallback:', `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`)
      link = await getLink(slug)
    }

    if (link) {
      event.context.link = link // Attach the link to the event context for further processing
      try {
        await useAccessLog(event) // Log access to the link
      }
      catch (error) {
        console.error('Failed write access log:', error) // Handle logging errors gracefully
      }

      // Extract UTM parameters from the link metadata and append them to the target URL
      const { utm_source, utm_medium, utm_campaign, utm_id } = link
      const targetUrl = new URL(link.url)
      if (utm_source)
        targetUrl.searchParams.set('utm_source', utm_source)
      if (utm_medium)
        targetUrl.searchParams.set('utm_medium', utm_medium)
      if (utm_campaign)
        targetUrl.searchParams.set('utm_campaign', utm_campaign)
      if (utm_id)
        targetUrl.searchParams.set('utm_id', utm_id)

      // Redirect to the target URL, optionally including the query parameters from the original request
      const target = redirectWithQuery ? withQuery(targetUrl.toString(), getQuery(event)) : targetUrl.toString()
      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode)
    }
  }
})
