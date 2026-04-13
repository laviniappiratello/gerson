import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { tabStyles } from '../../src/styles/TabStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: tabStyles.bar,
        tabBarLabelStyle: tabStyles.label,
        headerStyle: tabStyles.header,
        headerTitleStyle: tabStyles.headerTitle,
        headerTintColor: '#e4c326',
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sair',
          tabBarIcon: ({ color }) => (
            <Ionicons name="exit-outline" color={color} size={24} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={tabStyles.infoButton}>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="star" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="tiragem"
        options={{
          title: 'Tiragem',
          tabBarIcon: ({ color }) => <MaterialIcons name="auto-awesome" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="glossario"
        options={{
          title: 'Glossário',
          tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}