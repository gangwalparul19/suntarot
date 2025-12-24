// Sun Tarot Share Utility
// ========================
// Enhanced social sharing with image generation and native share support

// Share a reading to various platforms
function shareReading(cards, spreadType = 'reading') {
    const text = generateShareText(cards, spreadType);
    const url = window.location.origin;

    // Check for native share API with files support
    // We will show the modal mostly to generate the image first,
    // as sharing a file requires a File object which takes time to generate.
    // However, if we only wanted to share text, we could do it here.
    // For this app, we want to emphasize the visual, so we go to the modal.

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
async function showShareModal(text, url, cards = [], spreadType = 'reading') {
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
                    <p id="generatingText" style="color: var(--color-text-muted); margin-top: 0.5rem;">Generating magic...</p>
                </div>
                
                <p style="color: var(--color-text-muted); margin-bottom: 1.5rem; font-size: 0.875rem;">${text.substring(0, 100)}...</p>
                
                <!-- Image Generation Buttons -->
                <div id="shareButtonsContainer" style="display: none; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;">
                    <button onclick="shareImageNative('${spreadType}')" id="nativeShareBtn" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem; display: none;">
                        📱 Share Image (WhatsApp etc.)
                    </button>
                    <button onclick="downloadShareImage()" id="downloadBtn" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        ⬇️ Download Image
                    </button>
                </div>
                
                <!-- Fallback Links -->
                <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Or share link only:</p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
                    <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" 
                       style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #25D366; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.875rem;">
                        WhatsApp Link
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank"
                       style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #1DA1F2; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.875rem;">
                        Twitter
                    </a>
                    <button onclick="copyShareUrl()" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">📋 Copy Link</button>
                </div>

                <div style="display: flex; justify-content: center;">
                    <button onclick="closeShareModal()" class="btn btn-outline" style="padding: 0.5rem 1rem; min-width: 100px;">Close</button>
                </div>
                
                <input type="text" value="${url}" readonly id="shareUrlInput" style="position: absolute; left: -9999px;">
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store cards data for image generation
    window._shareCards = cards;
    window._shareSpreadType = spreadType;
    window._shareText = text;

    // Automatically start generating image
    document.getElementById('shareImageContainer').style.display = 'block';

    // Check if native sharing is supported to show/hide button
    if (navigator.share && navigator.canShare) {
        // We'll verify canShare with file later, but show button for now
        document.getElementById('nativeShareBtn').style.display = 'inline-block';
    }

    try {
        await generateShareImage(spreadType);
        document.getElementById('generatingText').style.display = 'none';
        document.getElementById('shareButtonsContainer').style.display = 'flex';
    } catch (e) {
        console.error('Error generating image:', e);
        document.getElementById('generatingText').textContent = 'Could not generate image.';
    }
}

// Generate shareable card image using Canvas
async function generateShareImage(spreadType = 'reading') {
    const cards = window._shareCards || [];
    if (cards.length === 0) return;

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

    // Create prompt for images to ensure they load
    const imagePromises = cards.map(c => loadImage(c.image).catch(() => null));
    const loadedImages = await Promise.all(imagePromises);

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

        const img = loadedImages[i];

        if (img) {
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
        } else {
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
        const truncated = meaning.length > 200 ? meaning.substring(0, 200) + '...' : meaning;

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
}

// Share image using native sharing (WhatsApp etc)
async function shareImageNative(spreadType) {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;

    try {
        canvas.toBlob(async (blob) => {
            if (!blob) {
                toastError('Failed to prepare image');
                return;
            }

            const file = new File([blob], `sun-tarot-${spreadType}.png`, { type: 'image/png' });
            const filesArray = [file];
            const text = window._shareText || 'My Tarot Reading';

            if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                try {
                    await navigator.share({
                        files: filesArray,
                        title: 'Sun Tarot Reading',
                        text: text
                    });
                    console.log('Shared successfully');
                } catch (error) {
                    // Abort error is common if user cancels
                    if (error.name !== 'AbortError') {
                        console.error('Error sharing:', error);
                        toastError('Could not open share menu');
                    }
                }
            } else {
                toastWarning('Your device does not support image sharing. Please download instead.');
            }
        }, 'image/png');
    } catch (e) {
        console.error('Error in shareImageNative:', e);
        toastError('Something went wrong');
    }
}

// Load image as promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
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
    window._shareText = null;
}

// Save reading to history
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
            .limit(limit)
            .get();

        const readings = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Handle Timestamp conversion
            if (data.createdAt && data.createdAt.toDate) {
                data.createdAt = data.createdAt.toDate();
            }
            readings.push({ id: doc.id, ...data });
        });

        // Sort by createdAt desc (client-side as firestore requires index for ordering by field when using where)
        readings.sort((a, b) => b.createdAt - a.createdAt);

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
window.shareImageNative = shareImageNative;

