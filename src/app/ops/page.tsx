import TerminalClient from "../terminal/terminal-client";
import DashboardClient from "./security-client";

export default function OpsPage() {
  return (
    <div className="o-shell">
      {/* background effects */}
      <div className="t-bg-grid" aria-hidden="true" />
      <div className="o-bg-orb o-bg-orb--1" aria-hidden="true" />
      <div className="o-bg-orb o-bg-orb--2" aria-hidden="true" />
      <div className="o-bg-orb o-bg-orb--3" aria-hidden="true" />
      <div className="t-bg-scanline" aria-hidden="true" />
      <div className="t-bg-noise" aria-hidden="true" />

      {/* header */}
      <header className="o-header">
        <div className="o-header__left">
          <div className="t-header__tag-row">
            <span className="t-tag t-tag--green">BHOOLBHULAIYA</span>
            <span className="t-tag t-tag--orange">THREAT OPS</span>
            <span className="t-tag t-tag--pulse">● LIVE</span>
          </div>
          <h1 className="o-header__title">
            Live Threat <span className="o-header__accent">Console</span>
          </h1>
          <p className="t-header__sub">
            // split-screen intel &mdash; hacker view + security telemetry in real time
          </p>
        </div>
        <div className="t-header__right">
          <a href="/" className="t-pill-btn t-pill-btn--ghost">
            <span className="t-pill-btn__icon">◁</span> Home
          </a>
          <a href="/terminal" className="t-pill-btn t-pill-btn--outline">
            <span className="t-pill-btn__dot" /> Terminal
          </a>
          <div className="o-status-chip">
            <span className="o-status-chip__ring" />
            Monitoring
          </div>
        </div>
      </header>

      {/* split view */}
      <div className="o-grid">
        {/* left — hacker view */}
        <section className="o-panel o-panel--hacker">
          <div className="o-panel__header">
            <div className="o-panel__header-left">
              <span className="o-panel__icon">⌨</span>
              <h2 className="o-panel__title">Hacker View</h2>
            </div>
            <div className="o-panel__badges">
              <span className="o-badge o-badge--cyan">INTERACTIVE</span>
              <span className="o-badge o-badge--green">SSE STREAM</span>
            </div>
          </div>
          <div className="o-panel__chrome">
            <div className="t-terminal-chrome__dots"><span /><span /><span /></div>
            <span className="t-terminal-chrome__title">attacker@trap ~ /exploit</span>
          </div>
          <TerminalClient />
        </section>

        {/* right — security view */}
        <section className="o-panel o-panel--security">
          <div className="o-panel__header">
            <div className="o-panel__header-left">
              <span className="o-panel__icon">◉</span>
              <h2 className="o-panel__title">Security Intel</h2>
            </div>
            <div className="o-panel__badges">
              <span className="o-badge o-badge--orange">TELEMETRY</span>
              <span className="o-badge o-badge--red">ALERTS</span>
            </div>
          </div>
          <DashboardClient />
        </section>
      </div>
    </div>
  );
}
