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
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: flex-start; justify-content: center; padding: 1rem; overflow-y: auto;">
            <div style="background: var(--color-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 2rem; padding-top: 3rem; max-width: min(700px, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); width: 100%; text-align: center; overflow-y: auto; margin: auto; position: relative;">
                <button onclick="closeShareModal()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--color-border); color: var(--color-text); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; z-index: 10;">✕</button>
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Share Your Reading</h3>
                
                <!-- Generated Image Preview -->
                <div id="shareImageContainer" style="margin-bottom: 1.5rem; display: none;">
                    <canvas id="shareCanvas" style="width: 100%; height: auto; border-radius: 0.5rem; border: 1px solid var(--color-border);"></canvas>
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

    // Set canvas size - Compact portrait orientation
    canvas.width = 1080;
    canvas.height = 1200;

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
    ctx.fillText(title, canvas.width / 2, 100);

    // Calculate card dimensions
    const totalCards = cards.length;
    const cardSpacing = 40;
    const sideMargin = 60;
    const availableWidth = canvas.width - (2 * sideMargin) - ((totalCards - 1) * cardSpacing);
    const cardWidth = availableWidth / totalCards;
    const cardHeight = cardWidth * 1.6;
    const startX = sideMargin;
    const cardY = 180;

    // Try to get images from the DOM first (already loaded on page)
    const loadedImages = [];
    
    for (let i = 0; i < totalCards; i++) {
        const card = cards[i];
        
        // Try to find the image in the DOM
        const domImg = document.querySelector(`img[src="${card.image}"]`);
        
        if (domImg && domImg.complete && domImg.naturalHeight > 0) {
            console.log(`Using DOM image for card ${i + 1}:`, card.name);
            loadedImages.push(domImg);
        } else {
            // Load image fresh
            console.log(`Loading fresh image for card ${i + 1}:`, card.name);
            try {
                const img = await new Promise((resolve, reject) => {
                    const newImg = new Image();
                    // Don't use crossOrigin for same-origin images
                    
                    newImg.onload = () => {
                        console.log(`Fresh image loaded for card ${i + 1}:`, card.name);
                        resolve(newImg);
                    };
                    
                    newImg.onerror = (err) => {
                        console.error(`Failed to load image for card ${i + 1}:`, card.name, err);
                        reject(err);
                    };
                    
                    // Add timestamp to prevent caching issues
                    const imgSrc = card.image.includes('?') 
                        ? `${card.image}&t=${Date.now()}` 
                        : `${card.image}?t=${Date.now()}`;
                    
                    newImg.src = imgSrc;
                    
                    // Timeout after 3 seconds
                    setTimeout(() => {
                        if (!newImg.complete) {
                            reject(new Error('Timeout'));
                        }
                    }, 3000);
                });
                
                loadedImages.push(img);
            } catch (err) {
                console.error(`Could not load image for card ${i + 1}:`, card.name, err);
                loadedImages.push(null);
            }
        }
    }

    console.log('Images ready:', loadedImages.map((img, i) => img ? 'loaded' : 'failed'));

    // Draw each card
    for (let i = 0; i < totalCards; i++) {
        const card = cards[i];
        const x = startX + i * (cardWidth + cardSpacing);

        // Card background with border
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#d4a95d';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardWidth, cardHeight, 12);
        ctx.fill();
        ctx.stroke();

        const img = loadedImages[i];
        const imageAreaHeight = cardHeight - 70;

        if (img && img.complete && img.naturalHeight > 0) {
            console.log(`Drawing card ${i + 1}:`, card.name);
            ctx.save();
            
            // Clip to card area
            ctx.beginPath();
            ctx.roundRect(x + 8, cardY + 8, cardWidth - 16, imageAreaHeight - 8, 8);
            ctx.clip();

            // Draw image
            try {
                if (card.isReversed) {
                    ctx.translate(x + cardWidth / 2, cardY + imageAreaHeight / 2);
                    ctx.rotate(Math.PI);
                    ctx.drawImage(img, -cardWidth / 2 + 8, -imageAreaHeight / 2 + 8, cardWidth - 16, imageAreaHeight - 8);
                } else {
                    ctx.drawImage(img, x + 8, cardY + 8, cardWidth - 16, imageAreaHeight - 8);
                }
            } catch (err) {
                console.error(`Error drawing card ${i + 1}:`, err);
            }
            
            ctx.restore();
        } else {
            console.warn(`Using fallback for card ${i + 1}:`, card.name);
            // Fallback: draw card name
            ctx.fillStyle = '#d4a95d';
            ctx.font = 'bold 28px PT Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(card.name || 'Card', x + cardWidth / 2, cardY + imageAreaHeight / 2);
        }

        // Draw card name at bottom
        ctx.fillStyle = '#f5f5f5';
        ctx.font = 'bold 22px PT Sans, sans-serif';
        ctx.textAlign = 'center';
        
        const displayName = (card.name || 'Card') + (card.isReversed ? ' ↺' : '');
        const nameY = cardY + cardHeight - 35;
        
        // Wrap text if too long
        const maxWidth = cardWidth - 20;
        const metrics = ctx.measureText(displayName);
        
        if (metrics.width > maxWidth) {
            const words = displayName.split(' ');
            let line1 = '';
            let line2 = '';
            
            for (let w = 0; w < words.length; w++) {
                const testLine = line1 + words[w] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && line1.length > 0) {
                    line2 = words.slice(w).join(' ');
                    break;
                } else {
                    line1 = testLine;
                }
            }
            
            ctx.fillText(line1.trim(), x + cardWidth / 2, nameY - 12);
            if (line2) {
                ctx.fillText(line2.trim(), x + cardWidth / 2, nameY + 12);
            }
        } else {
            ctx.fillText(displayName, x + cardWidth / 2, nameY);
        }
    }

    // Footer
    const footerY = cardY + cardHeight + 80;
    
    ctx.fillStyle = '#d4a95d';
    ctx.font = 'bold 36px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText('☀️ Sun Tarot', canvas.width / 2, footerY);

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '22px PT Sans, sans-serif';
    ctx.fillText(window.location.origin, canvas.width / 2, footerY + 40);
    
    console.log('Canvas generation complete');
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

