const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.serviceCategory.findMany();
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(c => console.log(`- ${c.name} (${c.slug})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
