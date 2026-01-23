const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Categories
    const beautyCategory = await prisma.serviceCategory.upsert({
        where: { slug: 'beauty' },
        update: {},
        create: {
            name: 'Красота',
            slug: 'beauty',
            image: '/categories/beauty.jpg'
        }
    });

    const repairCategory = await prisma.serviceCategory.upsert({
        where: { slug: 'repair' },
        update: {},
        create: {
            name: 'Ремонт и строительство',
            slug: 'repair',
            image: '/categories/repair.jpg'
        }
    });

    // 2. Create Masha (Client)
    const mashaEmail = 'masha@example.com';
    const mashaPassword = await bcrypt.hash('password123', 10);

    const masha = await prisma.user.upsert({
        where: { email: mashaEmail },
        update: {},
        create: {
            name: 'Маша Савина',
            email: mashaEmail,
            password: mashaPassword, // hashed
            role: 'CLIENT',
            image: 'https://i.pravatar.cc/150?u=masha'
        }
    });

    console.log(`👤 Created Client: ${masha.name} (${masha.email})`);

    // 3. Create Marina (Provider)
    const marinaEmail = 'marina@example.com';
    const marinaPassword = await bcrypt.hash('password123', 10);

    const marina = await prisma.user.upsert({
        where: { email: marinaEmail },
        update: {},
        create: {
            name: 'Марина',
            email: marinaEmail,
            password: marinaPassword,
            role: 'PROVIDER',
            image: 'https://i.pravatar.cc/150?u=marina',
            providerProfile: {
                create: {
                    bio: 'Профессиональный косметолог с 5-летним стажем.',
                    rating: 4.9,
                    reviewCount: 15,
                    verificationStatus: 'APPROVED',
                    services: {
                        create: {
                            title: 'Массаж лица',
                            description: 'Классический массаж лица для улучшения тонуса кожи.',
                            price: 2500,
                            status: 'APPROVED',
                            category: {
                                connect: { id: beautyCategory.id }
                            },
                            city: {
                                connectOrCreate: {
                                    where: { slug: 'moscow' },
                                    create: { name: 'Москва', slug: 'moscow' }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(`🛠 Created Provider: ${marina.name} (${marina.email})`);

    // 4. Create Order for Masha
    const order = await prisma.order.create({
        data: {
            title: 'Нужен массаж шейно-воротниковой зоны',
            description: 'Сидячая работа, болит шея. Желательно выезд на дом или кабинет в центре.',
            budget: 3000,
            address: 'Москва, ул. Тверская',
            status: 'OPEN',
            clientId: masha.id,
            categoryId: beautyCategory.id
        }
    });

    console.log(`📝 Created Order: ${order.title}`);

    console.log('✅ Seed finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
