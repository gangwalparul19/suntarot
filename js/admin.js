// Admin Panel Logic
let currentMonth = new Date();
// Cache for real-time data
let bookingsCache = [];
let reviewsCache = [];
let blockedDatesCache = new Set();
let listenersInitialized = false;
let unsubscribeBookings = null;
let unsubscribeReviews = null;
let unsubscribeAvailability = null;

// Check admin access
function checkAdminAccess() {
    const accessDenied = document.getElementById('accessDenied');
    const adminContent = document.getElementById('adminContent');

    if (!isLoggedIn()) {
        accessDenied.style.display = 'block';
        accessDenied.innerHTML = `
            <h2 class="text-primary">Please Sign In</h2>
            <p class="text-muted" style="margin: 1rem 0;">Sign in to access the admin dashboard.</p>
            <button class="btn btn-primary" onclick="signInWithGoogle()">Sign In with Google</button>
        `;
        adminContent.style.display = 'none';
    } else if (!isAdmin()) {
        accessDenied.style.display = 'block';
        accessDenied.innerHTML = `
            <h2 class="text-primary">Access Denied</h2>
            <p class="text-muted" style="margin: 1rem 0;">You don't have admin permissions.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
        `;
        adminContent.style.display = 'none';
    } else {
        accessDenied.style.display = 'none';
        adminContent.style.display = 'block';
        if (!listenersInitialized) {
            setupRealtimeListeners();
        } else {
            // If re-logging in or returning, ensure UI is up to date
            updateDashboardUI();
        }
    }
}

// Setup Real-time Listeners
function setupRealtimeListeners() {
    console.log('Initializing real-time listeners...');

    // 1. Bookings Listener
    unsubscribeBookings = db.collection('bookings')
        .onSnapshot(snapshot => {
            bookingsCache = [];
            snapshot.forEach(doc => {
                bookingsCache.push({ id: doc.id, ...doc.data() });
            });
            // Update UI whenever data changes
            console.log('Real-time update: Bookings', bookingsCache.length);
            updateDashboardUI();

            // Should also update pagination/tables if they are active
            const activePanel = document.querySelector('.admin-panel.active');
            if (activePanel && activePanel.id === 'bookingsPanel') {
                loadAllBookings(); // This now uses cache
            }
        }, error => {
            console.error('Error listening to bookings:', error);
            toastError('Live updates connection lost (Bookings)');
        });

    // 2. Reviews Listener
    unsubscribeReviews = db.collection('reviews')
        .onSnapshot(snapshot => {
            reviewsCache = [];
            snapshot.forEach(doc => {
                reviewsCache.push({ id: doc.id, ...doc.data() });
            });
            console.log('Real-time update: Reviews', reviewsCache.length);

            // Update Pending Badge in Sidebar/Stats
            updatePendingReviewsCount();

            // Refresh reviews list if active
            const activePanel = document.querySelector('.admin-panel.active');
            if (activePanel && activePanel.id === 'reviewsPanel') {
                loadReviewsByStatus(currentReviewStatus);
            }
        }, error => {
            console.error('Error listening to reviews:', error);
        });

    // 3. Availability Listener
    unsubscribeAvailability = db.collection('availability')
        .onSnapshot(snapshot => {
            blockedDatesCache.clear();
            snapshot.forEach(doc => {
                if (doc.data().blocked) {
                    blockedDatesCache.add(doc.id);
                }
            });
            console.log('Real-time update: Availability');

            // Refresh calendar if active
            const activePanel = document.querySelector('.admin-panel.active');
            if (activePanel && activePanel.id === 'availabilityPanel') {
                renderCalendar(); // This now uses cache
            }
        }, error => {
            console.error('Error listening to availability:', error);
        });

    listenersInitialized = true;
}

// Update Dashboard Stats & Charts from Cache
function updateDashboardUI() {
    const today = new Date().toISOString().split('T')[0];

    // Calculate stats
    const confirmedBookings = bookingsCache.filter(b => b.status === 'confirmed');
    const upcomingBookings = confirmedBookings.filter(b => b.date >= today);

    // Revenue
    const totalRevenue = confirmedBookings.reduce((sum, b) => {
        return sum + (b.paymentStatus === 'Y' ? (b.price || 0) : 0);
    }, 0);

    // Unique customers
    const uniqueEmails = new Set(confirmedBookings.map(b => b.userEmail).filter(Boolean));

    // Update DOM
    const statBookings = document.getElementById('statBookings');
    if (statBookings) {
        statBookings.textContent = confirmedBookings.length;
        document.getElementById('statRevenue').textContent = '₹' + totalRevenue.toLocaleString();
        document.getElementById('statUpcoming').textContent = upcomingBookings.length;
        document.getElementById('statCustomers').textContent = uniqueEmails.size;
    }

    // Only render high-cost items like charts if Dashboard is actually active or we just loaded
    // But keeping it simple: Update them since they are lightweight canvas ops usually
    renderCharts(bookingsCache);
    renderPopularServices(confirmedBookings);

    // Recent bookings table in dashboard
    renderBookingsTable(bookingsCache.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), 'recentBookings');
}

function updatePendingReviewsCount() {
    const pendingCount = reviewsCache.filter(r => r.status === 'pending').length;
    const statEl = document.getElementById('statPendingReviews');
    if (statEl) statEl.textContent = pendingCount;
}

// Show panel
function showPanel(panelName) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-tabs > .admin-tab').forEach(t => t.classList.remove('active'));

    document.getElementById(panelName + 'Panel').classList.add('active');
    event.target.classList.add('active');

    if (panelName === 'availability') {
        renderCalendar();
    } else if (panelName === 'reviews') {
        loadReviewsByStatus('pending');
    } else if (panelName === 'bookings') {
        loadAllBookings();
    } else if (panelName === 'pricing') {
        renderPricingForms();
    } else if (panelName === 'customers') {
        loadCustomers();
    }
}

// Pricing functions
async function renderPricingForms() {
    await initServices();
    const container = document.getElementById('pricingForms');

    container.innerHTML = Object.entries(SERVICES).map(([id, service]) => `
        <div style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem;">
            <h4 class="text-primary" style="margin-bottom: 1rem;">${service.name} ${service.category === 'love' ? '💕' : ''}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                <div>
                    <label class="text-muted" style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem;">Service Name</label>
                    <input type="text" id="name_${id}" value="${service.name}" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem; background: var(--color-card); color: var(--color-text);">
                </div>
                <div>
                    <label class="text-muted" style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem;">Price (₹)</label>
                    <input type="number" id="price_${id}" value="${service.price}" min="0"
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem; background: var(--color-card); color: var(--color-text);">
                </div>
                <div>
                    <label class="text-muted" style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem;">Duration (min)</label>
                    <input type="number" id="duration_${id}" value="${service.duration}" min="5" step="5"
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem; background: var(--color-card); color: var(--color-text);">
                </div>
                <div>
                    <label class="text-muted" style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem;">Description</label>
                    <input type="text" id="description_${id}" value="${service.description || ''}" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem; background: var(--color-card); color: var(--color-text);">
                </div>
            </div>
            <button class="btn btn-primary" onclick="saveServicePrice('${id}')" style="margin-top: 1rem;">
                Save Changes
            </button>
        </div>
    `).join('');
}

async function saveServicePrice(serviceId) {
    const name = document.getElementById(`name_${serviceId}`).value;
    const price = parseInt(document.getElementById(`price_${serviceId}`).value);
    const duration = parseInt(document.getElementById(`duration_${serviceId}`).value);
    const description = document.getElementById(`description_${serviceId}`).value;

    const serviceData = {
        name,
        price,
        duration,
        description,
        category: SERVICES[serviceId]?.category || null
    };

    // Remove null category
    if (!serviceData.category) delete serviceData.category;

    const success = await saveService(serviceId, serviceData);
    if (success) {
        toastSuccess('Price updated successfully! Changes will appear on the booking page.');
    }
}

async function resetToDefaults() {
    if (!confirm('Are you sure you want to reset all prices to defaults?')) return;

    for (const [id, service] of Object.entries(DEFAULT_SERVICES)) {
        await saveService(id, service);
    }

    toastSuccess('All prices reset to defaults!');
    renderPricingForms();
}

// ========================================
// Reviews Management
// ========================================
let currentReviewStatus = 'pending';

async function loadReviewsByStatus(status) {
    currentReviewStatus = status;
    const container = document.getElementById('reviewsList');
    container.innerHTML = '<p class="text-muted">Loading reviews...</p>';

    // Update tab active state
    document.querySelectorAll('#reviewsPanel .admin-tabs .admin-tab').forEach((tab, index) => {
        tab.classList.remove('active');
        if ((status === 'pending' && index === 0) ||
            (status === 'approved' && index === 1) ||
            (status === 'rejected' && index === 2)) {
            tab.classList.add('active');
        }
    });

    // Use cache instead of fetch
    const statusReviews = reviewsCache.filter(r => r.status === status);

    // Sort by date desc (assuming createdAt is timestamp)
    // Note: Firestore timestamps need converting if not already done by cache push? 
    // Usually cache has raw firestore data. 
    // Let's robustly sort.
    statusReviews.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
    });

    renderReviewsList(container, statusReviews, status);
}

function renderReviewsList(container, reviews, status) {
    if (reviews.length === 0) {
        container.innerHTML = `<p class="text-muted">No ${status} reviews found.</p>`;
        return;
    }

    container.innerHTML = reviews.map(review => `
            <div class="review-card" style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <img src="${review.userPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.userName || 'User')}" 
                             alt="${review.userName || 'User'}"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <p class="text-primary" style="margin: 0; font-weight: 600; font-size: 0.9rem;">${review.userName || 'Anonymous'}</p>
                            <small class="text-muted" style="font-size: 0.75rem;">${review.userEmail || ''}</small>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: gold; font-size: 0.8rem;">${'⭐'.repeat(review.rating || 5)}</div>
                        <small class="text-muted" style="font-size: 0.7rem;">${formatDate(review.createdAt)}</small>
                        ${review.featured ? '<span style="background: var(--color-primary); color: #000; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.65rem; margin-left: 0.25rem;">FEATURED</span>' : ''}
                    </div>
                </div>
                <p style="margin: 0.75rem 0; font-style: italic; color: var(--color-text); font-size: 0.9rem;">"${escapeHtml(review.text)}"</p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    ${status === 'pending' ? `
                        <button class="btn btn-primary review-btn" onclick="handleApproveReview('${review.id}')">
                            ✓ Approve
                        </button>
                        <button class="btn btn-outline review-btn" onclick="handleRejectReview('${review.id}')">
                            ✗ Reject
                        </button>
                    ` : ''}
                    ${status === 'approved' ? `
                        <button class="btn ${review.featured ? 'btn-primary' : 'btn-outline'} review-btn" onclick="handleToggleFeature('${review.id}', ${!review.featured})">
                            ${review.featured ? '★ Featured' : '☆ Feature'}
                        </button>
                    ` : ''}
                    <button class="btn btn-outline review-btn" onclick="handleDeleteReview('${review.id}')" style="color: #e74c3c;">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
}

async function handleApproveReview(reviewId) {
    const success = await approveReview(reviewId);
    if (success) {
        toastSuccess('Review approved! It will now appear on the home page.');
        // Listener updates UI
    } else {
        toastError('Failed to approve review');
    }
}

async function handleRejectReview(reviewId) {
    const reason = prompt('Reason for rejection (optional):');
    const success = await rejectReview(reviewId, reason || '');
    if (success) {
        toastInfo('Review rejected');
        loadReviewsByStatus(currentReviewStatus);
        // Update pending count
        const pendingReviews = await getAllReviews('pending');
        document.getElementById('statPendingReviews').textContent = pendingReviews.length;
    } else {
        toastError('Failed to reject review');
    }
}

async function handleDeleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const success = await deleteReview(reviewId);
    if (success) {
        toastSuccess('Review deleted');
        loadReviewsByStatus(currentReviewStatus);
    } else {
        toastError('Failed to delete review');
    }
}

async function handleToggleFeature(reviewId, featured) {
    const success = await toggleFeatureReview(reviewId, featured);
    if (success) {
        if (featured) {
            toastSuccess('Review featured! It will now appear on the home page.');
        } else {
            toastInfo('Review unfeatured');
        }
        loadReviewsByStatus(currentReviewStatus);
    } else {
        toastError('Failed to update feature status');
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Load dashboard data
// Load dashboard data (Deprecated in favor of real-time updateDashboardUI, but sending to setup for back-compat if needed)
async function loadDashboardData() {
    if (!listenersInitialized) setupRealtimeListeners();
}


// Render popular services chart
function renderPopularServices(bookings) {
    const serviceCounts = {};
    const serviceRevenue = {};

    bookings.forEach(b => {
        const name = b.serviceName || 'Unknown';
        serviceCounts[name] = (serviceCounts[name] || 0) + 1;

        // Track revenue only if paid
        if (b.paymentStatus === 'Y') {
            serviceRevenue[name] = (serviceRevenue[name] || 0) + (b.price || 0);
        }
    });

    const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);

    const container = document.getElementById('popularServices');
    if (sorted.length === 0) {
        container.innerHTML = '<p class="text-muted">No booking data yet.</p>';
        return;
    }

    const maxCount = sorted[0][1];

    container.innerHTML = sorted.map(([name, count]) => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span>${name}</span>
                <span class="text-muted">${count} bookings | ₹${serviceRevenue[name].toLocaleString()}</span>
            </div>
            <div style="background: var(--color-background); border-radius: 0.25rem; height: 8px; overflow: hidden;">
                <div style="width: ${(count / maxCount * 100)}%; background: var(--color-primary); height: 100%;"></div>
            </div>
        </div>
    `).join('');
}

// Export bookings to CSV
function exportBookingsCSV() {
    getAllBookings().then(bookings => {
        if (bookings.length === 0) {
            toastWarning('No bookings to export.');
            return;
        }

        const headers = ['Date', 'Time', 'Service', 'Customer', 'Email', 'Price', 'Status', 'Notes'];
        const rows = bookings.map(b => [
            b.date,
            b.time,
            b.serviceName,
            b.userName || '',
            b.userEmail,
            b.price || '',
            b.status,
            (b.notes || '').replace(/,/g, ';')
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `sun - tarot - bookings - ${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        URL.revokeObjectURL(url);
    });
}

// Pagination State
let bookingsPagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    allData: [], // Store all data locally for filtering/sorting/pagination
    filteredData: [] // Store filtered data
};

// Load all bookings
async function loadAllBookings() {
    // Use Cache
    bookingsPagination.allData = [...bookingsCache];

    // Initial sort descending by date (default)
    bookingsPagination.allData.sort((a, b) => {
        return new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + b.time);
    });

    bookingsPagination.filteredData = [...bookingsPagination.allData];
    bookingsPagination.totalItems = bookingsPagination.filteredData.length;
    bookingsPagination.totalPages = Math.ceil(bookingsPagination.totalItems / bookingsPagination.itemsPerPage);
    bookingsPagination.currentPage = 1;

    renderBookingsTable(getBookingsPage(1), 'allBookings');
    renderPaginationControls();
}

function getBookingsPage(page) {
    const start = (page - 1) * bookingsPagination.itemsPerPage;
    const end = start + bookingsPagination.itemsPerPage;
    return bookingsPagination.filteredData.slice(start, end);
}

function changePage(delta) {
    const newPage = bookingsPagination.currentPage + delta;
    if (newPage >= 1 && newPage <= bookingsPagination.totalPages) {
        bookingsPagination.currentPage = newPage;
        renderBookingsTable(getBookingsPage(newPage), 'allBookings');
        renderPaginationControls();
    }
}

function renderPaginationControls() {
    const container = document.getElementById('allBookingsPagination');
    if (!container) {
        // Create container if it doesn't exist
        const tableContainer = document.getElementById('allBookings');
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'allBookingsPagination';
        paginationDiv.style.display = 'flex';
        paginationDiv.style.justifyContent = 'space-between';
        paginationDiv.style.alignItems = 'center';
        paginationDiv.style.marginTop = '1rem';
        tableContainer.insertAdjacentElement('afterend', paginationDiv);
        return renderPaginationControls(); // Re-run to populate
    }

    container.innerHTML = `
        < span class="text-muted" style = "font-size: 0.9rem;" >
            Showing ${(bookingsPagination.currentPage - 1) * bookingsPagination.itemsPerPage + 1} to ${Math.min(bookingsPagination.currentPage * bookingsPagination.itemsPerPage, bookingsPagination.totalItems)} of ${bookingsPagination.totalItems} entries
        </span >
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline" onclick="changePage(-1)" ${bookingsPagination.currentPage === 1 ? 'disabled' : ''} style="padding: 0.25rem 0.75rem;">
                Previous
            </button>
            <span style="display: flex; align-items: center; padding: 0 0.5rem; font-weight: bold;">
                ${bookingsPagination.currentPage}
            </span>
            <button class="btn btn-outline" onclick="changePage(1)" ${bookingsPagination.currentPage === bookingsPagination.totalPages ? 'disabled' : ''} style="padding: 0.25rem 0.75rem;">
                Next
            </button>
        </div>
    `;
}

// Filter Functions
function applyBookingFilters() {
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const payment = document.getElementById('filterPayment').value;
    const status = document.getElementById('filterStatus').value;

    let filtered = [...bookingsPagination.allData];

    // Date Range Filter
    if (startDate) {
        filtered = filtered.filter(b => b.date >= startDate);
    }
    if (endDate) {
        filtered = filtered.filter(b => b.date <= endDate);
    }

    // Payment Filter
    if (payment !== 'all') {
        filtered = filtered.filter(b => (b.paymentStatus || 'N') === payment);
    }

    // Status Filter
    if (status !== 'all') {
        filtered = filtered.filter(b => b.status === status);
    }

    // Update Pagination State
    bookingsPagination.filteredData = filtered;
    bookingsPagination.totalItems = filtered.length;
    bookingsPagination.totalPages = Math.ceil(bookingsPagination.totalItems / bookingsPagination.itemsPerPage);
    bookingsPagination.currentPage = 1;

    renderBookingsTable(getBookingsPage(1), 'allBookings');
    renderPaginationControls();
}

function resetBookingFilters() {
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('filterPayment').value = 'all';
    document.getElementById('filterStatus').value = 'all';

    // Reset to full list
    bookingsPagination.filteredData = [...bookingsPagination.allData];
    bookingsPagination.totalItems = bookingsPagination.filteredData.length;
    bookingsPagination.totalPages = Math.ceil(bookingsPagination.totalItems / bookingsPagination.itemsPerPage);
    bookingsPagination.currentPage = 1;

    renderBookingsTable(getBookingsPage(1), 'allBookings');
    renderPaginationControls();
}

// Render bookings table
function renderBookingsTable(bookings, containerId) {
    const container = document.getElementById(containerId);
    const showActions = containerId === 'allBookings';

    if (bookings.length === 0) {
        container.innerHTML = '<p class="text-muted">No bookings found.</p>';
        return;
    }

    // Only show pagination for 'allBookings'
    if (containerId !== 'allBookings') {
        // for recent bookings, etc. just render what is passed
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Payment</th>
                    ${showActions ? '<th>Actions</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${bookings.map(b => `
                    <tr>
                        <td>${b.date}</td>
                        <td>${b.time}</td>
                        <td>${b.serviceName}</td>
                        <td>
                            <div>${b.userName || 'Guest'}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${b.userEmail}</div>
                        </td>
                        <td><span class="status-badge status-${b.status}">${b.status}</span></td>
                        <td>
                            <button class="status-badge" 
                                    style="border: none; cursor: pointer; background: ${b.paymentStatus === 'Y' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)'}; color: ${b.paymentStatus === 'Y' ? '#27ae60' : '#e74c3c'};"
                                    onclick="togglePaymentStatus('${b.id}', '${b.paymentStatus || 'N'}')">
                                ${b.paymentStatus === 'Y' ? 'Y' : 'N'}
                            </button>
                        </td>
                        ${showActions ? `
                            <td>
                                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                                        onclick="openRescheduleModal('${b.id}', '${b.date}')">
                                    📅 Reschedule
                                </button>
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Toggle Payment Status
async function togglePaymentStatus(bookingId, currentStatus) {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const btn = event.currentTarget; // Optimistic update visual

    // Visual feedback
    btn.innerHTML = '...';

    try {
        await db.collection('bookings').doc(bookingId).update({
            paymentStatus: newStatus,
            updatedAt: new Date()
        });

        toastSuccess(`Payment marked as ${newStatus} `);
        loadDashboardData(); // Reload to update revenue
    } catch (error) {
        console.error('Error updating payment status:', error);
        toastError('Failed to update payment');
    }
}

// Calendar functions
function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
    renderCalendar();
}

async function renderCalendar() {
    document.getElementById('currentMonthLabel').textContent =
        currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    // Get available dates and bookings for this month
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Format for query
    const startStr = startOfMonth.toISOString().split('T')[0];
    const endStr = endOfMonth.toISOString().split('T')[0];

    // Use Cache for real-time updates
    const blockedDates = blockedDatesCache;

    // Calculate Monthly Bookings from Cache
    var monthlyBookings = {};

    // Filter bookings cache for this month locally
    bookingsCache.forEach(b => {
        if (b.status !== 'cancelled' && b.date >= startStr && b.date <= endStr) {
            if (!monthlyBookings[b.date]) monthlyBookings[b.date] = 0;
            monthlyBookings[b.date]++;
        }
    });

    // Render calendar
    const calendarContainer = document.getElementById('calendarDays');
    const firstDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    let html = '<div class="availability-grid">';

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day" style="opacity: 0.3;"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const isBlocked = blockedDates.has(dateStr);
        const isPast = date < new Date().setHours(0, 0, 0, 0);
        const bookingCount = monthlyBookings[dateStr] || 0;

        html += `
            <div class="calendar-day ${isBlocked ? 'blocked' : ''} ${bookingCount > 0 ? 'has-bookings' : ''}" 
                 onclick="openDayDetails('${dateStr}')"
                 style="${isPast ? 'opacity: 0.7;' : ''}">
                <div style="font-size: 1.25rem; font-weight: bold;">${day}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">
                    ${isBlocked ? '🚫 Blocked' : '✓ Open'}
                </div>
                ${bookingCount > 0 ? `<div style="margin-top:0.25rem; font-size: 0.7rem; color: var(--color-primary);">📅 ${bookingCount} Booking${bookingCount > 1 ? 's' : ''}</div>` : ''}
            </div>
        `;
    }

    html += '</div>';
    calendarContainer.innerHTML = html;
}

async function toggleDate(dateStr, action) {
    if (action === 'block') {
        if (await blockDate(dateStr, 'Blocked by admin')) {
            // blockedDatesCache will auto-update via listener
            toastSuccess('Date blocked successfully');
        } else {
            toastError('Failed to block date');
        }
    } else {
        if (await unblockDate(dateStr)) {
            // blockedDatesCache will auto-update via listener
            toastSuccess('Date unblocked successfully');
        } else {
            toastError('Failed to unblock date');
        }
    }
    // renderCalendar(); // Listener will trigger this
    // openDayDetails(dateStr); // Listener might cause flicker if we rely only on it. 
    // Let's keep manual refresh for immediate feedback UI until listener catches up? 
    // Actually listener is fast. But we need to refresh Details Modal which pulls from DB?
    // We should refactor openDayDetails to use cache too! but for now let's query fresh for modal.
    setTimeout(() => openDayDetails(dateStr), 500); // Small delay to allow Firestore propagation if using fetch
}

async function openDayDetails(dateStr) {
    const modal = document.getElementById('dayDetailsModal');
    const title = document.getElementById('dayDetailsTitle');
    const content = document.getElementById('dayBookingsList');
    const statusText = document.getElementById('dayStatusText');
    const blockBtn = document.getElementById('blockDateBtn');
    const unblockBtn = document.getElementById('unblockDateBtn');

    // Format date header
    const dateObj = new Date(dateStr);
    title.textContent = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Show modal
    modal.classList.add('show');
    content.innerHTML = '<p class="text-muted">Loading bookings...</p>';

    // Set buttons based on current block status
    const isBlocked = blockedDatesCache.has(dateStr);
    if (isBlocked) {
        statusText.innerHTML = 'Current Status: <span style="color: #e74c3c; font-weight: bold;">🚫 Blocked</span>';
        blockBtn.style.display = 'none';
        unblockBtn.style.display = 'block';
        unblockBtn.onclick = () => toggleDate(dateStr, 'unblock');
    } else {
        statusText.innerHTML = 'Current Status: <span style="color: #27ae60; font-weight: bold;">✓ Open for Business</span>';
        blockBtn.style.display = 'block';
        unblockBtn.style.display = 'none';
        blockBtn.onclick = () => toggleDate(dateStr, 'block');
    }

    // Fetch bookings for this day (Use Cache!)
    const dayBookings = bookingsCache.filter(b => b.date === dateStr && b.status !== 'cancelled');
    // Sort by time
    dayBookings.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    if (dayBookings.length === 0) {
        content.innerHTML = '<p class="text-muted">No bookings for this date.</p>';
    } else {
        content.innerHTML = `
        < h4 class="text-primary" style = "margin-bottom: 0.5rem;" >📅 Bookings(${dayBookings.length})</h4 >
            <div style="max-height: 300px; overflow-y: auto;">
                ${dayBookings.map(b => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--color-background); border: 1px solid var(--color-border); margin-bottom: 0.5rem; border-radius: 0.5rem;">
                            <div>
                            <div style="font-weight: bold; color: var(--color-primary);">${b.time}</div>
                            <div>${b.userName}</div>
                            <div class="text-muted" style="font-size: 0.8rem;">${b.serviceName}</div>
                            </div>
                            <span class="status-badge status-${b.status}">${b.status}</span>
                    </div>
                `).join('')}
            </div>
    `;
    }
}

function closeDayDetailsModal() {
    document.getElementById('dayDetailsModal').classList.remove('show');
}

// ========================================
// ANALYTICS CHARTS
// ========================================
let bookingTrendsChart = null;
let revenueChart = null;
let timeSlotsChart = null;

async function renderCharts(bookings) {
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

    // Destroy existing charts
    if (bookingTrendsChart) bookingTrendsChart.destroy();
    if (revenueChart) revenueChart.destroy();
    if (timeSlotsChart) timeSlotsChart.destroy();

    // Booking Trends - last 30 days
    const trendData = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        trendData[dateStr] = 0;
    }
    confirmedBookings.forEach(b => {
        if (trendData.hasOwnProperty(b.date)) {
            trendData[b.date]++;
        }
    });

    const ctx1 = document.getElementById('bookingTrendsChart').getContext('2d');
    bookingTrendsChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: Object.keys(trendData).map(d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
            datasets: [{
                label: 'Bookings',
                data: Object.values(trendData),
                borderColor: '#d4a95d',
                backgroundColor: 'rgba(212, 169, 93, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { ticks: { maxTicksLimit: 7 } }
            }
        }
    });

    // Revenue by Service
    const revenueData = {};
    confirmedBookings.forEach(b => {
        const name = b.serviceName || 'Other';
        revenueData[name] = (revenueData[name] || 0) + (b.price || 0);
    });

    const ctx2 = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(revenueData),
            datasets: [{
                data: Object.values(revenueData),
                backgroundColor: ['#d4a95d', '#db7093', '#27ae60', '#3498db', '#9b59b6', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#aaa', font: { size: 10 } } }
            }
        }
    });

    // Popular Time Slots
    const timeData = {};
    confirmedBookings.forEach(b => {
        if (b.time) {
            const hour = b.time.split(':')[0];
            const displayTime = `${hour}:00`;
            timeData[displayTime] = (timeData[displayTime] || 0) + 1;
        }
    });
    const sortedTimes = Object.entries(timeData).sort((a, b) => a[0].localeCompare(b[0]));

    const ctx3 = document.getElementById('timeSlotsChart').getContext('2d');
    timeSlotsChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: sortedTimes.map(t => t[0]),
            datasets: [{
                label: 'Bookings',
                data: sortedTimes.map(t => t[1]),
                backgroundColor: '#d4a95d'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    // Bookings by City
    const cityData = {};
    // We need to fetch city from user details map (which we should cache globally or refetch)
    // For now, let's try to get city from bookings if we can map it. 
    // We might need to call loadCustomers first or fetch users here.

    // To be efficient, let's just fetch users here once or use a global if available.
    // Since this function is async, we can fetch.
    try {
        const usersSnap = await db.collection('users').get();
        const userCities = {};
        usersSnap.forEach(doc => {
            const data = doc.data();
            if (data.city) userCities[doc.id] = data.city;
        });

        confirmedBookings.forEach(b => {
            let city = 'Unknown';
            if (b.userId && userCities[b.userId]) {
                city = userCities[b.userId];
            }
            cityData[city] = (cityData[city] || 0) + 1;
        });

        const sortedCities = Object.entries(cityData).sort((a, b) => b[1] - a[1]);

        const ctx4 = document.getElementById('cityChart').getContext('2d');
        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: sortedCities.map(c => c[0]),
                datasets: [{
                    label: 'Bookings',
                    data: sortedCities.map(c => c[1]),
                    backgroundColor: '#9b59b6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });

    } catch (e) {
        console.error("Error loading city data for chart", e);
    }
}

// ========================================
// CUSTOMER MANAGEMENT
// ========================================
let allCustomers = [];

async function loadCustomers() {
    const bookings = await getAllBookings();
    const customerMap = {};

    bookings.forEach(b => {
        const email = b.userEmail;
        if (!email) return;

        if (!customerMap[email]) {
            customerMap[email] = {
                email,
                name: b.userName || email.split('@')[0],
                photo: b.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.userName || 'User')}`,
                bookings: [],
                totalSpent: 0
            };
        }
        customerMap[email].bookings.push(b);
        customerMap[email].totalSpent += (b.price || 0);
    });

    // Load user details (Mobile, City)
    try {
        const usersSnapshot = await db.collection('users').get();
        const userDetails = {};
        usersSnapshot.forEach(doc => {
            userDetails[doc.id] = doc.data();
        });

        // Merge into customerMap
        Object.values(customerMap).forEach(customer => {
            // Find a booking with userId to link to userDetails
            const bookingWithId = customer.bookings.find(b => b.userId);
            if (bookingWithId && userDetails[bookingWithId.userId]) {
                const details = userDetails[bookingWithId.userId];
                customer.mobile = details.mobile || '';
                customer.city = details.city || '';
                // Also update name/photo if robust
            }
        });

    } catch (e) {
        console.log('Error loading user details:', e);
    }

    // Load admin notes
    try {
        const notesSnapshot = await db.collection('customerNotes').get();
        notesSnapshot.forEach(doc => {
            if (customerMap[doc.id]) {
                customerMap[doc.id].notes = doc.data().notes || '';
            }
        });
    } catch (e) {
        console.log('No customer notes collection yet');
    }

    allCustomers = Object.values(customerMap).sort((a, b) => b.bookings.length - a.bookings.length);
    renderCustomers(allCustomers);
}

// Helper to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderCustomers(customers) {
    const grid = document.getElementById('customerGrid');

    if (customers.length === 0) {
        grid.innerHTML = '<p class="text-muted">No customers found.</p>';
        return;
    }

    grid.innerHTML = customers.map(c => `
        <div class="customer-card" onclick="openCustomerModal('${escapeHtml(c.email)}')">
            <div class="customer-stats">
                <div class="customer-stat">
                        <div class="text-muted" style="font-size: 0.75rem;">${escapeHtml(c.mobile) || '-'}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">${escapeHtml(c.city) || '-'}</div>
                </div>
            </div>
            <div class="customer-header">
                <img src="${c.photo || 'https://ui-avatars.com/api/?name=User'}" alt="${escapeHtml(c.name)}" class="customer-avatar">
                <div>
                    <div class="customer-name">
                        ${escapeHtml(c.name)}
                        ${c.bookings.length >= 3 ? '<span class="vip-badge">⭐ VIP</span>' : ''}
                    </div>
                    <div class="customer-email">${escapeHtml(c.email)}</div>
                </div>
            </div>
            <div class="customer-stats">
                <div class="customer-stat">
                    <div class="customer-stat-value">${c.bookings.length}</div>
                    <div class="customer-stat-label">Bookings</div>
                </div>
                <div class="customer-stat">
                    <div class="customer-stat-value">₹${c.totalSpent.toLocaleString()}</div>
                    <div class="customer-stat-label">Total Spent</div>
                </div>
            </div>
        </div>
    `).join('');
}

function searchCustomers(query) {
    const q = query.toLowerCase();
    const filtered = allCustomers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
    renderCustomers(filtered);
}

function openCustomerModal(email) {
    const customer = allCustomers.find(c => c.email === email);
    if (!customer) return;

    document.getElementById('customerModalTitle').textContent = customer.name;
    document.getElementById('customerModal').classList.add('show');

    const content = document.getElementById('customerModalContent');
    content.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <img src="${customer.photo}" alt="${customer.name}" style="width: 64px; height: 64px; border-radius: 50%;">
            <div>
                <div style="font-weight: 600;">${customer.name} ${customer.bookings.length >= 3 ? '<span class="vip-badge">⭐ VIP</span>' : ''}</div>
                <div class="text-muted">${customer.email}</div>
                <div class="text-primary">₹${customer.totalSpent.toLocaleString()} total | ${customer.bookings.length} bookings</div>
            </div>
        </div>

        <h4 class="text-primary" style="margin-bottom: 0.5rem;">📝 Admin Notes</h4>
        <textarea class="notes-textarea" id="customerNotes" placeholder="Add notes about this customer...">${customer.notes || ''}</textarea>
        <button class="btn btn-primary" style="margin-top: 0.5rem; margin-bottom: 1.5rem;" onclick="saveCustomerNotes('${email}')">Save Notes</button>

        <h4 class="text-primary" style="margin-bottom: 0.5rem;">📅 Booking History</h4>
        <table class="admin-table">
            <thead>
                <tr><th>Date</th><th>Time</th><th>Service</th><th>Amount</th></tr>
            </thead>
            <tbody>
                ${customer.bookings.map(b => `
                    <tr>
                        <td>${b.date}</td>
                        <td>${b.time}</td>
                        <td>${b.serviceName || '-'}</td>
                        <td>₹${b.price || 0}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('show');
}

async function saveCustomerNotes(email) {
    const notes = document.getElementById('customerNotes').value;
    try {
        await db.collection('customerNotes').doc(email).set({ notes, updatedAt: new Date() });
        toastSuccess('Notes saved!');

        // Update local data
        const customer = allCustomers.find(c => c.email === email);
        if (customer) customer.notes = notes;
    } catch (error) {
        console.error('Error saving notes:', error);
        toastError('Failed to save notes');
    }
}

// ========================================
// APPOINTMENT RESCHEDULING
// ========================================
function openRescheduleModal(bookingId, currentDate) {
    document.getElementById('rescheduleBookingId').value = bookingId;
    document.getElementById('rescheduleDate').value = currentDate || '';
    document.getElementById('rescheduleTime').innerHTML = '<option value="">Select a date first...</option>';
    document.getElementById('rescheduleModal').classList.add('show');

    // Load time slots when date changes
    document.getElementById('rescheduleDate').onchange = async function () {
        const dateStr = this.value;
        const select = document.getElementById('rescheduleTime');
        select.innerHTML = '<option value="">Loading...</option>';

        const dates = await getAvailableDates(60, 30); // Default to 30 min for reschedule as we don't have service id handy easily
        const dateInfo = dates.find(d => d.date === dateStr);

        if (!dateInfo || dateInfo.availableSlots.length === 0) {
            select.innerHTML = '<option value="">No slots available</option>';
            return;
        }

        select.innerHTML = '<option value="">Select a time...</option>' +
            dateInfo.availableSlots.map(t => {
                const slot = dateInfo.allSlots.find(s => s.time === t);
                return `<option value="${t}">${slot ? slot.display : t}</option>`;
            }).join('');
    };
}

function closeRescheduleModal() {
    document.getElementById('rescheduleModal').classList.remove('show');
}

async function confirmReschedule() {
    const bookingId = document.getElementById('rescheduleBookingId').value;
    const newDate = document.getElementById('rescheduleDate').value;
    const newTime = document.getElementById('rescheduleTime').value;

    if (!newDate || !newTime) {
        toastWarning('Please select both date and time');
        return;
    }

    try {
        await db.collection('bookings').doc(bookingId).update({
            date: newDate,
            time: newTime,
            updatedAt: new Date(),
            rescheduledAt: new Date()
        });

        toastSuccess('Appointment rescheduled!');
        closeRescheduleModal();
        loadAllBookings();
        loadDashboardData();
    } catch (error) {
        console.error('Error rescheduling:', error);
        toastError('Failed to reschedule');
    }
}

// ========================================
// BULK DATE BLOCKING
// ========================================
async function blockDateRange() {
    const fromDate = document.getElementById('bulkFromDate').value;
    const toDate = document.getElementById('bulkToDate').value;

    if (!fromDate || !toDate) {
        toastWarning('Please select both from and to dates');
        return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start > end) {
        toastWarning('From date must be before To date');
        return;
    }

    let count = 0;
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }

    for (const dateStr of dates) {
        if (await blockDate(dateStr, 'Bulk blocked')) {
            count++;
        }
    }

    toastSuccess(`Blocked ${count} dates!`);
    renderCalendar();
}

async function unblockDateRange() {
    const fromDate = document.getElementById('bulkFromDate').value;
    const toDate = document.getElementById('bulkToDate').value;

    if (!fromDate || !toDate) {
        toastWarning('Please select both from and to dates');
        return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (await unblockDate(dateStr)) {
            count++;
        }
    }

    toastSuccess(`Unblocked ${count} dates!`);
    renderCalendar();
}

async function blockRecurringDays() {
    const checkboxes = document.querySelectorAll('.weekday-checkbox input:checked');
    const selectedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (selectedDays.length === 0) {
        toastWarning('Select at least one weekday');
        return;
    }

    const today = new Date();
    let count = 0;

    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        if (selectedDays.includes(date.getDay())) {
            const dateStr = date.toISOString().split('T')[0];
            if (await blockDate(dateStr, 'Recurring block')) {
                count++;
            }
        }
    }

    toastSuccess(`Blocked ${count} dates for next 90 days!`);
    renderCalendar();
}

// ========================================
// MANUAL BOOKING ENTRY
// ========================================
async function openCreateBookingModal() {
    await initServices(); // Ensure services are loaded

    const select = document.getElementById('createService');
    select.innerHTML = '<option value="">Select a service...</option>' +
        Object.entries(SERVICES).map(([id, s]) => `<option value="${id}">${s.name} (₹${s.price})</option>`).join('');

    // Reset fields
    document.getElementById('createDate').value = '';
    document.getElementById('createTime').innerHTML = '<option value="">Select a date first...</option>';
    document.getElementById('createName').value = '';
    document.getElementById('createEmail').value = '';
    document.getElementById('createNotes').value = '';
    document.getElementById('createPaymentStatus').value = 'N';

    document.getElementById('createBookingModal').classList.add('show');

    // Date listener to load slots
    document.getElementById('createDate').onchange = async function () {
        const dateStr = this.value;
        const timeSelect = document.getElementById('createTime');
        const serviceId = document.getElementById('createService').value;

        // Get duration
        let duration = 30;
        if (serviceId && SERVICES[serviceId]) {
            duration = SERVICES[serviceId].duration;
        }

        timeSelect.innerHTML = '<option value="">Loading...</option>';

        // Use new function to get slots with overlap check
        const dates = await getAvailableDates(60, duration);
        const dateInfo = dates.find(d => d.date === dateStr);

        if (!dateInfo || dateInfo.availableSlots.length === 0) {
            timeSelect.innerHTML = '<option value="">No slots available</option>';
            return;
        }

        timeSelect.innerHTML = '<option value="">Select a time...</option>' +
            dateInfo.availableSlots.map(t => {
                // Find display name
                const slot = dateInfo.allSlots.find(s => s.time === t);
                return `<option value="${t}">${slot ? slot.display : t}</option>`;
            }).join('');
    };
}

function closeCreateBookingModal() {
    document.getElementById('createBookingModal').classList.remove('show');
}

async function submitManualBooking() {
    const serviceId = document.getElementById('createService').value;
    const date = document.getElementById('createDate').value;
    const time = document.getElementById('createTime').value;
    const name = document.getElementById('createName').value;
    const email = document.getElementById('createEmail').value;
    const paymentStatus = document.getElementById('createPaymentStatus').value;
    const notes = document.getElementById('createNotes').value;

    if (!serviceId || !date || !time || !name || !email) {
        toastWarning('Please fill in all required fields');
        return;
    }

    const service = SERVICES[serviceId];
    if (!service) {
        toastError('Invalid service selected');
        return;
    }

    try {
        await db.collection('bookings').add({
            serviceId,
            serviceName: service.name,
            price: service.price,
            duration: service.duration,
            date,
            time,
            userName: name,
            userEmail: email,
            notes,
            paymentStatus, // 'Y' or 'N'
            status: 'confirmed', // Admin bookings are auto-confirmed
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin'
        });

        toastSuccess('Booking created successfully!');
        closeCreateBookingModal();
        loadAllBookings();
        loadDashboardData();
    } catch (error) {
        console.error('Error creating booking:', error);
        toastError('Failed to create booking');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkAdminAccess, 500);
});

// Update on auth change
const originalUpdateAuthUI = window.updateAuthUI;
window.updateAuthUI = function (user) {
    if (originalUpdateAuthUI) originalUpdateAuthUI(user);
    checkAdminAccess();
};
