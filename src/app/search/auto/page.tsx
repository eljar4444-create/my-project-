'use client';

import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, CheckCircle2, ChevronDown, MapPin, Phone, MessageCircle, MoreVertical, Star, X } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { useSession } from 'next-auth/react';

function AutoSearchContent() {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get('service');
    // Normalize service param to lower case for comparison, handle null
    const selectedService = serviceParam ? serviceParam.toLowerCase() : null;

    // Define profiles with their associated services/keywords
    const ALL_PROFILES = [
        {
            id: 'mechanic',
            name: 'Иван Петров',
            role: 'Автомеханик • Стаж 12 лет',
            avatarFallback: 'ИП',
            avatarSrc: '/placeholder-mechanic.jpg',
            avatarColor: 'bg-gray-100 text-gray-600',
            services: [
                { name: 'Ремонт двигателя', price: 'от 100 €', highlight: true },
                { name: 'Замена масла', price: '30 €', highlight: true }
            ],
            // Matches 'автомеханик'
            keywords: ['автомеханик']
        },
        {
            id: 'electrician',
            name: 'Алексей Смирнов',
            role: 'Автоэлектрик • Выезд на место',
            avatarFallback: 'АС',
            avatarSrc: '',
            avatarColor: 'bg-blue-100 text-blue-600',
            services: [
                { name: 'Диагностика электроники', price: '50 €', highlight: true },
                { name: 'Ремонт проводки', price: 'от 80 €', highlight: true }
            ],
            // Matches 'автоэлектрик'
            keywords: ['автоэлектрик']
        },
        {
            id: 'diagnostic',
            name: 'Дмитрий Макаров',
            role: 'Компьютерная диагностика авто',
            avatarFallback: 'ДМ',
            avatarSrc: '',
            avatarColor: 'bg-green-100 text-green-600',
            services: [
                { name: 'Полная диагностика перед покупкой', price: '60 €', highlight: true }
            ],
            // Matches 'диагностика авто'
            keywords: ['диагностика авто']
        },
        {
            id: 'buyer',
            name: 'Максим Андреев',
            role: 'Автоподборщик • Эксперт',
            avatarFallback: 'МА',
            avatarSrc: '',
            avatarColor: 'bg-purple-100 text-purple-600',
            services: [
                { name: 'Подбор авто "под ключ"', price: '500 €', highlight: true },
                { name: 'Разовый осмотр', price: '80 €', highlight: true }
            ],
            // Matches 'помощь при покупке авто'
            keywords: ['помощь при покупке авто']
        },
        {
            id: 'service-helper',
            name: 'Сергей Волков',
            role: 'Сопровождение в сервисе • Защита от накруток',
            avatarFallback: 'СВ',
            avatarSrc: '',
            avatarColor: 'bg-indigo-100 text-indigo-600',
            services: [
                { name: 'Контроль ремонтных работ', price: '50 €/час', highlight: true }
            ],
            // Matches 'сопровождение в автосервисе'
            keywords: ['сопровождение в автосервисе']
        },
        {
            id: 'tuv',
            name: 'Подготовка к TÜV',
            role: 'Гарантия прохождения техосмотра',
            avatarFallback: 'TÜV',
            avatarSrc: '',
            avatarColor: 'bg-red-100 text-red-600',
            services: [
                { name: 'Предварительный осмотр + устранение дефектов', price: 'от 150 €', highlight: true }
            ],
            // Matches 'техосмотр (tüv)'
            keywords: ['техосмотр (tüv)']
        }
    ];

    // Filter profiles. If no service selected, show all (or maybe show categories? User imply separate person for subcat).
    // If selectedService is present, find match.
    // We are matching exact strings from the previous step.
    const displayedProfiles = selectedService
        ? ALL_PROFILES.filter(p => p.keywords.some(k => k.toLowerCase() === selectedService))
        : ALL_PROFILES; // Fallback: show all if no specific service selected

    const title = selectedService ? `${serviceParam} в Байройте` : 'Авто и Транспорт';

    return (
        <div className="container mx-auto px-4 max-w-7xl font-sans text-slate-900">
            {/* Main Content */}
            <main className="w-full py-8">

                <div className="max-w-[1400px] mx-auto px-12 py-8 flex gap-12 items-start">

                    {/* Middle Column: Results */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-6 flex items-center gap-4">
                            <h1 className="text-blue-600 font-bold text-lg capitalize">{title}</h1>
                            {selectedService && (
                                <Link href="/search/auto" className="text-xs text-gray-400 hover:text-gray-600 flex items-center">
                                    <X className="w-3 h-3 mr-1" /> Сбросить фильтр
                                </Link>
                            )}
                        </div>

                        {displayedProfiles.length > 0 ? (
                            displayedProfiles.map(profile => (
                                <div key={profile.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow">
                                    <div className="flex gap-6">
                                        <div className="space-y-3 shrink-0">
                                            <div className="w-32 h-32 rounded-2xl overflow-hidden relative">
                                                <Avatar className="w-full h-full rounded-none">
                                                    {profile.avatarSrc ? (
                                                        <AvatarImage src={profile.avatarSrc} className="object-cover" />
                                                    ) : null}
                                                    <AvatarFallback className={`${profile.avatarColor} text-4xl font-bold rounded-none`}>
                                                        {profile.avatarFallback}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
                                                <span>Паспорт<br />проверен</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link href="#" className="text-xl font-bold hover:text-red-500 text-blue-600">{profile.name}</Link>
                                                <button className="text-gray-300 hover:text-gray-500"><MoreVertical className="w-5 h-5" /></button>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-4">{profile.role}</div>
                                            <div className="space-y-2 mb-6">
                                                {profile.services.map((svc, idx) => (
                                                    <div key={idx} className="flex justify-between text-[15px]">
                                                        <span className="font-medium text-blue-600 hover:text-red-500 cursor-pointer">{svc.name}</span>
                                                        <span className="font-bold">{svc.price}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <Button className="bg-gray-100 hover:bg-gray-200 text-black rounded-xl px-6 h-10 font-medium shadow-none">
                                                    <Phone className="w-4 h-4 mr-2" /> Телефон
                                                </Button>
                                                <Button className="bg-gray-100 hover:bg-gray-200 text-black rounded-xl px-6 h-10 font-medium shadow-none">
                                                    <MessageCircle className="w-4 h-4 mr-2" /> Чат
                                                </Button>
                                                <Button className="bg-gray-100 hover:bg-gray-200 text-black rounded-xl px-6 h-10 font-medium shadow-none">
                                                    Предложить заказ
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                Специалисты по вашему запросу не найдены.
                                <br />
                                <Link href="/search/auto" className="text-blue-600 underline mt-2 block">Показать всех специалистов категории Авто</Link>
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 space-y-8 shrink-0">
                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Категории</h3>
                            <div className="flex flex-wrap gap-2">
                                {['автомеханик', 'автоэлектрик', 'диагностика авто', 'помощь при покупке авто', 'сопровождение в автосервисе', 'техосмотр (TÜV)'].map((tag, i) => (
                                    <Link key={i} href={`/search/auto?service=${encodeURIComponent(tag)}`}>
                                        <span className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors block mb-2 ${selectedService === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                            {tag}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AutoSearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AutoSearchContent />
        </Suspense>
    );
}
