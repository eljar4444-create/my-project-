const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Fix Alena's service
    console.log('Fixing Alena service...');
    const wrongService = await prisma.service.findFirst({
        where: {
            title: { contains: 'Наращивание' },
            category: { slug: 'plumbing' } // It was plumbing in screenshot
        }
    });

    if (wrongService) {
        const beauty = await prisma.serviceCategory.findUnique({ where: { slug: 'beauty' } });
        if (beauty) {
            await prisma.service.update({
                where: { id: wrongService.id },
                data: { categoryId: beauty.id }
            });
            console.log(`Moved "${wrongService.title}" to Beauty.`);
        } else {
            console.log('Beauty category not found.');
        }
    } else {
        console.log('Service not found or already fixed.');
    }

    // 2. List all categories for reference
    console.log('\nAvailable Categories:');
    const cats = await prisma.serviceCategory.findMany();
    cats.forEach(c => console.log(`- ${c.name} (${c.id})`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
