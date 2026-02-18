import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/lib/useColorScheme';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Post;
    },
    enabled: !!id,
  });

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`} edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#F59E0B' : '#D97706'} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`} edges={['top']}>
        <View className="flex-row justify-end p-4">
          <Pressable onPress={() => router.back()} className="p-2">
            <X size={24} color={isDark ? '#FAFAF9' : '#292524'} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className={`text-lg text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Could not load this rabbit hole.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`} edges={['top']}>
      {/* Header */}
      <View className={`flex-row items-center justify-between px-4 py-3 border-b ${isDark ? 'border-stone-800' : 'border-amber-100'}`}>
        <View className="w-10" />
        <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-stone-800'}`}>
          Rabbit Hole
        </Text>
        <Pressable onPress={() => router.back()} className="p-2">
          <X size={24} color={isDark ? '#FAFAF9' : '#292524'} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
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
    </SafeAreaView>
  );
}
