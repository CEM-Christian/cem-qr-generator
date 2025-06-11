/**
 * Composable for building and managing UTM parameters
 */
export function useUtmBuilder() {
  /**
   * Build UTM parameters object from form values
   */
  function buildUtmParams(params: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_id?: string
  }): Record<string, string> {
    const utmParams: Record<string, string> = {}

    if (params.utm_source?.trim()) {
      utmParams.utm_source = params.utm_source.trim()
    }

    if (params.utm_medium?.trim()) {
      utmParams.utm_medium = params.utm_medium.trim()
    }

    if (params.utm_campaign?.trim()) {
      utmParams.utm_campaign = params.utm_campaign.trim()
    }

    if (params.utm_id?.trim()) {
      utmParams.utm_id = params.utm_id.trim()
    }

    return utmParams
  }

  /**
   * Build a complete URL with UTM parameters
   */
  function buildUrlWithUtm(baseUrl: string, utmParams: Record<string, string>): string {
    if (!baseUrl)
      return ''

    try {
      const url = new URL(baseUrl)

      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          url.searchParams.set(key, value.trim())
        }
      })

      return url.toString()
    }
    catch {
      return baseUrl
    }
  }

  /**
   * Extract UTM parameters from a URL
   */
  function extractUtmParams(url: string): Record<string, string> {
    const utmParams: Record<string, string> = {}

    try {
      const urlObj = new URL(url)
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id']

      utmKeys.forEach((key) => {
        const value = urlObj.searchParams.get(key)
        if (value) {
          utmParams[key] = value
        }
      })
    }
    catch {
      // Invalid URL, return empty object
    }

    return utmParams
  }

  /**
   * Validate UTM parameter values
   */
  function validateUtmParams(params: Record<string, string>): boolean {
    const maxLength = 255

    return Object.entries(params).every(([_key, value]) => {
      if (!value)
        return true // Empty values are allowed

      // Check length
      if (value.length > maxLength)
        return false

      // Check for special characters that might break URLs
      // Allow alphanumeric, hyphens, underscores, dots, and spaces
      const validPattern = /^[\w\-.\s]+$/
      return validPattern.test(value)
    })
  }

  return {
    buildUtmParams,
    buildUrlWithUtm,
    extractUtmParams,
    validateUtmParams,
  }
}
