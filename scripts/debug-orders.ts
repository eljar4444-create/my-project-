import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all orders...');
    const orders = await prisma.order.findMany({
        include: { client: true }
    });

    if (orders.length === 0) {
        console.log('No orders found in the database.');
    } else {
        console.log(`Found ${orders.length} orders:`);
        orders.forEach(o => {
            console.log(`- ID: ${o.id}`);
            console.log(`  Title: ${o.title}`);
            console.log(`  Status: ${o.status}`);
            console.log(`  Client: ${o.client.email} (${o.client.role})`);
            console.log('---');
        });
    }

    console.log('\nChecking Admin User (eljar4444@gmail.com)...');
    const admin = await prisma.user.findFirst({
        where: { email: { contains: 'eljar4444' } }
    });
    if (admin) {
        console.log(`Admin User Role: ${admin.role}`);
    } else {
        console.log('Admin user not found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
