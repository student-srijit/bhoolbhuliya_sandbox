"use client";

import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ── context so any link can trigger the transition ── */
interface GlitchCtx {
  navigateTo: (href: string) => void;
}
const GlitchContext = createContext<GlitchCtx>({ navigateTo: () => {} });
export const useGlitchNav = () => useContext(GlitchContext);

/* ── hacker phrases shown during glitch ── */
const HACKER_LINES = [
  "INITIALIZING SECURE TUNNEL...",
  "BYPASSING FIREWALL LAYER 3...",
  "DECRYPTING AES-256 HANDSHAKE...",
  "ROUTING THROUGH PROXY CHAIN...",
  "INJECTING PAYLOAD...",
  "ESTABLISHING COVERT CHANNEL...",
  "LOADING DARKNET MODULE...",
  "SYNCHRONIZING NODES...",
  "COMPILING EXPLOIT...",
  "ACCESSING RESTRICTED SECTOR...",
  "VERIFYING IDENTITY MASK...",
  "TUNNELING THROUGH TOR EXIT NODE...",
];

const PAGE_LABELS: Record<string, string> = {
  "/": "HOME BASE",
  "/terminal": "HONEYPOT TERMINAL",
  "/ops": "THREAT OPS CENTER",
  "/honeypot": "HONEYPOT CONSOLE",
};

/* ── random hex string ── */
function randHex(len: number) {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

/* ── the glitch overlay ── */
export default function GlitchTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"boot" | "glitch" | "resolve">("boot");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── canvas static noise ── */
  const drawNoise = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = (cvs.width = window.innerWidth);
    const h = (cvs.height = window.innerHeight);
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = Math.random() * 40; // subtle
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  /* ── run the sequence ── */
  const navigateTo = useCallback(
    (href: string) => {
      if (active) return;
      if (href === pathname) return;
      if (href.startsWith("#")) return; // anchor links skip transition

      setActive(true);
      setTarget(href);
      setLines([]);
      setProgress(0);
      setPhase("boot");

      // play sound
      try {
        const audio = new Audio("/glitch-sfx.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
        audioRef.current = audio;
      } catch {}

      // phase 1: boot lines
      const selectedLines = [...HACKER_LINES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      let i = 0;
      const addLine = () => {
        if (i < selectedLines.length) {
          setLines((prev) => [...prev, selectedLines[i]]);
          setProgress(Math.round(((i + 1) / selectedLines.length) * 80));
          i++;
          timerRef.current = setTimeout(addLine, 120 + Math.random() * 80);
        } else {
          // phase 2: glitch peak
          setPhase("glitch");
          setProgress(90);
          timerRef.current = setTimeout(() => {
            // phase 3: resolve
            setPhase("resolve");
            setProgress(100);
            setLines((prev) => [
              ...prev,
              `ACCESS GRANTED → ${PAGE_LABELS[href] || href.toUpperCase()}`,
            ]);
            timerRef.current = setTimeout(() => {
              router.push(href);
              // keep overlay slightly longer for effect
              timerRef.current = setTimeout(() => {
                setActive(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current = null;
                }
              }, 400);
            }, 500);
          }, 600);
        }
      };
      timerRef.current = setTimeout(addLine, 100);
    },
    [active, pathname, router]
  );

  /* noise animation loop while active */
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const loop = () => {
      drawNoise();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [active, drawNoise]);

  /* cleanup on unmount */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  /* ── intercept all <a> clicks for glitch navigation ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // only intercept internal page links, not anchors or external
      if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return;
      // only intercept if it's a different page
      if (href === pathname) return;
      e.preventDefault();
      navigateTo(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [navigateTo, pathname]);

  return (
    <GlitchContext.Provider value={{ navigateTo }}>
      {children}

      {active && (
        <div className={`glx glx--${phase}`}>
          {/* static noise canvas */}
          <canvas ref={canvasRef} className="glx__noise" />

          {/* scanline sweep */}
          <div className="glx__scanlines" />

          {/* RGB split bars */}
          <div className="glx__rgb-bars" />

          {/* horizontal glitch slices */}
          {phase === "glitch" && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glx__slice"
                  style={{
                    top: `${10 + i * 10 + Math.random() * 5}%`,
                    height: `${2 + Math.random() * 4}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </>
          )}

          {/* center content */}
          <div className="glx__content">
            {/* skull / icon */}
            <div className="glx__icon">
              <span className="glx__skull">☠</span>
            </div>

            {/* terminal text */}
            <div className="glx__terminal">
              <div className="glx__terminal-header">
                root@bhoolbhulaiya:~# transition --target {target}
              </div>
              {lines.map((line, i) => (
                <div key={i} className="glx__line">
                  <span className="glx__line-prefix">[{randHex(4)}]</span>{" "}
                  <span className={i === lines.length - 1 && phase === "resolve" ? "glx__line--success" : ""}>
                    {line}
                  </span>
                </div>
              ))}
              {phase !== "resolve" && (
                <span className="glx__cursor">█</span>
              )}
            </div>

            {/* progress bar */}
            <div className="glx__progress-wrap">
              <div className="glx__progress-track">
                <div
                  className="glx__progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="glx__progress-pct">{progress}%</span>
            </div>

            {/* hex ticker at bottom */}
            <div className="glx__hex-ticker">
              {randHex(64)}
            </div>
          </div>

          {/* CRT vignette overlay */}
          <div className="glx__vignette" />
        </div>
      )}
    </GlitchContext.Provider>
  );
}
