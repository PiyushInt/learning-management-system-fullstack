import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../services/courseService';

export const fetchCourses = createAsyncThunk(
    'courses/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await courseService.getAllCourses();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch courses');
        }
    }
);

export const fetchEnrolledCourses = createAsyncThunk(
    'courses/fetchEnrolled',
    async (_, { rejectWithValue }) => {
        try {
            return await courseService.getEnrolledCourses();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch enrolled courses');
        }
    }
);

export const createNewCourse = createAsyncThunk(
    'courses/create',
    async (courseData, { rejectWithValue }) => {
        try {
            return await courseService.createCourse(courseData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create course');
        }
    }
);

export const enrollInCourse = createAsyncThunk(
    'courses/enroll',
    async (courseId, { rejectWithValue }) => {
        try {
            return await courseService.enrollStudent(courseId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to enroll');
        }
    }
);

const initialState = {
    list: [],
    enrolledList: [],
    loading: false,
    error: null,
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCourses: (state) => {
            state.list = [];
            state.enrolledList = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEnrolledCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.enrolledList = action.payload;
            })
            .addCase(fetchEnrolledCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNewCourse.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearCourses } = courseSlice.actions;
export default courseSlice.reducer;
