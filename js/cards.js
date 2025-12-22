// Major Arcana Tarot Cards Data
const majorArcana = [
    {
        name: "The Fool",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg",
        meaning: "New beginnings, innocence, spontaneity, and a free spirit. The Fool represents the start of a journey with unlimited potential."
    },
    {
        name: "The Magician",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg",
        meaning: "Manifestation, resourcefulness, power, and inspired action. You have all the tools you need to succeed."
    },
    {
        name: "The High Priestess",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg",
        meaning: "Intuition, sacred knowledge, divine feminine, and the subconscious mind. Trust your inner voice."
    },
    {
        name: "The Empress",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg",
        meaning: "Femininity, beauty, nature, nurturing, and abundance. A time of growth and creative expression."
    },
    {
        name: "The Emperor",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg",
        meaning: "Authority, structure, control, and fatherhood. Establish order and take charge of your situation."
    },
    {
        name: "The Hierophant",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg",
        meaning: "Spiritual wisdom, religious beliefs, conformity, and tradition. Seek guidance from established institutions."
    },
    {
        name: "The Lovers",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg",
        meaning: "Love, harmony, relationships, and choices. A significant relationship or decision awaits you."
    },
    {
        name: "The Chariot",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg",
        meaning: "Control, willpower, success, and determination. Victory through focus and confidence."
    },
    {
        name: "Strength",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg",
        meaning: "Courage, patience, control, and compassion. Inner strength will see you through challenges."
    },
    {
        name: "The Hermit",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg",
        meaning: "Soul-searching, introspection, and inner guidance. Take time for reflection and solitude."
    },
    {
        name: "Wheel of Fortune",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg",
        meaning: "Good luck, karma, life cycles, and destiny. Change is coming; embrace the turning wheel."
    },
    {
        name: "Justice",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg",
        meaning: "Fairness, truth, cause and effect, and law. Seek balance and accountability in your decisions."
    },
    {
        name: "The Hanged Man",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg",
        meaning: "Pause, surrender, letting go, and new perspectives. Sometimes we must release to receive."
    },
    {
        name: "Death",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg",
        meaning: "Endings, change, transformation, and transition. The old must end for the new to begin."
    },
    {
        name: "Temperance",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg",
        meaning: "Balance, moderation, patience, and purpose. Find harmony through the middle path."
    },
    {
        name: "The Devil",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg",
        meaning: "Shadow self, attachment, addiction, and restriction. Examine what binds you."
    },
    {
        name: "The Tower",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg",
        meaning: "Sudden change, upheaval, chaos, and revelation. Destruction clears the way for rebuilding."
    },
    {
        name: "The Star",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg",
        meaning: "Hope, faith, purpose, and renewal. After darkness comes the light of inspiration."
    },
    {
        name: "The Moon",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg",
        meaning: "Illusion, fear, anxiety, and subconscious. Not everything is as it seems; trust your intuition."
    },
    {
        name: "The Sun",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg",
        meaning: "Positivity, fun, warmth, and success. Joy and vitality shine upon your path."
    },
    {
        name: "Judgement",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg",
        meaning: "Reflection, reckoning, and awakening. A time of evaluation and answering your higher calling."
    },
    {
        name: "The World",
        image: "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg",
        meaning: "Completion, integration, accomplishment, and travel. You have reached a significant milestone."
    }
];

// Get random card
function getRandomCard() {
    return majorArcana[Math.floor(Math.random() * majorArcana.length)];
}

// Get card of the day (consistent for the day)
function getCardOfTheDay() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % majorArcana.length;
    return majorArcana[index];
}
