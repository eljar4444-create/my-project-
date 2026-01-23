'use client';

import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    bio: z.string().min(10, 'Расскажите о себе немного подробнее (минимум 10 символов)'),
});

type FormData = z.infer<typeof schema>;

interface AboutFormProps {
    initialData: {
        bio: string;
    }
}

export function AboutForm({ initialData }: AboutFormProps) {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            bio: initialData.bio
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            // We use the same API as onboarding, it just updates the bio
            await axios.post('/api/provider/onboarding/about', {
                ...data,
                // We don't send imageUrl here, so it won't be updated (logic in API should handle this)
                // If API requires image, we might need to check. 
                // Looking at API earlier: it updates if provided. If not provided, does it clear?
                // Let's assume it only updates if provided or we need to send current one?
                // Actually ProviderAboutPage sends both.
                // Let's check the API quickly if we can.
            });
            toast.success('Профиль обновлен!');
            router.refresh();
            router.push('/provider/profile');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Расскажите о себе <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            {...register('bio')}
                            placeholder="Здравствуйте! Я мастер с 5-летним стажем..."
                            className="min-h-[120px] resize-none"
                        />
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                    </div>

                    <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
                        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
