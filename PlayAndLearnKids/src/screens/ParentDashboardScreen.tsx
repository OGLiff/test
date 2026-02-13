// Parent Dashboard - track progress, set time limits, lock/unlock modules

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import ScreenHeader from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ParentDashboardScreenProps {
  navigation: any;
}

const MODULE_INFO: Record<string, { name: string; emoji: string }> = {
  alphabet: { name: 'Alphabet', emoji: '🔤' },
  numbers: { name: 'Numbers', emoji: '🔢' },
  colors: { name: 'Colors', emoji: '🎨' },
  shapes: { name: 'Shapes', emoji: '🔷' },
  animals: { name: 'Animals', emoji: '🦁' },
  memory: { name: 'Memory Game', emoji: '🃏' },
  puzzle: { name: 'Puzzle', emoji: '🧩' },
  balloon: { name: 'Balloon Pop', emoji: '🎈' },
  shapeSorter: { name: 'Shape Sorter', emoji: '🔷' },
};

export default function ParentDashboardScreen({ navigation }: ParentDashboardScreenProps) {
  const { state, dispatch } = useAppContext();
  const [timeLimitInput, setTimeLimitInput] = useState(
    state.parentSettings.dailyPlayLimit.toString(),
  );

  const totalTimeSpent = Object.values(state.progress).reduce(
    (sum, p) => sum + p.timeSpent,
    0,
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const handleSetLimit = () => {
    const limit = parseInt(timeLimitInput, 10);
    if (!isNaN(limit) && limit >= 0) {
      dispatch({ type: 'SET_DAILY_LIMIT', minutes: limit });
    }
  };

  const handleExit = () => {
    dispatch({ type: 'EXIT_PARENT_MODE' });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Parent Dashboard"
        emoji="👨‍👩‍👧‍👦"
        onBack={handleExit}
        color="#546E7A"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overview Cards */}
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.overviewEmoji}>⏱️</Text>
            <Text style={styles.overviewValue}>{formatTime(totalTimeSpent)}</Text>
            <Text style={styles.overviewLabel}>Total Time</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: '#FFF8E1' }]}>
            <Text style={styles.overviewEmoji}>⭐</Text>
            <Text style={styles.overviewValue}>{state.rewards.stars}</Text>
            <Text style={styles.overviewLabel}>Stars Earned</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.overviewEmoji}>🎯</Text>
            <Text style={styles.overviewValue}>
              {state.rewards.unlockedStickers.length}
            </Text>
            <Text style={styles.overviewLabel}>Achievements</Text>
          </View>
        </View>

        {/* Daily Play Limit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Play Limit</Text>
          <View style={styles.limitRow}>
            <TextInput
              style={styles.limitInput}
              value={timeLimitInput}
              onChangeText={setTimeLimitInput}
              keyboardType="numeric"
              placeholder="Minutes (0 = unlimited)"
              placeholderTextColor={COLORS.disabled}
            />
            <TouchableOpacity style={styles.limitButton} onPress={handleSetLimit}>
              <Text style={styles.limitButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.limitInfo}>
            {state.parentSettings.dailyPlayLimit === 0
              ? 'No daily limit set'
              : `Limit: ${state.parentSettings.dailyPlayLimit} minutes/day`}
          </Text>
          <Text style={styles.limitInfo}>
            Today's usage: {state.todayPlayTime} minutes
          </Text>
        </View>

        {/* Sound Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🎵 Background Music</Text>
            <Switch
              value={state.musicEnabled}
              onValueChange={() => dispatch({ type: 'TOGGLE_MUSIC' })}
              trackColor={{ false: COLORS.disabled, true: COLORS.secondary }}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🔊 Sound Effects</Text>
            <Switch
              value={state.soundEnabled}
              onValueChange={() => dispatch({ type: 'TOGGLE_SOUND' })}
              trackColor={{ false: COLORS.disabled, true: COLORS.secondary }}
            />
          </View>
        </View>

        {/* Module Progress & Lock Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modules</Text>
          {Object.entries(state.progress).map(([key, prog]) => {
            const info = MODULE_INFO[key] || { name: key, emoji: '📚' };
            const isLocked = state.parentSettings.lockedModules.includes(key);
            const percentage = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;

            return (
              <View key={key} style={styles.moduleRow}>
                <Text style={styles.moduleEmoji}>{info.emoji}</Text>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleName}>{info.name}</Text>
                  <View style={styles.moduleStats}>
                    <Text style={styles.moduleStat}>
                      Progress: {percentage}%
                    </Text>
                    <Text style={styles.moduleStat}>
                      Time: {formatTime(prog.timeSpent)}
                    </Text>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View
                      style={[styles.miniProgressFill, { width: `${percentage}%` }]}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => dispatch({ type: 'TOGGLE_MODULE_LOCK', module: key })}
                  style={[
                    styles.lockButton,
                    isLocked && styles.lockButtonActive,
                  ]}
                >
                  <Text style={styles.lockEmoji}>{isLocked ? '🔒' : '🔓'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Premium */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <View style={styles.premiumCard}>
            <Text style={styles.premiumEmoji}>👑</Text>
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>
                {state.parentSettings.isPremium ? 'Premium Active' : 'Upgrade to Premium'}
              </Text>
              <Text style={styles.premiumDesc}>
                {state.parentSettings.isPremium
                  ? 'All content unlocked!'
                  : 'Unlock all modules, games, and characters'}
              </Text>
            </View>
            {!state.parentSettings.isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => dispatch({ type: 'SET_PREMIUM', premium: true })}
              >
                <Text style={styles.upgradeText}>Unlock</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Reset Progress */}
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetText}>Reset All Progress</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF1' },
  scrollContent: { padding: SPACING.md },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  overviewCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  overviewEmoji: { fontSize: 28, marginBottom: 4 },
  overviewValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  overviewLabel: { fontSize: 12, color: COLORS.textLight },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    ...FONTS.subheading,
    marginBottom: SPACING.md,
  },
  limitRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  limitInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  limitButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
  },
  limitButtonText: { ...FONTS.button, color: COLORS.white },
  limitInfo: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: { ...FONTS.body },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  moduleEmoji: { fontSize: 24 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  moduleStats: { flexDirection: 'row', gap: SPACING.md, marginTop: 2 },
  moduleStat: { fontSize: 12, color: COLORS.textLight },
  miniProgressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  lockButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockButtonActive: { backgroundColor: '#FFEBEE' },
  lockEmoji: { fontSize: 20 },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  premiumEmoji: { fontSize: 36 },
  premiumInfo: { flex: 1 },
  premiumTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  premiumDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  upgradeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  upgradeText: { fontWeight: 'bold', color: COLORS.text },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
  },
  resetText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
