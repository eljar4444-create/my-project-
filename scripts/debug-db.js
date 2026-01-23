const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    console.log(`User count: ${userCount}`);
    console.log(`Order count: ${orderCount}`);

    const users = await prisma.user.findMany();
    console.log('Users:', JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
