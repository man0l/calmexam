export const colors = {
  bg: '#F5F3EE',
  surface: '#FFFFFF',
  inset: '#ECE8E0',
  border: '#E0DBD1',
  ink: '#1E2A2F',
  inkMuted: '#5D6A70',
  inkFaint: '#8C979C',
  primary: '#2E6E68',
  primaryPressed: '#245955',
  primarySoft: '#DDEBE8',
  onPrimary: '#FFFFFF',
  amber: '#C08A35',
  amberSoft: '#F5E9D3',
  correct: '#3B8A5A',
  correctSoft: '#DFF0E5',
  wrong: '#B9553F',
  wrongSoft: '#F6E1DB',
  night: '#16201F',
  cream: '#F5F3EE',
  scrim: 'rgba(22, 32, 31, 0.45)',
} as const;

export type ColorToken = keyof typeof colors;
