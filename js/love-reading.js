// Love-specific card meanings
const loveMeanings = {
    "The Fool": "A new romantic adventure awaits. Be open to unexpected love connections and trust the journey ahead.",
    "The Magician": "You have the power to manifest the love you desire. Take initiative in your romantic life.",
    "The High Priestess": "Trust your intuition about this relationship. Hidden feelings are about to surface.",
    "The Empress": "Abundant love and nurturing energy surrounds you. Fertility in relationships and deep emotional connection.",
    "The Emperor": "Stability and commitment are highlighted. A protective, mature love is indicated.",
    "The Hierophant": "Traditional values in love. Consider commitment, marriage, or following established relationship paths.",
    "The Lovers": "Deep soul connection and harmony. A significant romantic choice or destined union awaits you.",
    "The Chariot": "Victory in love through determination. Take control of your romantic destiny.",
    "Strength": "Gentle patience will win hearts. Inner strength helps navigate relationship challenges.",
    "The Hermit": "Time for self-reflection in love. Understand what you truly need in a partner.",
    "Wheel of Fortune": "A fateful romantic turn is coming. Cycles of love are shifting in your favor.",
    "Justice": "Balance and fairness in relationships. Karmic connections may be at play.",
    "The Hanged Man": "Pause and see your relationship from a new perspective. Sacrifice may be needed for growth.",
    "Death": "Transformation in your love life. Old patterns ending to make room for deeper love.",
    "Temperance": "Harmony and balanced partnership. Patient blending of two souls.",
    "The Devil": "Examine unhealthy attachments. Break free from toxic patterns in relationships.",
    "The Tower": "Sudden revelations about love. Breakdowns lead to breakthroughs in relationships.",
    "The Star": "Hope and healing in love. Your romantic wishes are being aligned by the universe.",
    "The Moon": "Hidden emotions and intuitive connections. Not everything is as it appears in love.",
    "The Sun": "Joy, happiness, and successful love. Radiant relationship energy and celebration.",
    "Judgement": "A significant decision about love. Evaluate your relationships and answer your heart's calling.",
    "The World": "Completion and fulfillment in love. A relationship reaching its beautiful culmination."
};

// State
let drawnCards = [];
let flippedCount = 0;
const TOTAL_CARDS = 5;

// Shuffle deck and draw 5 cards with reversal support
function shuffleDeck() {
    console.log('Shuffling deck for love reading...');

    // Reset state
    flippedCount = 0;

    // Reset card visuals and animations
    for (let i = 1; i <= TOTAL_CARDS; i++) {
        const cardEl = document.getElementById(`card${i}`);
        if (cardEl) {
            cardEl.classList.remove('flipped', 'reversed', 'dealing');
            cardEl.style.opacity = '0';
        }
    }

    // Hide results
    const readingResult = document.getElementById('readingResult');
    if (readingResult) {
        readingResult.classList.remove('show');
    }

    // Check if majorArcana is loaded
    if (typeof majorArcana === 'undefined') {
        console.error('Card data not loaded!');
        if (typeof toastError === 'function') {
            toastError('Card data not loaded. Please refresh the page.');
        }
        return;
    }

    // Draw cards using the new function with reversal
    drawnCards = drawCards(TOTAL_CARDS);

    console.log('Drew cards:', drawnCards.map(c => `${c.name}${c.isReversed ? ' (R)' : ''}`));

    // Set card images, names, and apply animations
    for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = drawnCards[i];
        const cardEl = document.getElementById(`card${i + 1}`);
        if (!cardEl) continue;

        // Apply reversed class if needed
        if (card.isReversed) {
            cardEl.classList.add('reversed');
        }

        const imgEl = document.getElementById(`card${i + 1}Img`);
        const nameEl = document.getElementById(`card${i + 1}Name`);

        if (imgEl) imgEl.src = card.image;
        if (nameEl) nameEl.textContent = card.name;

        // Update result with reversal indication
        const resultName = document.getElementById(`result${i + 1}Name`);
        if (resultName) {
            resultName.innerHTML = card.isReversed
                ? `${card.name} <span class="reversed-badge">Reversed</span>`
                : card.name;
        }

        // Use love-specific meaning if available, otherwise use displayMeaning
        const resultMeaning = document.getElementById(`result${i + 1}Meaning`);
        if (resultMeaning) {
            const loveMeaning = loveMeanings[card.name];
            resultMeaning.textContent = card.isReversed ? card.reversedMeaning : (loveMeaning || card.meaning);
        }

        // Trigger dealing animation with stagger
        setTimeout(() => {
            cardEl.style.opacity = '1';
            cardEl.classList.add('dealing');
        }, i * 150);
    }
}

// Flip a single card with enhanced animation
function flipCard(index) {
    const cardEl = document.getElementById(`card${index + 1}`);
    if (!cardEl) return;

    if (drawnCards.length === 0) {
        console.log('No cards drawn yet!');
        return;
    }

    if (!cardEl.classList.contains('flipped')) {
        // Add flipping glow effect
        cardEl.classList.add('flipping');

        setTimeout(() => {
            cardEl.classList.add('flipped');
            cardEl.classList.remove('flipping');
        }, 100);

        flippedCount++;
        console.log(`Flipped card ${index + 1}, total flipped: ${flippedCount}`);

        // Show results when all cards are flipped
        if (flippedCount === TOTAL_CARDS) {
            setTimeout(() => {
                const readingResult = document.getElementById('readingResult');
                if (readingResult) {
                    readingResult.classList.add('show');
                    readingResult.scrollIntoView({ behavior: 'smooth' });
                }

                // Save reading to history
                if (typeof saveReadingToHistory === 'function') {
                    saveReadingToHistory(drawnCards.map(c => ({
                        ...c,
                        meaning: c.displayMeaning
                    })), 'love');
                }
            }, 800);
        }
    }
}

// Render love pricing from SERVICES config
function renderLovePricing() {
    const grid = document.getElementById('lovePricingGrid');
    if (!grid) return;

    // Check if SERVICES is defined globally
    if (typeof SERVICES === 'undefined') return;

    // Filter love category services
    const loveServices = [];
    Object.entries(SERVICES).forEach(([id, service]) => {
        if (service.category === 'love') {
            loveServices.push({ id, ...service });
        }
    });

    if (loveServices.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center">No pricing available</p>';
        return;
    }

    // Render love services - middle one is featured
    grid.innerHTML = loveServices.map((s, i) => `
        <div class="pricing-card ${i === 1 ? 'featured' : ''}">
            <h3 class="pricing-name">${s.name}</h3>
            <div class="pricing-price">Rs. ${s.price}</div>
            <ul class="pricing-features">
                <li>${s.description || ''}</li>
                <li>${s.duration} minute session</li>
                <li>Written summary</li>
            </ul>
            <a href="book-appointment.html?service=${s.id}" 
               class="btn ${i === 1 ? 'btn-primary' : 'btn-outline'}"
               ${i === 1 ? 'style="background: linear-gradient(135deg, #db7093, #d4a95d);"' : ''}
            >Book Now</a>
        </div>
    `).join('');
}

// Add click listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Love reading page loaded, initializing...');

    // Card click listeners
    for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = document.getElementById(`card${i + 1}`);
        if (card) {
            card.addEventListener('click', () => flipCard(i));
        }
    }

    // Shuffle button listener
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleDeck);
    }

    // Initial shuffle
    shuffleDeck();

    // Wait for Firebase to initialize, then load dynamic pricing
    setTimeout(async () => {
        if (typeof initFirebase === 'function') {
            initFirebase();
        }
        if (typeof initServices === 'function') {
            await initServices();
        }
        renderLovePricing();
    }, 500);

    console.log('Love reading initialization complete!');
});
