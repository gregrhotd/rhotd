import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';

export default function RecentScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', sevenDaysAgo.toISOString())
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  const openPost = (postId: string) => {
    router.push({ pathname: '/post/[id]', params: { id: postId } });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
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
          Something went wrong loading recent posts.
        </Text>
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-stone-800' : 'bg-amber-100'}`}>
          <Calendar size={48} color={isDark ? '#F59E0B' : '#D97706'} />
        </View>
        <Text className={`text-xl font-semibold text-center mb-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
          No Recent Rabbit Holes
        </Text>
        <Text className={`text-base text-center ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Check back soon for more fascinating discoveries.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
    >
      <View className="px-4">
        {posts.map((post, index) => (
          <Pressable
            key={post.id}
            onPress={() => openPost(post.id)}
            className={`mb-4 rounded-2xl p-4 ${isDark ? 'bg-stone-800 active:bg-stone-700' : 'bg-white active:bg-amber-50'}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Date badge */}
            <View className="flex-row items-center mb-2">
              <View className={`px-2 py-1 rounded-md ${isDark ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                <Text className={`text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  {formatDate(post.published_at)}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
              {post.title}
            </Text>

            {/* Hook */}
            <Text
              className={`text-sm mb-3 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
              numberOfLines={2}
            >
              {post.hook}
            </Text>

            {/* Tags and arrow */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row flex-wrap gap-1 flex-1">
                {post.tags ? post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <View
                    key={tagIndex}
                    className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-stone-700' : 'bg-amber-50'}`}
                  >
                    <Text className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {tag}
                    </Text>
                  </View>
                )) : null}
              </View>
              <ChevronRight size={20} color={isDark ? '#78716C' : '#A8A29E'} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
