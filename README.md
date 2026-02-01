# Learning Management System (LMS)

## 📌 Project Overview
A comprehensive Learning Management System designed to bridge the gap between teachers and students. This platform features a scalable backend for managing data and a responsive frontend for a seamless user experience. It supports role-based access, course management, assignment tracking, and secure authentication.

## 🚀 Tech Stack

### Frontend
- **Framework:** React (Vite)
- **State Management:** Redux Toolkit
- **Styling:** CSS Modules & Global Variables
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Security:** Helmet, CORS, bcrypt

## ✨ Features

### Core
- **User Authentication:** Secure signup/login with JWT.
- **Role-Based Access Control (RBAC):** Strict separation between Teacher and Student roles.

### 👩‍🏫 Teacher Portal
- **Dashboard:** Overview of created courses.
- **Course Management:** Create and update courses.
- **Assignments:** Create assignments and review student submissions.

### 👨‍🎓 Student Portal
- **Dashboard:** View enrolled courses.
- **Enrollment:** Browse and enroll in available courses.
- **Assignments:** Submit work and track progress.

## 📂 Project Structure
```
Learning_management_system/
├── frontend/       # React application
│   ├── src/        # Components, Pages, Redux Store
│   └── ...
├── backend/        # Node.js Express API
│   ├── src/        # Controllers, Routes, Services, Prisma
│   └── ...
└── README.md       # Project documentation (this file)
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (installed and running)

### 1. Backend Setup
Navigate to the backend directory and set up the API and database.

```bash
cd backend
```

**Install Dependencies & Setup Environment:**
You can use the provided setup script or configure manually.

```bash
# Option A: Automatic Setup
./setup.sh

# Option B: Manual Setup
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
```

**Start the Server:**
```bash
npm run dev
```
> The backend runs on `http://localhost:3000`.

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Start the Application:**
```bash
npm run dev
```
> The frontend runs on `http://localhost:5173`.

## 🧪 Verification & Usage
1.  **Register as a Teacher** to create a test course and assignment.
2.  **Register as a Student** (incognito window recommended) to enroll in the course.
3.  **Submit an Assignment** as a student and view it as a teacher.

## ✅ Requirements Fulfillment
This project satisfies the core requirements for a scalable LMS platform:
-   **Architecture:** Decoupled Frontend and Backend.
-   **Security:** Password hashing, JWT auth, and RBAC middleware.
-   **Database:** Relational schema with Prisma ORM.
-   **Code Quality:** Modular structure, centralized error handling, and input validation.
