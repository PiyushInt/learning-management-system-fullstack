import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Use direct TCP connection to port 51214 (Prisma Postgres TCP interface)
// Using hardcoded credentials as seen in the decoded api_key or assumed defaults of prisma dev
const connectionString = "postgresql://postgres:postgres@localhost:51214/postgres?sslmode=disable";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
