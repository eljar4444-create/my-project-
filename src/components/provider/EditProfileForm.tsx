'use client';

import { updateProviderProfile } from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useState } from 'react';

interface EditProfileFormProps {
    initialData: {
        name?: string | null;
        bio?: string | null;
        age?: number | null;
        education?: string | null;
        contactTime?: string | null;
    };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Редактирование профиля</h1>

            <form action={updateProviderProfile} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <Input
                        name="name"
                        placeholder="Ваше имя"
                        defaultValue={initialData.name || ''}
                        className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">О себе (Био)</label>
                    <Textarea
                        name="bio"
                        placeholder="Расскажите о себе, своем опыте и подходе к работе..."
                        defaultValue={initialData.bio || ''}
                        className="h-32 bg-gray-50 border-gray-200 focus:bg-white transition-all resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Возраст</label>
                        <Input
                            name="age"
                            type="number"
                            placeholder="30"
                            min="18"
                            defaultValue={initialData.age || ''}
                            className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Время связи</label>
                        <Input
                            name="contactTime"
                            placeholder="с 9 до 18"
                            defaultValue={initialData.contactTime || ''}
                            className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Образование</label>
                    <Input
                        name="education"
                        placeholder="Например: МГУ, Психолог"
                        defaultValue={initialData.education || ''}
                        className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                    />
                </div>

                <Button type="submit" className="w-full h-12 text-base bg-[#fc0] hover:bg-[#e6b800] text-black font-bold rounded-xl shadow-none">
                    Сохранить изменения
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link href="/provider/profile" className="text-sm text-gray-500 hover:text-black transition-colors">
                    Отмена
                </Link>
            </div>
        </div>
    );
}
