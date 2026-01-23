import { ProviderSidebar } from '@/components/provider/ProviderSidebar';

export default function ProviderProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12">
                <ProviderSidebar />
                <main className="flex-1 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
