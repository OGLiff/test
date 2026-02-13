// Puzzle Builder Game - arrange pieces to complete a picture

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PuzzleGameScreenProps {
  navigation: any;
}

const PUZZLES = [
  { name: 'Farm', emoji: '🏡', pieces: ['🐄', '🐔', '🐷', '🌾', '🌻', '🏡', '☀️', '🌈', '🐑'] },
  { name: 'Ocean', emoji: '🌊', pieces: ['🐬', '🐟', '🐙', '🦀', '🐚', '🌊', '⛵', '🐋', '🦈'] },
  { name: 'Space', emoji: '🚀', pieces: ['🌟', '🌙', '🚀', '🪐', '☄️', '👨‍🚀', '🛸', '🌍', '⭐'] },
  { name: 'Garden', emoji: '🌸', pieces: ['🌸', '🌺', '🌻', '🌹', '🦋', '🐝', '🌿', '🍀', '🌷'] },
  { name: 'Food', emoji: '🍕', pieces: ['🍕', '🍔', '🍟', '🌭', '🍩', '🧁', '🍪', '🎂', '🍦'] },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PuzzleGameScreen({ navigation }: PuzzleGameScreenProps) {
  const { dispatch } = useAppContext();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [available, setAvailable] = useState<string[]>(() =>
    shuffleArray(PUZZLES[0].pieces),
  );
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [completed, setCompleted] = useState(false);

  const puzzle = PUZZLES[currentPuzzle];

  const handlePieceSelect = (piece: string) => {
    setSelectedPiece(piece);
  };

  const handleSlotPress = (slotIdx: number) => {
    if (!selectedPiece || board[slotIdx] !== null) return;

    const correctPiece = puzzle.pieces[slotIdx];
    if (selectedPiece === correctPiece) {
      const newBoard = [...board];
      newBoard[slotIdx] = selectedPiece;
      setBoard(newBoard);

      const newAvailable = available.filter((p) => p !== selectedPiece);
      setAvailable(newAvailable);
      setSelectedPiece(null);

      dispatch({ type: 'EARN_COINS', amount: 1 });

      // Check if puzzle is complete
      if (newBoard.every((slot) => slot !== null)) {
        setCompleted(true);
        dispatch({ type: 'EARN_STARS', amount: 3 });
        dispatch({ type: 'EARN_COINS', amount: 5 });
        dispatch({ type: 'UPDATE_PROGRESS', module: 'puzzle', completed: currentPuzzle + 1 });
        dispatch({ type: 'UNLOCK_STICKER', sticker: `puzzle_${puzzle.name.toLowerCase()}` });
        setShowReward(true);
      }
    }
  };

  const nextPuzzle = () => {
    const next = (currentPuzzle + 1) % PUZZLES.length;
    setCurrentPuzzle(next);
    setBoard(Array(9).fill(null));
    setAvailable(shuffleArray(PUZZLES[next].pieces));
    setSelectedPiece(null);
    setCompleted(false);
  };

  const resetPuzzle = () => {
    setBoard(Array(9).fill(null));
    setAvailable(shuffleArray(puzzle.pieces));
    setSelectedPiece(null);
    setCompleted(false);
  };

  const gridSize = Math.min(SCREEN_WIDTH - SPACING.lg * 2, 320);
  const cellSize = (gridSize - SPACING.sm * 4) / 3;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Puzzle Builder"
        emoji="🧩"
        onBack={() => navigation.goBack()}
        color="#7C4DFF"
      />

      {/* Puzzle selector */}
      <View style={styles.puzzleSelector}>
        {PUZZLES.map((p, idx) => (
          <TouchableOpacity
            key={p.name}
            onPress={() => {
              setCurrentPuzzle(idx);
              setBoard(Array(9).fill(null));
              setAvailable(shuffleArray(p.pieces));
              setSelectedPiece(null);
              setCompleted(false);
            }}
            style={[
              styles.puzzlePill,
              currentPuzzle === idx && styles.puzzlePillActive,
            ]}
          >
            <Text style={styles.puzzlePillEmoji}>{p.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.puzzleName}>{puzzle.emoji} {puzzle.name} Puzzle</Text>

      {/* Puzzle Board */}
      <View style={[styles.board, { width: gridSize, height: gridSize }]}>
        {board.map((piece, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSlotPress(idx)}
            style={[
              styles.slot,
              { width: cellSize, height: cellSize },
              piece && styles.slotFilled,
              !piece && selectedPiece && styles.slotHighlight,
            ]}
          >
            {piece ? (
              <Text style={styles.slotEmoji}>{piece}</Text>
            ) : (
              <Text style={styles.slotHint}>{idx + 1}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Available Pieces */}
      <Text style={styles.availableLabel}>
        {selectedPiece ? `Selected: ${selectedPiece} - Tap a slot!` : 'Tap a piece to place it:'}
      </Text>
      <View style={styles.piecesRow}>
        {available.map((piece, idx) => (
          <TouchableOpacity
            key={`${piece}-${idx}`}
            onPress={() => handlePieceSelect(piece)}
            style={[
              styles.pieceButton,
              selectedPiece === piece && styles.pieceSelected,
            ]}
          >
            <Text style={styles.pieceEmoji}>{piece}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={resetPuzzle}>
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>
        {completed && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: COLORS.success }]}
            onPress={nextPuzzle}
          >
            <Text style={styles.controlText}>Next Puzzle</Text>
          </TouchableOpacity>
        )}
      </View>

      <RewardPopup
        visible={showReward}
        stars={3}
        coins={5}
        message={`${puzzle.name} puzzle complete!`}
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  puzzleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  puzzlePill: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puzzlePillActive: { backgroundColor: '#7C4DFF', ...SHADOWS.small },
  puzzlePillEmoji: { fontSize: 24 },
  puzzleName: { ...FONTS.subheading, textAlign: 'center', marginBottom: SPACING.sm },
  board: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
    justifyContent: 'center',
    alignContent: 'center',
  },
  slot: {
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#F0E6FF',
    borderWidth: 2,
    borderColor: '#D1C4E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  slotFilled: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.success,
    borderStyle: 'solid',
  },
  slotHighlight: {
    borderColor: '#7C4DFF',
    backgroundColor: '#EDE7F6',
  },
  slotEmoji: { fontSize: 36 },
  slotHint: { fontSize: 20, color: COLORS.disabled, fontWeight: 'bold' },
  availableLabel: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  piecesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  pieceButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  pieceSelected: {
    backgroundColor: '#EDE7F6',
    borderWidth: 2,
    borderColor: '#7C4DFF',
    transform: [{ scale: 1.1 }],
  },
  pieceEmoji: { fontSize: 28 },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  controlButton: {
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
  },
  controlText: { ...FONTS.button, color: COLORS.textLight },
});
