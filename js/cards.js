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

// Minor Arcana Tarot Cards Data
// ==============================
// 56 cards divided into 4 suits: Wands, Cups, Swords, Pentacles
// Each suit has 14 cards: Ace through 10, plus Page, Knight, Queen, King

const minorArcana = [
    // WANDS (Fire - Action, Energy, Passion)
    {
        name: "Ace of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "New creative beginnings, inspiration, potential. A spark of passion ignites your path forward.",
        reversedMeaning: "Delays, lack of direction, creative blocks. Your energy may be scattered or misdirected."
    },
    {
        name: "Two of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Planning, making decisions, leaving comfort zone. You're ready to expand your horizons.",
        reversedMeaning: "Fear of unknown, lack of planning, playing it safe. You may be hesitating to take the next step."
    },
    {
        name: "Three of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Expansion, foresight, overseas opportunities. Your efforts are beginning to pay off.",
        reversedMeaning: "Obstacles, delays, lack of foresight. Plans may not unfold as expected."
    },
    {
        name: "Four of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Celebration, harmony, homecoming, community. A time of joy and stability.",
        reversedMeaning: "Lack of support, instability, cancelled celebrations. Harmony may be disrupted."
    },
    {
        name: "Five of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Competition, conflict, tension. Challenges arise but they help you grow stronger.",
        reversedMeaning: "Avoiding conflict, inner tension, compromise. You may be suppressing disagreements."
    },
    {
        name: "Six of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=500&fit=crop",
        meaning: "Victory, success, public recognition. Your hard work is being acknowledged.",
        reversedMeaning: "Ego, lack of recognition, fall from grace. Success may be fleeting or hollow."
    },
    {
        name: "Seven of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Perseverance, defensive stance, maintaining position. Stand your ground against challenges.",
        reversedMeaning: "Giving up, overwhelmed, exhaustion. You may feel unable to continue the fight."
    },
    {
        name: "Eight of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "Speed, action, swift changes. Things are moving quickly in your favor.",
        reversedMeaning: "Delays, frustration, resisting change. Progress may be slower than expected."
    },
    {
        name: "Nine of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Resilience, persistence, last stand. You're almost there—don't give up now.",
        reversedMeaning: "Exhaustion, paranoia, giving up. You may be too tired to continue."
    },
    {
        name: "Ten of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Burden, responsibility, hard work. You're carrying a heavy load but success is near.",
        reversedMeaning: "Delegation, release, lightening the load. It's time to let go of some responsibilities."
    },
    {
        name: "Page of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "Enthusiasm, exploration, discovery. A message of new creative opportunities.",
        reversedMeaning: "Lack of direction, procrastination, bad news. Your enthusiasm may be waning."
    },
    {
        name: "Knight of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Energy, passion, adventure. A bold and impulsive force enters your life.",
        reversedMeaning: "Recklessness, impatience, haste. Slow down and think before acting."
    },
    {
        name: "Queen of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Confidence, independence, determination. A charismatic and passionate leader.",
        reversedMeaning: "Selfishness, jealousy, insecurity. Your confidence may be masking deeper issues."
    },
    {
        name: "King of Wands",
        suit: "wands",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Leadership, vision, entrepreneurship. A natural leader with bold ideas.",
        reversedMeaning: "Impulsiveness, overbearing, ruthless. Power may be misused or misdirected."
    },

    // CUPS (Water - Emotions, Relationships, Intuition)
    {
        name: "Ace of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "New love, emotional awakening, creativity. Your heart overflows with possibility.",
        reversedMeaning: "Emotional loss, blocked creativity, emptiness. You may be feeling emotionally drained."
    },
    {
        name: "Two of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Partnership, unity, attraction. A deep connection forms between two souls.",
        reversedMeaning: "Imbalance, broken relationship, disharmony. A partnership may be struggling."
    },
    {
        name: "Three of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=500&fit=crop",
        meaning: "Friendship, celebration, community. Joy shared with others multiplies.",
        reversedMeaning: "Overindulgence, gossip, isolation. Social connections may be strained."
    },
    {
        name: "Four of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Contemplation, apathy, reevaluation. You may be missing opportunities right in front of you.",
        reversedMeaning: "Awareness, acceptance, new possibilities. You're ready to see what you've been missing."
    },
    {
        name: "Five of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Loss, grief, disappointment. Focus on what remains, not what is lost.",
        reversedMeaning: "Acceptance, moving on, finding peace. You're ready to heal and move forward."
    },
    {
        name: "Six of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=500&fit=crop",
        meaning: "Nostalgia, childhood memories, innocence. The past holds valuable lessons.",
        reversedMeaning: "Living in the past, unrealistic expectations. It's time to let go and move forward."
    },
    {
        name: "Seven of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Choices, illusion, fantasy. Many options present themselves—choose wisely.",
        reversedMeaning: "Clarity, determination, values alignment. You're seeing through illusions."
    },
    {
        name: "Eight of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Walking away, seeking deeper meaning, disappointment. It's time to move on.",
        reversedMeaning: "Fear of change, stagnation, avoidance. You may be staying in an unfulfilling situation."
    },
    {
        name: "Nine of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=500&fit=crop",
        meaning: "Contentment, satisfaction, wishes fulfilled. Your dreams are coming true.",
        reversedMeaning: "Greed, dissatisfaction, materialism. Happiness may be elusive despite having everything."
    },
    {
        name: "Ten of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Harmony, family, emotional fulfillment. Perfect happiness and lasting joy.",
        reversedMeaning: "Broken family, disconnection, misalignment. Harmony may be disrupted."
    },
    {
        name: "Page of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Creative opportunities, intuitive messages, curiosity. A message of love or creativity arrives.",
        reversedMeaning: "Emotional immaturity, creative blocks, bad news. Your emotions may be unstable."
    },
    {
        name: "Knight of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=500&fit=crop",
        meaning: "Romance, charm, imagination. A romantic and idealistic person enters your life.",
        reversedMeaning: "Moodiness, disappointment, unrealistic. Promises may not be kept."
    },
    {
        name: "Queen of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Compassion, intuition, emotional security. A nurturing and empathetic presence.",
        reversedMeaning: "Insecurity, giving too much, martyrdom. You may be neglecting your own needs."
    },
    {
        name: "King of Cups",
        suit: "cups",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Emotional balance, diplomacy, compassion. A wise and emotionally mature leader.",
        reversedMeaning: "Manipulation, moodiness, emotional volatility. Emotions may be out of control."
    },

    // SWORDS (Air - Thoughts, Communication, Conflict)
    {
        name: "Ace of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=500&fit=crop",
        meaning: "Breakthrough, clarity, new ideas. Truth cuts through confusion.",
        reversedMeaning: "Confusion, chaos, lack of clarity. Your thoughts may be clouded."
    },
    {
        name: "Two of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Difficult choices, stalemate, avoidance. You must make a decision.",
        reversedMeaning: "Indecision, confusion, information overload. You're stuck between options."
    },
    {
        name: "Three of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Heartbreak, sorrow, painful truth. Emotional pain leads to growth.",
        reversedMeaning: "Recovery, forgiveness, moving on. The worst is behind you."
    },
    {
        name: "Four of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=500&fit=crop",
        meaning: "Rest, recovery, contemplation. Take time to recharge and reflect.",
        reversedMeaning: "Restlessness, burnout, stagnation. You may be unable to rest properly."
    },
    {
        name: "Five of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Conflict, defeat, winning at all costs. Victory may come with a price.",
        reversedMeaning: "Reconciliation, making amends, moving on. It's time to let go of conflict."
    },
    {
        name: "Six of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Transition, moving on, leaving behind. You're moving toward calmer waters.",
        reversedMeaning: "Resistance to change, unfinished business. You may be stuck in the past."
    },
    {
        name: "Seven of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=500&fit=crop",
        meaning: "Deception, strategy, sneakiness. Not everything is as it appears.",
        reversedMeaning: "Coming clean, rethinking approach, conscience. Truth is being revealed."
    },
    {
        name: "Eight of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Restriction, imprisonment, victim mentality. You're more free than you think.",
        reversedMeaning: "Freedom, release, new perspective. You're breaking free from limitations."
    },
    {
        name: "Nine of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Anxiety, worry, nightmares. Your fears may be worse than reality.",
        reversedMeaning: "Hope, reaching out, recovery. You're finding ways to cope."
    },
    {
        name: "Ten of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=500&fit=crop",
        meaning: "Rock bottom, painful endings, betrayal. This is the end, but also a new beginning.",
        reversedMeaning: "Recovery, regeneration, resisting end. You're rising from the ashes."
    },
    {
        name: "Page of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Curiosity, restlessness, mental energy. A message or new idea arrives.",
        reversedMeaning: "Gossip, deception, haste. Information may be unreliable."
    },
    {
        name: "Knight of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop",
        meaning: "Action, impulsiveness, defending beliefs. Swift and decisive action.",
        reversedMeaning: "Recklessness, impatience, lack of direction. Think before you act."
    },
    {
        name: "Queen of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=300&h=500&fit=crop",
        meaning: "Independence, clear thinking, direct communication. Honest and perceptive.",
        reversedMeaning: "Coldness, bitterness, cruelty. You may be too harsh or detached."
    },
    {
        name: "King of Swords",
        suit: "swords",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop",
        meaning: "Authority, truth, intellectual power. A fair and logical leader.",
        reversedMeaning: "Manipulation, tyranny, abuse of power. Logic without compassion."
    },

    // PENTACLES (Earth - Material, Career, Finances)
    {
        name: "Ace of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "New financial opportunity, prosperity, manifestation. Seeds of abundance are planted.",
        reversedMeaning: "Lost opportunity, lack of planning, poor financial decisions."
    },
    {
        name: "Two of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Balance, adaptability, time management. Juggling multiple priorities.",
        reversedMeaning: "Imbalance, overwhelm, disorganization. You're dropping the ball."
    },
    {
        name: "Three of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Teamwork, collaboration, skill. Your expertise is recognized.",
        reversedMeaning: "Lack of teamwork, disharmony, poor quality. Collaboration isn't working."
    },
    {
        name: "Four of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Security, control, conservation. Holding on tightly to what you have.",
        reversedMeaning: "Greed, materialism, self-protection. You may be too controlling."
    },
    {
        name: "Five of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "Financial loss, poverty, insecurity. Hard times test your resilience.",
        reversedMeaning: "Recovery, charity, improvement. Things are getting better."
    },
    {
        name: "Six of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Generosity, charity, sharing wealth. Give and receive in balance.",
        reversedMeaning: "Strings attached, inequality, debt. Generosity may have conditions."
    },
    {
        name: "Seven of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Patience, investment, long-term view. Your efforts will pay off in time.",
        reversedMeaning: "Impatience, lack of rewards, poor investment. Results aren't showing yet."
    },
    {
        name: "Eight of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Skill development, dedication, craftsmanship. Mastery through practice.",
        reversedMeaning: "Lack of focus, mediocrity, shortcuts. You may be cutting corners."
    },
    {
        name: "Nine of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "Independence, luxury, self-sufficiency. Enjoying the fruits of your labor.",
        reversedMeaning: "Overwork, financial setbacks, lack of stability. Success feels hollow."
    },
    {
        name: "Ten of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Wealth, inheritance, family, legacy. Long-term success and stability.",
        reversedMeaning: "Financial failure, family disputes, fleeting success. Wealth may be unstable."
    },
    {
        name: "Page of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop",
        meaning: "Opportunity, new venture, manifestation. A message about finances or career.",
        reversedMeaning: "Lack of progress, procrastination, bad news. Opportunities may be missed."
    },
    {
        name: "Knight of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=500&fit=crop",
        meaning: "Efficiency, routine, conservatism. Steady and reliable progress.",
        reversedMeaning: "Laziness, obsessiveness, perfectionism. Progress may be too slow."
    },
    {
        name: "Queen of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=500&fit=crop",
        meaning: "Nurturing, practical, providing. A grounded and resourceful presence.",
        reversedMeaning: "Self-care neglect, work-life imbalance, smothering. You may be giving too much."
    },
    {
        name: "King of Pentacles",
        suit: "pentacles",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop",
        meaning: "Wealth, business, leadership, security. A successful and stable provider.",
        reversedMeaning: "Greed, materialism, corruption. Success at the expense of values."
    }
];

// Combined deck (Major + Minor Arcana)
const fullDeck = [...majorArcana, ...minorArcana];

// Draw a card with reversal possibility (50% chance)
function drawCard(card) {
    const isReversed = Math.random() < 0.5;
    return {
        ...card,
        isReversed: isReversed,
        displayMeaning: isReversed ? card.reversedMeaning : card.meaning
    };
}

// Draw multiple unique cards with reversal (from full deck by default)
function drawCards(count, useMajorOnly = false) {
    const deck = useMajorOnly ? majorArcana : fullDeck;
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(card => drawCard(card));
}

// Get random card (with reversal, from full deck)
function getRandomCard(useMajorOnly = false) {
    const deck = useMajorOnly ? majorArcana : fullDeck;
    const card = deck[Math.floor(Math.random() * deck.length)];
    return drawCard(card);
}

// Get card of the day (consistent for the day, no reversal for daily card)
function getCardOfTheDay() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % fullDeck.length;
    return {
        ...fullDeck[index],
        isReversed: false,
        displayMeaning: fullDeck[index].meaning
    };
}

// Export functions
window.majorArcana = majorArcana;
window.minorArcana = minorArcana;
window.fullDeck = fullDeck;
window.drawCard = drawCard;
window.drawCards = drawCards;
window.getRandomCard = getRandomCard;
window.getCardOfTheDay = getCardOfTheDay;
