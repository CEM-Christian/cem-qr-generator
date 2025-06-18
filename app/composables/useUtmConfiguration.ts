/**
 * UTM configuration and options for link tracking
 */

export interface SelectOption {
  value: string
  label: string
}

export const utmSourceOptions: SelectOption[] = [
  { value: 'qr-code', label: 'QR Code' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'google', label: 'Google Search' },
  { value: 'bing', label: 'Bing Search' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'email', label: 'Email' },
]

export const utmMediumOptions: SelectOption[] = [
  { value: 'flyer', label: 'Flyer' },
  { value: 'poster', label: 'Poster' },
  { value: 'banner', label: 'Banner' },
  { value: 'e-guide', label: 'E-Guide' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'website', label: 'Website' },
]

/**
 * Composable for UTM configuration
 */
export function useUtmConfiguration() {
  const { t } = useI18n()

  const utmFieldConfig = computed(() => ({
    source: {
      label: t('links.form.utm.source.label'),
      options: utmSourceOptions,
    },
    medium: {
      label: t('links.form.utm.medium.label'),
      options: utmMediumOptions,
    },
    campaign: {
      label: t('links.form.utm.campaign.label'),
      description: t('links.form.utm.campaign.description'),
      placeholder: 'Enter campaign name',
      options: ['Excelencia-Live', 'Kindy-Open-Day', 'Principals-Tour'],
    },
    id: {
      label: t('links.form.utm.id.label'),
      description: t('links.form.utm.id.description'),
      placeholder: 'Enter campaign ID',
      options: ['Excelencia-Live-07-25', 'Kindy-Open-Day-11-24', 'Principals-Tour-01-25'],
    },
  }))

  return {
    utmSourceOptions,
    utmMediumOptions,
    utmFieldConfig,
  }
}
