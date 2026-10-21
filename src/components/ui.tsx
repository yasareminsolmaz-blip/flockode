import * as Haptics from 'expo-haptics';
import { useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { useI18n } from '../i18n';
import { cardShadow, colors } from '../theme';
import { Star } from './Icons';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  kind = 'plain',
  disabled,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: 'plain' | 'go' | 'dark';
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.btn,
        kind === 'go' && styles.btnGo,
        kind === 'dark' && styles.btnDark,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.btnText, kind === 'go' && styles.btnTextLight, kind === 'dark' && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function Stars({ n, size = 18 }: { n: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3].map((k) => (
        <Star key={k} on={k <= n} size={size} />
      ))}
    </View>
  );
}

export function Overlay({ visible, children, onRequestClose }: { visible: boolean; children: ReactNode; onRequestClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose} supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.overlay}>
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
}

/** Adult check before purchases and restores (App Store Kids category rule). */
/** `seed` picks the first question; create it in the event handler that opens the gate (e.g. Math.random()). */
export function ParentalGate({
  visible,
  seed,
  onPass,
  onCancel,
}: {
  visible: boolean;
  seed: number;
  onPass: () => void;
  onCancel: () => void;
}) {
  return (
    <Overlay visible={visible} onRequestClose={onCancel}>
      {/* Mounted only while open, so every opening starts with a fresh question and an empty field. */}
      {visible && <GateBody seed={Math.floor(seed * 16)} onPass={onPass} onCancel={onCancel} />}
    </Overlay>
  );
}

const question = (seed: number) => ({ a: 6 + (seed % 4), b: 6 + (Math.floor(seed / 4) % 4) });

function GateBody({ seed: first, onPass, onCancel }: { seed: number; onPass: () => void; onCancel: () => void }) {
  const [seed, setSeed] = useState(first);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const { t } = useI18n();
  const input = useRef<TextInput>(null);
  const q = question(seed);

  const submit = () => {
    if (Number(answer) === q.a * q.b) onPass();
    else {
      setWrong(true);
      setSeed((s) => s + 1 + Math.floor(Math.random() * 14));
      setAnswer('');
      input.current?.focus();
    }
  };

  return (
    <>
      <Text style={styles.eyebrow}>{t('forAdults')}</Text>
      <Text style={styles.modalTitle}>{t('parentalGate')}</Text>
      <Text style={styles.modalText}>{t('parentalBody')}</Text>
      <Text style={styles.question}>
        {q.a} × {q.b} = ?
      </Text>
      <TextInput
        ref={input}
        value={answer}
        onChangeText={(t) => setAnswer(t.replace(/\D/g, '').slice(0, 3))}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={submit}
        autoFocus
        accessibilityLabel={t('answer')}
        style={styles.input}
      />
      {wrong && <Text style={styles.wrong}>{t('wrongAnswer')}</Text>}
      <View style={styles.row}>
        <Button label={t('cancel')} onPress={onCancel} />
        <Button label={t('continue')} kind="go" onPress={submit} style={{ flex: 1 }} />
      </View>
    </>
  );
}

export const ui = StyleSheet.create({
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: colors.mute },
  title: { fontSize: 26, fontWeight: '900', color: colors.wool, lineHeight: 30 },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  fine: { fontSize: 13, lineHeight: 19, color: colors.mute },
});

const styles = StyleSheet.create({
  card: { ...cardShadow, padding: 16, gap: 10 },
  btn: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnGo: { backgroundColor: colors.lantern, borderColor: colors.lantern, boxShadow: `0px 5px 0px ${colors.lanternDark}` },
  btnDark: { backgroundColor: colors.barn, borderColor: colors.barn, boxShadow: `0px 5px 0px ${colors.barnDark}` },
  btnText: { fontSize: 18, fontWeight: '900', color: colors.ink },
  btnTextLight: { color: '#2A1D05' },
  pressed: { transform: [{ translateY: 3 }] },
  disabled: { opacity: 0.45 },
  overlay: { flex: 1, backgroundColor: 'rgba(5,12,24,0.7)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: 24,
    gap: 12,
    alignItems: 'stretch',
    boxShadow: '0px 18px 40px rgba(0,0,0,0.45)',
  },
  eyebrow: { ...ui.eyebrow, textAlign: 'center' },
  modalTitle: { fontSize: 28, fontWeight: '900', color: colors.wool, textAlign: 'center' },
  modalText: { fontSize: 16, lineHeight: 22, color: colors.ink, textAlign: 'center' },
  question: { fontSize: 36, fontWeight: '900', color: colors.ink, textAlign: 'center', fontVariant: ['tabular-nums'] },
  input: {
    alignSelf: 'center',
    width: 150,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingVertical: 8,
    color: colors.ink,
    backgroundColor: colors.night,
  },
  wrong: { color: colors.bad, fontWeight: '800', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
