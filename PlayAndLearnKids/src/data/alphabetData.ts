// Alphabet Learning Module Data
// Each letter includes uppercase, lowercase, example word, and emoji representation

export interface LetterData {
  letter: string;
  lowercase: string;
  word: string;
  emoji: string;
  color: string;
}

export const ALPHABET_DATA: LetterData[] = [
  { letter: 'A', lowercase: 'a', word: 'Apple', emoji: '🍎', color: '#FF6B6B' },
  { letter: 'B', lowercase: 'b', word: 'Bear', emoji: '🐻', color: '#8D6E63' },
  { letter: 'C', lowercase: 'c', word: 'Cat', emoji: '🐱', color: '#FF8A65' },
  { letter: 'D', lowercase: 'd', word: 'Dog', emoji: '🐕', color: '#A1887F' },
  { letter: 'E', lowercase: 'e', word: 'Elephant', emoji: '🐘', color: '#90A4AE' },
  { letter: 'F', lowercase: 'f', word: 'Fish', emoji: '🐟', color: '#42A5F5' },
  { letter: 'G', lowercase: 'g', word: 'Grapes', emoji: '🍇', color: '#7C4DFF' },
  { letter: 'H', lowercase: 'h', word: 'House', emoji: '🏠', color: '#66BB6A' },
  { letter: 'I', lowercase: 'i', word: 'Ice Cream', emoji: '🍦', color: '#F48FB1' },
  { letter: 'J', lowercase: 'j', word: 'Jellyfish', emoji: '🪼', color: '#CE93D8' },
  { letter: 'K', lowercase: 'k', word: 'Kite', emoji: '🪁', color: '#4DD0E1' },
  { letter: 'L', lowercase: 'l', word: 'Lion', emoji: '🦁', color: '#FFB74D' },
  { letter: 'M', lowercase: 'm', word: 'Moon', emoji: '🌙', color: '#FFE082' },
  { letter: 'N', lowercase: 'n', word: 'Nest', emoji: '🪹', color: '#A1887F' },
  { letter: 'O', lowercase: 'o', word: 'Orange', emoji: '🍊', color: '#FF9800' },
  { letter: 'P', lowercase: 'p', word: 'Penguin', emoji: '🐧', color: '#546E7A' },
  { letter: 'Q', lowercase: 'q', word: 'Queen', emoji: '👑', color: '#FFD700' },
  { letter: 'R', lowercase: 'r', word: 'Rainbow', emoji: '🌈', color: '#EF5350' },
  { letter: 'S', lowercase: 's', word: 'Star', emoji: '⭐', color: '#FDD835' },
  { letter: 'T', lowercase: 't', word: 'Turtle', emoji: '🐢', color: '#66BB6A' },
  { letter: 'U', lowercase: 'u', word: 'Umbrella', emoji: '☂️', color: '#5C6BC0' },
  { letter: 'V', lowercase: 'v', word: 'Violin', emoji: '🎻', color: '#8D6E63' },
  { letter: 'W', lowercase: 'w', word: 'Whale', emoji: '🐋', color: '#29B6F6' },
  { letter: 'X', lowercase: 'x', word: 'Xylophone', emoji: '🎵', color: '#EC407A' },
  { letter: 'Y', lowercase: 'y', word: 'Yarn', emoji: '🧶', color: '#FF7043' },
  { letter: 'Z', lowercase: 'z', word: 'Zebra', emoji: '🦓', color: '#78909C' },
];
