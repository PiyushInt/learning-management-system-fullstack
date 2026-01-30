import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Fix: Replace prisma+postgres with postgresql to ensure standard client behavior
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('prisma+postgres://')) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('prisma+postgres://', 'postgresql://');
}

const prisma = new PrismaClient({});

export default prisma;
