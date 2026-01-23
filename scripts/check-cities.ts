import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cities = await prisma.city.findMany();
    console.log(JSON.stringify(cities, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
