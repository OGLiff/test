// Reusable screen header with back button and title

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';

interface ScreenHeaderProps {
  title: string;
  emoji?: string;
  onBack: () => void;
  color?: string;
  rightElement?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  emoji,
  onBack,
  color = COLORS.primary,
  rightElement,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backIcon}>{'◀'}</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    ...FONTS.subheading,
    color: COLORS.white,
  },
  rightContainer: {
    width: 44,
  },
  placeholder: {
    width: 44,
  },
});
