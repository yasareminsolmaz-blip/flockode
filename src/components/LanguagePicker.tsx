import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { deviceLang, LANG_NAMES, LANGS, useI18n, type Lang } from '../i18n';
import { useProgress } from '../store/Progress';
import { colors } from '../theme';
import { Button, Overlay } from './ui';

/** Menu button showing the current language; opens a list to choose another one. */
export function LanguageButton() {
  const { lang: choice, setLang } = useProgress();
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);

  const pick = (l: Lang | 'auto') => {
    setLang(l);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('language')}: ${LANG_NAMES[lang]}`}
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={({ pressed }) => [styles.btn, pressed && { transform: [{ translateY: 2 }] }]}
      >
        <Text style={styles.globe}>🌐</Text>
        <Text style={styles.code}>{lang.toUpperCase()}</Text>
      </Pressable>
      <Overlay visible={open} onRequestClose={() => setOpen(false)}>
        <Text style={styles.title}>{t('language')}</Text>
        <View style={styles.list}>
          <Option label={`${t('deviceLanguage')} (${LANG_NAMES[deviceLang()]})`} selected={choice === 'auto'} onPress={() => pick('auto')} />
          {LANGS.map((l) => (
            <Option key={l} label={LANG_NAMES[l]} selected={choice === l} onPress={() => pick(l)} />
          ))}
        </View>
        <Button label={t('close')} onPress={() => setOpen(false)} />
      </Overlay>
    </>
  );
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selected && styles.selected, pressed && { opacity: 0.7 }]}
    >
      <Text style={[styles.optionText, selected && { color: '#2A1D05' }]}>{label}</Text>
      {selected && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  globe: { fontSize: 16 },
  code: { fontWeight: '900', fontSize: 14, color: colors.ink, letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: '900', color: colors.wool, textAlign: 'center' },
  list: { gap: 8 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  selected: { backgroundColor: colors.ink },
  optionText: { fontSize: 17, fontWeight: '800', color: colors.ink },
  check: { fontSize: 18, fontWeight: '900', color: '#2A1D05' },
});
