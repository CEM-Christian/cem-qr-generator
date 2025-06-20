# Product Requirements Document: Link Scan Counter Implementation

## Executive Summary
Add a scan counter display to link components that shows the number of times each QR code has been scanned, with graceful handling when analytics services are unavailable.

## Background
Currently, the link components display QR codes and basic metadata but lack visibility into scan analytics. Users need to see how many times their QR codes have been scanned to measure engagement and effectiveness.

## Objectives
- Display scan count for each link in the link card components
- Gracefully handle unavailable analytics services (dev mode, service outages)
- Maintain consistent UI/UX across different link layouts
- Provide real-time or near-real-time scan count updates

## Success Criteria
- Scan counters are visible in both condensed and QR code layouts
- No errors thrown when analytics service is unavailable
- Scan counts update automatically when available
- Consistent visual design with existing metadata elements

## Technical Requirements

### 1. Data Model & API
- Create endpoint to fetch scan statistics: `/api/links/{slug}/stats`
- Return scan count with proper error handling for unavailable services
- Support batch requests for multiple links (dashboard view optimization)
- Cache scan counts appropriately to reduce API calls

### 2. UI Components
- Add scan counter to `LinkMetadata.vue`
- Use eye icon or similar to represent scan/view count
- Include tooltip with additional details (last scanned, total scans)
- Maintain consistent spacing and visual hierarchy

### 3. Error Handling
- Gracefully hide scan counter when service unavailable
- Log errors for debugging without breaking user experience
- Provide fallback state (e.g., "Stats unavailable" tooltip)
- No throwing of unhandled errors in component

### 4. Performance Considerations
- Implement proper loading states
- Cache scan counts in component state
- Use debounced API calls for real-time updates
- Consider pagination impact on batch requests

## User Experience

### Visual Design
- Scan counter appears as fourth metadata item in `LinkMetadata.vue`
- Uses Eye icon from lucide-vue-next
- Format: "1.2K" for large numbers (use existing number formatting utils)
- Tooltip shows full count and last scan timestamp

### Layout Integration
- **Condensed Layout**: Appears in metadata row after UTM tags
- **QR Code Layout**: Appears in same metadata section
- Responsive design maintains readability on mobile

### States
1. **Loading**: Skeleton/shimmer effect during fetch
2. **Available**: Shows actual scan count with icon
3. **Unavailable**: Hidden completely (no error indicators)
4. **Error**: Logs error but shows nothing to user

## Technical Implementation Plan

### Phase 1: Backend API
1. Create `/api/links/{slug}/stats` endpoint
2. Implement proper error handling for unavailable analytics
3. Add batch endpoint `/api/links/stats` for dashboard efficiency
4. Include proper TypeScript types for stats response

### Phase 2: Frontend Integration
1. Create `useLinkStats()` composable for fetching scan data
2. Update `LinkMetadata.vue` to include scan counter
3. Add loading and error states
4. Implement number formatting for large scan counts

### Phase 3: Optimization
1. Add caching layer for scan counts
2. Implement real-time updates (WebSocket or polling)
3. Performance testing and optimization
4. Add analytics tracking for feature usage

## Error Scenarios & Handling

### Service Unavailable
- **Cause**: Analytics service down, dev mode, network issues
- **Behavior**: Scan counter is completely hidden
- **Logging**: Error logged to console for debugging

### API Rate Limiting
- **Cause**: Too many requests to stats endpoint
- **Behavior**: Use cached values, retry with exponential backoff
- **Logging**: Rate limit warnings logged

### Invalid Response
- **Cause**: Malformed API response
- **Behavior**: Hide scan counter, log error
- **Fallback**: Show nothing to avoid breaking layout

## Internationalization
- Add i18n keys for scan counter tooltips
- Support number formatting for different locales
- Ensure RTL language compatibility

### New i18n Keys
```json
{
  "links": {
    "stats": {
      "scans": "Scans",
      "scans_tooltip": "Total scans: {count}",
      "last_scanned": "Last scanned: {date}",
      "stats_unavailable": "Statistics unavailable"
    }
  }
}
```

## Dependencies
- lucide-vue-next (Eye icon)
- Existing tooltip components
- Number formatting utilities
- Error logging infrastructure

## Testing Requirements
- Unit tests for stats API endpoints
- Component tests for scan counter display
- Error handling tests (service unavailable scenarios)
- Visual regression tests for layout changes
- Performance tests for batch stats requests

## Security Considerations
- Validate link ownership before returning stats
- Rate limiting on stats endpoints
- Sanitize all user inputs in stats queries

## Monitoring & Analytics
- Track scan counter feature usage
- Monitor API response times for stats endpoints
- Alert on high error rates for stats service
- Dashboard for scan counter performance metrics

## Rollout Plan
1. **Development**: Implement feature with feature flag
2. **Staging**: Full testing with simulated service outages
3. **Production**: Gradual rollout with monitoring
4. **Full Release**: Enable for all users after validation

## Success Metrics
- Zero error reports related to scan counter
- Improved user engagement with analytics features
- Reduced support requests about scan tracking
- Positive user feedback on scan visibility

## Future Enhancements
- Detailed analytics dashboard
- Scan location tracking
- Time-based scan charts
- Export scan data functionality
- Real-time scan notifications

## Implementation Progress
- [x] Phase 1: Backend API
  - [x] Create stats API endpoint `/api/link/stats`
  - [x] Add error handling for unavailable services
  - [x] Create TypeScript types for stats response
- [x] Phase 2: Frontend Integration
  - [x] Create `useLinkStats()` composable
  - [x] Update `LinkMetadata.vue` component
  - [x] Add i18n translations for all supported locales
- [x] Phase 3: Testing & Validation
  - [x] Lint validation passed
  - [x] Error handling validation (graceful degradation)
  - [ ] Manual testing in development environment
  - [ ] Testing with analytics service unavailable

## Implementation Details

### Completed Features
1. **API Endpoint**: `/api/link/stats?slug={slug}` returns scan count or null if unavailable
2. **Composable**: `useLinkStats()` provides reactive scan data with error handling
3. **UI Component**: Scan counter appears in LinkMetadata with Eye icon and tooltip
4. **Internationalization**: Added translations for all 7 supported locales
5. **Error Handling**: Graceful degradation - counter hidden when service unavailable

### Technical Decisions Made
- Used Cloudflare Analytics Engine query structure following existing patterns
- Implemented null return from API instead of throwing errors for graceful degradation
- Added scan counter as fourth metadata item with green color to indicate engagement
- Used Eye icon from lucide-vue-next for scan visualization
- Followed existing i18n patterns with nested key structure
