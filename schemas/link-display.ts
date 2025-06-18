import { z } from 'zod'

// Link display schema with proper typing - matches the original Link schema
export const linkDisplaySchema = z.object({
  id: z.string(),
  slug: z.string(),
  url: z.string().url(),
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  comment: z.string().optional(),
  organization: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_id: z.string().optional(),
  qr_style_options: z.record(z.any()).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  expiration: z.number().optional(),
  image: z.string().optional(),
})

export type LinkDisplayData = z.infer<typeof linkDisplaySchema>

// Layout type for link cards
export type LinkCardLayout = 'condensed' | 'qr-code'

// Action types for link operations
export type LinkUpdateType = 'edit' | 'delete' | 'create'

// Download options interface
export interface DownloadOptions {
  format: 'png' | 'jpeg' | 'webp' | 'svg'
  resolution: number
}

// QR operation interfaces
export interface QRDownloadConfig {
  data: string
  image: string
  link: LinkDisplayData
  format: 'png' | 'jpeg' | 'webp' | 'svg'
  resolution: number
}
