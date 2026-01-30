import * as courseService from '../services/courseService.js';
import { createCourseSchema } from '../validations/courseValidation.js';

export const createCourse = async (req, res) => {
    try {
        const { error } = createCourseSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const course = await courseService.createCourse(req.body, req.user.id);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await courseService.getCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const courses = await courseService.getEnrolledCourses(req.user.id);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const enrollStudent = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const enrollment = await courseService.enrollStudent(courseId, req.user.id);
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        const status = error.message === 'Student already enrolled in this course.' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};
