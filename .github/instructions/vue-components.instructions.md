---
applyTo: "**/*.vue"
---

# Vue.js Component Instructions

## Component Structure
Always follow this exact structure for Vue components:

```vue
<script setup lang="ts">
import { /* only external imports */ } from 'packages'
// Props interface (if needed)
interface Props {
  // Define props with proper types
}

// Props definition
const props = defineProps<Props>()

// Emits definition (if needed)
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Composables and reactive state
const { t } = useI18n()
// Other composables...

// Reactive state
const isOpen = ref(false)
// Other reactive state...

// Computed properties
const computedValue = computed(() => {
  // Logic here
})

// Methods
function handleAction() {
  // Method logic
}

// Lifecycle hooks (if needed)
onMounted(() => {
  // Initialization logic
})
</script>

<template>
  <!-- Use semantic HTML with proper accessibility -->
  <div>
    <!-- Always use $t() for internationalization -->
    <h1>{{ $t('component.title') }}</h1>
    
    <!-- Use v-bind and v-on shorthand -->
    <Button 
      :disabled="isLoading"
      @click="handleAction"
    >
      {{ $t('common.submit') }}
    </Button>
  </div>
</template>

<style scoped>
/* Use TailwindCSS classes instead of custom CSS when possible */
/* Only add custom styles when absolutely necessary */
</style>
```

## Component Best Practices
- Use `<script setup lang="ts">` for all components
- Define proper TypeScript interfaces for props
- Use auto-imported composables (ref, computed, watch, etc.)
- Always use `$t()` for user-facing text
- Implement proper accessibility (ARIA labels, semantic HTML)
- Use Radix Vue primitives for complex interactive components
- Follow the compound component pattern for complex UI

## Props and Events
- Always type props with interfaces
- Use `defineEmits` with proper TypeScript signatures
- Follow Vue 3 naming conventions for events (kebab-case in templates)
- Use `v-model` pattern for two-way binding when appropriate

## Template Guidelines
- Use semantic HTML elements (button, form, input, etc.)
- Add proper ARIA attributes for accessibility
- Use conditional rendering with v-if/v-show appropriately
- Keep templates clean and readable
- Use component composition over deep nesting

## Styling
- Prefer TailwindCSS utility classes
- Use `cn()` utility for conditional classes
- Follow the existing design system patterns
- Use CSS custom properties for theming when needed
- Avoid inline styles unless absolutely necessary
