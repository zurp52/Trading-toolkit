import { useState } from "react";
import Journal from "./Journal";
import Scanner from "./Scanner";

export default function App() {
  const [tab, setTab] = useState("journal");

  const tabs = [
    { id: "journal", label: "📒 Journal" },
    { id: "scanner", label: "🔍 Scanner" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070d", color: "#fff", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px", background: "linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "#00ff88", letterSpacing: 3, textTransform: "uppercase" }}>Memecoin</div>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Trading Toolkit</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px", background: tab === t.id ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${tab === t.id ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 10, color: tab === t.id ? "#00ff88" : "#666", fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>
        {tab === "journal" && <Journal />}
        {tab === "scanner" && <Scanner />}
      </div>
    </div>
  );
}
