# Mini LMS (Learning Management System) Backend
[![CI Pipeline](https://github.com/PiyushInt/learning-management-system-fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/PiyushInt/learning-management-system-fullstack/actions/workflows/ci.yml)

An advanced, resilient, and secure RESTful API for a Learning Management System designed to handle core educational workflows: course creation, student enrollment, assignment distribution, and grade-less submission tracking.

## Overview
This backend powers a multi-tenant learning environment where Teachers manage courses and assignments, and Students enroll in those courses and submit their work. It heavily emphasizes security boundaries, rate-limiting resilience, and strict data consistency logic utilizing modern Node.js backend practices.

## Tech Stack
* **Language & Runtime:** Node.js (v20), ES Modules
* **Framework:** Express.js (v5)
* **Database & ORM:** PostgreSQL (v15), Prisma ORM
* **Security & Hardening:** Helmet, express-rate-limit, CORS, bcrypt, Joi
* **Observability:** Winston (Structured logging, Recursive redaction)
* **Testing:** Jest, Supertest
* **CI/CD:** GitHub Actions (Clean-clone DB migration tests)

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
│   ├── core/                # Core domain logic (e.g., authorization.js)
│   ├── middlewares/         # Joi validation, error handling, logging, JWT auth
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic and Prisma DB interactions
│   ├── utils/               # Helpers (e.g., JWT signing/verification)
│   └── validations/         # Joi schema definitions
├── tests/                   # Jest integration test suite & fixtures
├── database/                # Prisma schema, migrations, config
├── .github/workflows/       # CI/CD pipelines
├── package.json             # NPM dependencies & scripts
└── eslint.config.js         # Linter configuration
```

## Getting Started

### Prerequisites
* Node.js (v20+)
* Docker & Docker Compose (for the local test database)
* PostgreSQL (if running locally without Docker)

### Environment Setup
Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://lmsuser:lmspassword@localhost:5432/lmsdb
JWT_SECRET=super_secret_jwt_key_that_is_at_least_32_bytes_long
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_REGISTER_MAX=10
```

### Installation & Execution
```bash
cd backend/
npm install

# Apply database migrations
npx prisma migrate dev

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

This system implements a defense-in-depth security architecture:

1. **Strict Boundary Validation**: All incoming requests pass through a global `validateBody` middleware using strict Joi schemas (`stripUnknown: false`, `allowUnknown: false`), dropping malformed payloads before they reach business logic.
2. **Rate Limiting**: Authentication endpoints are heavily protected against brute-force attacks via memory-stored rate limiters (`trust proxy` enabled).
3. **Recursive Log Redaction**: The Winston logger utilizes a recursive object traversal function to guarantee `password`, `token`, and `authorization` keys are redacted (`[REDACTED]`), regardless of how deeply nested they are within request payloads or error stacks.
4. **Isolated Authorization (`core/authorization.js`)**: Authorization is strictly split from authentication. Role checks are handled via the JWT middleware, but **ownership** (`assertOwnsCourse`) and **enrollment** (`assertEnrolled`) domain checks are abstracted into an isolated `core/authorization.js` module. This guarantees that standard Prisma queries always wrap the required database lookups to verify a Teacher actually owns the course they are modifying, or a Student is genuinely enrolled in the course they are interacting with.

## Testing
The repository maintains strict integration test coverage spanning the full API boundary, database constraint validation, rate limiting, and log redaction.

```bash
# Run the full test suite (automatically spins up a clean Postgres container)
npm test
```

## Design Decisions
- **Hard Delete cascades**: `onDelete: Cascade` rules were implemented strictly across the schema. A course serves as a container; deleting a course destroys its assignments and submissions. However, deleting a user is restricted if they have graded submissions, preserving historical academic integrity.
- **UUIDs and API Coercion**: A dedicated integer coercion middleware shields the database from Prisma's `NaN` panics.
- **Graceful Shutdown & Resilience**: The application leverages `SIGTERM`/`SIGINT` traps and explicitly delays startup until the database emits a successful connection ping.

## Limitations
- **No Frontend**: This repository is strictly a backend API. The GitHub Actions CI pipeline verifies backend linting, database migrations from scratch, and integration tests, but intentionally does not build or assert UI artifacts.
- **In-Memory Rate Limiting**: The `express-rate-limit` configuration uses the default memory store. In a multi-node production deployment, this should be migrated to a Redis store.
