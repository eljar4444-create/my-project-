'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const budgetRaw = formData.get('budget') as string;
    const address = formData.get('address') as string;
    const categoryId = formData.get('categoryId') as string;

    const budget = budgetRaw ? parseFloat(budgetRaw) : null;
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;

    if (!title || !description || !categoryId) {
        throw new Error('Missing required fields');
    }

    await prisma.order.create({
        data: {
            title,
            description,
            budget,
            address,
            subcategory: formData.get('subcategory') as string,
            categoryId,
            clientId: session.user.id,
            status: 'PENDING_MODERATION',
            latitude,
            longitude
        }
    });

    redirect('/create-order/success');
}
