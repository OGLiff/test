// Rewards Screen - view collected stars, coins, stickers, and characters

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ScreenHeader from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RewardsScreenProps {
  navigation: any;
}

const ALL_STICKERS = [
  { id: 'alphabet_master', emoji: '🔤', name: 'ABC Master' },
  { id: 'memory_champ', emoji: '🧠', name: 'Memory Champ' },
  { id: 'puzzle_farm', emoji: '🏡', name: 'Farm Builder' },
  { id: 'puzzle_ocean', emoji: '🌊', name: 'Ocean Explorer' },
  { id: 'puzzle_space', emoji: '🚀', name: 'Space Adventurer' },
  { id: 'puzzle_garden', emoji: '🌸', name: 'Garden Grower' },
  { id: 'puzzle_food', emoji: '🍕', name: 'Food Fun' },
  { id: 'shape_sorter_3', emoji: '🔷', name: 'Shape Starter' },
  { id: 'shape_sorter_6', emoji: '💎', name: 'Shape Expert' },
  { id: 'shape_sorter_9', emoji: '🏆', name: 'Shape Master' },
  { id: 'number_explorer', emoji: '🔢', name: 'Number Ninja' },
  { id: 'color_expert', emoji: '🎨', name: 'Color Wizard' },
  { id: 'animal_lover', emoji: '🦁', name: 'Animal Friend' },
  { id: 'super_learner', emoji: '⭐', name: 'Super Learner' },
  { id: 'game_master', emoji: '🎮', name: 'Game Master' },
  { id: 'daily_streak_7', emoji: '🔥', name: '7 Day Streak' },
];

const ALL_CHARACTERS = [
  { id: 'default', emoji: '🧒', name: 'Learner' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut' },
  { id: 'princess', emoji: '👸', name: 'Princess' },
  { id: 'superhero', emoji: '🦸', name: 'Superhero' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard' },
  { id: 'pirate', emoji: '🏴‍☠️', name: 'Pirate' },
  { id: 'detective', emoji: '🕵️', name: 'Detective' },
  { id: 'robot', emoji: '🤖', name: 'Robot' },
];

export default function RewardsScreen({ navigation }: RewardsScreenProps) {
  const { state } = useAppContext();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="My Rewards"
        emoji="🏆"
        onBack={() => navigation.goBack()}
        color={COLORS.accent}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFF8E1' }]}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{state.rewards.stars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.statEmoji}>🪙</Text>
            <Text style={styles.statValue}>{state.rewards.coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>{state.rewards.unlockedStickers.length}</Text>
            <Text style={styles.statLabel}>Stickers</Text>
          </View>
        </View>

        {/* Module Progress */}
        <Text style={styles.sectionTitle}>Learning Progress</Text>
        {Object.entries(state.progress).map(([key, prog]) => {
          const percentage = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0;
          const moduleEmojis: Record<string, string> = {
            alphabet: '🔤',
            numbers: '🔢',
            colors: '🎨',
            shapes: '🔷',
            animals: '🦁',
            memory: '🃏',
            puzzle: '🧩',
            balloon: '🎈',
            shapeSorter: '🔷',
          };
          return (
            <View key={key} style={styles.progressItem}>
              <Text style={styles.progressEmoji}>{moduleEmojis[key] || '📚'}</Text>
              <View style={styles.progressInfo}>
                <Text style={styles.progressName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]}
                  />
                </View>
              </View>
              <Text style={styles.progressPercent}>{Math.round(percentage)}%</Text>
            </View>
          );
        })}

        {/* Sticker Collection */}
        <Text style={styles.sectionTitle}>Sticker Collection</Text>
        <View style={styles.stickerGrid}>
          {ALL_STICKERS.map((sticker) => {
            const unlocked = state.rewards.unlockedStickers.includes(sticker.id);
            return (
              <View
                key={sticker.id}
                style={[styles.stickerCard, !unlocked && styles.stickerLocked]}
              >
                <Text style={[styles.stickerEmoji, !unlocked && { opacity: 0.3 }]}>
                  {sticker.emoji}
                </Text>
                <Text style={[styles.stickerName, !unlocked && { color: COLORS.disabled }]}>
                  {sticker.name}
                </Text>
                {!unlocked && <Text style={styles.lockSmall}>🔒</Text>}
              </View>
            );
          })}
        </View>

        {/* Character Collection */}
        <Text style={styles.sectionTitle}>Characters</Text>
        <View style={styles.characterGrid}>
          {ALL_CHARACTERS.map((char) => {
            const unlocked = state.rewards.unlockedCharacters.includes(char.id);
            return (
              <View
                key={char.id}
                style={[styles.characterCard, !unlocked && styles.stickerLocked]}
              >
                <Text style={[styles.characterEmoji, !unlocked && { opacity: 0.3 }]}>
                  {char.emoji}
                </Text>
                <Text
                  style={[styles.characterName, !unlocked && { color: COLORS.disabled }]}
                >
                  {char.name}
                </Text>
                {!unlocked && <Text style={styles.lockSmall}>🔒</Text>}
              </View>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.md },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: (SCREEN_WIDTH - SPACING.md * 4) / 3,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statEmoji: { fontSize: 32, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 14, color: COLORS.textLight },
  sectionTitle: {
    ...FONTS.heading,
    marginVertical: SPACING.md,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
    gap: SPACING.md,
  },
  progressEmoji: { fontSize: 24 },
  progressInfo: { flex: 1 },
  progressName: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
  },
  progressPercent: { fontSize: 16, fontWeight: 'bold', color: COLORS.textLight },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  stickerCard: {
    width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm * 3) / 4,
    aspectRatio: 0.85,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    ...SHADOWS.small,
  },
  stickerLocked: {
    backgroundColor: '#F5F5F5',
  },
  stickerEmoji: { fontSize: 28, marginBottom: 2 },
  stickerName: { fontSize: 10, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  lockSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 10,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  characterCard: {
    width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.md * 3) / 4,
    aspectRatio: 0.85,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  characterEmoji: { fontSize: 36, marginBottom: 4 },
  characterName: { fontSize: 12, fontWeight: '600', color: COLORS.text },
});
