import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword, signToken } from '../utils/auth.js';
import { AppError } from '../core/errors.js';

export const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError('Email already in use.', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash: hashedPassword,
            role
        }
    });

    const token = signToken({ id: user.id, role: user.role });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const loginUser = async (credentials) => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const token = signToken({ id: user.id, role: user.role });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};
