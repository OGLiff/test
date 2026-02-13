// Numbers & Counting Module Data

export interface NumberData {
  number: number;
  word: string;
  emoji: string;
  objects: string[];
  color: string;
}

export const NUMBERS_DATA: NumberData[] = [
  { number: 1, word: 'One', emoji: '1️⃣', objects: ['🍎'], color: '#FF6B6B' },
  { number: 2, word: 'Two', emoji: '2️⃣', objects: ['🌟', '🌟'], color: '#FF8A65' },
  { number: 3, word: 'Three', emoji: '3️⃣', objects: ['🐱', '🐱', '🐱'], color: '#FFB74D' },
  { number: 4, word: 'Four', emoji: '4️⃣', objects: ['🦋', '🦋', '🦋', '🦋'], color: '#FFD54F' },
  { number: 5, word: 'Five', emoji: '5️⃣', objects: ['🌺', '🌺', '🌺', '🌺', '🌺'], color: '#AED581' },
  { number: 6, word: 'Six', emoji: '6️⃣', objects: ['🐟', '🐟', '🐟', '🐟', '🐟', '🐟'], color: '#4DB6AC' },
  { number: 7, word: 'Seven', emoji: '7️⃣', objects: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈'], color: '#4FC3F7' },
  { number: 8, word: 'Eight', emoji: '8️⃣', objects: ['🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪'], color: '#7986CB' },
  { number: 9, word: 'Nine', emoji: '9️⃣', objects: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸'], color: '#CE93D8' },
  { number: 10, word: 'Ten', emoji: '🔟', objects: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐'], color: '#F48FB1' },
  { number: 11, word: 'Eleven', emoji: '1️⃣1️⃣', objects: ['🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭'], color: '#EF5350' },
  { number: 12, word: 'Twelve', emoji: '1️⃣2️⃣', objects: ['🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀'], color: '#EC407A' },
  { number: 13, word: 'Thirteen', emoji: '1️⃣3️⃣', objects: ['🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻'], color: '#AB47BC' },
  { number: 14, word: 'Fourteen', emoji: '1️⃣4️⃣', objects: ['🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵'], color: '#7E57C2' },
  { number: 15, word: 'Fifteen', emoji: '1️⃣5️⃣', objects: ['🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝', '🐝'], color: '#5C6BC0' },
  { number: 16, word: 'Sixteen', emoji: '1️⃣6️⃣', objects: ['🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓'], color: '#42A5F5' },
  { number: 17, word: 'Seventeen', emoji: '1️⃣7️⃣', objects: ['🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈', '🌈'], color: '#26A69A' },
  { number: 18, word: 'Eighteen', emoji: '1️⃣8️⃣', objects: ['💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎'], color: '#66BB6A' },
  { number: 19, word: 'Nineteen', emoji: '1️⃣9️⃣', objects: ['🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯', '🎯'], color: '#FFA726' },
  { number: 20, word: 'Twenty', emoji: '2️⃣0️⃣', objects: ['🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟'], color: '#FF7043' },
];

// Tracing path data for number drawing (simplified SVG-like coordinates)
export interface TracingPoint {
  x: number;
  y: number;
}

export const NUMBER_TRACING_PATHS: Record<number, TracingPoint[][]> = {
  1: [[{ x: 40, y: 20 }, { x: 50, y: 10 }, { x: 50, y: 90 }]],
  2: [[{ x: 25, y: 30 }, { x: 35, y: 15 }, { x: 60, y: 15 }, { x: 70, y: 30 }, { x: 60, y: 50 }, { x: 25, y: 85 }, { x: 75, y: 85 }]],
  3: [[{ x: 25, y: 20 }, { x: 55, y: 10 }, { x: 65, y: 30 }, { x: 50, y: 48 }, { x: 65, y: 65 }, { x: 55, y: 85 }, { x: 25, y: 85 }]],
  4: [[{ x: 55, y: 10 }, { x: 20, y: 60 }, { x: 75, y: 60 }], [{ x: 55, y: 10 }, { x: 55, y: 90 }]],
  5: [[{ x: 65, y: 10 }, { x: 30, y: 10 }, { x: 25, y: 45 }, { x: 55, y: 40 }, { x: 70, y: 55 }, { x: 65, y: 80 }, { x: 30, y: 85 }]],
  6: [[{ x: 60, y: 15 }, { x: 40, y: 15 }, { x: 25, y: 40 }, { x: 25, y: 70 }, { x: 40, y: 85 }, { x: 60, y: 85 }, { x: 70, y: 70 }, { x: 60, y: 50 }, { x: 30, y: 50 }]],
  7: [[{ x: 25, y: 10 }, { x: 75, y: 10 }, { x: 45, y: 90 }]],
  8: [[{ x: 50, y: 48 }, { x: 35, y: 35 }, { x: 35, y: 18 }, { x: 50, y: 10 }, { x: 65, y: 18 }, { x: 65, y: 35 }, { x: 50, y: 48 }, { x: 30, y: 62 }, { x: 30, y: 78 }, { x: 50, y: 88 }, { x: 70, y: 78 }, { x: 70, y: 62 }, { x: 50, y: 48 }]],
  9: [[{ x: 65, y: 45 }, { x: 35, y: 45 }, { x: 25, y: 30 }, { x: 35, y: 15 }, { x: 60, y: 15 }, { x: 70, y: 30 }, { x: 70, y: 60 }, { x: 55, y: 85 }, { x: 35, y: 85 }]],
  0: [[{ x: 50, y: 10 }, { x: 30, y: 25 }, { x: 25, y: 50 }, { x: 30, y: 75 }, { x: 50, y: 88 }, { x: 70, y: 75 }, { x: 75, y: 50 }, { x: 70, y: 25 }, { x: 50, y: 10 }]],
};
