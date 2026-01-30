import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { courseService } from '../services/courseService';

export const fetchAssignments = createAsyncThunk(
    'assignments/fetchByCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            return await courseService.getCourseAssignments(courseId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch assignments');
        }
    }
);

export const createAssignment = createAsyncThunk(
    'assignments/create',
    async ({ courseId, assignmentData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/courses/${courseId}/assignments`, assignmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create assignment');
        }
    }
);

export const submitAssignment = createAsyncThunk(
    'assignments/submit',
    async ({ assignmentId, content }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/assignments/${assignmentId}/submit`, { content });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to submit assignment');
        }
    }
);

export const fetchSubmissions = createAsyncThunk(
    'assignments/fetchSubmissions',
    async (assignmentId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/assignments/${assignmentId}/submissions`);
            return { assignmentId, submissions: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch submissions');
        }
    }
);

const initialState = {
    list: [],
    submissionsMap: {}, // { assignmentId: [submissions] }
    loading: false,
    error: null,
};

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {
        clearAssignments: (state) => {
            state.list = [];
            state.submissionsMap = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.submissionsMap[action.payload.assignmentId] = action.payload.submissions;
            });
    },
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
