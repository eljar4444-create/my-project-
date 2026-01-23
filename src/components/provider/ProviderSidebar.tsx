'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export function ProviderSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Профиль', href: '/provider/profile', active: pathname === '/provider/profile' },
        { label: 'Фото профиля', href: '/provider/profile/photo', active: pathname?.startsWith('/provider/profile/photo') },
        { label: 'Адреса', href: '/provider/profile/address', active: pathname?.startsWith('/provider/profile/address') },
        { label: 'О себе', href: '/provider/profile/about', active: pathname?.startsWith('/provider/profile/about') },
        { label: 'Специальности', href: '/provider/profile/specialties', active: pathname?.startsWith('/provider/profile/specialties') },
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
