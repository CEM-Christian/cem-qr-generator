import { z } from 'zod'
import { LinkSchema } from './link'
import { OrganizationSchema } from './organization'

/**
 * Editor-specific schema with nested UTM structure for form rendering
 * This schema transforms the flat link structure into a nested structure
 * that works better with AutoForm components
 */
export const LinkEditorFormSchema = z.object({
  name: LinkSchema.shape.name,
  url: LinkSchema.shape.url,
  slug: LinkSchema.shape.slug,
  organization: OrganizationSchema,
  utm: z.object({
    source: LinkSchema.shape.utm_source,
    medium: LinkSchema.shape.utm_medium,
    campaign: LinkSchema.shape.utm_campaign,
    id: LinkSchema.shape.utm_id,
  }).optional(),
  optional: z.object({
    comment: LinkSchema.shape.comment,
    expiration: z.coerce.date().optional(),
  }).optional(),
})

export type LinkEditorFormData = z.infer<typeof LinkEditorFormSchema>
