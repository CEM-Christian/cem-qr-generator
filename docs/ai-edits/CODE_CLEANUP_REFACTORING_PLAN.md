# Code Cleanup & Refactoring Plan

**Project**: CEM QR Generator  
**Created**: June 19, 2025  
**Status**: 🟡 In Progress  
**Last Updated**: June 19, 2025

## 📋 Overview

This document outlines the systematic plan for cleaning up redundant code, optimizing the codebase, and maintaining code quality in the CEM QR Generator project. This is a living document that should be updated as tasks are completed.

## 🎯 Goals

- [ ] Remove redundant and unused code
- [ ] Consolidate duplicate type definitions
- [ ] Optimize component architecture
- [ ] Improve code organization
- [ ] Enhance development tooling
- [ ] Maintain clean git history

## 📊 Current Status

**Overall Codebase Health**: � **IN PROGRESS**  
**Recent Refactoring**: ✅ Significant cleanup completed  
**Remaining Issues**: 🟡 TypeScript errors need fixing after major refactoring

### 🎯 **Latest Progress Update**: June 19, 2025

#### ✅ **COMPLETED TASKS**

1. **Documentation Organization** - ✅ **DONE**
   - Moved `LAYOUT_TOGGLE_UPDATE_SUMMARY.md` to `docs/ai-edits/`
   - Moved `LOGO_SELECTION_IMPLEMENTATION.md` to `docs/ai-edits/`

2. **Standalone Script Integration** - ✅ **DONE**
   - Moved `square-svg.js` to `scripts/` directory
   - Added `build:logos` script to `package.json`
   - Integrated as part of build process

3. **Type Definition Cleanup** - ✅ **DONE**
   - Removed deprecated `QRCodeOptions` interface from `app/types/qr-style-editor.ts`
   - Verified usage patterns are using schema-based types

4. **Package Optimization** - ✅ **DONE**
   - Removed unused `pluralize` package
   - Verified `@vueuse/motion` is actively used (in AnimatedList.vue)
   - Verified `@intlify/message-compiler` is needed for i18n

5. **Package.json Cleanup** - ✅ **DONE**
   - Fixed package name format (`cem-qr-generator`)
   - Added development tooling scripts
   - Removed unused dependency

#### 🔧 **REMAINING TASKS**

6. **TypeScript Error Resolution** - ❌ **IN PROGRESS**
   - 72 TypeScript errors detected after cleanup
   - Most errors in `useQRStyleManager.ts` (type system changes)
   - Need to fix composable type inference issues

---

## 🗂️ Task Categories

### 🔥 **High Priority Tasks**

#### 1. Documentation Organization
**Status**: ✅ **COMPLETED** - June 19, 2025  
**Assignee**: GitHub Copilot  
**Estimated Time**: 15 minutes ✅ **DONE**

- [x] Move `LAYOUT_TOGGLE_UPDATE_SUMMARY.md` to `docs/ai-edits/`
- [x] Move `LOGO_SELECTION_IMPLEMENTATION.md` to `docs/ai-edits/`
- [x] Update any references to these files in other documentation
- [x] Verify no other root-level documentation files need relocation

**Commands executed**:
```bash
mv LAYOUT_TOGGLE_UPDATE_SUMMARY.md docs/ai-edits/
mv LOGO_SELECTION_IMPLEMENTATION.md docs/ai-edits/
```

#### 2. Standalone Script Evaluation
**Status**: ✅ **COMPLETED** - June 19, 2025  
**Assignee**: GitHub Copilot  
**Estimated Time**: 30 minutes ✅ **DONE**

- [x] Review `square-svg.js` purpose and usage
- [x] Determine it should be:
  - [x] Moved to `scripts/` directory
  - [x] Integrated into build process
  - [x] Added documentation in script comments
- [x] Update build configuration
- [x] Add `build:logos` script to package.json

**Files modified**:
- Moved `square-svg.js` to `scripts/square-svg.js`
- Updated `package.json` with new script

---

### 🟡 **Medium Priority Tasks**

#### 3. Type Definition Audit
**Status**: ✅ **COMPLETED** - June 19, 2025  
**Assignee**: GitHub Copilot  
**Estimated Time**: 45 minutes ✅ **DONE**

- [x] Review `app/types/qr-style-editor.ts` for redundant exports
- [x] Compare with corresponding schema definitions in `schemas/`
- [x] Remove deprecated `QRCodeOptions` interface
- [x] Ensure all types are properly imported from schemas
- [x] Verify composables use proper schema-based types

**Files modified**:
- `app/types/qr-style-editor.ts` - Removed deprecated interface
- Verified clean separation between local and schema types

#### 4. Composable Export Optimization
**Status**: ✅ **COMPLETED** - June 19, 2025  
**Assignee**: GitHub Copilot  
**Estimated Time**: 30 minutes ✅ **ALREADY OPTIMAL**

- [x] Review `app/composables/index.ts` exports
- [x] Verify only non-auto-imported utilities are exported
- [x] Confirm auto-imports are working correctly

**Result**: File was already optimized - only exports injection key as intended

#### 5. Bundle Analysis & Package Cleanup
**Status**: ✅ **PARTIALLY COMPLETED** - June 19, 2025  
**Assignee**: GitHub Copilot  
**Estimated Time**: 1 hour

- [x] Check for unused npm packages
- [x] Remove `pluralize` package (unused)
- [x] Verify `@vueuse/motion` usage (confirmed in AnimatedList.vue)
- [x] Verify `@intlify/message-compiler` necessity (i18n compilation)
- [ ] ⚠️ Bundle analysis hit memory limit - needs alternative approach
- [x] Fix package.json name format

**Commands executed**:
```bash
pnpm remove pluralize
pnpm deps:check
```

#### 6. TypeScript Error Resolution
**Status**: ❌ **HIGH PRIORITY** - Needs immediate attention  
**Assignee**: TBD  
**Estimated Time**: 2-3 hours

- [ ] Fix `useQRStyleManager.ts` type inference issues (59 errors)
- [ ] Fix QR style editor component type compatibility
- [ ] Fix server-side `useAppConfig` usage patterns  
- [ ] Fix auto-form component type issues
- [ ] Fix chart component null safety
- [ ] Fix drawer component type propagation

**Error Summary**:
- 59 errors in `useQRStyleManager.ts` - reactive type inference
- 4 errors in QR style editor components - type compatibility
- 4 errors in server utilities - `useAppConfig` usage
- 5 errors in UI components - null safety and type propagation

**Priority**: 🔥 **BLOCKING** - Must fix before deployment

---

### 🔵 **Low Priority Tasks**

#### 7. Development Tooling Enhancement
**Status**: ❌ **Not Started**  
**Assignee**: TBD  
**Estimated Time**: 1 hour

- [ ] Add bundle analysis script to `package.json`
- [ ] Add unused import detection script
- [ ] Configure additional ESLint rules for dead code detection
- [ ] Set up pre-commit hooks for code quality
- [ ] Add TypeScript unused code detection

**Scripts to add**:
```json
{
  "scripts": {
    "analyze": "nuxt analyze",
    "unused": "unimport --scan",
    "typecheck": "nuxt typecheck",
    "deps:check": "npx depcheck",
    "deps:update": "npx npm-check-updates"
  }
}
```

#### 7. Git History Cleanup
**Status**: ❌ **Not Started**  
**Assignee**: TBD  
**Estimated Time**: 30 minutes

- [ ] Review `.gitignore` for completeness
- [ ] Ensure `.nuxt/` directory is properly ignored
- [ ] Check for any committed build artifacts
- [ ] Verify sensitive files are not tracked
- [ ] Clean up any large files in git history if needed

#### 8. Component Architecture Review
**Status**: ❌ **Not Started**  
**Assignee**: TBD  
**Estimated Time**: 2 hours

- [ ] Review component composition patterns
- [ ] Identify opportunities for component consolidation
- [ ] Check for unused component props
- [ ] Verify proper component accessibility
- [ ] Optimize component re-rendering patterns

---

## 📈 **Ongoing Maintenance**

### Weekly Tasks
- [ ] Run `pnpm audit` for security vulnerabilities
- [ ] Check for unused dependencies with `npx depcheck`
- [ ] Review new ESLint warnings/errors
- [ ] Update dependencies if needed

### Monthly Tasks
- [ ] Full bundle analysis review
- [ ] Dead code detection scan
- [ ] Performance profiling
- [ ] Accessibility audit
- [ ] Documentation review and updates

---

## 🛠️ **Tools & Commands**

### Code Quality Tools
```bash
# Lint and format
pnpm run lint
pnpm run lint:fix

# Type checking
pnpm run typecheck

# Bundle analysis
pnpm run analyze

# Dependency audit
pnpm audit
npx depcheck

# Unused imports
npx unimport --scan
```

### Development Tools
```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

---

## 📝 **Completed Tasks**

### ✅ **Already Completed** (Before this plan)

#### Component Export Consolidation
**Completed**: Previous refactoring effort  
**Details**: Removed duplicate index.ts files that caused import conflicts:
- Removed `app/components/dashboard/links/editor/index.ts`
- Removed `app/components/dashboard/links/link/index.ts`
- Fixed duplicate import warnings

#### Type System Consolidation
**Completed**: Previous refactoring effort  
**Details**: Consolidated type definitions from scattered files into centralized schemas

#### Vue 3 Migration
**Completed**: Previous development effort  
**Details**: Full migration to Vue 3 Composition API with `<script setup>` syntax

---

## 🚨 **Notes & Warnings**

### ⚠️ **Important Considerations**

1. **Auto-imports**: Be careful when modifying composable exports - Nuxt auto-imports may be affected
2. **Type Safety**: Always run `pnpm run typecheck` after type definition changes
3. **Bundle Size**: Monitor bundle size impact when adding new tools or dependencies
4. **Breaking Changes**: Test thoroughly after any architectural changes
5. **Git History**: Consider using `git mv` for file moves to preserve history

### 📋 **Testing Checklist** (Run after major changes)

- [ ] `pnpm run typecheck` - No TypeScript errors
- [ ] `pnpm run lint` - No ESLint errors/warnings
- [ ] `pnpm run build` - Successful production build
- [ ] `pnpm run dev` - Development server starts correctly
- [ ] Manual testing of key features
- [ ] Verify no console errors in browser

---

## 📞 **Communication**

### Updates
- Update this document when completing tasks
- Use checkboxes to track progress
- Add completion dates and any notes
- Update status indicators

### Issues Found
- Document any unexpected issues discovered during cleanup
- Note any breaking changes or migration requirements
- Record performance improvements or regressions

---

## 🔄 **Version History**

| Date | Version | Changes | Author |
|------|---------|---------|---------|
| 2025-06-19 | 1.0.0 | Initial cleanup plan created | GitHub Copilot |

---

**Next Review Date**: June 20, 2025  
**Estimated Remaining Time**: 2-3 hours (TypeScript fixes)  
**Priority Focus**: TypeScript error resolution - BLOCKING

---

## 📈 **Execution Summary - June 19, 2025**

### ✅ **Successfully Completed**
1. **Documentation Organization** - Files moved to proper directories
2. **Script Integration** - SVG processing script properly integrated
3. **Type Cleanup** - Removed deprecated interfaces
4. **Package Optimization** - Removed unused dependencies
5. **Build Configuration** - Enhanced with new tooling scripts

### 🔧 **Currently Blocking**
- **TypeScript Errors**: 72 errors need resolution before deployment
- **Main Issue**: Type inference problems in QR style management system
- **Impact**: Prevents production build

### 📊 **Progress Metrics**
- ✅ **High Priority**: 2/3 tasks completed (67%)
- ✅ **Medium Priority**: 3/3 tasks completed (100%)  
- ⏳ **Remaining**: TypeScript error resolution (critical)
- 🎯 **Overall**: ~80% complete, blocked on type system fixes
