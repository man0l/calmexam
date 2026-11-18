import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radii, spacing } from '../theme';
import { Icon, type IconName } from './Icon';

interface Props {
  onBack?: () => void;
  backIcon?: IconName;
  center?: ReactNode;
  right?: ReactNode;
}

export function TopBar({ onBack, backIcon = 'back', center, right }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backIcon === 'close' ? 'Close' : 'Back'}
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.btn, pressed && { backgroundColor: colors.inset }]}
          >
            <Icon name={backIcon} color="inkMuted" />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>{center}</View>
      <View style={[styles.side, styles.end]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', minHeight: layout.closeSize + spacing.sm, gap: spacing.md },
  side: { width: layout.closeSize, alignItems: 'flex-start' },
  end: { alignItems: 'flex-end', width: 'auto', minWidth: layout.closeSize },
  center: { flex: 1 },
  btn: { width: layout.closeSize, height: layout.closeSize, borderRadius: radii.chip, alignItems: 'center', justifyContent: 'center' },
});
