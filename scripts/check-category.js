const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const service = await prisma.service.findFirst({
        where: { title: { contains: 'Маникюр' } },
        include: { category: true }
    });

    if (!service) {
        console.log('Service not found');
        return;
    }

    console.log(`Service '${service.title}' is in category: ${service.category.name} (${service.category.slug})`);

    // If not Beauty, let's fix it for the user
    if (service.category.slug !== 'beauty') {
        console.log('Fixing category to Beauty...');
        const beauty = await prisma.serviceCategory.findUnique({ where: { slug: 'beauty' } });
        if (beauty) {
            await prisma.service.update({
                where: { id: service.id },
                data: { categoryId: beauty.id }
            });
            console.log('Fixed!');
        } else {
            console.log('Beauty category not found!');
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
