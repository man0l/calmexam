export function confirmAction(title: string, message: string, _confirmLabel: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return Promise.resolve(window.confirm(`${title}\n\n${message}`));
}
