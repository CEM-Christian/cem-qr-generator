# Link Preview Feature Implementation

## Overview

The Link Preview feature provides real-time visual feedback to users when creating or editing links in the Editor dialog. It displays both the shortened link and the complete destination URL (with UTM parameters) as users modify form fields.

## Components

### 1. LinkPreview.vue
**Location**: `/app/components/dashboard/links/LinkPreview.vue`

A reactive preview component that displays:
- **Short Link**: Formatted as `{baseUrl}/{slug}`
- **Destination URL**: Original URL with appended UTM parameters
- **UTM Parameters**: Visual badges showing active parameters

#### Props
```typescript
interface Props {
  slug?: string // The slug for the short link
  url?: string // The destination URL
  utmParams?: Record<string, string> // UTM parameters object
  baseUrl?: string // Base URL (auto-detected if not provided)
  class?: string // Additional CSS classes
}
```

#### Features
- **Real-time Updates**: Reacts to form changes via computed properties
- **Copy Functionality**: Click-to-copy for both URLs with visual feedback
- **URL Truncation**: Handles long URLs gracefully
- **Accessibility**: Keyboard navigation and screen reader support
- **UTM Visualization**: Shows active UTM parameters as badges

### 2. useUtmBuilder Composable
**Location**: `/app/composables/useUtmBuilder.ts`

Utility functions for UTM parameter management:

```typescript
export function useUtmBuilder() {
  function buildUtmParams(params: UtmParams): Record<string, string>
  function buildUrlWithUtm(baseUrl: string, utmParams: Record<string, string>): string
  function extractUtmParams(url: string): Record<string, string>
  function validateUtmParams(params: Record<string, string>): boolean
}
```

## Integration

### Editor Component Updates
**Location**: `/app/components/dashboard/links/Editor.vue`

The LinkPreview component is integrated between the dialog header and form:

```vue
<DialogContent>
  <DialogHeader>...</DialogHeader>

  <!-- Link Preview Section -->
  <LinkPreview
    :slug="form.values.slug"
    :url="form.values.url"
    :utm-params="utmParams"
    :base-url="baseUrl"
    class="mb-4"
  />

  <AutoForm>...</AutoForm>
</DialogContent>
```

### Computed Properties
```typescript
const baseUrl = computed(() => {
  if (import.meta.server)
    return ''
  return window.location.origin
})

const utmParams = computed(() => {
  return buildUtmParams({
    utm_source: form.values.utm_source,
    utm_medium: form.values.utm_medium,
    utm_campaign: form.values.utm_campaign,
    utm_id: form.values.utm_id,
  })
})
```

## Internationalization

### Supported Languages
The feature includes translations for:
- English (en-US)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- German (de-DE)
- French (fr-FR)
- Vietnamese (vi-VN)

### Translation Keys
```json
{
  "links": {
    "preview": {
      "title": "Link Preview",
      "short_url": "Short Link",
      "destination_url": "Destination URL",
      "utm_parameters": "UTM Parameters",
      "copy_short": "Copy short link",
      "copy_destination": "Copy destination URL",
      "copy_short_success": "Short link copied to clipboard",
      "copy_destination_success": "Destination URL copied to clipboard",
      "open_destination": "Open destination URL in new tab"
    }
  }
}
```

## User Experience

### Visual Design
- **Container**: Subtle border and background to distinguish from form
- **Typography**: Clear labels and monospace font for URLs
- **Interactive Elements**: Hover states and visual feedback
- **Responsive**: Adapts to different screen sizes

### Copy Functionality
- **Click-to-Copy**: Both URLs are clickable for copying
- **Visual Feedback**: Copy icons change to check marks when copied
- **Toast Notifications**: Success messages for copy actions
- **Keyboard Support**: Enter and Space key support

### URL Handling
- **Truncation**: Long URLs are truncated with ellipsis
- **Tooltips**: Full URLs shown on hover
- **Error Handling**: Graceful fallback for invalid URLs
- **Parameter Filtering**: Only shows non-empty UTM parameters

## Technical Details

### Performance Considerations
- **Reactive Updates**: Uses Vue 3 computed properties for efficient reactivity
- **Debounced Copying**: 2-second timeout for copy state reset
- **Minimal Re-renders**: Only updates when relevant form values change

### Error Handling
- **Invalid URLs**: Graceful fallback to original URL string
- **Empty Values**: Handles undefined/null values appropriately
- **Server Rendering**: Handles SSR scenarios correctly

### Accessibility Features
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Tab-accessible copy buttons
- **Focus Management**: Logical tab order
- **Semantic HTML**: Proper use of buttons and interactive elements

## Testing

### Test Page
A dedicated test page is available at `/test-preview` for isolated component testing.

### Manual Testing Scenarios
1. **Real-time Updates**: Change form values and verify preview updates
2. **Copy Functionality**: Test copy buttons and keyboard shortcuts
3. **UTM Parameters**: Add/remove UTM values and verify display
4. **Long URLs**: Test with very long URLs to verify truncation
5. **Internationalization**: Switch languages to test translations

### Browser Compatibility
- Modern browsers with ES6+ support
- Vue 3 and Nuxt 3 compatibility requirements
- Clipboard API support for copy functionality

## Future Enhancements

### Potential Improvements
1. **QR Code Mini-Preview**: Small QR code thumbnail
2. **URL Validation Indicators**: Visual indicators for URL validity
3. **Character Counting**: Show character limits for UTM parameters
4. **Export Options**: Preview in different formats (Markdown, HTML)
5. **Link Testing**: Validate that links are reachable

### Performance Optimizations
1. **Debounced URL Building**: For rapid typing scenarios
2. **Lazy Loading**: Only render when dialog is open
3. **Memoization**: Cache URL building results

## Conclusion

The Link Preview feature significantly enhances the user experience by providing immediate visual feedback during link creation and editing. It follows Vue 3 best practices, includes comprehensive internationalization, and maintains high accessibility standards.
