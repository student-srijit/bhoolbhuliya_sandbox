export default function HoneypotPage() {
  return (
    <main style={{ padding: "64px 24px", color: "#e7ecf2" }}>
      <h1 style={{ fontSize: "2.4rem", marginBottom: "16px" }}>
        Mirage Honeypot
      </h1>
      <p style={{ maxWidth: "680px", lineHeight: 1.7 }}>
        This route is reserved for suspicious traffic. If you reached this page
        in error, return to the main interface.
      </p>
    </main>
  );
}
