# Requirements Document

## Introduction

The Session Detail Page feature provides sailors with a comprehensive view of their individual sailing sessions, displaying detailed analytics, interactive maps, performance insights, and weather information. This feature transforms the basic session list into an in-depth analysis tool that helps sailors understand their performance and track their progress over time.

## Requirements

### Requirement 1

**User Story:** As a sailor, I want to view detailed information about a specific sailing session, so that I can analyze my performance and review my route.

#### Acceptance Criteria

1. WHEN a user clicks on a session card from the dashboard THEN the system SHALL navigate to a detailed view of that session
2. WHEN the session detail page loads THEN the system SHALL display the session name, date, and key statistics prominently
3. WHEN the session detail page loads THEN the system SHALL show distance in nautical miles and speeds in knots
4. IF the session has track points THEN the system SHALL display an interactive map showing the complete sailing route
5. WHEN the user views the session detail THEN the system SHALL provide a back button to return to the dashboard

### Requirement 2

**User Story:** As a sailor, I want to see accurate speed and distance calculations, so that I can trust the performance metrics shown.

#### Acceptance Criteria

1. WHEN calculating speeds from GPS data THEN the system SHALL filter out GPS noise by only using points 5-60 seconds apart
2. WHEN determining maximum speed THEN the system SHALL use the 95th percentile to avoid GPS spikes
3. WHEN displaying speeds THEN the system SHALL cap realistic sailing speeds at 25 knots maximum
4. WHEN calculating distances THEN the system SHALL convert from meters to nautical miles (1852m = 1nm)
5. WHEN calculating speeds THEN the system SHALL convert from m/s to knots using the factor 1.94384

### Requirement 3

**User Story:** As a sailor, I want to view my session data in different categories, so that I can focus on specific aspects of my sailing performance.

#### Acceptance Criteria

1. WHEN viewing a session detail THEN the system SHALL provide tabs for Overview, Analytics, and Weather
2. WHEN the Overview tab is selected THEN the system SHALL display the route map and session summary
3. WHEN the Analytics tab is selected THEN the system SHALL show performance insights and sailing metrics
4. WHEN the Weather tab is selected THEN the system SHALL display weather conditions if available
5. WHEN no weather data exists THEN the system SHALL show a message explaining weather data availability

### Requirement 4

**User Story:** As a sailor, I want to see performance analytics for my session, so that I can understand my sailing efficiency and identify areas for improvement.

#### Acceptance Criteria

1. WHEN viewing analytics THEN the system SHALL calculate and display the number of direction changes
2. WHEN viewing analytics THEN the system SHALL show track point count and data quality assessment
3. WHEN viewing analytics THEN the system SHALL provide sailing-specific insights based on performance
4. WHEN direction changes exceed 20 THEN the system SHALL indicate "high activity session"
5. WHEN average speed exceeds 15 knots THEN the system SHALL indicate favorable conditions

### Requirement 5

**User Story:** As a sailor, I want to share my sailing sessions publicly, so that I can showcase my adventures with others.

#### Acceptance Criteria

1. WHEN viewing a session detail THEN the system SHALL provide a share button
2. WHEN the share button is clicked THEN the system SHALL create a public share link
3. WHEN a share link is created THEN the system SHALL copy the link to the clipboard
4. WHEN a session is already shared THEN the system SHALL allow the user to make it private again
5. WHEN making a session private THEN the system SHALL remove the public share access

### Requirement 6

**User Story:** As a sailor, I want to see my session statistics clearly displayed, so that I can quickly understand my performance.

#### Acceptance Criteria

1. WHEN viewing session details THEN the system SHALL display distance, duration, max speed, and average speed prominently
2. WHEN displaying duration THEN the system SHALL format it as hours and minutes (e.g., "2h 45m")
3. WHEN displaying statistics THEN the system SHALL use appropriate color coding for visual distinction
4. WHEN calculating average pace THEN the system SHALL show minutes per nautical mile
5. WHEN displaying track information THEN the system SHALL show the total number of GPS points recorded