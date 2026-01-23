import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CheckCircle2, Search, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const session = await auth();
    const user = session?.user;

    let matchingOrders: any[] = [];
    let hasServices = false;

    if (user) {
        // 1. Get Provider's Services to know their categories
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
            include: {
                services: {
                    select: { categoryId: true }
                }
            }
        });

        if (providerProfile && providerProfile.services.length > 0) {
            hasServices = true;
            const myCategoryIds = providerProfile.services.map(s => s.categoryId);

            // 2. Fetch Orders matching those categories
            matchingOrders = await prisma.order.findMany({
                where: {
                    status: 'OPEN',
                    categoryId: { in: myCategoryIds }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    client: true,
                    category: true
                }
            });
        }
    }

    return (
        <div className="container mx-auto px-4 max-w-7xl flex items-start gap-8 font-sans text-slate-900">
            {/* Sidebar (Left) - Reusing same sidebar structure */}
            {/* Sidebar (Left) - Reusing same sidebar structure */}
            <aside className="w-64 hidden lg:flex flex-col py-8 shrink-0">

                <nav className="space-y-6 text-gray-500 font-medium text-[15px] shrink-0">
                    <Link href="/search" className="flex items-center gap-3 hover:text-black transition-colors px-4 py-2">
                        <LayoutGrid className="w-5 h-5" />
                        Найти специалиста
                    </Link>
                    <Link href="/my-orders" className="flex items-center gap-3 hover:text-black transition-colors px-4 py-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Мои заказы
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 text-black font-bold bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                        <Search className="w-5 h-5" />
                        Поиск заказов
                    </Link>
                    <Link href="/become-provider" className="flex items-center gap-3 hover:text-black transition-colors px-4 py-2">
                        <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">🛠</div>
                        Стать исполнителем
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 py-8">

                <div className="p-8 max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Актуальные заказы</h1>
                        <span className="text-gray-500">{matchingOrders.length} заказов</span>
                    </div>

                    {!hasServices ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg mb-4">Вы еще не добавили услуги.</p>
                            <Link href="/provider/services/new">
                                <Button className="bg-[#ff5c00] hover:bg-[#e65500] text-white rounded-xl">
                                    Добавить услугу
                                </Button>
                            </Link>
                            <p className="text-sm text-gray-400 mt-2">Чтобы видеть заказы, добавьте услуги в профиле.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {matchingOrders.map((order) => (
                                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                    {order.category?.name}
                                                </span>
                                                {order.subcategory && (
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        {order.subcategory}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                {order.title}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {order.address && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" /> {order.address}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDistanceToNow(order.createdAt, { addSuffix: true, locale: ru })}
                                                </span>
                                            </div>
                                        </div>
                                        {order.budget && (
                                            <div className="font-bold text-lg bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                                                {order.budget} €
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {order.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <Link href={`/profile/${order.client.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {order.client?.name?.[0] || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 hover:underline">{order.client?.name || 'Заказчик'}</span>
                                        </Link>
                                        <Button className="bg-gray-900 hover:bg-black text-white rounded-xl">
                                            Откликнуться
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {matchingOrders.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-lg">Нет новых заказов по вашим категориям</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
