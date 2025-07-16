import {
  Onest_900Black,
  Onest_800ExtraBold,
  Onest_700Bold,
  Onest_600SemiBold,
  Onest_500Medium,
  Onest_400Regular,
  Onest_300Light,
  Onest_200ExtraLight,
  Onest_100Thin,
  useFonts,
} from "@expo-google-fonts/onest";

import {
  Roboto_900Black,
  Roboto_800ExtraBold,
  Roboto_700Bold,
  Roboto_600SemiBold,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_300Light,
  Roboto_200ExtraLight,
  Roboto_100Thin,
  Roboto_600SemiBold_Italic,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

import { Anton_400Regular } from "@expo-google-fonts/anton";

import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Onest_900Black,
    Onest_800ExtraBold,
    Onest_700Bold,
    Onest_600SemiBold,
    Onest_500Medium,
    Onest_400Regular,
    Onest_300Light,
    Onest_200ExtraLight,
    Onest_100Thin,
    Roboto_900Black,
    Roboto_900Black_Italic,
    Roboto_800ExtraBold,
    Roboto_700Bold,
    Roboto_600SemiBold,
    Roboto_600SemiBold_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_200ExtraLight,
    Roboto_100Thin,

    Anton_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
