'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const firestore = useFirestore();
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (!firestore) return;

            try {
                const bookingsRef = collection(firestore, 'bookings');

                // Total Bookings
                const totalSnapshot = await getDocs(bookingsRef);

                // Pending Bookings
                const pendingQuery = query(bookingsRef, where('status', '==', 'pending'));
                const pendingSnapshot = await getDocs(pendingQuery);

                setStats({
                    totalBookings: totalSnapshot.size,
                    pendingBookings: pendingSnapshot.size,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, [firestore]);

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$0</div>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
            </Card>
        </div>
    );
}
