import { useState, useEffect, useRef } from "react";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { loadData } from "./data.js";

// ── COLORS ──
const COLORS = {
  bg: "#07070d", bg2: "#0e0e18", bg3: "#141420", bg4: "#1a1a28",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  text: "#edeaf8", muted: "#7b7896", muted2: "#a09cbd",
  accent: "#6c5ce7", accent2: "#a29bf5", accent3: "#d1ccff",
  teal: "#00d9a3", card: "#0f0f1c", card2: "#161625", danger: "#ff4757",
};

// ── HOOKS ──
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ── SVG ICONS ──
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// ── NAV ──
function Nav({ onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 5rem",
      background: scrolled ? "rgba(7,7,13,0.97)" : "rgba(7,7,13,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: `0.5px solid ${COLORS.border}`,
      transition: "background 0.3s",
      fontFamily: "'Cabinet Grotesk', sans-serif",
    }}>
      <a href="#" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: COLORS.text, textDecoration: "none", letterSpacing: "-0.03em" }}>
        VR<span style={{ color: COLORS.teal }}>.</span>
      </a>
      <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
        {["skills", "experience", "projects", "certificates", "education", "about", "contact"].map(s => (
          <li key={s}>
            <button onClick={() => scroll(s)} style={{
              background: "none", border: "none", color: COLORS.muted, fontSize: "0.82rem",
              fontWeight: 500, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase",
              fontFamily: "'Cabinet Grotesk', sans-serif", transition: "color 0.2s", padding: 0,
            }}
              onMouseEnter={e => e.target.style.color = COLORS.text}
              onMouseLeave={e => e.target.style.color = COLORS.muted}>
              {s}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button onClick={onAdminClick} style={{
          background: "transparent", border: `0.5px solid ${COLORS.border2}`, color: COLORS.muted2,
          padding: "0.4rem 0.9rem", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer",
          fontFamily: "'Cabinet Grotesk', sans-serif", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.borderColor = COLORS.accent; e.target.style.color = COLORS.accent2; }}
          onMouseLeave={e => { e.target.style.borderColor = COLORS.border2; e.target.style.color = COLORS.muted2; }}>
          ⚙ Admin
        </button>
        <a href={`mailto:${""}`} style={{
          background: COLORS.accent, color: "#fff", padding: "0.45rem 1.2rem",
          borderRadius: "6px", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none",
          fontFamily: "'Cabinet Grotesk', sans-serif", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "#5a4dd6"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = COLORS.accent; e.target.style.transform = "none"; }}>
          Hire Me
        </a>
      </div>
    </nav>
  );
}

// ── HERO ──
function Hero({ DATA }) {
  const h = DATA.hero;
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "8rem 5rem 5rem", position: "relative", overflow: "hidden",
      fontFamily: "'Cabinet Grotesk', sans-serif",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 60% at 75% 45%,rgba(108,92,231,.14) 0%,transparent 65%), radial-gradient(ellipse 40% 40% at 15% 75%,rgba(0,217,163,.07) 0%,transparent 55%)",
      }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "5rem", alignItems: "center", maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,217,163,0.08)", border: "0.5px solid rgba(0,217,163,0.25)", borderRadius: "100px", padding: "0.3rem 1rem", fontSize: "0.77rem", color: COLORS.teal, marginBottom: "1.5rem", letterSpacing: "0.04em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.teal, animation: "breathe 2.5s ease infinite", display: "inline-block" }} />
            {h.avail}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(3rem,5.5vw,5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "1.3rem" }}>
            {h.name}<br />
            <span style={{ color: COLORS.accent2 }}>{h.role}</span><br />
            <span style={{ fontWeight: 400, fontStyle: "italic", color: COLORS.muted, fontSize: "0.55em", letterSpacing: "-0.01em" }}>{h.tagline}</span>
          </h1>
          <p style={{ color: COLORS.muted2, fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 500, marginBottom: "2.2rem" }}>{h.desc}</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <a href={`mailto:${h.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: COLORS.accent, color: "#fff", padding: "0.8rem 2rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Let's Talk →
            </a>
            <a href={h.github} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: `0.5px solid ${COLORS.border2}`, color: COLORS.text, padding: "0.8rem 2rem", borderRadius: "8px", fontSize: "0.95rem", textDecoration: "none", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              View Work
            </a>
          </div>
          <div style={{ display: "flex", gap: "0.7rem" }}>
            {[{ href: h.github, icon: <GithubIcon /> }, { href: h.linkedin, icon: <LinkedinIcon /> }, { href: `mailto:${h.email}`, icon: <MailIcon /> }].map(({ href, icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" style={{ width: 42, height: 42, borderRadius: "9px", border: `0.5px solid ${COLORS.border2}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent2; e.currentTarget.style.background = "rgba(108,92,231,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border2; e.currentTarget.style.color = COLORS.muted; e.currentTarget.style.background = "none"; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ borderRadius: "24px", border: `0.5px solid ${COLORS.border2}`, overflow: "hidden", background: COLORS.card2, aspectRatio: "4/5", position: "relative" }}>
            <img src={h.photo} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              onError={e => { e.target.style.display = "none"; }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top,rgba(7,7,13,0.6),transparent)", pointerEvents: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
            {[{ n: h.s1n, l: h.s1l }, { n: h.s2n, l: h.s2l }, { n: h.s3n, l: h.s3l }].map(({ n, l }) => (
              <div key={l} style={{ background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: "12px", padding: "1rem 0.8rem", textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.7rem", fontWeight: 800, color: COLORS.text }}>{n}</div>
                <div style={{ fontSize: "0.7rem", color: COLORS.muted, lineHeight: 1.3, marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,217,163,0.05)", border: "0.5px solid rgba(0,217,163,0.2)", borderRadius: "12px", padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.teal, flexShrink: 0, animation: "breathe 2s ease infinite", display: "inline-block" }} />
            <p style={{ fontSize: "0.83rem", color: COLORS.muted2, lineHeight: 1.4, margin: 0 }}>
              <strong style={{ display: "block", fontSize: "0.93rem", color: COLORS.teal, fontWeight: 600 }}>{h.avail}</strong>
              {h.availsub}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION HEADER ──
function SectionHeader({ tag, title, sub }) {
  return (
    <>
      <Reveal><p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.accent, fontWeight: 600, marginBottom: "0.5rem" }}>{tag}</p></Reveal>
      <Reveal delay={100}><h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.8rem", lineHeight: 1.1 }}>{title}</h2></Reveal>
      {sub && <Reveal delay={200}><p style={{ color: COLORS.muted2, maxWidth: 540, marginBottom: "3.5rem", fontSize: "0.97rem" }}>{sub}</p></Reveal>}
    </>
  );
}

// ── SKILLS ──
function SkillCard({ sk }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? "rgba(108,92,231,0.05)" : COLORS.card,
      border: `0.5px solid ${hov ? "rgba(108,92,231,0.4)" : COLORS.border}`,
      borderRadius: "14px", padding: "1.5rem 1rem 1.2rem", textAlign: "center",
      transition: "all 0.3s", transform: hov ? "translateY(-4px)" : "none",
    }}>
      <span style={{ fontSize: "2.2rem", marginBottom: "0.6rem", display: "block" }}>{sk.ico}</span>
      <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.7rem", color: COLORS.text }}>{sk.name}</p>
      <div style={{ height: 4, background: COLORS.bg4, borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${sk.pct}%`, background: `linear-gradient(90deg,${COLORS.accent},${COLORS.accent2})`, borderRadius: 2, transition: "width 1s ease" }} />
      </div>
      <p style={{ fontSize: "0.72rem", color: COLORS.muted, marginTop: "0.4rem" }}>{sk.pct}%</p>
    </div>
  );
}

function Skills({ DATA }) {
  return (
    <section id="skills" style={{ padding: "6rem 5rem", background: COLORS.bg2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="What I work with" title="Technical Skills" sub="Technologies I use to bring ideas to life — from modern frontends to robust backends and cloud infrastructure." />
        <Reveal delay={300}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "1rem" }}>
            {DATA.skills.map(sk => <SkillCard key={sk.name} sk={sk} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── EXPERIENCE ──
function Experience({ DATA }) {
  return (
    <section id="experience" style={{ padding: "6rem 5rem", background: COLORS.bg, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Work History" title="Experience" sub="Professional experience building real-world applications and delivering meaningful outcomes." />
        <Reveal delay={300}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {DATA.exp.map((e, i) => (
              <div key={i} style={{ background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: "18px", padding: "2rem", display: "flex", gap: "1.5rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "12px", background: `linear-gradient(135deg,${COLORS.accent},${COLORS.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {e.logoText}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{e.role}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ background: "rgba(108,92,231,0.1)", border: "0.5px solid rgba(108,92,231,0.2)", borderRadius: "100px", padding: "0.2rem 0.7rem", fontSize: "0.75rem", color: COLORS.accent2 }}>{e.type}</span>
                    </div>
                  </div>
                  <p style={{ color: COLORS.accent2, fontSize: "0.9rem", marginBottom: "0.3rem" }}>{e.company}</p>
                  <p style={{ color: COLORS.muted, fontSize: "0.8rem", marginBottom: "1rem" }}>{e.period}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: "0.9rem", color: COLORS.muted2, padding: "0.25rem 0 0.25rem 1.3rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: COLORS.accent, fontSize: "0.78rem" }}>→</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── LIGHTBOX ──
function Lightbox({ item, type, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!item) return null;
  const imgSrc = item.img;
  const title = type === "project" ? item.title : item.name;
  const subtitle = type === "project" ? item.tags : item.issuer;
  const desc = type === "project" ? item.desc : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", animation: "lbIn 0.22s ease",
      }}
    >
      <style>{`@keyframes lbIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>

      {/* Close */}
      <button onClick={onClose} style={{
        position: "fixed", top: "1.2rem", right: "1.5rem",
        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff", width: 40, height: 40, borderRadius: "50%",
        fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10000,
      }}>✕</button>

      {/* Prev */}
      {hasPrev && (
        <button onClick={e => { e.stopPropagation(); onPrev(); }} style={{
          position: "fixed", left: "1.2rem", top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", width: 44, height: 44, borderRadius: "50%",
          fontSize: "1.3rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10000,
        }}>‹</button>
      )}

      {/* Next */}
      {hasNext && (
        <button onClick={e => { e.stopPropagation(); onNext(); }} style={{
          position: "fixed", right: "1.2rem", top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", width: 44, height: 44, borderRadius: "50%",
          fontSize: "1.3rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10000,
        }}>›</button>
      )}

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.card, border: `1px solid ${COLORS.border2}`,
          borderRadius: "20px", overflow: "hidden",
          maxWidth: type === "project" ? 780 : 640, width: "100%",
          maxHeight: "90vh", display: "flex", flexDirection: "column",
        }}
      >
        {/* Image */}
        <div style={{ background: COLORS.card2, position: "relative", overflow: "hidden" }}>
          {imgSrc ? (
            <img
              src={imgSrc} alt={title}
              style={{ width: "100%", maxHeight: type === "project" ? 420 : 480, objectFit: "contain", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, fontSize: "0.9rem" }}>
              No image available
            </div>
          )}
          {/* Zoom hint */}
          <div style={{
            position: "absolute", bottom: "0.8rem", right: "0.8rem",
            background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "6px", padding: "0.25rem 0.6rem",
            fontSize: "0.72rem", color: "rgba(255,255,255,0.7)",
          }}>🔍 Full view</div>
        </div>

        {/* Info */}
        <div style={{ padding: "1.4rem 1.6rem", overflowY: "auto" }}>
          {type === "project" && (
            <div style={{ fontSize: "0.68rem", color: COLORS.accent, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{item.num}</div>
          )}
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.4rem" }}>{title}</h3>
          {desc && <p style={{ fontSize: "0.9rem", color: COLORS.muted2, lineHeight: 1.7, marginBottom: "0.9rem" }}>{desc}</p>}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {subtitle && subtitle.split(",").map(t => (
              <span key={t} style={{
                background: type === "project" ? "rgba(108,92,231,0.1)" : "rgba(0,217,163,0.08)",
                border: type === "project" ? "0.5px solid rgba(108,92,231,0.25)" : "0.5px solid rgba(0,217,163,0.25)",
                borderRadius: "4px", padding: "0.2rem 0.65rem",
                fontSize: "0.75rem",
                color: type === "project" ? COLORS.accent3 : COLORS.teal,
              }}>{t.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROJECTS ──
function ProjectCard({ p, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: COLORS.card, border: `0.5px solid ${hov ? COLORS.border2 : COLORS.border}`,
        borderRadius: "18px", overflow: "hidden", transition: "all 0.3s",
        transform: hov ? "translateY(-5px)" : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ height: 210, overflow: "hidden", background: COLORS.card2, position: "relative" }}>
        <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s", transform: hov ? "scale(1.04)" : "scale(1)" }}
          onError={e => e.target.style.display = "none"} />
        {hov && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(108,92,231,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(1px)",
          }}>
            <div style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "0.5rem 1.1rem", fontSize: "0.85rem", color: "#fff", fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600 }}>
              🔍 View Image
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div style={{ fontSize: "0.7rem", color: COLORS.accent, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{p.num}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>{p.title}</div>
        <div style={{ fontSize: "0.87rem", color: COLORS.muted2, lineHeight: 1.65, marginBottom: "0.9rem" }}>{p.desc}</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {p.tags.split(",").map(t => (
            <span key={t} style={{ background: "rgba(108,92,231,0.1)", border: "0.5px solid rgba(108,92,231,0.2)", borderRadius: 4, padding: "0.17rem 0.62rem", fontSize: "0.74rem", color: COLORS.accent3 }}>{t.trim()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects({ DATA }) {
  const [lightbox, setLightbox] = useState(null); // index
  const items = DATA.projects;
  return (
    <section id="projects" style={{ padding: "6rem 5rem", background: COLORS.bg2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      {lightbox !== null && (
        <Lightbox
          item={items[lightbox]} type="project"
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(i => i - 1)}
          onNext={() => setLightbox(i => i + 1)}
          hasPrev={lightbox > 0}
          hasNext={lightbox < items.length - 1}
        />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="What I've Built" title="Latest Projects" sub="Projects that showcase my ability to design and build complete, polished web applications." />
        <Reveal delay={300}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {items.map((p, i) => <ProjectCard key={i} p={p} onClick={() => setLightbox(i)} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CERTIFICATES ──
function CertCard({ c, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: COLORS.card, border: `0.5px solid ${hov ? COLORS.border2 : COLORS.border}`,
        borderRadius: "14px", overflow: "hidden", transition: "all 0.25s",
        transform: hov ? "translateY(-3px)" : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ height: 130, overflow: "hidden", background: COLORS.card2, position: "relative" }}>
        <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", transform: hov ? "scale(1.05)" : "scale(1)" }}
          onError={e => e.target.style.display = "none"} />
        {hov && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,217,163,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(1px)",
          }}>
            <div style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "0.4rem 0.9rem", fontSize: "0.8rem", color: "#fff", fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600 }}>
              🔍 View
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "0.85rem 1rem" }}>
        <div style={{ fontSize: "0.87rem", fontWeight: 600 }}>{c.name}</div>
        <div style={{ fontSize: "0.77rem", color: COLORS.muted, marginTop: "0.2rem" }}>{c.issuer}</div>
      </div>
    </div>
  );
}

function Certificates({ DATA }) {
  const [lightbox, setLightbox] = useState(null);
  const items = DATA.certs;
  return (
    <section id="certificates" style={{ padding: "6rem 5rem", background: COLORS.bg, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      {lightbox !== null && (
        <Lightbox
          item={items[lightbox]} type="cert"
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(i => i - 1)}
          onNext={() => setLightbox(i => i + 1)}
          hasPrev={lightbox > 0}
          hasNext={lightbox < items.length - 1}
        />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Credentials" title="Certificates" sub="Professional certifications validating my expertise across cloud, data science, and full stack development." />
        <Reveal delay={300}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem" }}>
            {items.map((c, i) => <CertCard key={i} c={c} onClick={() => setLightbox(i)} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── EDUCATION ──
function Education({ DATA }) {
  return (
    <section id="education" style={{ padding: "6rem 5rem", background: COLORS.bg2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Academic Background" title="Education" sub="The academic foundation that shaped my technical thinking and problem-solving approach." />
        <Reveal delay={300}>
          <div style={{ borderLeft: `0.5px solid ${COLORS.border2}`, paddingLeft: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {DATA.edu.map((e, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-2.88rem", top: "0.35rem", width: 14, height: 14, borderRadius: "50%", background: COLORS.accent, border: `3px solid ${COLORS.bg2}` }} />
                <div style={{ fontSize: "0.74rem", color: COLORS.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.28rem" }}>{e.year}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.12rem", fontWeight: 700, marginBottom: "0.18rem" }}>{e.degree}</div>
                <div style={{ fontSize: "0.88rem", color: COLORS.accent2, marginBottom: "0.3rem" }}>{e.school}</div>
                <div style={{ fontSize: "0.87rem", color: COLORS.muted2 }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── ABOUT ──
function About({ DATA }) {
  const ab = DATA.about;
  const h = DATA.hero;
  const details = [
    ["Name", h.name], ["Age", ab.age], ["Gender", ab.gender], ["City", ab.city],
    ["Nationality", ab.nationality], ["Languages", ab.langs], ["Experience", ab.explevel],
    ["Availability", ab.availability, true], ["Phone", ab.phone],
  ];
  return (
    <section id="about" style={{ padding: "6rem 5rem", background: COLORS.bg, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Who I Am" title="About Me" />
        <Reveal delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <div>
              {[ab.bio1, ab.bio2, ab.bio3].map((b, i) => (
                <p key={i} style={{ color: COLORS.muted2, lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.97rem" }}>{b}</p>
              ))}
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                {[{ label: "GitHub", href: h.github }, { label: "LinkedIn", href: h.linkedin }].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", border: `0.5px solid ${COLORS.border2}`, color: COLORS.text, padding: "0.6rem 1.2rem", borderRadius: "8px", fontSize: "0.85rem", textDecoration: "none", fontFamily: "'Cabinet Grotesk', sans-serif" }}>{label}</a>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              {details.map(([l, v, green]) => (
                <div key={l} style={{ background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.7rem", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.28rem" }}>{l}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500, color: green ? COLORS.teal : COLORS.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CONTACT ──
function Contact({ DATA }) {
  const co = DATA.contact;
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const items = [
    { icon: "📞", label: "Phone", val: co.phone },
    { icon: "✉️", label: "Email", val: co.email },
    { icon: "📍", label: "Location", val: co.address },
    { icon: "💼", label: "Status", val: co.status, green: true },
  ];
  const handleSend = () => {
    if (!form.name || !form.email || !form.message) { setStatus("Please fill in Name, Email and Message."); return; }
    setStatus("Opening mail client...");
    window.location.href = `mailto:${DATA.hero.email}?subject=${encodeURIComponent(form.subject || "(No subject)")}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    setTimeout(() => setStatus(""), 3000);
  };
  const iStyle = { width: "100%", background: COLORS.bg2, border: `0.5px solid ${COLORS.border2}`, borderRadius: "8px", padding: "0.72rem 1rem", color: COLORS.text, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" };
  return (
    <section id="contact" style={{ padding: "6rem 5rem", background: COLORS.bg2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Get In Touch" title="Let's Work Together" sub="Open to opportunities and collaborations. Feel free to reach out anytime!" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "4rem", alignItems: "start" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map(({ icon, label, val, green }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem", background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: "12px", padding: "1rem 1.2rem" }}>
                  <div style={{ fontSize: "1.4rem" }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: "0.73rem", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
                    <div style={{ fontSize: "0.93rem", color: green ? COLORS.teal : COLORS.text, marginTop: "0.15rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[["Your Name", "name", "text", "e.g. Ravi Kumar"], ["Email", "email", "email", "ravi@example.com"], ["Subject", "subject", "text", "Project / Opportunity / Collaboration"]].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "0.75rem", color: COLORS.muted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={iStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: COLORS.muted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                <textarea placeholder="Tell me about your project or opportunity..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} style={{ ...iStyle, resize: "vertical" }} />
              </div>
              {status && <div style={{ fontSize: "0.85rem", color: COLORS.teal }}>{status}</div>}
              <button onClick={handleSend} style={{ background: COLORS.accent, color: "#fff", border: "none", padding: "0.9rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", transition: "background 0.2s" }}
                onMouseEnter={e => e.target.style.background = "#5a4dd6"}
                onMouseLeave={e => e.target.style.background = COLORS.accent}>
                Send Message →
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ──
function Footer({ DATA }) {
  const h = DATA.hero;
  return (
    <footer style={{ background: COLORS.bg, borderTop: `0.5px solid ${COLORS.border}`, padding: "2rem 5rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'Cabinet Grotesk', sans-serif", flexWrap: "wrap", gap: "1rem" }}>
      <p style={{ color: COLORS.muted, fontSize: "0.87rem" }}>© {new Date().getFullYear()} {h.name}. Designed & Developed with ♥</p>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {[{ label: "GitHub", href: h.github }, { label: "LinkedIn", href: h.linkedin }, { label: "Email", href: `mailto:${h.email}` }].map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" style={{ color: COLORS.muted, fontSize: "0.87rem", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = COLORS.text}
            onMouseLeave={e => e.target.style.color = COLORS.muted}>
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ── PORTFOLIO ──
function Portfolio({ DATA, onAdminClick }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07070d; }
        ::-webkit-scrollbar-thumb { background: #6c5ce7; border-radius: 2px; }
        @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      `}</style>
      <Nav onAdminClick={onAdminClick} />
      <Hero DATA={DATA} />
      <Skills DATA={DATA} />
      <Experience DATA={DATA} />
      <Projects DATA={DATA} />
      <Certificates DATA={DATA} />
      <Education DATA={DATA} />
      <About DATA={DATA} />
      <Contact DATA={DATA} />
      <Footer DATA={DATA} />
    </div>
  );
}

// ── ROOT APP ──
export default function App() {
  const [view, setView] = useState("portfolio"); // "portfolio" | "login" | "admin"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(() => loadData());

  const handleAdminClick = () => {
    if (isLoggedIn) setView("admin");
    else setView("login");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView("admin");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView("portfolio");
  };

  const handleDataUpdate = (newData) => {
    setData(newData);
  };

  if (view === "login") return <AdminLogin onLogin={handleLogin} />;
  if (view === "admin") return (
    <AdminDashboard
      data={data}
      onUpdate={handleDataUpdate}
      onLogout={handleLogout}
    />
  );
  return <Portfolio DATA={data} onAdminClick={handleAdminClick} />;
}