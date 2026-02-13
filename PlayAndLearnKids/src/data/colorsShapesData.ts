// Colors & Shapes Module Data

export interface ColorData {
  name: string;
  hex: string;
  emoji: string;
  objects: string[];
}

export const COLORS_DATA: ColorData[] = [
  { name: 'Red', hex: '#FF0000', emoji: '🔴', objects: ['🍎', '🌹', '❤️', '🍒'] },
  { name: 'Blue', hex: '#2196F3', emoji: '🔵', objects: ['🌊', '🦋', '💎', '🫐'] },
  { name: 'Yellow', hex: '#FFEB3B', emoji: '🟡', objects: ['🌻', '⭐', '🍋', '🌙'] },
  { name: 'Green', hex: '#4CAF50', emoji: '🟢', objects: ['🌿', '🐸', '🍀', '🥒'] },
  { name: 'Orange', hex: '#FF9800', emoji: '🟠', objects: ['🍊', '🥕', '🎃', '🧡'] },
  { name: 'Purple', hex: '#9C27B0', emoji: '🟣', objects: ['🍇', '🔮', '💜', '🍆'] },
  { name: 'Pink', hex: '#E91E63', emoji: '🩷', objects: ['🌸', '🦩', '💗', '🎀'] },
  { name: 'Brown', hex: '#795548', emoji: '🟤', objects: ['🐻', '🍫', '🌰', '🏈'] },
  { name: 'Black', hex: '#212121', emoji: '⚫', objects: ['🖤', '🐈‍⬛', '🌑', '♠️'] },
  { name: 'White', hex: '#FAFAFA', emoji: '⚪', objects: ['☁️', '🐑', '❄️', '🤍'] },
];

export interface ShapeData {
  name: string;
  sides: number;
  emoji: string;
  color: string;
  description: string;
}

export const SHAPES_DATA: ShapeData[] = [
  { name: 'Circle', sides: 0, emoji: '⭕', color: '#FF6B6B', description: 'Round like a ball!' },
  { name: 'Square', sides: 4, emoji: '⬜', color: '#42A5F5', description: 'Four equal sides!' },
  { name: 'Triangle', sides: 3, emoji: '🔺', color: '#66BB6A', description: 'Three sides and three corners!' },
  { name: 'Rectangle', sides: 4, emoji: '▬', color: '#FFA726', description: 'Like a door shape!' },
  { name: 'Star', sides: 5, emoji: '⭐', color: '#FFD700', description: 'Shiny like the sky!' },
  { name: 'Heart', sides: 0, emoji: '❤️', color: '#E91E63', description: 'The shape of love!' },
  { name: 'Diamond', sides: 4, emoji: '💎', color: '#7C4DFF', description: 'A tilted square!' },
  { name: 'Oval', sides: 0, emoji: '🥚', color: '#4ECDC4', description: 'Like an egg shape!' },
];

// Shape drawing coordinates for rendering (normalized 0-100)
export interface ShapePoint {
  x: number;
  y: number;
}

export const SHAPE_PATHS: Record<string, ShapePoint[]> = {
  Circle: Array.from({ length: 36 }, (_, i) => ({
    x: 50 + 40 * Math.cos((i * 10 * Math.PI) / 180),
    y: 50 + 40 * Math.sin((i * 10 * Math.PI) / 180),
  })),
  Square: [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 80, y: 80 }, { x: 20, y: 80 }, { x: 20, y: 20 }],
  Triangle: [{ x: 50, y: 15 }, { x: 85, y: 85 }, { x: 15, y: 85 }, { x: 50, y: 15 }],
  Rectangle: [{ x: 15, y: 25 }, { x: 85, y: 25 }, { x: 85, y: 75 }, { x: 15, y: 75 }, { x: 15, y: 25 }],
  Star: [
    { x: 50, y: 5 }, { x: 61, y: 35 }, { x: 95, y: 38 },
    { x: 68, y: 60 }, { x: 79, y: 95 }, { x: 50, y: 73 },
    { x: 21, y: 95 }, { x: 32, y: 60 }, { x: 5, y: 38 },
    { x: 39, y: 35 }, { x: 50, y: 5 },
  ],
  Diamond: [{ x: 50, y: 10 }, { x: 85, y: 50 }, { x: 50, y: 90 }, { x: 15, y: 50 }, { x: 50, y: 10 }],
  Heart: [
    { x: 50, y: 85 }, { x: 15, y: 55 }, { x: 5, y: 35 },
    { x: 10, y: 20 }, { x: 25, y: 12 }, { x: 40, y: 18 },
    { x: 50, y: 32 }, { x: 60, y: 18 }, { x: 75, y: 12 },
    { x: 90, y: 20 }, { x: 95, y: 35 }, { x: 85, y: 55 },
    { x: 50, y: 85 },
  ],
  Oval: Array.from({ length: 36 }, (_, i) => ({
    x: 50 + 35 * Math.cos((i * 10 * Math.PI) / 180),
    y: 50 + 25 * Math.sin((i * 10 * Math.PI) / 180),
  })),
};
