import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { LogOut, BookOpen, User } from 'lucide-react';
import Button from './ui/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.brand}>
                    <BookOpen className={styles.icon} />
                    <span>LMS</span>
                </Link>
                <div className={styles.actions}>
                    <div className={styles.userInfo}>
                        <User size={18} />
                        <span className={styles.userName}>{user?.name} ({role})</span>
                    </div>
                    <Button variant="secondary" onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={16} />
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
