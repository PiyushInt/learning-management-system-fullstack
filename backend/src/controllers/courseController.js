import * as courseService from '../services/courseService.js';
import { AppError } from '../core/errors.js';

export const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body, req.user.id);
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

export const getCourses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const courses = await courseService.getCourses(page, limit);
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
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const courses = await courseService.getEnrolledCourses(req.user.id, page, limit);
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const enrollStudent = async (req, res, next) => {
    try {
        const { id: courseId } = req.params;
        const enrollment = await courseService.enrollStudent(courseId, req.user.id);
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        next(error);
    }
};
