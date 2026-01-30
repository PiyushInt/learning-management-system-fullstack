import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../store/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Login.module.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
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
        if (isLogin) {
            dispatch(loginUser({ email: formData.email, password: formData.password }));
        } else {
            dispatch(registerUser(formData));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className={styles.subtitle}>{isLogin ? 'Sign in to your account' : 'Join the learning platform'}</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLogin && (
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {!isLogin && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <label>
                                <input type="radio" name="role" value="STUDENT" checked={formData.role === 'STUDENT'} onChange={handleChange} /> Student
                            </label>
                            <label>
                                <input type="radio" name="role" value="TEACHER" checked={formData.role === 'TEACHER'} onChange={handleChange} /> Teacher
                            </label>
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} className={styles.submitBtn}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    <button
                        onClick={() => { setIsLogin(!isLogin); dispatch(clearError()); }}
                        style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
