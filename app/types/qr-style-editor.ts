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
