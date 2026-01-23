'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProviderTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<'PRIVATE' | 'SALON' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async () => {
        if (!selectedType) return;
        setIsSubmitting(true);
        try {
            await axios.post('/api/provider/onboarding/type', { type: selectedType });
            toast.success('Тип профиля сохранен!');
            router.push('/provider/onboarding/location');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold mb-2">Как вы работаете?</CardTitle>
                    <CardDescription className="text-lg text-gray-500">
                        Выберите формат работы, который вам подходит
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center gap-4 transition-all duration-200 hover:border-[#fc0] hover:bg-yellow-50/50",
                                selectedType === 'PRIVATE' ? "border-[#fc0] bg-yellow-50 shadow-md ring-2 ring-[#fc0] ring-offset-2" : "border-gray-100 bg-white"
                            )}
                            onClick={() => setSelectedType('PRIVATE')}
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center transition-colors",
                                selectedType === 'PRIVATE' ? "bg-[#fc0] text-black" : "bg-gray-100 text-gray-500"
                            )}>
                                <User className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl mb-2">Частный мастер</h3>
                                <p className="text-gray-500 text-sm">
                                    Работаю на себя, оказываю услуги частным образом
                                </p>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center gap-4 transition-all duration-200 hover:border-[#fc0] hover:bg-yellow-50/50",
                                selectedType === 'SALON' ? "border-[#fc0] bg-yellow-50 shadow-md ring-2 ring-[#fc0] ring-offset-2" : "border-gray-100 bg-white"
                            )}
                            onClick={() => setSelectedType('SALON')}
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center transition-colors",
                                selectedType === 'SALON' ? "bg-[#fc0] text-black" : "bg-gray-100 text-gray-500"
                            )}>
                                <Building2 className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl mb-2">Компании</h3>
                                <p className="text-gray-500 text-sm">
                                    Представляю салон, компанию или бригаду
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={onSubmit}
                        className="w-full text-lg h-12"
                        disabled={!selectedType || isSubmitting}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Продолжить'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
