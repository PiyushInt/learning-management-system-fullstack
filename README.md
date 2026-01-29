# Mini LMS Backend

A production-ready Learning Management System (LMS) backend built with Node.js, Express, and PostgreSQL.

## Tech Stack
- **Runtime**: Node.js (LTS)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT & bcrypt
- **Validation**: Joi
- **Testing**: Jest & Supertest

## Prerequisites
- Node.js (v18+)
- PostgreSQL

## Setup

1. **Clone and Install**
   ```bash
   git clone <repo_url>
   cd learning_management_system
   ./setup.sh
   ```

2. **Database Setup**
   Update `.env` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"
   ```

   Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Run Server**
   ```bash
   npm run dev
   ```

## API Documentation

### Auth
- `POST /auth/register` - Register a new user (Role: TEACHER, STUDENT)
- `POST /auth/login` - Login

### Courses
- `GET /courses` - List all courses
- `POST /courses` - Create a course (Teacher only)
- `POST /courses/:id/enroll` - Enroll in a course (Student only)
- `GET /courses/:id/assignments` - Get assignments for a course
- `POST /courses/:id/assignments` - Create assignment (Teacher only)

### Assignments & Submissions
- `POST /assignments/:id/submit` - Submit an assignment (Student only)
- `GET /assignments/:id/submissions` - Get submissions (Teacher only)

## Testing
Run unit and integration tests:
```bash
npm test
```
