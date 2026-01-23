'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadVerificationDocuments } from '@/app/actions/verification';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2, FileText, X } from 'lucide-react';

export function VerificationForm() {
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [driverFile, setDriverFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'driver') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'passport') setPassportFile(file);
            else setDriverFile(file);
        }
    };

    const removeFile = (type: 'passport' | 'driver') => {
        if (type === 'passport') setPassportFile(null);
        else setDriverFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passportFile && !driverFile) {
            alert('Пожалуйста, загрузите хотя бы один документ.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        if (passportFile) formData.append('passport', passportFile);
        if (driverFile) formData.append('driverLicense', driverFile);

        const result = await uploadVerificationDocuments(formData);

        if (result.success) {
            router.push('/provider/verification/success');
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-2">Подтверждение личности</h2>
            <p className="text-gray-500 mb-8">
                Загрузите фото документов, подтверждающих вашу личность. Это поможет повысить доверие клиентов.
                Данные надежно защищены и не публикуются.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Passport / ID Card */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Паспорт или ID карта</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                        {passportFile ? (
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900 truncate max-w-[200px]">{passportFile.name}</span>
                                </div>
                                <button type="button" onClick={() => removeFile('passport')} className="text-gray-400 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center relative">
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, 'passport')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <div className="bg-blue-50 p-3 rounded-full mb-3">
                                        <UploadCloud className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Нажмите для загрузки</span>
                                    <span className="text-xs text-gray-500 mt-1">JPG, PNG или PDF до 10MB</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Driver License */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Водительское удостоверение (необязательно)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                        {driverFile ? (
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900 truncate max-w-[200px]">{driverFile.name}</span>
                                </div>
                                <button type="button" onClick={() => removeFile('driver')} className="text-gray-400 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center relative">
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, 'driver')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-50 p-3 rounded-full mb-3">
                                        <UploadCloud className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Нажмите для загрузки</span>
                                    <span className="text-xs text-gray-500 mt-1">JPG, PNG или PDF до 10MB</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold rounded-xl bg-green-500 hover:bg-green-600 text-white">
                        {loading ? 'Отправка...' : 'Отправить на проверку'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
