import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, createAssignment, submitAssignment, fetchSubmissions } from '../store/assignmentSlice';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './CourseDetail.module.css';

const CourseDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { list: assignments, submissionsMap, loading, error } = useSelector((state) => state.assignments);
    const { role } = useSelector((state) => state.auth);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '' });
    const [submissionContent, setSubmissionContent] = useState('');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

    // For viewing submissions
    const [viewSubmissionsId, setViewSubmissionsId] = useState(null);

    useEffect(() => {
        dispatch(fetchAssignments(id));
    }, [dispatch, id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        await dispatch(createAssignment({ courseId: id, assignmentData: newAssignment }));
        setShowCreateModal(false);
        setNewAssignment({ title: '', description: '', due_date: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAssignmentId) return;
        await dispatch(submitAssignment({ assignmentId: selectedAssignmentId, content: submissionContent }));
        setSelectedAssignmentId(null);
        setSubmissionContent('');
        alert('Assignment submitted!');
    };

    const handleViewSubmissions = (assignmentId) => {
        setViewSubmissionsId(assignmentId);
        dispatch(fetchSubmissions(assignmentId));
    };

    const currentSubmissions = viewSubmissionsId ? submissionsMap[viewSubmissionsId] || [] : [];

    return (
        <Layout>
            <div className={styles.header}>
                <h1>Course Details</h1>
                {role === 'TEACHER' && (
                    <Button onClick={() => setShowCreateModal(true)} className={styles.createBtn}>
                        Add Assignment
                    </Button>
                )}
            </div>

            {loading && <p>Loading assignments...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.assignmentList}>
                <h2>Assignments</h2>
                {assignments.length === 0 ? <p>No assignments yet.</p> : (
                    assignments.map(assignment => (
                        <div key={assignment.id} className={styles.assignmentCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    <p className={styles.dueDate}>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                </div>
                                {role === 'TEACHER' && (
                                    <div className={styles.studentActions}>
                                        <Button variant="secondary" onClick={() => handleViewSubmissions(assignment.id)}>
                                            View Submissions
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {role === 'STUDENT' && (
                                <div className={styles.studentActions}>
                                    <Button onClick={() => setSelectedAssignmentId(assignment.id)}>
                                        Submit Work
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Create Assignment</h2>
                        <form onSubmit={handleCreate}>
                            <Input label="Title" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} required />
                            <Input label="Due Date" type="date" value={newAssignment.due_date} onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })} required />
                            <div style={{ marginTop: '1rem' }}>
                                <label>Description</label>
                                <textarea className={styles.textarea} value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                            </div>
                            <div className={styles.modalActions}>
                                <Button variant="secondary" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submit Assignment Modal */}
            {selectedAssignmentId && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Submit Assignment</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginTop: '1rem' }}>
                                <label>Your Work (Text/Link)</label>
                                <textarea className={styles.textarea} value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} required rows={5} />
                            </div>
                            <div className={styles.modalActions}>
                                <Button variant="secondary" onClick={() => setSelectedAssignmentId(null)} type="button">Cancel</Button>
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Submissions Modal */}
            {viewSubmissionsId && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '600px' }}>
                        <h2>Submissions</h2>
                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {currentSubmissions.length === 0 ? <p>No submissions yet.</p> : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {currentSubmissions.map(sub => (
                                        <li key={sub.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
                                            <strong>{sub.student?.name || 'Unknown Student'}</strong>
                                            <p style={{ margin: '0.5rem 0', background: '#f9fafb', padding: '0.5rem', borderRadius: '4px' }}>{sub.content}</p>
                                            <small>{new Date(sub.submitted_at).toLocaleString()}</small>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <Button variant="secondary" onClick={() => setViewSubmissionsId(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default CourseDetail;
