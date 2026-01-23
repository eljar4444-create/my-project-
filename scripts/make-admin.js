const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.log('Usage: node scripts/make-admin.js <email>');
    process.exit(1);
}

async function main() {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log(`User with email ${email} not found.`);
        return;
    }

    await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    });

    console.log(`User ${email} is now an ADMIN.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
