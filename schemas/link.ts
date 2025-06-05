import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const { slugRegex } = useAppConfig()

const slugDefaultLength = +useRuntimeConfig().public.slugDefaultLength

export const nanoid = (length: number = slugDefaultLength) => customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', length)

export const LinkSchema = z.object({
  id: z.string().trim().max(26).default(nanoid(10)),
  url: z.string().trim().url().max(2048),
  slug: z.string().trim().max(2048).regex(new RegExp(slugRegex)).default(nanoid()),
  name: z.string().trim().max(100).optional(),
  comment: z.string().trim().max(2048).optional(),
  createdAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  updatedAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  expiration: z.number().int().safe().refine(expiration => expiration > Math.floor(Date.now() / 1000), {
    message: 'expiration must be greater than current time',
    path: ['expiration'], // 这里指定错误消息关联到哪个字段
  }).optional(),
  title: z.string().trim().max(2048).optional(),
  description: z.string().trim().max(2048).optional(),
  image: z.string().trim().url().max(2048).optional(),
  utm_source: z.string().trim().max(255).optional(),
  utm_medium: z.string().trim().max(255).optional(),
  utm_campaign: z.string().trim().max(255).optional(),
  utm_id: z.string().trim().max(255).optional(),
  qr_style_options: z.object({
    dotsOptions: z.object({
      color: z.string().default('#000000'),
      type: z.enum(['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded']).default('square'),
      roundSize: z.boolean().default(true),
      gradient: z.object({
        type: z.enum(['linear', 'radial']).default('linear'),
        rotation: z.number().default(0),
        colorStops: z.array(z.object({
          offset: z.number().min(0).max(1),
          color: z.string(),
        })),
      }).optional(),
    }).default({}),
    backgroundOptions: z.object({
      color: z.string().default('#ffffff'),
      gradient: z.object({
        type: z.enum(['linear', 'radial']).default('linear'),
        rotation: z.number().default(0),
        colorStops: z.array(z.object({
          offset: z.number().min(0).max(1),
          color: z.string(),
        })),
      }).optional(),
    }).default({}),
    cornersSquareOptions: z.object({
      color: z.string().default('#000000'),
      type: z.enum(['dot', 'square', 'extra-rounded', 'rounded', 'dots', 'classy', 'classy-rounded']).optional(),
      gradient: z.object({
        type: z.enum(['linear', 'radial']).default('linear'),
        rotation: z.number().default(0),
        colorStops: z.array(z.object({
          offset: z.number().min(0).max(1),
          color: z.string(),
        })),
      }).optional(),
    }).default({}),
    cornersDotOptions: z.object({
      color: z.string().default('#000000'),
      type: z.enum(['dot', 'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).optional(),
      gradient: z.object({
        type: z.enum(['linear', 'radial']).default('linear'),
        rotation: z.number().default(0),
        colorStops: z.array(z.object({
          offset: z.number().min(0).max(1),
          color: z.string(),
        })),
      }).optional(),
    }).default({}),
    imageOptions: z.object({
      hideBackgroundDots: z.boolean().default(true),
      imageSize: z.number().min(0).max(1).default(0.4),
      margin: z.number().min(0).default(2),
    }).default({}),
  }).optional(),
})
