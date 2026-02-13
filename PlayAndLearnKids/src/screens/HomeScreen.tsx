// Home Screen - bright, colorful hub with large module cards

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ModuleCard from '../components/ModuleCard';
import RewardBanner from '../components/RewardBanner';
import ParentGate from '../components/ParentGate';
import { useAppContext } from '../context/AppContext';

interface HomeScreenProps {
  navigation: any;
}

const MODULES = [
  { id: 'alphabet', title: 'ABC Letters', emoji: '🔤', color: COLORS.alphabet, screen: 'Alphabet' },
  { id: 'numbers', title: 'Numbers', emoji: '🔢', color: COLORS.numbers, screen: 'Numbers' },
  { id: 'colors', title: 'Colors', emoji: '🎨', color: COLORS.colors, screen: 'Colors' },
  { id: 'animals', title: 'Animals', emoji: '🦁', color: COLORS.animals, screen: 'Animals' },
];

const GAMES = [
  { id: 'memory', title: 'Memory Match', emoji: '🃏', color: '#FF6B6B', screen: 'MemoryGame' },
  { id: 'puzzle', title: 'Puzzle', emoji: '🧩', color: '#7C4DFF', screen: 'PuzzleGame' },
  { id: 'balloon', title: 'Balloon Pop', emoji: '🎈', color: '#42A5F5', screen: 'BalloonGame' },
  { id: 'shapeSorter', title: 'Shape Sorter', emoji: '🔷', color: '#4ECDC4', screen: 'ShapeSorterGame' },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { state, dispatch } = useAppContext();
  const [showParentGate, setShowParentGate] = useState(false);

  const getProgress = (moduleId: string) => {
    const prog = state.progress[moduleId];
    if (!prog || prog.total === 0) return 0;
    return (prog.completed / prog.total) * 100;
  };

  const isLocked = (moduleId: string) =>
    state.parentSettings.lockedModules.includes(moduleId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Play & Learn</Text>
          <Text style={styles.appSubtitle}>Kids</Text>
        </View>
        <View style={styles.topRight}>
          <RewardBanner />
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => dispatch({ type: 'TOGGLE_MUSIC' })}
              style={styles.iconButton}
            >
              <Text style={styles.icon}>
                {state.musicEnabled ? '🎵' : '🔇'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowParentGate(true)}
              style={styles.iconButton}
            >
              <Text style={styles.icon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <View>
            <Text style={styles.welcomeText}>Hello, little learner!</Text>
            <Text style={styles.welcomeSubtext}>What shall we learn today?</Text>
          </View>
        </View>

        {/* Learning Modules */}
        <Text style={styles.sectionTitle}>Learn</Text>
        <View style={styles.grid}>
          {MODULES.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              emoji={mod.emoji}
              color={mod.color}
              progress={getProgress(mod.id)}
              locked={isLocked(mod.id)}
              onPress={() => navigation.navigate(mod.screen)}
            />
          ))}
        </View>

        {/* Mini Games */}
        <Text style={styles.sectionTitle}>Play Games</Text>
        <View style={styles.grid}>
          {GAMES.map((game) => (
            <ModuleCard
              key={game.id}
              title={game.title}
              emoji={game.emoji}
              color={game.color}
              progress={getProgress(game.id)}
              locked={isLocked(game.id)}
              onPress={() => navigation.navigate(game.screen)}
            />
          ))}
        </View>

        {/* Sticker Collection */}
        <TouchableOpacity
          style={styles.stickerBanner}
          onPress={() => navigation.navigate('Rewards')}
        >
          <Text style={styles.stickerEmoji}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.stickerTitle}>My Rewards</Text>
            <Text style={styles.stickerSubtext}>
              {state.rewards.unlockedStickers.length} stickers collected
            </Text>
          </View>
          <Text style={styles.stickerArrow}>▶</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* Parent Gate Modal */}
      <ParentGate
        visible={showParentGate}
        onSuccess={() => {
          setShowParentGate(false);
          dispatch({ type: 'ENTER_PARENT_MODE' });
          navigation.navigate('ParentDashboard');
        }}
        onCancel={() => setShowParentGate(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  appSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: -4,
  },
  topRight: {
    alignItems: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  icon: {
    fontSize: 20,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  welcomeEmoji: {
    fontSize: 40,
  },
  welcomeText: {
    ...FONTS.subheading,
    color: COLORS.text,
  },
  welcomeSubtext: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  sectionTitle: {
    ...FONTS.heading,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  stickerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.medium,
  },
  stickerEmoji: {
    fontSize: 36,
  },
  stickerTitle: {
    ...FONTS.subheading,
    color: COLORS.text,
  },
  stickerSubtext: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  stickerArrow: {
    fontSize: 20,
    color: COLORS.textLight,
  },
});
