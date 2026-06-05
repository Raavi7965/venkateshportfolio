import { useState } from "react";

const C = {
  bg: "#07070d", bg2: "#0e0e18", bg3: "#141420",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  text: "#edeaf8", muted: "#7b7896", muted2: "#a09cbd",
  accent: "#6c5ce7", accent2: "#a29bf5",
  teal: "#00d9a3", danger: "#ff4757",
};

const CREDENTIALS = { username: "venkatesh", password: "vr@admin2003" };

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setErr("");
    if (!user || !pass) { setErr("Please enter both username and password."); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
        onLogin();
      } else {
        setErr("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  const inp = {
    width: "100%", background: C.bg2, border: `0.5px solid ${C.border2}`,
    borderRadius: "10px", padding: "0.82rem 1rem", color: C.text,
    fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.95rem",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Cabinet Grotesk', sans-serif",
      padding: "2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@400;500;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 50% at 50% 50%,rgba(108,92,231,0.1) 0%,transparent 70%)",
      }} />

      <div style={{
        width: "100%", maxWidth: 420, position: "relative",
        animation: "fadeUp 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "16px",
            background: `linear-gradient(135deg,${C.accent},${C.accent2})`,
            fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800,
            color: "#fff", marginBottom: "1rem",
          }}>VR</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", color: C.text }}>
            Admin Panel
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem", marginTop: "0.4rem" }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.bg3, border: `0.5px solid ${C.border2}`,
          borderRadius: "20px", padding: "2.2rem",
        }}>
          {/* Username */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontSize: "0.74rem", color: C.muted, marginBottom: "0.42rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Username
            </label>
            <input
              type="text" value={user} placeholder="Enter username"
              onChange={e => setUser(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handle()}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border2}
              style={inp}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.4rem" }}>
            <label style={{ display: "block", fontSize: "0.74rem", color: C.muted, marginBottom: "0.42rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} value={pass} placeholder="Enter password"
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handle()}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border2}
                style={{ ...inp, paddingRight: "3rem" }}
                autoComplete="current-password"
              />
              <button
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: C.muted, cursor: "pointer",
                  fontSize: "1.1rem", padding: 0, lineHeight: 1,
                }}
              >{showPass ? "🙈" : "👁"}</button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div style={{
              background: "rgba(255,71,87,0.08)", border: "0.5px solid rgba(255,71,87,0.25)",
              borderRadius: "8px", padding: "0.65rem 1rem", marginBottom: "1.1rem",
              fontSize: "0.84rem", color: C.danger,
            }}>
              ⚠ {err}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handle}
            disabled={loading}
            style={{
              width: "100%", background: loading ? "rgba(108,92,231,0.5)" : C.accent,
              color: "#fff", border: "none", padding: "0.88rem",
              borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              fontFamily: "'Cabinet Grotesk', sans-serif", transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#5a4dd6"; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = C.accent; }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          {/* Hint */}
          <p style={{ textAlign: "center", fontSize: "0.77rem", color: C.muted, marginTop: "1.2rem", lineHeight: 1.5 }}>
            Credentials are set in <code style={{ color: C.accent2, fontSize: "0.75rem" }}>AdminLogin.jsx</code>
          </p>
        </div>
      </div>
    </div>
  );
}