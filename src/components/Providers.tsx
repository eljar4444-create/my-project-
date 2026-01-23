'use client';

import { SessionProvider } from 'next-auth/react';
import { LoginNotifier } from './LoginNotifier';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoginNotifier />
            {children}
        </SessionProvider>
    );
}
