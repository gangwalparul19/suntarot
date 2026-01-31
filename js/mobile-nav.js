// Mobile Bottom Navigation
// =========================
// Adds a fixed bottom navigation bar for mobile devices

function initMobileBottomNav() {
    // Only add on mobile
    if (window.innerWidth > 768) return;

    // Check if already exists
    if (document.querySelector('.mobile-bottom-nav')) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
        { href: 'index.html', icon: '🏠', label: 'Home', pages: ['index.html', ''] },
        { href: 'reading.html', icon: '🔮', label: 'Reading', pages: ['reading.html'] },
        { href: 'love-reading.html', icon: '💕', label: 'Love', pages: ['love-reading.html'] },
        { href: 'booking.html', icon: '📅', label: 'Book', pages: ['booking.html', 'book-appointment.html'] },
        { href: 'profile.html', icon: '👤', label: 'Profile', pages: ['profile.html', 'my-readings.html', 'my-bookings.html'] }
    ];

    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';

    navItems.forEach(item => {
        const isActive = item.pages.includes(currentPage);
        const link = document.createElement('a');
        link.href = item.href;
        link.className = `mobile-nav-item ${isActive ? 'active' : ''}`;
        link.innerHTML = `
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
        `;
        nav.appendChild(link);
    });

    document.body.appendChild(nav);
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileBottomNav);
} else {
    initMobileBottomNav();
}

// Re-initialize on resize (if switching from desktop to mobile)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const existingNav = document.querySelector('.mobile-bottom-nav');
        if (window.innerWidth <= 768 && !existingNav) {
            initMobileBottomNav();
        } else if (window.innerWidth > 768 && existingNav) {
            existingNav.remove();
            document.body.style.paddingBottom = '0';
        }
    }, 250);
});
