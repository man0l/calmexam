import { Text, type TextProps } from 'react-native';
import { colors, typography, type ColorToken } from '../theme';

type Variant = keyof typeof typography;

interface Props extends TextProps {
  variant?: Variant;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
}

export function Txt({ variant = 'body', color = 'ink', align, style, ...rest }: Props) {
  return <Text {...rest} style={[typography[variant], { color: colors[color] }, align && { textAlign: align }, style]} />;
}
