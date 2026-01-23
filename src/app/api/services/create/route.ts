import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateServiceSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    category: z.string(), // Name or ID
    price: z.number().min(0),
    city: z.string(), // Name or ID
    providerId: z.string(), // User ID
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = CreateServiceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
        }

        const { title, description, category, price, city, providerId } = result.data;

        // 1. Get Provider Profile
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: providerId }
        });

        if (!providerProfile) {
            // Auto-create profile if missing (or return error)
            return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
        }

        // 2. Resolve City (Find or Create)
        let cityRecord = await prisma.city.findFirst({
            where: {
                OR: [{ name: city }, { slug: city.toLowerCase() }]
            }
        });

        if (!cityRecord) {
            cityRecord = await prisma.city.create({
                data: { name: city, slug: city.toLowerCase().replace(/\s+/g, '-') }
            });
        }

        // 3. Resolve Category (Find or Error)
        // For categories, we might want to be strict, but for MVP let's allow create
        let categoryRecord = await prisma.serviceCategory.findFirst({
            where: {
                OR: [{ name: category }, { slug: category.toLowerCase() }]
            }
        });

        if (!categoryRecord) {
            categoryRecord = await prisma.serviceCategory.create({
                data: { name: category, slug: category.toLowerCase().replace(/\s+/g, '-') }
            });
        }

        const service = await prisma.service.create({
            data: {
                title,
                description,
                price,
                providerProfileId: providerProfile.id,
                cityId: cityRecord.id,
                categoryId: categoryRecord.id,
            },
        });

        return NextResponse.json({ success: true, service });

    } catch (error) {
        console.error('Create service error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
