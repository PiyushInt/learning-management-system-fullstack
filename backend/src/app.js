import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import crypto from 'crypto';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    next();
});


app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/assignments', assignmentRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mini LMS Backend API' });
});

app.use(errorHandler);

export default app;
