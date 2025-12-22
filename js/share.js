// Sun Tarot Share Utility
// ========================
// Handles social sharing of readings

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
    showShareModal(text, url);
}

// Generate share text
function generateShareText(cards, spreadType) {
    const cardNames = cards.map(c => c.name || c).join(', ');

    const messages = {
        'reading': `🔮 My Tarot Reading: ${cardNames}\n\nDiscover your path with Sun Tarot!`,
        'love': `💕 My Love Reading: ${cardNames}\n\nUnlock the secrets of your heart!`,
        'daily': `☀️ My Card of the Day: ${cardNames}\n\nWhat does the universe have in store for you?`
    };

    return messages[spreadType] || messages['reading'];
}

// Show share modal
function showShareModal(text, url) {
    // Remove existing modal
    const existing = document.getElementById('shareModal');
    if (existing) existing.remove();

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
            <div style="background: var(--color-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 2rem; max-width: 400px; width: 100%; text-align: center;">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Share Your Reading</h3>
                <p style="color: var(--color-text-muted); margin-bottom: 1.5rem; font-size: 0.875rem;">${text.substring(0, 100)}...</p>
                
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
}

function copyShareUrl() {
    const input = document.getElementById('shareUrlInput');
    input.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.remove();
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
            cards: cards.map(card => ({
                name: card.name || card,
                image: card.image || null,
                meaning: card.meaning || null
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
