# DisasterIQ — Disaster Intelligence & Emergency Response Platform

> Production-grade full-stack platform for real-time disaster monitoring, emergency coordination, and AI-powered risk prediction. Built with a dark command-center aesthetic inspired by NASA mission control and military operations dashboards.

---

## Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Frontend     | React + TypeScript + TailwindCSS v4         |
| Backend      | Node.js + Express                           |
| Database     | PostgreSQL + Prisma ORM                     |
| Realtime     | Socket.io                                   |
| Maps         | Leaflet.js + CartoDB Dark Matter tiles      |
| Auth         | JWT (httpOnly cookies)                       |
| External API | OpenWeatherMap                              |
| Deployment   | Docker + docker-compose                     |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Docker)
- npm

### Development (without Docker)

```bash
# 1. Clone and setup
cp .env.example .env

# 2. Backend
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev

# 3. Frontend (in another terminal)
cd client
npm install
npm run dev
```

### Docker Deployment

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- PostgreSQL: localhost:5432

## Demo Credentials

| Role      | Email                      | Password |
| --------- | -------------------------- | -------- |
| Admin     | admin@disasteriq.gov       | admin123 |
| Authority | authority@disasteriq.gov   | user123  |
| Volunteer | volunteer@disasteriq.org   | user123  |
| Citizen   | citizen@example.com        | user123  |

## Pages

1. **Auth** — Animated login with role selection and emergency responder access
2. **Command Center Dashboard** — 3-column layout with Leaflet map, incident feed, and alerts
3. **Emergency Help Request** — Type grid, GPS auto-fill, SMS fallback format
4. **Volunteer Coordination** — Roster management with skill tags and deployment controls
5. **Shelter & Aid Finder** — Filterable shelters/hospitals with capacity bars and directions
6. **Family Safety Net** — Mark safe, search family members, safety badges
7. **Resource Donations** — Progress tracking, critical need badges, pledge functionality
8. **Infrastructure Damage Report** — Type grid, severity selector, photo drag-and-drop
9. **AI Risk Prediction** — 72-hour forecasts, animated risk scores, satellite mock
10. **Admin Control Center** — Metrics dashboard, help request operations table

## API Routes

```
POST   /auth/login
POST   /auth/register
GET    /auth/me

GET    /incidents
POST   /incidents

GET    /help-requests
POST   /help-requests
PATCH  /help-requests/:id/assign

GET    /volunteers
POST   /volunteers

GET    /shelters
POST   /shelters

GET    /resources
POST   /resources/:id/pledge

GET    /damage-reports
POST   /damage-reports

GET    /family/:userId/safety
POST   /family/:userId/safety

GET    /alerts

GET    /weather/:lat/:lon
GET    /ai-risk/:region
GET    /admin/dashboard
```

## Project Structure

```
disasteriq/
├── client/
│   ├── src/
│   │   ├── pages/       # All 10 application pages
│   │   ├── components/  # Layout and shared components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── store/       # Zustand auth store
│   │   ├── services/    # API client and Socket.io
│   │   ├── types/       # TypeScript interfaces
│   │   └── index.css    # Design system
│   ├── Dockerfile
│   └── nginx.conf
├── server/
│   ├── src/
│   │   ├── routes/      # Express route handlers
│   │   ├── middleware/   # Auth, RBAC, region filter
│   │   ├── sockets/     # Socket.io event handlers
│   │   └── index.js     # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## License

MIT
