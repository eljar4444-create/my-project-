const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Beauty Category...');
    const beauty = await prisma.serviceCategory.findUnique({ where: { slug: 'beauty' } });
    if (!beauty) {
        console.log('ERROR: Beauty category not found!');
        return;
    }
    console.log(`Beauty ID: ${beauty.id}`);

    console.log('\nChecking Services...');
    const allServices = await prisma.service.findMany({
        include: { category: true, providerProfile: true }
    });

    allServices.forEach(s => {
        console.log(`- Service: "${s.title}"`);
        console.log(`  Status: ${s.status}`);
        console.log(`  Category: ${s.category?.name} (${s.categoryId})`);
        console.log(`  Provider: ${s.providerProfileId}`);
        console.log(`  Match? ${s.categoryId === beauty.id && s.status === 'APPROVED' ? 'YES' : 'NO'}`);
        console.log('---');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
