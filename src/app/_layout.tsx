import { DarkTheme, SplashScreen, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui';
import { deviceLang } from '../i18n';
import { translate } from '../i18n/strings';
import { configureAudio } from '../logic/sounds';
import { ProgressProvider, useProgress } from '../store/Progress';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
configureAudio();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // May render outside the progress store, so it follows the device language.
  const lang = deviceLang();
  return (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>{translate(lang, 'errorTitle')}</Text>
      <Text style={styles.errorText}>{error.message}</Text>
      <Button label={translate(lang, 'tryAgain')} kind="go" onPress={retry} />
    </View>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.lantern,
    background: colors.night,
    card: colors.night,
    text: colors.ink,
    border: colors.line,
  },
};

function RootNavigator() {
  const { hydrated } = useProgress();
  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [hydrated]);
  // Keep the splash screen until saved progress is loaded, so the map never shows wrong stars.
  if (!hydrated) return null;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.night } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="world/[w]" />
      <Stack.Screen name="level/[id]" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ProgressProvider>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </ProgressProvider>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, backgroundColor: colors.night },
  errorTitle: { fontSize: 24, fontWeight: '900', color: colors.wool },
  errorText: { fontSize: 15, color: colors.mute, textAlign: 'center' },
});
