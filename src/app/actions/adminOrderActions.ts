'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function approveOrder(orderId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'OPEN' }
    });

    revalidatePath('/admin/orders');
    revalidatePath('/orders');
}

export async function rejectOrder(orderId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'REJECTED' }
    });

    revalidatePath('/admin/orders');
    revalidatePath('/orders');
}
