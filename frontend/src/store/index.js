import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: courseReducer,
        // assignment: assignmentReducer,
    },
});

export default store;
