import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { loadAuthToken } from '@/app/api/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadAuthToken().catch(() => undefined);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="reset-otp" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="service-profile" options={{ headerShown: false }} />
        <Stack.Screen name="queue" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="settings" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="admin-home" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="admin-queue" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="admin-services" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="admin-add-service" options={{ headerShown: false }} />
        <Stack.Screen name="admin-edit-service" options={{ headerShown: false }} />
        <Stack.Screen name="admin-settings" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
