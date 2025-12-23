// ========================================
// Sun Tarot - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    initLazyLoading();
    initStars();
    initMobileMenu();
    initScrollProgress();
    initScrollToTop();
    initDeckShowcase();
    initSpotlight();
});

// ========================================
// Service Worker Registration
// ========================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('[Main] Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content available, show update notification
                                console.log('[Main] New content available, refresh to update');
                            }
                        });
                    });
                })
                .catch(err => {
                    console.log('[Main] Service Worker registration failed:', err);
                });
        });
    }
}

// ========================================
// Lazy Loading Images
// ========================================
function initLazyLoading() {
    // Add loading="lazy" to all images without it
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    // Add loaded class when images finish loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // Use Intersection Observer for custom lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================================
// Starry Background
// ========================================
function initStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });
}

// ========================================
// Scroll Progress
// ========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        progressBar.style.transform = `scaleX(${progress})`;
    });
}

// ========================================
// Scroll to Top
// ========================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}



// ========================================
// Card of the Day
// ========================================
// ========================================
// Card of the Day (Authenticated & Persistent)
// ========================================
async function loadDailyCard(user) {
    const section = document.getElementById('cardOfDaySection');
    if (!section) return;

    if (!user) {
        section.style.display = 'none';
        return;
    }

    // Show section
    section.style.display = 'block';

    const today = new Date().toDateString(); // e.g., "Tue Dec 23 2025"
    const userRef = db.collection('users').doc(user.uid);

    try {
        const doc = await userRef.get();
        let data = doc.data() || {};
        let cardIndex;

        if (data.dailyCard && data.dailyCard.date === today) {
            // Use existing card
            cardIndex = data.dailyCard.cardIndex;
            console.log('Loaded persistent daily card:', cardIndex);
        } else {
            // Pick new card
            cardIndex = Math.floor(Math.random() * majorArcana.length);
            await userRef.set({
                dailyCard: {
                    date: today,
                    cardIndex: cardIndex
                }
            }, { merge: true });
            console.log('Generated new daily card:', cardIndex);
        }

        renderDailyCard(cardIndex, user);
    } catch (e) {
        console.error('Error loading daily card:', e);
        // Fallback to random if offline/error, but don't save to avoid sync issues
        renderDailyCard(Math.floor(Math.random() * majorArcana.length), user);
    }
}

function renderDailyCard(index, user) {
    const card = majorArcana[index];
    const container = document.getElementById('dailyCardContainer');
    const message = document.getElementById('dailyCardMessage');

    if (container) {
        container.innerHTML = `
            <div class="tarot-card" onclick="openCardModal(${index})" style="cursor: pointer; max-width: 200px; margin: 0 auto;">
                <img src="${card.image}" alt="${card.name}">
            </div>
            <h3 style="margin-top: 1rem; color: var(--color-primary);">${card.name}</h3>
        `;
    }

    if (message) {
        message.innerHTML = `
            <p>"${card.meaning}"</p>
            <button onclick="shareDailyCard(${index})" class="btn btn-outline" style="margin-top: 1rem; font-size: 0.9rem;">
                Share Reading 📤
            </button>
        `;
    }
}

function shareDailyCard(index) {
    const card = majorArcana[index];
    const text = `✨ My Card of the Day on Sun Tarot: ${card.name}\n\n"${card.meaning}"\n\n🔮 Discover yours at: https://suntarot.web.app`;

    if (navigator.share) {
        navigator.share({
            title: 'Sun Tarot - Card of the Day',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Reading copied to clipboard!');
        });
    }
}

// ========================================
// Deck Showcase (Scrolling Cards)
// ========================================
function initDeckShowcase() {
    const deckTrack = document.getElementById('deckTrack');
    if (!deckTrack) return;

    // Create cards twice for infinite scroll effect
    const cards = [...majorArcana, ...majorArcana];

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'deck-card';
        cardEl.innerHTML = `<img src="${card.image}" alt="${card.name}" loading="lazy">`;
        deckTrack.appendChild(cardEl);
    });
}

// ========================================
// Spotlight Effect (Learn Page)
// ========================================
function initSpotlight() {
    const cardGrid = document.querySelector('.card-grid');
    if (!cardGrid) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight';
    cardGrid.appendChild(spotlight);

    cardGrid.addEventListener('mousemove', (e) => {
        const rect = cardGrid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(212, 169, 93, 0.1), transparent 40%)`;
    });
}

// ========================================
// Card Modal (Learn Page)
// ========================================
function openCardModal(cardIndex) {
    const card = majorArcana[cardIndex];
    const modal = document.getElementById('cardModal');

    if (!modal || !card) return;

    document.getElementById('modalCardImage').src = card.image;
    document.getElementById('modalCardName').textContent = card.name;
    document.getElementById('modalCardMeaning').textContent = card.meaning;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCardModal() {
    const modal = document.getElementById('cardModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeCardModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCardModal();
    }
});

// ========================================
// 3D Tilt Effect
// ========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.tarot-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}
