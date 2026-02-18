import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import {
  Rabbit,
  Crown,
  Shield,
  FileText,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import useAppStore from '@/lib/state/app-store';
import * as Haptics from 'expo-haptics';

interface SettingsLinkProps {
  icon: React.ReactNode;
  title: string;
  url: string;
  isDark: boolean;
}

function SettingsLink({ icon, title, url, isDark }: SettingsLinkProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center py-4 px-4 ${isDark ? 'active:bg-stone-700' : 'active:bg-amber-50'}`}
    >
      <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${isDark ? 'bg-stone-700' : 'bg-amber-100'}`}>
        {icon}
      </View>
      <Text className={`flex-1 text-base ${isDark ? 'text-white' : 'text-stone-800'}`}>
        {title}
      </Text>
      <ExternalLink size={18} color={isDark ? '#78716C' : '#A8A29E'} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isPremium = useAppStore((s) => s.isPremium);
  const setIsPremium = useAppStore((s) => s.setIsPremium);

  const togglePremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPremium(!isPremium);
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* App info section */}
      <View className="items-center pt-8 pb-6">
        <View className={`w-20 h-20 rounded-2xl items-center justify-center mb-4 ${isDark ? 'bg-amber-600' : 'bg-amber-600'}`}>
          <Rabbit size={44} color="#FFFFFF" />
        </View>
        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>
          Rabbit Hole of the Day
        </Text>
        <Text className={`text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          Discover fascinating topics daily
        </Text>
      </View>

      {/* Premium status */}
      <View className="px-4 mb-6">
        <View className={`rounded-2xl overflow-hidden ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
          <Pressable
            onPress={togglePremium}
            className={`flex-row items-center p-4 ${isDark ? 'active:bg-stone-700' : 'active:bg-amber-50'}`}
          >
            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
              isPremium
                ? 'bg-amber-500'
                : isDark ? 'bg-stone-700' : 'bg-amber-100'
            }`}>
              <Crown size={24} color={isPremium ? '#FFFFFF' : isDark ? '#F59E0B' : '#D97706'} />
            </View>
            <View className="flex-1">
              <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-stone-800'}`}>
                {isPremium ? 'Premium Active' : 'Free Plan'}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {isPremium ? 'Full archive access enabled' : 'Tap to toggle premium (demo)'}
              </Text>
            </View>
            <View className={`px-3 py-1.5 rounded-full ${
              isPremium
                ? 'bg-amber-500/20'
                : isDark ? 'bg-stone-700' : 'bg-amber-100'
            }`}>
              <Text className={`text-xs font-medium ${
                isPremium
                  ? isDark ? 'text-amber-400' : 'text-amber-600'
                  : isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {isPremium ? 'Premium' : 'Free'}
              </Text>
            </View>
          </Pressable>
        </View>
        <Text className={`text-xs text-center mt-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          This is a demo toggle. In-app purchases coming soon.
        </Text>
      </View>

      {/* Links section */}
      <View className="px-4">
        <Text className={`text-sm font-medium mb-2 px-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          LEGAL & SUPPORT
        </Text>
        <View className={`rounded-2xl overflow-hidden ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
          <SettingsLink
            icon={<Shield size={20} color={isDark ? '#F59E0B' : '#D97706'} />}
            title="Privacy Policy"
            url="https://rabbitholeoftheday.com/privacy"
            isDark={isDark}
          />
          <View className={`h-px mx-4 ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`} />
          <SettingsLink
            icon={<FileText size={20} color={isDark ? '#F59E0B' : '#D97706'} />}
            title="Terms of Service"
            url="https://rabbitholeoftheday.com/terms"
            isDark={isDark}
          />
          <View className={`h-px mx-4 ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`} />
          <SettingsLink
            icon={<HelpCircle size={20} color={isDark ? '#F59E0B' : '#D97706'} />}
            title="Support"
            url="https://rabbitholeoftheday.com/support"
            isDark={isDark}
          />
          <View className={`h-px mx-4 ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`} />
          <SettingsLink
            icon={<BookOpen size={20} color={isDark ? '#F59E0B' : '#D97706'} />}
            title="Content Policy"
            url="https://rabbitholeoftheday.com/content-policy"
            isDark={isDark}
          />
        </View>
      </View>

      {/* Version */}
      <Text className={`text-xs text-center mt-8 ${isDark ? 'text-stone-600' : 'text-stone-300'}`}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}
