const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'marina@example.com' },
        include: { providerProfile: { include: { services: true } } }
    });

    if (!user) {
        console.log('User Marina not found');
        return;
    }

    if (!user.providerProfile) {
        console.log('Provider profile not found');
        return;
    }

    console.log('Services for Marina:', user.providerProfile.services);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
