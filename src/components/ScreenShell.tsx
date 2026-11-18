import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useMarkReady } from '../store/DemoReadyContext';
import { colors, layout, spacing } from '../theme';

interface Props {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  background?: 'bg' | 'surface';
  deferReady?: boolean;
  startAt?: 'end' | number | null;
}

export function ScreenShell({
  children,
  footer,
  header,
  scroll = true,
  edges = ['top', 'bottom'],
  contentStyle,
  background = 'bg',
  deferReady = false,
  startAt,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [scrolled, setScrolled] = useState(startAt === undefined);
  useMarkReady(!deferReady && scrolled);
  useEffect(() => {
    if (typeof startAt !== 'number') return;
    scrollRef.current?.scrollTo({ y: Math.max(0, startAt), animated: false });
    const id = requestAnimationFrame(() => setScrolled(true));
    return () => cancelAnimationFrame(id);
  }, [startAt]);
  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      onContentSizeChange={() => {
        if (startAt !== 'end') return;
        scrollRef.current?.scrollToEnd({ animated: false });
        setScrolled(true);
      }}
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentStyle]}>
      <View style={[styles.inner, styles.flex]}>{children}</View>
    </View>
  );
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors[background] }]} edges={edges}>
      {header ? <View style={styles.headerWrap}>{header}</View> : null}
      {body}
      {footer ? (
        <View style={styles.footer}>
          <View style={styles.inner}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  inner: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  headerWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, width: '100%', maxWidth: layout.maxContentWidth + spacing.xl * 2, alignSelf: 'center' },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: layout.hairline,
    borderTopColor: colors.border,
  },
});
