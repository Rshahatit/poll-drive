# Vote Ride Backend

A Node.js/TypeScript backend service that powers the Vote Ride platform, connecting voters with volunteer drivers to reach polling locations.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm/npm
- Railway CLI (for deployment)

### Local Development Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/vote-ride-backend.git
cd vote-ride-backend
```

2. Install dependencies

```bash
pnpm install
```

3. Set up your environment variables

```bash
cp .env.example .env
```

Required environment variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vote_ride?schema=public"
PORT=3000
GOOGLE_CIVIC_API_KEY=your_google_civic_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

5. Start the development server

```bash
pnpm dev
```

## 📚 API Documentation

### Authentication

Currently using a test authentication system for development. Include `Authorization: driver` header to authenticate as a driver, otherwise defaults to rider.

### Endpoints

#### Auth Routes

```http
POST /api/auth/register
GET /api/users/me
PUT /api/users/profile
```

#### Driver Routes

```http
POST /api/drivers/verify
GET /api/drivers/verification-status
PUT /api/drivers/details
PUT /api/drivers/location
PUT /api/drivers/availability
```

#### Location Routes

```http
GET /api/locations/polling
GET /api/drivers/available
```

#### Ride Routes

```http
POST /api/rides
PUT /api/rides/:rideId/cancel
GET /api/rides
GET /api/rides/:rideId
PUT /api/rides/:rideId/status
```

## 🗄️ Database Schema

Key models:

- users
- driver_verifications
- driver_details
- rides
- notifications
- user_preferences

View complete schema in `prisma/schema.prisma`

## 🚢 Deployment

### Deploying to Railway

1. Install Railway CLI

```bash
npm i -g @railway/cli
```

2. Login and init

```bash
railway login
railway init
```

3. Add PostgreSQL database

```bash
railway add
# Select Database -> PostgreSQL
```

4. Deploy

```bash
railway up
```

5. Seed production database (optional)

```bash
railway run npx prisma db seed
```

## 🧪 Testing

Currently using test authentication for easy development. Test users are automatically created when running seed script.

Test credentials:

- Driver: test_driver_123
- Rider: test_rider_123

Run tests:

```bash
pnpm test
```

## 📦 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── utils/          # Utility functions
└── app.ts          # App entry point
```

## 🔧 Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm test`: Run tests
- `pnpm lint`: Lint code
- `pnpm prisma:studio`: Open Prisma Studio

## 👥 Authors

- Your Name (@rshahatit)
