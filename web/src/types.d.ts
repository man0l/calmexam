declare module '*.svg' {
  const text: string;
  export default text;
}
declare module '*.png' {
  const bytes: Uint8Array;
  export default bytes;
}
declare module 'virtual:screens' {
  /** Built from assets/screens/manifest.json at build time. */
  export const SCREEN_MANIFEST: { screens: string[]; og: boolean; version: string };
}
