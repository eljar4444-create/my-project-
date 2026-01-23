'use client';

import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, CheckCircle2, ChevronDown, MapPin, Phone, MessageCircle, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LegalServicesPage() {
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
                        <div className="mb-6">
                            <h1 className="text-blue-600 font-bold text-lg">Юристы</h1>
                        </div>

                        {/* Provider Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow">
                            <div className="flex gap-6">
                                {/* Avatar Column */}
                                <div className="space-y-3 shrink-0">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden relative">
                                        <Avatar className="w-full h-full rounded-none">
                                            <AvatarImage src="/placeholder-avatar-2.jpg" className="object-cover" />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl font-bold rounded-none">СЖ</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                {/* Info Column */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <Link href="/profile/svetlana-zhiger" className="text-xl font-bold hover:text-red-500 text-blue-600">Светлана Жигер</Link>
                                        <button className="text-gray-300 hover:text-gray-500"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">Свободное государство Бавария</div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        Присяжный переводчик в Мюнхене и по всей Баварии. Мой автомобиль - всегда к Вашим услугам! Заверенный пер... <span className="text-blue-500 cursor-pointer">Читать ещё</span>
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[15px]">
                                            <span className="font-bold text-blue-600 hover:text-red-500 cursor-pointer">Проверка чистоты сделок с недвижимостью</span>
                                            <span className="font-bold">по договорённости</span>
                                        </div>
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

                        {/* Search Chips */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold mb-6">Люди искали похожее</h2>
                            <div className="flex flex-wrap gap-2">
                                {['юридическое сопровождение покупки квартиры', 'договор купли продажи земельного участка', 'сопровождение сделки', 'юрист для покупки квартиры', 'юридическое сопровождение', 'юридическое сопровождение сделки'].map((tag, i) => (
                                    <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Вы часто спрашиваете</h2>
                            <div className="space-y-3">
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-center cursor-pointer hover:shadow-sm">
                                    <span className="text-[15px] font-medium text-gray-800">Сколько в Байройте специалистов, которые оказывают услугу «Юридическое сопровождение сделок»?</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-center cursor-pointer hover:shadow-sm">
                                    <span className="text-[15px] font-medium text-gray-800">Как выбрать специалиста в сфере «Юридическое сопровождение сделок»?</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Filters */}
                    <div className="w-80 space-y-8 shrink-0">
                        {/* Sub-services links */}
                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Юридическое сопровождение сделок</h3>
                            <div className="space-y-2">
                                <Link href="#" className="block text-blue-600 text-sm hover:text-red-500 leading-snug">Проверка чистоты сделок с недвижимостью</Link>
                            </div>
                        </div>

                        {/* Filters */}
                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Тип исполнителя</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer">
                                </div>
                                <span className="text-sm">Частное лицо</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2 text-gray-900">Место</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue="Байройт"
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-[#fc0]"
                                />
                            </div>
                        </div>

                        {/* App Promo */}
                        <div className="mt-8">
                            <h3 className="font-bold mb-3 text-sm">В приложении еще удобнее</h3>
                            <div className="bg-white p-3 rounded-xl border border-gray-100 inline-block mb-3">
                                {/* Mock QR Code */}
                                <div className="w-24 h-24 bg-gray-900 flex items-center justify-center text-white text-xs text-center p-1">
                                    QR CODE
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                Наведите камеру вашего телефона на QR-код, чтобы скачать приложение или перейдите по ссылке
                            </p>
                            <div className="flex gap-2">
                                <div className="h-8 bg-black w-24 rounded"></div>
                                <div className="h-8 bg-black w-24 rounded"></div>
                            </div>
                            <div className="mt-2 h-8 bg-red-600 w-24 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
