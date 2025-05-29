We use Nuxt v3 with the Composition API and script setup syntax in .vue SFCs. Always generate code that follows these conventions.

We use Tailwind CSS for styling and shadcn-vue UI components. When writing UI code, prefer shadcn-vue components and Tailwind utility classes.

We deploy to Cloudflare Pages with Cloudflare Workers. For KV storage, use the KV binding; for Workers Analytics Engine, use the ANALYTICS binding; for optional AI workflows, use the AI binding.

Environment variables are accessed via process.env.NUXT_SITE_TOKEN, process.env.NUXT_CF_ACCOUNT_ID, and process.env.NUXT_CF_API_TOKEN. Always validate environment variables before use.

Server endpoints should be defined under server/api using the Cloudflare Workers runtime. Use proper error handling and logging.

For URL slug functionality, support custom and AI-generated slugs as strings with case sensitivity. Always validate slug uniqueness in KV before creation.

Write unit tests in Vitest under the tests/ directory and use TypeScript types in tests where possible.

Use 2 spaces for indentation and single quotes for strings. Include JSDoc comments for public API functions.

Place documentation updates in docs/configuration.md, docs/api.md, or docs/faqs.md. When offering code examples in documentation, ensure they are copyable and syntactically correct.
