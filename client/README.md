# Translation Management Platform

A comprehensive solution for managing translations across multiple models and APIs with workspace organization, authentication, and usage tracking capabilities.

## 📋 Overview

This platform enables users to manage translation services efficiently through a modern web interface. It provides authentication, workspace management, and various translation-related features to streamline the translation workflow for teams and organizations.

## ✨ Features

### User Management

- **Authentication**: Secure user login and registration system
- **Workspace Organization**: Create and manage workspaces for team collaboration
- **Permission Management**: Control user access within workspaces

### Translation Services

- **Multiple Translation Models**: Select from various translation models based on your needs
- **Input/Output Management**: Track and organize all translations with input and output history
- **Batch Processing**: Process multiple translations in a single request

### API Integration

- **API Key Management**: Securely store and manage translation service API keys
- **Host Selection**: Configure different hosts per API key
- **Usage Tracking**: Monitor API usage and consumption statistics

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js with page router architecture
- **UI Libraries**:
  - Tailwind CSS for styling
  - Shadcn UI for component system
- **State Management**: React Query with OpenAPI codegen, and nuqs for url query state management

### Backend

- **Authentication**: Better Auth for user management and organization features
- **Database**:
  - PostgreSQL as the primary database
  - Prisma ORM for database interactions

### Development Tools

- **Package Manager**: npm
- **Code Quality**:
  - Prettier for consistent code formatting
  - ESLint for code quality enforcement
  - TypeScript for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- API keys for translation services (if applicable)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-org/translation-platform.git
cd translation-platform/client
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Development Guidelines

### Code Structure

- Follow the Single Responsibility Principle for all components and functions
- Maintain a strict 100-line maximum per function with a target of 20-50 lines
- Use a composition-first approach for breaking down complex operations

### Module Organization

- Place pure functions in `utils/` folders within feature directories
- Place data-mutating functions in `services/` modules
- Keep feature-specific logic within its feature directory

### Best Practices

- Write comprehensive tests for all utility functions
- Follow consistent naming conventions (camelCase for functions, PascalCase for types)
- Document all functions with clear input/output specifications

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
