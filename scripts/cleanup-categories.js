const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up stale categories...');

    // List of slugs that are NOT in our officially supported list or are duplicates
    const staleSlugs = ['plumbing'];

    // Also, we want to fix names if they are English but slug is correct (though seed should handle this, let's look for them)
    // Actually, simply deleting 'plumbing' is the main fix for the user's issue.
    // 'repair' and 'beauty' will be fixed by running the seed script again (update name by slug).

    const deleted = await prisma.serviceCategory.deleteMany({
        where: {
            slug: { in: staleSlugs }
        }
    });

    console.log(`Deleted ${deleted.count} stale categories.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
