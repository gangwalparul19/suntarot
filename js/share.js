// Sun Tarot Share Utility
// ========================
// Enhanced social sharing with image generation

// Share a reading to various platforms
function shareReading(cards, spreadType = 'reading') {
    const text = generateShareText(cards, spreadType);
    const url = window.location.origin;

    // Check for native share API
    if (navigator.share) {
        navigator.share({
            title: 'My Sun Tarot Reading',
            text: text,
            url: url
        }).catch(err => console.log('Share cancelled:', err));
        return;
    }

    // Fallback: show share modal
    showShareModal(text, url, cards, spreadType);
}

// Generate share text
function generateShareText(cards, spreadType) {
    const cardNames = cards.map(c => {
        const name = c.name || c;
        const reversed = c.isReversed ? ' (Reversed)' : '';
        return name + reversed;
    }).join(', ');

    const messages = {
        'reading': `🔮 My Tarot Reading: ${cardNames}\n\nDiscover your path with Sun Tarot!`,
        'love': `💕 My Love Reading: ${cardNames}\n\nUnlock the secrets of your heart!`,
        'daily': `☀️ My Card of the Day: ${cardNames}\n\nWhat does the universe have in store for you?`
    };

    return messages[spreadType] || messages['reading'];
}

// Show enhanced share modal with image generation
function showShareModal(text, url, cards = [], spreadType = 'reading') {
    // Remove existing modal
    const existing = document.getElementById('shareModal');
    if (existing) existing.remove();

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto;">
            <div style="background: var(--color-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 2rem; max-width: 500px; width: 100%; text-align: center;">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Share Your Reading</h3>
                
                <!-- Generated Image Preview -->
                <div id="shareImageContainer" style="margin-bottom: 1.5rem; display: none;">
                    <canvas id="shareCanvas" style="max-width: 100%; border-radius: 0.5rem; border: 1px solid var(--color-border);"></canvas>
                </div>
                
                <p style="color: var(--color-text-muted); margin-bottom: 1.5rem; font-size: 0.875rem;">${text.substring(0, 100)}...</p>
                
                <!-- Image Generation Buttons -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;">
                    <button onclick="generateShareImage('${spreadType}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        🖼️ Create Image
                    </button>
                    <button onclick="downloadShareImage()" id="downloadBtn" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem; display: none;">
                        ⬇️ Download
                    </button>
                </div>
                
                <!-- Social Share Buttons -->
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
                    <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" 
                       style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #25D366; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                        📱 WhatsApp
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank"
                       style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #1DA1F2; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                        🐦 Twitter
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}" target="_blank"
                       style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #4267B2; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                        👍 Facebook
                    </a>
                </div>
                
                <!-- Instagram Story Instructions -->
                <div id="instagramInstructions" style="background: var(--color-background); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; display: none;">
                    <p style="color: var(--color-primary); font-weight: 600; margin-bottom: 0.5rem;">📸 Share to Instagram</p>
                    <p style="color: var(--color-text-muted); font-size: 0.75rem;">
                        1. Click "Create Image" above<br>
                        2. Download the image<br>
                        3. Open Instagram → Stories → Add image
                    </p>
                </div>
                
                <div style="background: var(--color-background); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <input type="text" value="${url}" readonly id="shareUrlInput"
                           style="width: 100%; background: transparent; border: none; color: var(--color-text); text-align: center; font-size: 0.875rem;">
                </div>
                
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                    <button onclick="copyShareUrl()" class="btn btn-outline" style="padding: 0.5rem 1rem;">📋 Copy Link</button>
                    <button onclick="closeShareModal()" class="btn btn-outline" style="padding: 0.5rem 1rem;">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store cards data for image generation
    window._shareCards = cards;
    window._shareSpreadType = spreadType;
}

// Generate shareable card image using Canvas
async function generateShareImage(spreadType = 'reading') {
    const cards = window._shareCards || [];
    if (cards.length === 0) {
        toastWarning('No cards to generate image');
        return;
    }

    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size (Instagram story size: 1080x1920 for stories, or 1080x1080 for posts)
    const isStory = cards.length <= 3;
    canvas.width = 1080;
    canvas.height = isStory ? 1920 : 1080;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add stars
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(212, 169, 93, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Title
    ctx.fillStyle = '#d4a95d';
    ctx.font = 'bold 60px Playfair Display, serif';
    ctx.textAlign = 'center';

    const title = spreadType === 'love' ? '💕 Love Reading' : spreadType === 'daily' ? '☀️ Card of the Day' : '🔮 My Tarot Reading';
    ctx.fillText(title, canvas.width / 2, isStory ? 200 : 120);

    // Load and draw card images
    const cardWidth = Math.min(280, (canvas.width - 100) / cards.length);
    const cardHeight = cardWidth * 1.5;
    const startX = (canvas.width - (cardWidth * cards.length + 30 * (cards.length - 1))) / 2;
    const cardY = isStory ? 400 : 200;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const x = startX + i * (cardWidth + 30);

        // Card background
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#d4a95d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardWidth, cardHeight, 10);
        ctx.fill();
        ctx.stroke();

        // Try to load and draw card image
        try {
            const img = await loadImage(card.image);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x + 5, cardY + 5, cardWidth - 10, cardHeight - 10, 8);
            ctx.clip();

            if (card.isReversed) {
                ctx.translate(x + cardWidth / 2, cardY + cardHeight / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(img, -cardWidth / 2 + 5, -cardHeight / 2 + 5, cardWidth - 10, cardHeight - 10);
            } else {
                ctx.drawImage(img, x + 5, cardY + 5, cardWidth - 10, cardHeight - 10);
            }
            ctx.restore();
        } catch (e) {
            // Fallback: draw card name
            ctx.fillStyle = '#d4a95d';
            ctx.font = '24px PT Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(card.name || 'Card', x + cardWidth / 2, cardY + cardHeight / 2);
        }

        // Card name below
        ctx.fillStyle = '#f5f5f5';
        ctx.font = '28px PT Sans, sans-serif';
        ctx.textAlign = 'center';
        const displayName = (card.name || 'Card') + (card.isReversed ? ' ↩️' : '');
        ctx.fillText(displayName, x + cardWidth / 2, cardY + cardHeight + 50);
    }

    // Quote/meaning section
    if (cards.length === 1 && cards[0].meaning) {
        const meaning = cards[0].displayMeaning || cards[0].meaning;
        const truncated = meaning.length > 150 ? meaning.substring(0, 150) + '...' : meaning;

        ctx.fillStyle = '#a3a3a3';
        ctx.font = 'italic 28px PT Sans, sans-serif';
        ctx.textAlign = 'center';

        // Word wrap
        const words = truncated.split(' ');
        let line = '';
        let lineY = cardY + cardHeight + 120;
        const maxWidth = canvas.width - 100;

        for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth) {
                ctx.fillText(line.trim(), canvas.width / 2, lineY);
                line = word + ' ';
                lineY += 40;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), canvas.width / 2, lineY);
    }

    // Footer
    ctx.fillStyle = '#d4a95d';
    ctx.font = '32px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText('☀️ Sun Tarot', canvas.width / 2, canvas.height - 80);

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '20px PT Sans, sans-serif';
    ctx.fillText(window.location.origin, canvas.width / 2, canvas.height - 40);

    // Show canvas and buttons
    document.getElementById('shareImageContainer').style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'inline-block';
    document.getElementById('instagramInstructions').style.display = 'block';
}

// Load image as promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Download generated image
function downloadShareImage() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `sun-tarot-reading-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    toastSuccess('Image downloaded!');
}

// Generate quote card for a single card
async function generateQuoteCard(card) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Square format for Instagram posts
    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card image (centered, large)
    const cardWidth = 400;
    const cardHeight = 600;
    const cardX = (canvas.width - cardWidth) / 2;
    const cardY = 100;

    try {
        const img = await loadImage(card.image);
        ctx.save();
        ctx.shadowColor = '#d4a95d';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 15);
        ctx.clip();

        if (card.isReversed) {
            ctx.translate(cardX + cardWidth / 2, cardY + cardHeight / 2);
            ctx.rotate(Math.PI);
            ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
        } else {
            ctx.drawImage(img, cardX, cardY, cardWidth, cardHeight);
        }
        ctx.restore();
    } catch (e) {
        console.log('Failed to load card image');
    }

    // Card name
    ctx.fillStyle = '#d4a95d';
    ctx.font = 'bold 48px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.name + (card.isReversed ? ' (Reversed)' : ''), canvas.width / 2, cardY + cardHeight + 70);

    // Brief meaning
    const meaning = card.displayMeaning || card.meaning || '';
    const briefMeaning = meaning.split('.')[0] + '.';

    ctx.fillStyle = '#f5f5f5';
    ctx.font = 'italic 28px PT Sans, sans-serif';

    // Word wrap for meaning
    const words = briefMeaning.split(' ');
    let line = '';
    let lineY = cardY + cardHeight + 130;

    for (const word of words) {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > canvas.width - 100) {
            ctx.fillText(line.trim(), canvas.width / 2, lineY);
            line = word + ' ';
            lineY += 38;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), canvas.width / 2, lineY);

    // Branding
    ctx.fillStyle = '#d4a95d';
    ctx.font = '28px Playfair Display, serif';
    ctx.fillText('☀️ Sun Tarot', canvas.width / 2, canvas.height - 50);

    return canvas.toDataURL('image/png');
}

function copyShareUrl() {
    const input = document.getElementById('shareUrlInput');
    input.select();
    document.execCommand('copy');
    toastSuccess('Link copied to clipboard!');
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.remove();
    window._shareCards = null;
    window._shareSpreadType = null;
}

// Save reading to history (enhanced with isReversed)
async function saveReadingToHistory(cards, spreadType = 'reading') {
    if (!isLoggedIn()) {
        console.log('User not logged in, skipping reading save');
        return null;
    }

    const user = getCurrentUser();

    try {
        const readingData = {
            userId: user.uid,
            userEmail: user.email,
            type: spreadType,
            cards: cards.map(card => ({
                name: card.name || card,
                image: card.image || null,
                meaning: card.meaning || null,
                isReversed: card.isReversed || false
            })),
            spreadType: spreadType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const ref = await db.collection('readings').add(readingData);
        console.log('Reading saved:', ref.id);
        return ref.id;
    } catch (error) {
        console.error('Error saving reading:', error);
        return null;
    }
}

// Get user's reading history
async function getReadingHistory(limit = 20) {
    if (!isLoggedIn()) return [];

    const user = getCurrentUser();

    try {
        const snapshot = await db.collection('readings')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const readings = [];
        snapshot.forEach(doc => {
            readings.push({ id: doc.id, ...doc.data() });
        });

        return readings;
    } catch (error) {
        console.error('Error fetching reading history:', error);
        return [];
    }
}

// Export
window.shareReading = shareReading;
window.showShareModal = showShareModal;
window.closeShareModal = closeShareModal;
window.copyShareUrl = copyShareUrl;
window.saveReadingToHistory = saveReadingToHistory;
window.getReadingHistory = getReadingHistory;
window.generateShareImage = generateShareImage;
window.downloadShareImage = downloadShareImage;
window.generateQuoteCard = generateQuoteCard;

