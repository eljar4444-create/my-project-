import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CATEGORIES, SUB_CATEGORIES } from '@/constants/categories';

// Simple API Key protection to prevent public abuse
const SEED_SECRET = 'temp-seed-key-123';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== SEED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('🔄 Syncing Categories...');
        const results = [];

        for (const cat of CATEGORIES) {
            // Upsert categories
            const result = await prisma.serviceCategory.upsert({
                where: { slug: cat.id },
                update: {
                    name: cat.name,
                    slug: cat.id
                },
                create: {
                    name: cat.name,
                    slug: cat.id,
                }
            });
            results.push(`Synced Category: ${cat.name}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Categories synced successfully',
            details: results
        });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Failed to seed', details: String(error) }, { status: 500 });
    }
}
