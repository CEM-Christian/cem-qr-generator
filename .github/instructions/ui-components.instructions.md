---
applyTo: "app/components/ui/**/*.vue"
---

# UI Component Instructions

## Radix Vue + shadcn/ui Pattern
Follow this exact pattern for all UI components:

```vue
<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { 
  RadixComponent, 
  type RadixComponentProps, 
  useForwardProps 
} from 'radix-vue'
import { cn } from '@/utils'

// Define component props extending Radix props
const props = defineProps<RadixComponentProps & { 
  class?: HTMLAttributes['class']
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}>()

// Delegate props to Radix component
const delegatedProps = computed(() => {
  const { class: _, variant: __, size: ___, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RadixComponent
    v-bind="forwardedProps"
    :class="cn(
      'base-classes here',
      {
        'variant-classes': props.variant === 'default',
        'size-classes': props.size === 'default',
      },
      props.class
    )"
  >
    <slot />
  </RadixComponent>
</template>
```

## Component Variants
- Use cva (class-variance-authority) pattern for variants
- Define consistent variant and size options
- Use proper TypeScript types for variants
- Follow the existing design system patterns

## Accessibility Requirements
- Always include proper ARIA attributes
- Use semantic HTML elements as base
- Implement keyboard navigation
- Provide focus indicators
- Support screen readers

## Styling Guidelines
- Use TailwindCSS utility classes exclusively
- Follow the design token system
- Use `cn()` for conditional styling
- Implement hover, focus, and active states
- Support dark/light mode theming

## Composition Patterns
- Build complex components from simpler ones
- Use compound component patterns
- Provide flexible slot-based APIs
- Enable proper prop forwarding
- Support customization through class props
