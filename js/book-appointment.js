// State
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let availableDates = [];

// Initialize booking page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for auth state
    setTimeout(async () => {
        updateBookingUI();

        // Load dynamic prices from Firestore before rendering
        try {
            if (window.initServices) {
                await window.initServices();
            } else {
                console.warn('initServices not found, using defaults');
            }
        } catch (e) {
            console.error('Error initializing services:', e);
        }

        renderServices();

        // Check for service in URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const serviceFromUrl = urlParams.get('service');
        if (serviceFromUrl && SERVICES[serviceFromUrl]) {
            selectService(serviceFromUrl);
        }
    }, 500);
});

// Auth state callback
function updateBookingUI() {
    const loginPrompt = document.getElementById('loginPrompt');
    const bookingFlow = document.getElementById('bookingFlow');

    if (isLoggedIn()) {
        loginPrompt.style.display = 'none';
        bookingFlow.style.display = 'block';
    } else {
        loginPrompt.style.display = 'block';
        bookingFlow.style.display = 'none';
    }
}

// Render service options
function renderServices() {
    const grid = document.getElementById('serviceGrid');
    grid.innerHTML = Object.entries(SERVICES).map(([id, service]) => `
        <div class="service-option" data-service="${id}" onclick="selectService('${id}')">
            <h4>${service.name}</h4>
            <div class="service-price">Rs. ${service.price.toLocaleString()}</div>
            <div class="service-duration">${service.duration} minutes</div>
        </div>
    `).join('');
}

// Select a service
async function selectService(serviceId) {
    selectedService = serviceId;

    // Update UI
    document.querySelectorAll('.service-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.service === serviceId);
    });

    // Load available dates and go to step 2
    await loadAvailableDates();
    goToStep(2);
}

// Load available dates
async function loadAvailableDates() {
    const grid = document.getElementById('dateGrid');
    grid.innerHTML = '<p class="text-muted text-center">Loading available dates...</p>';

    // Get duration of selected service
    const service = SERVICES[selectedService];
    const duration = service ? service.duration : 30;

    availableDates = await getAvailableDates(30, duration);

    if (availableDates.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center">No available dates found for this duration.</p>';
        return;
    }

    grid.innerHTML = availableDates.map(date => `
        <div class="date-option" data-date="${date.date}" onclick="selectDate('${date.date}')">
            <div class="day-name">${date.dayName}</div>
            <div class="date-display">${date.displayDate}</div>
        </div>
    `).join('');
}

// Select a date
function selectDate(dateStr) {
    selectedDate = dateStr;

    // Update UI
    document.querySelectorAll('.date-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.date === dateStr);
    });

    // Load time slots and go to step 3
    loadTimeSlots(dateStr);
    goToStep(3);
}

// Load time slots for selected date
function loadTimeSlots(dateStr) {
    const dateInfo = availableDates.find(d => d.date === dateStr);
    const grid = document.getElementById('timeGrid');

    if (!dateInfo || dateInfo.allSlots.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center">No available times for this date.</p>';
        return;
    }

    // Render available slots (logic now handles availability)
    grid.innerHTML = dateInfo.allSlots.map(slot => `
        <div class="time-option" 
             data-time="${slot.time}" 
             onclick="selectTime('${slot.time}')">
            ${slot.display}
        </div>
    `).join('');
}

// Format time for display
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Select a time
function selectTime(time) {
    selectedTime = time;

    // Update UI
    document.querySelectorAll('.time-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.time === time);
    });

    // Show confirmation
    renderConfirmation();
    goToStep(4);
}

// Render confirmation summary
function renderConfirmation() {
    const service = SERVICES[selectedService];
    const dateInfo = availableDates.find(d => d.date === selectedDate);

    const summary = document.getElementById('bookingSummary');
    summary.innerHTML = `
        <h3>Booking Summary</h3>
        <div class="summary-row">
            <span class="text-muted">Service</span>
            <span>${service.name}</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Date</span>
            <span>${dateInfo.dayName}, ${dateInfo.displayDate}</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Time</span>
            <span>${formatTime(selectedTime)}</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Duration</span>
            <span>${service.duration} minutes</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Total</span>
            <span class="text-primary">Rs. ${service.price.toLocaleString()}</span>
        </div>
    `;
}

// Confirm booking
async function confirmBooking() {
    const notes = document.getElementById('bookingNotes').value;

    const bookingId = await createBooking(selectedDate, selectedTime, selectedService, notes);

    if (bookingId) {
        // Show success
        document.getElementById('bookingFlow').style.display = 'none';
        document.getElementById('successMessage').classList.add('show');

        const service = SERVICES[selectedService];
        const dateInfo = availableDates.find(d => d.date === selectedDate);

        document.getElementById('confirmationDetails').innerHTML = `
            <p><strong>${service.name}</strong></p>
            <p>${dateInfo.dayName}, ${dateInfo.displayDate} at ${formatTime(selectedTime)}</p>
            <p class="text-primary" style="font-size: 1.5rem; margin-top: 1rem;">Rs. ${service.price.toLocaleString()}</p>
        `;

        // Trigger Confetti
        if (window.confetti) {
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            var random = function (min, max) { return Math.random() * (max - min) + min; };

            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }
}

// Navigate between steps
function goToStep(step) {
    // Update step indicators
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step${i}Indicator`);
        indicator.classList.remove('active', 'completed');
        if (i < step) {
            indicator.classList.add('completed');
        } else if (i === step) {
            indicator.classList.add('active');
        }
    }

    // Update progress line (0%, 33%, 66%, 100%)
    const progressLine = document.getElementById('progressLine');
    const progressPercent = ((step - 1) / 3) * 100;
    progressLine.style.width = `${progressPercent}%`;

    // Show/hide sections
    document.getElementById('serviceSection').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('calendarSection').classList.toggle('active', step === 2);
    document.getElementById('timeSection').classList.toggle('active', step === 3);
    document.getElementById('confirmSection').classList.toggle('active', step === 4);
}

// Override updateAuthUI to refresh booking page state
const originalUpdateAuthUI = window.updateAuthUI;
window.updateAuthUI = function (user) {
    if (originalUpdateAuthUI) originalUpdateAuthUI(user);
    updateBookingUI();
};
