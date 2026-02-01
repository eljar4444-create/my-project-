'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export function ProviderSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Профиль', href: '/provider/profile', active: pathname === '/provider/profile' && !pathname.includes('#') },
        { label: 'Фото профиля', href: '#photo', active: false },
        { label: 'Адреса', href: '#address', active: false },
        { label: 'О себе', href: '#about', active: false },
        { label: 'Специальности', href: '#specialties', active: false },
    ];

    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <nav className="space-y-1">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium
                            ${item.active ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black hover:bg-gray-50'}
                        `}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
