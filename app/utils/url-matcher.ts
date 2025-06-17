import type { OrganizationId } from '../../schemas/organization'
import type { OrganizationUrlPatterns } from '~/config/organizations'
import { ORGANIZATIONS } from '~/config/organizations'

/**
 * Represents a URL match result with organization ID and matching specificity
 */
interface UrlMatchResult {
  organizationId: OrganizationId
  specificity: number // Higher number = more specific match
}

/**
 * Extract domain and path from a URL string
 * Handles both protocol and non-protocol URLs
 */
function parseUrlComponents(url: string): { domain: string, path: string } | null {
  try {
    // Add protocol if missing
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`

    const parsed = new URL(urlWithProtocol)

    return {
      domain: parsed.hostname.toLowerCase(),
      path: parsed.pathname.toLowerCase(),
    }
  }
  catch (error) {
    console.warn('Failed to parse URL:', url, error)
    return null
  }
}

/**
 * Check if a domain matches the specified pattern
 * Handles www prefix normalization
 */
function matchesDomain(domain: string, pattern: string): boolean {
  const normalizedDomain = domain.replace(/^www\./, '')
  const normalizedPattern = pattern.toLowerCase().replace(/^www\./, '')

  return normalizedDomain === normalizedPattern || domain === pattern.toLowerCase()
}

/**
 * Check if a path matches the specified pattern
 * Returns the length of the match for specificity calculation
 */
function matchesPath(path: string, pattern: string): number {
  const normalizedPattern = pattern.toLowerCase()

  // Check if path starts with the pattern
  if (path.startsWith(normalizedPattern)) {
    return normalizedPattern.length
  }

  return 0
}

/**
 * Calculate specificity score for a match
 * Higher score = more specific match
 */
function calculateSpecificity(domainMatch: boolean, pathMatchLength: number): number {
  let score = 0

  if (domainMatch) {
    score += 100 // Base score for domain match
  }

  if (pathMatchLength > 0) {
    score += pathMatchLength * 10 // Path specificity bonus
  }

  return score
}

/**
 * Match a URL against organization URL patterns
 * Returns the organization ID with the highest specificity match, or null if no match
 */
export function matchUrlToOrganization(url: string): OrganizationId | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  const urlComponents = parseUrlComponents(url)
  if (!urlComponents) {
    return null
  }

  const { domain, path } = urlComponents
  const matches: UrlMatchResult[] = []

  // Check each organization's URL patterns
  for (const [orgId, config] of Object.entries(ORGANIZATIONS)) {
    const patterns = config.urlPatterns
    if (!patterns || !patterns.domain) {
      continue
    }

    // Check domain match
    const domainMatches = matchesDomain(domain, patterns.domain)
    if (!domainMatches) {
      continue
    }

    // Check path match (if pattern exists)
    let pathMatchLength = 0
    if (patterns.path) {
      pathMatchLength = matchesPath(path, patterns.path)

      // For organizations with path patterns, require path match
      if (pathMatchLength === 0) {
        continue
      }
    }

    // Calculate specificity and add to matches
    const specificity = calculateSpecificity(domainMatches, pathMatchLength)
    matches.push({
      organizationId: orgId as OrganizationId,
      specificity,
    })
  }

  // Return the most specific match
  if (matches.length === 0) {
    return null
  }

  // Sort by specificity (highest first) and return the best match
  matches.sort((a, b) => b.specificity - a.specificity)
  return matches[0]?.organizationId || null
}

/**
 * Get all organizations that have URL patterns configured
 */
export function getOrganizationsWithUrlPatterns(): OrganizationId[] {
  return Object.entries(ORGANIZATIONS)
    .filter(([_, config]) => config.urlPatterns?.domain)
    .map(([orgId]) => orgId as OrganizationId)
}

/**
 * Validate URL patterns for an organization
 * Returns true if patterns are valid
 */
export function validateUrlPatterns(patterns: OrganizationUrlPatterns): boolean {
  if (!patterns.domain) {
    return false
  }

  // Validate domain pattern
  if (!patterns.domain || typeof patterns.domain !== 'string' || patterns.domain.includes('://')) {
    return false
  }

  // Validate path pattern (if present)
  if (patterns.path) {
    if (!patterns.path || typeof patterns.path !== 'string' || !patterns.path.startsWith('/')) {
      return false
    }
  }

  return true
}
