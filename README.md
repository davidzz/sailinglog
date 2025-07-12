# SailingLog - Strava for Sailing

A comprehensive sailing activity tracking platform that allows sailors to upload, analyze, and share their sailing adventures.

## Features

### Core Functionality
- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **GPX File Upload** - Upload and parse sailing track files
- **Interactive Maps** - View sailing routes with detailed track visualization
- **Performance Analytics** - Advanced sailing performance analysis including VMG, tack efficiency, and insights
- **Weather Integration** - Historical weather data overlay for sessions
- **Public Sharing** - Generate shareable links for sailing sessions

### Analytics & Insights
- Speed analysis (max, average, upwind, downwind)
- Tack and jibe counting
- VMG (Velocity Made Good) calculations
- Wind angle analysis
- Performance recommendations

### Future Features
- Garmin device integration (architecture planned)
- Real-time weather overlays
- Social features and activity feeds
- Advanced performance comparisons

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google Provider
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Weather**: OpenWeatherMap API
- **Deployment**: AWS (ECS Fargate, RDS, ECR)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- OpenWeatherMap API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sailinglog.git
cd sailinglog
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL="postgresql://username:password@localhost:5432/sailinglog"
OPENWEATHER_API_KEY=your-openweather-api-key
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
sailinglog/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility libraries
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── prisma/              # Database schema and migrations
├── aws/                 # AWS deployment configuration
├── docs/                # Documentation
└── public/              # Static assets
```

## Key Components

### Authentication
- `AuthProvider` - NextAuth.js session provider
- Google OAuth integration with user profile management

### File Processing
- `GPXUpload` - Drag-and-drop GPX file upload
- `gpx-parser.ts` - GPX file parsing and track point extraction
- `analytics.ts` - Performance metrics calculation

### Visualization
- `SailingMap` - Interactive Leaflet map with route display
- `SessionCard` - Activity summary cards
- `WeatherDisplay` - Weather conditions visualization
- `PerformanceInsights` - Analytics and recommendations

## Deployment

### AWS Infrastructure

The application is designed for deployment on AWS using:
- **ECS Fargate** for containerized application hosting
- **RDS PostgreSQL** for database
- **ECR** for container registry
- **Application Load Balancer** for traffic distribution

### Deployment Steps

1. **Build Infrastructure**
```bash
cd aws
terraform init
terraform plan
terraform apply
```

2. **Configure GitHub Secrets**
Set up the following secrets in your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

3. **Push to Main Branch**
The GitHub Actions workflow will automatically build and deploy the application.

### Environment Configuration

Configure the following AWS Secrets Manager secrets:
- `sailinglog/database-url`
- `sailinglog/nextauth-secret`
- `sailinglog/google-client-id`
- `sailinglog/google-client-secret`
- `sailinglog/openweather-api-key`

## API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### Sessions
- `GET /api/sessions` - Fetch user's sailing sessions
- `POST /api/sessions` - Create new sailing session

### Sharing
- `POST /api/share/[sessionId]` - Create public share link
- `DELETE /api/share/[sessionId]` - Remove public sharing

### Weather
- `GET /api/weather` - Fetch historical weather data

### Health Check
- `GET /api/health` - Application health status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.