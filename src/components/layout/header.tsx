
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Wand2, BookHeart, History, LogIn, LogOut, BookOpen } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && firestore) {
        // Create a user profile document in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          profilePictureUrl: user.photoURL,
        }, { merge: true });
      }

    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };
  
  const navLinks = [
    { href: '/', label: 'Reading', icon: Wand2 },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/booking', label: 'Booking', icon: BookHeart },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg text-primary">
              Mystic Insights
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-2 md:space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary hidden md:flex items-center gap-2',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          {isUserLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
