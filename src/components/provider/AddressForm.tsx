'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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

interface AddressFormProps {
    initialData: {
        address: string;
        city: string;
        latitude: number | null;
        longitude: number | null;
        radius: number;
    }
}

export function AddressForm({ initialData }: AddressFormProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [lat, setLat] = useState<number | null>(initialData.latitude);
    const [lng, setLng] = useState<number | null>(initialData.longitude);
    const [radius, setRadius] = useState(initialData.radius);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            address: initialData.address,
            city: initialData.city
        }
    });

    const onLocationSelect = (address: string, newLat: number | null, newLng: number | null) => {
        setValue('address', address);
        setLat(newLat);
        setLng(newLng);
    };

    const handleMapSelect = (newLat: number, newLng: number) => {
        if (!isEditing) return; // Prevent map updates when not editing
        setLat(newLat);
        setLng(newLng);
    };

    const onSubmit = async (data: FormData) => {
        if (!lat || !lng) {
            toast.error('Пожалуйста, выберите местоположение на карте');
            return;
        }

        try {
            await axios.post('/api/provider/onboarding/location', {
                ...data,
                latitude: lat,
                longitude: lng,
                serviceRadius: radius
            });
            toast.success('Адрес обновлен!');
            setIsEditing(false); // Exit edit mode
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Ваше местоположение</h3>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="border-gray-200">
                            Изменить адрес
                        </Button>
                    ) : (
                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-gray-500">
                            Отмена
                        </Button>
                    )}
                </div>

                <div className={!isEditing ? 'opacity-70 pointer-events-none grayscale-[0.5] transition-all' : 'transition-all'}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Поиск адреса</label>
                            <LocationAutocomplete
                                onSelect={onLocationSelect}
                                className="w-full"
                                defaultValue={initialData.address}
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
                                        onClick={() => isEditing && setRadius(r)}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${radius === r
                                            ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm ring-2 ring-primary/20'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            } ${!isEditing ? 'cursor-default' : ''}`}
                                    >
                                        {r} км
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-gray-200 mt-6 relative">
                        {/* Block interactions on map when not editing */}
                        {!isEditing && <div className="absolute inset-0 z-10 bg-transparent" />}
                        <MapPicker
                            onLocationSelect={handleMapSelect}
                            initialLat={lat}
                            initialLng={lng}
                            radius={radius}
                        />
                    </div>
                </div>

                {isEditing && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="hidden">
                            <Input {...register('city')} type="hidden" />
                            <Input {...register('address')} type="hidden" />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 text-lg h-12" disabled={isSubmitting}>
                                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
