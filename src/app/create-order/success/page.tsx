import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">Заказ успешно опубликован!</h1>

                <p className="text-gray-500 text-lg leading-relaxed">
                    Ваш заказ теперь виден исполнителям. Скоро они начнут предлагать свои услуги.
                    Вы получите уведомления об откликах.
                </p>

                <div className="pt-8 flex flex-col gap-3">
                    <Button asChild size="lg" className="h-12 text-base rounded-xl bg-black hover:bg-gray-800 text-white">
                        <Link href="/my-orders">
                            Перейти к моим заказам <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="h-12 text-base rounded-xl text-gray-500 hover:text-gray-900">
                        <Link href="/">
                            Вернуться на главную
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
