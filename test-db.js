import prisma from './src/utils/prisma.js';

async function main() {
    try {
        console.log('Connecting...');
        const count = await prisma.user.count();
        console.log('Connection successful! User count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
