'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const schema = z.object({
    firstName: z.string().min(2, 'Имя должно быть не менее 2 символов'),
    lastName: z.string().min(2, 'Фамилия должна быть не менее 2 символов'),
});

type FormData = z.infer<typeof schema>;

export default function ProviderOnboardingPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post('/api/provider/onboarding', data);
            toast.success('Данные успешно сохранены!');
            router.push('/provider/onboarding/type');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Добро пожаловать!</CardTitle>
                    <CardDescription className="text-gray-500 mt-2">
                        Давайте познакомимся. Как вас зовут?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                                    Имя
                                </label>
                                <Input placeholder="Иван" {...register('firstName')} />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                                    Фамилия
                                </label>
                                <Input placeholder="Петров" {...register('lastName')} />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Сохранение...' : 'Продолжить'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
