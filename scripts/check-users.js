const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });

    console.log('Total users:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));

    const admins = users.filter(u => u.role === 'ADMIN');
    console.log('Admins count:', admins.length);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
