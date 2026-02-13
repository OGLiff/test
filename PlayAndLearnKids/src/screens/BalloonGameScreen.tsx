// Balloon Pop Counting Game - pop balloons in number order

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ScreenHeader from '../components/ScreenHeader';
import RewardPopup from '../components/RewardPopup';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BalloonGameScreenProps {
  navigation: any;
}

interface Balloon {
  id: number;
  number: number;
  x: number;
  y: number;
  color: string;
  popped: boolean;
  floatAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

const BALLOON_COLORS = [
  '#FF6B6B', '#FF8A65', '#FFD54F', '#66BB6A',
  '#42A5F5', '#7C4DFF', '#EC407A', '#26A69A',
  '#FF7043', '#AB47BC',
];

function generateBalloons(count: number): Balloon[] {
  const positions: Balloon[] = [];
  const areaWidth = SCREEN_WIDTH - 80;
  const areaHeight = SCREEN_HEIGHT * 0.45;

  for (let i = 1; i <= count; i++) {
    positions.push({
      id: i,
      number: i,
      x: Math.random() * areaWidth + 20,
      y: Math.random() * areaHeight + 20,
      color: BALLOON_COLORS[(i - 1) % BALLOON_COLORS.length],
      popped: false,
      floatAnim: new Animated.Value(0),
      scaleAnim: new Animated.Value(1),
    });
  }
  return positions;
}

export default function BalloonGameScreen({ navigation }: BalloonGameScreenProps) {
  const { dispatch } = useAppContext();
  const [level, setLevel] = useState(5); // balloons count
  const [balloons, setBalloons] = useState<Balloon[]>(() => generateBalloons(5));
  const [nextNumber, setNextNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    // Start floating animations
    balloons.forEach((balloon) => {
      if (!balloon.popped) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(balloon.floatAnim, {
              toValue: 1,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(balloon.floatAnim, {
              toValue: 0,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }
    });
  }, [balloons]);

  const handleBalloonPop = (balloon: Balloon) => {
    if (balloon.popped || balloon.number !== nextNumber) {
      // Wrong balloon - shake
      Animated.sequence([
        Animated.timing(balloon.scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(balloon.scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      return;
    }

    // Pop animation
    Animated.timing(balloon.scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b)),
    );

    const next = nextNumber + 1;
    setNextNumber(next);
    setScore((s) => s + 1);
    dispatch({ type: 'EARN_COINS', amount: 1 });

    if (next > level) {
      setGameComplete(true);
      dispatch({ type: 'EARN_STARS', amount: 2 });
      dispatch({ type: 'EARN_COINS', amount: 5 });
      dispatch({ type: 'UPDATE_PROGRESS', module: 'balloon', completed: Math.min(score + 1, 10) });
      setShowReward(true);
    }
  };

  const restartGame = (newLevel?: number) => {
    const lvl = newLevel || level;
    setLevel(lvl);
    setBalloons(generateBalloons(lvl));
    setNextNumber(1);
    setGameComplete(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Balloon Pop"
        emoji="🎈"
        onBack={() => navigation.goBack()}
        color="#42A5F5"
      />

      {/* Level selector */}
      <View style={styles.levelRow}>
        {[5, 8, 10].map((lvl) => (
          <TouchableOpacity
            key={lvl}
            onPress={() => restartGame(lvl)}
            style={[styles.levelPill, level === lvl && styles.levelPillActive]}
          >
            <Text style={[styles.levelText, level === lvl && styles.levelTextActive]}>
              {lvl === 5 ? '😊 Easy' : lvl === 8 ? '🤔 Medium' : '🧠 Hard'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Instructions */}
      <View style={styles.instructionBar}>
        <Text style={styles.instructionText}>
          Pop balloon number: <Text style={styles.nextNum}>{nextNumber}</Text>
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {/* Balloon Area */}
      <View style={styles.balloonArea}>
        {balloons.map((balloon) => {
          if (balloon.popped) return null;
          const floatY = balloon.floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -15],
          });

          return (
            <Animated.View
              key={balloon.id}
              style={[
                styles.balloonContainer,
                {
                  left: balloon.x,
                  top: balloon.y,
                  transform: [
                    { translateY: floatY },
                    { scale: balloon.scaleAnim },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleBalloonPop(balloon)}
                style={[styles.balloon, { backgroundColor: balloon.color }]}
              >
                <Text style={styles.balloonNumber}>{balloon.number}</Text>
              </TouchableOpacity>
              <View
                style={[styles.balloonString, { borderColor: balloon.color }]}
              />
            </Animated.View>
          );
        })}

        {/* Pop effects */}
        {balloons
          .filter((b) => b.popped)
          .map((balloon) => (
            <View
              key={`pop-${balloon.id}`}
              style={[styles.popEffect, { left: balloon.x + 15, top: balloon.y + 15 }]}
            >
              <Text style={styles.popText}>POP!</Text>
            </View>
          ))}
      </View>

      {/* Game Complete */}
      {gameComplete && (
        <View style={styles.completeOverlay}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={() => restartGame()}
          >
            <Text style={styles.playAgainText}>🎈 Play Again!</Text>
          </TouchableOpacity>
        </View>
      )}

      <RewardPopup
        visible={showReward}
        stars={2}
        coins={5}
        message={`You popped all ${level} balloons!`}
        onClose={() => setShowReward(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  levelRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  levelPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  levelPillActive: { backgroundColor: '#42A5F5' },
  levelText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  levelTextActive: { color: COLORS.white },
  instructionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  instructionText: { ...FONTS.body },
  nextNum: { fontWeight: 'bold', color: '#42A5F5', fontSize: 24 },
  scoreText: { ...FONTS.body, fontWeight: '600', color: COLORS.textLight },
  balloonArea: {
    flex: 1,
    margin: SPACING.md,
    position: 'relative',
  },
  balloonContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  balloon: {
    width: 60,
    height: 72,
    borderRadius: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  balloonNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  balloonString: {
    width: 0,
    height: 20,
    borderLeftWidth: 2,
  },
  popEffect: {
    position: 'absolute',
  },
  popText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  completeOverlay: {
    position: 'absolute',
    bottom: SPACING.xxl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
  },
  playAgainText: { ...FONTS.button, color: COLORS.white, fontSize: 22 },
});
