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
        toastError('Admin access required');
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
    let bookedSlots = {}; // Format: { "YYYY-MM-DD": ["HH:MM", ...] }

    // Try to get blocked dates and taken slots from Firestore
    if (typeof db !== 'undefined' && db) {
        try {
            // 1. Get Admin Blocked Dates
            const blockedSnapshot = await db.collection('availability')
                .where('blocked', '==', true)
                .get();

            blockedSnapshot.forEach(doc => {
                blockedDates.add(doc.id);
            });

            // 2. Get Taken Slots (Public Collection)
            // Note: We query the public 'taken_slots' instead of private 'bookings'
            const slotsSnapshot = await db.collection('taken_slots')
                .where('date', '>=', formatDate(today))
                .where('date', '<=', formatDate(endDate))
                .get();

            slotsSnapshot.forEach(doc => {
                const slot = doc.data();
                if (!bookedSlots[slot.date]) {
                    bookedSlots[slot.date] = [];
                }
                bookedSlots[slot.date].push(slot.time);
            });
        } catch (error) {
            console.log('Error fetching availability:', error);
            // Fallback: If 'taken_slots' is empty/fails, we might show all open (risk of overlap)
            // or we try to gracefully handle.
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

// ... (GenerateTimeSlots and Format functions unchanged) ...

// Create a booking
async function createBooking(date, time, serviceId, notes = '') {
    if (!requireLogin('Please sign in to book an appointment')) {
        return null;
    }

    const user = getCurrentUser();
    const service = SERVICES[serviceId];

    if (!service) {
        toastError('Invalid service selected');
        return null;
    }

    // Secure Pricing: Fetch latest service details
    let confirmedPrice = service.price;
    let confirmedDuration = service.duration;
    let confirmedName = service.name;

    try {
        if (typeof db !== 'undefined' && db) {
            const serviceDoc = await db.collection('services').doc(serviceId).get();
            if (serviceDoc.exists) {
                const data = serviceDoc.data();
                confirmedPrice = data.price;
                confirmedDuration = data.duration;
                confirmedName = data.name;
            }
        }
    } catch (e) {
        console.warn('Could not verify price with server', e);
    }

    try {
        // Use a Batch Write to ensure both 'bookings' and 'taken_slots' are created atomically
        const batch = db.batch();

        // 1. Prepare Booking Document
        const bookingRef = db.collection('bookings').doc(); // Auto ID
        const bookingData = {
            id: bookingRef.id,
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || 'User',
            date: date,
            time: time,
            serviceId: serviceId,
            serviceName: confirmedName,
            duration: confirmedDuration,
            price: confirmedPrice,
            notes: notes || '',
            status: 'confirmed',
            paymentStatus: 'N',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        batch.set(bookingRef, bookingData);

        // 2. Prepare Taken Slot Document (Deterministic ID to prevent duplicates)
        // ID Format: "slot_YYYY-MM-DD_HH-MM"
        const slotId = `slot_${date}_${time.replace(':', '-')}`;
        const slotRef = db.collection('taken_slots').doc(slotId);

        // Check if slot exists handling is via Rules (allow create, deny update on taken_slots?)
        // Or we rely on the transaction/batch failing if we added a precondition?
        // Firestore Batches don't support "create only if not exists" natively for specific ops unless using Rules.
        // Our Rule: allow create/read. allow update/delete: if isAdmin.
        // If the doc exists, 'set' counts as overwrite/update?
        // If permission is deny update, then this batch will FAIL if doc exists! Perfect.

        batch.set(slotRef, {
            date: date,
            time: time,
            bookedBy: user.uid, // Minimized info
            bookingId: bookingRef.id,
            expiresAt: null // Could add TTL
        });

        // Commit Batch
        await batch.commit();

        console.log('Booking and slot created successfully:', bookingRef.id);

        // Send Email Notification
        fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                booking: bookingData,
                adminEmail: 'tarotsun555666@gmail.com'
            })
        }).catch(err => console.error('Email API error:', err));

        return bookingRef.id;

    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.code === 'permission-denied') {
            // This likely means the slot is taken (update denied on taken_slots) or actual permission issue
            toastError('This time slot is no longer available. Please choose another.');
        } else {
            toastError('Booking failed: ' + error.message);
        }
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
            .get();

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        // Sort by date desc (client-side)
        bookings.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

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
        toastError('Admin access required');
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
        toastError('Admin access required');
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
