// Enhanced Reading History with Notes and Export
// ================================================

// Add note to a reading
async function addReadingNote(readingId, note) {
    if (!isLoggedIn()) {
        toastError('Please sign in to add notes');
        return false;
    }

    try {
        await db.collection('readings').doc(readingId).update({
            note: note,
            noteUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        toastSuccess('Note saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving note:', error);
        toastError('Failed to save note');
        return false;
    }
}

// Get reading with note
async function getReadingWithNote(readingId) {
    try {
        const doc = await db.collection('readings').doc(readingId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching reading:', error);
        return null;
    }
}

// Export reading as PDF
async function exportReadingAsPDF(reading) {
    // Using jsPDF library (needs to be loaded)
    if (typeof jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        toastError('PDF export not available');
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Set colors
    const primaryColor = [212, 169, 93]; // #d4a95d
    const textColor = [51, 51, 51];
    const mutedColor = [163, 163, 163];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('☀️ Sun Tarot', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Tarot Reading', 105, 30, { align: 'center' });

    // Reading details
    let yPos = 55;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    
    const date = reading.createdAt?.toDate ? reading.createdAt.toDate() : new Date(reading.createdAt);
    doc.text(`Date: ${date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 20, yPos);
    
    yPos += 10;
    doc.text(`Type: ${getSpreadLabel(reading.spreadType)}`, 20, yPos);

    // Cards section
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Cards Drawn', 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);

    reading.cards.forEach((card, index) => {
        const position = getCardPosition(reading.spreadType, index);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${position}:`, 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`${card.name}${card.isReversed ? ' (Reversed)' : ''}`, 60, yPos);
        
        yPos += 7;
        
        // Card meaning
        doc.setTextColor(...mutedColor);
        doc.setFontSize(9);
        const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
        const lines = doc.splitTextToSize(meaning, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5 + 5;
        
        doc.setTextColor(...textColor);
        doc.setFontSize(10);

        // Add new page if needed
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });

    // Notes section
    if (reading.note) {
        yPos += 10;
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Your Notes', 20, yPos);

        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        const noteLines = doc.splitTextToSize(reading.note, 170);
        doc.text(noteLines, 20, yPos);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...mutedColor);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('© 2025 Sun Tarot - https://suntarot.web.app', 105, 295, { align: 'center' });
    }

    // Save PDF
    const filename = `sun-tarot-reading-${date.toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    toastSuccess('PDF downloaded successfully');
}

// Export all readings as CSV
function exportReadingsAsCSV(readings) {
    if (!readings || readings.length === 0) {
        toastError('No readings to export');
        return;
    }

    // CSV headers
    const headers = ['Date', 'Time', 'Type', 'Cards', 'Reversed Cards', 'Note'];
    
    // CSV rows
    const rows = readings.map(reading => {
        const date = reading.createdAt?.toDate ? reading.createdAt.toDate() : new Date(reading.createdAt);
        const dateStr = date.toLocaleDateString('en-IN');
        const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const type = getSpreadLabel(reading.spreadType);
        const cards = reading.cards.map(c => c.name).join('; ');
        const reversedCards = reading.cards.filter(c => c.isReversed).map(c => c.name).join('; ');
        const note = (reading.note || '').replace(/"/g, '""'); // Escape quotes

        return [dateStr, timeStr, type, cards, reversedCards, `"${note}"`];
    });

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sun-tarot-readings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toastSuccess('CSV exported successfully');
}

// Helper functions
function getCardPosition(spreadType, index) {
    const positions = {
        'reading': ['🌙 Past', '☀️ Present', '⭐ Future'],
        'love': ['💕 Your Heart', '💝 Partner\'s Energy', '💑 Connection', '🚧 Challenges', '✨ Destiny'],
        'daily': ['☀️ Card of the Day']
    };
    return positions[spreadType]?.[index] || `Card ${index + 1}`;
}

function getSpreadLabel(type) {
    const labels = {
        'reading': '🔮 Past • Present • Future',
        'love': '💕 Love Reading',
        'daily': '☀️ Daily Card'
    };
    return labels[type] || '🔮 Reading';
}

// Show note modal
function showNoteModal(readingId, currentNote = '') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            <div style="padding: 2rem;">
                <h3 class="text-primary" style="margin-bottom: 1rem;">📝 Add Note to Reading</h3>
                <textarea 
                    id="readingNoteInput" 
                    class="notes-textarea" 
                    placeholder="Write your thoughts, insights, or reflections about this reading..."
                    style="width: 100%; min-height: 120px; max-height: 300px; padding: 1rem; border: 1px solid var(--color-border); border-radius: 0.5rem; background: var(--color-background); color: var(--color-text); font-family: var(--font-body); font-size: 1rem; resize: vertical;"
                >${currentNote}</textarea>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="saveReadingNote('${readingId}')" style="flex: 1; min-width: 120px;">
                        💾 Save Note
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()" style="flex: 1; min-width: 120px;">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Focus textarea
    setTimeout(() => {
        const textarea = document.getElementById('readingNoteInput');
        if (textarea) {
            textarea.focus();
            // Move cursor to end
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }, 100);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Save note from modal
async function saveReadingNote(readingId) {
    const note = document.getElementById('readingNoteInput').value.trim();
    const success = await addReadingNote(readingId, note);
    
    if (success) {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
        // Reload readings to show updated note
        if (typeof loadReadings === 'function') {
            loadReadings();
        }
    }
}

// Export functions
window.addReadingNote = addReadingNote;
window.getReadingWithNote = getReadingWithNote;
window.exportReadingAsPDF = exportReadingAsPDF;
window.exportReadingsAsCSV = exportReadingsAsCSV;
window.showNoteModal = showNoteModal;
window.saveReadingNote = saveReadingNote;
