import * as courseService from '../services/courseService.js';
import { createCourseSchema } from '../validations/courseValidation.js';
import { AppError } from '../core/errors.js';

export const createCourse = async (req, res, next) => {
    try {
        const { error } = createCourseSchema.validate(req.body);
        if (error) throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');

        const course = await courseService.createCourse(req.body, req.user.id);
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

export const getCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getCourses();
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await courseService.getCourseById(id);
        if (!course) {
            throw new AppError('Course not found', 404, 'NOT_FOUND');
        }
        res.json(course);
    } catch (error) {
        next(error);
    }
};

export const getEnrolledCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getEnrolledCourses(req.user.id);
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const enrollStudent = async (req, res, next) => {
    try {
        if (req.body && req.body.student_id) {
            throw new AppError('Providing student_id in the body is not allowed', 403, 'FORBIDDEN');
        }
        const { id: courseId } = req.params;
        const enrollment = await courseService.enrollStudent(courseId, req.user.id);
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        next(error);
    }
};
