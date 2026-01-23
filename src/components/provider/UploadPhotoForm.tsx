'use client';

import { uploadProfilePhoto } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function UploadPhotoForm({ currentImage }: { currentImage?: string | null }) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { update } = useSession();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            const result = await uploadProfilePhoto(formData);
            if (result.success) {
                // Update preview immediately
                setPreview(result.imageUrl);

                // Force hard navigation to ensure session is re-fetched and header updates
                window.location.href = '/provider/profile/photo/success';
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(`Ошибка загрузки: ${error.message}`);
            } else {
                alert('Не удалось загрузить фото. Попробуйте еще раз.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Загрузка фото профиля</h2>

            <div className="mb-8 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                    {preview ? (
                        <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                            {/* Initials placeholder could go here */}
                            ?
                        </div>
                    )}
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Выберите фото</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-black file:text-white
                            file:cursor-pointer hover:file:bg-gray-800
                        "
                        required
                    />
                    <p className="text-xs text-gray-500">JPG, PNG или WEBP. Максимум 5MB.</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-xl font-bold">
                    {loading ? 'Загрузка...' : 'Сохранить фото'}
                </Button>
            </form>
        </div>
    );
}
