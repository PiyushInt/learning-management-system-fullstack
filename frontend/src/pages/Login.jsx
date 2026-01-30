import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            if (role === 'TEACHER') navigate('/teacher-dashboard');
            else if (role === 'STUDENT') navigate('/student-dashboard');
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, role, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                    <Button type="submit" isLoading={loading} className={styles.submitBtn}>
                        Sign In
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p>Don't have an account? Ask your administrator.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
