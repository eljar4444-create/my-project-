'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarDropdownProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export function AvatarDropdown({ user: propUser }: AvatarDropdownProps) {
    const { data: session } = useSession();
    const user = propUser || session?.user;
    const [isAvatarHovered, setIsAvatarHovered] = useState(false);

    // If no user, show a login button or nothing? 
    // In provider layout, we usually want to show something or we assume protected.
    // If we want to show a generic "user" icon even if loading/missing to avoid layout shift:
    // But typically we return null if not logged in.
    if (!user) return null; // Or return a Skeleton?

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
        >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 cursor-pointer overflow-hidden hover: ring-2 ring-transparent hover:ring-gray-200 transition-all">
                {user?.image ? (
                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-5 h-5 text-gray-500" />
                )}
            </div>

            {/* Dropdown Menu */}
            {isAvatarHovered && (
                <div className="absolute right-0 top-full pt-2 w-[300px] z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 text-sm overflow-hidden relative">
                        {/* Triangle Pointer */}
                        <div className="absolute -top-1.5 right-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>

                        {/* Profile Info */}
                        <div className="p-4 flex items-start gap-3 relative bg-white z-10">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-bold text-gray-900 truncate">{user?.name || 'Марина'}</div>
                                <div className="text-gray-500 text-xs truncate">{user?.email || 'marina@example.com'}</div>
                                <Link href="/account" className="text-blue-600 text-xs mt-1 block hover:underline">
                                    Управление аккаунтом
                                </Link>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 mx-4" />

                        {/* Links */}
                        <div className="py-2 flex flex-col">
                            <Link href="#" className="px-5 py-2 hover:bg-gray-50 text-gray-700 transition-colors">Почта</Link>
                            <Link href="#" className="px-5 py-2 hover:bg-gray-50 text-gray-700 transition-colors">Написать письмо</Link>
                            <Link href="#" className="px-5 py-2 hover:bg-gray-50 text-gray-700 transition-colors">Мой диск</Link>
                        </div>

                        <div className="h-px bg-gray-100 mx-4" />

                        {/* Add Account */}
                        <div className="p-4">
                            <button className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                </div>
                                <span className="text-gray-700 font-medium">Добавить аккаунт</span>
                            </button>

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full text-left px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mt-1"
                            >
                                Выйти
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="bg-[#f5f5f7] px-5 py-3 flex justify-between text-xs text-gray-500">
                            <Link href="#" className="hover:text-gray-800">Настройки</Link>
                            <Link href="#" className="hover:text-gray-800">Справка</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
