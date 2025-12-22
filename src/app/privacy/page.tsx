import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="container py-12 md:py-20 px-4 max-w-4xl">
            <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>

            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8">Privacy Policy</h1>

            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">1. Introduction</h2>
                <p>
                    Welcome to Sun Tarot. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    and tell you about your privacy rights and how the law protects you.
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">2. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul>
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li><strong>Booking Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                </ul>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">3. How We Use Your Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul>
                    <li>To register you as a new customer.</li>
                    <li>To process and deliver your reading or booking.</li>
                    <li>To manage our relationship with you.</li>
                </ul>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">4. Data Security</h2>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </p>

                <h2 className="mt-12 mb-4 text-2xl font-bold text-primary">5. Contact Us</h2>
                <p>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at hello@suntarot.com.
                </p>
            </div>
        </div>
    );
}
