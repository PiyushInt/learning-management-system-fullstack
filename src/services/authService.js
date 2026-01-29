import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword, signToken } from '../utils/auth.js';

export const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already in use.');
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
        throw new Error('Invalid email or password.');
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
        throw new Error('Invalid email or password.');
    }

    const token = signToken({ id: user.id, role: user.role });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};
