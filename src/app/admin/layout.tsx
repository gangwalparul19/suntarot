'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LayoutDashboard, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <Link className="mr-6 flex items-center space-x-2" href="/admin">
                            <span className="font-bold sm:inline-block">Mystic Admin</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center text-muted-foreground transition-colors hover:text-foreground",
                                        pathname === item.href && "text-foreground font-bold"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">{children}</main>
        </div>
    );
}
