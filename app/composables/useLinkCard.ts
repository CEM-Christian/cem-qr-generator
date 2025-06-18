import type { Link } from '@@/schemas/link'
import { formatLinkDescription, formatLinkDisplayName, formatLinkIcon, formatShortLink, hasUtmParameters } from '~/utils/link-formatter'

/**
 * Composable for link card display logic and computed properties
 */
export function useLinkCard(link: Ref<Link>) {
  const { getOrganizationById } = useOrganizations()
  const { host, origin } = location

  // Core display properties
  const shortLink = computed(() => formatShortLink(origin, link.value.slug))
  const linkIcon = computed(() => formatLinkIcon(link.value.url))
  const displayName = computed(() => formatLinkDisplayName(link.value, host))
  const description = computed(() => formatLinkDescription(link.value))

  // UTM and organization data
  const hasUtmParams = computed(() => hasUtmParameters(link.value))
  const organizationConfig = computed(() => {
    return link.value.organization ? getOrganizationById(link.value.organization) : null
  })

  // Link to detail page
  const detailPageLink = computed(() => `/dashboard/link?slug=${link.value.slug}`)

  return {
    shortLink,
    linkIcon,
    displayName,
    description,
    hasUtmParams,
    organizationConfig,
    detailPageLink,
  }
}
