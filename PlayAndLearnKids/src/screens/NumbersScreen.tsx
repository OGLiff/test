// Numbers & Counting Screen - counting games, tap objects, number tracing

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
import { NUMBERS_DATA } from '../data/numbersData';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NumbersScreenProps {
  navigation: any;
}

type Mode = 'explore' | 'counting' | 'tracing';

export default function NumbersScreen({ navigation }: NumbersScreenProps) {
  const { dispatch } = useAppContext();
  const [mode, setMode] = useState<Mode>('explore');
  const [selectedNumber, setSelectedNumber] = useState(NUMBERS_DATA[0]);
  const [countTaps, setCountTaps] = useState(0);
  const [viewedNumbers, setViewedNumbers] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [tracingPoints, setTracingPoints] = useState<{ x: number; y: number }[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNumberPress = (num: typeof NUMBERS_DATA[0]) => {
    setSelectedNumber(num);
    setCountTaps(0);
    setTracingPoints([]);

    const newViewed = new Set(viewedNumbers);
    newViewed.add(num.number);
    setViewedNumbers(newViewed);
    dispatch({ type: 'UPDATE_PROGRESS', module: 'numbers', completed: newViewed.size });

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true, speed: 20 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();

    if (newViewed.size % 5 === 0) {
      dispatch({ type: 'EARN_STARS', amount: 1 });
      setShowReward(true);
    }
  };

  const handleObjectTap = () => {
    if (countTaps < selectedNumber.number) {
      const newCount = countTaps + 1;
      setCountTaps(newCount);

      if (newCount === selectedNumber.number) {
        dispatch({ type: 'EARN_STARS', amount: 1 });
        dispatch({ type: 'EARN_COINS', amount: 2 });
        setShowReward(true);
      }
    }
  };

  const renderExploreMode = () => (
    <View style={styles.displayArea}>
      <Animated.View style={[styles.displayContent, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.bigNumber, { color: selectedNumber.color }]}>
          {selectedNumber.number}
        </Text>
        <Text style={styles.numberWord}>{selectedNumber.word}</Text>
        <View style={styles.objectsRow}>
          {selectedNumber.objects.map((obj, idx) => (
            <Text key={idx} style={styles.objectEmoji}>{obj}</Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const renderCountingMode = () => (
    <View style={styles.displayArea}>
      <Text style={styles.countingTitle}>
        Tap to count to {selectedNumber.number}!
      </Text>
      <Text style={[styles.countDisplay, { color: selectedNumber.color }]}>
        {countTaps} / {selectedNumber.number}
      </Text>
      <View style={styles.countingGrid}>
        {selectedNumber.objects.map((obj, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={handleObjectTap}
            disabled={countTaps > idx}
            style={[
              styles.countObject,
              countTaps > idx && styles.countObjectTapped,
            ]}
          >
            <Text style={[styles.countEmoji, countTaps > idx && styles.countEmojiTapped]}>
              {obj}
            </Text>
            {countTaps > idx && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{idx + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {countTaps === selectedNumber.number && (
        <Text style={styles.successText}>You counted to {selectedNumber.number}!</Text>
      )}
    </View>
  );

  const renderTracingMode = () => (
    <View style={styles.displayArea}>
      <Text style={styles.tracingTitle}>Trace the number!</Text>
      <View
        style={styles.tracingCanvas}
        onTouchMove={(e) => {
          const { locationX, locationY } = e.nativeEvent;
          setTracingPoints((prev) => [...prev, { x: locationX, y: locationY }]);
        }}
        onTouchEnd={() => {
          if (tracingPoints.length > 10) {
            dispatch({ type: 'EARN_COINS', amount: 1 });
          }
        }}
      >
        <Text style={[styles.traceNumber, { color: selectedNumber.color + '30' }]}>
          {selectedNumber.number}
        </Text>
        {tracingPoints.map((point, idx) => (
          <View
            key={idx}
            style={[
              styles.traceDot,
              {
                left: point.x - 6,
                top: point.y - 6,
                backgroundColor: selectedNumber.color,
              },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setTracingPoints([])}
      >
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Numbers"
        emoji="🔢"
        onBack={() => navigation.goBack()}
        color={COLORS.numbers}
      />

      {/* Mode Tabs */}
      <View style={styles.modeTabs}>
        {(['explore', 'counting', 'tracing'] as Mode[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => { setMode(m); setCountTaps(0); setTracingPoints([]); }}
            style={[styles.modeTab, mode === m && styles.modeTabActive]}
          >
            <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
              {m === 'explore' ? '🔍 Explore' : m === 'counting' ? '👆 Count' : '✏️ Trace'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display Area */}
      {mode === 'explore' && renderExploreMode()}
      {mode === 'counting' && renderCountingMode()}
      {mode === 'tracing' && renderTracingMode()}

      {/* Number Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.numberRow}
      >
        {NUMBERS_DATA.map((num) => (
          <TouchableOpacity
            key={num.number}
            onPress={() => handleNumberPress(num)}
            style={[
              styles.numberPill,
              { backgroundColor: num.color },
              selectedNumber.number === num.number && styles.numberPillSelected,
            ]}
          >
            <Text style={styles.numberPillText}>{num.number}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <RewardPopup
        visible={showReward}
        stars={1}
        coins={2}
        message={countTaps === selectedNumber.number ? `You counted to ${selectedNumber.number}!` : 'Great exploring!'}
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  modeTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  modeTabActive: { backgroundColor: COLORS.numbers },
  modeTabText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  modeTabTextActive: { color: COLORS.white },
  displayArea: {
    flex: 1,
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  displayContent: { alignItems: 'center' },
  bigNumber: { fontSize: 96, fontWeight: 'bold' },
  numberWord: { ...FONTS.heading, color: COLORS.textLight, marginBottom: SPACING.md },
  objectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    maxWidth: SCREEN_WIDTH * 0.7,
  },
  objectEmoji: { fontSize: 32 },
  countingTitle: { ...FONTS.subheading, marginBottom: SPACING.md },
  countDisplay: { fontSize: 48, fontWeight: 'bold', marginBottom: SPACING.md },
  countingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  countObject: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countObjectTapped: { backgroundColor: COLORS.secondaryLight },
  countEmoji: { fontSize: 28 },
  countEmojiTapped: { opacity: 0.5 },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: 'bold' },
  successText: {
    ...FONTS.subheading,
    color: COLORS.success,
    marginTop: SPACING.md,
  },
  tracingTitle: { ...FONTS.subheading, marginBottom: SPACING.md },
  tracingCanvas: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: COLORS.accentLight,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  traceNumber: { fontSize: 180, fontWeight: 'bold', position: 'absolute' },
  traceDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  clearButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
  },
  clearText: { ...FONTS.body, color: COLORS.textLight },
  numberRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  numberPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  numberPillSelected: {
    borderWidth: 3,
    borderColor: COLORS.white,
    transform: [{ scale: 1.15 }],
  },
  numberPillText: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
});
