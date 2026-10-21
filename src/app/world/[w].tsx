import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton, Screen } from '../../components/Screen';
import { Card, Stars, ui } from '../../components/ui';
import { worldStars, WORLDS } from '../../game/data';
import { useI18n } from '../../i18n';
import { useProgress } from '../../store/Progress';
import { colors } from '../../theme';

export default function WorldScreen() {
  const { w } = useLocalSearchParams<{ w: string }>();
  const world = WORLDS[Number(w)];
  const { stars, unlocked } = useProgress();
  const { t, levelName, worldName } = useI18n();
  if (!world) return <Redirect href="/" />;
  const max = (world.b - world.a) * 3;

  return (
    <Screen>
      <BackButton label="Flockode" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <Card>
        <Text style={ui.eyebrow}>{t('worldN', { n: world.idx + 1 })}</Text>
        <Text style={ui.title}>{worldName(world.idx)}</Text>
        <Text style={styles.body}>{world.idx === 0 ? t('introWorld1') : t('introWorld2')}</Text>
        <Text style={styles.sum}>
          ★ {worldStars(stars, world)} / {max}
        </Text>
      </Card>

      <View style={styles.levels}>
        {Array.from({ length: world.b - world.a }, (_, k) => {
          const i = world.a + k;
          const open = i < unlocked;
          const boss = i === world.b - 1;
          return (
            <Pressable
              key={i}
              disabled={!open}
              accessibilityRole="button"
              accessibilityLabel={`${t('levelN', { n: k + 1 })}${open ? `, ${levelName(i)}` : `, ${t('locked')}`}`}
              onPress={() => router.push(`/level/${i}`)}
              style={({ pressed }) => [styles.level, boss && styles.boss, !open && styles.locked, pressed && { transform: [{ translateY: 2 }] }]}
            >
              <Text style={[styles.levelNum, !open && { color: colors.mute }]}>{k + 1}</Text>
              <Text style={styles.levelName} numberOfLines={1}>
                {open ? levelName(i) : t('locked')}
              </Text>
              {boss && <Text style={styles.bossTag}>{t('bossLevel')}</Text>}
              <Stars n={stars[i] ?? 0} size={16} />
            </Pressable>
          );
        })}
      </View>
      {world.a >= unlocked && <Text style={ui.fine}>{t('worldOpensAfter', { n: world.idx })}</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  sum: { fontWeight: '900', color: colors.star, fontSize: 16, fontVariant: ['tabular-nums'] },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  level: {
    width: 150,
    flexGrow: 1,
    maxWidth: 230,
    padding: 12,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    boxShadow: '0px 8px 18px rgba(0,0,0,0.25)',
  },
  boss: { borderColor: colors.lantern, borderWidth: 2 },
  locked: { borderStyle: 'dashed', backgroundColor: 'transparent', boxShadow: 'none', opacity: 0.7 },
  levelNum: { fontSize: 28, fontWeight: '900', color: colors.wool, fontVariant: ['tabular-nums'] },
  levelName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  bossTag: { fontSize: 11, fontWeight: '900', color: colors.lantern, textTransform: 'uppercase', letterSpacing: 0.8 },
});
