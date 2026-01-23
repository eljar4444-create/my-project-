import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'elyar4444@gmail.com'; // The creator account, should be CLIENT

    console.log(`Reverting role for ${email} to CLIENT...`);

    const user = await prisma.user.findFirst({
        where: { email: { contains: 'elyar4444' } }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`Found user: ${user.name} (${user.email}) - Current Role: ${user.role}`);

    await prisma.user.update({
        where: { id: user.id },
        data: { role: 'CLIENT' }, // Or PROVIDER if they were one, but user implies they are the 'creator' (client) side here. Safe to set to CLIENT to remove ADMIN access.
    });

    console.log('Done! User role set to CLIENT.');

    // Also verify Admin exists
    const admin = await prisma.user.findFirst({
        where: { email: { contains: 'eljar4444' } }
    });
    console.log(`\nVerifying Admin (eljar4444)... Role: ${admin?.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
