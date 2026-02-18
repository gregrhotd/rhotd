import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Lock, Search, ChevronRight, Crown, Sparkles } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { supabase } from '@/lib/supabase';
import useAppStore from '@/lib/state/app-store';
import type { Post } from '@/types';

function PremiumGate({ isDark }: { isDark: boolean }) {
  const setIsPremium = useAppStore((s) => s.setIsPremium);

  return (
    <View className={`flex-1 items-center justify-center px-8 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
      <View className={`w-28 h-28 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
        <Crown size={56} color={isDark ? '#F59E0B' : '#D97706'} />
      </View>

      <Text className={`text-2xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>
        Unlock Full Archive
      </Text>

      <Text className={`text-base text-center mb-8 leading-6 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
        Go premium to access every rabbit hole ever published. Search by topic, filter by tags, and never miss a fascinating discovery.
      </Text>

      <View className={`w-full rounded-2xl p-5 mb-6 ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
        <View className="flex-row items-center mb-4">
          <Sparkles size={20} color={isDark ? '#F59E0B' : '#D97706'} />
          <Text className={`ml-2 text-base font-semibold ${isDark ? 'text-white' : 'text-stone-800'}`}>
            Premium Benefits
          </Text>
        </View>

        {['Full archive access', 'Search all topics', 'Filter by tags', 'Early access to new features'].map((benefit, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <View className={`w-1.5 h-1.5 rounded-full mr-3 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
            <Text className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              {benefit}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => setIsPremium(true)}
        className={`w-full py-4 rounded-2xl items-center ${isDark ? 'bg-amber-600 active:bg-amber-700' : 'bg-amber-600 active:bg-amber-700'}`}
      >
        <Text className="text-white text-lg font-semibold">
          Upgrade to Premium
        </Text>
      </Pressable>

      <Text className={`text-xs mt-4 text-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
        This is a placeholder. In-app purchases coming soon.
      </Text>
    </View>
  );
}

export default function ArchiveScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const isPremium = useAppStore((s) => s.isPremium);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
    enabled: isPremium,
  });

  const allTags = useMemo(() => {
    if (!posts) return [];
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hook.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === null || (post.tags && post.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const openPost = (postId: string) => {
    router.push({ pathname: '/post/[id]', params: { id: postId } });
  };

  if (!isPremium) {
    return <PremiumGate isDark={isDark} />;
  }

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
          Something went wrong loading the archive.
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
      {/* Search bar */}
      <View className="px-4 pt-4 pb-2">
        <View className={`flex-row items-center px-4 py-3 rounded-xl ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
          <Search size={20} color={isDark ? '#78716C' : '#A8A29E'} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search rabbit holes..."
            placeholderTextColor={isDark ? '#78716C' : '#A8A29E'}
            className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-stone-800'}`}
          />
        </View>
      </View>

      {/* Tag filters */}
      {allTags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <Pressable
            onPress={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedTag === null
                ? isDark
                  ? 'bg-amber-600'
                  : 'bg-amber-600'
                : isDark
                  ? 'bg-stone-800'
                  : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedTag === null ? 'text-white' : isDark ? 'text-stone-300' : 'text-stone-600'
              }`}
            >
              All
            </Text>
          </Pressable>
          {allTags.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedTag === tag
                  ? isDark
                    ? 'bg-amber-600'
                    : 'bg-amber-600'
                  : isDark
                    ? 'bg-stone-800'
                    : 'bg-white'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedTag === tag ? 'text-white' : isDark ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {tag}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {/* Posts list */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
      >
        <View className="px-4">
          {filteredPosts.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className={`text-base ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                No rabbit holes found.
              </Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <Pressable
                key={post.id}
                onPress={() => openPost(post.id)}
                className={`mb-3 rounded-xl p-4 ${isDark ? 'bg-stone-800 active:bg-stone-700' : 'bg-white active:bg-amber-50'}`}
              >
                <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-stone-800'}`}>
                  {post.title}
                </Text>
                <Text
                  className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}
                  numberOfLines={1}
                >
                  {post.hook}
                </Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <ChevronRight size={16} color={isDark ? '#78716C' : '#A8A29E'} />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
