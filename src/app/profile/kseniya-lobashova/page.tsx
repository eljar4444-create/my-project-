'use client';

import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, CheckCircle2, MapPin, Phone, MessageCircle, Star, ThumbsUp, ShieldCheck, Share2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SERVICES = [
    { name: 'Классическое наращивание ресниц', price: 'от 40 €' },
    { name: 'Наращивание ресниц (двойной объем)', price: 'от 50 €' },
    { name: 'Снятие наращенных ресниц', price: 'от 10 €' },
    { name: 'Наращивание ресниц (тройной объем)', price: 'от 60 €' },
    { name: 'Наращивание ресниц (полуторный объем)', price: 'от 45 €' },
];

export default function ProfilePage() {
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

                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex gap-8 items-start">
                        {/* Left Column: Profile Card */}
                        <div className="flex-1 space-y-4">
                            {/* Profile Header Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-6">
                                        <div className="relative">
                                            <Avatar className="w-32 h-32 border-4 border-white shadow-sm">
                                                <AvatarImage src="/placeholder-avatar.jpg" />
                                                <AvatarFallback className="bg-orange-100 text-orange-600 text-3xl font-bold">КЛ</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white" title="Online">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <h1 className="text-3xl font-bold mb-2">Ксения Лобашова</h1>
                                            <div className="flex items-center gap-2 text-gray-500 mb-4">
                                                <MapPin className="w-4 h-4" />
                                                <span>Нюрнберг</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-green-700 font-bold text-sm">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    5,0
                                                </div>
                                                <span className="text-gray-400 text-sm">1 отзыв</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mb-8">
                                    <Button className="flex-1 bg-[#fc0] hover:bg-[#e6b800] text-black font-medium text-lg h-14 rounded-xl shadow-none">
                                        <Phone className="w-5 h-5 mr-2" />
                                        Показать телефон
                                    </Button>
                                    <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-medium text-lg h-14 rounded-xl shadow-none">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Написать
                                    </Button>
                                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-black font-medium h-14 rounded-xl px-6">
                                        Предложить заказ
                                    </Button>
                                </div>

                                {/* About */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold">О себе</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Сертифицированный мастер по наращиванию ресниц. Опыт работы более 3-х лет.
                                        Использую только качественные материалы премиум-класса. Индивидуальный подход к каждому клиенту.
                                    </p>
                                    <div className="flex gap-4 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            Паспорт проверен
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            Гарантия на работу
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold mb-6">Услуги и цены</h2>
                                <div className="space-y-0 divide-y divide-gray-100">
                                    {SERVICES.map((service, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors cursor-pointer group">
                                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{service.name}</span>
                                            <span className="font-bold">{service.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="link" className="mt-4 p-0 text-blue-600 font-medium h-auto hover:no-underline">
                                    Показать все услуги (12)
                                </Button>
                            </div>

                            {/* Reviews */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Отзывы</h2>
                                    <span className="text-gray-400">1 отзыв</span>
                                </div>
                                {/* Review Item */}
                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarFallback>А</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold">Анна</div>
                                            <div className="text-xs text-gray-400">12 октября 2025</div>
                                        </div>
                                        <div className="ml-auto flex text-[#fc0]">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Отличный мастер! Ресницы держатся долго, выглядят очень натурально. Процедура прошла комфортно, время пролетело незаметно. Обязательно приду еще!
                                    </p>
                                </div>
                                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium h-12 rounded-xl">
                                    Показать все отзывы
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Stats (Optional, modeled after desktop view) */}
                        <div className="w-80 hidden xl:block space-y-4">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="font-bold mb-4 text-gray-400 text-sm uppercase tracking-wider">Статистика</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">На сервисе</span>
                                        <span className="font-medium">с 2023 года</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Выполнено заказов</span>
                                        <span className="font-medium">45</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Отвечает</span>
                                        <span className="text-green-600 font-medium">быстро</span>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100 my-6" />
                                <div className="flex gap-2 text-sm text-gray-500">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Рекомендуют 98% клиентов</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
