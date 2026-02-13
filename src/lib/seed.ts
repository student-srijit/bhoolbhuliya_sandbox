export function generateSeed(length = 12): string {
  const base = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}${Math.random()}`;
  return base.replace(/-/g, "").slice(0, length);
}
