# Investment Idea Generator Server

This is the server implementation for the Investment Idea Generator project, a system designed to process financial news, analyze historical market impact patterns, and generate probabilistic investment ideas.

## Technology Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Elysia.js](https://elysiajs.com/) - High-performance TypeScript API framework
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Authentication**: Bearer token with JWT
- **API Documentation**: Swagger/OpenAPI
- **Observability**: OpenTelemetry
- **Error Handling**: elysia-http-error
- **Rate Limiting**: elysia-rate-limit

## Prerequisites

- Bun v1.x or higher
- PostgreSQL (or Docker for containerized setup)
- Redis (or Docker for containerized setup)

## Environment Setup

Create a `.env` file based on the following template:

```
DATABASE_URL="postgresql://user:password@localhost:5432/investment_ideas"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
PORT=3000
# Add other environment-specific variables as needed
```

## Installation

```bash
# Install dependencies
bun install

# Run database migrations
bun prisma migrate dev
```

## Development

```bash
# Start development server with hot reload
bun dev
```

The server will be available at http://localhost:3000

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/swagger
```

## Key Endpoints

- **Authentication**: `/auth/*`
- **News**: `/news/*`
- **Organizations**: `/organizations/*`
- **Users**: `/users/*`
- **Investment Ideas**: `/investment-ideas/*`

## Docker Deployment

```bash
# Build and start services defined in compose.yml
docker-compose up -d
```

## Production

```bash
# Start production server
bun start
```

## Code Structure

- `src/deps/`: External dependency initialization
- `src/plugins/`: Elysia plugins
- `src/routes/`: API endpoints
- `src/utils/`: Utility functions
- `prisma/`: Database schema and migrations
