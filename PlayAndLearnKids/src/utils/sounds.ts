// Audio/Sound utility for managing sound effects and background music
// Uses expo-av for cross-platform audio playback

import { Audio } from 'expo-av';

let bgMusic: Audio.Sound | null = null;

// Sound configuration
export const SOUND_CONFIG = {
  tapSound: 'tap',
  correctSound: 'correct',
  wrongSound: 'wrong',
  celebrationSound: 'celebration',
  popSound: 'pop',
  flipSound: 'flip',
} as const;

// Initialize audio mode for background playback
export async function initAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });
  } catch {
    // Audio init failed - continue without audio
  }
}

// Play a short sound effect using system haptics as fallback
export async function playSound(soundType: keyof typeof SOUND_CONFIG): Promise<void> {
  try {
    // In a production app, load from bundled assets:
    // const { sound } = await Audio.Sound.createAsync(SOUND_FILES[soundType]);
    // await sound.playAsync();
    // For now, we use haptic feedback as audio placeholder
    const Haptics = require('expo-haptics');
    switch (soundType) {
      case 'tapSound':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'correctSound':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'wrongSound':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'celebrationSound':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'popSound':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'flipSound':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch {
    // Silently fail - sound is enhancement, not critical
  }
}

// Start background music loop
export async function startBackgroundMusic(): Promise<void> {
  try {
    if (bgMusic) {
      await bgMusic.playAsync();
      return;
    }
    // In production, load actual background music file:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/sounds/background.mp3'),
    //   { isLooping: true, volume: 0.3 }
    // );
    // bgMusic = sound;
    // await bgMusic.playAsync();
  } catch {
    // Background music failed - continue without it
  }
}

// Stop background music
export async function stopBackgroundMusic(): Promise<void> {
  try {
    if (bgMusic) {
      await bgMusic.pauseAsync();
    }
  } catch {
    // Silently fail
  }
}

// Clean up audio resources
export async function cleanupAudio(): Promise<void> {
  try {
    if (bgMusic) {
      await bgMusic.unloadAsync();
      bgMusic = null;
    }
  } catch {
    // Silently fail
  }
}
