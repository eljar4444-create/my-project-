import { auth } from '@/auth';
import { getPendingVerifications } from '@/app/actions/admin';
import { VerificationList } from '@/components/admin/VerificationList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminVerificationPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const requests = await getPendingVerifications();

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/moderation">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Проверка документов</h1>
            </div>

            <VerificationList requests={requests} />
        </div>
    );
}
