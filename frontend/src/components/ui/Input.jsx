import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

const Input = ({ label, error, className, id, ...props }) => {
    return (
        <div className={clsx(styles.container, className)}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <input
                id={id}
                className={clsx(styles.input, error && styles.inputError)}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default Input;
