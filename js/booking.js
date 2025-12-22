// Sun Tarot Booking System
// =========================
// Handles appointment booking, availability management

// Default availability settings
const DEFAULT_SETTINGS = {
    startHour: 10, // 10 AM
    endHour: 18,   // 6 PM
    slotDuration: 30, // 30 minutes
    timezone: 'Asia/Kolkata'
};

// Service types with durations
const SERVICES = {
    'quick-insight': { name: 'Quick Insight', duration: 15, price: 250 },
    'soul-journey': { name: 'Soul Journey', duration: 30, price: 500 },
    'deep-dive': { name: 'Deep Dive', duration: 60, price: 750 },
    'love-insight': { name: 'Love Insight', duration: 20, price: 350 },
    'soulmate-reading': { name: 'Soulmate Reading', duration: 40, price: 650 },
    'relationship-deep-dive': { name: 'Relationship Deep Dive', duration: 60, price: 999 }
};

// Get available dates for the next N days
async function getAvailableDates(daysAhead = 30) {
    if (!db) {
        console.error('Firestore not initialized');
        return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysAhead);

    try {
        // Get all blocked dates
        const blockedSnapshot = await db.collection('availability')
            .where('blocked', '==', true)
            .get();

        const blockedDates = new Set();
        blockedSnapshot.forEach(doc => {
            blockedDates.add(doc.id); // Date in YYYY-MM-DD format
        });

        // Get all booked slots
        const bookingsSnapshot = await db.collection('bookings')
            .where('date', '>=', formatDate(today))
            .where('date', '<=', formatDate(endDate))
            .where('status', '!=', 'cancelled')
            .get();

        const bookedSlots = {};
        bookingsSnapshot.forEach(doc => {
            const booking = doc.data();
            if (!bookedSlots[booking.date]) {
                bookedSlots[booking.date] = [];
            }
            bookedSlots[booking.date].push(booking.time);
        });

        // Generate available dates
        const availableDates = [];
        for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDate(d);

            // Skip blocked dates
            if (blockedDates.has(dateStr)) continue;

            // Skip Sundays (optional - can be configured)
            if (d.getDay() === 0) continue;

            // Calculate available slots for this date
            const allSlots = generateTimeSlots();
            const bookedForDate = bookedSlots[dateStr] || [];
            const availableSlots = allSlots.filter(slot => !bookedForDate.includes(slot));

            if (availableSlots.length > 0) {
                availableDates.push({
                    date: dateStr,
                    dayName: d.toLocaleDateString('en-IN', { weekday: 'long' }),
                    displayDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    availableSlots: availableSlots
                });
            }
        }

        return availableDates;
    } catch (error) {
        console.error('Error fetching available dates:', error);
        return [];
    }
}

// Generate time slots for a day
function generateTimeSlots() {
    const slots = [];
    for (let hour = DEFAULT_SETTINGS.startHour; hour < DEFAULT_SETTINGS.endHour; hour++) {
        for (let min = 0; min < 60; min += DEFAULT_SETTINGS.slotDuration) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            slots.push(time);
        }
    }
    return slots;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Create a booking
async function createBooking(date, time, serviceId, notes = '') {
    if (!requireLogin('Please sign in to book an appointment')) {
        return null;
    }

    const user = getCurrentUser();
    const service = SERVICES[serviceId];

    if (!service) {
        alert('Invalid service selected');
        return null;
    }

    try {
        // Check if slot is still available
        const existingBooking = await db.collection('bookings')
            .where('date', '==', date)
            .where('time', '==', time)
            .where('status', '!=', 'cancelled')
            .get();

        if (!existingBooking.empty) {
            alert('Sorry, this slot has just been booked. Please select another time.');
            return null;
        }

        // Create the booking
        const bookingRef = await db.collection('bookings').add({
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            date: date,
            time: time,
            serviceId: serviceId,
            serviceName: service.name,
            duration: service.duration,
            price: service.price,
            notes: notes,
            status: 'confirmed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Booking created:', bookingRef.id);
        return bookingRef.id;
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Failed to create booking. Please try again.');
        return null;
    }
}

// Get user's bookings
async function getUserBookings() {
    if (!isLoggedIn()) return [];

    const user = getCurrentUser();

    try {
        const snapshot = await db.collection('bookings')
            .where('userId', '==', user.uid)
            .orderBy('date', 'desc')
            .limit(20)
            .get();

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return [];
    }
}

// Cancel a booking
async function cancelBooking(bookingId) {
    if (!isLoggedIn()) return false;

    try {
        await db.collection('bookings').doc(bookingId).update({
            status: 'cancelled',
            cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return false;
    }
}

// Admin: Block a date
async function blockDate(date, reason = '') {
    if (!isAdmin()) {
        alert('Admin access required');
        return false;
    }

    try {
        await db.collection('availability').doc(date).set({
            blocked: true,
            reason: reason,
            blockedBy: getCurrentUser().email,
            blockedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error blocking date:', error);
        return false;
    }
}

// Admin: Unblock a date
async function unblockDate(date) {
    if (!isAdmin()) {
        alert('Admin access required');
        return false;
    }

    try {
        await db.collection('availability').doc(date).delete();
        return true;
    } catch (error) {
        console.error('Error unblocking date:', error);
        return false;
    }
}

// Admin: Get all bookings
async function getAllBookings(startDate = null, endDate = null) {
    if (!isAdmin()) return [];

    try {
        let query = db.collection('bookings').orderBy('date', 'desc');

        if (startDate) {
            query = query.where('date', '>=', startDate);
        }
        if (endDate) {
            query = query.where('date', '<=', endDate);
        }

        const snapshot = await query.limit(100).get();

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        return [];
    }
}

// Export functions
window.SERVICES = SERVICES;
window.getAvailableDates = getAvailableDates;
window.createBooking = createBooking;
window.getUserBookings = getUserBookings;
window.cancelBooking = cancelBooking;
window.blockDate = blockDate;
window.unblockDate = unblockDate;
window.getAllBookings = getAllBookings;
