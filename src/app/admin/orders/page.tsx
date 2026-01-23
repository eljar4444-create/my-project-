import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { approveOrder, rejectOrder } from '@/app/actions/adminOrderActions';
import { MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const pendingOrders = await prisma.order.findMany({
        where: { status: 'PENDING_MODERATION' },
        orderBy: { createdAt: 'desc' },
        include: {
            client: true,
            category: true
        }
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Модерация заказов</h1>

            {pendingOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">Нет заказов, ожидающих модерации.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{order.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                        <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            {order.category?.name}
                                        </span>
                                        {order.subcategory && (
                                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                {order.subcategory}
                                            </span>
                                        )}
                                    </div>
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

                            <p className="text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {order.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {order.client?.name?.[0] || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{order.client?.name}</span>
                                        <span className="text-xs text-gray-500">{order.client?.email}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <form action={rejectOrder.bind(null, order.id)}>
                                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                            Отклонить
                                        </Button>
                                    </form>
                                    <form action={approveOrder.bind(null, order.id)}>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                            Одобрить
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
