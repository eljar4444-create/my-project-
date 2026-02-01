'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upgradeToProvider() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;

    // Update user role
    await prisma.user.update({
        where: { id: userId },
        data: { role: 'PROVIDER' }
    });

    // Create Provider Profile if not exists
    const existingProfile = await prisma.providerProfile.findUnique({
        where: { userId }
    });

    if (!existingProfile) {
        await prisma.providerProfile.create({
            data: {
                userId,
                bio: '',
                verificationStatus: 'IDLE'
            }
        });
    }

    // Revalidate paths that might show role-specific UI
    revalidatePath('/');
    revalidatePath('/search');
    revalidatePath('/account');

    // Redirect to provider profile
    redirect('/provider/profile');
}

export async function updateProviderProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const bio = formData.get('bio') as string;
    const age = formData.get('age') ? parseInt(formData.get('age') as string) : null;
    const education = formData.get('education') as string;
    const contactTime = formData.get('contactTime') as string;

    const name = formData.get('name') as string;

    // Update User name
    if (name) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name }
        });
    }

    await prisma.providerProfile.update({
        where: { userId: session.user.id },
        data: {
            bio,
            age,
            education,
            contactTime
        }
    });

    revalidatePath('/provider/profile');
    revalidatePath(`/services`); // Revalidate services where profile might be shown
    redirect('/provider/profile');
}
