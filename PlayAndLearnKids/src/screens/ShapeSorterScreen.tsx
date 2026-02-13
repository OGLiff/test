// Shape Sorter Game - drag shapes into matching slots

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { SHAPES_DATA } from '../data/colorsShapesData';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ShapeSorterScreenProps {
  navigation: any;
}

interface SortSlot {
  shape: string;
  color: string;
  emoji: string;
  filled: boolean;
}

function generateRound(): { slots: SortSlot[]; pieces: string[] } {
  const shuffled = [...SHAPES_DATA].sort(() => Math.random() - 0.5).slice(0, 4);
  const slots = shuffled.map((s) => ({
    shape: s.name,
    color: s.color,
    emoji: s.emoji,
    filled: false,
  }));
  const pieces = shuffled.map((s) => s.name).sort(() => Math.random() - 0.5);
  return { slots, pieces };
}

export default function ShapeSorterScreen({ navigation }: ShapeSorterScreenProps) {
  const { dispatch } = useAppContext();
  const [round, setRound] = useState(() => generateRound());
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [showReward, setShowReward] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handlePieceSelect = (shapeName: string) => {
    setSelectedPiece(shapeName);
    setFeedback(null);
  };

  const handleSlotPress = (slotIdx: number) => {
    if (!selectedPiece || round.slots[slotIdx].filled) return;

    const slot = round.slots[slotIdx];
    if (selectedPiece === slot.shape) {
      // Correct!
      setFeedback('correct');
      const newSlots = [...round.slots];
      newSlots[slotIdx] = { ...slot, filled: true };
      const newPieces = round.pieces.filter((p) => p !== selectedPiece);
      setRound({ slots: newSlots, pieces: newPieces });
      setSelectedPiece(null);
      setScore((s) => s + 1);
      dispatch({ type: 'EARN_COINS', amount: 1 });

      // Check if round is complete
      if (newPieces.length === 0) {
        dispatch({ type: 'EARN_STARS', amount: 2 });
        dispatch({ type: 'EARN_COINS', amount: 3 });
        dispatch({ type: 'UPDATE_PROGRESS', module: 'shapeSorter', completed: Math.min(roundNum, 10) });

        if (roundNum % 3 === 0) {
          dispatch({ type: 'UNLOCK_STICKER', sticker: `shape_sorter_${roundNum}` });
          setShowReward(true);
        }

        setTimeout(() => {
          setRound(generateRound());
          setRoundNum((r) => r + 1);
          setFeedback(null);
        }, 1000);
      }

      setTimeout(() => setFeedback(null), 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const slotSize = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Shape Sorter"
        emoji="🔷"
        onBack={() => navigation.goBack()}
        color="#4ECDC4"
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <Text style={styles.stat}>Round {roundNum}</Text>
        <Text style={styles.stat}>Score: {score}</Text>
      </View>

      {/* Feedback */}
      {feedback && (
        <View
          style={[
            styles.feedbackBar,
            { backgroundColor: feedback === 'correct' ? COLORS.success : COLORS.primary },
          ]}
        >
          <Text style={styles.feedbackText}>
            {feedback === 'correct' ? 'Correct! Great job!' : 'Try again!'}
          </Text>
        </View>
      )}

      {/* Instructions */}
      <Text style={styles.instruction}>
        {selectedPiece
          ? `Now tap the ${selectedPiece} slot!`
          : 'Tap a shape below, then place it!'}
      </Text>

      {/* Sorting Slots */}
      <View style={styles.slotsGrid}>
        {round.slots.map((slot, idx) => (
          <TouchableOpacity
            key={`${slot.shape}-${idx}`}
            onPress={() => handleSlotPress(idx)}
            style={[
              styles.slot,
              { width: slotSize, height: slotSize * 0.8 },
              slot.filled
                ? { backgroundColor: slot.color + '40', borderColor: COLORS.success }
                : { borderColor: slot.color },
              selectedPiece && !slot.filled && styles.slotHighlight,
            ]}
          >
            <Text style={[styles.slotEmoji, { opacity: slot.filled ? 1 : 0.3 }]}>
              {slot.emoji}
            </Text>
            <Text
              style={[
                styles.slotLabel,
                { color: slot.filled ? COLORS.success : slot.color },
              ]}
            >
              {slot.shape}
            </Text>
            {slot.filled && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Available Pieces */}
      <Text style={styles.piecesLabel}>Shapes to sort:</Text>
      <View style={styles.piecesRow}>
        {round.pieces.map((shapeName, idx) => {
          const shapeData = SHAPES_DATA.find((s) => s.name === shapeName)!;
          return (
            <TouchableOpacity
              key={`piece-${shapeName}-${idx}`}
              onPress={() => handlePieceSelect(shapeName)}
              style={[
                styles.piece,
                { backgroundColor: shapeData.color + '20', borderColor: shapeData.color },
                selectedPiece === shapeName && {
                  borderWidth: 3,
                  backgroundColor: shapeData.color + '40',
                  transform: [{ scale: 1.1 }],
                },
              ]}
            >
              <Text style={styles.pieceEmoji}>{shapeData.emoji}</Text>
              <Text style={[styles.pieceLabel, { color: shapeData.color }]}>
                {shapeName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <RewardPopup
        visible={showReward}
        stars={2}
        coins={3}
        message="Shape sorting champion!"
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
  },
  stat: { ...FONTS.body, fontWeight: '600', color: COLORS.textLight },
  feedbackBar: {
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  feedbackText: { ...FONTS.button, color: COLORS.white },
  instruction: {
    ...FONTS.subheading,
    textAlign: 'center',
    marginVertical: SPACING.md,
    color: COLORS.textLight,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  slot: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  slotHighlight: {
    borderStyle: 'solid',
    backgroundColor: '#E0F7FA',
  },
  slotEmoji: { fontSize: 40, marginBottom: 4 },
  slotLabel: { fontSize: 16, fontWeight: '600' },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { fontSize: 14, color: COLORS.white, fontWeight: 'bold' },
  piecesLabel: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  piecesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  piece: {
    width: 80,
    height: 90,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  pieceEmoji: { fontSize: 32, marginBottom: 4 },
  pieceLabel: { fontSize: 12, fontWeight: '600' },
});
