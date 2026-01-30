# Learning Management System (LMS) Backend

## 📌 Project Overview
A scalable backend platform designed for managing courses, teachers, and students, inspired by real-world learning management systems. This project provides a robust API for course creation, student enrollment, assignment management, and submissions.

## 🚀 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Language:** JavaScript (ES6 modules)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Security:** Helmet, CORS, bcrypt

## ✨ Features
- **User Authentication:** Secure signup and login for Students and Teachers.
- **Role-Based Access Control (RBAC):** Distinct permissions for Teachers (create courses/assignments) and Students (enroll/submit work).
- **Course Management:** CRUD operations for courses.
- **Assignment System:** Create, view, and submit assignments.
- **Enrollment Management:** Track student course enrollments.
- **Secure & Optimized:** Centralized error handling, input validation, and optimized SQL queries.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Learning_management_system
   ```

2. **Run Setup Script**
   This script installs dependencies, sets up the environment file, and generates the Prisma client.
   ```bash
   ./setup.sh
   ```

3. **Configure Environment Variables**
   Open `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/lms_db?schema=public"
   JWT_SECRET="your_super_secret_key"
   PORT=3000
   ```

4. **Initialize Database**
   Run the migration to create tables:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ```

## 📖 API Documentation (Brief)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new user | No |
| **POST** | `/auth/login` | Login user | No |
| **POST** | `/courses` | Create a new course | Yes (Teacher) |
| **GET** | `/courses` | List all courses | Yes |
| **POST** | `/courses/:id/enroll` | Enroll in a course | Yes (Student) |
| **POST** | `/assignments` | Create assignment | Yes (Teacher) |
| **POST** | `/assignments/:id/submit` | Submit assignment | Yes (Student) |

## ✅ Fulfillment of Requirements

This project successfully implements the "Learning Management Backend Platform" requirements as follows:

- **Scalable Backend Platform:** Built with Node.js and Express to handle concurrent requests efficiently.
- **RESTful APIs:** Clean and structured API endpoints for managing users, courses, assignments, and submissions.
- **Role-Based Access Control (RBAC):** Middleware (`authMiddleware.js`) ensures strict separation between Teacher and Student capabilities.
- **Relational SQL Schema:** Designed using Prisma with PostgreSQL to define clear relationships between Users, Courses, Enrichments, and Assignments.
- **Data Integrity & Performance:** Uses Foreign Keys and optimized queries (via Prisma) to ensure data consistency.
- **Input Validation & Error Handling:** Uses `Joi` for strict input validation and a centralized error handling middleware in `app.js`.
- **Developer Experience:** Includes a `setup.sh` script, organized project structure, and clear documentation for easy onboarding.
- **Clean Code & Git:** Modular code structure (controllers, services, routes) and standard `.gitignore` for a clean repository.
