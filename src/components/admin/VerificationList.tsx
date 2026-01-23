'use client';

import { updateVerificationStatus } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface VerificationRequest {
    id: string;
    userId: string;
    verificationDocs: string | null;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    createdAt: Date; // or similar
}

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function VerificationList({ requests }: { requests: any[] }) {
    const [selectedDocs, setSelectedDocs] = useState<Record<string, string> | null>(null);
    const router = useRouter();

    const handleAction = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Вы уверены, что хотите ${status === 'APPROVED' ? 'подтвердить' : 'отклонить'}?`)) return;

        try {
            await updateVerificationStatus(userId, status);
            toast.success(status === 'APPROVED' ? 'Профиль подтвержден' : 'Заявка отклонена');
            router.refresh(); // Refresh server data
        } catch (error) {
            toast.error('Произошла ошибка');
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            {requests.length === 0 ? (
                <div className="text-gray-500 text-center py-10">Нет заявок на проверку</div>
            ) : (
                requests.map((req) => {
                    const docs = req.verificationDocs ? JSON.parse(req.verificationDocs) : {};

                    return (
                        <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                        {req.user.image ? (
                                            <Image src={req.user.image} alt="Avatar" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold">{req.user.name || 'Без имени'}</div>
                                        <div className="text-sm text-gray-500">{req.user.email}</div>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {Object.entries(docs).map(([key, path]: [string, any]) => (
                                        <a
                                            key={key}
                                            href={path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                                        >
                                            <FileText className="w-4 h-4" />
                                            {key === 'passport' ? 'Паспорт' : key === 'driverLicense' ? 'Права' : 'Документ'}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleAction(req.userId, 'APPROVED')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Подтвердить
                                </Button>
                                <Button
                                    onClick={() => handleAction(req.userId, 'REJECTED')}
                                    variant="destructive"
                                >
                                    <X className="w-4 h-4 mr-2" /> Отклонить
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
