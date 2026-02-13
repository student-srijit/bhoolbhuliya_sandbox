import { cookies, headers } from "next/headers";
import ConnectWalletButton from "@/app/connect-wallet";
import LiveTerminalPreview from "@/app/live-terminal-preview";
import {
  MetricsProvider,
  HeroStats,
  LiveMetrics,
  LiveActivityFeed,
} from "@/app/live-stats";
import HackerOverlay from "@/app/hacker-overlay";
import MatrixRain from "@/app/matrix-rain";
import { GlitchText, HexCounter } from "@/app/cyber-fx";
import { createClassMap, createCss } from "@/lib/polymorph";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const headerList = await headers();
  const headerSeed = headerList.get("x-mp-seed");
  const cookieStore = await cookies();
  const seed =
    headerSeed ?? cookieStore.get("mp_seed")?.value ?? "fallbackseed";
  const classes = createClassMap(seed);
  const cssText = createCss(classes);

  return (
    <div className={`landing ${classes.shell}`}>
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <HackerOverlay />
      <MetricsProvider>

      {/* ---- matrix rain canvas ---- */}
      <MatrixRain />

      {/* ---- animated background ---- */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow bg-glow--1" aria-hidden="true" />
      <div className="bg-glow bg-glow--2" aria-hidden="true" />
      <div className="bg-glow bg-glow--3" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      <div className="bg-scanline" aria-hidden="true" />
      <div className={classes.orbit} />

      {/* ---- navigation ---- */}
      <nav className="nav">
        <a href="/" className="nav__brand">
          <span className="nav__logo">
            <span className="nav__logo-pulse" />
          </span>
          <GlitchText text="bhoolbhulaiya" />
        </a>
        <div className="nav__links">
          <a href="#features">Features</a>
          <a href="#architecture">Stack</a>
          <a href="#ops">Ops</a>
          <a href="/terminal" className="nav__cta">
            <span className="nav__cta-dot" />
            Launch Terminal
          </a>
        </div>
      </nav>

      {/* ---- hero ---- */}
      <section className={`hero ${classes.card}`}>
        <div className="hero__left">
          <div className={`hero__badge ${classes.status}`}>
            <span className="pulse-dot" />
            System Online &mdash; Polymorphic Shield Active
            <HexCounter className="hero__hex" />
          </div>

          <h1 className={`hero__title ${classes.title}`}>
            <span className="hero__title-line">
              <GlitchText text="The frontend" />
            </span>
            <span className="hero__title-line">
              that <span className="gradient-text">fights back.</span>
            </span>
          </h1>

          <p className="hero__tagline">// ADAPTIVE DEFENSE PROTOCOL</p>

          <p className={`hero__desc ${classes.subtitle}`}>
            bhoolbhulaiya morphs your UI on every request, traps automated
            drainers in an AI-powered honeypot, and streams their every move to
            your security dashboard &mdash; in real time.
          </p>

          <div className="hero__actions">
            <ConnectWalletButton
              className={`btn btn--primary ${classes.connectButton}`}
            />
            <a href="/terminal" className="btn btn--outline">
              Enter Terminal <span className="btn__arrow">&rarr;</span>
            </a>
            <a href="/ops" className="btn btn--ghost">
              Ops Dashboard
            </a>
          </div>

          {/* Live stats rendered by client component */}
          <HeroStats />
        </div>

        <div className="hero__right">
          <LiveTerminalPreview />
          <div className="hero__session">
            <span className="pulse-dot pulse-dot--sm" />
            Session: <code>{seed.slice(0, 10)}</code>
            <span className="hero__session-sep">|</span>
            <HexCounter />
          </div>
        </div>

        <div className={classes.connectGlow} />
      </section>

      {/* ---- scrolling ticker ---- */}
      <div className="ticker">
        <div className="ticker__track">
          {[0, 1].map((i) => (
            <div className="ticker__set" key={i}>
              <span>POLYMORPHIC DOM</span>
              <span className="ticker__sep">&#9670;</span>
              <span>AI HONEYPOT</span>
              <span className="ticker__sep">&#9670;</span>
              <span>LIVE TELEMETRY</span>
              <span className="ticker__sep">&#9670;</span>
              <span>ZERO STATIC SELECTORS</span>
              <span className="ticker__sep">&#9670;</span>
              <span>BOT DEFLECTION</span>
              <span className="ticker__sep">&#9670;</span>
              <span>THREAT INTELLIGENCE</span>
              <span className="ticker__sep">&#9670;</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- features bento ---- */}
      <section className="section" id="features">
        <div className="section__label">
          <span className="section__num">01</span>
          Defense Layers
        </div>
        <h2 className="section__title">
          Dual-layer defense that{" "}
          <span className="gradient-text">adapts faster than attackers.</span>
        </h2>
        <div className="bento">
          <article className="bento__card bento__card--lg">
            <span className="bento__icon">&Xi;</span>
            <h3>Polymorphic Shield</h3>
            <p>
              Server-generated class maps invalidate every selector-based
              drainer on every request. Your DOM is a moving target no script
              can pin down.
            </p>
            <span className="bento__tag">Core Defense</span>
          </article>
          <article className="bento__card">
            <span className="bento__icon">&loz;</span>
            <h3>Bait Signals</h3>
            <p>
              Honeypot routes and decoy wallet buttons fingerprint bots the
              instant they touch the DOM.
            </p>
          </article>
          <article className="bento__card">
            <span className="bento__icon">&oplus;</span>
            <h3>AI Honeypot</h3>
            <p>
              Attackers land in a fake Linux shell powered by LLaMA 3.3 &mdash;
              infinite engagement, zero risk.
            </p>
          </article>
          <article className="bento__card bento__card--lg">
            <span className="bento__icon">&there4;</span>
            <h3>Threat Console</h3>
            <p>
              Real-time telemetry streams every attacker command, alert burst,
              and behavioral pattern to your ops dashboard. Split-screen command
              theater with live log replay.
            </p>
            <span className="bento__tag">Live Feed</span>
          </article>
        </div>
      </section>

      {/* ---- how it works ---- */}
      <section className="section">
        <div className="section__label">
          <span className="section__num">02</span>
          How It Works
        </div>
        <h2 className="section__title">
          From first request to{" "}
          <span className="gradient-text">full containment.</span>
        </h2>
        <div className="steps">
          <div className="step">
            <div className="step__num">01</div>
            <div className="step__connector" />
            <h3>Seed &amp; Mutate</h3>
            <p>
              Middleware generates a unique seed. SSR delivers fresh class maps
              and obfuscated DOM hooks.
            </p>
          </div>
          <div className="step">
            <div className="step__num">02</div>
            <div className="step__connector" />
            <h3>Tripwire</h3>
            <p>
              Hidden routes and decoy elements detect suspicious automated
              access patterns instantly.
            </p>
          </div>
          <div className="step">
            <div className="step__num">03</div>
            <div className="step__connector" />
            <h3>Honeypot Stream</h3>
            <p>
              LLM-backed shell replies stream token by token. Attackers believe
              they hit a real server.
            </p>
          </div>
          <div className="step">
            <div className="step__num">04</div>
            <div className="step__connector" />
            <h3>Analyst Loop</h3>
            <p>
              Dashboard logs, alerts, and command heatmaps update in real time
              for your security team.
            </p>
          </div>
        </div>
      </section>

      {/* ---- architecture ---- */}
      <section className="section" id="architecture">
        <div className="section__label">
          <span className="section__num">03</span>
          Architecture
        </div>
        <h2 className="section__title">
          Built for teams that need{" "}
          <span className="gradient-text">offensive defense.</span>
        </h2>
        <div className="arch">
          <div className="arch__card">
            <div className="arch__label">Frontend</div>
            <h3>Next.js App Router</h3>
            <p>
              Edge middleware seeds, SSR class reshaping, and bait endpoints
              deploy at the CDN edge.
            </p>
            <div className="arch__tags">
              <span>React 19</span>
              <span>TypeScript</span>
              <span>SSR</span>
            </div>
          </div>
          <div className="arch__card">
            <div className="arch__label">Backend</div>
            <h3>FastAPI + Groq</h3>
            <p>
              Async streaming with guardrails, prompt injection defense, and
              sub-200ms response times.
            </p>
            <div className="arch__tags">
              <span>Python</span>
              <span>LLaMA 3.3</span>
              <span>SSE</span>
            </div>
          </div>
          <div className="arch__card">
            <div className="arch__label">Telemetry</div>
            <h3>Upstash Redis</h3>
            <p>
              Serverless log ingestion, alert pipelines, and real-time stats
              powering the ops console.
            </p>
            <div className="arch__tags">
              <span>Redis</span>
              <span>REST API</span>
              <span>Realtime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- live metrics + activity feed (client component) ---- */}
      <LiveMetrics />
      <LiveActivityFeed />

      {/* ---- final CTA ---- */}
      <section className="section cta-final" id="ops">
        <h2 className="section__title">
          Deploy the <span className="gradient-text">moving target.</span>
        </h2>
        <p className="cta-final__desc">
          Turn your dApp from a static target into a hostile environment. Start
          with the terminal demo or jump straight to the ops dashboard.
        </p>
        <div className="cta-final__actions">
          <a href="/terminal" className="btn btn--primary">
            Try the Honeypot <span className="btn__arrow">&rarr;</span>
          </a>
          <a href="/ops" className="btn btn--outline">
            View Ops Console <span className="btn__arrow">&rarr;</span>
          </a>
        </div>
      </section>

      {/* ---- footer ---- */}
      <footer className="footer">
        <div className="footer__left">
          <div className="nav__brand">
            <span className="nav__logo">
              <span className="nav__logo-pulse" />
            </span>
            <GlitchText text="bhoolbhulaiya" />
          </div>
          <p>Offensive security for Web3 frontends.</p>
        </div>
        <div className="footer__links">
          <a href="/terminal">Terminal</a>
          <a href="/ops">Ops</a>
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
        </div>
        <div className="footer__right">
          <p>
            Seed <code>{seed.slice(0, 12)}</code>
          </p>
          <HexCounter className="footer__hex" />
        </div>
      </footer>

      {/* honeypot bait */}
      <a
        href="/admin-login"
        className={classes.baitLink}
        tabIndex={-1}
        aria-hidden="true"
      >
        Admin Login
      </a>
      </MetricsProvider>
    </div>
  );
}
