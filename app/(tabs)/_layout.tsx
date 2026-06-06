import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from '../../src/i18n/useTranslation';
import { makeTabStyles } from '../../src/styles/TabStyles';
import { useTheme } from '../../src/context/ThemeContext';
import { ThemeSwitch } from '../../src/components/ThemeSwitch';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const tabStyles = makeTabStyles(isLight);

  const activeTint   = isLight ? '#c2185b' : '#e4c326';
  const inactiveTint = isLight ? '#f48fb1' : '#7f6a96';
  const headerIcon   = isLight ? '#c2185b' : '#f5efff';

  const DefaultRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
      <ThemeSwitch />
    </View>
  );

  const IndexRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
      <ThemeSwitch />
      <Link href="/modal" asChild>
        <Pressable style={tabStyles.infoButton}>
          {({ pressed }) => (
            <Ionicons name="information-circle" size={24} color={headerIcon} style={{ opacity: pressed ? 0.5 : 1 }} />
          )}
        </Pressable>
      </Link>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: tabStyles.bar,
        tabBarLabelStyle: tabStyles.label,
        headerStyle: tabStyles.header,
        headerTitleStyle: tabStyles.headerTitle,
        headerTintColor: activeTint,
        headerShown: useClientOnlyValue(false, true),
        headerRight: DefaultRight,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('navigation.exit'), tabBarIcon: ({ color }) => <Ionicons name="exit-outline" color={color} size={24} />, headerRight: IndexRight }} />
      <Tabs.Screen name="dashboard" options={{ title: t('navigation.profile'), tabBarIcon: ({ color }) => <Ionicons name="star" color={color} size={22} /> }} />
      <Tabs.Screen name="tiragem" options={{ title: t('navigation.draws'), tabBarIcon: ({ color }) => <MaterialIcons name="auto-awesome" color={color} size={22} /> }} />
      <Tabs.Screen name="glossario" options={{ title: t('navigation.glossary'), tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" color={color} size={22} /> }} />
      <Tabs.Screen name="rituais" options={{ title: t('navigation.rituals'), tabBarIcon: ({ color }) => <Ionicons name="sparkles" color={color} size={22} /> }} />
      <Tabs.Screen name="mapa-astral" options={{ title: t('navigation.astralMap'), tabBarIcon: ({ color }) => <Ionicons name="planet" color={color} size={22} /> }} />
    </Tabs>
  );
}