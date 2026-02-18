import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Lightbulb, Send, CheckCircle } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';

export default function SuggestScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('suggestions').insert({
        topic: topic.trim(),
        description: description.trim() || null,
        submitted_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSubmitted(true);
      setTopic('');
      setDescription('');
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const handleSubmit = () => {
    if (topic.trim().length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitMutation.mutate();
  };

  const handleNewSuggestion = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <View className={`flex-1 items-center justify-center px-8 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}>
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
          <CheckCircle size={48} color={isDark ? '#4ADE80' : '#16A34A'} />
        </View>

        <Text className={`text-2xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>
          Thank You!
        </Text>

        <Text className={`text-base text-center mb-8 leading-6 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Your suggestion has been submitted. We love hearing what topics fascinate our community!
        </Text>

        <Pressable
          onPress={handleNewSuggestion}
          className={`px-6 py-3 rounded-xl ${isDark ? 'bg-stone-800 active:bg-stone-700' : 'bg-white active:bg-amber-50'}`}
        >
          <Text className={`text-base font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            Suggest Another Topic
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header illustration */}
        <View className="items-center mb-8 pt-4">
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-stone-800' : 'bg-amber-100'}`}>
            <Lightbulb size={40} color={isDark ? '#F59E0B' : '#D97706'} />
          </View>
          <Text className={`text-xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
            Suggest a Rabbit Hole
          </Text>
          <Text className={`text-sm text-center ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            What topics would you love to explore?
          </Text>
        </View>

        {/* Form */}
        <View className={`rounded-2xl p-5 ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
          {/* Topic field */}
          <View className="mb-5">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              Topic *
            </Text>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="e.g., The history of color theory"
              placeholderTextColor={isDark ? '#78716C' : '#A8A29E'}
              className={`px-4 py-3 rounded-xl text-base ${
                isDark ? 'bg-stone-700 text-white' : 'bg-amber-50 text-stone-800'
              }`}
              maxLength={200}
            />
            <Text className={`text-xs mt-1 text-right ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              {topic.length}/200
            </Text>
          </View>

          {/* Description field */}
          <View className="mb-5">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              Description (optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us why this topic interests you..."
              placeholderTextColor={isDark ? '#78716C' : '#A8A29E'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`px-4 py-3 rounded-xl text-base min-h-[100px] ${
                isDark ? 'bg-stone-700 text-white' : 'bg-amber-50 text-stone-800'
              }`}
              maxLength={500}
            />
            <Text className={`text-xs mt-1 text-right ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              {description.length}/500
            </Text>
          </View>

          {/* Error message */}
          {submitMutation.isError ? (
            <View className={`mb-4 p-3 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <Text className={`text-sm text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Something went wrong. Please try again.
              </Text>
            </View>
          ) : null}

          {/* Submit button */}
          <Pressable
            onPress={handleSubmit}
            disabled={topic.trim().length === 0 || submitMutation.isPending}
            className={`flex-row items-center justify-center py-4 rounded-xl ${
              topic.trim().length === 0
                ? isDark
                  ? 'bg-stone-700'
                  : 'bg-stone-200'
                : isDark
                  ? 'bg-amber-600 active:bg-amber-700'
                  : 'bg-amber-600 active:bg-amber-700'
            }`}
          >
            <Send
              size={20}
              color={topic.trim().length === 0 ? (isDark ? '#78716C' : '#A8A29E') : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
            <Text
              className={`text-base font-semibold ${
                topic.trim().length === 0 ? (isDark ? 'text-stone-500' : 'text-stone-400') : 'text-white'
              }`}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Suggestion'}
            </Text>
          </Pressable>
        </View>

        {/* Info text */}
        <Text className={`text-xs text-center mt-6 px-4 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          Suggestions are reviewed by our team. Popular topics may be featured in future rabbit holes!
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
