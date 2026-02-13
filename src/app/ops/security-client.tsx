"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LogEntry = {
  id: string;
  ts: number;
  ip: string;
  session_id: string;
  command: string;
  mode: string;
  alert?: string | null;
  severity?: string | null;
};

type Stats = {
  total: number;
  lastMinute: number;
  topCommands: { command: string; count: number }[];
};

const POLL_MS = 1500;

export default function DashboardClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, lastMinute: 0, topCommands: [] });
  const [status, setStatus] = useState("idle");
  const lastAlertRef = useRef<string | null>(null);
  const [flash, setFlash] = useState(false);

  const baseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_HONEYPOT_URL ?? "http://localhost:8000",
    []
  );

  const fetchData = async () => {
    setStatus("syncing");
    const [logsRes, statsRes] = await Promise.all([
      fetch(`${baseUrl}/api/logs?limit=50`),
      fetch(`${baseUrl}/api/stats`),
    ]);
    if (!logsRes.ok || !statsRes.ok) {
      setStatus("offline");
      return;
    }

    const logsData = (await logsRes.json()) as { logs: LogEntry[] };
    const statsData = (await statsRes.json()) as Stats;
    setLogs(logsData.logs ?? []);
    setStats(statsData);

    const latestAlert = logsData.logs?.find((entry) => entry.alert)?.id ?? null;
    if (latestAlert && latestAlert !== lastAlertRef.current) {
      lastAlertRef.current = latestAlert;
      setFlash(true);
      window.setTimeout(() => setFlash(false), 800);
    }
    setStatus("live");
  };

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(fetchData, POLL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`sec-shell ${flash ? "sec-flash" : ""}`}>
      {/* stats row */}
      <div className="sec-stats">
        <div className="sec-stat">
          <span className="sec-stat__label">Total Events</span>
          <span className="sec-stat__val">{stats.total}</span>
        </div>
        <div className="sec-stat">
          <span className="sec-stat__label">Last 60s</span>
          <span className="sec-stat__val sec-stat__val--cyan">{stats.lastMinute}</span>
        </div>
        <div className="sec-stat">
          <span className="sec-stat__label">Status</span>
          <span className={`sec-stat__val sec-stat__val--status sec-stat__val--${status}`}>
            <span className="sec-stat__dot" />
            {status}
          </span>
        </div>
      </div>

      {/* alerts */}
      <div className="sec-block">
        <div className="sec-block__header">
          <span className="sec-block__icon">⚠</span>
          <h3 className="sec-block__title">Active Alerts</h3>
          <span className="sec-block__count">
            {logs.filter((e) => e.alert).length}
          </span>
        </div>
        <div className="sec-alerts">
          {logs.filter((entry) => entry.alert).slice(0, 4).map((entry) => (
            <div key={entry.id} className={`sec-alert sec-alert--${entry.severity ?? "low"}`}>
              <div className="sec-alert__left">
                <span className="sec-alert__sev">{entry.severity?.toUpperCase() ?? "LOW"}</span>
                <p className="sec-alert__msg">{entry.alert}</p>
              </div>
              <span className="sec-alert__ip">{entry.ip}</span>
            </div>
          ))}
          {!logs.some((entry) => entry.alert) && (
            <p className="sec-empty">No active alerts — perimeter clear.</p>
          )}
        </div>
      </div>

      {/* live log */}
      <div className="sec-block">
        <div className="sec-block__header">
          <span className="sec-block__icon">◈</span>
          <h3 className="sec-block__title">Live Command Log</h3>
        </div>
        <div className="sec-log-list">
          {logs.slice(0, 10).map((entry) => (
            <div key={entry.id} className="sec-log-row">
              <span className="sec-log-row__time">
                {new Date(entry.ts).toLocaleTimeString()}
              </span>
              <span className="sec-log-row__mode">{entry.mode}</span>
              <code className="sec-log-row__cmd">{entry.command}</code>
              {entry.alert && <span className="sec-log-row__flag">⚠</span>}
            </div>
          ))}
          {logs.length === 0 && (
            <p className="sec-empty">Waiting for attacker activity...</p>
          )}
        </div>
      </div>

      {/* top commands */}
      <div className="sec-block">
        <div className="sec-block__header">
          <span className="sec-block__icon">▤</span>
          <h3 className="sec-block__title">Command Frequency</h3>
        </div>
        <div className="sec-cmds">
          {stats.topCommands.length === 0 && (
            <p className="sec-empty">No command data yet.</p>
          )}
          {stats.topCommands.map((entry) => {
            const maxCount = stats.topCommands[0]?.count || 1;
            const pct = Math.round((entry.count / maxCount) * 100);
            return (
              <div key={entry.command} className="sec-cmd-row">
                <div className="sec-cmd-row__info">
                  <code className="sec-cmd-row__name">{entry.command}</code>
                  <span className="sec-cmd-row__count">{entry.count}×</span>
                </div>
                <div className="sec-cmd-row__bar-track">
                  <div className="sec-cmd-row__bar" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
