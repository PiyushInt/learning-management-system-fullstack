import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    disabled,
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(styles.button, styles[variant], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className={styles.spinner} size={16} />}
            {children}
        </button>
    );
};

export default Button;
