'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

const schema = z.object({
    bio: z.string().min(10, 'Расскажите о себе немного подробнее (минимум 10 символов)'),
});

type FormData = z.infer<typeof schema>;

export default function ProviderAboutPage() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImageUrl(res.data.url);
            toast.success('Фото загружено!');
        } catch (error) {
            console.error(error);
            toast.error('Ошибка загрузки фото');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post('/api/provider/onboarding/about', {
                ...data,
                imageUrl,
            });
            toast.success('Профиль обновлен!');
            router.push('/provider/onboarding/service'); // Next step
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold mb-2">Расскажите о себе</CardTitle>
                    <CardDescription className="text-lg text-gray-500">
                        Добавьте фото и краткую информацию, чтобы клиенты узнали вас лучше
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm relative bg-gray-50 flex items-center justify-center">
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt="Profile Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}

                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {imageUrl ? 'Нажмите, чтобы изменить фото' : 'Нажмите, чтобы загрузить фото'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                О себе <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                {...register('bio')}
                                placeholder="Здравствуйте! Я мастер с 5-летним стажем..."
                                className="min-h-[120px] resize-none"
                            />
                            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                        </div>

                        <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
                            {isSubmitting ? 'Сохранение...' : 'Продолжить'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
