'use client';

import { updateServiceStatus } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ModerationControlsProps {
    serviceId: string;
}

export function ModerationControls({ serviceId }: ModerationControlsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        setIsLoading(true);
        try {
            const result = await updateServiceStatus(serviceId, status);
            if (result.success) {
                toast.success(status === 'APPROVED' ? 'Услуга одобрена' : 'Услуга отклонена');
            } else {
                toast.error('Ошибка при обновлении статуса');
            }
        } catch (error) {
            toast.error('Произошла ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={() => handleAction('APPROVED')}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Одобрить
                    </>
                )}
            </Button>

            <Button
                onClick={() => handleAction('REJECTED')}
                disabled={isLoading}
                variant="destructive"
                className="min-w-[120px]"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                        <X className="w-4 h-4 mr-2" />
                        Отклонить
                    </>
                )}
            </Button>
        </div>
    );
}
