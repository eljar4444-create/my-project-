import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { CreateOrderForm } from '@/components/CreateOrderForm';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreateOrderPage() {
    // Redirect logic removed to allow viewing form

    const categories = await prisma.serviceCategory.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="container mx-auto px-4 max-w-7xl font-sans text-slate-900">
            {/* Main Content */}
            <main className="w-full py-8">
                <div className="max-w-5xl">
                    {/* Hero Title */}
                    <h1 className="text-3xl font-bold mb-10 text-slate-900">Подбирайте исполнителей без лишних хлопот</h1>

                    {/* Steps (Visual only) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full border border-orange-500 text-orange-500 flex items-center justify-center font-bold shrink-0">1</div>
                            <div>
                                <h3 className="font-bold mb-1">Опишите задачу</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Исполнители сами напишут вам. Это бесплатно.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center font-bold shrink-0">2</div>
                            <div>
                                <h3 className="font-bold mb-1">Сравните предложения</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">По рейтингу, отзывам и цене.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center font-bold shrink-0">3</div>
                            <div>
                                <h3 className="font-bold mb-1">Выберите исполнителя</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Договоритесь о финальной стоимости.</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Client Component */}
                    <CreateOrderForm categories={categories} />
                </div>
            </main>
        </div>
    );
}
