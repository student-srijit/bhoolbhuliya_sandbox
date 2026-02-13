"use client";

import { useEffect, useState, useRef } from "react";

/* ─── Glitch Text — randomised character replacement ─── */
export function GlitchText({
  text,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
}) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?0123456789ABCDEF";
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < iteration) return text[i];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length && intervalRef.current) clearInterval(intervalRef.current);
      iteration += 1 / 2;
    }, 35);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text]);

  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {display}
    </Tag>
  );
}

/* ─── Typing Effect — types character by character ─── */
export function TypingText({
  text,
  speed = 40,
  delay = 0,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [started, text, speed, onDone]);

  return (
    <span className={`typing-text ${className}`}>
      {display}
      <span className="typing-cursor">▌</span>
    </span>
  );
}

/* ─── Hex counter — rapid hex increments ─── */
export function HexCounter({ className = "" }: { className?: string }) {
  const [hex, setHex] = useState("0x0000000000");

  useEffect(() => {
    const id = setInterval(() => {
      const n = Math.floor(Math.random() * 0xffffffffff);
      setHex("0x" + n.toString(16).toUpperCase().padStart(10, "0"));
    }, 80);
    return () => clearInterval(id);
  }, []);

  return <span className={`hex-counter ${className}`}>{hex}</span>;
}

/* ─── Command-line style counter ─── */
export function CyberCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (end === 0) { setVal(0); return; }
    const steps = 40;
    const increment = end / steps;
    const interval = duration / steps;
    let current = 0;
    const id = setInterval(() => {
      current += increment;
      if (current >= end) {
        setVal(end);
        clearInterval(id);
      } else {
        setVal(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(id);
  }, [end, duration]);

  return (
    <span className={`cyber-counter ${className}`}>
      {prefix}{val}{suffix}
    </span>
  );
}
