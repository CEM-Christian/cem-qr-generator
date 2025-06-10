---
description: 'Perform a comprehensive code review following project standards'
---

You are performing a code review for the CEM QR Generator application. Review the provided code against the established project standards and best practices.

## Code Review Checklist

### Architecture & Structure
- [ ] Follows established file naming conventions (kebab-case files, PascalCase components)
- [ ] Proper directory structure and organization
- [ ] Appropriate separation of concerns
- [ ] Reuses existing patterns and components

### TypeScript & Type Safety
- [ ] All functions have proper parameter and return types
- [ ] Interfaces are well-defined and reusable
- [ ] Proper use of generic types where appropriate
- [ ] No `any` types without justification
- [ ] Zod schemas are properly defined with validation

### Vue.js Best Practices
- [ ] Uses `<script setup lang="ts">` syntax
- [ ] Proper props and emits definitions with TypeScript
- [ ] Appropriate use of composables and auto-imports
- [ ] Reactive state management follows patterns
- [ ] Lifecycle hooks are used correctly

### Component Quality
- [ ] Components are properly composed and reusable
- [ ] Props are well-defined with appropriate defaults
- [ ] Events follow Vue 3 naming conventions
- [ ] Templates are clean and semantic
- [ ] Proper use of slots for flexibility

### Accessibility
- [ ] Semantic HTML elements are used
- [ ] ARIA attributes are included where needed
- [ ] Keyboard navigation is supported
- [ ] Focus management is proper
- [ ] Color contrast and visual indicators are adequate

### Styling & Design
- [ ] Uses TailwindCSS utility classes correctly
- [ ] Follows the design system and component patterns
- [ ] Responsive design is implemented
- [ ] Dark/light mode support is included
- [ ] Uses `cn()` utility for conditional classes

### Internationalization
- [ ] All user-facing text uses `$t()` or `t()`
- [ ] Translation keys follow naming conventions
- [ ] No hardcoded strings in user interface
- [ ] Proper interpolation for dynamic content

### Performance
- [ ] Appropriate use of `ref()` vs `reactive()` vs `computed()`
- [ ] No unnecessary reactive state or watchers
- [ ] Proper cleanup in `onUnmounted()` if needed
- [ ] Efficient rendering patterns

### Error Handling
- [ ] Proper try/catch blocks for async operations
- [ ] User-friendly error messages
- [ ] Loading states are handled appropriately
- [ ] Edge cases are considered

### Security
- [ ] Input validation on both client and server
- [ ] Proper sanitization of user data
- [ ] No exposure of sensitive information
- [ ] API endpoints have proper validation

### Testing & Quality
- [ ] Code follows ESLint rules
- [ ] Functions are testable and have single responsibilities
- [ ] Edge cases and error conditions are handled
- [ ] Code is readable and well-documented

## Review Format

Provide feedback in this format:

### ✅ Strengths
- List what the code does well
- Highlight good patterns and practices

### ⚠️ Issues to Address
- **Critical**: Issues that must be fixed
- **Moderate**: Issues that should be fixed
- **Minor**: Suggestions for improvement

### 💡 Suggestions
- Performance optimizations
- Code organization improvements
- Better patterns to follow

### 📚 References
- Point to existing code examples in the project
- Reference relevant documentation or patterns

Review the code thoroughly and provide constructive feedback that helps maintain the project's high standards.
