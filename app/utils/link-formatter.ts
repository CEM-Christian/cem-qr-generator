import type { Link } from '@@/schemas/link'
import { parseURL } from 'ufo'

/**
 * Get the host from a URL for favicon purposes
 */
export function getLinkHost(url: string): string | undefined {
  const { host } = parseURL(url)
  return host
}

/**
 * Generate a short link URL from origin and slug
 */
export function formatShortLink(origin: string, slug: string): string {
  return `${origin}/${slug}`
}

/**
 * Generate link icon URL using unavatar service
 */
export function formatLinkIcon(url: string): string {
  const host = getLinkHost(url)
  return `https://unavatar.io/${host}?fallback=https://sink.cool/icon.png`
}

/**
 * Get display name for a link (name or fallback to host/slug)
 */
export function formatLinkDisplayName(link: Link, host: string): string {
  return link.name || `${host}/${link.slug}`
}

/**
 * Get the primary description/comment text for a link
 */
export function formatLinkDescription(link: Link): string | undefined {
  return link.comment || link.title || link.description
}

/**
 * Check if link has UTM parameters
 */
export function hasUtmParameters(link: Link): boolean {
  return !!(link.utm_source || link.utm_medium || link.utm_campaign || link.utm_id)
}

/**
 * Format UTM parameters for display in tooltip
 */
export function formatUtmTooltip(link: Link): Array<{ label: string, value: string }> {
  const params = []

  if (link.utm_source) {
    params.push({ label: 'Source', value: link.utm_source })
  }
  if (link.utm_medium) {
    params.push({ label: 'Medium', value: link.utm_medium })
  }
  if (link.utm_campaign) {
    params.push({ label: 'Campaign', value: link.utm_campaign })
  }
  if (link.utm_id) {
    params.push({ label: 'ID', value: link.utm_id })
  }

  return params
}
