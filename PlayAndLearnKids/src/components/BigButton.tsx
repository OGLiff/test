// Large, rounded, child-friendly button component

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING, FONTS } from '../utils/theme';

interface BigButtonProps {
  title: string;
  emoji?: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function BigButton({
  title,
  emoji,
  onPress,
  color = COLORS.primary,
  textColor = COLORS.textOnPrimary,
  style,
  textStyle,
  disabled = false,
  size = 'medium',
}: BigButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 20, minWidth: 100 },
    medium: { paddingVertical: 16, paddingHorizontal: 32, minWidth: 160 },
    large: { paddingVertical: 20, paddingHorizontal: 40, minWidth: 220 },
  };

  const fontSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          sizeStyles[size],
          { backgroundColor: disabled ? COLORS.disabled : color },
          SHADOWS.medium,
          style,
        ]}
      >
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: fontSizes[size] },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  text: {
    ...FONTS.button,
  },
  emoji: {
    fontSize: 24,
  },
});
