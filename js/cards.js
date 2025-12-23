// Major Arcana Tarot Cards Data
// Each card has upright and reversed meanings
const majorArcana = [
    {
        name: "The Fool",
        image: "images/ar00.jpg",
        meaning: "New beginnings, innocence, spontaneity, and a free spirit. The Fool represents the start of a journey with unlimited potential.",
        reversedMeaning: "Recklessness, risk-taking, foolishness. You may be acting without thinking or ignoring important warnings."
    },
    {
        name: "The Magician",
        image: "images/ar01.jpg",
        meaning: "Manifestation, resourcefulness, power, and inspired action. You have all the tools you need to succeed.",
        reversedMeaning: "Manipulation, poor planning, untapped talents. Your skills may be misdirected or you're not using your full potential."
    },
    {
        name: "The High Priestess",
        image: "images/ar02.jpg",
        meaning: "Intuition, sacred knowledge, divine feminine, and the subconscious mind. Trust your inner voice.",
        reversedMeaning: "Secrets, disconnection from intuition, withdrawal. You may be ignoring your inner voice or hiding something."
    },
    {
        name: "The Empress",
        image: "images/ar03.jpg",
        meaning: "Femininity, beauty, nature, nurturing, and abundance. A time of growth and creative expression.",
        reversedMeaning: "Creative block, dependence on others, emptiness. You may be neglecting self-care or feeling uninspired."
    },
    {
        name: "The Emperor",
        image: "images/ar04.jpg",
        meaning: "Authority, structure, control, and fatherhood. Establish order and take charge of your situation.",
        reversedMeaning: "Domination, excessive control, rigidity. You may be too controlling or struggling with authority figures."
    },
    {
        name: "The Hierophant",
        image: "images/ar05.jpg",
        meaning: "Spiritual wisdom, religious beliefs, conformity, and tradition. Seek guidance from established institutions.",
        reversedMeaning: "Personal beliefs, freedom, challenging the status quo. It's time to find your own spiritual path."
    },
    {
        name: "The Lovers",
        image: "images/ar06.jpg",
        meaning: "Love, harmony, relationships, and choices. A significant relationship or decision awaits you.",
        reversedMeaning: "Disharmony, imbalance, misalignment of values. Relationship conflicts or difficult choices ahead."
    },
    {
        name: "The Chariot",
        image: "images/ar07.jpg",
        meaning: "Control, willpower, success, and determination. Victory through focus and confidence.",
        reversedMeaning: "Lack of control, aggression, obstacles. You may be losing direction or facing setbacks."
    },
    {
        name: "Strength",
        image: "images/ar08.jpg",
        meaning: "Courage, patience, control, and compassion. Inner strength will see you through challenges.",
        reversedMeaning: "Self-doubt, weakness, insecurity. You may be struggling with confidence or inner demons."
    },
    {
        name: "The Hermit",
        image: "images/ar09.jpg",
        meaning: "Soul-searching, introspection, and inner guidance. Take time for reflection and solitude.",
        reversedMeaning: "Isolation, loneliness, withdrawal. Too much solitude may be harmful; seek connection."
    },
    {
        name: "Wheel of Fortune",
        image: "images/ar10.jpg",
        meaning: "Good luck, karma, life cycles, and destiny. Change is coming; embrace the turning wheel.",
        reversedMeaning: "Bad luck, resistance to change, breaking cycles. External forces are working against you."
    },
    {
        name: "Justice",
        image: "images/ar11.jpg",
        meaning: "Fairness, truth, cause and effect, and law. Seek balance and accountability in your decisions.",
        reversedMeaning: "Unfairness, dishonesty, lack of accountability. Injustice or legal complications may arise."
    },
    {
        name: "The Hanged Man",
        image: "images/ar12.jpg",
        meaning: "Pause, surrender, letting go, and new perspectives. Sometimes we must release to receive.",
        reversedMeaning: "Stalling, resistance, indecision. You're avoiding necessary sacrifices or refusing to see things differently."
    },
    {
        name: "Death",
        image: "images/ar13.jpg",
        meaning: "Endings, change, transformation, and transition. The old must end for the new to begin.",
        reversedMeaning: "Resistance to change, stagnation, fear of endings. You may be holding onto what no longer serves you."
    },
    {
        name: "Temperance",
        image: "images/ar14.jpg",
        meaning: "Balance, moderation, patience, and purpose. Find harmony through the middle path.",
        reversedMeaning: "Imbalance, excess, lack of long-term vision. You may be overindulging or experiencing discord."
    },
    {
        name: "The Devil",
        image: "images/ar15.jpg",
        meaning: "Shadow self, attachment, addiction, and restriction. Examine what binds you.",
        reversedMeaning: "Breaking free, reclaiming power, release. You're ready to overcome your limitations."
    },
    {
        name: "The Tower",
        image: "images/ar16.jpg",
        meaning: "Sudden change, upheaval, chaos, and revelation. Destruction clears the way for rebuilding.",
        reversedMeaning: "Fear of change, avoiding disaster, prolonged upheaval. You may be delaying inevitable changes."
    },
    {
        name: "The Star",
        image: "images/ar17.jpg",
        meaning: "Hope, faith, purpose, and renewal. After darkness comes the light of inspiration.",
        reversedMeaning: "Lack of faith, despair, disconnection. You may be feeling hopeless or spiritually drained."
    },
    {
        name: "The Moon",
        image: "images/ar18.jpg",
        meaning: "Illusion, fear, anxiety, and subconscious. Not everything is as it seems; trust your intuition.",
        reversedMeaning: "Release of fear, repressed emotions, inner confusion. Truth is coming to light."
    },
    {
        name: "The Sun",
        image: "images/ar19.jpg",
        meaning: "Positivity, fun, warmth, and success. Joy and vitality shine upon your path.",
        reversedMeaning: "Inner child issues, over-optimism, temporary depression. Your joy may be dimmed temporarily."
    },
    {
        name: "Judgement",
        image: "images/ar20.jpg",
        meaning: "Reflection, reckoning, and awakening. A time of evaluation and answering your higher calling.",
        reversedMeaning: "Self-doubt, ignoring the call, fear of change. You may be avoiding self-reflection or denying your purpose."
    },
    {
        name: "The World",
        image: "images/ar21.jpg",
        meaning: "Completion, integration, accomplishment, and travel. You have reached a significant milestone.",
        reversedMeaning: "Lack of completion, delays, seeking closure. A goal or project remains unfinished."
    }
];

// Draw a card with reversal possibility (50% chance)
function drawCard(card) {
    const isReversed = Math.random() < 0.5;
    return {
        ...card,
        isReversed: isReversed,
        displayMeaning: isReversed ? card.reversedMeaning : card.meaning
    };
}

// Draw multiple unique cards with reversal
function drawCards(count) {
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(card => drawCard(card));
}

// Get random card (with reversal)
function getRandomCard() {
    const card = majorArcana[Math.floor(Math.random() * majorArcana.length)];
    return drawCard(card);
}

// Get card of the day (consistent for the day, no reversal for daily card)
function getCardOfTheDay() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % majorArcana.length;
    return {
        ...majorArcana[index],
        isReversed: false,
        displayMeaning: majorArcana[index].meaning
    };
}

// Export functions
window.majorArcana = majorArcana;
window.drawCard = drawCard;
window.drawCards = drawCards;
window.getRandomCard = getRandomCard;
window.getCardOfTheDay = getCardOfTheDay;
