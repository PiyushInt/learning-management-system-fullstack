import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEnrolledCourses } from '../store/courseSlice';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import styles from './Dashboard.module.css';

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enrolledList, loading, error } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchEnrolledCourses());
    }, [dispatch]);

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Learning</h1>
                    <p className={styles.subtitle}>Courses you are enrolled in</p>
                </div>
            </div>

            {loading && <div className={styles.loader}>Loading courses...</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {enrolledList.length > 0 ? (
                    enrolledList.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            actionLabel="Go to Course"
                            onAction={(id) => navigate(`/courses/${id}`)}
                        />
                    ))
                ) : (
                    !loading && <p className={styles.emptyState}>You are not enrolled in any courses yet.</p>
                )}
            </div>
        </Layout>
    );
};

export default StudentDashboard;
