import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="container py-12 md:py-20 px-4 max-w-4xl">
            <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>

            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8">Terms of Service</h1>

            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">1. Agreement to Terms</h2>
                <p>
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Sun Tarot ("we," "us" or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">2. Intellectual Property Rights</h2>
                <p>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">3. User Representations</h2>
                <p>
                    By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">4. Disclaimer</h2>
                <p>
                    Tarot readings are for entertainment and guidance purposes only. They do not constitute professional medical, legal, or financial advice. We are not responsible for any decisions made based on the readings provided.
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">5. Contact Us</h2>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at hello@suntarot.com.
                </p>
            </div>
        </div>
    );
}
