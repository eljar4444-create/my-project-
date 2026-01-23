'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadProfilePhoto(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const file = formData.get('photo') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);

    // Write file to public/uploads
    try {
        await writeFile(path, buffer);
        console.log(`File saved to ${path}`);
    } catch (e) {
        console.error('Error saving file:', e);
        throw new Error('Failed to save file to server');
    }

    // Update user profile
    const imageUrl = `/uploads/${filename}`;
    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        });
    } catch (e) {
        console.error('Error updating user:', e);
        throw new Error('Failed to update user profile in database');
    }

    revalidatePath('/provider/profile');
    revalidatePath('/provider/profile/photo');
    revalidatePath('/'); // Update header

    return { success: true, imageUrl };
}

export async function updateBasicInfo(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            bio
        }
    });

    revalidatePath('/account');
    revalidatePath('/');
    return { success: true };
}
