"use client";

import { useEffect, useState, useCallback } from "react";

const API =
  process.env.NEXT_PUBLIC_HONEYPOT_URL || "http://localhost:8000";

interface LogEntry {
  command: string;
  ts: number;
  alert?: string | null;
  severity?: string | null;
}

export default function LiveTerminalPreview() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [online, setOnline] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/logs?limit=6`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch");
      const data = await res.json();
      setLogs(data.logs || []);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const id = setInterval(fetchLogs, 3000);
    return () => clearInterval(id);
  }, [fetchLogs]);

  return (
    <div className="term-preview">
      <div className="term-preview__bar">
        <div className="term-preview__dots">
          <span />
          <span />
          <span />
        </div>
        <span className="term-preview__title">bhoolbhulaiya@honeypot:~</span>
        <span className={`term-preview__status ${online ? "term-preview__status--on" : ""}`}>
          {online ? "● LIVE" : "○ CONNECTING"}
        </span>
      </div>
      <div className="term-preview__body">
        {logs.length === 0 && (
          <>
            <p className="tp-comment">// waiting for attacker activity...</p>
            <p className="tp-comment">// commands will appear here in real time</p>
            <p className="tp-cursor">
              <span className="tp-prompt">&#10095;</span>{" "}
              <span className="tp-blink">&#9608;</span>
            </p>
          </>
        )}
        {logs.map((entry, i) => (
          <div key={i}>
            <p>
              <span className="tp-prompt">&#10095;</span>{" "}
              <span className="tp-cmd">{entry.command}</span>
            </p>
            {entry.alert && (
              <p className={entry.severity === "high" ? "tp-warn" : "tp-out"}>
                ⚠ {entry.alert}
              </p>
            )}
          </div>
        ))}
        {logs.length > 0 && (
          <p className="tp-cursor">
            <span className="tp-prompt">&#10095;</span>{" "}
            <span className="tp-blink">&#9608;</span>
          </p>
        )}
      </div>
    </div>
  );
}
