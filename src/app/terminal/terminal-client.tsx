"use client";

import { useEffect, useRef, useState } from "react";

type Entry = {
  id: string;
  kind: "command" | "output" | "system";
  text: string;
};

const COOLDOWN_MS = 1000;
const MIN_DELAY = 10;
const MAX_DELAY = 30;

function randomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

export default function TerminalClient() {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: "intro",
      kind: "system",
      text: "Connected to bhoolbhulaiya honeypot. Streaming mode engaged.",
    },
  ]);
  const [command, setCommand] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const queueRef = useRef("");
  const typingRef = useRef<number | null>(null);
  const streamDoneRef = useRef(false);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  useEffect(() => {
    if (!cooldownUntil) {
      return;
    }

    const timer = window.setInterval(() => {
      if (Date.now() >= cooldownUntil) {
        setCooldown(false);
        setCooldownUntil(0);
      }
    }, 120);

    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  useEffect(() => {
    const handleKillSwitch = async (event: KeyboardEvent) => {
      if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "x")) {
        return;
      }
      event.preventDefault();

      const baseUrl =
        process.env.NEXT_PUBLIC_HONEYPOT_URL ?? "http://localhost:8000";

      if (sessionId) {
        await fetch(`${baseUrl}/api/terminal/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, command: "" }),
        });
      }

      queueRef.current = "";
      streamDoneRef.current = false;
      setSessionId(null);
      setBusy(false);
      setCooldown(false);
      setCooldownUntil(0);
      setError(null);
      setEntries([
        {
          id: crypto.randomUUID(),
          kind: "system",
          text: "Kill switch activated. Session reset.",
        },
      ]);
    };

    window.addEventListener("keydown", handleKillSwitch);
    return () => window.removeEventListener("keydown", handleKillSwitch);
  }, [sessionId]);

  const appendEntry = (entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const updateLastOutput = (nextChar: string) => {
    setEntries((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.kind !== "output") {
        return [...prev, { id: crypto.randomUUID(), kind: "output", text: nextChar }];
      }
      return [...prev.slice(0, -1), { ...last, text: last.text + nextChar }];
    });
  };

  const pumpTyping = () => {
    if (typingRef.current !== null) {
      return;
    }

    const tick = () => {
      if (!queueRef.current.length) {
        typingRef.current = null;
        if (streamDoneRef.current) {
          setBusy(false);
        }
        return;
      }

      const nextChar = queueRef.current[0];
      queueRef.current = queueRef.current.slice(1);
      updateLastOutput(nextChar);
      typingRef.current = window.setTimeout(tick, randomDelay());
    };

    typingRef.current = window.setTimeout(tick, randomDelay());
  };

  const enqueueText = (text: string) => {
    queueRef.current += text;
    pumpTyping();
  };

  const handleSend = async (forcedCommand?: string) => {
    const payloadCommand = (forcedCommand ?? command).trim();
    if (!payloadCommand || busy) {
      return;
    }

    const now = Date.now();
    if (now - lastSentRef.current < COOLDOWN_MS) {
      setCooldown(true);
      setCooldownUntil(now + COOLDOWN_MS);
      appendEntry({
        id: crypto.randomUUID(),
        kind: "system",
        text: "Processing...",
      });
      window.setTimeout(() => {
        setCooldown(false);
        handleSend(payloadCommand);
      }, COOLDOWN_MS);
      return;
    }

    lastSentRef.current = now;
    setCommand("");
    setBusy(true);
    setError(null);
    streamDoneRef.current = false;

    appendEntry({
      id: crypto.randomUUID(),
      kind: "command",
      text: `\$ ${payloadCommand}`,
    });

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_HONEYPOT_URL ?? "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/terminal/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: payloadCommand,
          session_id: sessionId,
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          const retryAt = Date.now() + COOLDOWN_MS;
          setCooldown(true);
          setCooldownUntil(retryAt);
          appendEntry({
            id: crypto.randomUUID(),
            kind: "system",
            text: "Rate limit hit. Cooling down...",
          });
          throw new Error("Rate limited");
        }
        throw new Error("Backend unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data: ")) {
            continue;
          }
          const chunk = part.replace("data: ", "");
          enqueueText(chunk);
        }
      }

      if (buffer.startsWith("data: ")) {
        enqueueText(buffer.replace("data: ", ""));
      }

      const sessionHeader = response.headers.get("x-session-id");
      if (sessionHeader) {
        setSessionId(sessionHeader);
      }
    } catch (err) {
      setBusy(false);
      if ((err as Error).message === "Rate limited") {
        setError("Cooling down. Try again shortly.");
      } else {
        setError("Honeypot backend is not reachable.");
        appendEntry({
          id: crypto.randomUUID(),
          kind: "system",
          text: "Connection failed. Check backend status and GROQ_API_KEY.",
        });
      }
      return;
    }

    streamDoneRef.current = true;
    pumpTyping();
  };

  return (
    <section className="t-panel">
      <div className="t-output" ref={outputRef}>
        {entries.map((entry) => (
          <p key={entry.id} className={`t-line t-line--${entry.kind}`}>
            {entry.kind === "command" && <span className="t-line__prompt">❯</span>}
            {entry.kind === "system" && <span className="t-line__sys">⚡</span>}
            {entry.text}
          </p>
        ))}
        {busy && (
          <p className="t-line t-line--system t-line--streaming">
            <span className="t-line__sys">◉</span> Streaming response
            <span className="t-dots"><span>.</span><span>.</span><span>.</span></span>
          </p>
        )}
      </div>
      <div className="t-input-row">
        <span className="t-prompt">
          <span className="t-prompt__user">attacker</span>
          <span className="t-prompt__at">@</span>
          <span className="t-prompt__host">trap</span>
          <span className="t-prompt__sep">:</span>
          <span className="t-prompt__path">~</span>
          <span className="t-prompt__dollar">$</span>
        </span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !cooldown) {
              handleSend();
            }
          }}
          placeholder="type a command..."
          className="t-input"
          disabled={busy}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          className="t-send"
          onClick={() => handleSend()}
          disabled={busy || cooldown}
        >
          <span className="t-send__icon">▶</span>
          Execute
        </button>
      </div>
      {cooldownUntil > 0 && (
        <p className="t-cooldown">
          ⏳ Cooldown active — {Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))}s remaining
        </p>
      )}
      {error && <p className="t-error">⚠ {error}</p>}
    </section>
  );
}
