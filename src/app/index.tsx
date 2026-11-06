import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SheepArt } from '../components/Icons';
import { LanguageButton } from '../components/LanguagePicker';
import { Screen } from '../components/Screen';
import { SoundToggle } from '../components/SoundToggle';
import { Trail, type TrailStop } from '../components/Trail';
import { Stars } from '../components/ui';
import { LEVELS, worldStars, WORLDS } from '../game/data';
import { useI18n } from '../i18n';
import { isPlayableWorld, useProgress } from '../store/Progress';
import { colors } from '../theme';

export default function Home() {
  const { stars, owned } = useProgress();
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
        <View style={styles.toolbar}>
          <LanguageButton />
          <SoundToggle />
          <View style={styles.total}>
            <Text style={styles.totalText}>
              ★ {total} / {LEVELS.length * 3}
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/shop')} style={[styles.badge, owned && styles.badgeOwned]}>
            <Text style={[styles.badgeText, owned && { color: '#2A1D05' }]}>{owned ? t('fullVersion') : t('freeVersion')}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.meadow}>
        <Text style={styles.sign}>{t('worlds')}</Text>
        <Trail
          stops={WORLDS.map((w): TrailStop => {
            const playable = isPlayableWorld(w.free, owned);
            const s = worldStars(stars, w);
            const max = (w.b - w.a) * 3;
            const cleared = (stars[w.b - 1] ?? 0) > 0;
            return {
              key: String(w.idx),
              badge: String(w.idx + 1),
              label: worldName(w.idx),
              state: !playable ? 'locked' : cleared ? 'done' : 'open',
              big: w.idx === WORLDS.length - 1,
              a11y: `${t('worldN', { n: w.idx + 1 })}, ${worldName(w.idx)}${playable ? '' : `, ${t('inFullVersion')}`}`,
              onPress: () => (playable ? router.push(`/world/${w.idx}`) : router.push('/shop')),
              foot: playable ? (
                <Stars n={s >= max ? 3 : s >= max / 2 ? 2 : s > 0 ? 1 : 0} size={13} />
              ) : (
                <Text style={styles.lockText}>{t('inFullVersion')}</Text>
              ),
            };
          })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: 14, paddingTop: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flock: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 40, fontWeight: '900', color: colors.wool, letterSpacing: 0.5 },
  tagline: { fontSize: 15, fontWeight: '700', color: colors.mute },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  total: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  totalText: { color: colors.star, fontWeight: '900', fontSize: 15, fontVariant: ['tabular-nums'] },
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  badgeOwned: { backgroundColor: colors.lantern, borderColor: colors.lantern },
  badgeText: { fontWeight: '800', fontSize: 14, color: colors.ink },
  meadow: {
    borderRadius: 36,
    backgroundColor: colors.meadow,
    borderTopWidth: 6,
    borderColor: colors.tuft,
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 8,
    gap: 10,
  },
  sign: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.wood,
    borderBottomWidth: 4,
    borderColor: colors.woodDark,
    color: '#2B1A0A',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  lockText: { fontSize: 12, fontWeight: '800', color: colors.mute, textAlign: 'center' },
});
