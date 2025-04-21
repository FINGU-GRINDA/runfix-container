# Codebase Architecture

This project follows a modular architecture designed for maintainability and scalability. The core structure is organized into three main layers:

## 1. Data Layer (`src/data` - TBC)

- **Purpose:** Manages all data persistence and access logic.
- **Components:**
  - `database`: Handles interactions with the primary database, including ORM setup and models.
  - `redis`: Manages interactions with the Redis instance.
  - `cache`: Implements caching strategies.

## 2. Procedures Layer (`src/procedures`)

- **Purpose:** Contains the core business logic and operations of the application.
- **Components:**
  - `stateless`: Functions performing operations without relying on or modifying external state.
  - `stateful`: Functions interacting with the Data Layer or external services, potentially causing side effects.
- **Design Philosophy:**
  - **Local Procedures First:** Procedures reside within feature-specific modules initially. This enhances locality and context.
  - **Selective Abstraction:** Procedures are moved to shared/global locations (e.g., `src/procedures/shared`) _only_ when demonstrably reused across multiple distinct features, preventing premature abstraction.
  - **Minimal OOP:** Favor functional approaches and composition over complex class hierarchies.

## 3. UI Layer (`src/ui` or `src/routes` - TBC)

- **Purpose:** Exposes application functionality, typically via API routes.
- **Responsibilities:** Orchestrates calls to the Procedures Layer, handles request/response cycles, and manages API-specific concerns (e.g., authentication, validation).

This layered approach promotes separation of concerns and facilitates independent development and testing.
