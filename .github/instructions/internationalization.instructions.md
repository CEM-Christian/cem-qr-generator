---
applyTo: "i18n/locales/**/*.json"
---

# Internationalization Instructions

## Locale File Structure
Organize translation keys in a nested structure:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation completed successfully"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "links": "Links",
    "analytics": "Analytics"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email",
      "url": "Please enter a valid URL",
      "min_length": "Minimum {count} characters required",
      "max_length": "Maximum {count} characters allowed"
    }
  },
  "feature_name": {
    "title": "Feature Title",
    "description": "Feature description",
    "actions": {
      "create": "Create New",
      "update": "Update",
      "remove": "Remove"
    },
    "messages": {
      "create_success": "Successfully created",
      "update_success": "Successfully updated",
      "delete_success": "Successfully deleted",
      "create_error": "Failed to create",
      "update_error": "Failed to update",
      "delete_error": "Failed to delete"
    }
  }
}
```

## Translation Guidelines
- Use nested keys for better organization
- Keep keys descriptive and consistent
- Use snake_case for key names
- Include context in key names when needed
- Support pluralization with `{count}` parameter
- Provide fallback values for missing translations
- Use interpolation for dynamic content
- Keep translations concise but clear

## Key Naming Conventions
- `common.*` - Shared across the application
- `navigation.*` - Menu items and navigation
- `forms.validation.*` - Form validation messages
- `[feature].*` - Feature-specific translations
- `[feature].actions.*` - Action buttons and links
- `[feature].messages.*` - Success/error messages
- `[feature].labels.*` - Form labels and descriptions

## Usage in Components
```vue
<template>
  <!-- Simple translation -->
  <h1>{{ $t('feature.title') }}</h1>
  
  <!-- With interpolation -->
  <p>{{ $t('feature.welcome', { name: userName }) }}</p>
  
  <!-- In script setup -->
  <button @click="showMessage">{{ $t('common.save') }}</button>
</template>

<script setup lang="ts">
const { t } = useI18n()

function showMessage() {
  toast.success(t('feature.messages.save_success'))
}
</script>
```

## Maintenance
- Keep all locale files synchronized
- Add new keys to all supported languages
- Use placeholders for untranslated content
- Review translations for accuracy and context
- Test with different languages for UI layout issues
