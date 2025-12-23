const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'index.html',
    'reading.html',
    'love-reading.html',
    'learn.html',
    'quiz.html',
    'spreads.html',
    'faq.html',
    'booking.html',
    'book-appointment.html',
    'profile.html',
    'my-readings.html',
    'my-bookings.html',
    'submit-review.html',
    'privacy.html',
    'terms.html',
    '404.html'
];

const workspaceDir = 'c:\\E Drive\\TaroCard\\suntarot';

let allPassed = true;

// Define the standard header components we want to verify
const checks = [
    { id: 'authContainer', label: 'Auth Container' },
    { id: 'mobileMenuBtn', label: 'Mobile Menu Button' },
    { id: 'navLinks', label: 'Nav Links' },
    { id: 'loginBtn', label: 'Login Button' },
    { id: 'logoutBtn', label: 'Logout Button' },
    { id: 'adminLink', label: 'Admin Link' }
];

console.log('Verifying headers in ' + workspaceDir + '\n');

filesToCheck.forEach(file => {
    const filePath = path.join(workspaceDir, file);
    if (!fs.existsSync(filePath)) {
        console.error(`[MISSING] ${file}`);
        allPassed = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let filePassed = true;
    const missingItems = [];

    checks.forEach(check => {
        if (!content.includes(`id="${check.id}"`)) {
            missingItems.push(check.label);
            filePassed = false;
        }
    });

    // Also check for the active class logic if applicable? 
    // It's hard to verify logic statically, but we can check if the file has "active" class on ITS OWN link.
    // Simplifying: we trust the replacements were correct, just checking components.

    if (filePassed) {
        console.log(`[PASS] ${file}`);
    } else {
        console.error(`[FAIL] ${file} - Missing: ${missingItems.join(', ')}`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log('\nAll public HTML files have standard header components.');
} else {
    console.error('\nSome files are missing header components.');
    process.exit(1);
}
