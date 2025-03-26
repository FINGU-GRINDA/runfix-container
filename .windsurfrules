# TypeScript React Project Coding Standards

## Technology Stack

- TypeScript
- React
- Next.js (App Router)
- Better Auth
- React Query with codegen
- nuqs (URL state management)
- npm

## File Structure and Naming Conventions

### File and Folder Naming

- Use kebab-case for all file and folder names: `test-name`, `user-profile`, `auth-provider`
- Component files should be named after their component: `user-card.tsx`
- Hooks should be prefixed with `use-`: `use-auth.ts`, `use-fetch-users.ts`
- Types/interfaces should use `-types` suffix: `user-types.ts`
- Utility files should use descriptive, action-oriented names: `format-date.ts`, `validate-input.ts`

### Project Structure

```
project-root/
├── app/                       # Next.js app directory
│   ├── api/                   # API routes
│   ├── (auth)/                # Auth-related routes (grouped)
│   ├── [dynamic-routes]/      # Dynamic routes
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                # Shared components
│   ├── ui/                    # UI components (buttons, inputs, etc.)
│   ├── layout/                # Layout components
│   └── feature/               # Feature-specific components
├── hooks/                     # Custom hooks
├── lib/                       # Shared libraries and utilities
│   ├── api/                   # API client and queries
│   ├── auth/                  # Auth utilities
│   └── utils/                 # General utilities
├── types/                     # Global type definitions
├── styles/                    # Global styles
└── public/                    # Static assets
```

## Code Organization

### Components

- Limit components to 100 lines or less (aim for 20-50 lines)
- Follow single responsibility principle - each component should do one thing well
- Extract reusable parts into separate components
- Organize props alphabetically
- Use TypeScript interfaces for component props
- Place interfaces/types in the same file as the component that uses them

### Exports and Imports

- **Always use named exports instead of default exports**

```typescript
// Good
export const Button = () => {
  /* ... */
};

// Avoid
const Button = () => {
  /* ... */
};
export default Button;
```

- Group imports by:
  1. External packages
  2. Internal absolute imports
  3. Relative imports
  4. Types/interfaces
- Sort imports alphabetically within each group
- Leave a blank line between import groups

```typescript
// External packages
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Internal absolute imports
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Relative imports
import { formatData } from "./utils/format-data";

// Types
import type { User } from "@/types/user-types";
```

## TypeScript Guidelines

### Type Safety

- Avoid `any` types whenever possible
- Use specific types or interfaces instead of generic Objects
- Define function parameter and return types explicitly
- Use TypeScript utility types when appropriate (Pick, Omit, Partial, etc.)
- Use string literal types for finite string options
- Create domain-specific type aliases for common types

### Type Definitions

- Keep type definitions close to where they're used
- For shared types, place in dedicated type files
- Use interfaces for object shapes that will be extended
- Use type aliases for unions, intersections, and simple objects
- Prefer readonly properties when the value should not be mutated

```typescript
// Example type definitions
interface UserProps {
  readonly id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

type UserListProps = {
  users: UserProps[];
  isLoading: boolean;
  onSelect: (userId: string) => void;
};
```

## Next.js App Router Best Practices

### Pages and Layouts

- Keep page components lightweight - focus on layout organization
- **Prefer Client Components** for interactive UI elements and data fetching
- Add the 'use client' directive at the top of all interactive components
- Use Server Components only for static content or SEO-critical pages
- Leverage route groups for logical organization
- Create clear boundaries between client and server code

### Data Fetching

- **Always use React Query** for data fetching and mutations, not Server Actions
- Create custom hooks for all API calls using React Query
- Implement proper loading states and error handling
- Use suspense mode when appropriate
- Generate typed API hooks with codegen
- Centralize API endpoints in a dedicated api/endpoints.ts file
- Handle caching and invalidation strategies consistently

## nuqs URL State Management

### Core Principles

- Use nuqs for managing URL-based state rather than React state when:
  - State needs to be shareable via URL
  - State should persist across page refrSeshes
  - State affects content that should be linkable or bookmarkable

### Usage Patterns

```typescript
// Good: Dedicated hook that groups related parameters
export const useFilterParams = () => {
  const [search, setSearch] = useQueryState("q");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("newest")
  );

  return {
    filters: { search, page, sort },
    setSearch,
    setPage,
    setSort,
    resetFilters: () => {
      setSearch(undefined);
      setPage(1);
      setSort("newest");
    },
  };
};
```

### When Not to Use nuqs

- For temporary UI state (use React state instead)
- For sensitive data (never put sensitive data in URL)
- For very frequently changing values (avoid URL churn)
- For complex nested objects (keep URL parameters flat)

## React Query & Codegen Guidelines

### Query Organization

- Implement proper error handling for all queries

## Auth Implementation

### Better Auth

- Keep auth logic in dedicated hooks/providers
- Protect routes consistently
- Implement proper error handling for auth failures
- Store tokens securely
- Provide clear login/logout user flows
- Handle session expiration gracefully

## Code Quality and Testing

### Linting and Formatting

- Use ESLint with TypeScript rules
- Use Prettier for consistent formatting
- Run linting and formatting as part of CI
- Enable strict TypeScript mode

### Testing

- Write unit tests for utility functions
- Write component tests for complex components
- Test hooks independently
- Create test utilities for common testing patterns
- Mock external dependencies

## General Coding Principles

### Simplicity (KISS)

- Keep functions and components simple
- Avoid unnecessary complexity and abstraction
- Just because a new language feature is cool doesn't mean you should use it
- Write simple code, not complex solutions
- Keep functions under 100 lines (aim for 20-50)

### Clarity

- Use descriptive variable and function names
- Don't abbreviate unnecessarily
- Use explaining variables to clarify complex conditions
- Prefer longer, more descriptive names over short, cryptic ones

### Single Responsibility

- Every function, component, and module should do one thing well
- Avoid function names with "and" in them
- Use "Extract Function/Component" refactoring aggressively

### Avoid Hard-Coding

- Use constants for magic numbers and strings
- Implement proper configuration management
- Use environment variables for environment-specific values
- Use dependency injection where appropriate

### Error Handling

- Handle errors at appropriate abstraction levels
- Provide meaningful error messages
- Implement proper error boundaries
- Log errors appropriately

## Performance Considerations

- Implement proper code-splitting
- Optimize images and static assets
- Minimize bundle size
- Implement proper memoization
- Use React.memo, useMemo, and useCallback appropriately
- Consider server-side rendering vs. client-side rendering tradeoffs
