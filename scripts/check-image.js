const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
    const users = await prisma.user.findMany({
        where: { role: 'PROVIDER' },
        select: { id: true, name: true, email: true, image: true }
    });

    console.log('Provider Users:');
    users.forEach(u => {
        console.log(`- ${u.name} (${u.email})`);
        console.log(`  Image Path in DB: ${u.image}`);

        if (u.image) {
            // Check file existence
            // image path is like /uploads/filename.ext
            // we need to remove the leading / to join with current dir + public
            const relativePath = u.image.startsWith('/') ? u.image.substring(1) : u.image;
            const fullPath = path.join(process.cwd(), 'public', relativePath);
            const exists = fs.existsSync(fullPath);
            console.log(`  File exists at ${fullPath}? ${exists ? 'YES' : 'NO'}`);
        } else {
            console.log('  No image set.');
        }
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
