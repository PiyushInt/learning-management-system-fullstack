import { jest } from '@jest/globals';

// Define mocks before importing the modules that use them
jest.unstable_mockModule('../src/utils/prisma.js', () => ({
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}));

jest.unstable_mockModule('../src/utils/auth.js', () => ({
    hashPassword: jest.fn(),
    comparePassword: jest.fn(),
    signToken: jest.fn()
}));

// Dynamic imports
const { registerUser } = await import('../src/services/authService.js');
const prisma = (await import('../src/utils/prisma.js')).default;
const authUtils = await import('../src/utils/auth.js');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'STUDENT'
            };

            prisma.user.findUnique.mockResolvedValue(null);
            authUtils.hashPassword.mockResolvedValue('hashed_password');
            prisma.user.create.mockResolvedValue({
                id: 1,
                ...userData,
                password_hash: 'hashed_password'
            });
            authUtils.signToken.mockReturnValue('valid_token');

            const result = await registerUser(userData);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: userData.email } });
            expect(prisma.user.create).toHaveBeenCalled();
            expect(result).toHaveProperty('token', 'valid_token');
            expect(result.user).toHaveProperty('email', userData.email);
        });

        it('should throw error if email already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com' });

            await expect(registerUser({
                name: 'Test',
                email: 'test@example.com',
                password: 'pw',
                role: 'STUDENT'
            })).rejects.toThrow('Email already in use.');
        });
    });
});
