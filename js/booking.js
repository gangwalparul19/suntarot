// Sun Tarot Booking System
// =========================
// Handles appointment booking, availability management

// Availability settings
// Weekdays (Mon-Fri): 11:00 PM to 1:00 AM (late night slots)
// Weekends (Sat-Sun): 11:00 AM to 1:00 AM (extended hours)
const AVAILABILITY = {
    weekday: {
        // 11 PM to 1 AM spans two days, so we handle it as 23:00-23:59 on day 1, 00:00-01:00 on day 2
        slots: [
            { start: 23, end: 24 },  // 11 PM - 12 AM (same day)
            { start: 0, end: 1 }     // 12 AM - 1 AM (next day, but we show for booking on current day)
        ]
    },
    weekend: {
        // 11 AM to 1 AM 
        slots: [
            { start: 11, end: 24 },  // 11 AM - 12 AM
            { start: 0, end: 1 }     // 12 AM - 1 AM (next day)
        ]
    },
    slotDuration: 30, // 30 minutes
    timezone: 'Asia/Kolkata'
};

// Default service types (fallback if Firestore is unavailable)
// All services are 30 minutes duration
const DEFAULT_SERVICES = {
    'quick-insight': { name: 'Quick Insight', duration: 30, price: 250, description: '3-Card Spread' },
    'soul-journey': { name: 'Soul Journey', duration: 30, price: 500, description: 'Celtic Cross Spread' },
    'deep-dive': { name: 'Deep Dive', duration: 30, price: 750, description: 'Custom Multi-Spread' },
    'love-insight': { name: 'Love Insight', duration: 30, price: 350, description: '3-Card Love Spread', category: 'love' },
    'soulmate-reading': { name: 'Soulmate Reading', duration: 30, price: 650, description: '5-Card Relationship Spread', category: 'love' },
    'relationship-deep-dive': { name: 'Relationship Deep Dive', duration: 30, price: 999, description: 'Multiple Spreads', category: 'love' }
};

// Dynamic services (loaded from Firestore)
let SERVICES = { ...DEFAULT_SERVICES };

// Load services from Firestore
async function loadServicesFromFirestore() {
    if (typeof db === 'undefined' || !db) {
        console.log('Firestore not available, using default services');
        return DEFAULT_SERVICES;
    }

    try {
        const snapshot = await db.collection('services').get();

        if (snapshot.empty) {
            // Initialize with defaults if no services exist
            console.log('No services in Firestore, using defaults');
            return DEFAULT_SERVICES;
        }

        const services = {};
        snapshot.forEach(doc => {
            services[doc.id] = doc.data();
        });

        SERVICES = services;
        console.log('Loaded services from Firestore:', services);
        return services;
    } catch (error) {
        console.error('Error loading services:', error);
        return DEFAULT_SERVICES;
    }
}

// Save a service to Firestore (admin only)
async function saveService(serviceId, serviceData) {
    if (!isAdmin()) {
        alert('Admin access required');
        return false;
    }

    try {
        await db.collection('services').doc(serviceId).set(serviceData);
        SERVICES[serviceId] = serviceData;
        console.log('Service saved:', serviceId);
        return true;
    } catch (error) {
        console.error('Error saving service:', error);
        return false;
    }
}

// Initialize services from Firestore on load
async function initServices() {
    await loadServicesFromFirestore();
}

// Export for admin
window.loadServicesFromFirestore = loadServicesFromFirestore;
window.saveService = saveService;
window.initServices = initServices;
window.DEFAULT_SERVICES = DEFAULT_SERVICES;

// Check if a day is weekend (Saturday = 6, Sunday = 0)
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

// Get available dates for the next N days
async function getAvailableDates(daysAhead = 30) {
    // For now, generate slots without checking Firestore if db is not available
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysAhead);

    let blockedDates = new Set();
    let bookedSlots = {};

    // Try to get blocked dates and booked slots from Firestore
    if (typeof db !== 'undefined' && db) {
        try {
            const blockedSnapshot = await db.collection('availability')
                .where('blocked', '==', true)
                .get();

            blockedSnapshot.forEach(doc => {
                blockedDates.add(doc.id);
            });

            const bookingsSnapshot = await db.collection('bookings')
                .where('date', '>=', formatDate(today))
                .where('date', '<=', formatDate(endDate))
                .where('status', '!=', 'cancelled')
                .get();

            bookingsSnapshot.forEach(doc => {
                const booking = doc.data();
                if (!bookedSlots[booking.date]) {
                    bookedSlots[booking.date] = [];
                }
                bookedSlots[booking.date].push(booking.time);
            });
        } catch (error) {
            console.log('Firestore not available, showing all slots as available:', error.message);
        }
    }

    // Generate available dates
    const availableDates = [];
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);

        // Skip blocked dates
        if (blockedDates.has(dateStr)) continue;

        // Calculate available slots for this date based on day type
        const allSlots = generateTimeSlots(d);
        const bookedForDate = bookedSlots[dateStr] || [];
        const availableSlots = allSlots.filter(slot => !bookedForDate.includes(slot.time));

        if (availableSlots.length > 0) {
            availableDates.push({
                date: dateStr,
                dayName: d.toLocaleDateString('en-IN', { weekday: 'long' }),
                displayDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                availableSlots: availableSlots.map(s => s.time),
                allSlots: allSlots,
                bookedSlots: bookedForDate
            });
        }
    }

    return availableDates;
}

// Generate time slots for a specific day
function generateTimeSlots(date) {
    const slots = [];
    const weekend = isWeekend(date);
    const schedule = weekend ? AVAILABILITY.weekend.slots : AVAILABILITY.weekday.slots;

    for (const period of schedule) {
        for (let hour = period.start; hour < period.end; hour++) {
            for (let min = 0; min < 60; min += AVAILABILITY.slotDuration) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                slots.push({
                    time: time,
                    display: formatTimeDisplay(hour, min)
                });
            }
        }
    }
    return slots;
}

// Format time for display (12-hour format)
function formatTimeDisplay(hour, min) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
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
        // Check if slot is still available (simplified query to avoid index issues)
        const existingBookings = await db.collection('bookings')
            .where('date', '==', date)
            .where('time', '==', time)
            .get();

        // Check if any non-cancelled booking exists for this slot
        let slotTaken = false;
        existingBookings.forEach(doc => {
            if (doc.data().status !== 'cancelled') {
                slotTaken = true;
            }
        });

        if (slotTaken) {
            alert('Sorry, this slot has just been booked. Please select another time.');
            return null;
        }

        // Create the booking
        const bookingData = {
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || 'User',
            date: date,
            time: time,
            serviceId: serviceId,
            serviceName: service.name,
            duration: service.duration,
            price: service.price,
            notes: notes || '',
            status: 'confirmed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log('Creating booking with data:', bookingData);

        const bookingRef = await db.collection('bookings').add(bookingData);

        console.log('Booking created:', bookingRef.id);
        return bookingRef.id;
    } catch (error) {
        console.error('Error creating booking:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        alert('Failed to create booking: ' + error.message);
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
