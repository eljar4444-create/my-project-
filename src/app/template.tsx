'use client';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDuration: '0.6s' }}>
            {children}
        </div>
    );
}
