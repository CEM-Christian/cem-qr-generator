# Organization Filtering for Links Dashboard - PRD

## Overview

Add organization-based categorization and filtering to the CEM QR Generator links dashboard. This feature allows users to organize links by institution and filter the dashboard view by specific organizations.

## Implementation Progress Tracker

### Phase 1: Schema Updates and Foundation ✅
- [x] Create organization schema (`schemas/organization.ts`)
- [x] Update link schema with optional organization field (`schemas/link.ts`)
- [x] Define organization configuration constants
- [x] Add TypeScript interfaces and types
- [x] Test schema validation

### Phase 2: Organization Management Infrastructure ✅
- [x] Create organization configuration file (`app/config/organizations.ts`)
- [x] Create `useOrganizations` composable (`composables/useOrganizations.ts`)
- [x] Add organization utilities and helpers
- [x] Test organization data structure

### Phase 3: UI Components Development ✅
- [x] Create `OrganizationFilter.vue` component
- [x] Create organization selector for editor form
- [x] Add organization display components
- [x] Test component functionality and styling

### Phase 4: Dashboard Integration ✅
- [x] Integrate organization filter into links dashboard
- [x] Update dashboard layout (sort → organization filter → search)
- [x] Implement client-side filtering logic
- [x] Add filter state persistence in URL parameters
- [x] Test filtering functionality

### Phase 5: Server-Side Implementation ✅
- [x] Update link creation API (`server/api/link/create.post.ts`)
- [x] Update link editing API (`server/api/link/edit.put.ts`)
- [x] Update link listing API (`server/api/link/list.get.ts`)
- [x] Update search API (`server/api/link/search.get.ts`)
- [x] Test API endpoints with organization data

### Phase 6: Internationalization ✅
- [x] Add organization keys to `en-US.json`
- [x] Add organization keys to `de-DE.json`
- [x] Add organization keys to `fr-FR.json`
- [x] Add organization keys to `zh-CN.json`
- [x] Add organization keys to `zh-TW.json`
- [x] Add organization keys to `vi-VN.json`
- [x] Test all language translations

### Phase 7: Organization Display on Link Cards ✅
- [x] Add organization display to Link.vue component
- [x] Implement logo display with 20x20px sizing
- [x] Add initials fallback for organizations without logos
- [x] Position indicator in footer info bar (next to UTM)
- [x] Match visual prominence with UTM indicator
- [x] Add responsive behavior (logo only on mobile)
- [x] Test display across all screen sizes
- [x] Ensure accessibility compliance

### Phase 8: Auto-Detection Feature (Future Enhancement) ⏳
- [ ] Create URL pattern matching utilities
- [ ] Implement organization detection from URLs
- [ ] Add auto-detection to link creation
- [ ] Add manual override functionality
- [ ] Add detection indicators in UI
- [ ] Test auto-detection accuracy

### Phase 9: Testing and Polish ✅
- [x] End-to-end testing of all features
- [x] Performance testing with large datasets
- [x] Accessibility compliance verification
- [x] Mobile responsiveness testing
- [x] Component error resolution and debugging
- [x] SelectItem component structure fix
- [x] Production readiness verification
- [x] Final documentation and implementation summary

---

## Detailed Requirements

### 1. Data Model Updates

#### Link Schema Enhancement
- Add optional `organization` field to [`LinkSchema`](schemas/link.ts)
- Support manual assignment initially (auto-detection in Phase 7)
- Organization values should be from predefined enum list

#### Organization Configuration
Create organization mapping with:
- Organization identifier (enum value)
- Display name
- Optional metadata (logo, color, etc.)
- URL patterns (for future auto-detection in Phase 7)

### 2. User Interface Components

#### Organization Filter Component
**Location**: `app/components/dashboard/links/OrganizationFilter.vue`

- Dropdown selector with predefined organizations
- "All Organizations" option to show all links
- Visual indicators for filtered state
- Integration with existing filter persistence

#### Filter Bar Layout Update
**Location**: [`app/components/dashboard/links/Index.vue`](app/components/dashboard/links/Index.vue)

Current layout:
```
[Editor] [Sort] [Search]
```

New layout:
```
[Editor] [Sort] [Organization Filter] [Search]
```

#### Editor Form Enhancement
**Location**: [`app/components/dashboard/links/Editor.vue`](app/components/dashboard/links/Editor.vue)

- Add organization selector in form
- Manual selection only (auto-detection in Phase 8)
- Optional field with clear labeling

#### Link Card Organization Display (Phase 7)
**Location**: [`app/components/dashboard/links/Link.vue`](app/components/dashboard/links/Link.vue)

Requirements:
- **Placement**: Footer info bar, positioned next to UTM indicator
- **Visual Style**: Logo (20x20px) + abbreviated name on desktop, logo only on mobile
- **Fallback**: Organization initials when no logo available
- **Prominence**: Equal visual weight to UTM indicator
- **Non-interactive**: Pure visual indicator, no click behavior
- **Responsive**: Hide text on mobile screens, show in tooltip
- **Accessibility**: Proper alt text and ARIA labels

Visual Design:
```
┌─────────────────────────────────────┐
│ Link Name/Slug                      │
│ https://example.com/link            │
│                                     │
│ https://example.com/link  📊 UTM    │ ← Line 1: URL + UTM
│ 📅 Date  [🏢] ORG         [actions]│ ← Line 2: Date + Org + Actions
└─────────────────────────────────────┘
```

Mobile Design:
```
┌─────────────────────────┐
│ Link Name/Slug          │
│ https://example.com/... │
│                         │
│ https://example.com/... │ ← Line 1: URL
│ 📅 [🏢] [actions]      │ ← Line 2: Date + Org + Actions
└─────────────────────────┘
```

### 3. Predefined Organizations

Based on the existing logo assets:

```typescript
const ORGANIZATIONS = [
  {
    id: 'cem',
    name: 'Christian Education Ministries',
    logo: 'cem.svg',
    initials: 'CEM',
  },
  {
    id: 'acc',
    name: 'Australian Christian College',
    logo: 'acc.svg',
    initials: 'ACC',
  },
  {
    id: 'bairnsdale',
    name: 'Bairnsdale Christian College',
    logo: 'bairnsdale.svg',
    initials: 'BCC',
  },
  {
    id: 'brightwaters',
    name: 'Brightwaters Christian College',
    logo: 'brightwaters.svg',
    initials: 'BWC',
  },
  {
    id: 'heritage',
    name: 'Heritage Christian School',
    logo: 'heritage.svg',
    initials: 'HCS',
  },
  {
    id: 'medowie',
    name: 'Medowie Christian School',
    logo: 'medowie.svg',
    initials: 'MCS',
  },
  {
    id: 'smartplay',
    name: 'SmartPlay',
    logo: 'smartplay.svg',
    initials: 'SP',
  },
  {
    id: 'swanhill',
    name: 'Swan Hill Christian School',
    logo: 'swanhill.svg',
    initials: 'SHCS',
  },
] as const
```

## Technical Specifications

### 1. Schema Updates

#### Organization Schema
```typescript
// schemas/organization.ts
export const OrganizationSchema = z.enum([
  'cem',
  'acc',
  'bairnsdale',
  'brightwaters',
  'heritage',
  'medowie',
  'smartplay',
  'swanhill',
]).optional()
```

#### Link Schema Extension
```typescript
// schemas/link.ts
export const LinkSchema = z.object({
  // ...existing fields
  organization: OrganizationSchema,
})
```

### 2. Component Architecture

#### OrganizationFilter.vue
```vue
<template>
  <Select v-model="selectedOrganization">
    <SelectTrigger>
      <SelectValue :placeholder="$t('organization.filter_placeholder')" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="">
        {{ $t('organization.all') }}
      </SelectItem>
      <SelectItem
        v-for="org in organizations"
        :key="org.id"
        :value="org.id"
      >
        {{ org.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
```

#### Link.vue Organization Display (Phase 7)
```vue
<script setup lang="ts">
// ...existing script...

const { getOrganizationById } = useOrganizations()
const organizationConfig = computed(() =>
  link.organization ? getOrganizationById(link.organization) : null,
)
</script>

<template>
  <!-- ...existing link content... -->

  <!-- Footer info bar -->
  <div class="flex w-full h-5 space-x-2 text-sm">
    <!-- ...existing content... -->

    <!-- Organization indicator -->
    <template v-if="organizationConfig">
      <Separator orientation="vertical" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
              <!-- Logo or initials -->
              <div class="flex items-center justify-center w-5 h-5">
                <img
                  v-if="organizationConfig.logo"
                  :src="`/logos/${organizationConfig.logo}`"
                  :alt="organizationConfig.name"
                  class="w-5 h-5 object-contain"
                  loading="lazy"
                >
                <span
                  v-else
                  class="text-xs font-medium bg-muted rounded px-1"
                  :aria-label="organizationConfig.name"
                >
                  {{ organizationConfig.initials }}
                </span>
              </div>

              <!-- Organization name (hidden on mobile) -->
              <span class="hidden sm:inline truncate max-w-24">
                {{ organizationConfig.name }}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ organizationConfig.name }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>

    <!-- UTM indicator -->
    <template v-if="hasUtmParams">
      <Separator orientation="vertical" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="inline-flex items-center leading-5 whitespace-nowrap">
              <BarChart3 class="w-4 h-4 mr-1" />
              <span class="hidden sm:inline text-blue-600">UTM</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div class="space-y-1">
              <p v-if="link.utm_source">
                <strong>Source:</strong> {{ link.utm_source }}
              </p>
              <p v-if="link.utm_medium">
                <strong>Medium:</strong> {{ link.utm_medium }}
              </p>
              <p v-if="link.utm_campaign">
                <strong>Campaign:</strong> {{ link.utm_campaign }}
              </p>
              <p v-if="link.utm_id">
                <strong>ID:</strong> {{ link.utm_id }}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>
  </div>
</template>
```

### 3. API Updates

#### KV Storage Updates
Store organization in both value and metadata:
```typescript
await KV.put(`link:${slug}`, JSON.stringify(link), {
  metadata: {
    // ...existing metadata
    organization: link.organization,
  },
})
```

### 4. Filtering Logic

#### Client-Side Implementation
```typescript
// In Index.vue
const selectedOrganization = ref('')
const filteredLinks = computed(() => {
  let filtered = displayedLinks.value

  if (selectedOrganization.value) {
    filtered = filtered.filter(link =>
      link.organization === selectedOrganization.value,
    )
  }

  return filtered
})
```

### 5. Internationalization

#### Required Translation Keys
```json
{
  "organization": {
    "filter_placeholder": "Filter by organization",
    "all": "All Organizations",
    "none": "No Organization",
    "select_placeholder": "Select organization"
  },
  "links": {
    "form": {
      "organization": {
        "label": "Organization",
        "description": "Assign link to an organization",
        "placeholder": "Select organization (optional)"
      }
    }
  }
}
```

## File Structure

```
docs/
└── ORGANIZATION_FILTERING_PRD.md          # This progress tracking file
app/
├── components/
│   └── dashboard/
│       └── links/
│           ├── Index.vue                  # Add organization filter
│           ├── Editor.vue                 # Add organization field
│           ├── Link.vue                   # Add organization display (Phase 7)
│           └── OrganizationFilter.vue     # New component
├── composables/
│   └── useOrganizations.ts               # New composable
├── config/
│   └── organizations.ts                  # Organization definitions
schemas/
├── link.ts                               # Update with organization field
└── organization.ts                       # New schema
server/api/link/
├── create.post.ts                        # Handle organization
├── edit.put.ts                           # Update organization
├── list.get.ts                           # Filter by organization
└── search.get.ts                         # Include organization
i18n/locales/
├── en-US.json                            # Add organization keys
├── de-DE.json                            # Add organization keys
├── fr-FR.json                            # Add organization keys
├── zh-CN.json                            # Add organization keys
├── zh-TW.json                            # Add organization keys
└── vi-VN.json                            # Add organization keys
```

## Acceptance Criteria

1. **Organization Field**: Links can have an organization assigned manually
2. **Filter UI**: Organization filter dropdown appears between sort and search
3. **Manual Selection**: Users can manually set/change organization in editor
4. **Filter Persistence**: Organization filter state persists in URL parameters
5. **Backward Compatibility**: Existing links work without organization assigned
6. **Internationalization**: All text is properly internationalized
7. **API Compatibility**: Server APIs handle organization field appropriately
8. **Performance**: Filtering works efficiently with existing infinite scroll
9. **Visual Design**: Filter component matches existing design system
10. **Optional Field**: Organization field is clearly marked as optional
11. **Organization Display**: Organization appears on link cards in footer info bar
12. **Logo Display**: 20x20px logos display correctly with proper fallbacks
13. **Initials Fallback**: Organizations without logos show initials in styled badge
14. **Responsive Design**: Mobile shows logo only, desktop shows logo + name
15. **Non-Interactive**: Organization display is purely visual, no click behavior
16. **Equal Prominence**: Organization indicator has same visual weight as UTM indicator

## Notes

- Auto-detection functionality has been moved to Phase 8 as a future enhancement
- Phase 7 focuses on visual display of organizations on link cards
- Focus on core manual organization assignment and filtering first
- Each phase should be completed and tested before moving to the next
- Check off completed items in the progress tracker above
- URL pattern matching and auto-detection will be implemented after core functionality is stable

---

*Last Updated: June 13, 2025*
*Phase Status: Phase 7 (Organization Display) - ✅ IMPLEMENTATION COMPLETE*
*All core phases complete except Phase 8 (Auto-Detection) which is marked as future enhancement*
