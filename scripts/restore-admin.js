const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'elyar4444@gmail.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if exists (unlikely after seed, but safe check)
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log('User exists, updating role/password...');
        await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                password: hashedPassword
            }
        });
    } else {
        console.log('Creating admin user...');
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin Elyar',
                role: 'ADMIN'
            }
        });
    }

    console.log(`Admin restored: ${email} / ${password}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
