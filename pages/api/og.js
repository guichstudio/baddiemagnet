import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0a2e 0%, #16082a 30%, #2d1045 60%, #1a0a2e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #C084FC, #EC4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "white",
              marginBottom: 28,
            }}
          >
            ♥
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: "white", letterSpacing: -1, marginBottom: 8 }}>
            Will it last forever?
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }}>
            Relationship analysis based on behavioral psychology
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
