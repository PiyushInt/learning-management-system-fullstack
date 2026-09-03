# Mini LMS (Learning Management System) Backend

[![CI Pipeline](https://github.com/PiyushInt/learning-management-system-fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/PiyushInt/learning-management-system-fullstack/actions/workflows/ci.yml)

An advanced, resilient, and secure RESTful API for a Learning Management System designed to handle core educational workflows: course creation, student enrollment, assignment distribution, and grade-less submission tracking.

## Overview
This backend powers a multi-tenant learning environment where Teachers manage courses and assignments, and Students enroll in those courses and submit their work. It heavily emphasizes security boundaries, rate-limiting resilience, strict data consistency logic, and robust automated testing utilizing modern Node.js backend practices.

## Tech Stack
* **Language & Runtime:** Node.js (v20+), ES Modules
* **Framework:** Express.js (v5)
* **Database & ORM:** PostgreSQL (v15), Prisma ORM
* **Security & Hardening:** Helmet, express-rate-limit, CORS, bcrypt, Joi
* **Observability:** Winston (Structured logging, Recursive redaction)
* **Testing:** Jest, Supertest
* **CI/CD:** GitHub Actions (Clean-clone DB migration tests, Linting, Audit)

## Architecture

```mermaid
graph TD
    Client[Client App / Postman] --> |HTTP / JSON| API[Express API Gateway]
    
    subgraph Express Backend
        API --> RateLimit[Rate Limiter]
        RateLimit --> Auth[Auth Middleware]
        Auth --> Validation[Joi Boundary Validation]
        Validation --> Controllers[Controllers]
        Controllers --> CoreAuth[Core Authorization]
        CoreAuth --> Services[Domain Services]
    end
    
    Services --> |Prisma Client| DB[(PostgreSQL)]
    
    subgraph Observability
        Controllers -.-> Logger[Winston Logger]
        Services -.-> Logger
        Logger -.-> |Redacts PII/Tokens| LogOutput[Stdout/JSON]
    end
```

## Project Structure
```text
backend/
├── src/
│   ├── app.js               # Express app configuration & hardening
│   ├── server.js            # Entry point & Graceful shutdown
│   ├── config/              # Centralized environment variable parsing
│   ├── controllers/         # HTTP request/response handlers
│   ├── core/                # Core domain logic (authorization.js)
│   ├── middlewares/         # Joi validation, error handling, logging, JWT auth
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic and Prisma DB interactions
│   ├── utils/               # Helpers (e.g., JWT signing/verification)
│   └── validations/         # Joi schema definitions
├── tests/                   # Jest integration test suite & fixtures
├── prisma/                  # Prisma schema and migrations
├── .env.example             # Template for environment variables
├── package.json             # NPM dependencies & scripts
└── eslint.config.js         # Linter configuration
.github/workflows/           # CI/CD pipelines
```

## Getting Started

### Prerequisites
* Node.js (v20+)
* Docker & Docker Compose (for the local test database)
* PostgreSQL (if running locally without Docker)

### Environment Setup
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="replace_with_a_secure_random_string"
JWT_EXPIRES_IN="1d"
```
*(Note: A test database configuration is automatically managed via the `run-tests.sh` script when running `npm test`.)*

### Installation & Execution
```bash
cd backend/

# Install dependencies using ci for exact lockfile match
npm ci

# Generate the Prisma Client
npm run prisma:generate

# Apply database migrations
npm run prisma:migrate

# Start the server (Development)
npm run dev
```

## API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user (Teacher/Student) | No |
| `POST` | `/auth/login` | Authenticate and receive a JWT | No |

### Courses & Enrollments
| Method | Endpoint | Description | Auth Required (Role) |
| :--- | :--- | :--- | :--- |
| `GET`  | `/courses` | List all available courses | No |
| `POST` | `/courses` | Create a new course | Yes (TEACHER) |
| `GET`  | `/courses/enrolled` | List courses the student is enrolled in | Yes (STUDENT) |
| `POST` | `/courses/:id/enroll` | Enroll the current student into a course | Yes (STUDENT) |
| `GET`  | `/courses/:id/assignments` | List assignments for a course | Yes (Enrolled STUDENT / Owning TEACHER) |
| `POST` | `/courses/:id/assignments` | Create a new assignment for a course | Yes (Owning TEACHER) |

### Assignments & Submissions
| Method | Endpoint | Description | Auth Required (Role) |
| :--- | :--- | :--- | :--- |
| `POST` | `/assignments/:id/submit` | Submit work for an assignment | Yes (Enrolled STUDENT) |
| `GET`  | `/assignments/:id/submissions` | List all submissions for an assignment | Yes (Owning TEACHER) |

## Security

This system implements a strict defense-in-depth security architecture with a clear separation of concerns:

1. **Role Checks vs. Ownership Checks**: 
   - **Role Checks** are performed early at the HTTP boundary via the JWT middleware (e.g., verifying a user is a `TEACHER` before allowing access to course creation).
   - **Ownership & Domain Guards** live deeper in the stack within `src/core/authorization.js`. This module strictly handles data-level authorization, ensuring that a standard Prisma query always verifies a Teacher actually owns the course they are modifying, or a Student is genuinely enrolled in the course they are interacting with.

2. **Route Coverage Matrix**:

| Route | Role Check (Middleware) | Ownership / Domain Check (`authorization.js`) |
| :--- | :--- | :--- |
| `/auth/register` | None | None |
| `/auth/login` | None | None |
| `GET /courses` | None | None |
| `POST /courses` | `TEACHER` | None |
| `GET /courses/enrolled` | `STUDENT` | None |
| `POST /courses/:id/enroll` | `STUDENT` | Implicit (creates enrollment) |
| `GET /courses/:id/assignments` | `STUDENT` or `TEACHER` | `assertEnrolled` (Student) OR `assertOwnsCourse` (Teacher) |
| `POST /courses/:id/assignments`| `TEACHER` | `assertOwnsCourse` |
| `POST /assignments/:id/submit` | `STUDENT` | `assertEnrolled` (via Course) |
| `GET /assignments/:id/submissions`| `TEACHER`| `assertOwnsCourse` (via Course) |

3. **Strict Boundary Validation**: All incoming requests pass through a global `validateBody` middleware using strict Joi schemas, dropping malformed payloads before they reach business logic.
4. **Recursive Log Redaction**: The Winston logger utilizes a recursive object traversal function to guarantee PII (`password`, `token`, etc.) is redacted (`[REDACTED]`), regardless of nesting depth.

## Testing
The repository maintains strict integration test coverage spanning the full API boundary, database constraint validation, rate limiting, and log redaction.

```bash
# Run the full test suite (automatically spins up a clean Postgres container on port 5434)
npm test
```

## Design Decisions
- **Hard Delete cascades**: `onDelete: Cascade` rules were implemented strictly across the schema. A course serves as a container; deleting a course destroys its assignments and submissions.
- **UUIDs and API Coercion**: A dedicated integer coercion middleware shields the database from Prisma's `NaN` panics.
- **Graceful Shutdown & Resilience**: The application leverages `SIGTERM`/`SIGINT` traps and explicitly delays startup until the database emits a successful connection ping.
- **Audit Exception (`deepmerge-ts`, `mysql2`)**: The `npm audit` step currently returns advisory warnings for high-severity findings related to `deepmerge-ts` and `mysql2`. These are transitive dependencies of the Prisma CLI. Since this project strictly uses PostgreSQL, the `mysql2` vulnerability is unreachable at runtime. Resolving these warnings would require a breaking downgrade of Prisma. The audit step remains advisory (non-blocking) as no runtime risk is present.

## Limitations
- **No Frontend**: This repository is strictly a backend API. The GitHub Actions CI pipeline verifies backend linting, database migrations from scratch, and integration tests, but intentionally does not build or assert UI artifacts.
- **In-Memory Rate Limiting**: The `express-rate-limit` configuration uses the default memory store. In a multi-node production deployment, this should be migrated to a Redis store.
