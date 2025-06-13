import type { OrganizationId } from '../../schemas/organization'

/**
 * Organization configuration for CEM QR Generator
 * Contains metadata for each organization including display names and logos
 */
export interface OrganizationConfig {
  id: OrganizationId
  name: string
  logo?: string
  initials: string
  color?: string
  description?: string
}

/**
 * Complete organization configuration mapping
 * Based on existing logo assets in public/logos/
 */
export const ORGANIZATIONS: Record<OrganizationId, OrganizationConfig> = {
  cem: {
    id: 'cem',
    name: 'Christian Education Ministries',
    logo: 'cem.svg',
    initials: 'CEM',
    color: '#1e40af',
    description: 'Christian Education Ministries',
  },
  acc: {
    id: 'acc',
    name: 'Australian Christian College',
    logo: 'acc.svg',
    initials: 'ACC',
    color: '#059669',
    description: 'Australian Christian College',
  },
  bairnsdale: {
    id: 'bairnsdale',
    name: 'Bairnsdale Christian College',
    logo: 'bairnsdale.svg',
    initials: 'BCC',
    color: '#dc2626',
    description: 'Bairnsdale Christian College',
  },
  brightwaters: {
    id: 'brightwaters',
    name: 'Brightwaters Christian College',
    logo: 'brightwaters.png',
    initials: 'BWCC',
    color: '#7c3aed',
    description: 'Brightwaters Christian College',
  },
  heritage: {
    id: 'heritage',
    name: 'Heritage Christian School',
    logo: 'heritage.png',
    initials: 'HCS',
    color: '#ea580c',
    description: 'Heritage Christian School',
  },
  medowie: {
    id: 'medowie',
    name: 'Medowie Christian School',
    logo: 'medowie.svg',
    initials: 'MCS',
    color: '#0891b2',
    description: 'Medowie Christian School',
  },
  smartplay: {
    id: 'smartplay',
    name: 'SmartPlay',
    logo: 'smartplay.png',
    initials: 'SP',
    color: '#65a30d',
    description: 'SmartPlay Educational Resources',
  },
  swanhill: {
    id: 'swanhill',
    name: 'Swan Hill Christian School',
    logo: 'swanhill.png',
    initials: 'SHCS',
    color: '#c2410c',
    description: 'Swan Hill Christian School',
  },
} as const

/**
 * Array of all organization configurations for easy iteration
 */
export const ORGANIZATION_LIST: OrganizationConfig[] = Object.values(ORGANIZATIONS)

/**
 * Get organization configuration by ID
 */
export function getOrganization(id: OrganizationId): OrganizationConfig | undefined {
  return ORGANIZATIONS[id]
}

/**
 * Get organization display name by ID
 */
export function getOrganizationName(id: OrganizationId): string {
  return ORGANIZATIONS[id]?.name || id
}

/**
 * Get organization logo path by ID
 */
export function getOrganizationLogo(id: OrganizationId): string {
  return `/logos/${ORGANIZATIONS[id]?.logo || 'cem.svg'}`
}
