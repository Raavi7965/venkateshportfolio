import { useState } from "react";
import { saveData, resetData, DEFAULT_DATA } from "../data.js";

const C = {
  bg: "#07070d", bg2: "#0e0e18", bg3: "#141420", card: "#0f0f1c", card2: "#161625",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  text: "#edeaf8", muted: "#7b7896", muted2: "#a09cbd",
  accent: "#6c5ce7", accent2: "#a29bf5", teal: "#00d9a3", danger: "#ff4757",
};

const TAB_SECTIONS = ["Hero", "Skills", "Experience", "Projects", "Certificates", "Education", "About", "Contact"];

const inputStyle = {
  width: "100%", background: C.bg2, border: `1px solid ${C.border2}`,
  borderRadius: "8px", padding: "0.65rem 0.9rem", color: C.text,
  fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.9rem",
  outline: "none", boxSizing: "border-box",
};
const labelStyle = {
  display: "block", fontSize: "0.7rem", color: C.muted,
  textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.35rem",
};
const cardStyle = {
  background: C.card, border: `1px solid ${C.border}`,
  borderRadius: "14px", padding: "1.4rem",
};

function Field({ label, value, onChange, type = "text", rows }) {
  const style = { ...inputStyle };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={labelStyle}>{label}</label>
      {rows
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={{ ...style, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small }) {
  const bg = variant === "danger" ? C.danger : variant === "ghost" ? "transparent" : C.accent;
  const border = variant === "ghost" ? `1px solid ${C.border2}` : "none";
  return (
    <button onClick={onClick} style={{
      background: bg, border, color: "#fff", borderRadius: "8px",
      padding: small ? "0.4rem 0.9rem" : "0.65rem 1.4rem",
      fontSize: small ? "0.8rem" : "0.88rem", fontWeight: 600,
      cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif",
      transition: "opacity 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

// ── SECTION EDITORS ──

function HeroEditor({ data, onChange }) {
  const h = data.hero;
  const set = (k, v) => onChange({ ...data, hero: { ...h, [k]: v } });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
        <Field label="Name" value={h.name} onChange={v => set("name", v)} />
        <Field label="Role / Title" value={h.role} onChange={v => set("role", v)} />
        <Field label="Tagline" value={h.tagline} onChange={v => set("tagline", v)} />
        <Field label="Photo URL" value={h.photo} onChange={v => set("photo", v)} />
        <Field label="GitHub URL" value={h.github} onChange={v => set("github", v)} />
        <Field label="LinkedIn URL" value={h.linkedin} onChange={v => set("linkedin", v)} />
        <Field label="Email" value={h.email} onChange={v => set("email", v)} />
        <Field label="Availability Badge" value={h.avail} onChange={v => set("avail", v)} />
        <Field label="Availability Sub" value={h.availsub} onChange={v => set("availsub", v)} />
      </div>
      <Field label="Description" value={h.desc} onChange={v => set("desc", v)} rows={3} />
      <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: "0.5rem" }}>Stats — shown under photo</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: "0 1rem" }}>
        <Field label="Stat 1 #" value={h.s1n} onChange={v => set("s1n", v)} />
        <Field label="Stat 1 Label" value={h.s1l} onChange={v => set("s1l", v)} />
        <Field label="Stat 2 #" value={h.s2n} onChange={v => set("s2n", v)} />
        <Field label="Stat 2 Label" value={h.s2l} onChange={v => set("s2l", v)} />
        <Field label="Stat 3 #" value={h.s3n} onChange={v => set("s3n", v)} />
        <Field label="Stat 3 Label" value={h.s3l} onChange={v => set("s3l", v)} />
      </div>
    </div>
  );
}

function SkillsEditor({ data, onChange }) {
  const skills = data.skills;
  const update = (i, k, v) => {
    const next = skills.map((s, idx) => idx === i ? { ...s, [k]: k === "pct" ? Number(v) : v } : s);
    onChange({ ...data, skills: next });
  };
  const add = () => onChange({ ...data, skills: [...skills, { ico: "🔥", name: "New Skill", pct: 50 }] });
  const remove = (i) => onChange({ ...data, skills: skills.filter((_, idx) => idx !== i) });
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1rem" }}>
        {skills.map((sk, i) => (
          <div key={i} style={{ ...cardStyle, display: "grid", gridTemplateColumns: "60px 1fr 120px auto", gap: "0.8rem", alignItems: "center", padding: "0.9rem 1rem" }}>
            <input value={sk.ico} onChange={e => update(i, "ico", e.target.value)} style={{ ...inputStyle, fontSize: "1.3rem", textAlign: "center", padding: "0.4rem" }} />
            <input value={sk.name} onChange={e => update(i, "name", e.target.value)} style={inputStyle} placeholder="Skill name" />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="number" min="0" max="100" value={sk.pct} onChange={e => update(i, "pct", e.target.value)} style={{ ...inputStyle, width: 70 }} />
              <span style={{ color: C.muted, fontSize: "0.82rem" }}>%</span>
            </div>
            <Btn onClick={() => remove(i)} variant="danger" small>✕</Btn>
          </div>
        ))}
      </div>
      <Btn onClick={add} variant="ghost">+ Add Skill</Btn>
    </div>
  );
}

function ExpEditor({ data, onChange }) {
  const exp = data.exp;
  const update = (i, k, v) => {
    const next = exp.map((e, idx) => idx === i ? { ...e, [k]: v } : e);
    onChange({ ...data, exp: next });
  };
  const updateBullet = (ei, bi, v) => {
    const next = exp.map((e, idx) => idx === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? v : b) } : e);
    onChange({ ...data, exp: next });
  };
  const addBullet = (ei) => {
    const next = exp.map((e, idx) => idx === ei ? { ...e, bullets: [...e.bullets, "New bullet point."] } : e);
    onChange({ ...data, exp: next });
  };
  const removeBullet = (ei, bi) => {
    const next = exp.map((e, idx) => idx === ei ? { ...e, bullets: e.bullets.filter((_, j) => j !== bi) } : e);
    onChange({ ...data, exp: next });
  };
  const add = () => onChange({ ...data, exp: [...exp, { logoText: "CO", company: "Company Name", role: "Your Role", period: "Month Year – Month Year", type: "Remote", bullets: ["Describe your work here."] }] });
  const remove = (i) => onChange({ ...data, exp: exp.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {exp.map((e, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <span style={{ color: C.accent2, fontSize: "0.88rem", fontWeight: 600 }}>Experience #{i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" small>Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: "0 1rem" }}>
            <Field label="Logo Text" value={e.logoText} onChange={v => update(i, "logoText", v)} />
            <Field label="Company" value={e.company} onChange={v => update(i, "company", v)} />
            <Field label="Role" value={e.role} onChange={v => update(i, "role", v)} />
            <Field label="Period" value={e.period} onChange={v => update(i, "period", v)} />
          </div>
          <Field label="Type (Remote / On-site)" value={e.type} onChange={v => update(i, "type", v)} />
          <p style={labelStyle}>Bullet Points</p>
          {e.bullets.map((b, bi) => (
            <div key={bi} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input value={b} onChange={ev => updateBullet(i, bi, ev.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <Btn onClick={() => removeBullet(i, bi)} variant="danger" small>✕</Btn>
            </div>
          ))}
          <Btn onClick={() => addBullet(i)} variant="ghost" small>+ Add Bullet</Btn>
        </div>
      ))}
      <Btn onClick={add} variant="ghost">+ Add Experience</Btn>
    </div>
  );
}

function ProjectsEditor({ data, onChange }) {
  const projects = data.projects;
  const update = (i, k, v) => onChange({ ...data, projects: projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p) });
  const add = () => onChange({ ...data, projects: [...projects, { num: String(projects.length + 1).padStart(2, "0"), title: "New Project", desc: "Project description.", img: "", tags: "React.js" }] });
  const remove = (i) => onChange({ ...data, projects: projects.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {projects.map((p, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <span style={{ color: C.accent2, fontSize: "0.88rem", fontWeight: 600 }}>Project #{i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" small>Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "0 1rem" }}>
            <Field label="Number" value={p.num} onChange={v => update(i, "num", v)} />
            <Field label="Title" value={p.title} onChange={v => update(i, "title", v)} />
          </div>
          <Field label="Description" value={p.desc} onChange={v => update(i, "desc", v)} rows={2} />
          <Field label="Image URL" value={p.img} onChange={v => update(i, "img", v)} />
          <Field label="Tags (comma separated)" value={p.tags} onChange={v => update(i, "tags", v)} />
        </div>
      ))}
      <Btn onClick={add} variant="ghost">+ Add Project</Btn>
    </div>
  );
}

function CertsEditor({ data, onChange }) {
  const certs = data.certs;
  const update = (i, k, v) => onChange({ ...data, certs: certs.map((c, idx) => idx === i ? { ...c, [k]: v } : c) });
  const add = () => onChange({ ...data, certs: [...certs, { name: "Certificate Name", issuer: "Issuer", img: "" }] });
  const remove = (i) => onChange({ ...data, certs: certs.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {certs.map((c, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: "0 1rem", alignItems: "end", padding: "1rem" }}>
          <Field label="Certificate Name" value={c.name} onChange={v => update(i, "name", v)} />
          <Field label="Issuer" value={c.issuer} onChange={v => update(i, "issuer", v)} />
          <Field label="Image URL" value={c.img} onChange={v => update(i, "img", v)} />
          <div style={{ paddingBottom: "1rem" }}><Btn onClick={() => remove(i)} variant="danger" small>✕</Btn></div>
        </div>
      ))}
      <Btn onClick={add} variant="ghost">+ Add Certificate</Btn>
    </div>
  );
}

function EduEditor({ data, onChange }) {
  const edu = data.edu;
  const update = (i, k, v) => onChange({ ...data, edu: edu.map((e, idx) => idx === i ? { ...e, [k]: v } : e) });
  const add = () => onChange({ ...data, edu: [...edu, { year: "2024", degree: "Degree Name", school: "School Name", desc: "Description." }] });
  const remove = (i) => onChange({ ...data, edu: edu.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {edu.map((e, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <span style={{ color: C.accent2, fontSize: "0.88rem", fontWeight: 600 }}>Education #{i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" small>Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "0 1rem" }}>
            <Field label="Year" value={e.year} onChange={v => update(i, "year", v)} />
            <Field label="Degree" value={e.degree} onChange={v => update(i, "degree", v)} />
            <Field label="School" value={e.school} onChange={v => update(i, "school", v)} />
          </div>
          <Field label="Description" value={e.desc} onChange={v => update(i, "desc", v)} />
        </div>
      ))}
      <Btn onClick={add} variant="ghost">+ Add Education</Btn>
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const ab = data.about;
  const set = (k, v) => onChange({ ...data, about: { ...ab, [k]: v } });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
      <Field label="City" value={ab.city} onChange={v => set("city", v)} />
      <Field label="Age" value={ab.age} onChange={v => set("age", v)} />
      <Field label="Gender" value={ab.gender} onChange={v => set("gender", v)} />
      <Field label="Nationality" value={ab.nationality} onChange={v => set("nationality", v)} />
      <Field label="Languages" value={ab.langs} onChange={v => set("langs", v)} />
      <Field label="Experience Level" value={ab.explevel} onChange={v => set("explevel", v)} />
      <Field label="Availability" value={ab.availability} onChange={v => set("availability", v)} />
      <Field label="Phone" value={ab.phone} onChange={v => set("phone", v)} />
      <div style={{ gridColumn: "1/-1" }}><Field label="Bio Line 1" value={ab.bio1} onChange={v => set("bio1", v)} rows={2} /></div>
      <div style={{ gridColumn: "1/-1" }}><Field label="Bio Line 2" value={ab.bio2} onChange={v => set("bio2", v)} rows={2} /></div>
      <div style={{ gridColumn: "1/-1" }}><Field label="Bio Line 3" value={ab.bio3} onChange={v => set("bio3", v)} rows={2} /></div>
    </div>
  );
}

function ContactEditor({ data, onChange }) {
  const co = data.contact;
  const set = (k, v) => onChange({ ...data, contact: { ...co, [k]: v } });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
      <Field label="Phone" value={co.phone} onChange={v => set("phone", v)} />
      <Field label="Email" value={co.email} onChange={v => set("email", v)} />
      <Field label="Address" value={co.address} onChange={v => set("address", v)} />
      <Field label="Status" value={co.status} onChange={v => set("status", v)} />
    </div>
  );
}

// ── MAIN DASHBOARD ──
export default function AdminDashboard({ data, onUpdate, onLogout }) {
  const [tab, setTab] = useState("Hero");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Reset ALL data to defaults? This cannot be undone.")) {
      resetData();
      onUpdate(JSON.parse(JSON.stringify(DEFAULT_DATA)));
    }
  };

  const renderEditor = () => {
    switch (tab) {
      case "Hero":         return <HeroEditor data={data} onChange={onUpdate} />;
      case "Skills":       return <SkillsEditor data={data} onChange={onUpdate} />;
      case "Experience":   return <ExpEditor data={data} onChange={onUpdate} />;
      case "Projects":     return <ProjectsEditor data={data} onChange={onUpdate} />;
      case "Certificates": return <CertsEditor data={data} onChange={onUpdate} />;
      case "Education":    return <EduEditor data={data} onChange={onUpdate} />;
      case "About":        return <AboutEditor data={data} onChange={onUpdate} />;
      case "Contact":      return <ContactEditor data={data} onChange={onUpdate} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@400;500;600;700&display=swap');`}</style>

      {/* Top Bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(7,7,13,0.97)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0.85rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>
            VR<span style={{ color: C.teal }}>.</span>
            <span style={{ color: C.muted, fontWeight: 400, fontSize: "0.9rem", marginLeft: "0.6rem" }}>Admin</span>
          </span>
          <span style={{ width: 1, height: 20, background: C.border2 }} />
          <a href="/" target="_blank" rel="noreferrer" style={{ color: C.muted2, fontSize: "0.83rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            View Portfolio ↗
          </a>
        </div>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          {saved && (
            <span style={{ color: C.teal, fontSize: "0.85rem", animation: "fadeIn 0.3s ease" }}>✓ Saved!</span>
          )}
          <Btn onClick={handleSave}>Save Changes</Btn>
          <Btn onClick={handleReset} variant="ghost" small>Reset Defaults</Btn>
          <Btn onClick={onLogout} variant="ghost" small>Logout</Btn>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: 200, flexShrink: 0, background: C.bg2,
          borderRight: `1px solid ${C.border}`, padding: "1.5rem 0",
          position: "sticky", top: 56, height: "calc(100vh - 56px)", overflowY: "auto",
        }}>
          {TAB_SECTIONS.map(s => (
            <button key={s} onClick={() => setTab(s)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "0.7rem 1.5rem", background: tab === s ? "rgba(108,92,231,0.12)" : "none",
              border: "none", borderLeft: tab === s ? `2px solid ${C.accent}` : "2px solid transparent",
              color: tab === s ? C.accent2 : C.muted,
              fontSize: "0.88rem", fontWeight: tab === s ? 600 : 400,
              cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif",
              transition: "all 0.15s",
            }}>
              {s}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto", maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.3rem" }}>
            Edit {tab}
          </h2>
          <p style={{ color: C.muted, fontSize: "0.85rem", marginBottom: "1.8rem" }}>
            Changes are live on the portfolio after you click <strong style={{ color: C.text }}>Save Changes</strong>.
          </p>
          {renderEditor()}
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", gap: "0.7rem" }}>
            <Btn onClick={handleSave}>Save Changes</Btn>
          </div>
        </main>
      </div>
    </div>
  );
}
