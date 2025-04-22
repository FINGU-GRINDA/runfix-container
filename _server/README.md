# RunFix Translation Server

A high-performance remote translation server built with Elysia.js and Bun, designed to provide scalable and consistent translation services across multiple languages.

## Features

### Core Technologies

- **Elysia.js & Bun**: Ultra-fast server implementation for high-throughput translation requests
- **API Documentation**: Comprehensive API documentation using Scalar
- **Multi-user Support**: User management with role-based access control
- **Multi-organization Support**: Organization management with role-based access control
- **Multi-project Support**: Project management with role-based access control
- **API Key Management**: Secure API key generation and validation for authenticated access
- **Redis Caching**: Distributed caching for improved performance and scalability
- **PostgreSQL Database**: Relational database for consistent translation storage and retrieval

### Translation Capabilities

- Support for multiple languages including English, Korean, Japanese, Chinese, Uzbek, Vietnamese, Russian, Kazakh, Mongolian, Thai, and Indonesian
- Translation history tracking and logging
- User-specific translation management

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database
- Redis server

### Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the following variables in your `.env` following `.env.example`:

### Installation

```bash
# Install dependencies
bun install

# Run database migrations
bun prisma migrate dev
```

### Running the Server

#### Development Mode

```bash
bun run dev
```

#### Production Mode

```bash
bun run start
```

### Docker Deployment

You can also run the server using Docker:

```bash
# Build and start the containers
docker-compose up -d
```

## API Documentation

API documentation is available at `/docs` when the server is running. The documentation is generated using Scalar and provides interactive examples for all endpoints.

## Authentication

The server supports multiple authentication methods:

1. **API Key Authentication**: For service-to-service communication
2. **Email/Password**: Traditional user authentication
3. **Passkey Authentication**: WebAuthn-based passwordless authentication

### API Key Management

Users can generate and manage API keys through the provided endpoints:

- `POST /api/keys` - Generate a new API key
- `GET /api/keys` - List all API keys for the authenticated user
- `DELETE /api/keys/:id` - Revoke a specific API key

## Database Schema

The server uses Prisma ORM with PostgreSQL. Key models include:

- **User**: User management with role-based access control
- **ApiKey**: API key management for authenticated access
- **Translation**: Stores translations across multiple languages
- **TranslationLog**: Tracks translation history and usage

## Caching Strategy

Redis is used for caching frequently requested translations to improve performance:

- Translation results are cached with configurable TTL
- Distributed caching enables horizontal scaling
- Cache invalidation occurs on new translations or updates

## Admin dashboard
Currently client app for this api is not developed. To edit translation (as admin), you can use prisma studio.

```bash
bunx prisma generate
bunx prisma studio
```
![prisma studio ui](image.png)
![translation ui](image-1.png)

here you can edit / correct the translations

## Performance Considerations

- The server is built on Bun and Elysia.js for maximum performance
- Optimized database queries with proper indexing
- Efficient caching strategies to minimize database load

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap / Feature

- [ ] add support for context when doing translation, context will be infered from project description
- [ ] logging of translation, to see which translation is used and how many times

## License

This project is licensed under the MIT License - see the LICENSE file for details.
