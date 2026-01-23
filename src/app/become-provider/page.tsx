import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { upgradeToProvider } from '@/app/actions/userActions';
import { CheckCircle2 } from 'lucide-react';

export default async function BecomeProviderPage() {
    const session = await auth();
    const user = session?.user;

    // 1. If not logged in, redirect to registration
    if (!user) {
        redirect('/auth/register?role=provider');
    }

    // 2. If already a provider, redirect to profile
    if (user.role === 'PROVIDER' || user.role === 'ADMIN') { // Admin also has access usually, or treat as provider
        redirect('/provider/profile');
    }

    // 3. If Client, show upgrade UI
    return (
        <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-6">Стать исполнителем</h1>
            <p className="text-gray-600 text-lg mb-8">
                Вы уже зарегистрированы как заказчик. Хотите активировать кабинет исполнителя и начать зарабатывать?
            </p>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 text-left space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span>Доступ к базе заказов</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span>Создание профиля услуг</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span>Возможность откликаться на задания</span>
                </div>
            </div>

            <form action={upgradeToProvider}>
                <Button className="bg-[#ff5c00] hover:bg-[#e65500] text-white text-lg px-8 py-6 rounded-xl w-full sm:w-auto shadow-xl shadow-orange-500/20">
                    Стать исполнителем сейчас
                </Button>
            </form>

            <p className="text-sm text-gray-400 mt-6">
                Ваш текущий профиль заказчика сохранится. Вы сможете переключаться между ролями.
            </p>
        </div>
    );
}
