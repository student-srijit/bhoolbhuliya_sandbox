"use client";

import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";

interface Metrics {
  totalCommands: number;
  uniqueSessions: number;
  uniqueIPs: number;
  alertsTriggered: number;
  guardsTriggered: number;
  uptime: string;
  lastActivity: number;
  recentCommands: { command: string; ts: string }[];
}

const API =
  process.env.NEXT_PUBLIC_HONEYPOT_URL || "http://localhost:8000";

const MetricsCtx = createContext<{ m: Metrics | null; online: boolean }>({
  m: null,
  online: false,
});

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [m, setM] = useState<Metrics | null>(null);
  const [online, setOnline] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/metrics`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch error");
      const data: Metrics = await res.json();
      setM(data);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 4000);
    return () => clearInterval(id);
  }, [fetchMetrics]);

  return (
    <MetricsCtx.Provider value={{ m, online }}>
      {children}
    </MetricsCtx.Provider>
  );
}

export function HeroStats() {
  const { m, online } = useContext(MetricsCtx);

  return (
    <div className="hero__stats">
      <div className="hero__stat">
        <span className="hero__stat-val">{m ? m.totalCommands : "—"}</span>
        <span className="hero__stat-label">Commands Captured</span>
      </div>
      <div className="hero__stat-sep" />
      <div className="hero__stat">
        <span className="hero__stat-val">{m ? m.uniqueSessions : "—"}</span>
        <span className="hero__stat-label">Sessions</span>
      </div>
      <div className="hero__stat-sep" />
      <div className="hero__stat">
        <span className="hero__stat-val">{m ? m.alertsTriggered : "—"}</span>
        <span className="hero__stat-label">Alerts Fired</span>
      </div>
      <div className="hero__stat-sep" />
      <div className="hero__stat">
        <span className="hero__stat-val live-status">
          <span
            className={`status-indicator ${online ? "status-indicator--on" : "status-indicator--off"}`}
          />
          {online ? "LIVE" : "OFFLINE"}
        </span>
        <span className="hero__stat-label">Backend</span>
      </div>
    </div>
  );
}

export function LiveMetrics() {
  const { m } = useContext(MetricsCtx);

  return (
    <section className="metrics" id="live-metrics">
      <div className="metric">
        <span className="metric__val">{m ? m.totalCommands : "—"}</span>
        <span className="metric__label">Total Commands</span>
      </div>
      <div className="metric">
        <span className="metric__val">{m ? m.uniqueIPs : "—"}</span>
        <span className="metric__label">Unique IPs</span>
      </div>
      <div className="metric">
        <span className="metric__val">{m ? m.guardsTriggered : "—"}</span>
        <span className="metric__label">Guards Triggered</span>
      </div>
      <div className="metric">
        <span className="metric__val">{m ? m.uptime || "—" : "—"}</span>
        <span className="metric__label">Backend Uptime</span>
      </div>
    </section>
  );
}

function timeSince(ts: number) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function LiveActivityFeed() {
  const { m, online } = useContext(MetricsCtx);

  if (!m || m.recentCommands.length === 0) return null;

  return (
    <section className="recent-activity">
      <div className="section__label">
        <span className="section__num">
          <span
            className={`status-indicator ${online ? "status-indicator--on" : "status-indicator--off"}`}
          />
        </span>
        Live Activity Feed
      </div>
      <div className="activity-feed">
        {m.recentCommands.map((cmd, i) => (
          <div key={i} className="activity-row">
            <span className="activity-time">
              {timeSince(Number(cmd.ts))}
            </span>
            <code className="activity-cmd">{cmd.command}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
