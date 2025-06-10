---
applyTo: "**/*qr*/**/*.{vue,ts}"
---

# QR Code Feature Instructions

## QR Code Generation Patterns
Follow these patterns when working with QR code functionality:

```typescript
// QR Code Options Interface
interface QRCodeOptions {
  width: number
  height: number
  data: string
  margin: number
  qrOptions: {
    typeNumber: string
    mode: string
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  }
  imageOptions?: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
    crossOrigin?: string
  }
  dotsOptions: {
    color: string
    type: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'
    gradient?: GradientOptions
  }
  cornersSquareOptions: {
    color: string
    type?: 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded'
    gradient?: GradientOptions
  }
  cornersDotOptions: {
    color: string
    type?: 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'
    gradient?: GradientOptions
  }
  backgroundOptions: {
    color: string
    gradient?: GradientOptions
  }
}
```

## QR Style Management
- Use the established style override system with `componentOverrides`
- Implement proper base style inheritance and customization
- Provide reset functionality to revert to base styles
- Handle gradient options for advanced styling
- Support real-time preview updates

## Component Architecture
- Separate QR generation logic from UI components
- Use composables for QR code state management
- Implement proper error handling for QR generation failures
- Provide loading states during QR code generation
- Support different output formats (SVG, Canvas, PNG)

## Style Editor Patterns
```vue
<template>
  <div class="qr-style-section">
    <!-- Color picker with preview -->
    <div class="color-input-group">
      <div 
        class="color-preview"
        :style="{ backgroundColor: effectiveColor }"
        @click="openColorPicker"
      />
      <Input 
        :model-value="effectiveColor"
        @update:model-value="handleColorChange"
        placeholder="#000000"
      />
      <Button
        v-if="!isUsingBaseStyle"
        variant="outline"
        size="sm"
        @click="resetToBaseStyle"
      >
        Apply Base
      </Button>
    </div>

    <!-- Type selector -->
    <Select 
      :model-value="effectiveType" 
      @update:model-value="handleTypeChange"
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem 
          v-for="type in availableTypes" 
          :key="type.value" 
          :value="type.value"
        >
          {{ $t(`qr_style_editor.types.${type.label}`) }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
```

## QR Code Integration Best Practices
- Use the `qr-code-styling` library for advanced styling options
- Implement proper error correction level selection
- Support custom logos/images in QR codes
- Provide download functionality for different formats
- Handle edge cases like very long URLs
- Implement QR code validation and testing

## Performance Considerations
- Debounce style changes to avoid excessive re-rendering
- Use canvas for better performance with large QR codes
- Implement lazy loading for QR code previews
- Cache generated QR codes when appropriate
- Optimize image compression for downloads

## Accessibility for QR Codes
- Provide alt text describing the QR code content
- Include fallback text with the actual URL
- Ensure sufficient contrast in QR code colors
- Support keyboard navigation for style controls
- Provide screen reader friendly descriptions
