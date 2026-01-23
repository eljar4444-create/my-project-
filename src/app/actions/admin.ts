'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateServiceStatus(serviceId: string, status: 'APPROVED' | 'REJECTED') {
    try {
        await prisma.service.update({
            where: { id: serviceId },
            data: { status },
        });

        // Revalidate the moderation page and the home page (where approved services are shown)
        revalidatePath('/admin/moderation');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update service status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

import { auth } from '@/auth';

export async function getPendingVerifications() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return [];

    const profiles = await prisma.providerProfile.findMany({
        where: { verificationStatus: 'PENDING' },
        include: { user: true }
    });
    return profiles;
}

export async function updateVerificationStatus(userId: string, status: 'APPROVED' | 'REJECTED') {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    await prisma.providerProfile.update({
        where: { userId },
        data: { verificationStatus: status }
    });

    revalidatePath('/admin/verification');
    revalidatePath('/provider/profile');
    return { success: true };
}
