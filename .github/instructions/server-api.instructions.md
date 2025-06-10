---
applyTo: "server/api/**/*.ts"
---

# Server API Route Instructions

## API Route Structure
Follow this pattern for all server routes:

```typescript
import { SomeSchema } from '@@/schemas/some-schema'
import { z } from 'zod'

// Define request schema if needed
const RequestSchema = z.object({
  param: z.string().trim().max(100),
})

export default eventHandler(async (event) => {
  // Validate query parameters
  const query = await getValidatedQuery(event, RequestSchema.parse)

  // Or validate request body
  const body = await readValidatedBody(event, SomeSchema.parse)

  // Get Cloudflare context
  const { cloudflare } = event.context
  const { KV, AI } = cloudflare.env

  // Implement proper error handling
  try {
    // API logic here
    const result = await someOperation()

    return {
      success: true,
      data: result,
    }
  }
  catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
```

## Validation & Error Handling
- Always validate inputs with Zod schemas
- Use `getValidatedQuery()` for query parameters
- Use `readValidatedBody()` for request bodies
- Implement proper error handling with try/catch
- Return consistent error responses with `createError()`
- Log errors with context information

## Cloudflare Integration
- Access Cloudflare services through `event.context.cloudflare.env`
- Use KV for data storage with proper key naming
- Use Analytics Engine for metrics collection
- Handle Cloudflare Workers limitations

## API Response Patterns
- Return consistent response structures
- Include success/error indicators
- Provide meaningful error messages
- Use proper HTTP status codes
- Handle edge cases gracefully

## Database Operations
- Use KV.get() with proper type casting
- Implement caching strategies with cacheTtl
- Use metadata for additional data storage
- Handle expiration and TTL properly
- Batch operations when possible
