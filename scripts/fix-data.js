const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const beauty = await prisma.serviceCategory.findUnique({ where: { slug: 'beauty' } });

    // 1. Update the APPROVED service
    const approved = await prisma.service.findFirst({
        where: { status: 'APPROVED' }
    });

    if (approved) {
        console.log(`Updating Approved service '${approved.id}' to Beauty...`);
        await prisma.service.update({
            where: { id: approved.id },
            data: { categoryId: beauty.id }
        });
    } else {
        console.log('No APPROVED service found!');
    }

    // 2. Delete PENDING duplicates for Marina
    console.log('Cleaning up pending duplicates...');
    const pending = await prisma.service.deleteMany({
        where: {
            title: { contains: 'Маникюр' },
            status: 'PENDING'
        }
    });
    console.log(`Deleted ${pending.count} pending services.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
