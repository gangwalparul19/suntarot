// ========================================
// Sun Tarot - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initMobileMenu();
    initScrollProgress();
    initScrollToTop();
    initAudioToggle();
    initCardOfDay();
    initDeckShowcase();
    initSpotlight();
});

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
// Audio Toggle
// ========================================
function initAudioToggle() {
    const audioToggle = document.getElementById('audioToggle');
    const audio = document.getElementById('ambientAudio');

    if (!audioToggle || !audio) return;

    audio.volume = 0.5;

    audioToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                audioToggle.textContent = '🔊';
                audioToggle.classList.add('playing');
            }).catch(err => {
                console.error('Audio playback failed:', err);
            });
        } else {
            audio.pause();
            audioToggle.textContent = '🔇';
            audioToggle.classList.remove('playing');
        }
    });
}

// ========================================
// Card of the Day
// ========================================
function initCardOfDay() {
    const cardImage = document.getElementById('dailyCardImage');
    const cardName = document.getElementById('dailyCardName');
    const cardTitle = document.getElementById('dailyCardTitle');
    const cardMeaning = document.getElementById('dailyCardMeaning');

    if (!cardImage || !cardName) return;

    const card = getCardOfTheDay();

    cardImage.src = card.image;
    cardImage.alt = card.name;
    cardName.textContent = card.name;

    if (cardTitle) cardTitle.textContent = card.name;
    if (cardMeaning) cardMeaning.textContent = `"${card.meaning}"`;
}

// Share Card
function shareCard() {
    const card = getCardOfTheDay();
    const text = `✨ My Card of the Day: ${card.name}\n\n"${card.meaning}"\n\n🔮 Get your reading at Sun Tarot!`;

    if (navigator.share) {
        navigator.share({
            title: 'Sun Tarot - Card of the Day',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Reading copied to clipboard! Share it with your friends.');
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
