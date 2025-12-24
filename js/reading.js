// State
let drawnCards = [];
let flippedCount = 0;

// Shuffle deck and draw 3 cards with reversal support
function shuffleDeck() {
    console.log('Shuffling deck...');

    // Reset state
    flippedCount = 0;

    // Get all card elements
    const cardElements = [
        document.getElementById('card1'),
        document.getElementById('card2'),
        document.getElementById('card3')
    ];

    // Reset card visuals
    cardElements.forEach(cardEl => {
        cardEl.classList.remove('flipped', 'reversed', 'dealing', 'revealed', 'shuffling');
        cardEl.style.opacity = '1';
    });

    // Hide results
    document.getElementById('readingResult').classList.remove('show');
    const shareBtn = document.getElementById('shareReadingBtn');
    if (shareBtn) shareBtn.remove();

    // Check if majorArcana is loaded
    if (typeof majorArcana === 'undefined') {
        console.error('Card data not loaded!');
        toastError('Card data not loaded. Please refresh the page.');
        return;
    }

    // Play shuffle animation first
    cardElements.forEach((cardEl, i) => {
        setTimeout(() => {
            cardEl.classList.add('shuffling');
        }, i * 100);
    });

    // After shuffle animation, deal the cards
    setTimeout(() => {
        // Remove shuffle class and hide cards
        cardElements.forEach(cardEl => {
            cardEl.classList.remove('shuffling');
            cardEl.style.opacity = '0';
        });

        // Draw cards using the new function with reversal
        drawnCards = drawCards(3);
        console.log('Drew cards:', drawnCards.map(c => `${c.name}${c.isReversed ? ' (R)' : ''}`));

        // Set card images, names, and apply animations
        for (let i = 0; i < 3; i++) {
            const card = drawnCards[i];
            const cardEl = cardElements[i];

            // Apply reversed class if needed
            if (card.isReversed) {
                cardEl.classList.add('reversed');
            }

            document.getElementById(`card${i + 1}Img`).src = card.image;
            document.getElementById(`card${i + 1}Name`).textContent = card.name;

            // Update result with reversal indication
            const resultName = document.getElementById(`result${i + 1}Name`);
            resultName.innerHTML = card.isReversed
                ? `${card.name} <span class="reversed-badge">Reversed</span>`
                : card.name;
            document.getElementById(`result${i + 1}Meaning`).textContent = card.displayMeaning;

            // Trigger dealing animation with stagger
            setTimeout(() => {
                cardEl.style.opacity = '1';
                cardEl.classList.add('dealing');
            }, i * 250);
        }
    }, 800); // Wait for shuffle animation
}

// Flip a single card with enhanced animation
function flipCard(index) {
    const cardEl = document.getElementById(`card${index + 1}`);

    if (drawnCards.length === 0) {
        console.log('No cards drawn yet!');
        return;
    }

    if (!cardEl.classList.contains('flipped')) {
        // Add click ripple effect
        cardEl.classList.add('clicked');
        setTimeout(() => cardEl.classList.remove('clicked'), 500);

        // Add flipping glow effect
        cardEl.classList.add('flipping');

        // Flip the card with slight delay for ripple
        setTimeout(() => {
            cardEl.classList.add('flipped');

            // Add sparkle reveal effect
            setTimeout(() => {
                cardEl.classList.add('revealed');
                cardEl.classList.remove('flipping');
                // Remove sparkle after animation
                setTimeout(() => cardEl.classList.remove('revealed'), 600);
            }, 400);
        }, 150);

        flippedCount++;
        console.log(`Flipped card ${index + 1}, total flipped: ${flippedCount}`);

        // Show results when all cards are flipped
        if (flippedCount === 3) {
            setTimeout(() => {
                document.getElementById('readingResult').classList.add('show');
                document.getElementById('readingResult').scrollIntoView({ behavior: 'smooth' });

                // Save reading to history (include reversal info)
                if (typeof saveReadingToHistory === 'function') {
                    saveReadingToHistory(drawnCards.map(c => ({
                        ...c,
                        meaning: c.displayMeaning
                    })), 'reading');
                }

                // Show share button
                showShareButton();
            }, 1000);
        }
    }
}

// Add click listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, initializing...');

    // Card click listeners
    document.getElementById('card1').addEventListener('click', () => flipCard(0));
    document.getElementById('card2').addEventListener('click', () => flipCard(1));
    document.getElementById('card3').addEventListener('click', () => flipCard(2));

    // Touch gesture support for cards
    if (typeof CardGestures !== 'undefined') {
        CardGestures.initFlipGesture(document.getElementById('card1'), () => flipCard(0));
        CardGestures.initFlipGesture(document.getElementById('card2'), () => flipCard(1));
        CardGestures.initFlipGesture(document.getElementById('card3'), () => flipCard(2));
        console.log('Touch gestures initialized!');
    }

    // Shuffle button listener
    document.getElementById('shuffleBtn').addEventListener('click', shuffleDeck);

    // Initial shuffle
    shuffleDeck();

    console.log('Initialization complete!');
});

function showShareButton() {
    const resultDiv = document.getElementById('readingResult');
    if (!document.getElementById('shareReadingBtn')) {
        const shareHtml = `
            <div id="shareReadingBtn" style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
                <p class="text-muted" style="margin-bottom: 1rem;">Share your reading with friends!</p>
                <button class="btn btn-primary" onclick="shareReading(drawnCards, 'reading')" style="margin-right: 0.5rem;">📤 Share Reading</button>
                <a href="my-readings.html" class="btn btn-outline">📚 View History</a>
            </div>
        `;
        resultDiv.insertAdjacentHTML('beforeend', shareHtml);
    }
}
