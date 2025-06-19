import type { Link } from '@@/schemas/link'
import type {
  EffectiveColors,
  QRCodeGenerationOptions,
  QRStyleOptions,
} from '@@/schemas/qr-style'

// Re-export types from schemas for consistency
export type { EffectiveColors, QRCodeGenerationOptions, QRStyleOptions }

export interface QRStyleEditorProps {
  open: boolean
  data: string
  image: string
  initialOptions: Partial<QRStyleOptions>
  link: Link
}

export interface QRStyleEditorEmits {
  'update:open': [open: boolean]
  'save': [link: Link]
}

export type QRComponentType = 'dots' | 'cornerSquares' | 'cornerDots'
export type QRStyleProperty = 'color' | 'type'

// Legacy interface - use QRCodeGenerationOptions from schemas instead
// @deprecated Use QRCodeGenerationOptions from schemas/qr-style.ts
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
