
import { PrismaClient } from '@prisma/client';
import { CATEGORIES } from '../src/constants/categories'; // Adjust path as needed

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Syncing Categories...');

    for (const cat of CATEGORIES) {
        // Upsert categories: create if missing, update name/icon if exists
        await prisma.serviceCategory.upsert({
            where: { slug: cat.id }, // cat.id in constants is used as slug
            update: {
                name: cat.name,
                // Ensure slug is consistent
                slug: cat.id
            },
            create: {
                name: cat.name,
                slug: cat.id,
                // Add icon to name if no image field, or handle image if needed
            }
        });
        console.log(`✅ Synced: ${cat.name} (${cat.id})`);
    }

    console.log('🎉 Categories sync complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
