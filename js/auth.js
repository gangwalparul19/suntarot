// Sun Tarot Authentication Module
// ================================
// Handles Google OAuth login/logout and auth state

// Current user state
let currentUser = null;

// Admin email addresses (add your admin emails here)
const ADMIN_EMAILS = [
    'gangwalparul19@gmail.com',
    'tarotsun555666@gmail.com'
    // Add more admin emails as needed
];

// Initialize authentication
function initAuth() {
    if (!window.initFirebase || !window.initFirebase()) {
        console.error('Firebase not initialized');
        return;
    }

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        currentUser = user;
        updateAuthUI(user);

        if (user) {
            console.log('User signed in:', user.email);
            // Check if user is admin and store in localStorage
            localStorage.setItem('isAdmin', ADMIN_EMAILS.includes(user.email));

            // Sync user to Firestore
            if (typeof db !== 'undefined' && db) {
                try {
                    const userRef = db.collection('users').doc(user.uid);
                    await userRef.set({
                        email: user.email,
                        displayName: user.displayName || 'User',
                        photoURL: user.photoURL || null,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                        // Build profile if new
                    }, { merge: true });
                    console.log('User profile synced to Firestore');
                } catch (e) {
                    console.error('Error syncing user profile:', e);
                }
            }

            // Load Daily Card
            if (typeof loadDailyCard === 'function') {
                loadDailyCard(user);
            }
        } else {
            console.log('User signed out');
            localStorage.removeItem('isAdmin');

            // Hide Daily Card
            if (typeof loadDailyCard === 'function') {
                loadDailyCard(null);
            }
        }
    });
}

// Sign in with Google
async function signInWithGoogle() {
    if (!isFirebaseConfigured()) {
        toastError('Firebase is not configured yet. Please set up Firebase first.');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        console.log('Signed in as:', result.user.email);
        toastSuccess(`Welcome, ${result.user.displayName}!`);
        return result.user;
    } catch (error) {
        console.error('Sign in error:', error);

        if (error.code === 'auth/popup-closed-by-user') {
            console.log('Sign in cancelled by user');
        } else if (error.code === 'auth/popup-blocked') {
            toastWarning('Popup blocked! Please allow popups for this site.');
        } else {
            toastError('Sign in failed: ' + error.message);
        }
        return null;
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        console.log('Signed out successfully');
        toastInfo('Signed out successfully');
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Update UI based on auth state
function updateAuthUI(user) {
    const authContainer = document.getElementById('authContainer');
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLink = document.getElementById('adminLink');

    if (!authContainer) return;

    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none'; // Hide old logout btn
        if (userInfo) {
            userInfo.style.display = 'flex';
            const isUserAdmin = ADMIN_EMAILS.includes(user.email);

            // Header Profile: Only Avatar
            userInfo.innerHTML = `
                <div class="user-dropdown">
                    <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'U')}" 
                         alt="Profile" 
                         class="user-avatar"
                         onclick="toggleUserDropdown()">
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div style="padding: 0.5rem 1rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 0.8rem;">
                            Signed in as<br>
                            <strong style="color: var(--color-text); font-size: 0.9rem;">${user.displayName || 'User'}</strong>
                        </div>
                        <a href="profile.html">👤 My Profile</a>
                        <a href="my-readings.html">📚 My Readings</a>
                        <a href="my-bookings.html">📅 My Bookings</a>
                        ${isUserAdmin ? '<a href="admin.html">⚙️ Admin Panel</a>' : ''}
                        <hr>
                        <a href="#" onclick="signOut(); return false;">🚪 Sign Out</a>
                    </div>
                </div>
            `;
        }

        // Hide separate admin link since it's in dropdown now
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'none';
            userInfo.innerHTML = '';
        }

        // Hide separate admin link since it's in dropdown now
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
}

// Toggle user dropdown menu
function toggleUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.user-dropdown');
    const menu = document.getElementById('userDropdownMenu');
    if (menu && dropdown && !dropdown.contains(e.target)) {
        menu.classList.remove('active');
    }
});

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if current user is admin
function isAdmin() {
    return currentUser && ADMIN_EMAILS.includes(currentUser.email);
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Require login (redirect or show message)
function requireLogin(message = 'Please sign in to continue') {
    if (!isLoggedIn()) {
        toastInfo(message);
        signInWithGoogle();
        return false;
    }
    return true;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Firebase SDK is loaded
    setTimeout(initAuth, 100);
});

// Export functions
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
window.isLoggedIn = isLoggedIn;
window.requireLogin = requireLogin;
window.toggleUserDropdown = toggleUserDropdown;
