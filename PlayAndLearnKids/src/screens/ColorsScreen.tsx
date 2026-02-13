// Colors & Shapes Screen - identify colors, match shapes, drag-and-drop

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
import { COLORS_DATA, SHAPES_DATA } from '../data/colorsShapesData';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ColorsScreenProps {
  navigation: any;
}

type Tab = 'colors' | 'shapes' | 'match';

export default function ColorsScreen({ navigation }: ColorsScreenProps) {
  const { dispatch } = useAppContext();
  const [tab, setTab] = useState<Tab>('colors');
  const [selectedColor, setSelectedColor] = useState(COLORS_DATA[0]);
  const [selectedShape, setSelectedShape] = useState(SHAPES_DATA[0]);
  const [showReward, setShowReward] = useState(false);
  const [matchItems, setMatchItems] = useState<ReturnType<typeof generateMatch>>(() => generateMatch());
  const [matchScore, setMatchScore] = useState(0);
  const [matchAttempt, setMatchAttempt] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function generateMatch() {
    const shuffledColors = [...COLORS_DATA].sort(() => Math.random() - 0.5).slice(0, 4);
    const target = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
    return { options: shuffledColors, target };
  }

  const handleColorPress = (color: typeof COLORS_DATA[0]) => {
    setSelectedColor(color);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true, speed: 20 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  const handleMatchAttempt = (colorName: string) => {
    setMatchAttempt(colorName);
    if (colorName === matchItems.target.name) {
      const newScore = matchScore + 1;
      setMatchScore(newScore);
      dispatch({ type: 'EARN_COINS', amount: 1 });
      dispatch({ type: 'UPDATE_PROGRESS', module: 'colors', completed: Math.min(newScore, 10) });

      if (newScore % 5 === 0) {
        dispatch({ type: 'EARN_STARS', amount: 2 });
        setShowReward(true);
      }

      setTimeout(() => {
        setMatchItems(generateMatch());
        setMatchAttempt(null);
      }, 800);
    } else {
      setTimeout(() => setMatchAttempt(null), 600);
    }
  };

  const renderColorsTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Selected color display */}
      <Animated.View
        style={[
          styles.colorDisplay,
          { backgroundColor: selectedColor.hex, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.colorName}>{selectedColor.name}</Text>
        <View style={styles.colorObjects}>
          {selectedColor.objects.map((obj, idx) => (
            <Text key={idx} style={styles.colorEmoji}>{obj}</Text>
          ))}
        </View>
      </Animated.View>

      {/* Color grid */}
      <View style={styles.colorGrid}>
        {COLORS_DATA.map((color) => (
          <TouchableOpacity
            key={color.name}
            onPress={() => handleColorPress(color)}
            style={[
              styles.colorSwatch,
              { backgroundColor: color.hex },
              selectedColor.name === color.name && styles.colorSwatchSelected,
            ]}
          >
            <Text style={styles.swatchLabel}>{color.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderShapesTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Selected shape display */}
      <View style={[styles.shapeDisplay, { borderColor: selectedShape.color }]}>
        <Text style={styles.shapeEmoji}>{selectedShape.emoji}</Text>
        <Text style={[styles.shapeName, { color: selectedShape.color }]}>
          {selectedShape.name}
        </Text>
        <Text style={styles.shapeDescription}>{selectedShape.description}</Text>
        {selectedShape.sides > 0 && (
          <Text style={styles.shapeSides}>{selectedShape.sides} sides</Text>
        )}
      </View>

      {/* Shape grid */}
      <View style={styles.shapeGrid}>
        {SHAPES_DATA.map((shape) => (
          <TouchableOpacity
            key={shape.name}
            onPress={() => setSelectedShape(shape)}
            style={[
              styles.shapeCard,
              { backgroundColor: shape.color + '20', borderColor: shape.color },
              selectedShape.name === shape.name && { borderWidth: 3 },
            ]}
          >
            <Text style={styles.shapeCardEmoji}>{shape.emoji}</Text>
            <Text style={[styles.shapeCardName, { color: shape.color }]}>
              {shape.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderMatchTab = () => (
    <View style={styles.matchContainer}>
      <Text style={styles.matchScore}>Score: {matchScore}</Text>
      <Text style={styles.matchQuestion}>
        Find the color:
      </Text>
      <View
        style={[
          styles.matchTarget,
          { backgroundColor: matchItems.target.hex },
        ]}
      >
        <Text style={styles.matchTargetText}>{matchItems.target.name}</Text>
      </View>

      <View style={styles.matchOptions}>
        {matchItems.options.map((color) => {
          const isCorrect = matchAttempt === color.name && color.name === matchItems.target.name;
          const isWrong = matchAttempt === color.name && color.name !== matchItems.target.name;

          return (
            <TouchableOpacity
              key={color.name}
              onPress={() => handleMatchAttempt(color.name)}
              disabled={matchAttempt !== null}
              style={[
                styles.matchOption,
                { backgroundColor: color.hex },
                isCorrect && styles.matchCorrect,
                isWrong && styles.matchWrong,
              ]}
            >
              <Text style={styles.matchOptionEmoji}>{color.emoji}</Text>
              <Text style={styles.matchOptionText}>{color.name}</Text>
              {isCorrect && <Text style={styles.resultIcon}>✓</Text>}
              {isWrong && <Text style={styles.resultIcon}>✗</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Colors & Shapes"
        emoji="🎨"
        onBack={() => navigation.goBack()}
        color={COLORS.colors}
      />

      {/* Tab selector */}
      <View style={styles.tabs}>
        {(['colors', 'shapes', 'match'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'colors' ? '🎨 Colors' : t === 'shapes' ? '🔷 Shapes' : '🎯 Match'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'colors' && renderColorsTab()}
      {tab === 'shapes' && renderShapesTab()}
      {tab === 'match' && renderMatchTab()}

      <RewardPopup
        visible={showReward}
        stars={2}
        coins={1}
        message="Amazing matching!"
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.colors },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: COLORS.white },

  // Colors tab
  colorDisplay: {
    height: 180,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  colorName: { fontSize: 36, fontWeight: 'bold', color: COLORS.white, marginBottom: SPACING.sm },
  colorObjects: { flexDirection: 'row', gap: SPACING.md },
  colorEmoji: { fontSize: 36 },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  colorSwatch: {
    width: (SCREEN_WIDTH - SPACING.md * 7) / 5,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: COLORS.white,
    transform: [{ scale: 1.1 }],
  },
  swatchLabel: { fontSize: 28 },

  // Shapes tab
  shapeDisplay: {
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  shapeEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  shapeName: { ...FONTS.heading },
  shapeDescription: { ...FONTS.body, color: COLORS.textLight, marginTop: SPACING.xs },
  shapeSides: { fontSize: 16, color: COLORS.textLight, marginTop: SPACING.xs, fontWeight: '600' },
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  shapeCard: {
    width: (SCREEN_WIDTH - SPACING.md * 5) / 4,
    aspectRatio: 0.85,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },
  shapeCardEmoji: { fontSize: 32, marginBottom: 4 },
  shapeCardName: { fontSize: 12, fontWeight: '600' },

  // Match tab
  matchContainer: { flex: 1, alignItems: 'center', paddingTop: SPACING.lg },
  matchScore: { ...FONTS.subheading, color: COLORS.textLight, marginBottom: SPACING.md },
  matchQuestion: { ...FONTS.heading, marginBottom: SPACING.md },
  matchTarget: {
    width: SCREEN_WIDTH * 0.6,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  matchTargetText: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  matchOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  matchOption: {
    width: (SCREEN_WIDTH - SPACING.lg * 3) / 2,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  matchCorrect: { borderWidth: 4, borderColor: COLORS.success },
  matchWrong: { borderWidth: 4, borderColor: COLORS.primary, opacity: 0.6 },
  matchOptionEmoji: { fontSize: 24 },
  matchOptionText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginTop: 4 },
  resultIcon: { position: 'absolute', top: 4, right: 8, fontSize: 24, color: COLORS.white },
});
