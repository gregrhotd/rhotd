import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Clock, Archive, Lightbulb, Settings } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#F59E0B' : '#D97706',
        tabBarInactiveTintColor: isDark ? '#78716C' : '#A8A29E',
        tabBarStyle: {
          backgroundColor: isDark ? '#1C1917' : '#FFFBEB',
          borderTopColor: isDark ? '#292524' : '#FDE68A',
        },
        headerStyle: {
          backgroundColor: isDark ? '#1C1917' : '#FFFBEB',
        },
        headerTintColor: isDark ? '#FAFAF9' : '#292524',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: 'Archive',
          tabBarIcon: ({ color, size }) => <Archive size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="suggest"
        options={{
          title: 'Suggest',
          tabBarIcon: ({ color, size }) => <Lightbulb size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
