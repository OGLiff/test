// Animals & Sounds Screen - animal gallery with sounds and fun facts

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
import { ANIMALS_DATA, ANIMAL_CATEGORIES, AnimalData } from '../data/animalsData';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimalsScreenProps {
  navigation: any;
}

export default function AnimalsScreen({ navigation }: AnimalsScreenProps) {
  const { dispatch } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('farm');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null);
  const [visitedAnimals, setVisitedAnimals] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const filteredAnimals = ANIMALS_DATA.filter((a) => a.category === selectedCategory);

  const handleAnimalPress = (animal: AnimalData) => {
    setSelectedAnimal(animal);
    setShowSound(false);

    const newVisited = new Set(visitedAnimals);
    newVisited.add(animal.name);
    setVisitedAnimals(newVisited);

    dispatch({ type: 'UPDATE_PROGRESS', module: 'animals', completed: newVisited.size });

    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.3, useNativeDriver: true, speed: 20 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();

    if (newVisited.size % 5 === 0) {
      dispatch({ type: 'EARN_STARS', amount: 1 });
      dispatch({ type: 'EARN_COINS', amount: 3 });
      setShowReward(true);
    }
  };

  const handleSoundPress = () => {
    setShowSound(true);
    // Shake animation for sound effect feel
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Animals"
        emoji="🦁"
        onBack={() => navigation.goBack()}
        color={COLORS.animals}
      />

      {/* Category selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {ANIMAL_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            style={[
              styles.categoryPill,
              { backgroundColor: selectedCategory === cat.key ? cat.color : COLORS.border },
            ]}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                { color: selectedCategory === cat.key ? COLORS.white : COLORS.textLight },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Animal Display */}
      {selectedAnimal ? (
        <Animated.View
          style={[
            styles.animalDisplay,
            { backgroundColor: selectedAnimal.color + '20', borderColor: selectedAnimal.color },
            { transform: [{ scale: bounceAnim }, { translateX: shakeAnim }] },
          ]}
        >
          <Text style={styles.animalEmoji}>{selectedAnimal.emoji}</Text>
          <Text style={[styles.animalName, { color: selectedAnimal.color }]}>
            {selectedAnimal.name}
          </Text>

          <TouchableOpacity style={styles.soundButton} onPress={handleSoundPress}>
            <Text style={styles.soundIcon}>🔊</Text>
            <Text style={styles.soundLabel}>Hear Sound</Text>
          </TouchableOpacity>

          {showSound && (
            <View style={styles.soundBubble}>
              <Text style={styles.soundText}>"{selectedAnimal.sound}"</Text>
            </View>
          )}

          <View style={styles.funFactBox}>
            <Text style={styles.funFactLabel}>Fun Fact!</Text>
            <Text style={styles.funFactText}>{selectedAnimal.funFact}</Text>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.animalDisplay}>
          <Text style={styles.placeholderEmoji}>👆</Text>
          <Text style={styles.placeholderText}>Tap an animal to learn about it!</Text>
        </View>
      )}

      {/* Animal Grid */}
      <ScrollView contentContainerStyle={styles.animalGrid}>
        {filteredAnimals.map((animal) => {
          const isVisited = visitedAnimals.has(animal.name);
          const isSelected = selectedAnimal?.name === animal.name;
          return (
            <TouchableOpacity
              key={animal.name}
              onPress={() => handleAnimalPress(animal)}
              style={[
                styles.animalCard,
                { backgroundColor: animal.color + '20', borderColor: animal.color },
                isSelected && { borderWidth: 3 },
              ]}
            >
              <Text style={styles.animalCardEmoji}>{animal.emoji}</Text>
              <Text style={[styles.animalCardName, { color: animal.color }]}>
                {animal.name}
              </Text>
              {isVisited && (
                <View style={[styles.visitedBadge, { backgroundColor: animal.color }]}>
                  <Text style={styles.visitedCheck}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <RewardPopup
        visible={showReward}
        stars={1}
        coins={3}
        message="You're an animal expert!"
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  categoryRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.xs,
    ...SHADOWS.small,
  },
  categoryEmoji: { fontSize: 20 },
  categoryLabel: { fontSize: 16, fontWeight: '600' },
  animalDisplay: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  animalEmoji: { fontSize: 72, marginBottom: SPACING.sm },
  animalName: { ...FONTS.heading, marginBottom: SPACING.md },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.sm,
  },
  soundIcon: { fontSize: 20 },
  soundLabel: { ...FONTS.button, color: COLORS.white },
  soundBubble: {
    backgroundColor: COLORS.accentLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  soundText: { ...FONTS.subheading, color: COLORS.text, fontStyle: 'italic' },
  funFactBox: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  funFactLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  funFactText: { ...FONTS.body, color: COLORS.text },
  placeholderEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  placeholderText: { ...FONTS.subheading, color: COLORS.textLight },
  animalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: SPACING.sm,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  animalCard: {
    width: (SCREEN_WIDTH - SPACING.sm * 8) / 3,
    aspectRatio: 0.9,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },
  animalCardEmoji: { fontSize: 36, marginBottom: 4 },
  animalCardName: { fontSize: 13, fontWeight: '600' },
  visitedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitedCheck: { fontSize: 11, color: COLORS.white, fontWeight: 'bold' },
});
