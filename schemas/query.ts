import { z } from 'zod'

const listQueryLimit = +useRuntimeConfig().listQueryLimit

export const QuerySchema = z.object({
  id: z.string().optional(),
  startAt: z.coerce.number().int().safe().optional(),
  endAt: z.coerce.number().int().safe().optional(),
  url: z.string().optional(),
  slug: z.string().optional(),
  referer: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  browserType: z.string().optional(),
  device: z.string().optional(),
  deviceType: z.string().optional(),
  limit: z.coerce.number().int().safe().default(listQueryLimit),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_id: z.string().optional(),
})

// export const FilterSchema = QuerySchema.omit({ id: true, startAt: true, endAt: true, limit: true }).extend({
//   index1: z.string().optional(),
// })
