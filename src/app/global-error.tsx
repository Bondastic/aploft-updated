"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="da">
      <body style={{ margin: 0, minHeight: "100vh", background: "#f3f1ec", color: "#25222c", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "20vh auto", padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Noget gik galt</h1>
          <p style={{ color: "rgba(37,34,44,0.6)", lineHeight: 1.5 }}>
            Appen kunne ikke indlæses. Prøv at genindlæse siden. Dine fremskridt ligger stadig på denne enhed.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 20,
              border: 0,
              borderRadius: 6,
              background: "#25222c",
              color: "#fdfcfa",
              padding: "10px 22px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Prøv igen
          </button>
        </div>
      </body>
    </html>
  );
}
