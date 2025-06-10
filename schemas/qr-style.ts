import { z } from 'zod'

// Common hex color regex pattern
const hexColorRegex = /^#[0-9a-f]{6}$/i

// Logo option schema for organization logos
export const LogoOptionSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  filename: z.string().trim().min(1),
  type: z.enum(['svg', 'png']),
  organization: z.string().trim().min(1),
})

// Logo type enumeration
export const LogoTypeSchema = z.enum(['favicon', 'organization', 'none'])

// Logo selection schema
export const LogoSelectionSchema = z.object({
  logoType: LogoTypeSchema.default('favicon'),
  selectedLogoId: z.string().trim().optional(),
})

// QR Style options schema with complete structure
export const QRStyleOptionsSchema = z.object({
  // Base style options that apply to all components
  baseOptions: z.object({
    color: z.string().regex(hexColorRegex).default('#000000'),
    type: z.enum(['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).default('square'),
  }).default({}),

  // Individual component overrides
  componentOverrides: z.object({
    dots: z.object({
      color: z.string().regex(hexColorRegex).optional(),
      type: z.enum(['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).optional(),
    }).optional(),
    cornerSquares: z.object({
      color: z.string().regex(hexColorRegex).optional(),
      type: z.enum(['dot', 'square', 'extra-rounded', 'rounded', 'dots', 'classy', 'classy-rounded']).optional(),
    }).optional(),
    cornerDots: z.object({
      color: z.string().regex(hexColorRegex).optional(),
      type: z.enum(['dot', 'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).optional(),
    }).optional(),
  }).default({}),

  // Legacy component options (maintained for backward compatibility)
  dotsOptions: z.object({
    color: z.string().regex(hexColorRegex).default('#000000'),
    type: z.enum(['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded']).default('square'),
    roundSize: z.boolean().default(true),
    gradient: z.object({
      type: z.enum(['linear', 'radial']).default('linear'),
      rotation: z.number().min(0).max(360).default(0),
      colorStops: z.array(z.object({
        offset: z.number().min(0).max(1),
        color: z.string().regex(hexColorRegex),
      })).min(2),
    }).optional(),
  }).default({}),
  backgroundOptions: z.object({
    color: z.string().regex(hexColorRegex).default('#ffffff'),
    gradient: z.object({
      type: z.enum(['linear', 'radial']).default('linear'),
      rotation: z.number().min(0).max(360).default(0),
      colorStops: z.array(z.object({
        offset: z.number().min(0).max(1),
        color: z.string().regex(hexColorRegex),
      })).min(2),
    }).optional(),
  }).default({}),
  cornersSquareOptions: z.object({
    color: z.string().regex(hexColorRegex).default('#000000'),
    type: z.enum(['dot', 'square', 'extra-rounded', 'rounded', 'dots', 'classy', 'classy-rounded']).optional(),
    gradient: z.object({
      type: z.enum(['linear', 'radial']).default('linear'),
      rotation: z.number().min(0).max(360).default(0),
      colorStops: z.array(z.object({
        offset: z.number().min(0).max(1),
        color: z.string().regex(hexColorRegex),
      })).min(2),
    }).optional(),
  }).default({}),
  cornersDotOptions: z.object({
    color: z.string().regex(hexColorRegex).default('#000000'),
    type: z.enum(['dot', 'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).optional(),
    gradient: z.object({
      type: z.enum(['linear', 'radial']).default('linear'),
      rotation: z.number().min(0).max(360).default(0),
      colorStops: z.array(z.object({
        offset: z.number().min(0).max(1),
        color: z.string().regex(hexColorRegex),
      })).min(2),
    }).optional(),
  }).default({}),
  imageOptions: z.object({
    hideBackgroundDots: z.boolean().default(true),
    imageSize: z.number().min(0).max(1).default(0.4),
    margin: z.number().min(0).max(50).default(2),
  }).default({}),

  // Logo selection for QR code images
  logoSelection: LogoSelectionSchema.default({}),
}).optional()

// Type exports for TypeScript
export type LogoOption = z.infer<typeof LogoOptionSchema>
export type LogoType = z.infer<typeof LogoTypeSchema>
export type LogoSelection = z.infer<typeof LogoSelectionSchema>
export type QRStyleOptions = z.infer<typeof QRStyleOptionsSchema>
