'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { CalendarIcon, Sparkles, Star, Wand2 } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  date: z.date({
    required_error: 'A date for your reading is required.',
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const pricingTiers = [
  {
    name: 'Quick Insight',
    price: '$25',
    description: 'A single card pull for focused guidance on a specific question.',
    features: ['1 Card Reading', '15 Minute Session', 'Email Summary'],
    popular: false,
  },
  {
    name: 'Standard Spread',
    price: '$60',
    description: 'A three-card spread to explore the past, present, and future of a situation.',
    features: ['3 Card Reading', '30 Minute Session', 'Email Summary', 'Follow-up Question'],
    popular: true,
  },
  {
    name: 'Deep Dive',
    price: '$100',
    description: 'A full Celtic Cross spread for a comprehensive look at your life path.',
    features: ['10 Card Reading', '60 Minute Session', 'Full Recording', 'Detailed PDF Summary'],
    popular: false,
  },
];


export default function BookingPage() {
  const { toast } = useToast();
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile-photo');
  const decorativeImage = PlaceHolderImages.find((img) => img.id === 'decorative-pattern');

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const { user } = useUser();
  const firestore = useFirestore();

  function onSubmit(data: BookingFormValues) {
    if (firestore) {
      addDocumentNonBlocking(collection(firestore, 'bookings'), {
        ...data,
        createdAt: new Date().toISOString(),
        userId: user?.uid || null,
        status: 'pending',
      }).catch(err => console.error('Error saving booking:', err));
    }

    toast({
      title: 'Booking Request Sent!',
      description: `Thank you, ${data.name}. We'll check availability for ${format(data.date, 'PPP')} and confirm via email at ${data.email}.`,
    });
    form.reset();
  }

  return (
    <div className="container py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16 relative py-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-4 relative">
          Book a Personal Reading
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto relative">
          Connect with me for a one-on-one session to explore the energies shaping your path. Together, we'll delve into your questions and uncover the wisdom the cards hold for you.
        </p>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center font-headline text-primary mb-10">Pricing Tiers</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={cn('flex flex-col bg-background/50 hover:shadow-primary/20 transition-shadow duration-300', tier.popular ? 'border-primary shadow-primary/20 shadow-lg' : 'border-border')}>
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1.5 rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-muted-foreground text-center min-h-[40px]">{tier.description}</p>
                <ul className="space-y-3 text-foreground/90">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Star className="w-4 h-4 mr-3 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                  <a href="#booking-form">Book Now</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>


      {/* Booking Form Section */}
      <div id="booking-form" className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center bg-card/50 p-8 rounded-lg border border-border">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary">
            Schedule Your Session
          </h2>
          <p className="text-muted-foreground">
            Choose your preferred date. I'll do my best to accommodate your request and will get back to you with a confirmation.
          </p>
          {profileImage && (
            <div className="relative aspect-square max-w-sm mx-auto md:mx-0 rounded-lg overflow-hidden shadow-lg shadow-primary/20">
              <Image
                src={profileImage.imageUrl}
                alt={profileImage.description}
                data-ai-hint={profileImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <Card className="bg-background/70 backdrop-blur-sm shadow-xl border-primary/20">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg">
                  <Wand2 className="mr-2" />
                  Request Booking
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
