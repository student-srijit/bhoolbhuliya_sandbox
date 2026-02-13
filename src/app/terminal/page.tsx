import TerminalClient from "./terminal-client";

export default function TerminalPage() {
  return (
    <div className="t-shell">
      {/* background effects */}
      <div className="t-bg-grid" aria-hidden="true" />
      <div className="t-bg-orb t-bg-orb--1" aria-hidden="true" />
      <div className="t-bg-orb t-bg-orb--2" aria-hidden="true" />
      <div className="t-bg-scanline" aria-hidden="true" />
      <div className="t-bg-noise" aria-hidden="true" />

      {/* header */}
      <header className="t-header">
        <div className="t-header__left">
          <div className="t-header__tag-row">
            <span className="t-tag t-tag--green">BHOOLBHULAIYA</span>
            <span className="t-tag t-tag--cyan">AI HONEYPOT</span>
            <span className="t-tag t-tag--pulse">● LIVE</span>
          </div>
          <h1 className="t-header__title">
            Honeypot <span className="t-header__accent">Console</span>
          </h1>
          <p className="t-header__sub">
            // interactive shell &mdash; every command is analyzed, logged &amp; streamed to ops
          </p>
        </div>
        <div className="t-header__right">
          <a href="/" className="t-pill-btn t-pill-btn--ghost">
            <span className="t-pill-btn__icon">◁</span> Home
          </a>
          <a href="/ops" className="t-pill-btn t-pill-btn--outline">
            <span className="t-pill-btn__dot" /> Security View
          </a>
          <div className="t-status-chip">
            <span className="t-status-chip__ring" />
            Streaming
          </div>
        </div>
      </header>

      {/* system bar */}
      <div className="t-sysbar">
        <span className="t-sysbar__item">
          <span className="t-sysbar__label">PROTOCOL</span> bhoolbhulaiya v1.0
        </span>
        <span className="t-sysbar__sep">│</span>
        <span className="t-sysbar__item">
          <span className="t-sysbar__label">ENGINE</span> LLaMA 3.3-70b
        </span>
        <span className="t-sysbar__sep">│</span>
        <span className="t-sysbar__item">
          <span className="t-sysbar__label">MODE</span> Deception
        </span>
        <span className="t-sysbar__sep">│</span>
        <span className="t-sysbar__item t-sysbar__item--blink">
          <span className="t-sysbar__label">THREAT LEVEL</span> HUNTING
        </span>
      </div>

      {/* terminal */}
      <div className="t-terminal-wrap">
        <div className="t-terminal-chrome">
          <div className="t-terminal-chrome__dots">
            <span /><span /><span />
          </div>
          <span className="t-terminal-chrome__title">bhoolbhulaiya@honeypot ~ /trap</span>
          <span className="t-terminal-chrome__badge">SSE</span>
        </div>
        <TerminalClient />
      </div>

      {/* hints */}
      <div className="t-hints">
        <span className="t-hint">
          <kbd>Enter</kbd> send command
        </span>
        <span className="t-hint">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> kill session
        </span>
        <span className="t-hint">
          Try: <code>ls</code> <code>whoami</code> <code>cat /etc/passwd</code> <code>sudo su</code>
        </span>
      </div>
    </div>
  );
}
