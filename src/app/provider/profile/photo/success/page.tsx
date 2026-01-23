'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PhotoSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Фотография обновлена!
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    Ваше новое фото профиля успешно сохранено. Оно уже отображается в вашей анкете и в поиске услуг.
                </p>

                <div className="space-y-3">
                    <Link href="/provider/profile" className="block">
                        <Button className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white font-bold rounded-xl">
                            Вернуться в профиль
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
