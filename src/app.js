import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/assignments', assignmentRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mini LMS Backend API' });
});

// Error handling middleware placeholder
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
