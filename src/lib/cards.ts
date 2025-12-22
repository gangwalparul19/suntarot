export type TarotCardData = {
  name: string;
  image: {
    src: string;
    width: number;
    height: number;
    hint: string;
  };
  meaning: string;
};

export const majorArcana: TarotCardData[] = [
  {
    name: 'The Fool',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg',
      width: 360,
      height: 600,
      hint: 'jester journey',
    },
    meaning: 'Beginnings, innocence, spontaneity, a free spirit. The Fool is about to step off a cliff into the unknown, representing a leap of faith.'
  },
  {
    name: 'The Magician',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg',
      width: 360,
      height: 600,
      hint: 'wizard alchemy',
    },
    meaning: 'Manifestation, resourcefulness, power, inspired action. The Magician has all the tools and elements at his disposal to manifest his desires.'
  },
  {
    name: 'The High Priestess',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg',
      width: 360,
      height: 600,
      hint: 'mystic intuition',
    },
    meaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind. She sits at the gate of the conscious and subconscious worlds.'
  },
  {
    name: 'The Empress',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg',
      width: 360,
      height: 600,
      hint: 'queen nature',
    },
    meaning: 'Femininity, beauty, nature, nurturing, abundance. The Empress represents creation, fertility, and the mother archetype.'
  },
  {
    name: 'The Emperor',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg',
      width: 360,
      height: 600,
      hint: 'king authority',
    },
    meaning: 'Authority, establishment, structure, a father figure. The Emperor provides stability, order, and security through his expertise and leadership.'
  },
  {
    name: 'The Hierophant',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg',
      width: 360,
      height: 600,
      hint: 'pope tradition',
    },
    meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions. He represents education and the pursuit of knowledge within established systems.'
  },
  {
    name: 'The Lovers',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg',
      width: 360,
      height: 600,
      hint: 'couple relationship',
    },
    meaning: 'Love, harmony, relationships, values alignment, choices. The Lovers card signifies a beautiful connection and important decisions from the heart.'
  },
  {
    name: 'The Chariot',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg',
      width: 360,
      height: 600,
      hint: 'warrior victory',
    },
    meaning: 'Control, willpower, success, action, determination. The Chariot represents overcoming obstacles through confidence and control.'
  },
  {
    name: 'Strength',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg',
      width: 360,
      height: 600,
      hint: 'woman lion',
    },
    meaning: 'Strength, courage, patience, control, compassion. This card is about inner strength and taming one\'s primal instincts with gentle authority.'
  },
  {
    name: 'The Hermit',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg',
      width: 360,
      height: 600,
      hint: 'elder solitude',
    },
    meaning: 'Soul-searching, introspection, being alone, inner guidance. The Hermit steps back from the world to seek wisdom from within.'
  },
  {
    name: 'Wheel of Fortune',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg',
      width: 360,
      height: 600,
      hint: 'destiny cycle',
    },
    meaning: 'Good luck, karma, life cycles, destiny, a turning point. The Wheel of Fortune points to the cyclical nature of life and inevitable changes.'
  },
  {
    name: 'Justice',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg',
      width: 360,
      height: 600,
      hint: 'scales balance',
    },
    meaning: 'Justice, fairness, truth, cause and effect, law. This card indicates that the fairest decision will be made, based on truth and karma.'
  },
  {
    name: 'The Hanged Man',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg',
      width: 360,
      height: 600,
      hint: 'sacrifice perspective',
    },
    meaning: 'Pause, surrender, letting go, new perspectives. The Hanged Man suggests a period of suspension and waiting to see things differently.'
  },
  {
    name: 'Death',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg',
      width: 360,
      height: 600,
      hint: 'skeleton transformation',
    },
    meaning: 'Endings, change, transformation, transition. The Death card rarely signifies physical death, but rather the end of one phase and the beginning of another.'
  },
  {
    name: 'Temperance',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg',
      width: 360,
      height: 600,
      hint: 'angel balance',
    },
    meaning: 'Balance, moderation, patience, purpose. Temperance is about finding the middle ground and mixing different elements of your life to create harmony.'
  },
  {
    name: 'The Devil',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg',
      width: 360,
      height: 600,
      hint: 'demon temptation',
    },
    meaning: 'Shadow self, attachment, addiction, restriction, sexuality. The Devil card points to unhealthy bonds and the need to confront one\'s darker impulses.'
  },
  {
    name: 'The Tower',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg',
      width: 360,
      height: 600,
      hint: 'lightning destruction',
    },
    meaning: 'Sudden change, upheaval, chaos, revelation, awakening. The Tower represents a sudden, dramatic event that brings down false structures and beliefs.'
  },
  {
    name: 'The Star',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg',
      width: 360,
      height: 600,
      hint: 'hope celestial',
    },
    meaning: 'Hope, faith, purpose, renewal, spirituality. The Star is a beacon of hope and inspiration, guiding you toward a brighter future.'
  },
  {
    name: 'The Moon',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg',
      width: 360,
      height: 600,
      hint: 'illusion night',
    },
    meaning: 'Illusion, fear, anxiety, subconscious, intuition. The Moon illuminates our fears and illusions, urging us to trust our intuition to navigate the darkness.'
  },
  {
    name: 'The Sun',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg',
      width: 360,
      height: 600,
      hint: 'child joy',
    },
    meaning: 'Positivity, fun, warmth, success, vitality. The Sun represents joy, success, and the simple pleasures of life. It is a card of pure optimism.'
  },
  {
    name: 'Judgement',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg',
      width: 360,
      height: 600,
      hint: 'angel resurrection',
    },
    meaning: 'Judgement, rebirth, inner calling, absolution. This card calls for a period of reflection and self-evaluation, leading to a rebirth or awakening.'
  },
  {
    name: 'The World',
    image: {
      src: 'https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg',
      width: 360,
      height: 600,
      hint: 'dancer completion',
    },
    meaning: 'Completion, integration, accomplishment, travel. The World card signifies the successful completion of a cycle and a sense of wholeness.'
  },
];


export const minorArcana: TarotCardData[] = [
  // Cups
  { name: 'Ace of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cuac.jpg', width: 360, height: 600, hint: 'cup overflow' }, meaning: 'New feelings, spirituality, intuition, emotional clarity.' },
  { name: 'Two of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu02.jpg', width: 360, height: 600, hint: 'couple connection' }, meaning: 'Unity, partnership, attraction, connection.' },
  { name: 'Three of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu03.jpg', width: 360, height: 600, hint: 'celebration friends' }, meaning: 'Celebration, friendship, creativity, community.' },
  { name: 'Four of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu04.jpg', width: 360, height: 600, hint: 'apathy meditation' }, meaning: 'Meditation, contemplation, apathy, re-evaluation.' },
  { name: 'Five of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu05.jpg', width: 360, height: 600, hint: 'loss grief' }, meaning: 'Loss, grief, disappointment, regret.' },
  { name: 'Six of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu06.jpg', width: 360, height: 600, hint: 'nostalgia childhood' }, meaning: 'Nostalgia, childhood memories, innocence, joy.' },
  { name: 'Seven of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu07.jpg', width: 360, height: 600, hint: 'choices illusion' }, meaning: 'Choices, fantasy, illusion, wishful thinking.' },
  { name: 'Eight of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu08.jpg', width: 360, height: 600, hint: 'walking away' }, meaning: 'Walking away, disillusionment, leaving behind, withdrawal.' },
  { name: 'Nine of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu09.jpg', width: 360, height: 600, hint: 'wish satisfaction' }, meaning: 'Contentment, satisfaction, gratitude, wishes fulfilled.' },
  { name: 'Ten of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cu10.jpg', width: 360, height: 600, hint: 'family happiness' }, meaning: 'Divine love, blissful relationships, harmony, alignment.' },
  { name: 'Page of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cupa.jpg', width: 360, height: 600, hint: 'messenger fluids' }, meaning: 'Creative opportunities, intuitive messages, curiosity.' },
  { name: 'Knight of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cukn.jpg', width: 360, height: 600, hint: 'romantic quest' }, meaning: 'Creativity, romance, charm, imagination, beauty.' },
  { name: 'Queen of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cuqu.jpg', width: 360, height: 600, hint: 'compassionate woman' }, meaning: 'Compassionate, caring, emotionally stable, intuitive.' },
  { name: 'King of Cups', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/cuki.jpg', width: 360, height: 600, hint: 'emotional control' }, meaning: 'Emotionally balanced, compassionate, diplomatic.' },

  // Pentacles
  { name: 'Ace of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/peac.jpg', width: 360, height: 600, hint: 'gold coin' }, meaning: 'New financial opportunity, abundance, manifestation.' },
  { name: 'Two of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe02.jpg', width: 360, height: 600, hint: 'juggling infinity' }, meaning: 'Balance, adaptability, time management, prioritization.' },
  { name: 'Three of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe03.jpg', width: 360, height: 600, hint: 'teamwork construction' }, meaning: 'Teamwork, collaboration, learning, implementation.' },
  { name: 'Four of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe04.jpg', width: 360, height: 600, hint: 'hoarding security' }, meaning: 'Security, conservation, frugality, holding on.' },
  { name: 'Five of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe05.jpg', width: 360, height: 600, hint: 'poverty cold' }, meaning: 'Financial loss, poverty, lack mindset, isolation.' },
  { name: 'Six of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe06.jpg', width: 360, height: 600, hint: 'charity generosity' }, meaning: 'Giving, receiving, sharing wealth, generosity, charity.' },
  { name: 'Seven of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe07.jpg', width: 360, height: 600, hint: 'harvest patience' }, meaning: 'Long-term view, sustainable results, perseverance, investment.' },
  { name: 'Eight of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe08.jpg', width: 360, height: 600, hint: 'craftsmanship work' }, meaning: 'Apprenticeship, repetitive tasks, mastery, skill development.' },
  { name: 'Nine of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe09.jpg', width: 360, height: 600, hint: 'luxury nature' }, meaning: 'Abundance, luxury, self-sufficiency, financial independence.' },
  { name: 'Ten of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pe10.jpg', width: 360, height: 600, hint: 'legacy wealth' }, meaning: 'Wealth, financial security, family, long-term success, legacy.' },
  { name: 'Page of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pepa.jpg', width: 360, height: 600, hint: 'student coin' }, meaning: 'Manifestation, financial opportunity, skill development.' },
  { name: 'Knight of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pekn.jpg', width: 360, height: 600, hint: 'methodical worker' }, meaning: 'Hard work, productivity, routine, conservatism.' },
  { name: 'Queen of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/pequ.jpg', width: 360, height: 600, hint: 'nurturing provider' }, meaning: 'Nurturing, practical, providing, financially independent.' },
  { name: 'King of Pentacles', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/peki.jpg', width: 360, height: 600, hint: 'wealthy leader' }, meaning: 'Wealth, business, leadership, security, discipline, abundance.' },

  // Swords
  { name: 'Ace of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/swac.jpg', width: 360, height: 600, hint: 'sword crown' }, meaning: 'Breakthrough, new idea, mental clarity, success.' },
  { name: 'Two of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw02.jpg', width: 360, height: 600, hint: 'blindfold decision' }, meaning: 'Difficult decision, weighing options, an impasse, avoidance.' },
  { name: 'Three of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw03.jpg', width: 360, height: 600, hint: 'heartbreak rain' }, meaning: 'Heartbreak, emotional pain, sorrow, grief, hurt.' },
  { name: 'Four of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw04.jpg', width: 360, height: 600, hint: 'rest tomb' }, meaning: 'Rest, relaxation, meditation, contemplation, recuperation.' },
  { name: 'Five of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw05.jpg', width: 360, height: 600, hint: 'defeat conflict' }, meaning: 'Conflict, tension, loss, defeat, winning at all costs, betrayal.' },
  { name: 'Six of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw06.jpg', width: 360, height: 600, hint: 'passage boat' }, meaning: 'Transition, change, rite of passage, releasing baggage.' },
  { name: 'Seven of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw07.jpg', width: 360, height: 600, hint: 'thief stealth' }, meaning: 'Deception, trickery, tactics, strategy, resourcefulness.' },
  { name: 'Eight of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw08.jpg', width: 360, height: 600, hint: 'trapped bound' }, meaning: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality.' },
  { name: 'Nine of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw09.jpg', width: 360, height: 600, hint: 'nightmare bed' }, meaning: 'Anxiety, worry, fear, depression, nightmares.' },
  { name: 'Ten of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/sw10.jpg', width: 360, height: 600, hint: 'ruin back' }, meaning: 'Painful ending, deep wounds, betrayal, loss, crisis.' },
  { name: 'Page of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/swpa.jpg', width: 360, height: 600, hint: 'vigilant youth' }, meaning: 'New ideas, curiosity, thirst for knowledge, new ways of communicating.' },
  { name: 'Knight of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/swkn.jpg', width: 360, height: 600, hint: 'charging rider' }, meaning: 'Ambitious, action-oriented, driven to succeed, fast-thinking.' },
  { name: 'Queen of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/swqu.jpg', width: 360, height: 600, hint: 'perceptive woman' }, meaning: 'Independent, unbiased judgment, clear boundaries, direct communication.' },
  { name: 'King of Swords', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/swki.jpg', width: 360, height: 600, hint: 'intellectual leader' }, meaning: 'Mental clarity, intellectual power, authority, truth.' },

  // Wands
  { name: 'Ace of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/waac.jpg', width: 360, height: 600, hint: 'wand sprout' }, meaning: 'Inspiration, new opportunities, growth, potential.' },
  { name: 'Two of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa02.jpg', width: 360, height: 600, hint: 'planning globe' }, meaning: 'Future planning, progress, decisions, discovery.' },
  { name: 'Three of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa03.jpg', width: 360, height: 600, hint: 'expansion horizon' }, meaning: 'Progress, expansion, foresight, overseas opportunities.' },
  { name: 'Four of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa04.jpg', width: 360, height: 600, hint: 'celebration arch' }, meaning: 'Celebration, joy, harmony, relaxation, homecoming.' },
  { name: 'Five of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa05.jpg', width: 360, height: 600, hint: 'competition stick' }, meaning: 'Conflict, disagreements, competition, tension, diversity.' },
  { name: 'Six of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa06.jpg', width: 360, height: 600, hint: 'victory horse' }, meaning: 'Success, public recognition, progress, self-confidence.' },
  { name: 'Seven of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa07.jpg', width: 360, height: 600, hint: 'defiance hill' }, meaning: 'Challenge, competition, protection, perseverance.' },
  { name: 'Eight of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa08.jpg', width: 360, height: 600, hint: 'speed flight' }, meaning: 'Movement, fast paced change, action, alignment, air travel.' },
  { name: 'Nine of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa09.jpg', width: 360, height: 600, hint: 'resilience bandage' }, meaning: 'Resilience, courage, persistence, test of faith, boundaries.' },
  { name: 'Ten of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wa10.jpg', width: 360, height: 600, hint: 'burden bundle' }, meaning: 'Burden, extra responsibility, hard work, completion, stress.' },
  { name: 'Page of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wapa.jpg', width: 360, height: 600, hint: 'explorer staff' }, meaning: 'Inspiration, ideas, discovery, limitless potential, free spirit.' },
  { name: 'Knight of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/wakn.jpg', width: 360, height: 600, hint: 'impetuous rider' }, meaning: 'Energy, passion, inspired action, adventure, impulsiveness.' },
  { name: 'Queen of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/waqu.jpg', width: 360, height: 600, hint: 'vibrant woman' }, meaning: 'Courage, confidence, independence, social butterfly, determination.' },
  { name: 'King of Wands', image: { src: 'https://www.sacred-texts.com/tarot/pkt/img/waki.jpg', width: 360, height: 600, hint: 'visionary leader' }, meaning: 'Natural-born leader, vision, entrepreneur, honor.' },
];

export const tarotDeck = [...majorArcana, ...minorArcana];
