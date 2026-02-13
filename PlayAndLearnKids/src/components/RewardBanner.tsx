// Reward banner showing stars and coins at top of screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { useAppContext } from '../context/AppContext';

export default function RewardBanner() {
  const { state } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: '#FFF8E1' }]}>
        <Text style={styles.emoji}>⭐</Text>
        <Text style={styles.count}>{state.rewards.stars}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
        <Text style={styles.emoji}>🪙</Text>
        <Text style={styles.count}>{state.rewards.coins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
    gap: SPACING.xs,
  },
  emoji: {
    fontSize: 20,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
