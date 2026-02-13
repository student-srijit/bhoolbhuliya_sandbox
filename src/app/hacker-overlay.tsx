"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ─── boot sequence lines ─── */
const BOOT_LINES = [
  { text: "[BIOS]  Initializing secure kernel...", delay: 0 },
  { text: "[BIOS]  Loading cryptographic modules...", delay: 200 },
  { text: "[SYS]   Mounting encrypted filesystem... OK", delay: 400 },
  { text: "[NET]   Binding to 0.0.0.0:443 (TLS 1.3)... OK", delay: 600 },
  { text: "[KERN]  Polymorphic DOM engine v4.2.0", delay: 800 },
  { text: "[KERN]  Seed entropy pool: 256-bit", delay: 950 },
  { text: "[AI]    Loading LLaMA 3.3-70b model weights...", delay: 1100 },
  { text: "[AI]    Honeypot neural core: ONLINE", delay: 1400 },
  { text: "[SEC]   Threat detection pipeline: ARMED", delay: 1600 },
  { text: "[SEC]   Behavioral fingerprinting: ACTIVE", delay: 1750 },
  { text: "[TEL]   Upstash Redis telemetry: CONNECTED", delay: 1900 },
  { text: "[WEB3]  RainbowKit wallet bridge: READY", delay: 2050 },
  { text: "[SHIELD] Class mutation engine: ENGAGED", delay: 2200 },
  { text: "[SHIELD] DOM scramble interval: PER-REQUEST", delay: 2350 },
  { text: "", delay: 2500 },
  { text: "  ██████╗ ██╗  ██╗ ██████╗  ██████╗ ██╗     ", delay: 2550 },
  { text: "  ██╔══██╗██║  ██║██╔═══██╗██╔═══██╗██║     ", delay: 2600 },
  { text: "  ██████╔╝███████║██║   ██║██║   ██║██║     ", delay: 2650 },
  { text: "  ██╔══██╗██╔══██║██║   ██║██║   ██║██║     ", delay: 2700 },
  { text: "  ██████╔╝██║  ██║╚██████╔╝╚██████╔╝███████╗", delay: 2750 },
  { text: "  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝", delay: 2800 },
  { text: "       B H O O L B H U L A I Y A", delay: 2850 },
  { text: "  v1.0 — Offensive Web3 Defense System", delay: 2900 },
  { text: "", delay: 2950 },
  { text: "[READY] All systems nominal. Entering combat mode...", delay: 3100 },
];

const TOTAL_BOOT = 3800; // total animation time before fade
const FADE_TIME = 600;

/* ─── matrix rain character set ─── */
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

/* ─── the overlay component ─── */
export default function HackerOverlay() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* decide whether to show */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("bhoolbhulaiya_booted");
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem("bhoolbhulaiya_booted", "1");
    }
  }, []);

  /* boot sequence typewriter */
  useEffect(() => {
    if (!visible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach(({ text, delay }) => {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, text]);
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, delay)
      );
    });
    /* start fade */
    timers.push(
      setTimeout(() => setFading(true), TOTAL_BOOT),
      setTimeout(() => setVisible(false), TOTAL_BOOT + FADE_TIME)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  /* matrix rain on canvas */
  const drawMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(6, 6, 9, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff8840";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillStyle =
          Math.random() > 0.96 ? "#00ff88" : `rgba(0, 255, 136, ${0.15 + Math.random() * 0.15})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const id = setInterval(draw, 45);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const cleanup = drawMatrix();
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", resize);
    return () => {
      cleanup?.();
      window.removeEventListener("resize", resize);
    };
  }, [visible, drawMatrix]);

  if (!visible) return null;

  return (
    <div className={`hacker-overlay ${fading ? "hacker-overlay--fade" : ""}`}>
      <canvas ref={canvasRef} className="hacker-overlay__matrix" />
      <div className="hacker-overlay__scanline" />

      <div className="hacker-overlay__content">
        {/* top bar */}
        <div className="hacker-overlay__header">
          <span className="hacker-overlay__tag">BHOOLBHULAIYA</span>
          <span className="hacker-overlay__tag hacker-overlay__tag--accent">
            BOOT SEQUENCE
          </span>
        </div>

        {/* terminal scroll */}
        <div className="hacker-overlay__terminal" ref={scrollRef}>
          {lines.map((line, i) => (
            <pre key={i} className="hacker-overlay__line">
              {line}
            </pre>
          ))}
          <span className="hacker-overlay__cursor">█</span>
        </div>

        {/* progress bar */}
        <div className="hacker-overlay__progress-track">
          <div
            className="hacker-overlay__progress-bar"
            style={{
              animationDuration: `${TOTAL_BOOT}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
