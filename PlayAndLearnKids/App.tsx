// Play & Learn Kids - Main App Entry Point
// A fun, safe, and educational app for children aged 3-8

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import { AppProvider } from './src/context/AppContext';
import { initAudio } from './src/utils/sounds';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AlphabetScreen from './src/screens/AlphabetScreen';
import NumbersScreen from './src/screens/NumbersScreen';
import ColorsScreen from './src/screens/ColorsScreen';
import AnimalsScreen from './src/screens/AnimalsScreen';
import MemoryGameScreen from './src/screens/MemoryGameScreen';
import PuzzleGameScreen from './src/screens/PuzzleGameScreen';
import BalloonGameScreen from './src/screens/BalloonGameScreen';
import ShapeSorterScreen from './src/screens/ShapeSorterScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import ParentDashboardScreen from './src/screens/ParentDashboardScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initAudio();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFF8F0' },
            gestureEnabled: true,
            animationEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress,
                transform: [
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            }),
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Alphabet" component={AlphabetScreen} />
          <Stack.Screen name="Numbers" component={NumbersScreen} />
          <Stack.Screen name="Colors" component={ColorsScreen} />
          <Stack.Screen name="Animals" component={AnimalsScreen} />
          <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
          <Stack.Screen name="PuzzleGame" component={PuzzleGameScreen} />
          <Stack.Screen name="BalloonGame" component={BalloonGameScreen} />
          <Stack.Screen name="ShapeSorterGame" component={ShapeSorterScreen} />
          <Stack.Screen name="Rewards" component={RewardsScreen} />
          <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
