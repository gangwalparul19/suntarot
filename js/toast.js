// Sun Tarot Toast Notification System
// ====================================
// A lightweight toast notification utility to replace alerts

// Toast container - will be created on first use
let toastContainer = null;

// Create toast container if it doesn't exist
function createToastContainer() {
    if (toastContainer) return toastContainer;

    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    return toastContainer;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showToast(message, type = 'info', duration = 4000) {
    const container = createToastContainer();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
}

// Convenience methods
function toastSuccess(message, duration) {
    return showToast(message, 'success', duration);
}

function toastError(message, duration) {
    return showToast(message, 'error', duration);
}

function toastWarning(message, duration) {
    return showToast(message, 'warning', duration);
}

function toastInfo(message, duration) {
    return showToast(message, 'info', duration);
}

// Export for global use
window.showToast = showToast;
window.toastSuccess = toastSuccess;
window.toastError = toastError;
window.toastWarning = toastWarning;
window.toastInfo = toastInfo;
