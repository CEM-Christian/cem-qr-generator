---
mode: 'agent'
tools: ['codebase']
description: 'Generate a new feature for the CEM QR Generator application'
---

You are creating a new feature for the CEM QR Generator application. This is a Vue.js/Nuxt.js application for generating QR codes and shortening URLs with analytics.

## Project Context
Review the existing codebase structure and patterns:
- Vue 3 Composition API with TypeScript
- Nuxt.js 3 for SSR and auto-imports
- TailwindCSS + Radix Vue + shadcn/ui for styling
- VeeValidate + Zod for forms and validation
- Cloudflare KV + Analytics Engine for data
- i18n for internationalization

## Instructions for New Features

1. **Follow Existing Patterns**: Study similar components and follow the same structure
2. **Use TypeScript**: All new code must be properly typed
3. **Schema-First**: Define Zod schemas for data validation
4. **Internationalization**: Add all text to i18n locale files
5. **Accessibility**: Ensure WCAG compliance
6. **Error Handling**: Implement proper error boundaries
7. **Testing**: Consider edge cases and error conditions

## File Organization
- Components: `app/components/[feature]/`
- Pages: `app/pages/[feature]/`
- Server APIs: `server/api/[feature]/`
- Schemas: `schemas/[feature].ts`
- Composables: `composables/[feature].ts`
- Locale keys: `i18n/locales/[lang].json`

## Required Elements for Each Feature
- [ ] Zod schema for data validation
- [ ] TypeScript interfaces
- [ ] Vue components with proper props/emits
- [ ] Server API routes with validation
- [ ] Internationalization keys
- [ ] Error handling and loading states
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Form validation (if applicable)

Ask for specific requirements if they're not provided, then implement the complete feature following all established patterns.
