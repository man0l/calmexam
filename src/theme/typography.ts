import type { TextStyle } from 'react-native';

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

export const typography = {
  display: { fontSize: 44, lineHeight: 52, fontWeight: '600', fontVariant: tabular },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '600' },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  h3: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  math: { fontSize: 19, lineHeight: 28, fontWeight: '400', fontVariant: tabular },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  small: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.4 },
  tabLabel: { fontSize: 11, lineHeight: 14, fontWeight: '600' },
  button: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  number: { fontSize: 17, lineHeight: 24, fontWeight: '600', fontVariant: tabular },
} as const satisfies Record<string, TextStyle>;
