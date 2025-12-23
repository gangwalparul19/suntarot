// Firebase Configuration for Sun Tarot
// =====================================
// This file reads from environment variables for security.
// 
// For LOCAL development:
//   Create a file called 'env.js' (copy from env.example.js) with your config
//
// For VERCEL deployment:
//   Set these environment variables in Vercel Dashboard:
//   - FIREBASE_API_KEY
//   - FIREBASE_AUTH_DOMAIN
//   - FIREBASE_PROJECT_ID
//   - FIREBASE_STORAGE_BUCKET
//   - FIREBASE_MESSAGING_SENDER_ID
//   - FIREBASE_APP_ID

// Try to get config from window (set by env.js or Vercel injection)
const firebaseConfig = window.FIREBASE_CONFIG || {
    apiKey: "PLACEHOLDER",
    authDomain: "PLACEHOLDER",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER"
};

// Initialize Firebase
let app, auth, db;

// Check if Firebase is loaded
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded!');
        return false;
    }

    try {
        // Check if already initialized
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.apps[0];
        }

        auth = firebase.auth();
        db = firebase.firestore();

        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Check if Firebase is properly configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "PLACEHOLDER" &&
        firebaseConfig.apiKey !== "YOUR_API_KEY" &&
        firebaseConfig.apiKey !== "";
}

// Export for use in other scripts
window.firebaseConfig = firebaseConfig;
window.initFirebase = initFirebase;
window.isFirebaseConfigured = isFirebaseConfigured;