export interface LogoOption {
  id: string
  name: string
  filename: string
  type: 'svg' | 'png'
  organization: string
}

export type LogoType = 'favicon' | 'organization' | 'none'

export interface LogoSelection {
  logoType: LogoType
  selectedLogoId?: string
}
