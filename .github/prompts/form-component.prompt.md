---
description: 'Create a new form component with validation and AutoForm integration'
---

You are creating a new form component for the CEM QR Generator application. This should follow the established patterns using VeeValidate, Zod schemas, and the AutoForm system.

## Form Requirements

Create a complete form solution including:
- **Zod Schema**: Define validation rules and TypeScript types
- **Form Component**: Vue component with proper validation
- **AutoForm Integration**: Leverage the existing AutoForm system
- **Field Configuration**: Custom field configs and dependencies
- **Error Handling**: User-friendly validation messages
- **Accessibility**: Proper ARIA labels and form semantics

## Technical Implementation

1. **Schema Definition** (`schemas/[name].ts`):
```typescript
import { z } from 'zod'

export const FormSchema = z.object({
  // Define all fields with proper validation
  requiredField: z.string().trim().min(1, 'Required field'),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Must be a valid URL').optional(),
  // Add conditional validation and refinements as needed
})

export type FormData = z.infer<typeof FormSchema>
```

2. **Form Component** (`app/components/[feature]/[Name]Form.vue`):
- Use `useForm()` with `toTypedSchema()`
- Implement proper field configurations
- Add custom slot overrides for complex fields
- Handle form submission with proper error handling
- Include loading states and success feedback

3. **Field Configuration**:
- Define labels, descriptions, and placeholders
- Set up field dependencies and conditional logic
- Configure component types (input, select, textarea, etc.)
- Add validation rules and error messages

## Form Patterns

Reference these existing patterns:
- `app/components/dashboard/links/Editor.vue` - Complete form with validation
- `app/components/ui/auto-form/` - AutoForm component system
- `schemas/link.ts` - Schema definition patterns

## Requirements Checklist

- [ ] Zod schema with proper validation
- [ ] TypeScript interfaces and types
- [ ] Vue form component with script setup
- [ ] VeeValidate integration with toTypedSchema
- [ ] AutoForm field configuration
- [ ] Custom field components (if needed)
- [ ] Form dependencies and conditional logic
- [ ] Internationalization for all text
- [ ] Proper error handling and loading states
- [ ] Accessibility attributes and semantic HTML
- [ ] Responsive design and mobile support
- [ ] Integration with existing API endpoints

What specific form are you looking to create? Provide the requirements and I'll implement the complete solution.
