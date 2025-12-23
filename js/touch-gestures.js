// Touch Gestures Utility
// ======================
// Swipe, pinch, and drag support for tarot cards

const TouchGestures = {
    // State
    isEnabled: true,
    touchStart: null,
    touchEnd: null,
    scale: 1,
    initialDistance: 0,

    // Configuration
    config: {
        swipeThreshold: 50,        // Minimum swipe distance
        swipeTimeout: 300,         // Max time for swipe
        pinchThreshold: 0.1,       // Minimum scale change
        doubleTapDelay: 300,       // Max delay between taps
        longPressDelay: 500        // Long press duration
    },

    /**
     * Initialize touch gestures on an element
     * @param {HTMLElement} element - Element to add gestures to
     * @param {Object} callbacks - Event callbacks
     */
    init(element, callbacks = {}) {
        if (!element) return;

        this.element = element;
        this.callbacks = callbacks;
        this.lastTap = 0;
        this.longPressTimer = null;

        // Touch events
        element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        element.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse events for desktop
        element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        element.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        element.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Double click/tap
        element.addEventListener('dblclick', (e) => this.handleDoubleTap(e));
    },

    handleTouchStart(e) {
        if (!this.isEnabled) return;

        this.touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };

        // Check for pinch gesture (two fingers)
        if (e.touches.length === 2) {
            e.preventDefault();
            this.initialDistance = this.getDistance(
                e.touches[0].clientX, e.touches[0].clientY,
                e.touches[1].clientX, e.touches[1].clientY
            );
            this.isPinching = true;
        }

        // Long press detection
        this.longPressTimer = setTimeout(() => {
            if (this.callbacks.onLongPress) {
                this.callbacks.onLongPress(e);
            }
        }, this.config.longPressDelay);

        // Double tap detection
        const now = Date.now();
        if (now - this.lastTap < this.config.doubleTapDelay) {
            this.handleDoubleTap(e);
        }
        this.lastTap = now;
    },

    handleTouchMove(e) {
        if (!this.isEnabled || !this.touchStart) return;

        clearTimeout(this.longPressTimer);

        // Handle pinch zoom
        if (e.touches.length === 2 && this.isPinching) {
            e.preventDefault();
            const currentDistance = this.getDistance(
                e.touches[0].clientX, e.touches[0].clientY,
                e.touches[1].clientX, e.touches[1].clientY
            );

            const scale = currentDistance / this.initialDistance;

            if (Math.abs(scale - 1) > this.config.pinchThreshold) {
                if (this.callbacks.onPinch) {
                    this.callbacks.onPinch(scale, e);
                }
            }
        }

        // Handle drag
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - this.touchStart.x;
            const deltaY = e.touches[0].clientY - this.touchStart.y;

            if (this.callbacks.onDrag) {
                this.callbacks.onDrag(deltaX, deltaY, e);
            }
        }
    },

    handleTouchEnd(e) {
        if (!this.isEnabled || !this.touchStart) return;

        clearTimeout(this.longPressTimer);

        this.touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
            time: Date.now()
        };

        // Check for swipe
        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const duration = this.touchEnd.time - this.touchStart.time;

        if (duration < this.config.swipeTimeout) {
            if (Math.abs(deltaX) > this.config.swipeThreshold) {
                const direction = deltaX > 0 ? 'right' : 'left';
                if (this.callbacks.onSwipe) {
                    this.callbacks.onSwipe(direction, deltaX, e);
                }
                // Specific callbacks
                if (direction === 'left' && this.callbacks.onSwipeLeft) {
                    this.callbacks.onSwipeLeft(e);
                }
                if (direction === 'right' && this.callbacks.onSwipeRight) {
                    this.callbacks.onSwipeRight(e);
                }
            }

            if (Math.abs(deltaY) > this.config.swipeThreshold) {
                const direction = deltaY > 0 ? 'down' : 'up';
                if (this.callbacks.onSwipe) {
                    this.callbacks.onSwipe(direction, deltaY, e);
                }
                // Specific callbacks
                if (direction === 'up' && this.callbacks.onSwipeUp) {
                    this.callbacks.onSwipeUp(e);
                }
                if (direction === 'down' && this.callbacks.onSwipeDown) {
                    this.callbacks.onSwipeDown(e);
                }
            }
        }

        // Reset pinch state
        this.isPinching = false;
        this.initialDistance = 0;

        // Drag end
        if (this.callbacks.onDragEnd) {
            this.callbacks.onDragEnd(deltaX, deltaY, e);
        }

        this.touchStart = null;
        this.touchEnd = null;
    },

    handleDoubleTap(e) {
        if (this.callbacks.onDoubleTap) {
            this.callbacks.onDoubleTap(e);
        }
    },

    // Mouse handlers for desktop drag
    handleMouseDown(e) {
        if (!this.isEnabled) return;

        this.isDragging = true;
        this.touchStart = {
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        };
    },

    handleMouseMove(e) {
        if (!this.isEnabled || !this.isDragging || !this.touchStart) return;

        const deltaX = e.clientX - this.touchStart.x;
        const deltaY = e.clientY - this.touchStart.y;

        if (this.callbacks.onDrag) {
            this.callbacks.onDrag(deltaX, deltaY, e);
        }
    },

    handleMouseUp(e) {
        if (!this.isDragging || !this.touchStart) return;

        const deltaX = e.clientX - this.touchStart.x;
        const deltaY = e.clientY - this.touchStart.y;

        if (this.callbacks.onDragEnd) {
            this.callbacks.onDragEnd(deltaX, deltaY, e);
        }

        this.isDragging = false;
        this.touchStart = null;
    },

    // Helper: Calculate distance between two points
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    // Enable/disable gestures
    enable() {
        this.isEnabled = true;
    },

    disable() {
        this.isEnabled = false;
    }
};

// Card-specific gesture handlers
const CardGestures = {
    /**
     * Initialize card flip on swipe
     * @param {HTMLElement} cardElement - The card element
     * @param {Function} flipCallback - Function to call when flipping
     */
    initFlipGesture(cardElement, flipCallback) {
        TouchGestures.init(cardElement, {
            onSwipeLeft: () => {
                cardElement.classList.add('swipe-left');
                setTimeout(() => {
                    flipCallback();
                    cardElement.classList.remove('swipe-left');
                }, 200);
            },
            onSwipeRight: () => {
                cardElement.classList.add('swipe-right');
                setTimeout(() => {
                    flipCallback();
                    cardElement.classList.remove('swipe-right');
                }, 200);
            },
            onDoubleTap: () => {
                flipCallback();
            }
        });
    },

    /**
     * Initialize pinch-to-zoom on card images
     * @param {HTMLElement} imageElement - The image element
     */
    initZoomGesture(imageElement) {
        let currentScale = 1;
        let initialScale = 1;

        TouchGestures.init(imageElement, {
            onPinch: (scale) => {
                currentScale = Math.min(Math.max(initialScale * scale, 0.5), 3);
                imageElement.style.transform = `scale(${currentScale})`;
            },
            onDoubleTap: () => {
                // Toggle zoom
                if (currentScale > 1) {
                    currentScale = 1;
                } else {
                    currentScale = 2;
                }
                imageElement.style.transition = 'transform 0.3s ease';
                imageElement.style.transform = `scale(${currentScale})`;
                setTimeout(() => {
                    imageElement.style.transition = '';
                }, 300);
            }
        });
    },

    /**
     * Initialize drag-to-position for cards in spread
     * @param {HTMLElement} cardElement - The card element
     * @param {Function} onPositionChange - Callback when position changes
     */
    initDragGesture(cardElement, onPositionChange) {
        let startX = 0;
        let startY = 0;
        const initialPos = { x: 0, y: 0 };

        TouchGestures.init(cardElement, {
            onDrag: (deltaX, deltaY) => {
                cardElement.style.transform = `translate(${initialPos.x + deltaX}px, ${initialPos.y + deltaY}px)`;
                cardElement.style.zIndex = '100';
            },
            onDragEnd: (deltaX, deltaY) => {
                initialPos.x += deltaX;
                initialPos.y += deltaY;
                cardElement.style.zIndex = '';

                if (onPositionChange) {
                    onPositionChange(initialPos.x, initialPos.y);
                }
            }
        });
    }
};

// CSS for swipe animations
const swipeStyles = document.createElement('style');
swipeStyles.textContent = `
    .swipe-left {
        animation: swipeLeft 0.2s ease-out;
    }
    
    .swipe-right {
        animation: swipeRight 0.2s ease-out;
    }
    
    @keyframes swipeLeft {
        0% { transform: translateX(0); }
        50% { transform: translateX(-20px); }
        100% { transform: translateX(0); }
    }
    
    @keyframes swipeRight {
        0% { transform: translateX(0); }
        50% { transform: translateX(20px); }
        100% { transform: translateX(0); }
    }
    
    /* Touch-friendly card styles */
    .touch-card {
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        cursor: grab;
    }
    
    .touch-card:active {
        cursor: grabbing;
    }
    
    /* Pinch zoom container */
    .zoom-container {
        overflow: hidden;
        touch-action: none;
    }
    
    .zoom-container img {
        transform-origin: center center;
        transition: transform 0.1s ease-out;
    }
`;
document.head.appendChild(swipeStyles);

// Export
window.TouchGestures = TouchGestures;
window.CardGestures = CardGestures;
