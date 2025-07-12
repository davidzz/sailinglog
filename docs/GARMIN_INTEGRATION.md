# Garmin Device Integration Architecture

## Overview
This document outlines the planned integration with Garmin devices for direct data import into SailingLog.

## Integration Options

### 1. Garmin Connect IQ API
- **Description**: Official API for accessing Garmin Connect data
- **Requirements**: 
  - Developer account with Garmin
  - OAuth 2.0 authentication
  - User consent for data access
- **Data Available**: Activities, track points, device info, weather data
- **Implementation**: REST API calls to fetch user activities

### 2. FIT File Processing
- **Description**: Direct processing of Garmin's FIT (Flexible and Interoperable Data Transfer) files
- **Requirements**:
  - FIT SDK integration
  - File upload mechanism
- **Advantages**: Rich data including heart rate, cadence, power (if available)
- **Implementation**: Parse FIT files client-side or server-side

### 3. Garmin Express Integration
- **Description**: Desktop application integration
- **Challenges**: Limited web access, requires desktop app
- **Use Case**: Batch import for power users

## Recommended Implementation Plan

### Phase 1: FIT File Support
```typescript
// lib/fit-parser.ts
export interface FITData {
  activities: FITActivity[]
  sessions: FITSession[]
  records: FITRecord[]
}

export interface FITActivity {
  timestamp: Date
  sport: string
  subSport: string
  totalDistance: number
  totalTime: number
}

export interface FITRecord {
  timestamp: Date
  positionLat: number
  positionLong: number
  speed: number
  heartRate?: number
  cadence?: number
  power?: number
}
```

### Phase 2: Garmin Connect API Integration
```typescript
// lib/garmin-connect.ts
export class GarminConnectAPI {
  async authenticateUser(): Promise<string>
  async getActivities(accessToken: string): Promise<GarminActivity[]>
  async getActivityDetails(activityId: string): Promise<GarminActivityDetail>
  async downloadGPX(activityId: string): Promise<string>
}
```

### Phase 3: Real-time Sync
- Webhook support for automatic activity import
- Background sync service
- Conflict resolution for duplicate activities

## Database Schema Extensions

```sql
-- Add Garmin-specific fields to existing schema
ALTER TABLE SailingSession ADD COLUMN garmin_activity_id VARCHAR(255);
ALTER TABLE SailingSession ADD COLUMN fit_data TEXT;
ALTER TABLE SailingSession ADD COLUMN sync_source VARCHAR(50) DEFAULT 'manual';

-- New table for Garmin integration
CREATE TABLE GarminIntegration (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP NOT NULL,
  last_sync_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id)
);
```

## UI Components

### GarminConnectButton
```typescript
interface GarminConnectButtonProps {
  onConnect: () => void
  isConnected: boolean
}
```

### AutoSyncSettings
```typescript
interface AutoSyncSettingsProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  lastSync?: Date
}
```

## API Endpoints

```typescript
// /api/garmin/auth
POST /api/garmin/auth - Initiate OAuth flow
GET /api/garmin/callback - Handle OAuth callback

// /api/garmin/activities
GET /api/garmin/activities - Fetch user's Garmin activities
POST /api/garmin/import/:activityId - Import specific activity

// /api/garmin/sync
POST /api/garmin/sync - Trigger manual sync
GET /api/garmin/sync/status - Check sync status
```

## Security Considerations

1. **Token Storage**: Encrypt access/refresh tokens in database
2. **Scope Limitation**: Request minimal required permissions
3. **Rate Limiting**: Respect Garmin API rate limits
4. **Data Privacy**: Clear user consent for data access
5. **Token Rotation**: Implement automatic token refresh

## Testing Strategy

1. **Unit Tests**: FIT file parsing, data conversion
2. **Integration Tests**: Garmin API calls with mock data
3. **E2E Tests**: Full import flow simulation
4. **Performance Tests**: Large activity import handling

## Future Enhancements

1. **Multi-device Support**: Support for other fitness devices (Polar, Suunto)
2. **Live Tracking**: Real-time activity tracking during sailing
3. **Device Recommendations**: Suggest optimal Garmin devices for sailing
4. **Advanced Analytics**: Heart rate zones, effort analysis
5. **Social Features**: Compare activities with other Garmin users

## Implementation Timeline

- **Week 1-2**: FIT file parser development
- **Week 3-4**: Basic Garmin Connect API integration
- **Week 5-6**: UI components and user flow
- **Week 7-8**: Testing and refinement
- **Week 9-10**: Documentation and deployment

## Dependencies

```json
{
  "fit-file-parser": "^1.9.1",
  "garmin-connect": "^1.4.0",
  "@types/fit-file-parser": "^1.9.0"
}
```