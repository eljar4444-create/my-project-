import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🇷🇺 Translating Data to Russian...');

    // 1. Update Cities
    const cities = [
        { slug: 'new-york', name: 'Нью-Йорк' }, // Maybe change to Moscow?
        { slug: 'london', name: 'Лондон' },
        { slug: 'berlin', name: 'Берлин' },
        { slug: 'paris', name: 'Париж' },
        { slug: 'moscow', name: 'Москва' }, // New
        { slug: 'spb', name: 'Санкт-Петербург' }, // New
    ];

    for (const city of cities) {
        await prisma.city.upsert({
            where: { slug: city.slug },
            update: { name: city.name },
            create: { name: city.name, slug: city.slug }
        });
    }
    console.log('Cities updated.');

    // 2. Update Categories
    const categories = [
        { slug: 'plumbing', name: 'Сантехника' },
        { slug: 'cleaning', name: 'Уборка' },
        { slug: 'electrician', name: 'Электрика' },
        { slug: 'repair', name: 'Ремонт' },
        { slug: 'beauty', name: 'Красота' },
        { slug: 'tutor', name: 'Репетиторы' },
        { slug: 'auto', name: 'Автоуслуги' },
        { slug: 'courier', name: 'Курьерские услуги' },
        { slug: 'computer-help', name: 'Компьютерная помощь' },
        { slug: 'moving', name: 'Переезды' },
    ];

    for (const cat of categories) {
        await prisma.serviceCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        });
    }

    console.log('Categories updated.');
    console.log('✅ Translation Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
