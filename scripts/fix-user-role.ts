import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'eljar4444@gmail.com'; // User's email from screenshot/context

    console.log(`Fixing role for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    if (user.role === 'PROVIDER') {
        console.log('User is already a PROVIDER.');

        // Ensure profile exists
        const profile = await prisma.providerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            console.log('Creating missing ProviderProfile...');
            await prisma.providerProfile.create({
                data: { userId: user.id }
            });
            console.log('ProviderProfile created.');
        }
        return;
    }

    console.log('Updating user role to PROVIDER...');
    await prisma.user.update({
        where: { id: user.id },
        data: { role: 'PROVIDER' },
    });

    console.log('Creating ProviderProfile...');
    try {
        await prisma.providerProfile.create({
            data: { userId: user.id }
        });
    } catch (e) {
        console.log('ProviderProfile might already exist or error:', e);
    }

    console.log('Done! Role updated to PROVIDER.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
