# Grinda i18n Translation Server Database Schema

This document outlines the database schema for the Grinda i18n Translation Server, including all tables, relationships, and field definitions.

## Overview

The database is designed to support:

- Translation caching and history
- API key management and rate limiting
- Usage statistics and monitoring
- Language configuration

## Schema Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     ApiKey      │     │  Translation    │     │  Language       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ key             │     │ sourceText      │     │ code            │
│ name            │     │ translatedText  │     │ name            │
│ userId          │     │ sourceLanguage  │     │ isActive        │
│ status          │     │ targetLanguage  │     │ createdAt       │
│ rateLimit       │     │ apiKeyId        │     │ updatedAt       │
│ createdAt       │     │ userId          │     └─────────────────┘
│ updatedAt       │     │ createdAt       │             │
└────────┬────────┘     │ updatedAt       │             │
         │              │ hash            │             │
         │              └────────┬────────┘             │
         │                       │                      │
         │                       │                      │
┌────────┴────────┐     ┌───────┴────────┐     ┌───────┴────────┐
│  ApiKeyUsage    │     │ TranslationStat │     │ LanguagePair   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ apiKeyId        │     │ sourceLanguage  │     │ sourceLanguage  │
│ count           │     │ targetLanguage  │     │ targetLanguage  │
│ requestSize     │     │ count           │     │ isSupported     │
│ ipAddress       │     │ characterCount  │     │ createdAt       │
│ userAgent       │     │ date            │     │ updatedAt       │
│ timestamp       │     │ userId          │     └─────────────────┘
└─────────────────┘     │ apiKeyId        │
                        └─────────────────┘
```

## Table Definitions

### User (Existing)

The `User` table is provided by Better Auth and already exists in the schema.

### ApiKey

Manages API access for external services and rate limiting.

| Field     | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| id        | String   | Primary key (UUID)                           |
| key       | String   | Unique API key string                        |
| name      | String   | Human-readable name for the API key          |
| userId    | String   | Foreign key to User                          |
| status    | Enum     | ACTIVE, INACTIVE, REVOKED                    |
| rateLimit | Integer  | Max requests per minute (null for unlimited) |
| createdAt | DateTime | Creation timestamp                           |
| updatedAt | DateTime | Last update timestamp                        |

### ApiKeyUsage

Tracks API key usage for rate limiting and analytics.

| Field       | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| id          | String   | Primary key (UUID)           |
| apiKeyId    | String   | Foreign key to ApiKey        |
| count       | Integer  | Number of requests           |
| requestSize | Integer  | Size of the request in bytes |
| ipAddress   | String   | IP address of the requester  |
| userAgent   | String   | User agent of the requester  |
| timestamp   | DateTime | When the request was made    |

### Translation

Stores translations for caching and history.

| Field          | Type     | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| id             | String   | Primary key (UUID)                               |
| sourceText     | String   | Original text                                    |
| translatedText | String   | Translated text                                  |
| sourceLanguage | String   | ISO 639-1 language code of source                |
| targetLanguage | String   | ISO 639-1 language code of target                |
| apiKeyId       | String   | Foreign key to ApiKey                            |
| userId         | String   | Foreign key to User                              |
| createdAt      | DateTime | Creation timestamp                               |
| updatedAt      | DateTime | Last update timestamp                            |
| hash           | String   | Hash of source text + languages for quick lookup |

### TranslationStat

Aggregates translation statistics for reporting.

| Field          | Type    | Description                       |
| -------------- | ------- | --------------------------------- |
| id             | String  | Primary key (UUID)                |
| sourceLanguage | String  | ISO 639-1 language code of source |
| targetLanguage | String  | ISO 639-1 language code of target |
| count          | Integer | Number of translations            |
| characterCount | Integer | Total characters translated       |
| date           | Date    | Date of the statistic             |
| userId         | String  | Foreign key to User (optional)    |
| apiKeyId       | String  | Foreign key to ApiKey (optional)  |

### Language

Defines supported languages in the system.

| Field     | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| id        | String   | Primary key (UUID)                      |
| code      | String   | ISO 639-1 language code                 |
| name      | String   | Language name in English                |
| isActive  | Boolean  | Whether language is currently supported |
| createdAt | DateTime | Creation timestamp                      |
| updatedAt | DateTime | Last update timestamp                   |

### LanguagePair

Defines valid source-target language pairs for translation.

| Field          | Type     | Description                             |
| -------------- | -------- | --------------------------------------- |
| id             | String   | Primary key (UUID)                      |
| sourceLanguage | String   | ISO 639-1 language code of source       |
| targetLanguage | String   | ISO 639-1 language code of target       |
| isSupported    | Boolean  | Whether this language pair is supported |
| createdAt      | DateTime | Creation timestamp                      |
| updatedAt      | DateTime | Last update timestamp                   |

## Prisma Schema

```prisma
model ApiKey {
  id            String         @id @default(uuid())
  key           String         @unique
  name          String
  userId        String
  status        ApiKeyStatus   @default(ACTIVE)
  rateLimit     Int?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  usages        ApiKeyUsage[]
  translations  Translation[]
  stats         TranslationStat[]

  @@map("api_key")
}

enum ApiKeyStatus {
  ACTIVE
  INACTIVE
  REVOKED
}

model ApiKeyUsage {
  id          String    @id @default(uuid())
  apiKeyId    String
  count       Int       @default(1)
  requestSize Int
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime  @default(now())

  apiKey      ApiKey    @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)

  @@map("api_key_usage")
}

model Translation {
  id             String    @id @default(uuid())
  sourceText     String    @db.Text
  translatedText String    @db.Text
  sourceLanguage String
  targetLanguage String
  apiKeyId       String?
  userId         String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  hash           String    @unique

  apiKey         ApiKey?   @relation(fields: [apiKeyId], references: [id], onDelete: SetNull)
  user           User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("translation")
  @@index([sourceLanguage, targetLanguage])
  @@index([hash])
}

model TranslationStat {
  id             String    @id @default(uuid())
  sourceLanguage String
  targetLanguage String
  count          Int       @default(0)
  characterCount Int       @default(0)
  date           DateTime  @db.Date
  userId         String?
  apiKeyId       String?

  user           User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  apiKey         ApiKey?   @relation(fields: [apiKeyId], references: [id], onDelete: SetNull)

  @@unique([sourceLanguage, targetLanguage, date, userId, apiKeyId])
  @@map("translation_stat")
}

model Language {
  id          String    @id @default(uuid())
  code        String    @unique
  name        String
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("language")
}

model LanguagePair {
  id             String    @id @default(uuid())
  sourceLanguage String
  targetLanguage String
  isSupported    Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@unique([sourceLanguage, targetLanguage])
  @@map("language_pair")
}
```

## Usage Examples

### Caching Translations

When a translation request is received:

1. Generate a hash of the source text and language pair
2. Check the `Translation` table for a matching hash
3. If found, return the cached translation
4. If not found, perform the translation and store the result

### Rate Limiting

When processing a request:

1. Retrieve the API key from the request headers
2. Query the `ApiKey` table to verify the key is valid and active
3. Count recent usages in `ApiKeyUsage` for the current minute
4. If usage exceeds the rate limit, reject the request
5. Otherwise, process the request and log the usage

### Gathering Statistics

To generate usage reports:

1. Query the `TranslationStat` table for the desired time period
2. Aggregate by user, language pair, or API key
3. Generate insights on translation volume, popular languages, etc.

## Implementation Notes

1. Indexes have been added to frequently queried fields for performance
2. Constraints ensure data integrity across the schema
3. The schema supports both authenticated users and API key-based service access
4. Translation caching is handled via the hash field for quick lookups
5. Database migrations should be handled using Prisma
