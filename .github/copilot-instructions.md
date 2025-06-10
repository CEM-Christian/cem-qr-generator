# GitHub Copilot Instructions for CEM QR Generator

## Project Overview
This is a Vue.js/Nuxt.js application for generating QR codes and shortening URLs with analytics capabilities, built for Cloudflare Pages/Workers deployment.

## Technology Stack & Dependencies
- **Framework**: Nuxt.js 3.17+ with Vue 3 Composition API
- **TypeScript**: Fully typed codebase with strict type checking
- **Styling**: TailwindCSS with Radix Vue components and shadcn/ui patterns
- **Forms**: VeeValidate with Zod schema validation
- **Internationalization**: @nuxtjs/i18n with JSON locale files
- **State Management**: Vue Composition API with composables
- **Database**: Cloudflare KV for data storage, Analytics Engine for metrics
- **Deployment**: Cloudflare Pages/Workers
- **Package Manager**: pnpm (not npm or yarn)

## Code Style & Formatting
- Use ESLint with @antfu/eslint-config - disable Prettier as ESLint handles formatting
- Use single quotes for strings, no semicolons unless required
- Use kebab-case for file names, PascalCase for Vue components
- Use camelCase for variables, functions, and computed properties
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Max line length is handled by ESLint, focus on readability

## Vue.js & Nuxt.js Conventions
- Always use Vue 3 Composition API with `<script setup>` syntax
- Use TypeScript for all new files (`<script setup lang="ts">`)
- Prefer `defineProps` and `defineEmits` over Options API
- Use auto-imports - don't manually import Vue utilities like `ref`, `computed`, `watch`
- Use Nuxt auto-imports for utils, composables, and components
- Component file structure: `<script setup>` → `<template>` → `<style>` (if needed)
- Use `useI18n()` for internationalization with $t() in templates
- Server routes go in `server/api/` with proper H3 event handlers

## TypeScript Guidelines
- Use strict TypeScript with proper typing for all function parameters and returns
- Leverage Zod schemas for runtime validation and TypeScript inference
- Use `z.infer<typeof Schema>` for type extraction from Zod schemas
- Prefer interfaces for complex object types, type aliases for unions/primitives
- Use generic types when building reusable components
- Always type Vue component props with proper interfaces

## Component Architecture
- Use Radix Vue for low-level components (headless UI)
- Follow shadcn/ui patterns for component composition
- Store reusable UI components in `app/components/ui/`
- Use compound components pattern for complex UI elements
- Implement proper accessibility attributes (ARIA, semantic HTML)
- Use `cn()` utility for conditional CSS classes (TailwindCSS + clsx)

## Form Handling & Validation
- Use VeeValidate with Zod schemas for all form validation
- Define schemas in `schemas/` directory with proper exports
- Use `toTypedSchema()` to convert Zod schemas for VeeValidate
- Implement `AutoForm` component for rapid form generation
- Handle form state with composables, not direct component state
- Always validate both client-side and server-side

## State Management & Data Fetching
- Use composables in `composables/` for shared state and logic
- Use `useAPI()` custom composable for API calls (already implemented)
- Implement proper error handling with try/catch blocks
- Use Nuxt server-side rendering where appropriate
- Cache API responses when beneficial for performance
- Handle loading states and error boundaries properly

## Database & API Design
- Use Cloudflare KV for data persistence with proper key naming (`link:${slug}`)
- Implement proper error handling in server routes
- Use Zod schemas for request/response validation
- Follow RESTful conventions for API endpoints
- Use H3 utilities like `eventHandler`, `readValidatedBody`, `getValidatedQuery`
- Implement proper CORS and security headers

## Internationalization
- Store all user-facing text in locale files (`i18n/locales/`)
- Use nested key structure in JSON files for organization
- Use `$t('key.nested')` in templates and `t('key.nested')` in script
- Support multiple languages: en-US, de-DE, fr-FR, vi-VN, zh-CN, zh-TW
- Extract text to i18n keys, never hardcode user-facing strings

## Error Handling & Logging
- Use `console.error()` for error logging with context
- Implement proper error boundaries in Vue components
- Use Nuxt error pages for application-level errors
- Handle API errors gracefully with user-friendly messages
- Use toast notifications for user feedback (`vue-sonner`)

## Performance & Optimization
- Use `shallowRef` and `shallowReactive` when deep reactivity isn't needed
- Implement proper lazy loading for large components
- Use Nuxt's built-in optimizations (auto-imports, tree-shaking)
- Optimize images and assets for web delivery
- Use proper caching strategies for API calls and static assets

## Security Considerations
- Validate all user inputs server-side with Zod schemas
- Sanitize data before storing in KV
- Use proper CORS configuration
- Implement rate limiting where appropriate
- Handle sensitive data (API keys) through environment variables
- Never expose server-side secrets to client-side code

## Testing & Quality Assurance
- Run `npm run lint` before commits (enforced by git hooks)
- Use TypeScript strict mode for compile-time error catching
- Test forms and API endpoints thoroughly
- Validate edge cases and error conditions
- Ensure accessibility compliance (WCAG guidelines)

## Deployment & Environment
- Deploy to Cloudflare Pages with Workers for serverless functions
- Use environment variables for configuration (prefixed with `NUXT_`)
- Configure proper redirects and caching rules
- Test in multiple environments before production deployment
- Use wrangler CLI for local development and deployment

## Naming Conventions
- **Files**: kebab-case (`user-profile.vue`, `link-editor.ts`)
- **Components**: PascalCase (`UserProfile.vue`, `LinkEditor.vue`)
- **Variables/Functions**: camelCase (`userName`, `createLink()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **CSS Classes**: Follow TailwindCSS conventions
- **API Routes**: RESTful with descriptive names (`/api/link/create`)

## AI-Specific Instructions
- When generating code, follow these patterns exactly
- Always include proper TypeScript types
- Use existing composables and utilities when available
- Generate accessible, semantic HTML
- Include proper error handling in all generated code
- Follow the established component patterns in the codebase
- Use the same formatting and style as existing code
- Reference existing similar components when creating new ones
