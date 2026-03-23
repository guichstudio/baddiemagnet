const zodiacSigns = [
  { name: "Capricorn", emoji: "♑", element: "Earth", start: [1, 1], end: [1, 19] },
  { name: "Aquarius", emoji: "♒", element: "Air", start: [1, 20], end: [2, 18] },
  { name: "Pisces", emoji: "♓", element: "Water", start: [2, 19], end: [3, 20] },
  { name: "Aries", emoji: "♈", element: "Fire", start: [3, 21], end: [4, 19] },
  { name: "Taurus", emoji: "♉", element: "Earth", start: [4, 20], end: [5, 20] },
  { name: "Gemini", emoji: "♊", element: "Air", start: [5, 21], end: [6, 20] },
  { name: "Cancer", emoji: "♋", element: "Water", start: [6, 21], end: [7, 22] },
  { name: "Leo", emoji: "♌", element: "Fire", start: [7, 23], end: [8, 22] },
  { name: "Virgo", emoji: "♍", element: "Earth", start: [8, 23], end: [9, 22] },
  { name: "Libra", emoji: "♎", element: "Air", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", emoji: "♏", element: "Water", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", emoji: "♐", element: "Fire", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", emoji: "♑", element: "Earth", start: [12, 22], end: [12, 31] },
];

export function getZodiacSign(day, month) {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  for (const sign of zodiacSigns) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (
      (m === sm && d >= sd && (sm !== em || d <= ed)) ||
      (m === em && d <= ed && sm !== em) ||
      (sm !== em && m > sm && m < em)
    ) {
      return { name: sign.name, emoji: sign.emoji, element: sign.element };
    }
  }
  return { name: "Capricorn", emoji: "♑", element: "Earth" };
}

const elementCompatibility = {
  "Fire+Fire": "Two fire signs together create an intense, passionate dynamic. You fuel each other's ambitions but may clash when neither wants to compromise. Channel that energy into shared adventures instead of power struggles.",
  "Fire+Air": "Fire and Air make a naturally exciting match. You inspire each other intellectually and emotionally. The risk is moving too fast and burning out. Keep grounding yourselves in real conversations.",
  "Fire+Earth": "Fire and Earth can be a challenging pairing. One craves adventure, the other stability. When it works, you balance each other beautifully. Passion meets patience.",
  "Fire+Water": "Fire and Water create steam. Intense emotions, deep passion, but also potential conflict. You'll need to respect each other's very different emotional languages to thrive.",
  "Earth+Earth": "Two Earth signs build something solid and enduring. You share practical values and a love of stability. Just make sure routine doesn't replace romance over time.",
  "Earth+Air": "Earth and Air can feel like different worlds. One wants plans, the other wants possibilities. The magic happens when you appreciate what the other brings instead of trying to change them.",
  "Earth+Water": "Earth and Water is a naturally nurturing combination. You create emotional security together. The challenge is avoiding stagnation. Keep pushing each other to grow.",
  "Air+Air": "Two Air signs create a relationship full of ideas, conversation, and social energy. You understand each other's need for space. Just don't intellectualize your way out of dealing with real feelings.",
  "Air+Water": "Air and Water can be a delicate balance. One leads with logic, the other with emotion. When you meet in the middle, it's beautiful. But miscommunication is a real risk.",
  "Water+Water": "Two Water signs share a deep, intuitive emotional bond. You feel each other without words. The danger is getting lost in emotions together. Make sure you surface for air.",
};

function elementKey(e1, e2) {
  const sorted = [e1, e2].sort();
  return `${sorted[0]}+${sorted[1]}`;
}

export function getAstroCompatibility(sign1, sign2) {
  const key = elementKey(sign1.element, sign2.element);
  return elementCompatibility[key] || "Your astrological pairing is unique. Every couple writes their own story, regardless of the stars.";
}
