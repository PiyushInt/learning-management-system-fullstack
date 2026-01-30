import React from 'react';
import { Book, User } from 'lucide-react';
import Button from './ui/Button';
import styles from './CourseCard.module.css';

const CourseCard = ({ course, onAction, actionLabel, secondaryAction }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Book size={24} className={styles.icon} />
                </div>
                <h3 className={styles.title}>{course.title}</h3>
            </div>

            <p className={styles.description}>{course.description || 'No description available.'}</p>

            <div className={styles.meta}>
                <div className={styles.teacher}>
                    <User size={14} />
                    <span>{course.teacher?.name || 'Unknown Teacher'}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={() => onAction(course.id)}>
                    {actionLabel}
                </Button>
                {secondaryAction}
            </div>
        </div>
    );
};

export default CourseCard;
