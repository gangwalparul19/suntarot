// ========================================
// Quiz Data
// ========================================

// Personality Quiz Questions
const personalityQuestions = [
    {
        question: "When facing a difficult decision, you usually...",
        options: [
            { text: "Trust your intuition", icon: "👁️", cards: ["High Priestess", "Moon"] },
            { text: "Analyze all possibilities", icon: "🧠", cards: ["Magician", "Justice"] },
            { text: "Seek advice from others", icon: "👥", cards: ["Hierophant", "Lovers"] },
            { text: "Take immediate action", icon: "⚡", cards: ["Chariot", "Tower"] }
        ]
    },
    {
        question: "What brings you the most joy?",
        options: [
            { text: "Creating something new", icon: "🎨", cards: ["Empress", "Magician"] },
            { text: "Helping others", icon: "💝", cards: ["Star", "Strength"] },
            { text: "Achieving success", icon: "🏆", cards: ["Sun", "Chariot"] },
            { text: "Inner peace and wisdom", icon: "🧘", cards: ["Hermit", "High Priestess"] }
        ]
    },
    {
        question: "How do you handle unexpected changes?",
        options: [
            { text: "Embrace them as opportunities", icon: "🌟", cards: ["Wheel of Fortune", "Fool"] },
            { text: "Resist and try to maintain control", icon: "🛡️", cards: ["Emperor", "Hierophant"] },
            { text: "Adapt slowly but surely", icon: "🐢", cards: ["Hermit", "Justice"] },
            { text: "Let emotions guide the way", icon: "💫", cards: ["Moon", "Star"] }
        ]
    },
    {
        question: "What role do you play in your friend group?",
        options: [
            { text: "The leader who takes charge", icon: "👑", cards: ["Emperor", "Chariot"] },
            { text: "The wise advisor", icon: "🦉", cards: ["Hierophant", "Hermit"] },
            { text: "The creative dreamer", icon: "✨", cards: ["Star", "Moon"] },
            { text: "The nurturing supporter", icon: "🌸", cards: ["Empress", "Strength"] }
        ]
    },
    {
        question: "What is your greatest strength?",
        options: [
            { text: "Courage and determination", icon: "🦁", cards: ["Strength", "Chariot"] },
            { text: "Intuition and insight", icon: "🔮", cards: ["High Priestess", "Moon"] },
            { text: "Creativity and inspiration", icon: "🎭", cards: ["Magician", "Star"] },
            { text: "Patience and wisdom", icon: "⏳", cards: ["Hermit", "Justice"] }
        ]
    },
    {
        question: "How do you view endings and new beginnings?",
        options: [
            { text: "Endings make way for better things", icon: "🌅", cards: ["Death", "Sun"] },
            { text: "Change is scary but necessary", icon: "🌙", cards: ["Tower", "Moon"] },
            { text: "Every ending is a lesson learned", icon: "📖", cards: ["Judgement", "World"] },
            { text: "I prefer stability over change", icon: "🏠", cards: ["Emperor", "Hierophant"] }
        ]
    },
    {
        question: "What drives your ambitions?",
        options: [
            { text: "Freedom and adventure", icon: "🌍", cards: ["Fool", "Chariot"] },
            { text: "Love and connection", icon: "💕", cards: ["Lovers", "Empress"] },
            { text: "Knowledge and truth", icon: "📚", cards: ["High Priestess", "Hermit"] },
            { text: "Power and achievement", icon: "⚔️", cards: ["Emperor", "Magician"] }
        ]
    },
    {
        question: "How do you express yourself?",
        options: [
            { text: "Through actions and deeds", icon: "🎯", cards: ["Chariot", "Strength"] },
            { text: "Through art and creativity", icon: "🎨", cards: ["Star", "Empress"] },
            { text: "Through words and communication", icon: "💬", cards: ["Magician", "Hierophant"] },
            { text: "Through silence and reflection", icon: "🌌", cards: ["Hermit", "High Priestess"] }
        ]
    }
];

// Knowledge Quiz Questions
const knowledgeQuestions = [
    { question: "What number is The Fool in the Major Arcana?", options: ["0", "1", "21", "22"], correct: 0, cardHint: "The Fool" },
    { question: "Which card represents new beginnings and infinite potential?", options: ["The World", "The Tower", "The Fool", "Death"], correct: 2, cardHint: "The Fool" },
    { question: "The High Priestess is associated with which quality?", options: ["Action", "Intuition", "Wealth", "Travel"], correct: 1, cardHint: "The High Priestess" },
    { question: "Which card is commonly associated with major transformation?", options: ["The Star", "The Sun", "Death", "The Lovers"], correct: 2, cardHint: "Death" },
    { question: "The Empress represents which element?", options: ["Fire", "Water", "Earth", "Air"], correct: 2, cardHint: "The Empress" },
    { question: "Which card symbolizes balance and fair judgement?", options: ["The Chariot", "Justice", "The Tower", "The Moon"], correct: 1, cardHint: "Justice" },
    { question: "What does The Tower generally signify?", options: ["Slow growth", "Sudden upheaval", "Romance", "Financial gain"], correct: 1, cardHint: "The Tower" },
    { question: "Which card is associated with hope and inspiration?", options: ["The Moon", "The Star", "The Devil", "The Emperor"], correct: 1, cardHint: "The Star" },
    { question: "The World card represents...", options: ["Endings only", "Beginnings only", "Completion and achievement", "Confusion"], correct: 2, cardHint: "The World" },
    { question: "Which card often represents willpower and success through determination?", options: ["The Hermit", "The Chariot", "The Moon", "The Hanged Man"], correct: 1, cardHint: "The Chariot" },
    // Added Questions
    { question: "Which suit is associated with emotions and relationships?", options: ["Wands", "Cups", "Swords", "Pentacles"], correct: 1, cardHint: "Ace of Cups" },
    { question: "Which suit is associated with passion, energy, and action?", options: ["Wands", "Cups", "Swords", "Pentacles"], correct: 0, cardHint: "Ace of Wands" },
    { question: "Which suit is associated with intellect, logic, and conflict?", options: ["Wands", "Cups", "Swords", "Pentacles"], correct: 2, cardHint: "Ace of Swords" },
    { question: "Which suit is associated with material wealth, work, and stability?", options: ["Wands", "Cups", "Swords", "Pentacles"], correct: 3, cardHint: "Ace of Pentacles" },
    { question: "The Magician is numbered...", options: ["I", "II", "III", "IV"], correct: 0, cardHint: "The Magician" },
    { question: "The Emperor represents which zodiac sign?", options: ["Aries", "Taurus", "Cancer", "Leo"], correct: 0, cardHint: "The Emperor" },
    { question: "The Hierophant is traditionally known as the...", options: ["High Priest", "Pope", "King", "Sage"], correct: 1, cardHint: "The Hierophant" },
    { question: "What does The Lovers card primarily represent beside romance?", options: ["Choices", "War", "Money", "Travel"], correct: 0, cardHint: "The Lovers" },
    { question: "Strength was originally numbered...", options: ["VIII", "XI", "IX", "X"], correct: 1, cardHint: "Strength" },
    { question: "The Hermit suggests...", options: ["Socializing", "Introspection", "Public Speaking", "Partying"], correct: 1, cardHint: "The Hermit" },
    { question: "The Wheel of Fortune reminds us that...", options: ["Life is static", "Everything changes", "Bad luck is permanent", "Rich people are lucky"], correct: 1, cardHint: "Wheel of Fortune" },
    { question: "The Hanged Man advises us to...", options: ["Rush forward", "Pause and see a new perspective", "Give up", "Fight back"], correct: 1, cardHint: "The Hanged Man" },
    { question: "Temperance is about...", options: ["Excess", "Balance and moderation", "Anger", "Speed"], correct: 1, cardHint: "Temperance" },
    { question: "The Devil card often warns against...", options: ["Joy", "Bondage and addiction", "Freedom", "Spirituality"], correct: 1, cardHint: "The Devil" },
    { question: "The Moon can signify...", options: ["Clarity", "Illusion and deception", "Sunlight", "Logic"], correct: 1, cardHint: "The Moon" },
    { question: "The Sun is generally considered...", options: ["The most negative card", "The most positive card", "A neutral card", "A warning card"], correct: 1, cardHint: "The Sun" },
    { question: "Judgement calls for...", options: ["Self-evaluation and awakening", "Listening to others", "Sleeping", "Running away"], correct: 0, cardHint: "Judgement" },
    { question: "How many cards are in a standard Tarot deck?", options: ["52", "78", "44", "100"], correct: 1, cardHint: "The World" },
    { question: "How many Major Arcana cards are there?", options: ["21", "22", "14", "56"], correct: 1, cardHint: "The Fool" },
    { question: "How many Minor Arcana cards are there?", options: ["52", "56", "78", "40"], correct: 1, cardHint: "Ace of Wands" },
    { question: "Court cards consist of...", options: ["Page, Knight, Queen, King", "Ace, 2, 3, 4", "King, Queen, Jack", "Prince, Princess"], correct: 0, cardHint: "Queen of Wands" },
    { question: "Which card comes after The Fool?", options: ["The Magician", "The World", "The Empress", "The High Priestess"], correct: 0, cardHint: "The Magician" },
    { question: "What is usually depicted on the 9 of Swords?", options: ["A celebration", "A person waking from a nightmare", "A battle", "A garden"], correct: 1, cardHint: "9 of Swords" },
    { question: "The 3 of Cups typically signifies...", options: ["Heartbreak", "Celebration and friendship", "Loss", "Hard work"], correct: 1, cardHint: "3 of Cups" },
    { question: "The Ace of Pentacles offers...", options: ["A new emotional start", "A new financial opportunity", "A new idea", "A fight"], correct: 1, cardHint: "Ace of Pentacles" },
    { question: "The 10 of Cups represents...", options: ["Emotional fulfillment", "Burden", "Conflict", "Walking away"], correct: 0, cardHint: "10 of Cups" },
    { question: "Which King is known for being emotional and caring?", options: ["King of Wands", "King of Swords", "King of Cups", "King of Pentacles"], correct: 2, cardHint: "King of Cups" },
    { question: "The Queen of Swords is often described as...", options: ["Nurturing", "Sharp-witted and independent", "Dreamy", "Practical"], correct: 1, cardHint: "Queen of Swords" },
    { question: "The Knight of Wands is...", options: ["Slow and steady", "Passionate and impulsive", "Emotional", "Logical"], correct: 1, cardHint: "Knight of Wands" },
    { question: "The Page of Pentacles is a messenger of...", options: ["Love", "Ideas", "Conflict", "Practical news/money"], correct: 3, cardHint: "Page of Pentacles" },
    { question: "A tarot reading layout is called a...", options: ["Grid", "Spread", "Table", "Map"], correct: 1, cardHint: "The World" },
    { question: "Reversed cards can mean...", options: ["Opposite meaning or blocked energy", "Bad luck only", "The card is invalid", "Nothing"], correct: 0, cardHint: "The Hanged Man" },
    { question: "Which Major Arcana card depicts a lion?", options: ["Strength", "The Wheel of Fortune", "The World", "All of the above"], correct: 3, cardHint: "Strength" },
    { question: "The card 'Le Mat' is French for...", options: ["The Magician", "The Fool", "The Moon", "The Master"], correct: 1, cardHint: "The Fool" }
];

// Badges Definition
const quizBadges = [
    { id: 'mystic', name: 'Mystic', icon: '🔮', description: 'Find your card' },
    { id: 'scholar', name: 'Scholar', icon: '📚', description: 'Score 70%+ on knowledge' },
    { id: 'master', name: 'Master', icon: '🎓', description: 'Score 100% on knowledge' },
    { id: 'seeker', name: 'Seeker', icon: '🌟', description: 'Complete 3 quizzes' },
    { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Try both quiz types' },
    { id: 'dedicated', name: 'Dedicated', icon: '🏆', description: 'Complete 10 quizzes' }
];

// Card descriptions for personality results
const cardDescriptions = {
    "Fool": "You are The Fool - A free spirit full of wonder and unlimited potential. You approach life with curiosity and aren't afraid to take leaps of faith. Your optimism and spontaneity inspire others to embrace new beginnings.",
    "Magician": "You are The Magician - A powerful manifestor with all the tools you need for success. You're resourceful, skilled, and know how to turn ideas into reality. Your willpower and focus make anything possible.",
    "High Priestess": "You are The High Priestess - Deeply intuitive with access to hidden knowledge. You trust your inner voice and understand mysteries that others cannot see. Your wisdom comes from within.",
    "Empress": "You are The Empress - Nurturing, creative, and abundant. You bring beauty and growth wherever you go. Your maternal energy creates and sustains life in all its forms.",
    "Emperor": "You are The Emperor - A natural leader with authority and structure. You create order from chaos and others look to you for guidance. Your stability is your greatest strength.",
    "Hierophant": "You are The Hierophant - A keeper of traditions and spiritual wisdom. You bridge the gap between the divine and earthly realms, sharing knowledge with those who seek it.",
    "Lovers": "You are The Lovers - You value deep connections and harmony in relationships. Your choices are guided by love, and you understand the power of union between opposing forces.",
    "Chariot": "You are The Chariot - Driven, determined, and always moving forward. You have the willpower to overcome any obstacle. Victory comes through focus and self-discipline.",
    "Strength": "You are Strength - You possess quiet courage and inner power. Rather than force, you use patience and compassion to achieve your goals. Your gentle strength moves mountains.",
    "Hermit": "You are The Hermit - A seeker of truth and inner wisdom. You find answers through introspection and aren't afraid to walk your path alone. Your light guides others from within.",
    "Wheel of Fortune": "You are The Wheel of Fortune - You understand life's cycles and embrace change. Fortune favors you, and you know that every turn brings new opportunities.",
    "Justice": "You are Justice - Fair, balanced, and truthful. You see clearly and judge wisely. Your commitment to truth and fairness creates harmony in your world.",
    "Death": "You are Death - A master of transformation. You understand that endings create space for new beginnings. Your ability to let go opens doors others cannot see.",
    "Star": "You are The Star - A beacon of hope and inspiration. Your faith never wavers, and you bring healing and renewal wherever you go. You are divinely guided.",
    "Moon": "You are The Moon - Deeply connected to the subconscious and dream realms. You navigate uncertainty with grace and understand the hidden side of reality.",
    "Sun": "You are The Sun - Radiant, joyful, and full of vitality. Your positivity is contagious, and success comes naturally to you. You bring warmth to everyone around you.",
    "Judgement": "You are Judgement - Called to a higher purpose, you are experiencing awakening and rebirth. You evaluate your life with clarity and answer your true calling.",
    "World": "You are The World - Complete, fulfilled, and integrated. You have achieved a level of wholeness that allows you to celebrate life fully. The universe is within you.",
    "Tower": "You are The Tower - A catalyst for necessary change. Though your energy can be disruptive, it clears away what no longer serves to make way for truth and liberation.",
    "Hanged Man": "You are The Hanged Man - You see the world from unique perspectives. Your willingness to pause and surrender leads to profound insights and enlightenment.",
    "Devil": "You are The Devil - You understand shadow work and material desires. Your power lies in facing what others fear to acknowledge about themselves.",
    "Temperance": "You are Temperance - Balanced, patient, and harmonious. You blend opposites with grace and find the middle path through any challenge."
};

// ========================================
// Quiz State
// ========================================
let currentQuizType = null;
let currentQuestion = 0;
let personalityAnswers = [];
let knowledgeScore = 0;
let activeQuestions = [];
let quizStats = JSON.parse(localStorage.getItem('quizStats')) || {
    personalityCompleted: 0,
    knowledgeCompleted: 0,
    highestKnowledgeScore: 0,
    earnedBadges: [],
    typesPlayed: []
};

// ========================================
// Quiz Functions
// ========================================

function startQuiz(type) {
    currentQuizType = type;
    currentQuestion = 0;

    if (type === 'personality') {
        personalityAnswers = [];
        showSection('personalityQuiz');
        renderPersonalityQuestion();
    } else if (type === 'knowledge') {
        knowledgeScore = 0;
        // Shuffle and pick 6 random questions
        shuffleArray(knowledgeQuestions);
        activeQuestions = knowledgeQuestions.slice(0, 6);
        showSection('knowledgeQuiz');
        renderKnowledgeQuestion();
    }

    // Track quiz type for badge
    if (!quizStats.typesPlayed.includes(type)) {
        quizStats.typesPlayed.push(type);
        saveQuizStats();
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.quiz-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function goBack() {
    if (currentQuestion > 0 && currentQuizType === 'personality') {
        currentQuestion--;
        personalityAnswers.pop();
        renderPersonalityQuestion();
    } else {
        showSection('quizSelection');
        currentQuizType = null;
    }
}

// ========================================
// Personality Quiz
// ========================================

function renderPersonalityQuestion() {
    const q = personalityQuestions[currentQuestion];
    const total = personalityQuestions.length;
    const percent = Math.round((currentQuestion / total) * 100);

    document.getElementById('personalityProgress').textContent = `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById('personalityPercent').textContent = `${percent}%`;
    document.getElementById('personalityProgressFill').style.width = `${percent}%`;
    document.getElementById('personalityQuestionNum').textContent = `Question ${currentQuestion + 1}`;
    document.getElementById('personalityQuestionText').textContent = q.question;

    const optionsHtml = q.options.map((opt, i) => `
        <div class="answer-option" onclick="selectPersonalityAnswer(${i})">
            <span class="answer-icon">${opt.icon}</span>
            <span class="answer-text">${opt.text}</span>
        </div>
    `).join('');

    document.getElementById('personalityOptions').innerHTML = optionsHtml;
    document.getElementById('personalityNextBtn').disabled = true;
    document.getElementById('personalityNextBtn').textContent =
        currentQuestion === total - 1 ? 'See Your Card ✨' : 'Next →';
}

function selectPersonalityAnswer(index) {
    const options = document.querySelectorAll('#personalityOptions .answer-option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');

    personalityAnswers[currentQuestion] = index;
    document.getElementById('personalityNextBtn').disabled = false;
}

function nextQuestion() {
    if (currentQuestion < personalityQuestions.length - 1) {
        currentQuestion++;
        renderPersonalityQuestion();
    } else {
        calculatePersonalityResult();
    }
}

function calculatePersonalityResult() {
    // Count card mentions
    const cardCounts = {};

    personalityAnswers.forEach((answerIndex, questionIndex) => {
        const cards = personalityQuestions[questionIndex].options[answerIndex].cards;
        cards.forEach(card => {
            cardCounts[card] = (cardCounts[card] || 0) + 1;
        });
    });

    // Find the most mentioned card
    let resultCard = Object.keys(cardCounts).reduce((a, b) =>
        cardCounts[a] > cardCounts[b] ? a : b
    );

    // Find the card in majorArcana
    const cardData = typeof majorArcana !== 'undefined' ? (majorArcana.find(c => c.name.includes(resultCard)) || majorArcana[0]) : { name: resultCard, image: '', meaning: '' };

    // Update stats
    quizStats.personalityCompleted++;
    checkBadges();
    saveQuizStats();

    // Check login before showing result
    if (typeof auth !== 'undefined' && !auth.currentUser) {
        if (typeof toastWarning === 'function') toastWarning("Please login to reveal your card! 🔒", 4000);
        return;
    }

    // Render result
    showPersonalityResult(cardData, resultCard);
}

function showPersonalityResult(cardData, cardName) {
    const description = cardDescriptions[cardName] || `You are ${cardData.name}! ${cardData.meaning}`;

    document.getElementById('resultContent').innerHTML = `
        <h2 style="color: var(--color-primary); margin-bottom: 1rem;">Your Card Has Been Revealed!</h2>
        <div class="result-card-reveal">
            <div class="result-card">
                <img src="${cardData.image}" alt="${cardData.name}">
            </div>
        </div>
        <h3 class="result-title">${cardData.name}</h3>
        <p class="result-description">${description}</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="shareResult('${cardData.name}')">📤 Share Result</button>
            <button class="btn btn-outline" onclick="startQuiz('personality')">🔄 Take Again</button>
            <button class="btn btn-outline" onclick="showSection('quizSelection')">← Back to Quizzes</button>
        </div>
    `;

    showSection('quizResults');
}

// ========================================
// Knowledge Quiz
// ========================================

function renderKnowledgeQuestion() {
    const q = activeQuestions[currentQuestion];
    const total = activeQuestions.length;
    const percent = Math.round((currentQuestion / total) * 100);

    document.getElementById('knowledgeProgress').textContent = `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById('knowledgeScore').textContent = `Score: ${knowledgeScore}/${currentQuestion}`;
    document.getElementById('knowledgeProgressFill').style.width = `${percent}%`;
    document.getElementById('knowledgeQuestionNum').textContent = `Question ${currentQuestion + 1}`;
    document.getElementById('knowledgeQuestionText').textContent = q.question;

    const optionsHtml = q.options.map((opt, i) => `
        <div class="answer-option" onclick="selectKnowledgeAnswer(${i})">
            <span class="answer-text">${opt}</span>
        </div>
    `).join('');

    document.getElementById('knowledgeOptions').innerHTML = optionsHtml;
    document.getElementById('knowledgeNextBtn').style.display = 'none';
}

function selectKnowledgeAnswer(index) {
    const q = activeQuestions[currentQuestion];
    const options = document.querySelectorAll('#knowledgeOptions .answer-option');

    // Disable all options
    options.forEach((opt, i) => {
        opt.style.pointerEvents = 'none';
        if (i === q.correct) {
            opt.classList.add('correct');
        } else if (i === index && i !== q.correct) {
            opt.classList.add('incorrect');
        }
    });

    if (index === q.correct) {
        knowledgeScore++;
    }

    // Show next button
    const nextBtn = document.getElementById('knowledgeNextBtn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQuestion === activeQuestions.length - 1 ? 'See Results' : 'Next →';
}

function nextKnowledgeQuestion() {
    if (currentQuestion < activeQuestions.length - 1) {
        currentQuestion++;
        renderKnowledgeQuestion();
    } else {
        if (typeof auth !== 'undefined' && !auth.currentUser) {
            if (typeof toastWarning === 'function') toastWarning("Please login to reveal your score! 🔒", 4000);
            // Open module menu where login button is if mobile, or just highlight it?
            // For now just the toast
            return;
        }
        showKnowledgeResult();
    }
}

function showKnowledgeResult() {
    const total = activeQuestions.length;
    const percent = Math.round((knowledgeScore / total) * 100);

    let message, emoji;
    if (percent === 100) {
        message = "Perfect! You're a Tarot Master! 🎓";
        emoji = "🏆";
    } else if (percent >= 80) {
        message = "Excellent! You really know your cards!";
        emoji = "🌟";
    } else if (percent >= 60) {
        message = "Good job! Keep studying the cards!";
        emoji = "📚";
    } else if (percent >= 40) {
        message = "Not bad! Practice makes perfect!";
        emoji = "💪";
    } else {
        message = "Keep learning! The cards have much to teach.";
        emoji = "🌱";
    }

    // Update stats
    quizStats.knowledgeCompleted++;
    if (percent > quizStats.highestKnowledgeScore) {
        quizStats.highestKnowledgeScore = percent;
    }
    checkBadges();
    saveQuizStats();

    document.getElementById('resultContent').innerHTML = `
        <h2 style="color: var(--color-primary); margin-bottom: 1rem;">Quiz Complete!</h2>
        <div class="result-score">${emoji} ${knowledgeScore}/${total}</div>
        <p class="result-score-label">${percent}% Correct</p>
        <p class="result-description">${message}</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="startQuiz('knowledge')">🔄 Try Again</button>
            <button class="btn btn-outline" onclick="showSection('quizSelection')">← Back to Quizzes</button>
        </div>
    `;

    showSection('quizResults');
}

// ========================================
// Badge System
// ========================================

function checkBadges() {
    const newBadges = [];

    // Mystic - completed personality quiz
    if (quizStats.personalityCompleted >= 1 && !quizStats.earnedBadges.includes('mystic')) {
        quizStats.earnedBadges.push('mystic');
        newBadges.push('mystic');
    }

    // Scholar - 70%+ on knowledge quiz
    if (quizStats.highestKnowledgeScore >= 70 && !quizStats.earnedBadges.includes('scholar')) {
        quizStats.earnedBadges.push('scholar');
        newBadges.push('scholar');
    }

    // Master - 100% on knowledge quiz
    if (quizStats.highestKnowledgeScore >= 100 && !quizStats.earnedBadges.includes('master')) {
        quizStats.earnedBadges.push('master');
        newBadges.push('master');
    }

    // Seeker - 3 total quizzes
    const totalQuizzes = quizStats.personalityCompleted + quizStats.knowledgeCompleted;
    if (totalQuizzes >= 3 && !quizStats.earnedBadges.includes('seeker')) {
        quizStats.earnedBadges.push('seeker');
        newBadges.push('seeker');
    }

    // Explorer - both quiz types
    if (quizStats.typesPlayed.length >= 2 && !quizStats.earnedBadges.includes('explorer')) {
        quizStats.earnedBadges.push('explorer');
        newBadges.push('explorer');
    }

    // Dedicated - 10 total quizzes
    if (totalQuizzes >= 10 && !quizStats.earnedBadges.includes('dedicated')) {
        quizStats.earnedBadges.push('dedicated');
        newBadges.push('dedicated');
    }

    // Show notification for new badges
    if (newBadges.length > 0 && typeof toastSuccess === 'function') {
        const badgeName = quizBadges.find(b => b.id === newBadges[0])?.name;
        toastSuccess(`🏆 Badge Earned: ${badgeName}!`);
    }
}

function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    const earned = quizStats.earnedBadges.length;

    document.getElementById('badgeCount').textContent = `${earned}/${quizBadges.length} earned`;

    grid.innerHTML = quizBadges.map(badge => {
        const isEarned = quizStats.earnedBadges.includes(badge.id);
        return `
            <div class="badge-item ${isEarned ? 'earned' : 'locked'}" title="${badge.description}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `;
    }).join('');
}

function saveQuizStats() {
    localStorage.setItem('quizStats', JSON.stringify(quizStats));
}

// ========================================
// Utilities
// ========================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shareResult(cardName) {
    const text = `✨ I took the Sun Tarot personality quiz and my card is ${cardName}! 🔮\n\nDiscover which card represents YOU at Sun Tarot!`;

    if (navigator.share) {
        navigator.share({ title: 'My Tarot Card', text: text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text);
        if (typeof toastSuccess === 'function') {
            toastSuccess('Result copied to clipboard!');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderBadges();
});
