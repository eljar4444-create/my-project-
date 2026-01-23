import { auth } from '@/auth';
import { AddressForm } from '@/components/provider/AddressForm';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AddressPage() {
    const session = await auth();
    if (!session?.user) redirect('/auth/login');

    const profile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) redirect('/');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Адреса и география</h1>
            <AddressForm
                initialData={{
                    address: profile.address || '',
                    city: profile.city || '',
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    radius: profile.serviceRadius
                }}
            />
        </div>
    );
}
