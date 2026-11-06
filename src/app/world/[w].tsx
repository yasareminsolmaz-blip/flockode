import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton, Screen } from '../../components/Screen';
import { Trail, type TrailStop } from '../../components/Trail';
import { Card, Stars, ui } from '../../components/ui';
import { freeWorldsUnfinished, isLevelOpen, worldStars, WORLDS } from '../../game/data';
import { useI18n } from '../../i18n';
import { isPlayableWorld, useProgress } from '../../store/Progress';
import { colors } from '../../theme';

export default function WorldScreen() {
  const { w } = useLocalSearchParams<{ w: string }>();
  const world = WORLDS[Number(w)];
  const { stars, unlocked, owned } = useProgress();
  const { t, levelName, worldName, worldIntro } = useI18n();
  if (!world) return <Redirect href="/" />;
  if (!isPlayableWorld(world.free, owned)) return <Redirect href="/shop" />;
  const max = (world.b - world.a) * 3;

  return (
    <Screen>
      <BackButton label="Flockode" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <Card>
        <Text style={ui.eyebrow}>{t('worldN', { n: world.idx + 1 })}</Text>
        <Text style={ui.title}>{worldName(world.idx)}</Text>
        <Text style={styles.body}>{worldIntro(world.idx)}</Text>
        <Text style={styles.sum}>
          ★ {worldStars(stars, world)} / {max}
        </Text>
      </Card>

      {!world.free && freeWorldsUnfinished(stars) && (
        <View style={styles.tip}>
          <Text style={styles.tipText}>{t('skipAheadTip')}</Text>
        </View>
      )}

      <View style={styles.meadow}>
        <Trail
          size={66}
          rowHeight={170}
          stops={Array.from({ length: world.b - world.a }, (_, k): TrailStop => {
            const i = world.a + k;
            const open = isLevelOpen(i, stars, unlocked);
            const done = (stars[i] ?? 0) > 0;
            return {
              key: String(i),
              badge: String(k + 1),
              label: open ? levelName(i) : t('locked'),
              state: !open ? 'locked' : done ? 'done' : 'open',
              big: i === world.b - 1,
              a11y: `${t('levelN', { n: k + 1 })}${open ? `, ${levelName(i)}` : `, ${t('locked')}`}`,
              onPress: open ? () => router.push(`/level/${i}`) : undefined,
              foot: <Stars n={stars[i] ?? 0} size={13} />,
            };
          })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  sum: { fontWeight: '900', color: colors.star, fontSize: 16, fontVariant: ['tabular-nums'] },
  tip: { borderRadius: 14, borderWidth: 1, borderColor: colors.lantern, backgroundColor: colors.panel, padding: 12 },
  tipText: { fontSize: 15, lineHeight: 21, fontWeight: '700', color: colors.ink },
  meadow: { borderRadius: 32, backgroundColor: colors.meadow, borderTopWidth: 6, borderColor: colors.tuft, paddingHorizontal: 8, paddingTop: 16 },
});
