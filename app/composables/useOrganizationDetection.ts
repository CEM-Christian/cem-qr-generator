import type { OrganizationId } from '../../schemas/organization'
import { useDebounceFn } from '@vueuse/core'
import { matchUrlToOrganization } from '~/utils/url-matcher'

/**
 * Configuration options for organization detection
 */
interface OrganizationDetectionOptions {
  debounceMs?: number
  enableAutoDetection?: boolean
  enableLogoAutoSelection?: boolean
  onDetection?: (organizationId: OrganizationId | null, url: string) => void
  onLogoDetection?: (logoId: string | null, organizationId: OrganizationId | null) => void
}

/**
 * Composable for automatic organization detection from URLs
 * Provides reactive URL detection with debouncing and manual override support
 */
export function useOrganizationDetection(options: OrganizationDetectionOptions = {}) {
  const {
    debounceMs = 500,
    enableAutoDetection = true,
    enableLogoAutoSelection = true,
    onDetection,
    onLogoDetection,
  } = options

  // Reactive state
  const currentUrl = ref('')
  const detectedOrganization = ref<OrganizationId | null>(null)
  const detectedLogoId = ref<string | null>(null)
  const isDetecting = ref(false)
  const lastDetectedUrl = ref('')
  const manualOverride = ref(false)

  /**
   * Map organization ID to corresponding logo ID for auto-selection
   * This mapping ensures the correct logo is selected when an organization is detected
   */
  function getLogoIdForOrganization(organizationId: OrganizationId): string | null {
    // Logo IDs that match organization IDs directly
    const directMappings: Record<string, string> = {
      'acc': 'acc',
      'acc-moreton': 'acc', // All ACC sub-organizations use the main ACC logo
      'acc-southlands': 'acc',
      'acc-benalla': 'acc',
      'acc-burnie': 'acc',
      'acc-casey': 'acc',
      'acc-darlingdowns': 'acc',
      'acc-echuca': 'acc',
      'acc-hobart': 'acc',
      'acc-launceston': 'acc',
      'acc-marsdenpark': 'acc',
      'acc-singleton': 'acc',
      'cem': 'cem',
      'bairnsdale': 'bairnsdale',
      'brightwaters': 'brightwaters',
      'heritage': 'heritage',
      'medowie': 'medowie',
      'smartplay': 'smartplay',
      'swanhill': 'swanhill',
    }

    return directMappings[organizationId] || null
  }

  /**
   * Detect organization from URL with debouncing
   */
  const detectOrganization = useDebounceFn(async (url: string) => {
    if (!enableAutoDetection || !url || manualOverride.value) {
      return
    }

    isDetecting.value = true

    try {
      const organizationId = matchUrlToOrganization(url)

      // Only update if URL has changed or detection result is different
      if (url !== lastDetectedUrl.value || organizationId !== detectedOrganization.value) {
        detectedOrganization.value = organizationId
        lastDetectedUrl.value = url

        // Auto-detect logo if enabled and organization is found
        if (enableLogoAutoSelection && organizationId) {
          const logoId = getLogoIdForOrganization(organizationId)
          detectedLogoId.value = logoId

          // Trigger logo detection callback
          if (onLogoDetection) {
            onLogoDetection(logoId, organizationId)
          }
        }
        else {
          detectedLogoId.value = null
          if (onLogoDetection) {
            onLogoDetection(null, organizationId)
          }
        }

        // Trigger organization callback if provided
        if (onDetection) {
          onDetection(organizationId, url)
        }

        console.debug('Organization detected:', { url, organizationId, logoId: detectedLogoId.value })
      }
    }
    catch (error) {
      console.error('Organization detection failed:', error)
      detectedOrganization.value = null
      detectedLogoId.value = null
    }
    finally {
      isDetecting.value = false
    }
  }, debounceMs)

  /**
   * Process URL change and trigger detection
   */
  const processUrl = (url: string) => {
    currentUrl.value = url

    if (!url || url.trim() === '') {
      detectedOrganization.value = null
      lastDetectedUrl.value = ''
      return
    }

    detectOrganization(url)
  }

  /**
   * Reset detection state and clear manual override
   */
  const reset = () => {
    currentUrl.value = ''
    detectedOrganization.value = null
    detectedLogoId.value = null
    lastDetectedUrl.value = ''
    manualOverride.value = false
    isDetecting.value = false
  }

  /**
   * Enable manual override (disables auto-detection)
   */
  const enableManualOverride = () => {
    manualOverride.value = true
    console.debug('Manual organization override enabled')
  }

  /**
   * Disable manual override (re-enables auto-detection)
   */
  const disableManualOverride = () => {
    manualOverride.value = false
    // Re-trigger detection if URL exists
    if (currentUrl.value) {
      detectOrganization(currentUrl.value)
    }
    console.debug('Manual organization override disabled')
  }

  /**
   * Force immediate detection without debouncing
   */
  const forceDetection = (url?: string) => {
    const targetUrl = url || currentUrl.value
    if (!targetUrl || manualOverride.value) {
      return
    }

    isDetecting.value = true

    try {
      const organizationId = matchUrlToOrganization(targetUrl)
      detectedOrganization.value = organizationId
      lastDetectedUrl.value = targetUrl

      // Auto-detect logo if enabled and organization is found
      if (enableLogoAutoSelection && organizationId) {
        const logoId = getLogoIdForOrganization(organizationId)
        detectedLogoId.value = logoId

        if (onLogoDetection) {
          onLogoDetection(logoId, organizationId)
        }
      }
      else {
        detectedLogoId.value = null
        if (onLogoDetection) {
          onLogoDetection(null, organizationId)
        }
      }

      if (onDetection) {
        onDetection(organizationId, targetUrl)
      }
    }
    catch (error) {
      console.error('Force detection failed:', error)
    }
    finally {
      isDetecting.value = false
    }
  }

  // Computed properties for convenience
  const hasDetection = computed(() => detectedOrganization.value !== null)
  const hasLogoDetection = computed(() => detectedLogoId.value !== null)
  const isAutoDetectionEnabled = computed(() => enableAutoDetection && !manualOverride.value)

  return {
    // State
    currentUrl: readonly(currentUrl),
    detectedOrganization: readonly(detectedOrganization),
    detectedLogoId: readonly(detectedLogoId),
    isDetecting: readonly(isDetecting),
    manualOverride: readonly(manualOverride),

    // Computed
    hasDetection,
    hasLogoDetection,
    isAutoDetectionEnabled,

    // Methods
    processUrl,
    reset,
    enableManualOverride,
    disableManualOverride,
    forceDetection,
  }
}
