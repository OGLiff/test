// Alphabet Learning Screen - tap letters to hear pronunciation
// Shows uppercase, lowercase, example words with images

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { ALPHABET_DATA, LetterData } from '../data/alphabetData';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlphabetScreenProps {
  navigation: any;
}

export default function AlphabetScreen({ navigation }: AlphabetScreenProps) {
  const { dispatch } = useAppContext();
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [viewedLetters, setViewedLetters] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handleLetterPress = (letter: LetterData) => {
    setSelectedLetter(letter);

    // Track viewed letters
    const newViewed = new Set(viewedLetters);
    newViewed.add(letter.letter);
    setViewedLetters(newViewed);

    // Update progress
    dispatch({ type: 'UPDATE_PROGRESS', module: 'alphabet', completed: newViewed.size });

    // Animate the selected letter
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();

    // Bounce the emoji
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();

    // Award stars every 5 letters
    if (newViewed.size % 5 === 0 && newViewed.size > 0) {
      dispatch({ type: 'EARN_STARS', amount: 1 });
      setShowReward(true);
    }

    // Completed all letters
    if (newViewed.size === 26) {
      dispatch({ type: 'EARN_STARS', amount: 5 });
      dispatch({ type: 'EARN_COINS', amount: 10 });
      dispatch({ type: 'UNLOCK_STICKER', sticker: 'alphabet_master' });
      setShowReward(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="ABC Letters"
        emoji="🔤"
        onBack={() => navigation.goBack()}
        color={COLORS.alphabet}
      />

      {/* Selected Letter Display */}
      <View style={[styles.displayArea, { backgroundColor: selectedLetter?.color || COLORS.alphabet }]}>
        {selectedLetter ? (
          <Animated.View
            style={[styles.displayContent, { transform: [{ scale: scaleAnim }] }]}
          >
            <View style={styles.letterRow}>
              <Text style={styles.bigLetter}>{selectedLetter.letter}</Text>
              <Text style={styles.bigLetterLower}>{selectedLetter.lowercase}</Text>
            </View>
            <Animated.Text
              style={[styles.wordEmoji, { transform: [{ translateY: bounceAnim }] }]}
            >
              {selectedLetter.emoji}
            </Animated.Text>
            <Text style={styles.word}>
              {selectedLetter.letter} is for {selectedLetter.word}
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.displayContent}>
            <Text style={styles.promptEmoji}>👆</Text>
            <Text style={styles.promptText}>Tap a letter to learn!</Text>
          </View>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {viewedLetters.size} / 26 letters explored
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(viewedLetters.size / 26) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Letter Grid */}
      <ScrollView contentContainerStyle={styles.letterGrid}>
        {ALPHABET_DATA.map((letter) => {
          const isViewed = viewedLetters.has(letter.letter);
          const isSelected = selectedLetter?.letter === letter.letter;
          return (
            <TouchableOpacity
              key={letter.letter}
              onPress={() => handleLetterPress(letter)}
              style={[
                styles.letterCard,
                { backgroundColor: letter.color },
                isSelected && styles.letterCardSelected,
                isViewed && styles.letterCardViewed,
              ]}
            >
              <Text style={styles.letterText}>{letter.letter}</Text>
              <Text style={styles.letterSmall}>{letter.lowercase}</Text>
              {isViewed && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <RewardPopup
        visible={showReward}
        stars={viewedLetters.size === 26 ? 5 : 1}
        coins={viewedLetters.size === 26 ? 10 : 0}
        message={
          viewedLetters.size === 26
            ? 'You learned ALL letters!'
            : 'Keep going!'
        }
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  displayArea: {
    height: 200,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  displayContent: {
    alignItems: 'center',
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.md,
  },
  bigLetter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bigLetterLower: {
    fontSize: 56,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  wordEmoji: {
    fontSize: 48,
    marginVertical: SPACING.sm,
  },
  word: {
    ...FONTS.subheading,
    color: COLORS.white,
  },
  promptEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  promptText: {
    ...FONTS.subheading,
    color: COLORS.white,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.alphabet,
    borderRadius: BORDER_RADIUS.round,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  letterCard: {
    width: (SCREEN_WIDTH - SPACING.sm * 14) / 6,
    aspectRatio: 0.85,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.xs,
    ...SHADOWS.small,
  },
  letterCardSelected: {
    borderWidth: 3,
    borderColor: COLORS.white,
    transform: [{ scale: 1.05 }],
  },
  letterCardViewed: {
    opacity: 0.85,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  letterSmall: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -2,
  },
  checkMark: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
