import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Compass className="h-24 w-24 text-muted-foreground opacity-50 relative z-10" />
            </div>

            <h1 className="font-headline text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">The Path is Unclear</h2>

            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
                Like The Fool, you have wandered off the edge of the known map. But fear not, for every wrong turn is part of the journey.
            </p>

            <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Return Home
                </Link>
            </Button>
        </div>
    );
}
