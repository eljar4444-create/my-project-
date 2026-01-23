const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
    { name: 'Уборка', slug: 'cleaning', image: '/categories/cleaning.jpg' },
    { name: 'Грузоперевозки', slug: 'cargo', image: '/categories/cargo.jpg' },
    { name: 'Курьерские услуги', slug: 'courier', image: '/categories/courier.jpg' },
    { name: 'Компьютерная помощь', slug: 'computer-help', image: '/categories/computer.jpg' },
    { name: 'Репетиторы', slug: 'tutors', image: '/categories/tutors.jpg' },
    { name: 'Ремонт бытовой техники', slug: 'appliance-repair', image: '/categories/appliance.jpg' },
    { name: 'Автосервис', slug: 'auto', image: '/categories/auto.jpg' },
    { name: 'Помощь по хозяйству', slug: 'household', image: '/categories/household.jpg' },
    { name: 'Фото и видео', slug: 'photo-video', image: '/categories/photo.jpg' },
    { name: 'Юридическая помощь', slug: 'legal', image: '/categories/legal.jpg' },
    { name: 'Электрик', slug: 'electrician', image: '/categories/electrician.jpg' },
    { name: 'Сантехник', slug: 'plumber', image: '/categories/plumber.jpg' },
    { name: 'Мероприятия и промо', slug: 'events', image: '/categories/events.jpg' },
    { name: 'Дизайн', slug: 'design', image: '/categories/design.jpg' },
    { name: 'Разработка ПО', slug: 'development', image: '/categories/dev.jpg' },
    { name: 'Красота', slug: 'beauty', image: '/categories/beauty.jpg' },
    { name: 'Ремонт и строительство', slug: 'repair', image: '/categories/repair.jpg' },
];

async function main() {
    console.log('🌱 Seeding categories...');

    for (const cat of categories) {
        await prisma.serviceCategory.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                image: cat.image
            },
            create: cat
        });
        console.log(`+ ${cat.name}`);
    }

    const count = await prisma.serviceCategory.count();
    console.log(`✅ Total categories: ${count}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
