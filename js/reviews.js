// Sun Tarot Reviews System
// =========================
// Handles user reviews with admin approval workflow

// Review status constants
const REVIEW_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Submit a new review
async function submitReview(text, rating = 5) {
    if (!requireLogin('Please sign in to submit a review')) {
        return null;
    }

    const user = getCurrentUser();

    // Validate input
    if (!text || text.trim().length < 10) {
        toastWarning('Please write at least 10 characters for your review.');
        return null;
    }

    if (rating < 1 || rating > 5) {
        rating = 5;
    }

    try {
        // Check if user already has a pending review
        const existingReview = await db.collection('reviews')
            .where('userId', '==', user.uid)
            .where('status', '==', REVIEW_STATUS.PENDING)
            .get();

        if (!existingReview.empty) {
            toastInfo('You already have a review pending approval. Please wait for it to be reviewed.');
            return null;
        }

        // Create the review
        const reviewRef = await db.collection('reviews').add({
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            userPhoto: user.photoURL,
            text: text.trim(),
            rating: rating,
            status: REVIEW_STATUS.PENDING,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Review submitted:', reviewRef.id);
        return reviewRef.id;
    } catch (error) {
        console.error('Error submitting review:', error);
        toastError('Failed to submit review. Please try again.');
        return null;
    }
}

// Get featured reviews for display (featured first, then approved)
async function getFeaturedReviews(limit = 3) {
    if (!db) {
        console.log('Firestore not initialized, returning empty reviews');
        return [];
    }

    try {
        // First try to get featured reviews
        let snapshot = await db.collection('reviews')
            .where('featured', '==', true)
            .where('status', '==', REVIEW_STATUS.APPROVED)
            .limit(limit)
            .get();

        const reviews = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            reviews.push({
                id: doc.id,
                userName: data.userName,
                userPhoto: data.userPhoto,
                text: data.text,
                rating: data.rating,
                featured: data.featured || false,
                createdAt: data.createdAt?.toDate() || new Date()
            });
        });

        // Client-side sort
        reviews.sort((a, b) => b.createdAt - a.createdAt);

        return reviews;
    } catch (error) {
        console.error('Error fetching featured reviews:', error);
        // Fallback to approved reviews if index not ready
        return getApprovedReviews(limit);
    }
}

// Get approved reviews for display
async function getApprovedReviews(limit = 10) {
    if (!db) {
        console.log('Firestore not initialized, returning empty reviews');
        return [];
    }

    try {
        const snapshot = await db.collection('reviews')
            .where('status', '==', REVIEW_STATUS.APPROVED)
            .limit(limit)
            .get();

        const reviews = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            reviews.push({
                id: doc.id,
                userName: data.userName,
                userPhoto: data.userPhoto,
                text: data.text,
                rating: data.rating,
                featured: data.featured || false,
                createdAt: data.createdAt?.toDate() || new Date()
            });
        });

        // Client-side sort
        reviews.sort((a, b) => b.createdAt - a.createdAt);

        return reviews;
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        return [];
    }
}

// Admin: Get all reviews (any status)
async function getAllReviews(status = null) {
    if (!isAdmin()) return [];

    try {
        let query = db.collection('reviews').orderBy('createdAt', 'desc');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.limit(50).get();

        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        return reviews;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
}

// Admin: Approve a review
async function approveReview(reviewId) {
    if (!isAdmin()) {
        toastError('Admin access required');
        return false;
    }

    try {
        await db.collection('reviews').doc(reviewId).update({
            status: REVIEW_STATUS.APPROVED,
            approvedBy: getCurrentUser().email,
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error approving review:', error);
        return false;
    }
}

// Admin: Reject a review
async function rejectReview(reviewId, reason = '') {
    if (!isAdmin()) {
        toastError('Admin access required');
        return false;
    }

    try {
        await db.collection('reviews').doc(reviewId).update({
            status: REVIEW_STATUS.REJECTED,
            rejectedBy: getCurrentUser().email,
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
            rejectionReason: reason
        });
        return true;
    } catch (error) {
        console.error('Error rejecting review:', error);
        return false;
    }
}

// Admin: Delete a review
async function deleteReview(reviewId) {
    if (!isAdmin()) {
        toastError('Admin access required');
        return false;
    }

    try {
        await db.collection('reviews').doc(reviewId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        return false;
    }
}

// Render stars for rating
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
}

// Load and display reviews on a page (featured first, then approved)
async function loadReviewsIntoElement(elementId, limit = 3) {
    const container = document.getElementById(elementId);
    if (!container) return;

    // Show loading state
    container.innerHTML = '<p class="text-muted text-center">Loading reviews...</p>';

    // Try featured reviews first, fallback to approved
    let reviews = await getFeaturedReviews(limit);

    // If no featured reviews, get approved reviews
    if (reviews.length === 0) {
        reviews = await getApprovedReviews(limit);
    }

    if (reviews.length === 0) {
        container.innerHTML = ''; // Keep existing static testimonials
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="pricing-card">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                <img src="${review.userPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.userName)}" 
                     alt="${review.userName}"
                     style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                    <p class="text-primary" style="margin: 0; font-weight: 600;">${review.userName}</p>
                    <small class="text-muted">${renderStars(review.rating)}</small>
                </div>
            </div>
            <p class="text-muted" style="font-style: italic; margin-bottom: 0;">
                "${review.text}"
            </p>
        </div>
    `).join('');
}

// Admin: Toggle feature status of a review
async function toggleFeatureReview(reviewId, featured) {
    if (!isAdmin()) {
        toastError('Admin access required');
        return false;
    }

    try {
        await db.collection('reviews').doc(reviewId).update({
            featured: featured
        });
        return true;
    } catch (error) {
        console.error('Error toggling feature status:', error);
        return false;
    }
}

// Export functions
window.REVIEW_STATUS = REVIEW_STATUS;
window.submitReview = submitReview;
window.getApprovedReviews = getApprovedReviews;
window.getFeaturedReviews = getFeaturedReviews;
window.getAllReviews = getAllReviews;
window.approveReview = approveReview;
window.rejectReview = rejectReview;
window.deleteReview = deleteReview;
window.toggleFeatureReview = toggleFeatureReview;
window.loadReviewsIntoElement = loadReviewsIntoElement;
window.renderStars = renderStars;

