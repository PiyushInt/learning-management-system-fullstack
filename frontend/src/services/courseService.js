import api from './api';

export const courseService = {
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    getEnrolledCourses: async () => {
        const response = await api.get('/courses/enrolled');
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    getCourseAssignments: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/assignments`);
        return response.data;
    },

    enrollStudent: async (courseId) => {
        const response = await api.post(`/courses/${courseId}/enroll`);
        return response.data;
    }
};
