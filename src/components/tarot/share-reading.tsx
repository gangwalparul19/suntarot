'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareReadingProps {
    reading: string;
    question: string;
}

export function ShareReading({ reading, question }: ShareReadingProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const shareData = {
        title: 'My Tarot Reading from Sun Tarot',
        text: `Question: ${question}\n\nReading: ${reading.substring(0, 100)}...\n\nRead the full insight on Sun Tarot.`,
        url: window.location.href,
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = () => {
        const textToCopy = `${shareData.title}\n\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast({
            title: 'Copied to clipboard',
            description: 'You can now paste it anywhere to share.',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
            </Button>
        </div>
    );
}
