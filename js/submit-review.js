let selectedRating = 5;

// Update UI based on auth state
function updateReviewUI() {
    const loginPrompt = document.getElementById('loginPrompt');
    const reviewForm = document.getElementById('reviewForm');

    if (isLoggedIn()) {
        loginPrompt.style.display = 'none';
        reviewForm.style.display = 'block';
    } else {
        loginPrompt.style.display = 'block';
        reviewForm.style.display = 'none';
    }
}

// Star rating interaction
document.getElementById('starRating').addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectedRating = parseInt(e.target.dataset.value);
        updateStars();
    }
});

function updateStars() {
    document.querySelectorAll('.star').forEach((star, index) => {
        star.classList.toggle('active', index < selectedRating);
    });
}

// Character count
document.getElementById('reviewText').addEventListener('input', (e) => {
    document.getElementById('charCount').textContent = e.target.value.length;
});

// Submit review
async function handleSubmit() {
    const text = document.getElementById('reviewText').value;

    if (text.length < 10) {
        toastWarning('Please write at least 10 characters for your review.');
        return;
    }

    const reviewId = await submitReview(text, selectedRating);

    if (reviewId) {
        document.getElementById('reviewForm').style.display = 'none';
        document.getElementById('successMessage').classList.add('show');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateReviewUI, 500);
});

// Update on auth change
const originalUpdateAuthUI = window.updateAuthUI;
window.updateAuthUI = function (user) {
    if (originalUpdateAuthUI) originalUpdateAuthUI(user);
    updateReviewUI();
};
