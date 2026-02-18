import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Compass, BookOpen, Crown } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import useAppStore from '@/lib/state/app-store';
import { useColorScheme } from '@/lib/useColorScheme';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: <Compass size={80} color="#D97706" strokeWidth={1.5} />,
    title: "Discover Daily Rabbit Holes",
    description: "Every day, we curate a fascinating topic for you to explore. From forgotten history to cutting-edge science, there's always something new to discover.",
  },
  {
    icon: <BookOpen size={80} color="#D97706" strokeWidth={1.5} />,
    title: "Curated Content",
    description: "Each rabbit hole is carefully researched and written to spark your curiosity. Dive deep with curated links and resources to learn more.",
  },
  {
    icon: <Crown size={80} color="#D97706" strokeWidth={1.5} />,
    title: "Go Premium",
    description: "Unlock the full archive of rabbit holes, search by topic, and filter by tags. Never miss a fascinating discovery again.",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const setHasCompletedOnboarding = useAppStore((s) => s.setHasCompletedOnboarding);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-stone-900' : 'bg-amber-50'}`}
      edges={['top', 'bottom']}
    >
      <View className="flex-1 px-8 justify-between py-8">
        {/* Skip button */}
        <View className="flex-row justify-end">
          <Pressable onPress={handleGetStarted} className="py-2 px-4">
            <Text className={`text-base font-medium ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Main content */}
        <Animated.View
          key={currentSlide}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          className="flex-1 items-center justify-center"
        >
          <View className={`w-40 h-40 rounded-full items-center justify-center mb-10 ${isDark ? 'bg-stone-800' : 'bg-amber-100'}`}>
            {slide.icon}
          </View>

          <Text className={`text-2xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-stone-800'}`}>
            {slide.title}
          </Text>

          <Text className={`text-base text-center leading-6 px-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            {slide.description}
          </Text>
        </Animated.View>

        {/* Bottom section */}
        <View>
          {/* Dots indicator */}
          <View className="flex-row justify-center mb-8 gap-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === currentSlide
                    ? `w-8 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`
                    : `w-2 ${isDark ? 'bg-stone-700' : 'bg-amber-200'}`
                }`}
              />
            ))}
          </View>

          {/* Button */}
          <Pressable
            onPress={handleNext}
            className={`py-4 rounded-2xl items-center ${isDark ? 'bg-amber-600 active:bg-amber-700' : 'bg-amber-600 active:bg-amber-700'}`}
          >
            <Text className="text-white text-lg font-semibold">
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
