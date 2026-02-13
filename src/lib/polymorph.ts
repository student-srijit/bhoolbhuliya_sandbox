import "server-only";

type Key =
  | "shell"
  | "orbit"
  | "card"
  | "title"
  | "subtitle"
  | "status"
  | "actionRow"
  | "connectButton"
  | "connectGlow"
  | "seedBadge"
  | "divider"
  | "baitLink"
  | "baitNote";

export type ClassMap = Record<Key, string>;

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function token(seed: string, key: string): string {
  const raw = hashSeed(`${seed}:${key}`)
    .toString(36)
    .padStart(6, "0");
  return raw.slice(0, 6);
}

function className(seed: string, key: string): string {
  return `mp-${key}-${token(seed, key)}`;
}

export function createClassMap(seed: string): ClassMap {
  return {
    shell: className(seed, "shell"),
    orbit: className(seed, "orbit"),
    card: className(seed, "card"),
    title: className(seed, "title"),
    subtitle: className(seed, "subtitle"),
    status: className(seed, "status"),
    actionRow: className(seed, "actionRow"),
    connectButton: className(seed, "connectButton"),
    connectGlow: className(seed, "connectGlow"),
    seedBadge: className(seed, "seedBadge"),
    divider: className(seed, "divider"),
    baitLink: className(seed, "baitLink"),
    baitNote: className(seed, "baitNote"),
  };
}

export function createCss(map: ClassMap): string {
  return `
.${map.shell} {
  position: relative;
  overflow: hidden;
}

.${map.orbit} {
  position: absolute;
  width: 640px;
  height: 640px;
  border-radius: 50%;
  border: 1px solid rgba(93, 253, 195, 0.18);
  box-shadow: 0 0 90px rgba(93, 253, 195, 0.12);
  top: -260px;
  right: -260px;
}

.${map.card} {
  background: linear-gradient(145deg, rgba(18, 24, 38, 0.9), rgba(8, 12, 20, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 30px;
  padding: 36px;
  box-shadow: 0 30px 90px rgba(5, 8, 15, 0.65);
}

.${map.title} {
  font-size: clamp(2.6rem, 4vw, 4rem);
  letter-spacing: -0.04em;
}

.${map.subtitle} {
  color: rgba(231, 236, 242, 0.72);
}

.${map.status} {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(93, 253, 195, 0.12);
  border: 1px solid rgba(93, 253, 195, 0.35);
  color: #5dfdc3;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.${map.actionRow} {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.${map.connectButton} {
  border: none;
  border-radius: 999px;
  padding: 14px 28px;
  background: linear-gradient(120deg, #5dfdc3, #7ab7ff);
  color: #0b0f16;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.${map.connectButton}:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 16px 40px rgba(93, 253, 195, 0.3);
}

.${map.connectGlow} {
  position: absolute;
  inset: auto 0 0 0;
  height: 140px;
  background: radial-gradient(circle, rgba(93, 253, 195, 0.28), transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}

.${map.seedBadge} {
  font-size: 0.85rem;
  color: rgba(231, 236, 242, 0.6);
}

.${map.divider} {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.${map.baitLink} {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.${map.baitNote} {
  font-size: 0.85rem;
  color: rgba(122, 183, 255, 0.7);
}
`;
}
