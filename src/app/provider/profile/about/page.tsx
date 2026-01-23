import { auth } from '@/auth';
import { AboutForm } from '@/components/provider/AboutForm';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AboutPage() {
    const session = await auth();
    if (!session?.user) redirect('/auth/login');

    const profile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) redirect('/');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">О себе</h1>
            <AboutForm
                initialData={{
                    bio: profile.bio || ''
                }}
            />
        </div>
    );
}
