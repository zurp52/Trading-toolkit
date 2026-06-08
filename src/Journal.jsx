import { useState, useEffect } from "react";

const KEY = "meme_trades_v1";
const empty = { coin: "", entry: "", exit: "", size: "", result: "win", emotion: "", notes: "", date: new Date().toISOString().split("T")[0] };

function PnLBadge({ value }) {
  const n = parseFloat(value);
  if (isNaN(n)) return null;
  return (
    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: n >= 0 ? "rgba(0,255,136,0.13)" : "rgba(255,60,80,0.13)", color: n >= 0 ? "#00ff88" : "#ff3c50" }}>
      {n >= 0 ? "+" : ""}{n.toFixed(1)}%
    </span>
  );
}

export default function Journal() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState(empty);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setTrades(JSON.parse(s)); } catch {}
  }, []);

  function save(updated) {
    setTrades(updated);
    try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
  }

  function submit() {
    if (!form.coin || !form.entry) return;
    const pnl = form.entry && form.exit ? (((parseFloat(form.exit) - parseFloat(form.entry)) / parseFloat(form.entry)) * 100).toFixed(2) : null;
    const trade = { ...form, pnl, id: editId || Date.now().toString() };
    save(editId ? trades.map(t => t.id === editId ? trade : t) : [trade, ...trades]);
    setForm(empty); setEditId(null); setView("list");
  }

  const inp = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5, display: "block" };

  const wins = trades.filter(t => t.result === "win").length;
  const losses = trades.filter(t => t.result === "loss").length;
  const winRate = trades.length ? Math.round(wins / trades.length * 100) : 0;

  if (view === "add") return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{editId ? "Edit Trade" : "Log a Trade"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><label style={lbl}>Coin</label><input name="coin" value={form.coin} onChange={e => setForm(f => ({ ...f, coin: e.target.value }))} placeholder="e.g. PEPE" style={inp} /></div>
          <div style={{ flex: 1 }}><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inp} /></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><label style={lbl}>Entry Market Cap ($)</label><input type="number" value={form.entry} onChange={e => setForm(f => ({ ...f, entry: e.target.value }))} placeholder="e.g. 50000" style={inp} /></div>
          <div style={{ flex: 1 }}><label style={lbl}>Exit Market Cap ($)</label><input type="number" value={form.exit} onChange={e => setForm(f => ({ ...f, exit: e.target.value }))} placeholder="Optional" style={inp} /></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><label style={lbl}>Size ($)</label><input type="number" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="Amount" style={inp} /></div>
          <div style={{ flex: 1 }}><label style={lbl}>Result</label>
            <select value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} style={inp}>
              <option value="win">Win ✅</option>
              <option value="loss">Loss ❌</option>
              <option value="open">Open ⏳</option>
            </select>
          </div>
        </div>
        <div><label style={lbl}>Emotion</label><input value={form.emotion} onChange={e => setForm(f => ({ ...f, emotion: e.target.value }))} placeholder="e.g. FOMO, confident..." style={inp} /></div>
        <div><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Why did you enter?" style={{ ...inp, height: 80, resize: "vertical" }} /></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={submit} style={{ flex: 1, background: "#00ff88", color: "#000", border: "none", borderRadius: 10, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{editId ? "Update" : "Save Trade"}</button>
          <button onClick={() => { setView("list"); setForm(empty); setEditId(null); }} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 18px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {trades.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["Win Rate", `${winRate}%`, winRate >= 50 ? "#00ff88" : "#ff3c50"], ["Wins", wins, "#00ff88"], ["Losses", losses, "#ff3c50"]].map(([l, v, c]) => (
            <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1.5 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setView("add")} style={{ width: "100%", background: "rgba(0,255,136,0.08)", border: "1px dashed rgba(0,255,136,0.3)", borderRadius: 12, color: "#00ff88", padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 16 }}>
        + Log New Trade
      </button>

      {trades.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "40px 0" }}>No trades yet 👆</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {trades.map(t => (
          <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${t.result === "win" ? "rgba(0,255,136,0.12)" : t.result === "loss" ? "rgba(255,60,80,0.12)" : "rgba(255,200,0,0.12)"}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>${t.coin.toUpperCase()}</span>
                {t.pnl && <PnLBadge value={t.pnl} />}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#555" }}>{t.date}</span>
                <button onClick={() => { setForm(t); setEditId(t.id); setView("add"); }} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>✏️</button>
                <button onClick={() => save(trades.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>🗑️</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#666", flexWrap: "wrap" }}>
              {t.entry && <span>Entry MC: <b style={{ color: "#aaa" }}>${Number(t.entry).toLocaleString()}</b></span>}
              {t.exit && <span>Exit MC: <b style={{ color: "#aaa" }}>${Number(t.exit).toLocaleString()}</b></span>}
              {t.size && <span>Size: <b style={{ color: "#aaa" }}>${t.size}</b></span>}
              {t.emotion && <span>Feeling: <b style={{ color: "#aaa" }}>{t.emotion}</b></span>}
            </div>
            {t.notes && <div style={{ marginTop: 8, fontSize: 12, color: "#555", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>{t.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
