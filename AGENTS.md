# AGENTS.md - Development Guidelines for Loan Platform

This file contains essential information for agentic coding agents working in this loan platform repository.

## Project Overview

This is a Next.js 14 loan platform application with TypeScript, Prisma ORM, PostgreSQL database, and Tailwind CSS. The app includes user authentication, multi-step loan applications, admin dashboard, and Paystack payment integration.

## Build & Development Commands

### Core Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production (includes Prisma operations)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run postinstall  # Generate Prisma client (runs automatically)
```

### Database Commands
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Create and apply migrations
npx prisma seed      # Run database seed script
```

### Package Management
This is a monorepo with workspace packages:
- `packages/ui` - Shared UI components
- `packages/eslint-config` - ESLint configuration
- `packages/typescript-config` - TypeScript configuration

Use `turbo` for running commands across packages.

## Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Next.js plugin for enhanced type checking
- Consistent casing enforced for file names

### Import Organization
```typescript
// 1. External libraries (React, Next.js, etc.)
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Internal utilities and lib
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

// 3. Components (use relative imports for same directory)
import PersonalInfo from "./steps/PersonalInfo";
import { useLoading } from "@/contexts/LoadingContext";
```

### Component Conventions
- Use default exports for components
- Interface definitions before component
- Props interface named `ComponentNameProps`
- Client components marked with `"use client";` at top
- Server components remain unmarked

```typescript
"use client";

interface LoanFormProps {
  userId: string;
  currentStep: number;
  existingLoan: any;
}

export default function LoanForm({
  userId,
  currentStep,
  existingLoan,
}: LoanFormProps) {
  // Component logic
}
```

### API Route Structure
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const schemaName = z.object({
  field: z.string().min(1, "Required field"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = schemaName.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    // Business logic
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Operation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Error Handling Patterns
- Use try-catch blocks for async operations
- Return consistent error responses from API routes
- Log errors with context
- Use Zod for input validation
- Handle user feedback gracefully (no alerts in production)

### Naming Conventions
- **Files**: PascalCase for components (`LoanForm.tsx`), camelCase for utilities (`auth.ts`)
- **Variables**: camelCase (`const userId = "..."`)
- **Functions**: camelCase (`const handleSubmit = async () => {...}`)
- **Constants**: UPPER_SNAKE_CASE (`const COOKIE_NAME = "auth-token"`)
- **Types**: PascalCase (`interface JWTPayload`)

### Database Patterns
- Use Prisma client from `@/lib/db`
- Follow the schema structure in `prisma/schema.prisma`
- Use transactions for multiple related operations
- Handle database errors gracefully
- Use proper relations with cascade deletes where appropriate

### Styling Guidelines
- Use Tailwind CSS classes
- Follow the custom color scheme defined in `tailwind.config.ts`
- Use semantic color tokens: `primary-500`, `secondary-600`, etc.
- Responsive design with mobile-first approach
- Use custom animations defined in config

### Authentication & Authorization
- JWT tokens stored in HTTP-only cookies
- Use `@/lib/auth` for all auth operations
- Role-based access control (USER/ADMIN)
- Middleware for protected routes
- Verify admin status in admin-only API routes

### Form Handling
- Use React Hook Form with Zod validation
- Multi-step forms with progress tracking
- Save progress automatically
- Use loading states during submission
- Proper error display and handling

### Testing
- No test framework currently configured
- When adding tests, check for existing test setup
- Focus on API route testing and component integration

## Important File Locations
- **Database**: `prisma/schema.prisma`
- **Auth utilities**: `src/lib/auth.ts`
- **Database client**: `src/lib/db.ts`
- **Middleware**: `src/middleware.ts`
- **Tailwind config**: `tailwind.config.ts`
- **Next.js config**: `next.config.js`

## Environment Variables
- `POSTGRES_PRISMA_URL` - Database connection with pooling
- `POSTGRES_URL_NON_POOLING` - Direct database connection
- `JWT_SECRET` - JWT token signing secret
- Paystack keys for payment integration

## Common Patterns to Follow
1. Always validate input with Zod schemas
2. Use consistent error response format
3. Implement proper loading states
4. Follow the established folder structure
5. Use TypeScript strictly - no `any` types unless necessary
6. Implement proper security measures (no console logging of sensitive data)
7. Use semantic HTML and accessibility best practices
8. Follow Next.js App Router conventions
9. Use server components by default, client components only when needed
10. Implement proper caching strategies where applicable