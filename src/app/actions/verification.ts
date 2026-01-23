'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { revalidatePath } from 'next/cache';

export async function uploadVerificationDocuments(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    const passport = formData.get('passport') as File | null;
    const driverLicense = formData.get('driverLicense') as File | null;

    if (!passport && !driverLicense) {
        return { success: false, error: 'Heобходимо загрузить хотя бы один документ' };
    }

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public/uploads/verification');
    await mkdir(uploadDir, { recursive: true });

    const savedDocs: Record<string, string> = {};

    async function saveFile(file: File, prefix: string, userId: string) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            throw new Error(`Invalid file type for ${prefix}. Only images and PDF allowed.`);
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.name) || '.jpg';
        const filename = `${userId}-${prefix}-${uniqueSuffix}${ext}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        return `/uploads/verification/${filename}`;
    }

    try {
        if (passport) {
            savedDocs.passport = await saveFile(passport, 'passport', session.user!.id!);
        }
        if (driverLicense) {
            savedDocs.driverLicense = await saveFile(driverLicense, 'driverLicense', session.user!.id!);
        }

        // Update provider profile
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { providerProfile: true }
        });

        if (!user) return { success: false, error: 'User not found' };

        // Create profile if doesn't exist (should exist for provider, but safe check)
        // Actually, we expect a provider profile.

        if (!user.providerProfile) {
            // Create a default profile if missing? Or error? 
            // Logic suggests user is Provider if they are on this page.
            await prisma.providerProfile.create({
                data: {
                    userId: user.id,
                    verificationStatus: 'PENDING',
                    verificationDocs: JSON.stringify(savedDocs)
                }
            });
        } else {
            await prisma.providerProfile.update({
                where: { userId: user.id },
                data: {
                    verificationStatus: 'PENDING',
                    verificationDocs: JSON.stringify(savedDocs)
                }
            });
        }

        revalidatePath('/provider/profile');
        return { success: true };

    } catch (error) {
        console.error('Error uploading verification docs:', error);
        // @ts-ignore
        return { success: false, error: `Failed to upload documents: ${error.message || 'Unknown error'}` };
    }
}
