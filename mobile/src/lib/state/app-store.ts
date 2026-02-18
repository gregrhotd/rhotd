import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppStore {
  isPremium: boolean;
  hasCompletedOnboarding: boolean;
  setIsPremium: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isPremium: false,
      hasCompletedOnboarding: false,
      setIsPremium: (value: boolean) => set({ isPremium: value }),
      setHasCompletedOnboarding: (value: boolean) => set({ hasCompletedOnboarding: value }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;
