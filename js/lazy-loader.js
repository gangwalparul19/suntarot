// Lazy Loader Utility
// ====================
// Dynamically loads non-critical scripts for better performance

const LazyLoader = {
    loaded: new Set(),
    loading: new Map(),

    /**
     * Load a script dynamically
     * @param {string} src - Script source URL
     * @param {Object} options - Optional configuration
     * @returns {Promise} - Resolves when script is loaded
     */
    loadScript(src, options = {}) {
        // Return if already loaded
        if (this.loaded.has(src)) {
            return Promise.resolve();
        }

        // Return existing promise if currently loading
        if (this.loading.has(src)) {
            return this.loading.get(src);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = options.async !== false;
            script.defer = options.defer === true;

            if (options.type) {
                script.type = options.type;
            }

            script.onload = () => {
                this.loaded.add(src);
                this.loading.delete(src);
                console.log(`[LazyLoader] Loaded: ${src}`);
                resolve();
            };

            script.onerror = () => {
                this.loading.delete(src);
                console.error(`[LazyLoader] Failed to load: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });

        this.loading.set(src, promise);
        return promise;
    },

    /**
     * Load a CSS stylesheet dynamically
     * @param {string} href - Stylesheet URL
     * @returns {Promise} - Resolves when stylesheet is loaded
     */
    loadStyle(href) {
        if (this.loaded.has(href)) {
            return Promise.resolve();
        }

        if (this.loading.has(href)) {
            return this.loading.get(href);
        }

        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            link.onload = () => {
                this.loaded.add(href);
                this.loading.delete(href);
                console.log(`[LazyLoader] Loaded style: ${href}`);
                resolve();
            };

            link.onerror = () => {
                this.loading.delete(href);
                reject(new Error(`Failed to load stylesheet: ${href}`));
            };

            document.head.appendChild(link);
        });

        this.loading.set(href, promise);
        return promise;
    },

    /**
     * Load multiple scripts in order
     * @param {string[]} scripts - Array of script URLs
     * @returns {Promise} - Resolves when all scripts are loaded
     */
    async loadScriptsSequential(scripts) {
        for (const src of scripts) {
            await this.loadScript(src);
        }
    },

    /**
     * Load multiple scripts in parallel
     * @param {string[]} scripts - Array of script URLs
     * @returns {Promise} - Resolves when all scripts are loaded
     */
    loadScriptsParallel(scripts) {
        return Promise.all(scripts.map(src => this.loadScript(src)));
    },

    /**
     * Load a module when an element becomes visible
     * @param {string} selector - CSS selector for trigger element
     * @param {Function} callback - Function to call when visible
     */
    loadOnVisible(selector, callback) {
        const element = document.querySelector(selector);
        if (!element) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(element);
        } else {
            // Fallback for older browsers
            callback();
        }
    },

    /**
     * Load a module when user interacts with the page
     * @param {Function} callback - Function to call on first interaction
     */
    loadOnInteraction(callback) {
        const events = ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'];

        const handler = () => {
            callback();
            events.forEach(event => {
                window.removeEventListener(event, handler);
            });
        };

        events.forEach(event => {
            window.addEventListener(event, handler, { once: true, passive: true });
        });
    },

    /**
     * Load a module after a delay
     * @param {number} ms - Milliseconds to wait
     * @param {Function} callback - Function to call after delay
     */
    loadAfterDelay(ms, callback) {
        setTimeout(callback, ms);
    },

    /**
     * Load a module when the browser is idle
     * @param {Function} callback - Function to call when idle
     */
    loadOnIdle(callback) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 3000 });
        } else {
            // Fallback: load after 200ms
            setTimeout(callback, 200);
        }
    }
};

// Common scripts to lazy load
const LAZY_SCRIPTS = {
    chartjs: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
    share: '/js/share.js',
    reviews: '/js/reviews.js',
    booking: '/js/booking.js'
};

// Helper function for pages
function loadChartsWhenNeeded() {
    return LazyLoader.loadScript(LAZY_SCRIPTS.chartjs);
}

function loadShareWhenNeeded() {
    return LazyLoader.loadScript(LAZY_SCRIPTS.share);
}

// Export
window.LazyLoader = LazyLoader;
window.LAZY_SCRIPTS = LAZY_SCRIPTS;
window.loadChartsWhenNeeded = loadChartsWhenNeeded;
window.loadShareWhenNeeded = loadShareWhenNeeded;
