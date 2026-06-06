import React from 'react';
import { Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function ThemeSwitch() {
  const { isLight, toggleTheme } = useTheme();

  // Cores do track e thumb dependendo do modo
  const trackBg = isLight ? '#f4a7c3' : '#3d1f5c';
  const thumbBg = isLight ? '#c2185b' : '#e4c326';
  const thumbPos = isLight ? 22 : 2;

  return (
    <Pressable
      onPress={toggleTheme}
      style={[styles.track, { backgroundColor: trackBg }]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isLight }}
    >
      <View style={[styles.thumb, { backgroundColor: thumbBg, transform: [{ translateX: thumbPos }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    marginRight: Platform.OS === 'web' ? 12 : 8,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});