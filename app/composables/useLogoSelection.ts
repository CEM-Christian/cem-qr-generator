import type { LogoOption } from '~/types/logo'

export function useLogoSelection() {
  // Available organization logos
  const availableLogos: LogoOption[] = [
    {
      id: 'acc',
      name: 'ACC',
      filename: 'acc.svg',
      type: 'svg',
      organization: 'ACC',
    },
    {
      id: 'bairnsdale',
      name: 'Bairnsdale',
      filename: 'bairnsdale.svg',
      type: 'svg',
      organization: 'Bairnsdale',
    },
    {
      id: 'brightwaters',
      name: 'Brightwaters',
      filename: 'brightwaters.png',
      type: 'png',
      organization: 'Brightwaters',
    },
    {
      id: 'cem',
      name: 'CEM',
      filename: 'cem.svg',
      type: 'svg',
      organization: 'CEM',
    },
    {
      id: 'heritage',
      name: 'Heritage',
      filename: 'heritage.png',
      type: 'png',
      organization: 'Heritage',
    },
    {
      id: 'medowie',
      name: 'Medowie',
      filename: 'medowie.svg',
      type: 'svg',
      organization: 'Medowie',
    },
    {
      id: 'smartplay',
      name: 'SmartPlay',
      filename: 'smartplay.png',
      type: 'png',
      organization: 'SmartPlay',
    },
    {
      id: 'swanhill',
      name: 'Swan Hill',
      filename: 'swanhill.png',
      type: 'png',
      organization: 'Swan Hill',
    },
  ]

  /**
   * Get logo URL by logo ID
   */
  const getLogoUrl = (logoId: string): string => {
    const logo = availableLogos.find(l => l.id === logoId)
    if (!logo)
      return ''

    // Return the logo asset URL
    return `/logos/${logo.filename}`
  }

  /**
   * Get logo option by ID
   */
  const getLogoById = (logoId: string): LogoOption | undefined => {
    return availableLogos.find(l => l.id === logoId)
  }

  /**
   * Get all available logos
   */
  const getAvailableLogos = (): LogoOption[] => {
    return [...availableLogos]
  }

  return {
    availableLogos,
    getLogoUrl,
    getLogoById,
    getAvailableLogos,
  }
}
