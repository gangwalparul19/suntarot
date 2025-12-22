import { Loader2, Sun } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                <Sun className="h-16 w-16 text-primary animate-spin-slow duration-3000" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                </div>
            </div>
            <p className="mt-8 text-lg font-headline text-muted-foreground animate-pulse">
                Divining...
            </p>
        </div>
    );
}
