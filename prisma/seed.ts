import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding V2 Database...');

    // --- Clean up ---
    console.log('Cleaning old data...');
    await prisma.review.deleteMany();
    await prisma.request.deleteMany();
    await prisma.order.deleteMany();
    await prisma.providerSubscription.deleteMany();
    await prisma.service.deleteMany();
    await prisma.city.deleteMany();
    await prisma.serviceCategory.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.user.deleteMany();

    // --- 1. Master Data: Cities ---
    console.log(' Creating Cities...');
    const berlin = await prisma.city.create({ data: { name: 'Берлин', slug: 'berlin' } });
    const munich = await prisma.city.create({ data: { name: 'Мюнхен', slug: 'munich' } });
    const hamburg = await prisma.city.create({ data: { name: 'Гамбург', slug: 'hamburg' } });
    const frankfurt = await prisma.city.create({ data: { name: 'Франкфурт', slug: 'frankfurt' } });

    // --- 2. Master Data: Categories ---
    console.log(' Creating Categories...');
    await prisma.serviceCategory.create({ data: { name: 'Сантехника', slug: 'plumbing' } });
    await prisma.serviceCategory.create({ data: { name: 'Уборка', slug: 'cleaning' } });
    await prisma.serviceCategory.create({ data: { name: 'Электрика', slug: 'electrician' } });
    await prisma.serviceCategory.create({ data: { name: 'Ремонт', slug: 'repair' } });
    await prisma.serviceCategory.create({ data: { name: 'Красота', slug: 'beauty' } });
    await prisma.serviceCategory.create({ data: { name: 'Автоуслуги', slug: 'auto' } });
    await prisma.serviceCategory.create({ data: { name: 'Компьютерная помощь', slug: 'computer-help' } });

    // --- 3. Master Data: Subscription Plans ---
    console.log(' Creating/Updating Plans...');
    const freePlan = await prisma.subscriptionPlan.create({
        data: { name: 'FREE', price: 0, features: JSON.stringify(['Basic Profile', '1 Service']) }
    });
    const proPlan = await prisma.subscriptionPlan.create({
        data: { name: 'PRO', price: 29.99, features: JSON.stringify(['Unlimited Services', 'Analytics', 'Top Listing']) }
    });

    // --- 4. Users: Provider ---
    console.log(' Creating Provider...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const providerUser = await prisma.user.create({
        data: {
            email: 'marina@example.com',
            password: hashedPassword,
            name: 'Марина',
            role: 'PROVIDER',
        }
    });

    const providerProfile = await prisma.providerProfile.create({
        data: {
            userId: providerUser.id,
            bio: 'Профессиональный мастер маникюра с 5-летним стажем.',
            rating: 4.9,
            reviewCount: 24,
        }
    });

    // Subscribe Provider to PRO
    await prisma.providerSubscription.create({
        data: {
            providerProfileId: providerProfile.id,
            planId: proPlan.id,
        }
    });

    // Services will be created manually by user

    // --- 5. Users: Client ---
    console.log(' Creating Client...');
    const clientUser = await prisma.user.create({
        data: {
            email: 'client@example.com',
            password: hashedPassword,
            name: 'Alice Shopper',
            role: 'CLIENT',
        }
    });

    console.log('✅ Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
