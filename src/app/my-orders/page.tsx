'use client';

import { Button } from '@/components/ui/button'; // Assuming we have this
import { Search, LayoutGrid, CheckCircle2, LayoutTemplate, FileText, UserSquare2 } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl font-sans text-slate-900">
            {/* Main Content */}
            <main className="w-full py-8">

                <div className="px-12 py-16 max-w-5xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-16">Вы ещё не создавали заказы — время начать!</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center max-w-xs mx-auto">
                            <div className="w-48 h-32 mb-8 relative">
                                {/* Placeholder for illustration */}
                                <div className="absolute inset-0 bg-blue-50 rounded-2xl border-4 border-blue-100 flex items-center justify-center rotate-3">
                                    <LayoutTemplate className="w-16 h-16 text-blue-500" />
                                </div>
                                <div className="absolute -top-4 -left-4 w-8 h-8 text-cyan-400 animate-bounce">?</div>
                            </div>
                            <h3 className="font-bold text-lg mb-3">1. Разместите заказ</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Опишите задачу. Если нужно, укажите сроки и бюджет
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center max-w-xs mx-auto">
                            <div className="w-48 h-32 mb-8 relative">
                                <div className="absolute inset-0 bg-cyan-50 rounded-2xl border-4 border-cyan-100 flex items-center justify-center -rotate-2">
                                    <FileText className="w-16 h-16 text-cyan-500" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-3">2. Получите предложения</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Исполнители сами откликнутся на ваш заказ. Обсудите детали заказа в чате или по телефону
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center max-w-xs mx-auto">
                            <div className="w-48 h-32 mb-8 relative">
                                <div className="absolute inset-0 bg-yellow-50 rounded-2xl border-4 border-yellow-100 flex items-center justify-center rotate-1">
                                    <UserSquare2 className="w-16 h-16 text-yellow-500" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">★★★★★</div>
                            </div>
                            <h3 className="font-bold text-lg mb-3">3. Выберите исполнителя</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Выберите подходящего вам исполнителя по рейтингу, отзывам и цене
                            </p>
                        </div>
                    </div>

                    <Button asChild className="bg-[#ff5c00] hover:bg-[#e65500] text-white font-bold rounded-xl px-12 py-6 h-auto text-lg shadow-lg shadow-orange-500/20">
                        <Link href="/create-order">Создать заказ</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
