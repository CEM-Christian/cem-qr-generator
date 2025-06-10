---
applyTo: "**/*.{ts,vue}"
---

# TypeScript & Zod Schema Instructions

## Schema Definition Patterns
Always follow these patterns when creating or modifying Zod schemas:

```typescript
import { z } from 'zod'

// Base schema with proper validation
export const LinkSchema = z.object({
  id: z.string().trim().max(26).default(nanoid(10)),
  url: z.string().trim().url().max(2048),
  slug: z.string().trim().max(2048).regex(new RegExp(slugRegex)).default(nanoid()),
  name: z.string().trim().max(100).optional(),
  // Add proper constraints and defaults
})

// Extend schemas for specific use cases
export const CreateLinkSchema = LinkSchema.omit({ id: true, createdAt: true })

// Use refinements for complex validation
export const LinkWithExpirationSchema = LinkSchema.extend({
  expiration: z.number().int().safe().refine(
    expiration => expiration > Math.floor(Date.now() / 1000),
    { message: 'expiration must be greater than current time' },
  ).optional(),
})
```

## TypeScript Integration
- Use `z.infer<typeof Schema>` for type extraction
- Define proper interfaces for complex objects
- Use generic types for reusable components
- Leverage TypeScript strict mode features
- Always type function parameters and returns

## Validation Best Practices
- Add proper string constraints (trim, max length)
- Use specific validators (url, email, regex)
- Provide meaningful error messages
- Implement client and server-side validation
- Use optional() for non-required fields
- Add defaults where appropriate

## Form Integration
- Convert Zod schemas with `toTypedSchema()` for VeeValidate
- Define field configurations for AutoForm components
- Handle validation errors gracefully
- Provide user-friendly error messages

## Schema Organization
- Store schemas in `schemas/` directory
- Export related schemas together
- Use consistent naming conventions
- Document complex validation logic
- Reuse schemas across client and server
