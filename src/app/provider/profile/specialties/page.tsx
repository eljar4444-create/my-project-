import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil } from 'lucide-react';

export default async function SpecialtiesPage() {
    const session = await auth();
    if (!session?.user) redirect('/auth/login');

    const profile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            services: {
                include: { category: true }
            }
        }
    });

    if (!profile) redirect('/');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Специальности и услуги</h1>
                <Link href="/provider/services/new">
                    <Button>+ Добавить услугу</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {profile.services.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        У вас пока нет добавленных услуг.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {profile.services.map((service) => (
                            <div key={service.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-gray-900">{service.title}</h3>
                                    <p className="text-sm text-gray-500">{service.category.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold">{service.price} €</span>
                                    <Link href={`/provider/services/edit/${service.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
