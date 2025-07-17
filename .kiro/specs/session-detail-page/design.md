# Design Document

## Overview

The Session Detail Page is a comprehensive view component that provides in-depth analysis and visualization of individual sailing sessions. It serves as the primary interface for sailors to review their performance, analyze their routes, and understand their sailing data in detail.

## Architecture

### Component Structure
```
SessionDetail (Main Container)
├── Header (Navigation & Title)
├── Stats Overview (Key Metrics Cards)
├── Tabbed Content Area
│   ├── Overview Tab
│   │   ├── SailingMap (Interactive Route Display)
│   │   └── Session Summary (Detailed Information)
│   ├── Analytics Tab
│   │   └── PerformanceInsights (Metrics & Analysis)
│   └── Weather Tab
│       └── WeatherDisplay (Conditions & Data)
└── ShareButton (Public Sharing Controls)
```

### Navigation Flow
- Dashboard → SessionCard click → SessionDetail
- SessionDetail → Back button → Dashboard
- State management through React useState for selected session ID

## Components and Interfaces

### SessionDetail Component
**Props:**
- `sessionId: string` - Unique identifier for the session
- `onBack: () => void` - Callback function to return to dashboard

**State:**
- `session: SailingSession | null` - Current session data
- `loading: boolean` - Loading state indicator
- `activeTab: 'overview' | 'analytics' | 'weather'` - Current tab selection

### API Integration
**Endpoint:** `GET /api/sessions/[id]`
- Fetches complete session data including track points
- Returns formatted session with parsed weather data
- Handles error cases (404 for not found, 500 for server errors)

### SailingMap Integration
- Reuses existing SailingMap component
- Displays full route with start/end markers
- Interactive Leaflet map with OpenStreetMap tiles
- Automatic bounds fitting for optimal view

## Data Models

### Enhanced Session Data Structure
```typescript
interface SailingSession {
  id: string
  userId: string
  name: string
  date: Date
  duration: number        // seconds
  distance: number        // nautical miles
  maxSpeed: number        // knots
  avgSpeed: number        // knots
  trackPoints: TrackPoint[]
  weatherData?: WeatherData
  isPublic: boolean
  shareToken?: string
}

interface TrackPoint {
  lat: number
  lon: number
  time: Date
  speed?: number          // knots
  elevation?: number      // meters
}
```

### Performance Metrics Calculation
```typescript
interface PerformanceMetrics {
  trackPoints: number
  totalTurns: number
  avgSpeed: number        // knots
  maxSpeed: number        // knots
  distance: number        // nautical miles
  duration: number        // seconds
}
```

## Error Handling

### Loading States
- Display spinner during data fetching
- Handle network timeouts gracefully
- Show appropriate error messages for failed requests

### Data Validation
- Verify session exists before rendering
- Handle missing track points gracefully
- Provide fallback displays for incomplete data

### GPS Data Quality
- Filter unrealistic speed calculations
- Handle GPS noise and signal gaps
- Provide data quality indicators to users

## Testing Strategy

### Unit Tests
- Component rendering with mock data
- Speed calculation accuracy
- Navigation state management
- Tab switching functionality

### Integration Tests
- API endpoint response handling
- Map component integration
- Share functionality workflow
- Error state handling

### Performance Tests
- Large track point dataset handling
- Map rendering performance
- Memory usage with multiple sessions

## Speed Calculation Algorithm

### Filtering Strategy
1. **Time Gap Filtering:** Only use GPS points 5-60 seconds apart
2. **Speed Range Filtering:** Accept speeds between 0.5-25 knots
3. **Statistical Smoothing:** Use 95th percentile for maximum speed
4. **Noise Reduction:** Ignore stationary GPS drift

### Conversion Formulas
- **Distance:** Haversine formula for great circle distance
- **Speed:** (distance_meters / time_seconds) × 1.94384 = knots
- **Distance Units:** meters ÷ 1852 = nautical miles

### Quality Indicators
- Track point count assessment
- Speed reading validity percentage
- GPS signal quality estimation

## User Experience Design

### Visual Hierarchy
1. **Primary:** Session name and date
2. **Secondary:** Key statistics in colored cards
3. **Tertiary:** Detailed information in tabs

### Color Coding
- **Blue:** Distance metrics
- **Green:** Time-based metrics  
- **Orange:** Maximum values
- **Purple:** Average values

### Responsive Design
- Mobile-first approach
- Collapsible statistics on small screens
- Touch-friendly tab navigation
- Optimized map controls for mobile

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Alternative text for visual elements

## Performance Considerations

### Data Loading
- Lazy load track points only when needed
- Implement pagination for large datasets
- Cache session data in component state

### Map Rendering
- Optimize polyline rendering for large tracks
- Implement viewport-based point filtering
- Use map clustering for dense track areas

### Memory Management
- Clean up map instances on component unmount
- Limit concurrent map instances
- Implement data cleanup on navigation