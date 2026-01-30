import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, createNewCourse } from '../store/courseSlice';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, X } from 'lucide-react';
import styles from './Dashboard.module.css';

const TeacherDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, loading, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const myCourses = list.filter(course => course.teacher_id === user?.id);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        await dispatch(createNewCourse(newCourse));
        setShowCreateModal(false);
        setNewCourse({ title: '', description: '' });
    };

    const handleViewCourse = (id) => {
        navigate(`/courses/${id}`);
    };

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Courses</h1>
                    <p className={styles.subtitle}>Manage your courses and assignments</p>
                </div>
                <Button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} />
                    Create Course
                </Button>
            </div>

            {loading && <div className={styles.loader}>Loading courses...</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {myCourses.length > 0 ? (
                    myCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            actionLabel="View Details"
                            onAction={handleViewCourse}
                        />
                    ))
                ) : (
                    !loading && <p className={styles.emptyState}>You haven't created any courses yet.</p>
                )}
            </div>

            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Create New Course</h2>
                            <button onClick={() => setShowCreateModal(false)} className={styles.closeBtn}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateCourse}>
                            <Input
                                label="Course Title"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                required
                            />
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
                                <textarea
                                    className={styles.textarea}
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <Button variant="secondary" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                                <Button type="submit">Create Course</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default TeacherDashboard;
