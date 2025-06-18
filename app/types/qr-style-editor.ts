export interface QRStyleOptions {
  // Base style options that apply to all components
  baseOptions: {
    color: string
    type: string
  }
  // Individual component overrides
  componentOverrides: {
    dots: Record<string, any>
    cornerSquares: Record<string, any>
    cornerDots: Record<string, any>
  }
  // Legacy component options (maintained for backward compatibility)
  dotsOptions: {
    color: string
    type: string
    roundSize: boolean
  }
  backgroundOptions: {
    color: string
  }
  cornersSquareOptions: {
    color: string
    type: string
  }
  cornersDotOptions: {
    color: string
    type: string
  }
  imageOptions: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
  }
  logoSelection: {
    logoType: 'favicon' | 'organization' | 'none'
    selectedLogoId?: string
  }
}

export interface QRStyleEditorProps {
  open: boolean
  data: string
  image: string
  initialOptions: Partial<QRStyleOptions>
  link: Record<string, any>
}

export interface QRStyleEditorEmits {
  'update:open': [open: boolean]
  'save': [link: Record<string, any>]
}

export type QRComponentType = 'dots' | 'cornerSquares' | 'cornerDots'
export type QRStyleProperty = 'color' | 'type'

export interface QRCodeOptions {
  width: number
  height: number
  data: string
  margin: number
  qrOptions: {
    typeNumber: number
    mode: string
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  }
  image?: string
  dotsOptions: {
    color: string
    type: string
    roundSize: boolean
  }
  cornersSquareOptions: {
    color: string
    type: string
  }
  cornersDotOptions: {
    color: string
    type: string
  }
  backgroundOptions: {
    color: string
  }
  imageOptions: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
    crossOrigin?: string
  }
}
