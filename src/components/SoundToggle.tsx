import { Pressable, StyleSheet, Text } from 'react-native';

import { useI18n } from '../i18n';
import { useProgress } from '../store/Progress';
import { colors } from '../theme';
import { Icon } from './Icons';

/** Speaker button that turns all sound effects on or off; the choice is saved on the device. */
export function SoundToggle({ compact }: { compact?: boolean }) {
  const { sound, setSound } = useProgress();
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: sound }}
      accessibilityLabel={t('soundEffects')}
      onPress={() => setSound(!sound)}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, !sound && styles.off, pressed && { transform: [{ translateY: 2 }] }]}
    >
      <Icon name={sound ? 'soundOn' : 'soundOff'} size={22} color={sound ? colors.ink : colors.mute} stroke={2.4} />
      {!compact && <Text style={[styles.text, !sound && { color: colors.mute }]}>{sound ? t('soundOn') : t('soundOff')}</Text>}
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
  off: { borderStyle: 'dashed', backgroundColor: colors.night },
  text: { fontWeight: '800', fontSize: 14, color: colors.ink },
});
