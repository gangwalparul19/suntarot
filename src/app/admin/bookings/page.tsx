'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Booking {
    id: string;
    name: string;
    email: string;
    date: string; // The selected date from the form (might be ISO string or timestamp)
    createdAt: string;
    status: string;
}

export default function AdminBookingsPage() {
    const firestore = useFirestore();

    const bookingsQuery = useMemoFirebase(() =>
        firestore ? query(collection(firestore, 'bookings'), orderBy('createdAt', 'desc')) : null,
        [firestore]
    );

    const { data: bookings, isLoading } = useCollection<Booking>(bookingsQuery);

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Booking Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Requested Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings?.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.name}</TableCell>
                                    <TableCell>{booking.email}</TableCell>
                                    <TableCell>
                                        {booking.date ? format(new Date(booking.date), 'PP') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="capitalize">{booking.status}</TableCell>
                                    <TableCell>
                                        {booking.createdAt ? format(new Date(booking.createdAt), 'PP p') : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!bookings?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No bookings found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
