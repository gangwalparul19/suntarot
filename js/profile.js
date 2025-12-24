// Achievement definitions
const ACHIEVEMENTS = [
    { id: 'first_reading', icon: '🎴', name: 'First Steps', desc: 'Complete your first reading', check: (s) => s.totalReadings >= 1 },
    { id: '10_readings', icon: '🌟', name: 'Seeker', desc: 'Complete 10 readings', check: (s) => s.totalReadings >= 10 },
    { id: '50_readings', icon: '✨', name: 'Devoted', desc: 'Complete 50 readings', check: (s) => s.totalReadings >= 50 },
    { id: '100_readings', icon: '🔮', name: 'Oracle', desc: 'Complete 100 readings', check: (s) => s.totalReadings >= 100 },
    { id: '3_streak', icon: '🔥', name: 'On Fire', desc: '3-day reading streak', check: (s) => s.maxStreak >= 3 },
    { id: '7_streak', icon: '💫', name: 'Dedicated', desc: '7-day reading streak', check: (s) => s.maxStreak >= 7 },
    { id: '30_streak', icon: '🌙', name: 'Lunar Cycle', desc: '30-day reading streak', check: (s) => s.maxStreak >= 30 },
    { id: 'love_reader', icon: '💕', name: 'Romantic', desc: 'Complete 5 love readings', check: (s) => s.loveReadings >= 5 },
    { id: 'all_major', icon: '🎯', name: 'Collector', desc: 'Draw all 22 Major Arcana', check: (s) => s.uniqueCards >= 22 },
    { id: 'night_owl', icon: '🦉', name: 'Night Owl', desc: 'Read after midnight', check: (s) => s.hasNightReading },
    { id: 'early_bird', icon: '🌅', name: 'Early Bird', desc: 'Read before 6am', check: (s) => s.hasEarlyReading },
    { id: 'reversed_master', icon: '🔄', name: 'Reversal Master', desc: 'Get 10 reversed cards', check: (s) => s.reversedCount >= 10 }
];

// Load profile data
async function loadProfile() {
    const loginPrompt = document.getElementById('loginPrompt');
    const profileContent = document.getElementById('profileContent');

    if (!isLoggedIn()) {
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (profileContent) profileContent.style.display = 'none';
        return;
    }

    if (loginPrompt) loginPrompt.style.display = 'none';
    if (profileContent) profileContent.style.display = 'block';

    const user = auth.currentUser;

    // Set profile info
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`;
    }

    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = user.displayName || 'Tarot Reader';
    }

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = user.email;
    }

    // Load extra details (Mobile, City)
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            const userMobile = document.getElementById('userMobile');
            if (userMobile && data.mobile) userMobile.value = data.mobile;

            const userCity = document.getElementById('userCity');
            if (userCity && data.city) userCity.value = data.city;
        }
    } catch (error) {
        console.error("Error loading user details:", error);
    }

    // Load readings
    const readings = await loadReadings();
    const stats = calculateStats(readings);

    // Update stats
    const totalReadingsEl = document.getElementById('totalReadings');
    if (totalReadingsEl) totalReadingsEl.textContent = stats.totalReadings;

    const loveReadingsEl = document.getElementById('loveReadings');
    if (loveReadingsEl) loveReadingsEl.textContent = stats.loveReadings;

    const daysActiveEl = document.getElementById('daysActive');
    if (daysActiveEl) daysActiveEl.textContent = stats.uniqueDays;

    const reversedCardsEl = document.getElementById('reversedCards');
    if (reversedCardsEl) reversedCardsEl.textContent = stats.reversedPercent + '%';

    // Update streak
    const streakCountEl = document.getElementById('streakCount');
    if (streakCountEl) streakCountEl.textContent = stats.currentStreak;

    updateStreakMessage(stats.currentStreak);
    renderStreakCalendar(readings);

    // Render favorite cards
    renderFavoriteCards(stats.cardCounts);

    // Render achievements
    renderAchievements(stats);

    // Render badges
    renderBadges(stats);
}

async function loadReadings() {
    try {
        if (!db || !auth.currentUser) return [];

        const snapshot = await db.collection('readings')
            .where('userId', '==', auth.currentUser.uid)
            .get();

        const readings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));

        // Client-side sort
        return readings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
        console.error('Error loading readings:', error);
        return [];
    }
}

function calculateStats(readings) {
    const stats = {
        totalReadings: readings.length,
        loveReadings: 0,
        uniqueDays: new Set(),
        cardCounts: {},
        reversedCount: 0,
        uniqueCards: new Set(),
        currentStreak: 0,
        maxStreak: 0,
        hasNightReading: false,
        hasEarlyReading: false,
        reversedPercent: 0
    };

    let totalCards = 0;

    readings.forEach(reading => {
        if (reading.type === 'love') stats.loveReadings++;

        if (reading.createdAt) {
            const dateStr = reading.createdAt.toISOString().split('T')[0];
            stats.uniqueDays.add(dateStr);

            const hour = reading.createdAt.getHours();
            if (hour >= 0 && hour < 6) stats.hasEarlyReading = true;
            if (hour >= 0 && hour < 5) stats.hasNightReading = true;
        }

        if (reading.cards) {
            reading.cards.forEach(card => {
                stats.cardCounts[card.name] = (stats.cardCounts[card.name] || 0) + 1;
                stats.uniqueCards.add(card.name);
                totalCards++;
                if (card.isReversed) stats.reversedCount++;
            });
        }
    });

    stats.uniqueDays = stats.uniqueDays.size;
    stats.uniqueCards = stats.uniqueCards.size;
    stats.reversedPercent = totalCards > 0 ? Math.round((stats.reversedCount / totalCards) * 100) : 0;

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    const readingDates = new Set(readings.map(r => r.createdAt?.toISOString().split('T')[0]).filter(Boolean));

    let streak = 0;
    let date = new Date();
    while (true) {
        const dateStr = date.toISOString().split('T')[0];
        if (readingDates.has(dateStr)) {
            streak++;
            date.setDate(date.getDate() - 1);
        } else if (dateStr === today) {
            // Today hasn't happened yet, check yesterday
            date.setDate(date.getDate() - 1);
        } else {
            break;
        }
    }
    stats.currentStreak = streak;

    // Calculate max streak
    const sortedDates = Array.from(readingDates).sort();
    let maxStreak = 0;
    let currentMax = 0;
    let prevDate = null;

    sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        if (prevDate) {
            const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                currentMax++;
            } else {
                currentMax = 1;
            }
        } else {
            currentMax = 1;
        }
        maxStreak = Math.max(maxStreak, currentMax);
        prevDate = date;
    });
    stats.maxStreak = maxStreak;

    return stats;
}

function updateStreakMessage(streak) {
    const msg = document.getElementById('streakMessage');
    if (!msg) return;

    if (streak === 0) {
        msg.textContent = 'Do a reading today to start your streak!';
    } else if (streak < 3) {
        msg.textContent = 'Keep it going! A few more days to unlock achievements.';
    } else if (streak < 7) {
        msg.textContent = 'Great progress! You\'re building a habit.';
    } else if (streak < 30) {
        msg.textContent = 'Amazing dedication! Keep the flame alive.';
    } else {
        msg.textContent = 'Incredible! You\'re a true oracle.';
    }
}

function renderStreakCalendar(readings) {
    const calendar = document.getElementById('streakCalendar');
    if (!calendar) return;

    const readingDates = new Set(readings.map(r => r.createdAt?.toISOString().split('T')[0]).filter(Boolean));

    let html = '';
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const isActive = readingDates.has(dateStr);
        const isToday = i === 0;

        html += `<div class="streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}" 
                      title="${date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}"></div>`;
    }

    calendar.innerHTML = html;
}

function renderFavoriteCards(cardCounts) {
    const container = document.getElementById('favoriteCards');
    if (!container) return;

    const sorted = Object.entries(cardCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    if (sorted.length === 0) {
        container.innerHTML = '<p class="text-muted">Do more readings to see your patterns!</p>';
        return;
    }

    container.innerHTML = sorted.map(([name, count]) => {
        const card = typeof majorArcana !== 'undefined' ? majorArcana.find(c => c.name === name) : null;
        return `
            <div class="favorite-card">
                <img src="${card?.image || ''}" alt="${name}" loading="lazy">
                <div class="favorite-card-name">${name}</div>
                <div class="favorite-card-count">${count} times</div>
            </div>
        `;
    }).join('');
}

function renderAchievements(stats) {
    const container = document.getElementById('achievements');
    if (!container) return;

    container.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = ach.check(stats);
        return `
            <div class="achievement ${unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
            </div>
        `;
    }).join('');
}

function renderBadges(stats) {
    const container = document.getElementById('profileBadges');
    if (!container) return;

    const badges = [];

    if (stats.totalReadings >= 100) badges.push({ icon: '🔮', text: 'Oracle' });
    else if (stats.totalReadings >= 50) badges.push({ icon: '✨', text: 'Devoted' });
    else if (stats.totalReadings >= 10) badges.push({ icon: '🌟', text: 'Seeker' });

    if (stats.maxStreak >= 30) badges.push({ icon: '🌙', text: 'Monthly Streak' });
    else if (stats.maxStreak >= 7) badges.push({ icon: '💫', text: 'Weekly Streak' });

    if (stats.uniqueCards >= 22) badges.push({ icon: '🎯', text: 'Collector' });

    container.innerHTML = badges.map(b =>
        `<span class="profile-badge">${b.icon} ${b.text}</span>`
    ).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadProfile, 500);
});

// Update on auth change
if (typeof window !== 'undefined') {
    const originalUpdateAuthUI = window.updateAuthUI;
    window.updateAuthUI = function (user) {
        if (originalUpdateAuthUI) originalUpdateAuthUI(user);
        loadProfile();
    };
}

// Save Profile Details
async function saveProfileDetails() {
    if (!auth.currentUser) return;

    const mobileInput = document.getElementById('userMobile');
    const cityInput = document.getElementById('userCity');
    const mobile = mobileInput ? mobileInput.value : '';
    const city = cityInput ? cityInput.value : '';
    const btn = document.querySelector('.profile-details-form button');

    if (!mobile && !city) {
        if (typeof toastError === 'function') toastError('Please enter details to save');
        return;
    }

    try {
        if (btn) {
            btn.textContent = 'Saving...';
            btn.disabled = true;
        }

        await db.collection('users').doc(auth.currentUser.uid).set({
            mobile: mobile,
            city: city,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        if (typeof toastSuccess === 'function') toastSuccess('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        if (typeof toastError === 'function') toastError('Error saving profile');
    } finally {
        if (btn) {
            btn.textContent = 'Save Details';
            btn.disabled = false;
        }
    }
}
