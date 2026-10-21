import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { Icon } from './Icons';

/** Night-sky background with a centered column, used by every screen. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <NightSky />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.back} hitSlop={8}>
      <Icon name="chevron" size={22} color={colors.ink} />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

// Fixed star positions (percent of the screen) so the sky looks the same on every screen.
const STARS = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 23.3 + (i % 5) * 7) % 100,
  size: i % 7 === 0 ? 3 : 2,
  o: 0.25 + ((i * 13) % 10) / 25,
}));

function NightSky() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {STARS.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: s.size,
            backgroundColor: colors.wool,
            opacity: s.o,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night, overflow: 'hidden' },
  content: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 16 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 14,
    paddingLeft: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  backText: { fontSize: 16, fontWeight: '800', color: colors.ink },
});
