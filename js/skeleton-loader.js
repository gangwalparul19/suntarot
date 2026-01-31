// Skeleton Loader Utility
// ========================
// Provides reusable skeleton loading components

const SkeletonLoader = {
    /**
     * Create a pricing card skeleton
     */
    pricingCard() {
        return `
            <div class="pricing-card skeleton-pricing-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `;
    },

    /**
     * Create multiple pricing card skeletons
     */
    pricingGrid(count = 3) {
        return Array(count).fill(this.pricingCard()).join('');
    },

    /**
     * Create a booking card skeleton
     */
    bookingCard() {
        return `
            <div class="skeleton-booking-card">
                <div class="skeleton-header">
                    <div class="skeleton skeleton-badge"></div>
                    <div class="skeleton skeleton-date"></div>
                </div>
                <div class="skeleton skeleton-details"></div>
                <div class="skeleton skeleton-details" style="width: 80%;"></div>
                <div class="skeleton skeleton-details" style="width: 60%;"></div>
            </div>
        `;
    },

    /**
     * Create multiple booking card skeletons
     */
    bookingList(count = 5) {
        return Array(count).fill(this.bookingCard()).join('');
    },

    /**
     * Create a review card skeleton
     */
    reviewCard() {
        return `
            <div class="pricing-card skeleton-review-card">
                <div class="skeleton skeleton-stars"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 90%;"></div>
                <div class="skeleton skeleton-author"></div>
            </div>
        `;
    },

    /**
     * Create multiple review card skeletons
     */
    reviewGrid(count = 3) {
        return Array(count).fill(this.reviewCard()).join('');
    },

    /**
     * Create a stat card skeleton
     */
    statCard() {
        return `
            <div class="stat-card">
                <div class="skeleton skeleton-avatar" style="margin: 0 auto 0.5rem;"></div>
                <div class="skeleton skeleton-title" style="width: 60%; margin: 0 auto 0.5rem;"></div>
                <div class="skeleton skeleton-text" style="width: 40%; margin: 0 auto;"></div>
            </div>
        `;
    },

    /**
     * Create multiple stat card skeletons
     */
    statsGrid(count = 4) {
        return Array(count).fill(this.statCard()).join('');
    },

    /**
     * Create a customer card skeleton
     */
    customerCard() {
        return `
            <div class="customer-card">
                <div class="skeleton skeleton-avatar"></div>
                <div style="flex: 1;">
                    <div class="skeleton skeleton-title" style="width: 70%;"></div>
                    <div class="skeleton skeleton-text" style="width: 50%;"></div>
                    <div class="skeleton skeleton-text" style="width: 40%;"></div>
                </div>
            </div>
        `;
    },

    /**
     * Create multiple customer card skeletons
     */
    customerGrid(count = 6) {
        return Array(count).fill(this.customerCard()).join('');
    },

    /**
     * Show skeleton in an element
     */
    show(elementId, skeletonHtml) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = skeletonHtml;
        }
    },

    /**
     * Replace skeleton with actual content
     */
    hide(elementId, actualHtml) {
        const element = document.getElementById(elementId);
        if (element) {
            // Add fade-in animation
            element.style.opacity = '0';
            element.innerHTML = actualHtml;
            
            // Trigger reflow
            element.offsetHeight;
            
            // Fade in
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        }
    }
};

// Export for use in other scripts
window.SkeletonLoader = SkeletonLoader;
