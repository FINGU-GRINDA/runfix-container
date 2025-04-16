# RunFix Container

A comprehensive solution for remote translation management and integration.

## Overview

RunFix Container provides a complete ecosystem for managing translations across web applications. The system consists of multiple components working together to deliver seamless translation capabilities.

## Repository Components

### 1. Server: RunFix Remote Translation Server

A robust REST API server for translation management.

- **Purpose**: Centralized translation management, analytics, engines, and distribution
- **Documentation**: [Server README](./server/README.md)
- **API Documentation**: [Swagger UI](https://hana-i18n.198.23.164.177.sslip.io/docs)

### 2. Client-library / package : RunFix Container npm Package

A browser-compatible package for integrating remote translation capabilities.

- **Purpose**: Client-side integration for translation services
- **Documentation**: [Client README](./client/README.md)
- **Installation**: `npm install @runfix/container` or add script tag to html `<script src="https://cdn.jsdelivr.net/npm/@runfix/container"></script>`

### 3. Dashboard UI - Roadmap

Administrative interface for the remote translation server _(In Progress)_ / ROADMAP.

- **Purpose**: Visual management and GUI for remote translation server
- **Documentation**: [Dashboard README](./client/README.md)
- **Demo**: [Dashboard Demo](https://hana-client-i18n.198.23.164.177.sslip.io/organizations/acme-corp)

### 4. NextJS Test Application

A demonstration application showcasing the integration of RunFix Container. [demo repo](./demo/README.md)

- **Purpose**: Example implementation using NextJS (Page Router)
- **Documentation**: [Test App README](./test/README.md)
- **Live Demo**: [Test Application](https://hana-translation.198.23.164.177.sslip.io/user)

## Getting Started

Refer to each component's README for specific setup and usage instructions.

## License

MIT

## Contact

vikyw@grinda.ai
