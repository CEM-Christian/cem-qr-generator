/**
 * Data transformation utilities for converting between flat link data
 * and nested form data structures used in the link editor
 */

import type { LinkEditorFormData } from '@@/schemas/link-editor'

/**
 * Convert flat link data structure to nested form data structure
 */
export function linkFlatToNested(linkData: any): LinkEditorFormData {
  return {
    name: linkData.name,
    url: linkData.url,
    slug: linkData.slug,
    organization: linkData.organization || 'none',
    utm: {
      source: linkData.utm_source,
      medium: linkData.utm_medium,
      campaign: linkData.utm_campaign,
      id: linkData.utm_id,
    },
    optional: {
      comment: linkData.comment,
      expiration: linkData.expiration,
    },
  }
}

/**
 * Convert nested form data structure back to flat link data structure
 */
export function linkNestedToFlat(formData: LinkEditorFormData) {
  return {
    name: formData.name,
    url: formData.url,
    slug: formData.slug,
    organization: (formData.organization as any) === 'none' ? undefined : formData.organization,
    utm_source: formData.utm?.source,
    utm_medium: formData.utm?.medium,
    utm_campaign: formData.utm?.campaign,
    utm_id: formData.utm?.id,
    comment: formData.optional?.comment,
    expiration: formData.optional?.expiration,
  }
}
