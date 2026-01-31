import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';
import assignmentReducer from './assignmentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: courseReducer,
        assignments: assignmentReducer,
    },
});

export default store;
