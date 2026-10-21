import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, SheepArt } from '../components/Icons';
import { LanguageButton } from '../components/LanguagePicker';
import { PromoCard } from '../components/PromoCard';
import { Screen } from '../components/Screen';
import { SoundToggle } from '../components/SoundToggle';
import { Stars, ui } from '../components/ui';
import { LEVELS, worldStars, WORLDS } from '../game/data';
import { useI18n } from '../i18n';
import { useProgress } from '../store/Progress';
import { colors } from '../theme';

export default function Home() {
  const { stars, unlocked } = useProgress();
  const { t, worldName } = useI18n();
  const total = stars.reduce((a, b) => a + (b || 0), 0);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.flock}>
            <View style={{ transform: [{ rotate: '-20deg' }] }}>
              <SheepArt size={44} />
            </View>
            <View style={{ marginLeft: -18, marginTop: 14, transform: [{ rotate: '10deg' }] }}>
              <SheepArt size={38} />
            </View>
          </View>
          <View>
            <Text style={styles.title}>
              Flock<Text style={{ color: colors.lantern }}>ode</Text>
            </Text>
            <Text style={styles.tagline}>{t('tagline')}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <LanguageButton />
          <SoundToggle />
          <View style={styles.total}>
            <Text style={styles.totalText}>
              ★ {total} / {LEVELS.length * 3}
            </Text>
          </View>
        </View>
      </View>

      <Text style={ui.eyebrow}>{t('worlds')}</Text>
      <View style={styles.grid}>
        {WORLDS.map((w) => {
          const started = w.a < unlocked;
          const s = worldStars(stars, w);
          const max = (w.b - w.a) * 3;
          const cleared = (stars[w.b - 1] ?? 0) > 0;
          return (
            <Pressable
              key={w.idx}
              accessibilityRole="button"
              accessibilityLabel={`${t('worldN', { n: w.idx + 1 })}, ${worldName(w.idx)}`}
              onPress={() => router.push(`/world/${w.idx}`)}
              style={({ pressed }) => [styles.world, cleared && styles.cleared, pressed && { transform: [{ translateY: 2 }] }]}
            >
              <View style={styles.worldTop}>
                <Text style={styles.worldNum}>{w.idx + 1}</Text>
                {!started && (
                  <View style={styles.lockRow}>
                    <Icon name="lock" size={18} color={colors.mute} stroke={2.2} />
                  </View>
                )}
              </View>
              <Text style={styles.worldName}>{worldName(w.idx)}</Text>
              <Text style={ui.fine} numberOfLines={3}>
                {w.idx === 0 ? t('introWorld1') : t('introWorld2')}
              </Text>
              <View style={styles.worldFoot}>
                <Stars n={s >= max ? 3 : s >= max / 2 ? 2 : s > 0 ? 1 : 0} size={16} />
                <Text style={styles.worldStars}>
                  {s} / {max}
                </Text>
              </View>
            </Pressable>
          );
        })}
        <View style={[styles.world, styles.soon]}>
          <Text style={styles.soonTag}>{t('comingSoon')}</Text>
          <Text style={ui.fine}>{t('comingSoonBody')}</Text>
        </View>
      </View>

      <PromoCard />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flock: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 40, fontWeight: '900', color: colors.wool, letterSpacing: 0.5 },
  tagline: { fontSize: 15, fontWeight: '700', color: colors.mute },
  headerRight: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  total: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  totalText: { color: colors.star, fontWeight: '900', fontSize: 15, fontVariant: ['tabular-nums'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  world: {
    flexGrow: 1,
    flexBasis: 280,
    minHeight: 170,
    padding: 16,
    gap: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    boxShadow: '0px 10px 24px rgba(0,0,0,0.28)',
    justifyContent: 'space-between',
  },
  cleared: { borderColor: colors.good },
  soon: { borderStyle: 'dashed', backgroundColor: 'transparent', boxShadow: 'none', justifyContent: 'center' },
  soonTag: { fontSize: 18, fontWeight: '900', color: colors.lantern },
  worldTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  worldNum: { fontSize: 32, fontWeight: '900', color: colors.lantern, fontVariant: ['tabular-nums'] },
  worldName: { fontSize: 22, fontWeight: '900', color: colors.wool },
  worldFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  worldStars: { fontSize: 13, fontWeight: '800', color: colors.mute, fontVariant: ['tabular-nums'] },
});
