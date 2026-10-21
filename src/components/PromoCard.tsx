import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { colors } from '../theme';
import { RobotMini } from './Icons';
import { Button, Card, ParentalGate, ui } from './ui';

/** App Store page of our other game. */
export const ROBO_ROTA_URL = 'https://apps.apple.com/app/id6824438257';

/** Card for Robo Rota. The App Store link sits behind the parental gate (App Store Kids rule). */
export function PromoCard() {
  const { t } = useI18n();
  const [gate, setGate] = useState<number | null>(null);
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <RobotMini size={56} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.title}>{t('promoTitle')}</Text>
          <Text style={ui.fine}>{t('promoBody')}</Text>
        </View>
      </View>
      <Button label={t('promoOpen')} onPress={() => setGate(Math.random())} style={{ alignSelf: 'flex-start' }} />
      <ParentalGate
        visible={gate !== null}
        seed={gate ?? 0}
        onCancel={() => setGate(null)}
        onPass={() => {
          setGate(null);
          Linking.openURL(ROBO_ROTA_URL).catch(() => {});
        }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderColor: '#4A3A44' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { fontSize: 18, fontWeight: '900', color: colors.wool },
});
