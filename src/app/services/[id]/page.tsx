import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, User, Calendar, CheckCircle2, Mail, ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/auth';
import React from 'react';


export default async function ServicePage({ params }: { params: { id: string } }) {


    const service = await prisma.service.findUnique({
        where: { id: params.id },
        include: {
            providerProfile: {
                include: { user: true }
            },
            category: true,
            city: true,
            photos: true,
            reviews: {
                include: {
                    author: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!service) {
        notFound();
    }

    const session = await auth();
    const isOwner = session?.user?.id === service.providerProfile.user.id;
    const profile = service.providerProfile;
    const user = profile.user;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <Link
                    href="/search"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium mb-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Назад к поиску
                </Link>

                {/* Profile Header Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <Avatar className="h-28 w-28 rounded-xl border-4 border-white shadow-md flex-shrink-0">
                            <AvatarImage src={user.image || ''} className="object-cover rounded-xl" />
                            <AvatarFallback className="text-4xl bg-blue-100 text-blue-600 rounded-xl">
                                {user.name?.charAt(0) || 'P'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{user.name}</h1>
                                    <p className="text-gray-500 text-sm">В сети недавно</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button className="bg-[#FF6633] hover:bg-[#EE5522] text-white font-bold rounded-full px-6 flex gap-2 items-center">
                                        <div className="bg-white/20 p-1 rounded-full">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor" /></svg>
                                        </div>
                                        Телефон
                                    </Button>
                                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full px-6 flex gap-2 items-center">
                                        <Mail className="w-4 h-4" />
                                        Чат
                                    </Button>
                                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full px-6">
                                        Предложить заказ
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 text-base text-gray-700">
                                <p className="leading-relaxed text-gray-700">
                                    {service.description}
                                </p>

                                <div className="grid gap-2 text-sm sm:text-base">
                                    {profile.age && (
                                        <div className="flex gap-2">
                                            <span className="font-bold whitespace-nowrap min-w-[120px]">Возраст:</span>
                                            <span>{profile.age} лет</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <span className="font-bold whitespace-nowrap min-w-[120px]">Опыт:</span>
                                        <span>{service.experience ? `Более ${service.experience} лет` : 'Не указан'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold whitespace-nowrap min-w-[120px]">Дни работы:</span>
                                        <span>{service.schedule || 'По договоренности'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold whitespace-nowrap min-w-[120px]">Время работы:</span>
                                        <span>{service.workTime || 'По договоренности'}</span>
                                    </div>
                                </div>

                                {/* Photos Grid */}
                                {service.photos && service.photos.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <span className="font-bold text-gray-900 block">Фотографии работ:</span>
                                        <div className="flex flex-wrap gap-3">
                                            {service.photos.map((photo) => (
                                                <div key={photo.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 group cursor-pointer">
                                                    <img src={photo.url} alt={service.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price List Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-gray-900">{service.category.name}</h2>
                        {(() => {
                            let subName = service.subcategory || service.title;
                            let priceDisplay = null;

                            try {
                                if (service.subcategory) {
                                    const parsed = JSON.parse(service.subcategory);
                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                        const item = parsed[0];
                                        subName = item.name;
                                        if (item.priceType === 'agreement') {
                                            priceDisplay = <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">по договорённости</span>;
                                        } else if (item.price) {
                                            priceDisplay = <span className="ml-3 text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">{item.price} €</span>;
                                        }
                                    }
                                }
                            } catch (e) {
                                // Legacy string, keep default
                            }

                            return (
                                <div className="flex justify-between items-center w-full mt-1">
                                    <h3 className="text-lg font-medium text-gray-700">{subName}</h3>
                                    {priceDisplay && (
                                        <div className="ml-4 flex-shrink-0">
                                            {/* Reuse same classes as price list items for consistency */}
                                            {React.cloneElement(priceDisplay as React.ReactElement, {
                                                className: "font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Price List Rendering */}
                    {(() => {
                        if (!service.priceList) return (
                            <div className="p-6 text-gray-500 italic">Цены не указаны</div>
                        );
                        try {
                            const priceItems: { description: string, price: string }[] = JSON.parse(service.priceList as string);
                            if (!Array.isArray(priceItems) || priceItems.length === 0) return (
                                <div className="p-6 text-gray-500 italic">Цены не указаны</div>
                            );

                            return (
                                <div className="divide-y divide-gray-50">
                                    {priceItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors group">
                                            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{item.description}</span>
                                            <span className="font-bold text-gray-900 whitespace-nowrap ml-4 bg-gray-100 px-3 py-1 rounded-full text-sm group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                                                {item.price === 'agreement' ? 'по договорённости' : `${item.price} €`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        } catch (e) { return null; }
                    })()}
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Отзывы ({service.reviews.length})</h2>
                    {service.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {service.reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                <AvatarImage src={review.author.image || ''} />
                                                <AvatarFallback>{review.author.name?.charAt(0) || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{review.author.name}</p>
                                                <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Отзывов пока нет.</p>
                    )}
                </div>
            </div >

            {isOwner && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Link href={`/provider/services/edit/${service.id}`}>
                        <Button className="bg-[#fc0] hover:bg-[#e6b800] text-black font-bold h-14 px-8 rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-105">
                            <Pencil className="w-5 h-5" />
                            Редактировать услугу
                        </Button>
                    </Link>
                </div>
            )
            }
        </div >
    );
}
