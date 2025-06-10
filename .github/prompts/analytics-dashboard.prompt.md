---
description: 'Create a comprehensive analytics dashboard component'
---

You are creating a new analytics dashboard component for the CEM QR Generator application. This should display key metrics, charts, and insights about link performance and user engagement.

## Requirements

The analytics dashboard should include:
- **Overview Cards**: Total links, total clicks, conversion rates, top performing links
- **Time-based Charts**: Click trends over time with different time ranges (day, week, month)
- **Geographic Data**: World map showing click locations and top countries/regions
- **Device Analytics**: Breakdown by device types, browsers, and operating systems
- **Real-time Metrics**: Live click feed and real-time visitor count
- **Export Features**: Ability to export data as CSV or PDF reports

## Technical Specifications

1. **Data Fetching**: Use the existing analytics API endpoints in `server/api/stats/` and `server/api/logs/`
2. **Visualization**: Leverage the existing `@unovis/vue` charts library and `globe.gl` for maps
3. **State Management**: Create composables for analytics data management
4. **Filtering**: Implement date range pickers, link filtering, and real-time updates
5. **Performance**: Use proper caching and pagination for large datasets
6. **Responsive Design**: Ensure mobile-friendly layout with proper breakpoints

## Component Structure

Create the following files:
- `app/components/dashboard/analytics/Overview.vue` - Main dashboard layout
- `app/components/dashboard/analytics/MetricCard.vue` - Reusable metric display
- `app/components/dashboard/analytics/TimeChart.vue` - Time-based analytics chart
- `app/components/dashboard/analytics/GeographicMap.vue` - World map component
- `app/components/dashboard/analytics/DeviceBreakdown.vue` - Device analytics
- `app/components/dashboard/analytics/RealtimeFeed.vue` - Live activity feed
- `composables/useAnalytics.ts` - Analytics data management
- `schemas/analytics.ts` - Analytics data schemas

## Design Requirements

Follow the existing design system:
- Use the same card layouts and spacing as other dashboard components
- Implement proper loading states and skeleton screens
- Add hover effects and interactive elements
- Use the existing color palette and typography
- Include proper accessibility attributes
- Support dark/light mode themes

Reference existing components like `app/components/dashboard/links/` for patterns and styling consistency.

Implement this step by step, starting with the basic structure and core functionality.
