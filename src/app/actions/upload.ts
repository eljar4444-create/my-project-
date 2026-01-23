'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadServicePhoto(formData: FormData) {
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
    const filename = `service-${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);

    // Write file to public/uploads
    try {
        await writeFile(path, buffer);
    } catch (e) {
        console.error('Error saving file:', e);
        throw new Error('Failed to save file to server');
    }

    return { success: true, imageUrl: `/uploads/${filename}` };
}
