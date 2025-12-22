import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-lg pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="font-headline text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Sun Tarot
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Illuminating your path through ancient wisdom and modern insight.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-foreground">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-accent transition-colors">Deck</Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-accent transition-colors">Readings</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">hello@suntarot.com</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">Mumbai, India</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-foreground">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sun Tarot. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
