# Weather App

A full-stack weather application demonstrating professional development practices with a FastAPI backend, React frontend, and comprehensive testing.

## Features

- **Real-time Weather Data**: Get current weather conditions and 7-day forecasts for any city
- **Fast & Responsive**: Optimized API with 10-minute caching for improved performance
- **Type-Safe**: TypeScript strict mode on frontend, type hints throughout backend
- **Comprehensive Testing**: 24 backend tests + 155 frontend tests (100% critical path coverage)
- **Professional Architecture**: Layered backend structure, component-based frontend, clean separation of concerns

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Runtime**: Uvicorn (ASGI)
- **Data Validation**: Pydantic
- **HTTP Client**: httpx
- **Testing**: pytest + pytest-asyncio

### Frontend
- **Framework**: React 19.2.4
- **Language**: TypeScript 4.9.5 (strict mode)
- **Styling**: Tailwind CSS 4.2.2
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

### External APIs
- **Weather Data**: Open-Meteo API (free, no key required)
- **Geocoding**: Open-Meteo Geocoding API

## Project Structure

```
weather-app/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app initialization
│   │   ├── api/weather.py       # 3 API endpoints
│   │   ├── services/weather.py  # Business logic (WeatherService)
│   │   ├── schemas/weather.py   # Pydantic models
│   │   ├── core/
│   │   │   ├── config.py        # Environment configuration
│   │   │   └── logging.py       # Logging setup
│   │   └── utils/cache.py       # Caching mechanism
│   ├── tests/
│   │   ├── unit/                # Unit tests (10 tests)
│   │   └── integration/         # Integration tests (14 tests)
│   ├── requirements.txt
│   └── README.md                # Backend-specific documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/          # 6 React components
│   │   ├── services/            # API client + WeatherService
│   │   ├── hooks/               # useWeather custom hook
│   │   ├── types/               # TypeScript interfaces
│   │   └── App.tsx              # Root component
│   ├── tests/                   # 155 test cases
│   ├── package.json
│   └── README.md                # Frontend-specific documentation
│
├── .env.example                 # Environment template
└── .env.production              # Production config (gitignored)
```

## Quick Start

### Prerequisites
- **Node.js**: 16+ (for frontend)
- **Python**: 3.9+ (for backend)
- **Git**: For version control

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd weather-app
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Run the server
uvicorn src.main:app --reload
```

Backend will be available at: `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm start
```

Frontend will be available at: `http://localhost:3000`

## API Documentation

### Endpoints

#### Health Check
```bash
GET /health

Response: 200 OK
{
  "status": "OK"
}
```

#### Get Current Weather
```bash
GET /weather/{city}

Example: GET /weather/London

Response: 200 OK
{
  "city": "London",
  "temperature": 15,
  "condition": "Partly Cloudy",
  "humidity": 65,
  "windSpeed": 12
}

Error Cases:
- 404: City not found
- 500: API error
```

#### Get 7-Day Forecast
```bash
GET /forecast/{city}

Example: GET /forecast/London

Response: 200 OK
{
  "city": "London",
  "days": [
    {
      "date": "2026-04-08",
      "maxTemp": 18,
      "minTemp": 10,
      "condition": "Sunny"
    },
    ...
  ]
}

Error Cases:
- 404: City not found
- 500: API error
```

## Testing

### Run Tests

**Backend Tests**
```bash
cd backend
pytest tests/                    # Run all tests
pytest tests/ -v                 # Verbose output
pytest tests/unit/               # Unit tests only
pytest tests/integration/        # Integration tests only
```

**Frontend Tests**
```bash
cd frontend
npm test                         # Watch mode (interactive)
npm run test:ci                  # CI mode (runs once)
npm run test:coverage            # With coverage report
```

### Test Coverage

- **Backend**: 24/24 tests passing (100%)
  - 10 unit tests (cache, services)
  - 14 integration tests (API endpoints)

- **Frontend**: 155/155 tests passing (100%)
  - 93 component tests
  - 7 service tests
  - 6 hook tests
  - 59 integration tests

## Environment Variables

### Backend (`.env`)

Copy `.env.example` to `.env` and configure:

```bash
ENVIRONMENT=development          # development or production
DEBUG=true                        # true for dev, false for prod
LOG_LEVEL=DEBUG                   # DEBUG, INFO, WARNING, ERROR
OPEN_METEO_API_BASE_URL=https://api.open-meteo.com/v1
```

### Frontend (`.env`)

Copy `.env.example` to `.env` and configure:

```bash
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

## Architecture

### Backend Architecture

**Layered Architecture**:
```
Routes (API endpoints)
    ↓
Services (Business logic)
    ↓
External APIs (Open-Meteo)
```

**Key Components**:
- **Routes**: 3 endpoints (health, weather, forecast)
- **Services**: WeatherService with methods for coordinates, current weather, and forecasts
- **Caching**: 10-minute TTL on city coordinates (~70% API call reduction)
- **Logging**: Environment-based (DEBUG in dev, WARNING in prod)
- **Configuration**: Centralized in `core/config.py`

See [Backend README](./backend/README.md) for detailed documentation.

### Frontend Architecture

**Component Structure**:
```
App.tsx (root)
├── ErrorBoundary
├── Header
├── SearchBar
├── LoadingSpinner
├── ErrorDisplay
├── WeatherCard
└── ForecastCard
```

**State Management**:
- Custom `useWeather` hook for state
- Dependency injection for services
- Error boundaries for resilience

See [Frontend README](./frontend/README.md) for detailed documentation.

## Performance

- **Caching**: Backend caches city coordinates for 10 minutes
- **Memoization**: Frontend services memoized to prevent recreations
- **Async/Await**: Non-blocking I/O on backend endpoints
- **Parallel Requests**: Frontend fetches weather + forecast simultaneously

## License

MIT License - See LICENSE file for details
