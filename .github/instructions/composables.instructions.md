---
applyTo: "composables/**/*.ts"
---

# Composables Instructions

## Composable Structure
Follow this pattern for all Vue composables:

```typescript
import type { Ref } from 'vue'

// Define proper TypeScript interfaces
interface UseFeatureOptions {
  immediate?: boolean
  // Other options
}

interface UseFeatureReturn {
  data: Ref<SomeType | null>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  execute: () => Promise<void>
  // Other returned values
}

// Export the composable function
export function useFeature(
  options: UseFeatureOptions = {}
): UseFeatureReturn {
  // Reactive state
  const data = ref<SomeType | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Methods
  async function execute() {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await someAsyncOperation()
      data.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Composable error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Lifecycle
  if (options.immediate) {
    execute()
  }

  // Return reactive values and functions
  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    execute,
  }
}
```

## Composable Best Practices
- Always use TypeScript with proper interfaces
- Return readonly refs for reactive state when appropriate
- Implement proper error handling with try/catch
- Use consistent naming conventions (useFeatureName)
- Handle loading states and error states
- Provide options parameters for flexibility
- Use lifecycle hooks appropriately (onMounted, onUnmounted)
- Clean up side effects in onUnmounted
- Make composables reusable and testable

## State Management
- Use ref() for simple reactive values
- Use reactive() for complex objects
- Use computed() for derived state
- Use watch() for side effects
- Consider using shallowRef() for performance when deep reactivity isn't needed

## API Integration
- Use the existing `useAPI()` composable for HTTP requests
- Implement proper error handling and retries
- Handle loading states consistently
- Cache responses when appropriate
- Use proper TypeScript types for API responses
