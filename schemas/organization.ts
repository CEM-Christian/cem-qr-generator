import { z } from 'zod'

/**
 * Organization schema for CEM QR Generator
 * Based on existing logo assets in public/logos/
 */
export const OrganizationSchema = z.enum([
  'cem',
  'acc',
  'bairnsdale',
  'brightwaters',
  'heritage',
  'medowie',
  'smartplay',
  'swanhill',
]).optional()

export type Organization = z.infer<typeof OrganizationSchema>

/**
 * Organization identifiers as a const array for type-safe iteration
 */
export const ORGANIZATION_IDS = [
  'cem',
  'acc',
  'bairnsdale',
  'brightwaters',
  'heritage',
  'medowie',
  'smartplay',
  'swanhill',
] as const

export type OrganizationId = typeof ORGANIZATION_IDS[number]
