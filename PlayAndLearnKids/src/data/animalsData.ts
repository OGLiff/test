// Animals & Sounds Module Data

export interface AnimalData {
  name: string;
  emoji: string;
  sound: string;
  funFact: string;
  category: 'farm' | 'wild' | 'ocean' | 'pet';
  color: string;
}

export const ANIMALS_DATA: AnimalData[] = [
  // Farm Animals
  {
    name: 'Cow',
    emoji: '🐄',
    sound: 'Moo!',
    funFact: 'Cows have best friends and get sad when apart!',
    category: 'farm',
    color: '#8D6E63',
  },
  {
    name: 'Chicken',
    emoji: '🐔',
    sound: 'Cluck cluck!',
    funFact: 'Chickens can dream just like we do!',
    category: 'farm',
    color: '#FFB74D',
  },
  {
    name: 'Pig',
    emoji: '🐷',
    sound: 'Oink oink!',
    funFact: 'Pigs are very smart and love to play!',
    category: 'farm',
    color: '#F48FB1',
  },
  {
    name: 'Horse',
    emoji: '🐴',
    sound: 'Neigh!',
    funFact: 'Horses can sleep standing up!',
    category: 'farm',
    color: '#A1887F',
  },
  {
    name: 'Sheep',
    emoji: '🐑',
    sound: 'Baa!',
    funFact: 'Sheep can remember 50 different faces!',
    category: 'farm',
    color: '#E0E0E0',
  },
  {
    name: 'Duck',
    emoji: '🦆',
    sound: 'Quack!',
    funFact: 'Baby ducks follow the first thing they see!',
    category: 'farm',
    color: '#66BB6A',
  },
  // Wild Animals
  {
    name: 'Lion',
    emoji: '🦁',
    sound: 'Roar!',
    funFact: 'Lions sleep up to 20 hours a day!',
    category: 'wild',
    color: '#FFB74D',
  },
  {
    name: 'Elephant',
    emoji: '🐘',
    sound: 'Trumpet!',
    funFact: 'Elephants never forget a friend!',
    category: 'wild',
    color: '#90A4AE',
  },
  {
    name: 'Monkey',
    emoji: '🐒',
    sound: 'Ooh ooh ah ah!',
    funFact: 'Monkeys peel bananas from the bottom!',
    category: 'wild',
    color: '#A1887F',
  },
  {
    name: 'Tiger',
    emoji: '🐅',
    sound: 'Grrr!',
    funFact: 'Every tiger has unique stripes, like fingerprints!',
    category: 'wild',
    color: '#FF9800',
  },
  {
    name: 'Giraffe',
    emoji: '🦒',
    sound: 'Hum!',
    funFact: 'Giraffes are the tallest animals on Earth!',
    category: 'wild',
    color: '#FFD54F',
  },
  {
    name: 'Bear',
    emoji: '🐻',
    sound: 'Growl!',
    funFact: 'Bears love honey as much as you do!',
    category: 'wild',
    color: '#795548',
  },
  // Ocean Animals
  {
    name: 'Dolphin',
    emoji: '🐬',
    sound: 'Click click!',
    funFact: 'Dolphins sleep with one eye open!',
    category: 'ocean',
    color: '#42A5F5',
  },
  {
    name: 'Whale',
    emoji: '🐋',
    sound: 'Wooo!',
    funFact: 'Blue whales are the biggest animals ever!',
    category: 'ocean',
    color: '#1976D2',
  },
  {
    name: 'Octopus',
    emoji: '🐙',
    sound: 'Squish!',
    funFact: 'Octopuses have three hearts!',
    category: 'ocean',
    color: '#E91E63',
  },
  {
    name: 'Fish',
    emoji: '🐟',
    sound: 'Blub blub!',
    funFact: 'Fish can taste with their whole body!',
    category: 'ocean',
    color: '#26C6DA',
  },
  {
    name: 'Turtle',
    emoji: '🐢',
    sound: 'Snap!',
    funFact: 'Turtles have been around since dinosaurs!',
    category: 'ocean',
    color: '#66BB6A',
  },
  // Pets
  {
    name: 'Dog',
    emoji: '🐕',
    sound: 'Woof woof!',
    funFact: 'Dogs can learn over 1000 words!',
    category: 'pet',
    color: '#A1887F',
  },
  {
    name: 'Cat',
    emoji: '🐱',
    sound: 'Meow!',
    funFact: 'Cats spend 70% of their lives sleeping!',
    category: 'pet',
    color: '#FF8A65',
  },
  {
    name: 'Rabbit',
    emoji: '🐰',
    sound: 'Squeak!',
    funFact: 'Rabbits can jump really high when happy!',
    category: 'pet',
    color: '#FFFFFF',
  },
  {
    name: 'Hamster',
    emoji: '🐹',
    sound: 'Squeak squeak!',
    funFact: 'Hamsters can stuff food in their cheeks!',
    category: 'pet',
    color: '#FFB74D',
  },
  {
    name: 'Parrot',
    emoji: '🦜',
    sound: 'Squawk!',
    funFact: 'Parrots can learn to talk like humans!',
    category: 'pet',
    color: '#66BB6A',
  },
];

export const ANIMAL_CATEGORIES = [
  { key: 'farm', label: 'Farm', emoji: '🏡', color: '#66BB6A' },
  { key: 'wild', label: 'Wild', emoji: '🌍', color: '#FF9800' },
  { key: 'ocean', label: 'Ocean', emoji: '🌊', color: '#42A5F5' },
  { key: 'pet', label: 'Pets', emoji: '🏠', color: '#E91E63' },
] as const;
