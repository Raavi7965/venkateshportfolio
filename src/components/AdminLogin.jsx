import { useState } from "react";

const C = {
  bg: "#07070d", bg2: "#0e0e18", card: "#0f0f1c",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  text: "#edeaf8", muted: "#7b7896", muted2: "#a09cbd",
  accent: "#6c5ce7", teal: "#00d9a3", danger: "#ff4757",
};

const ADMIN_USER = "venkatesh";
const ADMIN_PASS = "vr@admin2003";

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!user || !pass) { setError("Please enter both username and password."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        onLogin();
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  const inputStyle = {
    width: "100%", background: C.bg2, border: `1px solid ${C.border2}`,
    borderRadius: "10px", padding: "0.8rem 1rem", color: C.text,
    fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.95rem",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Cabinet Grotesk', sans-serif",
      backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,92,231,0.12) 0%, transparent 70%)",
    }}>
      <div style={{
        width: "100%", maxWidth: 420, background: C.card,
        border: `1px solid ${C.border2}`, borderRadius: "20px",
        padding: "2.5rem 2.5rem 2rem", animation: "fadeIn 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 60, height: 60, borderRadius: "16px",
            background: "rgba(108,92,231,0.15)", border: `1px solid rgba(108,92,231,0.3)`,
            marginBottom: "1rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>
            Admin Panel
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem" }}>Sign in to manage your portfolio</p>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.73rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>Username</label>
            <input
              type="text" placeholder="Enter username" value={user}
              onChange={e => { setUser(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border2}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.73rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} placeholder="Enter password" value={pass}
                onChange={e => { setPass(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border2}
              />
              <button onClick={() => setShowPass(v => !v)} style={{
                position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: C.muted, cursor: "pointer", padding: "0.2rem",
              }}>
                {showPass
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,71,87,0.08)", border: `1px solid rgba(255,71,87,0.25)`, borderRadius: "8px", padding: "0.7rem 1rem", fontSize: "0.85rem", color: C.danger }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              background: loading ? "rgba(108,92,231,0.5)" : C.accent, color: "#fff",
              border: "none", padding: "0.9rem", borderRadius: "10px",
              fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "default" : "pointer",
              fontFamily: "'Cabinet Grotesk', sans-serif", marginTop: "0.3rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#5a4dd6"; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = C.accent; }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: C.muted, fontSize: "0.8rem", marginTop: "1.5rem" }}>
          <a href="/" style={{ color: C.muted2 }}>← Back to Portfolio</a>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}
