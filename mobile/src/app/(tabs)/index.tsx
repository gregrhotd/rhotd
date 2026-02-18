import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Rabbit } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['todayPost'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', today)
        .lt('published_at', today + 'T23:59:59.999Z')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Post | null;
    },
  });

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
        <ActivityIndicator size="large" color={isDark ? '#F59E0B' : '#D97706'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
        <Text className={`text-lg text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          Something went wrong loading today's rabbit hole.
        </Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-stone-800' : 'bg-amber-100'}`}>
          <Rabbit size={48} color={isDark ? '#F59E0B' : '#D97706'} />
        </View>
        <Text className={`text-xl font-semibold text-center mb-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
          No Rabbit Hole Today
        </Text>
        <Text className={`text-base text-center ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Check back later! We're preparing something fascinating for you.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="px-5 pt-6">
        {/* Title */}
        <Text className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>
          {post.title}
        </Text>

        {/* Hook */}
        <Text className={`text-lg mb-6 leading-7 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
          {post.hook}
        </Text>

        {/* Tags */}
        {post.tags && post.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <View
                key={index}
                className={`px-3 py-1 rounded-full ${isDark ? 'bg-stone-800' : 'bg-amber-100'}`}
              >
                <Text className={`text-sm ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Body */}
        <Text className={`text-base leading-7 mb-8 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          {post.body}
        </Text>

        {/* Links */}
        {post.links && post.links.length > 0 ? (
          <View className={`rounded-2xl p-4 ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-stone-800'}`}>
              Dive Deeper
            </Text>
            {post.links.map((link, index) => (
              <Pressable
                key={index}
                onPress={() => openLink(link.url)}
                className={`flex-row items-center py-3 ${
                  index < post.links.length - 1
                    ? `border-b ${isDark ? 'border-stone-700' : 'border-stone-100'}`
                    : ''
                }`}
              >
                <ExternalLink
                  size={18}
                  color={isDark ? '#F59E0B' : '#D97706'}
                  style={{ marginRight: 12 }}
                />
                <Text
                  className={`flex-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}
                  numberOfLines={1}
                >
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Published date */}
        <Text className={`text-sm mt-6 text-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          Published {new Date(post.published_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>
    </ScrollView>
  );
}
