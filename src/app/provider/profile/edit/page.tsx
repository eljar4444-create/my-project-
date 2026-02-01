import { auth } from '@/auth';
import { EditProfileForm } from '@/components/provider/EditProfileForm';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/auth/login');
    }

    const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!providerProfile) {
        redirect('/provider/profile'); // Or error
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <EditProfileForm initialData={{ ...providerProfile, name: session.user.name }} />
        </div>
    );
}
