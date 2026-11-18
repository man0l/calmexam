import type { TextStyle } from 'react-native';

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

export const fonts = {
  regular: 'Lexend_400Regular',
  medium: 'Lexend_500Medium',
  semibold: 'Lexend_600SemiBold',
  bold: 'Lexend_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 54, letterSpacing: -1.2, fontVariant: tabular },
  title: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, letterSpacing: -0.1 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  math: { fontFamily: fonts.regular, fontSize: 19, lineHeight: 29, fontVariant: tabular },
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  captionStrong: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 16, letterSpacing: 1.1 },
  tabLabel: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16 },
  button: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, letterSpacing: 0.1 },
  number: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, fontVariant: tabular },
} as const satisfies Record<string, TextStyle>;
