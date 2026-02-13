// Memory Matching Game - flip cards to find matching pairs

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EMOJIS = ['🍎', '🐻', '🌟', '🎈', '🦋', '🌺', '🐬', '🎵', '🍓', '🦁', '🐢', '🌈'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_CONFIG: Record<Difficulty, { pairs: number; cols: number }> = {
  easy: { pairs: 4, cols: 4 },
  medium: { pairs: 6, cols: 4 },
  hard: { pairs: 8, cols: 4 },
};

function generateCards(difficulty: Difficulty): Card[] {
  const { pairs } = GRID_CONFIG[difficulty];
  const selected = EMOJIS.slice(0, pairs);
  const doubled = [...selected, ...selected];
  const shuffled = doubled.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, idx) => ({
    id: idx,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

interface MemoryGameScreenProps {
  navigation: any;
}

export default function MemoryGameScreen({ navigation }: MemoryGameScreenProps) {
  const { dispatch } = useAppContext();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>(() => generateCards('easy'));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const flipAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  function resetGame() {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameComplete(false);
    flipAnims.length = 0;
    newCards.forEach(() => flipAnims.push(new Animated.Value(0)));
  }

  const handleCardPress = (cardId: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards[cardId];
    if (card.isFlipped || card.isMatched) return;

    // Flip animation
    Animated.spring(flipAnims[cardId], {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );
    setCards(newCards);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c,
            ),
          );
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);
          setFlippedIds([]);
          dispatch({ type: 'EARN_COINS', amount: 1 });

          if (newMatched === GRID_CONFIG[difficulty].pairs) {
            setGameComplete(true);
            dispatch({ type: 'EARN_STARS', amount: 3 });
            dispatch({ type: 'EARN_COINS', amount: 5 });
            dispatch({ type: 'UPDATE_PROGRESS', module: 'memory', completed: Math.min(matchedPairs + 1, 10) });
            dispatch({ type: 'UNLOCK_STICKER', sticker: 'memory_champ' });
            setShowReward(true);
          }
        }, 300);
      } else {
        // No match - flip back
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(flipAnims[first], { toValue: 0, useNativeDriver: true, speed: 20 }),
            Animated.spring(flipAnims[second], { toValue: 0, useNativeDriver: true, speed: 20 }),
          ]).start();
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isFlipped: false } : c,
            ),
          );
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  const { cols } = GRID_CONFIG[difficulty];
  const cardSize = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm * (cols + 1)) / cols;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Memory Match"
        emoji="🃏"
        onBack={() => navigation.goBack()}
        color="#FF6B6B"
      />

      {/* Difficulty selector */}
      <View style={styles.difficultyRow}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDifficulty(d)}
            style={[styles.diffPill, difficulty === d && styles.diffPillActive]}
          >
            <Text style={[styles.diffText, difficulty === d && styles.diffTextActive]}>
              {d === 'easy' ? '😊 Easy' : d === 'medium' ? '🤔 Medium' : '🧠 Hard'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Text style={styles.stat}>Moves: {moves}</Text>
        <Text style={styles.stat}>
          Pairs: {matchedPairs}/{GRID_CONFIG[difficulty].pairs}
        </Text>
      </View>

      {/* Card Grid */}
      <View style={styles.grid}>
        {cards.map((card) => {
          const flipAnim = flipAnims[card.id];
          const frontInterpolate = flipAnim
            ? flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
            : '0deg';
          const backInterpolate = flipAnim
            ? flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })
            : '180deg';

          return (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.id)}
              disabled={card.isMatched || card.isFlipped}
              style={{ width: cardSize, height: cardSize * 1.1, margin: SPACING.xs }}
            >
              {/* Card Back (face down) */}
              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  { width: cardSize, height: cardSize * 1.1 },
                  { transform: [{ rotateY: frontInterpolate }] },
                ]}
              >
                <Text style={styles.cardBackIcon}>?</Text>
              </Animated.View>

              {/* Card Front (face up) */}
              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardFront,
                  { width: cardSize, height: cardSize * 1.1 },
                  card.isMatched && styles.cardMatched,
                  { transform: [{ rotateY: backInterpolate }] },
                ]}
              >
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Restart button */}
      {gameComplete && (
        <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
          <Text style={styles.restartText}>Play Again!</Text>
        </TouchableOpacity>
      )}

      <RewardPopup
        visible={showReward}
        stars={3}
        coins={5}
        message={`Completed in ${moves} moves!`}
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  difficultyRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  diffPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  diffPillActive: { backgroundColor: '#FF6B6B' },
  diffText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  diffTextActive: { color: COLORS.white },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
  },
  stat: { ...FONTS.body, color: COLORS.textLight, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  cardFace: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  cardBackIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardFront: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  cardMatched: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.success,
  },
  cardEmoji: { fontSize: 36 },
  restartButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  restartText: { ...FONTS.button, color: COLORS.white },
});
