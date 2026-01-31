import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import BrowseCourses from './pages/BrowseCourses';
import CourseDetail from './pages/CourseDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />


        <Route path="/teacher-dashboard" element={
          <PrivateRoute role="TEACHER">
            <TeacherDashboard />
          </PrivateRoute>
        } />
        <Route path="/student-dashboard" element={
          <PrivateRoute role="STUDENT">
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path="/browse" element={
          <PrivateRoute role="STUDENT">
            <BrowseCourses />
          </PrivateRoute>
        } />
        <Route path="/courses/:id" element={
          <PrivateRoute>
            <CourseDetail />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
