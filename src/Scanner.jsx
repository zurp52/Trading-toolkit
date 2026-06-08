import { useState } from "react";

const SIGNALS = [
  { key: "HYPE", label: "🚀 HYPE", color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.25)" },
  { key: "MIXED", label: "⚠️ MIXED", color: "#ffcc00", bg: "rgba(255,204,0,0.08)", border: "rgba(255,204,0,0.25)" },
  { key: "DYOR", label: "🧠 DYOR", color: "#888aff", bg: "rgba(136,138,255,0.08)", border: "rgba(136,138,255,0.25)" },
  { key: "FUD", label: "🚨 FUD / RUG RISK", color: "#ff3c50", bg: "rgba(255,60,80,0.08)", border: "rgba(255,60,80,0.25)" },
];

export default function Scanner() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true); setResult(null); setError(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          messages: [{ role: "user", content: `You are a memecoin trading expert. Analyze this post and return ONLY raw JSON (no markdown):\n{"signal":"HYPE|MIXED|DYOR|FUD","score":0-100,"summary":"1 sentence","bullish_signs":["..."],"bearish_signs":["..."],"rug_risk":"LOW|MEDIUM|HIGH","recommended_action":"1 sentence"}\n\nPost: ${text}` }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content?.filter(i => i.type === "text").map(i => i.text).join("") || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse response");
      const parsed = JSON.parse(match[0]);
      parsed.signal = ["HYPE","MIXED","DYOR","FUD"].includes(parsed.signal?.toUpperCase()) ? parsed.signal.toUpperCase() : "DYOR";
      setResult(parsed);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  }

  const meta = result ? SIGNALS.find(s => s.key === result.signal) || SIGNALS[2] : null;
  const rugColor = result?.rug_risk === "HIGH" ? "#ff3c50" : result?.rug_risk === "MEDIUM" ? "#ffcc00" : "#00ff88";

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder='Paste a tweet or CT post here...' style={{ width: "100%", minHeight: 130, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, color: "#fff", fontSize: 14, padding: "14px 16px", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />

      <button onClick={analyze} disabled={loading || !text.trim()} style={{ width: "100%", marginTop: 12, padding: 14, background: loading || !text.trim() ? "rgba(0,255,136,0.15)" : "#00ff88", color: loading || !text.trim() ? "#00ff8866" : "#000", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading || !text.trim() ? "not-allowed" : "pointer" }}>
        {loading ? "Analyzing..." : "⚡ Analyze Sentiment"}
      </button>

      {loading && <div style={{ textAlign: "center", padding: "30px 0", color: "#444" }}>🔍 Reading the CT energy...</div>}

      {error && <div style={{ marginTop: 16, background: "rgba(255,60,80,0.08)", border: "1px solid rgba(255,60,80,0.2)", borderRadius: 12, padding: 16, color: "#ff3c50", fontSize: 13 }}>Error: {error}</div>}

      {result && meta && (
        <div style={{ marginTop: 20, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 16, padding: "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: meta.color }}>{meta.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: rugColor, background: `${rugColor}15`, border: `1px solid ${rugColor}30`, borderRadius: 20, padding: "4px 10px" }}>RUG: {result.rug_risk}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 2 }}>Hype Score</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: meta.color, fontFamily: "monospace" }}>{result.score}/100</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.score}%`, background: meta.color, borderRadius: 99 }} />
            </div>
          </div>

          <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, marginBottom: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>{result.summary}</div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {result.bullish_signs?.length > 0 && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#00ff88", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Bullish</div>
                {result.bullish_signs.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>✅ {s}</div>)}
              </div>
            )}
            {result.bearish_signs?.length > 0 && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#ff3c50", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Bearish</div>
                {result.bearish_signs.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>⚠️ {s}</div>)}
              </div>
            )}
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#fff", fontWeight: 600, borderLeft: `3px solid ${meta.color}` }}>
            💡 {result.recommended_action}
          </div>
        </div>
      )}
    </div>
  );
}
