'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { MapPicker } from '@/components/MapPicker';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    address: z.string().min(5, 'Введите точный адрес'),
    city: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProviderLocationPage() {
    const router = useRouter();
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [radius, setRadius] = useState(10);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onLocationSelect = (address: string, newLat: number | null, newLng: number | null) => {
        setValue('address', address);
        setLat(newLat);
        setLng(newLng);

        // Simple heuristic to extract city (this should ideally be done w/ Google Geocoding response properly)
        const parts = address.split(',');
        if (parts.length > 1) {
            // Usually City is second to last component or so, but let's just leave it for backend or user to refine if crucial
            // For now, we rely on the autocomplete result's text
        }
    };

    const handleMapSelect = (newLat: number, newLng: number) => {
        setLat(newLat);
        setLng(newLng);
        // Reverse geocoding could happen here to update address field, but for MVP we might skip automated reverse geo for map clicks if not strictly needed
        // Assuming map click is primarily for refining coordinates
    };

    const onSubmit = async (data: FormData) => {
        if (!lat || !lng) {
            toast.error('Пожалуйста, выберите местоположение на карте или через поиск');
            return;
        }

        try {
            await axios.post('/api/provider/onboarding/location', {
                ...data,
                latitude: lat,
                longitude: lng
            });
            toast.success('Местоположение сохранено!');
            router.push('/provider/onboarding/about'); // Next step
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold mb-2">Где вы работаете?</CardTitle>
                    <CardDescription className="text-lg text-gray-500">
                        Укажите ваш город и район, чтобы клиенты могли найти вас
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Поиск адреса</label>
                            <LocationAutocomplete
                                onSelect={onLocationSelect}
                                className="w-full"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                        </div>

                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3 block">
                                В каком радиусе вы предлагаете услуги:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[10, 20, 50, 100].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRadius(r)}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${radius === r
                                            ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm ring-2 ring-primary/20'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {r} км
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-gray-200">
                        <MapPicker
                            onLocationSelect={handleMapSelect}
                            initialLat={lat}
                            initialLng={lng}
                            radius={radius}
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="hidden">
                            <Input {...register('city')} type="hidden" />
                            <Input {...register('address')} type="hidden" />
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
