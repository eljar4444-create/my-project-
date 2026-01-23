'use client';

import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, CheckCircle2, ChevronDown, MapPin, Phone, MessageCircle, MoreVertical, Star, X } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RepairSearchContent() {
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get('service');
    const selectedService = serviceParam ? serviceParam.toLowerCase() : null;

    const ALL_PROFILES = [
        {
            id: 'plumber',
            name: 'Виктор Смирнов',
            role: 'Сантехник • Стаж 15 лет',
            avatarFallback: 'ВС',
            avatarSrc: '',
            avatarColor: 'bg-blue-100 text-blue-600',
            services: [
                { name: 'Устранение засоров', price: 'от 50 €', highlight: true },
                { name: 'Установка смесителя', price: '40 €', highlight: true }
            ],
            keywords: ['сантехник']
        },
        {
            id: 'electrician-home',
            name: 'Михаил Козлов',
            role: 'Электрик • Аварийный выезд',
            avatarFallback: 'МК',
            avatarSrc: '',
            avatarColor: 'bg-yellow-100 text-yellow-600',
            services: [
                { name: 'Установка розеток', price: '20 €/шт', highlight: true },
                { name: 'Поиск неисправности', price: 'от 60 €', highlight: true }
            ],
            keywords: ['электрик']
        },
        {
            id: 'small-repair',
            name: 'Андрей Белов',
            role: 'Мастер на час • Мелкий ремонт',
            avatarFallback: 'АБ',
            avatarSrc: '',
            avatarColor: 'bg-green-100 text-green-600',
            services: [
                { name: 'Навеска карнизов', price: '30 €', highlight: true },
                { name: 'Замена замков', price: '45 €', highlight: true }
            ],
            keywords: ['мелкий ремонт']
        },
        {
            id: 'furniture',
            name: 'Команда "Сборка Про"',
            role: 'Сборка и разборка мебели',
            avatarFallback: 'СП',
            avatarSrc: '',
            avatarColor: 'bg-orange-100 text-orange-600',
            services: [
                { name: 'Сборка шкафа', price: 'от 80 €', highlight: true },
                { name: 'Сборка кухни', price: 'от 200 €', highlight: true }
            ],
            keywords: ['сборка мебели']
        },
        {
            id: 'cleaning',
            name: 'Елена Чистова',
            role: 'Клининг • Уборка квартир',
            avatarFallback: 'ЕЧ',
            avatarSrc: '',
            avatarColor: 'bg-pink-100 text-pink-600',
            services: [
                { name: 'Генеральная уборка', price: 'от 100 €', highlight: true },
                { name: 'Мытье окон', price: 'от 30 €', highlight: true }
            ],
            keywords: ['клининг']
        },
        {
            id: 'rent-help',
            name: 'Мария Власова',
            role: 'Помощь при сдаче жилья',
            avatarFallback: 'МВ',
            avatarSrc: '',
            avatarColor: 'bg-purple-100 text-purple-600',
            services: [
                { name: 'Подготовка квартиры', price: 'договорная', highlight: true },
                { name: 'Показ жильцам', price: '50 €', highlight: true }
            ],
            keywords: ['помощь при сдаче жилья']
        }
    ];

    const displayedProfiles = selectedService
        ? ALL_PROFILES.filter(p => p.keywords.some(k => k.toLowerCase() === selectedService))
        : ALL_PROFILES;

    const title = selectedService ? `${serviceParam} в Байройте` : 'Жильё и ремонт';

    return (
        <div className="container mx-auto px-4 max-w-7xl flex items-start gap-8 font-sans text-slate-900">
            {/* Sidebar (Left) */}
            {/* Sidebar (Left) */}
            <aside className="w-64 hidden lg:flex flex-col py-8 shrink-0">

                <nav className="space-y-6 text-gray-500 font-medium text-[15px]">
                    <Link href="/search" className="flex items-center gap-3 hover:text-black transition-colors">
                        <LayoutGrid className="w-5 h-5" />
                        Найти специалиста
                    </Link>
                    <Link href="/my-orders" className="flex items-center gap-3 hover:text-black transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                        Мои заказы
                    </Link>
                    <Link href="/become-provider" className="flex items-center gap-3 hover:text-black transition-colors">
                        <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">🛠</div>
                        Стать исполнителем
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 py-8">

                <div className="max-w-[1400px] mx-auto px-12 py-8 flex gap-12 items-start">

                    {/* Middle Column: Results */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-6 flex items-center gap-4">
                            <h1 className="text-blue-600 font-bold text-lg capitalize">{title}</h1>
                            {selectedService && (
                                <Link href="/search/repair" className="text-xs text-gray-400 hover:text-gray-600 flex items-center">
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
                                <Link href="/search/repair" className="text-blue-600 underline mt-2 block">Показать всех специалистов категории Жильё и Ремонт</Link>
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 space-y-8 shrink-0">
                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Категории</h3>
                            <div className="flex flex-wrap gap-2">
                                {['сантехник', 'электрик', 'мелкий ремонт', 'сборка мебели', 'клининг', 'помощь при сдаче жилья'].map((tag, i) => (
                                    <Link key={i} href={`/search/repair?service=${encodeURIComponent(tag)}`}>
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

export default function RepairSearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RepairSearchContent />
        </Suspense>
    );
}
