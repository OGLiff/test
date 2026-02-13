// Celebration popup when child earns rewards

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS } from '../utils/theme';

interface RewardPopupProps {
  visible: boolean;
  stars?: number;
  coins?: number;
  message?: string;
  onClose: () => void;
}

export default function RewardPopup({
  visible,
  stars = 0,
  coins = 0,
  message = 'Great job!',
  onClose,
}: RewardPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          speed: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <Text style={styles.celebration}>🎉</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.rewards}>
            {stars > 0 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={styles.rewardCount}>+{stars}</Text>
              </View>
            )}
            {coins > 0 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardCount}>+{coins}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '80%',
    ...SHADOWS.large,
  },
  celebration: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  message: {
    ...FONTS.heading,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.primary,
  },
  rewards: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  rewardItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rewardEmoji: {
    fontSize: 40,
  },
  rewardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  continueButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
  },
  continueText: {
    ...FONTS.button,
    color: COLORS.white,
  },
});
