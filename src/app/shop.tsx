import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CondArt, SheepArt } from '../components/Icons';
import { BackButton, Screen } from '../components/Screen';
import { Button, Card, ParentalGate, ui } from '../components/ui';
import { WORLDS } from '../game/data';
import type { Cond } from '../game/engine';
import { useI18n } from '../i18n';
import { buyFullVersion, getFullVersionPrice, restorePurchases } from '../logic/purchases';
import { useProgress } from '../store/Progress';
import { colors } from '../theme';
import { condKey } from '../components/ProgramEditor';

/** New pieces the full version brings, shown with their pictures. */
const PIECES: Cond[] = ['onRed', 'wolfAhead', 'onStream'];

export default function Shop() {
  const { owned, setOwned } = useProgress();
  const { t, worldName } = useI18n();
  const [gate, setGate] = useState<null | 'buy' | 'restore'>(null);
  const [gateSeed, setGateSeed] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const paid = WORLDS.filter((w) => !w.free);
  const openGate = (what: 'buy' | 'restore') => {
    setGateSeed(Math.random());
    setGate(what);
  };

  // Localized price from the App Store (real builds only).
  useEffect(() => {
    let live = true;
    if (!owned) getFullVersionPrice().then((p) => live && setPrice(p));
    return () => {
      live = false;
    };
  }, [owned]);

  const buy = async () => {
    setBusy(true);
    const r = await buyFullVersion();
    setBusy(false);
    if (r === 'purchased') {
      setOwned(true);
      setNote('');
    } else if (r === 'pending') setNote(t('purchasePending'));
    else if (r === 'failed') setNote(t('purchaseFailed'));
    else setNote('');
  };

  const passed = async () => {
    const what = gate;
    setGate(null);
    // Wait for the gate to close so Apple's purchase sheet can appear on top.
    if (what === 'buy') setTimeout(buy, 500);
    if (what === 'restore') {
      setBusy(true);
      const found = await restorePurchases();
      setBusy(false);
      if (found) setOwned(true);
      setNote(found ? t('restored') : t('nothingToRestore'));
    }
  };

  return (
    <Screen>
      <BackButton label={t('close')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <Card style={styles.hero}>
        <View style={styles.flock}>
          {[0, 1, 2, 3].map((k) => (
            <View key={k} style={{ marginTop: k % 2 ? 14 : 0, transform: [{ rotate: `${k % 2 ? 12 : -14}deg` }] }}>
              <SheepArt size={40} />
            </View>
          ))}
        </View>
        <Text style={ui.eyebrow}>{t('shopEyebrow')}</Text>
        <Text style={ui.title}>{t('shopTitle')}</Text>
        <Text style={styles.body}>{t('shopBody')}</Text>
        <View style={styles.pieces}>
          {PIECES.map((c) => (
            <View key={c} style={styles.piece}>
              <CondArt c={c} size={30} />
              <Text style={styles.pieceLabel}>{t(condKey(c))}</Text>
            </View>
          ))}
        </View>
        {owned ? (
          <>
            <View style={styles.owned}>
              <Text style={styles.ownedText}>{t('ownedNote')}</Text>
            </View>
            <Button label={t('goToWorld3')} kind="go" onPress={() => router.replace('/world/2')} />
          </>
        ) : (
          <View style={styles.row}>
            <Button
              label={price ? `${t('unlockFull')} · ${price}` : t('unlockFull')}
              kind="go"
              disabled={busy}
              onPress={() => openGate('buy')}
              style={{ flexGrow: 1 }}
            />
            <Button label={t('restorePurchases')} disabled={busy} onPress={() => openGate('restore')} />
          </View>
        )}
        {!!note && <Text style={styles.note}>{note}</Text>}
        <Text style={ui.fine}>{t('gateNote')}</Text>
      </Card>

      <View style={styles.fence}>
        <Text style={styles.fenceTitle}>{t('worldsInFull')}</Text>
        <View style={styles.tokens}>
          {paid.map((w) => (
            <View key={w.idx} accessible accessibilityLabel={`${w.idx + 1}, ${worldName(w.idx)}`} style={[styles.token, owned && styles.tokenOwned]}>
              <Text style={[styles.tokenNum, owned && { color: '#24331F' }]}>{w.idx + 1}</Text>
            </View>
          ))}
        </View>
      </View>


      <ParentalGate visible={gate !== null} seed={gateSeed} onPass={passed} onCancel={() => setGate(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  pieces: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  piece: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2, flexGrow: 1, flexBasis: 170 },
  pieceLabel: { fontWeight: '800', fontSize: 15, color: colors.ink, flexShrink: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  owned: { backgroundColor: '#1F3B33', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.good },
  ownedText: { color: colors.good, fontWeight: '800', fontSize: 15, lineHeight: 21 },
  note: { color: colors.lantern, fontWeight: '800', fontSize: 15 },
  hero: { borderRadius: 30, borderTopWidth: 6, borderTopColor: colors.lantern, alignItems: 'stretch' },
  flock: { flexDirection: 'row', alignSelf: 'center', gap: 6, marginBottom: 4 },
  fence: { gap: 10, padding: 16, borderRadius: 30, backgroundColor: colors.meadow, borderTopWidth: 6, borderColor: colors.wood },
  fenceTitle: { ...ui.eyebrow, color: colors.wool, textAlign: 'center' },
  tokens: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  token: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.tuft,
    backgroundColor: colors.soil,
  },
  tokenOwned: { borderStyle: 'solid', borderColor: colors.wool, backgroundColor: colors.good },
  tokenNum: { fontWeight: '900', fontSize: 17, color: colors.wool, fontVariant: ['tabular-nums'] },
});
