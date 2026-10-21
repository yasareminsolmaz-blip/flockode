import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CondArt } from '../components/Icons';
import { BackButton, Screen } from '../components/Screen';
import { Button, Card, Overlay, ParentalGate, ui } from '../components/ui';
import { WORLDS } from '../game/data';
import type { Cond } from '../game/engine';
import { useI18n } from '../i18n';
import { buyFullVersion, getFullVersionPrice, PURCHASES_TEST_MODE, restorePurchases } from '../logic/purchases';
import { useProgress } from '../store/Progress';
import { colors } from '../theme';
import { condKey } from '../components/ProgramEditor';

/** New pieces the full version brings, shown with their pictures. */
const PIECES: Cond[] = ['onRed', 'wolfAhead', 'onStream'];

export default function Shop() {
  const { owned, setOwned, unlockAll, resetProgress } = useProgress();
  const { t, worldName } = useI18n();
  const [gate, setGate] = useState<null | 'buy' | 'restore'>(null);
  const [gateSeed, setGateSeed] = useState(0);
  const [confirm, setConfirm] = useState(false);
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
    setConfirm(false);
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
    // Test mode shows its own confirmation; real builds go straight to Apple's purchase sheet.
    if (what === 'buy') {
      if (PURCHASES_TEST_MODE) setConfirm(true);
      // Wait for the gate to close so Apple's sheet can appear on top.
      else setTimeout(buy, 500);
    }
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
      <Card>
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

      <Card>
        <Text style={ui.eyebrow}>{t('worldsInFull')}</Text>
        <View style={styles.list}>
          {paid.map((w) => (
            <View key={w.idx} style={[styles.item, owned && styles.itemOwned]}>
              <Text style={styles.itemNum}>{w.idx + 1}</Text>
              <Text style={styles.itemName} numberOfLines={1}>
                {worldName(w.idx)}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {PURCHASES_TEST_MODE && (
        <Card style={styles.test}>
          <Text style={ui.eyebrow}>{t('testTitle')}</Text>
          <Text style={ui.fine}>{t('testBody')}</Text>
          <View style={styles.row}>
            <Button label={t('resetPurchase')} onPress={() => setOwned(false)} style={styles.small} />
            <Button label={t('unlockAllLevels')} onPress={unlockAll} style={styles.small} />
            <Button label={t('resetProgress')} onPress={resetProgress} style={styles.small} />
          </View>
        </Card>
      )}

      <ParentalGate visible={gate !== null} seed={gateSeed} onPass={passed} onCancel={() => setGate(null)} />
      <Overlay visible={confirm} onRequestClose={() => setConfirm(false)}>
        <Text style={[ui.eyebrow, { textAlign: 'center' }]}>{t('inAppPurchase')}</Text>
        <Text style={styles.confirmTitle}>{t('confirmTitle')}</Text>
        <Text style={[styles.body, { textAlign: 'center' }]}>{t('confirmBody')}</Text>
        <View style={styles.row}>
          <Button label={t('cancel')} onPress={() => setConfirm(false)} />
          <Button label={t('buy')} kind="go" onPress={buy} style={{ flexGrow: 1 }} />
        </View>
      </Overlay>
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
  list: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { flexDirection: 'row', alignItems: 'baseline', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, flexGrow: 1, flexBasis: 170 },
  itemOwned: { borderStyle: 'solid', borderColor: colors.good },
  itemNum: { fontWeight: '900', color: colors.lantern, fontSize: 15, fontVariant: ['tabular-nums'] },
  itemName: { fontWeight: '700', color: colors.ink, fontSize: 14, flexShrink: 1 },
  test: { borderStyle: 'dashed', boxShadow: 'none' },
  small: { minHeight: 40, paddingHorizontal: 12 },
  confirmTitle: { fontSize: 26, fontWeight: '900', color: colors.wool, textAlign: 'center' },
});
