// Push Notifications Utility
// ==========================
// Handles push notification permissions and scheduling

const PushNotifications = {
    isSupported: 'Notification' in window && 'serviceWorker' in navigator,
    permission: null,

    /**
     * Check if notifications are supported and get permission
     * @returns {Promise<boolean>}
     */
    async init() {
        if (!this.isSupported) {
            console.log('[Push] Notifications not supported');
            return false;
        }

        this.permission = Notification.permission;
        console.log('[Push] Current permission:', this.permission);

        return this.permission === 'granted';
    },

    /**
     * Request notification permission
     * @returns {Promise<boolean>}
     */
    async requestPermission() {
        if (!this.isSupported) return false;

        try {
            const result = await Notification.requestPermission();
            this.permission = result;
            console.log('[Push] Permission result:', result);

            if (result === 'granted') {
                this.showWelcomeNotification();
                return true;
            }
            return false;
        } catch (error) {
            console.error('[Push] Permission error:', error);
            return false;
        }
    },

    /**
     * Show a local notification
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     */
    async show(title, options = {}) {
        if (!this.isSupported || this.permission !== 'granted') {
            console.log('[Push] Cannot show notification - not permitted');
            return;
        }

        const defaultOptions = {
            icon: '/images/icons/icon-192.png',
            badge: '/images/icons/icon-72.png',
            vibrate: [100, 50, 100],
            requireInteraction: false,
            silent: false,
            tag: 'sun-tarot',
            renotify: false,
            ...options
        };

        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, defaultOptions);
            console.log('[Push] Notification shown:', title);
        } catch (error) {
            // Fallback to regular Notification API
            new Notification(title, defaultOptions);
        }
    },

    /**
     * Show welcome notification after permission granted
     */
    showWelcomeNotification() {
        this.show('✨ Notifications Enabled!', {
            body: 'You\'ll now receive daily card reminders and booking updates.',
            tag: 'welcome'
        });
    },

    /**
     * Show daily reading reminder
     */
    showDailyReminder() {
        this.show('🔮 Time for Your Daily Reading', {
            body: 'The cards await you. What wisdom will they reveal today?',
            tag: 'daily-reminder',
            data: { url: '/reading.html' },
            actions: [
                { action: 'read', title: 'Draw Cards' },
                { action: 'dismiss', title: 'Later' }
            ]
        });
    },

    /**
     * Show booking reminder
     * @param {Object} booking - Booking details
     */
    showBookingReminder(booking) {
        this.show('📅 Upcoming Reading Session', {
            body: `Your ${booking.serviceName} is scheduled for ${booking.date} at ${booking.time}`,
            tag: 'booking-reminder',
            data: { url: '/my-bookings.html', bookingId: booking.id }
        });
    },

    /**
     * Show streak reminder
     * @param {number} streakDays - Current streak count
     */
    showStreakReminder(streakDays) {
        this.show('🔥 Keep Your Streak Alive!', {
            body: `You have a ${streakDays}-day reading streak. Don't break it!`,
            tag: 'streak-reminder',
            data: { url: '/reading.html' }
        });
    },

    /**
     * Schedule a notification (using localStorage for simple scheduling)
     * @param {string} id - Unique notification ID
     * @param {number} delayMs - Delay in milliseconds
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     */
    schedule(id, delayMs, title, options = {}) {
        // Store scheduled notification
        const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '{}');
        scheduled[id] = {
            time: Date.now() + delayMs,
            title,
            options
        };
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));

        // Set timeout (only works while app is open)
        setTimeout(() => {
            this.show(title, options);
            this.clearScheduled(id);
        }, delayMs);
    },

    /**
     * Clear a scheduled notification
     * @param {string} id - Notification ID
     */
    clearScheduled(id) {
        const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '{}');
        delete scheduled[id];
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
    },

    /**
     * Check and show any due scheduled notifications
     */
    checkScheduled() {
        const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '{}');
        const now = Date.now();

        Object.entries(scheduled).forEach(([id, notification]) => {
            if (notification.time <= now) {
                this.show(notification.title, notification.options);
                this.clearScheduled(id);
            }
        });
    },

    /**
     * Set daily reminder time
     * @param {number} hour - Hour (0-23)
     * @param {number} minute - Minute (0-59)
     */
    setDailyReminderTime(hour, minute) {
        localStorage.setItem('dailyReminderTime', JSON.stringify({ hour, minute }));
        this.scheduleDailyReminder();
    },

    /**
     * Schedule daily reminder for tomorrow
     */
    scheduleDailyReminder() {
        const savedTime = JSON.parse(localStorage.getItem('dailyReminderTime') || '{"hour": 9, "minute": 0}');

        const now = new Date();
        const reminderTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            savedTime.hour,
            savedTime.minute
        );

        // If time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const delay = reminderTime - now;
        this.schedule('daily-reminder', delay, '🔮 Time for Your Daily Reading', {
            body: 'The cards await you. What wisdom will they reveal today?',
            data: { url: '/reading.html' }
        });
    }
};

// UI Component for notification settings
const NotificationSettings = {
    /**
     * Render notification settings UI
     * @param {string} containerId - Container element ID
     */
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const hasPermission = PushNotifications.permission === 'granted';
        const savedTime = JSON.parse(localStorage.getItem('dailyReminderTime') || '{"hour": 9, "minute": 0}');
        const dailyEnabled = localStorage.getItem('dailyReminderEnabled') === 'true';

        container.innerHTML = `
            <div class="notification-settings" style="background: var(--color-card); padding: 1.5rem; border-radius: 0.75rem; border: 1px solid var(--color-border);">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">🔔 Notification Settings</h3>
                
                ${!PushNotifications.isSupported ? `
                    <p class="text-muted">Notifications are not supported in your browser.</p>
                ` : !hasPermission ? `
                    <p class="text-muted mb-md">Enable notifications to receive daily reading reminders and booking updates.</p>
                    <button class="btn btn-primary" onclick="enableNotifications()">Enable Notifications</button>
                ` : `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <span>Daily Reading Reminder</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="dailyReminderToggle" ${dailyEnabled ? 'checked' : ''} onchange="toggleDailyReminder(this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div id="reminderTimeSection" style="display: ${dailyEnabled ? 'block' : 'none'};">
                        <label class="text-muted" style="display: block; margin-bottom: 0.5rem;">Reminder Time</label>
                        <input type="time" id="reminderTime" value="${String(savedTime.hour).padStart(2, '0')}:${String(savedTime.minute).padStart(2, '0')}" 
                               onchange="updateReminderTime()" 
                               style="padding: 0.5rem; border-radius: 0.5rem; border: 1px solid var(--color-border); background: var(--color-background); color: var(--color-text);">
                    </div>
                    
                    <button class="btn btn-outline" style="margin-top: 1rem;" onclick="testNotification()">Test Notification</button>
                `}
            </div>
        `;
    }
};

// Global functions for UI
window.enableNotifications = async function () {
    const granted = await PushNotifications.requestPermission();
    if (granted) {
        toastSuccess('Notifications enabled!');
        NotificationSettings.render('notificationSettings');
    } else {
        toastWarning('Notification permission denied');
    }
};

window.toggleDailyReminder = function (enabled) {
    localStorage.setItem('dailyReminderEnabled', enabled);
    document.getElementById('reminderTimeSection').style.display = enabled ? 'block' : 'none';

    if (enabled) {
        PushNotifications.scheduleDailyReminder();
        toastSuccess('Daily reminder enabled!');
    } else {
        PushNotifications.clearScheduled('daily-reminder');
        toastInfo('Daily reminder disabled');
    }
};

window.updateReminderTime = function () {
    const timeInput = document.getElementById('reminderTime');
    const [hour, minute] = timeInput.value.split(':').map(Number);
    PushNotifications.setDailyReminderTime(hour, minute);
    toastSuccess('Reminder time updated!');
};

window.testNotification = function () {
    PushNotifications.show('✨ Test Notification', {
        body: 'Notifications are working! You will receive reading reminders.',
        tag: 'test'
    });
};

// Toggle switch CSS
const toggleStyles = document.createElement('style');
toggleStyles.textContent = `
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 28px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #333;
        transition: 0.3s;
        border-radius: 28px;
    }
    
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }
    
    .toggle-switch input:checked + .toggle-slider {
        background-color: var(--color-primary, #d4a95d);
    }
    
    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(22px);
    }
`;
document.head.appendChild(toggleStyles);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    PushNotifications.init();
    PushNotifications.checkScheduled();
});

// Export
window.PushNotifications = PushNotifications;
window.NotificationSettings = NotificationSettings;
