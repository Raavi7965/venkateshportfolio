import { useState, useRef, useCallback } from "react";
import { saveData, resetData, DEFAULT_DATA } from "../data.js";

const C = {
  bg: "#07070d", bg2: "#0e0e18", bg3: "#141420", bg4: "#1a1a28",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  text: "#edeaf8", muted: "#7b7896", muted2: "#a09cbd",
  accent: "#6c5ce7", accent2: "#a29bf5", accent3: "#d1ccff",
  teal: "#00d9a3", card: "#0f0f1c", card2: "#161625", danger: "#ff4757",
};

// ── IMAGE STORAGE (separate from main data to avoid quota issues) ──
const IMG_KEY_PREFIX = "vr_img_";
function saveImg(key, dataUrl) {
  try { localStorage.setItem(IMG_KEY_PREFIX + key, dataUrl); return true; }
  catch { return false; }
}
function loadImg(key) {
  return localStorage.getItem(IMG_KEY_PREFIX + key) || null;
}
function clearImg(key) {
  localStorage.removeItem(IMG_KEY_PREFIX + key);
}

// ── FILE → BASE64 ──
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── TOAST ──
function useToast() {
  const [msg, setMsg] = useState("");
  const show = (m, duration = 2500) => {
    setMsg(m);
    setTimeout(() => setMsg(""), duration);
  };
  return [msg, show];
}

// ── IMAGE UPLOADER COMPONENT ──
function ImageUploader({ imgKey, currentUrl, onSave, label = "Image" }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(() => loadImg(imgKey) || currentUrl || "");
  const [urlMode, setUrlMode] = useState(false);
  const [urlVal, setUrlVal] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [toast, showToast] = useToast();

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("⚠ Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("⚠ Image too large (max 2 MB). Try compressing it first.");
      return;
    }
    setUploading(true);
    try {
      const b64 = await fileToBase64(file);
      const saved = saveImg(imgKey, b64);
      if (saved) {
        setPreview(b64);
        onSave(b64);
        showToast("✓ Image uploaded!");
      } else {
        showToast("⚠ Storage full. Clear some images or use a URL instead.");
      }
    } catch {
      showToast("⚠ Upload failed.");
    }
    setUploading(false);
  }, [imgKey, onSave]);

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };
  const onFileChange = (e) => processFile(e.target.files[0]);

  const applyUrl = () => {
    if (!urlVal.trim()) return;
    clearImg(imgKey);
    setPreview(urlVal.trim());
    onSave(urlVal.trim());
    showToast("✓ URL applied!");
  };

  const clearAll = () => {
    clearImg(imgKey);
    setPreview("");
    setUrlVal("");
    onSave("");
    showToast("Image cleared.");
  };

  return (
    <div style={{ marginBottom: "0.8rem" }}>
      <label style={{ display: "block", fontSize: "0.73rem", color: C.muted, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</label>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !urlMode && fileRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? C.accent : C.border2}`,
          borderRadius: "10px", padding: "1rem", textAlign: "center",
          cursor: urlMode ? "default" : "pointer",
          background: dragging ? "rgba(108,92,231,0.06)" : C.bg,
          transition: "all 0.22s", position: "relative",
        }}
      >
        {preview && (
          <img src={preview} alt="preview"
            onError={e => e.target.style.display = "none"}
            style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 7, display: "block", marginBottom: "0.6rem" }} />
        )}
        {uploading ? (
          <p style={{ fontSize: "0.8rem", color: C.accent2 }}>Uploading…</p>
        ) : (
          !urlMode && (
            <>
              <span style={{ fontSize: "1.6rem", display: "block" }}>🖼</span>
              <p style={{ fontSize: "0.78rem", color: C.muted, lineHeight: 1.4, marginTop: "0.2rem" }}>
                <strong style={{ color: C.accent2, display: "block" }}>Click or drag & drop</strong>
                PNG, JPG, WEBP · max 2 MB
              </p>
            </>
          )
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
      </div>

      {/* URL Toggle Row */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button onClick={() => setUrlMode(v => !v)} style={{
          flex: 1, background: "none", border: `0.5px solid ${C.border2}`,
          borderRadius: "6px", padding: "0.38rem 0.7rem", color: urlMode ? C.accent2 : C.muted,
          fontSize: "0.75rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif",
          borderColor: urlMode ? C.accent : C.border2, transition: "all 0.2s",
        }}>
          {urlMode ? "← Use File Upload" : "🔗 Use URL instead"}
        </button>
        {preview && (
          <button onClick={clearAll} style={{
            background: "none", border: `0.5px solid rgba(255,71,87,0.3)`,
            borderRadius: "6px", padding: "0.38rem 0.7rem", color: C.danger,
            fontSize: "0.75rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif",
          }}>Clear</button>
        )}
      </div>

      {/* URL Input */}
      {urlMode && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <input
            type="text" placeholder="https://example.com/image.png"
            value={urlVal} onChange={e => setUrlVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyUrl()}
            style={{
              flex: 1, background: C.bg2, border: `0.5px solid ${C.border2}`,
              borderRadius: "7px", padding: "0.55rem 0.8rem", color: C.text,
              fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.82rem", outline: "none",
            }}
          />
          <button onClick={applyUrl} style={{
            background: C.accent, color: "#fff", border: "none",
            borderRadius: "7px", padding: "0.55rem 0.9rem", fontSize: "0.82rem",
            cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600,
          }}>Apply</button>
        </div>
      )}

      {toast && <p style={{ fontSize: "0.78rem", color: C.teal, marginTop: "0.4rem" }}>{toast}</p>}
    </div>
  );
}

// ── SHARED FORM COMPONENTS ──
const Inp = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    <label style={{ display: "block", fontSize: "0.72rem", color: C.muted, marginBottom: "0.38rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
    <input type={type} value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: C.bg2, border: `0.5px solid ${C.border2}`, borderRadius: "8px", padding: "0.62rem 0.88rem", color: C.text, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.86rem", outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 3 }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    <label style={{ display: "block", fontSize: "0.72rem", color: C.muted, marginBottom: "0.38rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
    <textarea value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: "100%", background: C.bg2, border: `0.5px solid ${C.border2}`, borderRadius: "8px", padding: "0.62rem 0.88rem", color: C.text, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.86rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
  </div>
);

const SaveBtn = ({ onClick, label = "Save Changes" }) => (
  <button onClick={onClick} style={{
    width: "100%", background: C.accent, color: "#fff", border: "none",
    padding: "0.75rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600,
    cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginTop: "0.5rem",
    transition: "background 0.2s",
  }}
    onMouseEnter={e => e.target.style.background = "#5a4dd6"}
    onMouseLeave={e => e.target.style.background = C.accent}>
    {label}
  </button>
);

const Divider = () => <div style={{ height: 0.5, background: C.border, margin: "1.1rem 0" }} />;

const ItemLabel = ({ text, onRemove }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
    <span style={{ fontSize: "0.73rem", fontWeight: 700, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{text}</span>
    {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: "0.95rem", padding: 0 }}>✕</button>}
  </div>
);

// ── SECTION PANELS ──

function HeroPanel({ data, onChange, onSave }) {
  const h = data.hero;
  const set = (k, v) => onChange({ ...data, hero: { ...h, [k]: v } });
  return (
    <div>
      <ImageUploader
        imgKey="hero_photo"
        currentUrl={h.photo}
        label="Profile Photo"
        onSave={v => set("photo", v)}
      />
      <Divider />
      <Inp label="Full Name" value={h.name} onChange={v => set("name", v)} />
      <Inp label="Role / Title" value={h.role} onChange={v => set("role", v)} />
      <Inp label="Tagline" value={h.tagline} onChange={v => set("tagline", v)} />
      <Textarea label="Description" value={h.desc} onChange={v => set("desc", v)} rows={4} />
      <Divider />
      <Inp label="GitHub URL" value={h.github} onChange={v => set("github", v)} />
      <Inp label="LinkedIn URL" value={h.linkedin} onChange={v => set("linkedin", v)} />
      <Inp label="Email" value={h.email} onChange={v => set("email", v)} />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
        <Inp label="Stat 1 Number" value={h.s1n} onChange={v => set("s1n", v)} />
        <Inp label="Stat 1 Label" value={h.s1l} onChange={v => set("s1l", v)} />
        <Inp label="Stat 2 Number" value={h.s2n} onChange={v => set("s2n", v)} />
        <Inp label="Stat 2 Label" value={h.s2l} onChange={v => set("s2l", v)} />
        <Inp label="Stat 3 Number" value={h.s3n} onChange={v => set("s3n", v)} />
        <Inp label="Stat 3 Label" value={h.s3l} onChange={v => set("s3l", v)} />
      </div>
      <Inp label="Availability Badge" value={h.avail} onChange={v => set("avail", v)} />
      <Inp label="Availability Sub-text" value={h.availsub} onChange={v => set("availsub", v)} />
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function SkillsPanel({ data, onChange, onSave }) {
  const skills = data.skills;
  const set = (i, k, v) => {
    const arr = skills.map((s, idx) => idx === i ? { ...s, [k]: v } : s);
    onChange({ ...data, skills: arr });
  };
  const add = () => onChange({ ...data, skills: [...skills, { ico: "🔷", name: "New Skill", pct: 70 }] });
  const remove = (i) => onChange({ ...data, skills: skills.filter((_, idx) => idx !== i) });

  return (
    <div>
      {skills.map((sk, i) => (
        <div key={i} style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: "8px", padding: "0.8rem", marginBottom: "0.6rem" }}>
          <ItemLabel text={`Skill ${i + 1}`} onRemove={() => remove(i)} />
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px", gap: "0.5rem", alignItems: "end" }}>
            <Inp label="Icon" value={sk.ico} onChange={v => set(i, "ico", v)} />
            <Inp label="Name" value={sk.name} onChange={v => set(i, "name", v)} />
            <Inp label="%" value={sk.pct} type="number" onChange={v => set(i, "pct", Math.min(100, Math.max(0, parseInt(v) || 0)))} />
          </div>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "8px", padding: "0.6rem", color: C.muted2, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginBottom: "0.5rem" }}>
        + Add Skill
      </button>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function ExpPanel({ data, onChange, onSave }) {
  const exp = data.exp;
  const setField = (i, k, v) => {
    const arr = exp.map((e, idx) => idx === i ? { ...e, [k]: v } : e);
    onChange({ ...data, exp: arr });
  };
  const setBullet = (i, j, v) => {
    const bullets = exp[i].bullets.map((b, bIdx) => bIdx === j ? v : b);
    setField(i, "bullets", bullets);
  };
  const addBullet = (i) => setField(i, "bullets", [...exp[i].bullets, ""]);
  const removeBullet = (i, j) => setField(i, "bullets", exp[i].bullets.filter((_, bIdx) => bIdx !== j));
  const add = () => onChange({ ...data, exp: [...exp, { logoText: "CO", company: "Company", role: "Role", period: "2024 – Present", type: "Full-Time", bullets: [""] }] });
  const remove = (i) => onChange({ ...data, exp: exp.filter((_, idx) => idx !== i) });

  return (
    <div>
      {exp.map((e, i) => (
        <div key={i} style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          <ItemLabel text={`Experience ${i + 1}`} onRemove={() => remove(i)} />
          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "0.5rem" }}>
            <Inp label="Logo Text" value={e.logoText} onChange={v => setField(i, "logoText", v)} />
            <Inp label="Company" value={e.company} onChange={v => setField(i, "company", v)} />
          </div>
          <Inp label="Role" value={e.role} onChange={v => setField(i, "role", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <Inp label="Period" value={e.period} onChange={v => setField(i, "period", v)} />
            <Inp label="Type (Remote/Full-Time)" value={e.type} onChange={v => setField(i, "type", v)} />
          </div>
          <label style={{ display: "block", fontSize: "0.72rem", color: C.muted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bullet Points</label>
          {e.bullets.map((b, j) => (
            <div key={j} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
              <input value={b} onChange={ev => setBullet(i, j, ev.target.value)}
                placeholder={`Bullet ${j + 1}`}
                style={{ flex: 1, background: C.bg, border: `0.5px solid ${C.border2}`, borderRadius: "7px", padding: "0.5rem 0.7rem", color: C.text, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "0.84rem", outline: "none" }} />
              <button onClick={() => removeBullet(i, j)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>
          ))}
          <button onClick={() => addBullet(i)} style={{ background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "6px", padding: "0.4rem 0.8rem", color: C.muted2, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif" }}>+ Add Bullet</button>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "8px", padding: "0.6rem", color: C.muted2, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginBottom: "0.5rem" }}>
        + Add Experience
      </button>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function ProjectsPanel({ data, onChange, onSave }) {
  const projects = data.projects;
  const set = (i, k, v) => {
    const arr = projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p);
    onChange({ ...data, projects: arr });
  };
  const add = () => onChange({ ...data, projects: [...projects, { num: `0${projects.length + 1}`, title: "New Project", desc: "Description", img: "", tags: "React.js" }] });
  const remove = (i) => onChange({ ...data, projects: projects.filter((_, idx) => idx !== i) });

  return (
    <div>
      {projects.map((p, i) => (
        <div key={i} style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          <ItemLabel text={`Project ${i + 1}`} onRemove={() => remove(i)} />
          <ImageUploader
            imgKey={`project_${i}`}
            currentUrl={p.img}
            label="Project Screenshot"
            onSave={v => set(i, "img", v)}
          />
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "0.5rem" }}>
            <Inp label="Num" value={p.num} onChange={v => set(i, "num", v)} />
            <Inp label="Title" value={p.title} onChange={v => set(i, "title", v)} />
          </div>
          <Textarea label="Description" value={p.desc} onChange={v => set(i, "desc", v)} rows={3} />
          <Inp label="Tags (comma-separated)" value={p.tags} onChange={v => set(i, "tags", v)} placeholder="React.js, Node.js, MongoDB" />
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "8px", padding: "0.6rem", color: C.muted2, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginBottom: "0.5rem" }}>
        + Add Project
      </button>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function CertsPanel({ data, onChange, onSave }) {
  const certs = data.certs;
  const set = (i, k, v) => {
    const arr = certs.map((c, idx) => idx === i ? { ...c, [k]: v } : c);
    onChange({ ...data, certs: arr });
  };
  const add = () => onChange({ ...data, certs: [...certs, { name: "New Certificate", issuer: "Issuer", img: "" }] });
  const remove = (i) => onChange({ ...data, certs: certs.filter((_, idx) => idx !== i) });

  return (
    <div>
      {certs.map((c, i) => (
        <div key={i} style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          <ItemLabel text={`Certificate ${i + 1}`} onRemove={() => remove(i)} />
          <ImageUploader
            imgKey={`cert_${i}`}
            currentUrl={c.img}
            label="Certificate Image"
            onSave={v => set(i, "img", v)}
          />
          <Inp label="Certificate Name" value={c.name} onChange={v => set(i, "name", v)} />
          <Inp label="Issuer" value={c.issuer} onChange={v => set(i, "issuer", v)} />
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "8px", padding: "0.6rem", color: C.muted2, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginBottom: "0.5rem" }}>
        + Add Certificate
      </button>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function EduPanel({ data, onChange, onSave }) {
  const edu = data.edu;
  const set = (i, k, v) => {
    const arr = edu.map((e, idx) => idx === i ? { ...e, [k]: v } : e);
    onChange({ ...data, edu: arr });
  };
  const add = () => onChange({ ...data, edu: [...edu, { year: "2024", degree: "Degree", school: "University", desc: "" }] });
  const remove = (i) => onChange({ ...data, edu: edu.filter((_, idx) => idx !== i) });

  return (
    <div>
      {edu.map((e, i) => (
        <div key={i} style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          <ItemLabel text={`Education ${i + 1}`} onRemove={() => remove(i)} />
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.5rem" }}>
            <Inp label="Year" value={e.year} onChange={v => set(i, "year", v)} />
            <Inp label="Degree" value={e.degree} onChange={v => set(i, "degree", v)} />
          </div>
          <Inp label="School / University" value={e.school} onChange={v => set(i, "school", v)} />
          <Textarea label="Description" value={e.desc} onChange={v => set(i, "desc", v)} rows={2} />
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", background: "none", border: `0.5px dashed ${C.border2}`, borderRadius: "8px", padding: "0.6rem", color: C.muted2, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", marginBottom: "0.5rem" }}>
        + Add Education
      </button>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function AboutPanel({ data, onChange, onSave }) {
  const ab = data.about;
  const set = (k, v) => onChange({ ...data, about: { ...ab, [k]: v } });
  return (
    <div>
      <Textarea label="Bio Paragraph 1" value={ab.bio1} onChange={v => set("bio1", v)} rows={3} />
      <Textarea label="Bio Paragraph 2" value={ab.bio2} onChange={v => set("bio2", v)} rows={3} />
      <Textarea label="Bio Paragraph 3" value={ab.bio3} onChange={v => set("bio3", v)} rows={3} />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <Inp label="City" value={ab.city} onChange={v => set("city", v)} />
        <Inp label="Age" value={ab.age} onChange={v => set("age", v)} />
        <Inp label="Gender" value={ab.gender} onChange={v => set("gender", v)} />
        <Inp label="Nationality" value={ab.nationality} onChange={v => set("nationality", v)} />
        <Inp label="Languages" value={ab.langs} onChange={v => set("langs", v)} />
        <Inp label="Experience Level" value={ab.explevel} onChange={v => set("explevel", v)} />
        <Inp label="Availability" value={ab.availability} onChange={v => set("availability", v)} />
        <Inp label="Phone" value={ab.phone} onChange={v => set("phone", v)} />
      </div>
      <SaveBtn onClick={onSave} />
    </div>
  );
}

function ContactPanel({ data, onChange, onSave }) {
  const co = data.contact;
  const set = (k, v) => onChange({ ...data, contact: { ...co, [k]: v } });
  return (
    <div>
      <Inp label="Phone" value={co.phone} onChange={v => set("phone", v)} />
      <Inp label="Email" value={co.email} onChange={v => set("email", v)} />
      <Inp label="Address" value={co.address} onChange={v => set("address", v)} />
      <Inp label="Status" value={co.status} onChange={v => set("status", v)} />
      <SaveBtn onClick={onSave} />
    </div>
  );
}

// ── TABS CONFIG ──
const TABS = [
  { id: "hero", label: "Hero" },
  { id: "skills", label: "Skills" },
  { id: "exp", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certs", label: "Certificates" },
  { id: "edu", label: "Education" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// ── MAIN DASHBOARD ──
export default function AdminDashboard({ data, onUpdate, onLogout }) {
  const [activeTab, setActiveTab] = useState("hero");
  const [localData, setLocalData] = useState(data);
  const [toastMsg, showToast] = useToast();

  const handleSave = async () => {
    try {
      await saveData(localData);
      onUpdate(localData);
      showToast("✓ Changes saved to the server!");
    } catch {
      showToast("⚠ Save failed. Please try again.");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset ALL data to defaults? This cannot be undone.")) return;
    resetData();
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
    setLocalData(fresh);
    onUpdate(fresh);
    showToast("Data reset to defaults.");
  };

  const panelProps = { data: localData, onChange: setLocalData, onSave: handleSave };

  const panels = {
    hero: <HeroPanel {...panelProps} />,
    skills: <SkillsPanel {...panelProps} />,
    exp: <ExpPanel {...panelProps} />,
    projects: <ProjectsPanel {...panelProps} />,
    certs: <CertsPanel {...panelProps} />,
    edu: <EduPanel {...panelProps} />,
    about: <AboutPanel {...panelProps} />,
    contact: <ContactPanel {...panelProps} />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07070d; }
        ::-webkit-scrollbar-thumb { background: #6c5ce7; border-radius: 2px; }
        input,textarea { color-scheme: dark; }
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.bg3, borderBottom: `0.5px solid ${C.border2}`,
        padding: "0.9rem 1.8rem", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: "9px", background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "#eb1717" }}>VR</div>
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>Portfolio Admin</p>
            <p style={{ fontSize: "0.72rem", color: C.muted }}>Manage your portfolio content</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <button
            onClick={() => {
              const previewUrl = `${window.location.origin}/?preview=1`;
              window.open(previewUrl, "_blank", "noopener,noreferrer");
            }}
            style={{ background: "none", border: `0.5px solid ${C.border2}`, color: C.muted2, padding: "0.38rem 0.9rem", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            👁 Preview
          </button>
          <button onClick={handleSave} style={{ background: C.teal, color: C.bg, padding: "0.38rem 0.9rem", border: "none", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700 }}>
            💾 Save All
          </button>
          <button onClick={onLogout} style={{ background: "none", border: `0.5px solid rgba(255,71,87,0.3)`, color: C.danger, padding: "0.38rem 0.9rem", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 200, background: C.bg2, borderRight: `0.5px solid ${C.border}`,
          padding: "1.2rem 0.8rem", display: "flex", flexDirection: "column",
          gap: "0.25rem", flexShrink: 0,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? "rgba(108,92,231,0.12)" : "none",
              border: activeTab === t.id ? `0.5px solid rgba(108,92,231,0.3)` : "0.5px solid transparent",
              borderRadius: "8px", padding: "0.6rem 0.9rem", textAlign: "left",
              color: activeTab === t.id ? C.accent2 : C.muted,
              fontSize: "0.84rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif",
              transition: "all 0.18s", fontWeight: activeTab === t.id ? 600 : 400,
            }}>
              {t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={handleReset} style={{
            background: "none", border: `0.5px solid rgba(255,71,87,0.25)`,
            borderRadius: "8px", padding: "0.55rem 0.9rem", color: C.danger,
            fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif",
            marginTop: "1rem",
          }}>
            ↺ Reset All Data
          </button>
        </div>

        {/* Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.6rem" }}>
          <div key={activeTab} style={{ maxWidth: 560, animation: "slideIn 0.25s ease" }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.2rem", color: C.text }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            {panels[activeTab]}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,168,122,0.15)", border: "0.5px solid rgba(0,217,163,0.4)",
          color: C.teal, padding: "0.65rem 1.4rem", borderRadius: "100px",
          fontSize: "0.85rem", zIndex: 9999, pointerEvents: "none",
          animation: "slideIn 0.3s ease",
          whiteSpace: "nowrap",
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}