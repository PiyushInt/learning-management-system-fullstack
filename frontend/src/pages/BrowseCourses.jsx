import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../store/courseSlice';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import styles from './Dashboard.module.css';

const BrowseCourses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, loading, error } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Optionally filter out courses already enrolled if I had that list
    // For now just show all

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Browse Courses</h1>
                    <p className={styles.subtitle}>Find new courses to join</p>
                </div>
            </div>

            {loading && <div className={styles.loader}>Loading courses...</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {list.length > 0 ? (
                    list.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            actionLabel="View Details"
                            onAction={(id) => navigate(`/courses/${id}`)}
                        // Teacher name is in course.teacher.name
                        />
                    ))
                ) : (
                    !loading && <p className={styles.emptyState}>No courses available.</p>
                )}
            </div>
        </Layout>
    );
};

export default BrowseCourses;
