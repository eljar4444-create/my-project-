
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Star, ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ServiceCard } from '@/components/ServiceCard';

interface ProfilePageProps {
    params: {
        id: string;
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const userId = params.id;

    const provider = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            providerProfile: {
                include: {
                    services: {
                        where: { status: 'APPROVED' },
                        include: {
                            city: true,
                            category: true,
                            providerProfile: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!provider) {
        return notFound();
    }

    const { providerProfile } = provider;
    const isProvider = !!providerProfile;
    const isVerified = providerProfile?.verificationStatus === 'APPROVED';

    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* Header removed to use Global Header */}
            <div className="pt-24 container mx-auto px-4 max-w-5xl">
                <Link href="/search" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Назад к поиску</span>
                </Link>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg relative">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={provider.image || undefined} className="object-cover" />
                                        <AvatarFallback className="bg-gray-100 text-gray-400 text-4xl font-bold">
                                            {provider.name?.[0] || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{provider.name || 'Пользователь'}</h1>

                                {isVerified && (
                                    <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Документы проверены</span>
                                    </div>
                                )}

                                {isProvider ? (
                                    <div className="flex items-center gap-1 text-amber-500 mb-6">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="font-bold text-lg">{providerProfile.rating.toFixed(1)}</span>
                                        <span className="text-gray-400 text-sm ml-1">({providerProfile.reviewCount} отзывов)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-gray-400 mb-6">
                                        <span className="text-sm">Заказчик</span>
                                    </div>
                                )}

                                <div className="w-full space-y-3">
                                    <Button className="w-full h-12 rounded-xl text-base font-medium bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">
                                        Написать сообщение
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">На сервисе с {new Date(provider.createdAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                            </div>
                        </div>

                        {isProvider && providerProfile.bio && (
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg mb-3">О себе</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {providerProfile.bio}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Services (Only for Providers) */}
                    {isProvider && (
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Услуги исполнителя</h2>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    {providerProfile.services.length}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {providerProfile.services.length > 0 ? (
                                    providerProfile.services.map((service) => (
                                        // Adapt Service object to match ServiceCard expectations
                                        <ServiceCard
                                            key={service.id}
                                            service={{
                                                ...service,
                                                category: service.category.name,
                                                city: service.city?.name || '',
                                                provider: {
                                                    name: provider.name || '',
                                                    email: provider.email || ''
                                                }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                                        <div className="text-gray-400 mb-2">Нет активных услуг</div>
                                        <p className="text-sm text-gray-500">Этот исполнитель пока не опубликовал ни одной услуги</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!isProvider && (
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Это профиль заказчика</h2>
                                <p className="text-gray-500">Пользователь публикует заказы и ищет исполнителей.<br />Вы можете связаться с ним, если откликнулись на его заказ.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
