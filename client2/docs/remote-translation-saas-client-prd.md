# Remote Translation SaaS - Frontend Requirements Document

## 1. Architecture Overview

### 1.1 Tech Stack

- **Frontend Framework**: Nextjs Page Router
- **State Management**: React Context API with custom hooks
- **Routing**: Nextjs Page Router - File Based SSG & Static deployable to CDN
- **Styling**: Tailwind CSS with shacdn UI components and semantic design system
- **State Handling**: Nuqs
- **API Communication**: OpenApi fetch ts codegen with react-query
- **Authentication**: JWT token with secure HttpOnly cookies

### 1.2 Project Structure

```
src/
├── assets/            # Static assets (images, icons)
├── components/        # Reusable UI components
│   ├── common/        # Shared components (Button, Input, etc.)
│   ├── auth/          # Authentication-related components
│   ├── organizations/ # Organization-related components
│   ├── projects/      # Project-related components
│   └── translations/  # Translation-related components
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── pages/             # Page components (route-based)
├── services/          # API service functions
├── types/             # TypeScript interfaces and types
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## 2. Feature Requirements (Route-Based)

### 2.1 Authentication Module

#### 2.1.1 User Registration (`/auth/signup`)

- [ ] Implement registration form with the following fields:
  - [ ] Email (with validation)
  - [ ] Password (with strength requirements)
  - [ ] Confirm Password
  - [ ] First Name
  - [ ] Last Name
- [ ] Form validation using Typebox schema
- [ ] Error handling with user-friendly messages
- [ ] Success feedback and automatic redirection to sign-in
- [ ] Loading state indicators during API calls

#### 2.1.2 User Login (`/auth/signin`)

- [ ] Implement login form with email and password fields
- [ ] Remember me functionality with secure storage
- [ ] Forgot password link and flow
- [ ] Form validation and error handling
- [ ] Redirect to last active organization or organizations list

### 2.2 Organizations Module

#### 2.2.1 Organizations List (`/organizations`)

- [ ] Implement responsive card-based interface for organizations
- [ ] Each card should display:
  - [ ] Organization name
  - [ ] Brief description
  - [ ] Member count
  - [ ] Project count
  - [ ] Last activity timestamp
- [ ] Search and filter functionality
- [ ] Sorting options (alphabetical, recently active)
- [ ] Create new organization button with proper permissions check
- [ ] Skeleton loading state for better UX

#### 2.2.2 Create Organization (`/organizations/new`)

- [ ] Multi-step creation form with:
  - [ ] Basic information (name, description)
  - [ ] Organization settings (default language, timezone)
  - [ ] Initial member invitations (optional)
- [ ] Form validation with immediate feedback
- [ ] Preview capability before final submission
- [ ] Success feedback with navigation options

### 2.3 Organization Details Module

#### 2.3.1 Organization Profile (`/organizations/[id]`)

- [ ] Display comprehensive organization information:
  - [ ] Name, description, and creation date
  - [ ] Member list with roles and permissions
  - [ ] Activity timeline
  - [ ] Resource usage statistics
- [ ] Quick access to projects within the organization

#### 2.3.2 Edit Organization (`/organizations/[id]/edit`)

- [ ] Edit organization profile information
- [ ] Manage member roles and permissions
- [ ] Configure organization-wide settings
- [ ] Audit log of changes
- [ ] Confirmation for sensitive changes

#### 2.3.3 Leave Organization (`/organizations/[id]/leave`)

- [ ] Confirmation dialog with implications
- [ ] Transfer ownership option if applicable
- [ ] Feedback on successful departure
- [ ] Redirect to organizations list

### 2.4 Projects Module

#### 2.4.1 Projects List (`/organizations/[id]/projects`)

- [ ] Card-based interface with project details:
  - [ ] Project name and description
  - [ ] Supported languages
  - [ ] Translation completion percentage
  - [ ] Last activity timestamp
- [ ] Filtering by status, language support
- [ ] Search functionality
- [ ] Create new project button with wizard

### 2.5 Project Details Module

#### 2.5.1 Project Overview (`/organizations/[id]/projects/[projectId]`)

- [ ] Project dashboard with key metrics:
  - [ ] Translation progress by language / worldmap
  - [ ] API usage statistics
  - [ ] Recent activity feed
- [ ] Quick action buttons for common tasks
- [ ] Documentation and integration guides
- [ ] Recent activity log related to the project

#### 2.5.2 Edit Project (`/organizations/[id]/projects/[projectId]/edit`)

- [ ] Edit project details and settings
- [ ] Manage supported languages
- [ ] Configure translation workflows
- [ ] Set up webhooks and integrations

#### 2.5.3 Project Statistics (`/organizations/[id]/projects/[projectId]/stats`)

- [ ] Comprehensive analytics dashboard
- [ ] Translation volume metrics
- [ ] API usage trends
- [ ] Performance indicators
- [ ] Exportable reports

#### 2.5.4 Delete Project (`/organizations/[id]/projects/[projectId]/delete`)

- [ ] Multi-step confirmation process
- [ ] Impact assessment
- [ ] Data export option before deletion
- [ ] Audit logging

### 2.6 API Key Management Module

#### 2.6.1 API Keys List (`/organizations/[id]/projects/[projectId]/api-keys`)

- [ ] Tabular view of all API keys with:
  - [ ] Key name and partial key display
  - [ ] Creation date
  - [ ] Usage statistics
- [ ] Revoke key functionality
- [ ] Filtering and sorting options

#### 2.6.2 Create API Key (`/organizations/[id]/projects/[projectId]/api-keys/new`)

- [ ] Secure key display on creation (shown only once)
- [ ] Copy to clipboard functionality
- [ ] Download as file option

#### 2.6.3 API Key Details (`/organizations/[id]/projects/[projectId]/api-keys/[keyId]`)

- [ ] Detailed view of key information
- [ ] Revocation with confirmation

### 2.7 Translation Management Module

#### 2.7.1 Translations List (`/organizations/[id]/projects/[projectId]/translations`)

- [ ] List of languages to be displayed in the columns
- [ ] Filterable, paginated table of translations
- [ ] Search by key, content, or language
- [ ] Inline quick editing
- [ ] Batch operations (delete, tag, export)
- [ ] AI translate button (need better UIUX)

#### 2.7.2 Add Translation (`/organizations/[id]/projects/[projectId]/translations/new`)

- [ ] Form to add new translation with:
  - [ ] language content
- [ ] AI suggestions
- [ ] Save button

#### 2.7.3 Edit Translation (`/organizations/[id]/projects/[projectId]/translations/[translationId]`)

- [ ] Edit interface with:
  - [ ] Side-by-side editing of multiple languages
  - [ ] Translation suggestions
- [ ] Save button

## 3. Cross-Cutting Concerns

### 3.1 Authentication & Authorization

- [ ] Implement JWT-based http only secure cookie authentication flow
- [ ] Role-based access control (RBAC) system
- [ ] Permission checks at UI and API levels
- [ ] Session timeout handling

### 3.2 Error Handling

- [ ] Global error boundary for React components
- [ ] Consistent error UI patterns
- [ ] Detailed logging for troubleshooting
- [ ] Graceful degradation strategies
- [ ] Offline support where applicable
- [ ] Frontend remote logging

### 3.3 Performance Optimization

- [ ] Code splitting for route-based components
- [ ] Resource lazy loading
- [ ] Paginated lists for large datasets
- [ ] Optimistic UI updates

### 3.4 Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast requirements
- [ ] Focus management

### 3.5 Internationalization

- [ ] Multi-language UI support
- [ ] RTL layout support
- [ ] Date, time, and number formatting
- [ ] Translation management for UI strings
- [ ] Use our own translation library for our app

## 4. Implementation Guidelines

### 4.1 Component Design

- Implement components with proper Typebox and TypeScript interfaces
- Follow the single responsibility principle

### 4.2 State Management

- Use Nuqs and React Query for state management
- Implement custom hooks for reusable logic
- Follow the principle of lifting state up

### 4.3 API Integration

- Create service modules for API communication - use react-query codegen
- Implement proper error handling and retry logic
- Use TypeScript interfaces for request/response types

### 4.4 Testing Strategy

- Unit tests for utility functions and hooks
- Component tests with React Testing Library
- Integration tests for critical user flows
- End-to-end tests for key user journeys
- Visual regression testing for UI components
