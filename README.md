# Parking Management System

A complete parking management system with backend API, frontend UI, and database ready to run via Docker Compose.

## Features

### Authentication & Authorization
- JWT-based authentication
- Two user roles: Admin and Operator
- Password hashing with bcrypt
- Role-based access control for API endpoints and UI routes

### Core Functionality

#### Vehicle & Parking Management
- **Check-in**: Register vehicle with plate, type (car/moto/PCD), and automatically assign available slot
- **Check-out**: Calculate parking fee and process payment
- **Slot Management**: Track occupancy and availability by vehicle type
- **Vehicle Registry**: Maintain vehicle history and search functionality

#### Pricing System
- Free tolerance period (default: 15 minutes)
- Prorated hourly billing (configurable fraction)
- Daily cap to limit maximum charges
- Lost ticket fee support
- Configurable pricing rules (Admin only)

#### Monthly Subscribers (Mensalistas)
- Register vehicles with monthly plans
- Automatic fee-free parking for active subscribers
- Plan start/end date management
- Admin-only access

#### Payments
- Support multiple payment methods (Cash, Credit Card, Debit Card, PIX)
- Payment tracking per stay
- No external gateway integration

#### Reports (Admin Only)
- Current occupancy statistics
- Historical stay records
- Daily revenue summaries
- Revenue breakdown by payment method

### API
- RESTful endpoints with validation
- Swagger/OpenAPI documentation at `/api/docs`
- Pagination on list endpoints
- Comprehensive error handling

### Frontend
- React with Vite and Tailwind CSS
- Protected routes with role-based access
- Responsive design
- Screens for:
  - Login
  - Dashboard (occupancy and quick stats)
  - Check-in
  - Check-out
  - Vehicles management
  - Monthly subscribers (Admin)
  - Pricing configuration (Admin)
  - Reports (Admin)

## Prerequisites

### Docker Deployment (Recommended)
- Docker Engine 20.10+
- Docker Compose v2.0+

### Local Development
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## Quick Start with Docker

### Option 1: Windows Automated Setup (Recommended for Windows users)

1. **Clone the repository**
```bash
git clone <repository-url>
cd SISTEMA-DE-ESTACIONAMENTO
```

2. **Run the automated setup script**
```cmd
run_parking_system.bat
```

The script will:
- Check for Docker and Docker Compose
- Create `.env` files from examples
- Install dependencies (if Node.js is available)
- Build and start all services with Docker Compose
- Display access URLs and default credentials

### Option 2: Manual Docker Setup (Cross-platform)

1. **Clone the repository**
```bash
git clone <repository-url>
cd SISTEMA-DE-ESTACIONAMENTO
```

2. **Start all services**
```bash
docker-compose up --build
```

### Access the Application

- Frontend: http://localhost:3001
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

### Default Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Operator**: username: `operator`, password: `operator123`

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection details
```

4. **Start development server**
```bash
npm run start:dev
```

The API will be available at http://localhost:3000 and Swagger docs at http://localhost:3000/api/docs

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with API URL (default: http://localhost:3000)
```

4. **Start development server**
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=parking_system

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Pricing Defaults
PRICING_FREE_TOLERANCE_MINUTES=15
PRICING_PRORATED_FRACTION_MINUTES=60
PRICING_HOURLY_RATE=5.00
PRICING_DAILY_CAP=50.00
PRICING_LOST_TICKET_FEE=100.00

# API
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## Testing

### Backend Tests

Run unit tests (including pricing calculation tests):
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

Run specific test file:
```bash
npm test -- pricing.service.spec
```

### Pricing Calculation Tests

The system includes comprehensive tests for:
- Free tolerance period (15 minutes)
- Prorated hourly billing
- Daily cap application
- Lost ticket fees
- Multi-day stays

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Stays
- `POST /stays/check-in` - Check-in a vehicle
- `POST /stays/check-out` - Check-out a vehicle
- `GET /stays` - List all stays (paginated)
- `GET /stays/active` - List active stays
- `GET /stays/:id` - Get stay details

### Parking Slots
- `GET /slots` - List all parking slots
- `GET /slots/occupancy` - Get occupancy statistics
- `POST /slots` - Create slot (Admin)
- `PUT /slots/:id` - Update slot (Admin)
- `DELETE /slots/:id` - Delete slot (Admin)

### Vehicles
- `GET /vehicles` - List all vehicles (paginated)
- `GET /vehicles/search?q=` - Search vehicles
- `GET /vehicles/:plate` - Get vehicle by plate

### Payments
- `POST /payments` - Create payment
- `GET /payments` - List all payments (paginated)

### Monthly Subscribers
- `GET /subscribers` - List all subscribers (paginated)
- `GET /subscribers/active` - List active subscribers
- `POST /subscribers` - Create subscriber (Admin)
- `PUT /subscribers/:id` - Update subscriber (Admin)
- `DELETE /subscribers/:id` - Delete subscriber (Admin)

### Pricing
- `GET /pricing` - List all pricing tables
- `GET /pricing/active` - Get active pricing table
- `POST /pricing` - Create pricing table (Admin)
- `PUT /pricing/:id` - Update pricing table (Admin)

### Reports
- `GET /reports/revenue` - Revenue report (Admin)
- `GET /reports/daily` - Daily report (Admin)
- `GET /reports/occupancy-history` - Occupancy history (Admin)

## Database Schema

The system uses PostgreSQL with the following entities:

- **users**: System users (Admin/Operator)
- **vehicles**: Registered vehicles
- **parking_slots**: Parking spaces by type (car/moto/PCD)
- **stays**: Check-in/check-out records
- **pricing_tables**: Pricing configuration
- **payments**: Payment records
- **monthly_subscribers**: Monthly subscription records

## Default Data Seeded

On first run, the system automatically seeds:

1. **Users**
   - Admin user (admin/admin123)
   - Operator user (operator/operator123)

2. **Parking Slots**
   - 20 car slots (C-01 to C-20)
   - 10 motorcycle slots (M-01 to M-10)
   - 5 PCD slots (P-01 to P-05)

3. **Pricing Table**
   - Uses environment variable defaults
   - Free tolerance: 15 minutes
   - Hourly rate: $5.00
   - Daily cap: $50.00
   - Lost ticket fee: $100.00

## Managing Docker Services

### View Service Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

## Lint and Format

### Backend
```bash
cd backend
npm run lint
npm run format
```

### Frontend
Built-in Vite linting during development.

## Production Deployment

1. **Update environment variables** in `docker-compose.yml`:
   - Change `JWT_SECRET` to a secure random string
   - Update database credentials
   - Set `NODE_ENV=production`

2. **Build and start services**
```bash
docker-compose up -d --build
```

3. **Check service status**
```bash
docker-compose ps
```

4. **View logs**
```bash
docker-compose logs -f
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify port 5432 is not in use

### Frontend Can't Connect to API
- Verify API is running on correct port
- Check VITE_API_URL in frontend .env
- Ensure CORS is configured correctly

### Docker Build Fails
- Clear Docker cache: `docker-compose build --no-cache`
- Ensure sufficient disk space
- Check Docker daemon is running

## Technology Stack

- **Backend**: Node.js, NestJS, TypeORM, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

