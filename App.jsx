import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#1a3c5e",
  primaryLight: "#2563a8",
  accent: "#e8a020",
  accentLight: "#f5b942",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#d97706",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f8f9fa",
  surface: "#ffffff",
  dark: "#111827",
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  currentUser: null,
  users: [
    { id: 1, name: "Admin Owner", username: "admin", mobile: "9999900000", password: "admin123", role: "admin", projects: ["all"], active: true, avatar: "AO" },
    { id: 2, name: "Ravi Kumar", username: "ravi", mobile: "9876543210", password: "ravi123", role: "staff", projects: [1, 2], active: true, avatar: "RK" },
    { id: 3, name: "Priya Sharma", username: "priya", mobile: "9876543211", password: "priya123", role: "staff", projects: [1], active: true, avatar: "PS" },
  ],
  projects: [
    { id: 1, name: "Prestige Sunrise", location: "OMR, Chennai", type: "Apartment", status: "active", logo: "PS", color: "#1a3c5e" },
    { id: 2, name: "Green Valley Plots", location: "Tambaram, Chennai", type: "Plots", status: "active", logo: "GV", color: "#16a34a" },
    { id: 3, name: "Marina Heights", location: "Adyar, Chennai", type: "Villa", status: "active", logo: "MH", color: "#7c3aed" },
  ],
  leads: [
    { id: 1, name: "Arjun Mehta", mobile: "9811234567", altMobile: "", email: "arjun@gmail.com", source: "Facebook", projectId: 1, budget: "50-70L", location: "Perungudi", notes: "Interested in 3BHK", assignedTo: 2, createdAt: "2025-01-10T09:30:00", status: "Interested" },
    { id: 2, name: "Lakshmi Iyer", mobile: "9822345678", altMobile: "9844556677", email: "", source: "Walk-in", projectId: 1, budget: "30-50L", location: "Sholinganallur", notes: "First-time buyer", assignedTo: 3, createdAt: "2025-01-11T11:00:00", status: "Callback" },
    { id: 3, name: "Deepak Nair", mobile: "9833456789", altMobile: "", email: "deepak@company.com", source: "Google Ads", projectId: 2, budget: "20-30L", location: "Tambaram", notes: "Looking for corner plot", assignedTo: 2, createdAt: "2025-01-12T14:15:00", status: "Interested" },
    { id: 4, name: "Sunita Reddy", mobile: "9844567890", altMobile: "", email: "", source: "Referral", projectId: 3, budget: "1Cr+", location: "Adyar", notes: "Premium villa, need pool", assignedTo: 2, createdAt: "2025-01-13T10:00:00", status: "Visit Done" },
    { id: 5, name: "Rajesh Pillai", mobile: "9855678901", altMobile: "", email: "rajesh@email.com", source: "MagicBricks", projectId: 2, budget: "25-35L", location: "Pallavaram", notes: "DTCP approved only", assignedTo: 3, createdAt: "2025-01-14T16:00:00", status: "Deal Closed" },
    { id: 6, name: "Meena Krishnan", mobile: "9866789012", altMobile: "", email: "", source: "99acres", projectId: 1, budget: "60-80L", location: "Karapakkam", notes: "NRI, investment purpose", assignedTo: 2, createdAt: "2025-01-15T12:00:00", status: "Lost" },
  ],
  followUps: [
    { id: 1, leadId: 1, type: "Call", notes: "Discussed floor plan options", status: "Interested", date: "2025-01-11T10:00:00", nextFollowUp: "2025-01-18T10:00:00", createdBy: 2 },
    { id: 2, leadId: 2, type: "WhatsApp", notes: "Sent brochure", status: "Callback", date: "2025-01-12T15:00:00", nextFollowUp: "2025-01-19T15:00:00", createdBy: 3 },
    { id: 3, leadId: 3, type: "Call", notes: "Plot dimensions discussed", status: "Interested", date: "2025-01-13T11:00:00", nextFollowUp: "2025-01-20T11:00:00", createdBy: 2 },
    { id: 4, leadId: 4, type: "Site Visit", notes: "Visited 3 villas", status: "Visit Done", date: "2025-01-14T10:00:00", nextFollowUp: "2025-01-16T10:00:00", createdBy: 2 },
    { id: 5, leadId: 5, type: "Meeting", notes: "Agreement signed", status: "Deal Closed", date: "2025-01-15T14:00:00", nextFollowUp: null, createdBy: 3 },
  ],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const fmtTime = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";

const statusColors = {
  "Interested": { bg: "#dbeafe", text: "#1e40af" },
  "Callback": { bg: "#fef9c3", text: "#854d0e" },
  "Visit Done": { bg: "#e0e7ff", text: "#3730a3" },
  "Deal Closed": { bg: "#dcfce7", text: "#166534" },
  "Lost": { bg: "#fee2e2", text: "#991b1b" },
};

const sourceList = ["Facebook", "Google Ads", "MagicBricks", "99acres", "Housing.com", "Walk-in", "Referral", "Hoarding", "Exhibition", "Other"];
const followUpTypes = ["Call", "WhatsApp", "Meeting", "Site Visit"];
const statusList = ["Interested", "Callback", "Visit Done", "Deal Closed", "Lost"];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Badge({ status }) {
  const c = statusColors[status] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function Avatar({ name, size = 36, color = COLORS.primary }) {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: COLORS.surface, borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.dark }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: COLORS.muted, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.dark, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.danger }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 8,
  fontSize: 14, color: COLORS.dark, background: COLORS.surface, boxSizing: "border-box", outline: "none",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s }) {
  const styles = {
    primary: { background: COLORS.primary, color: "#fff", border: "none" },
    secondary: { background: "transparent", color: COLORS.primary, border: `1px solid ${COLORS.primary}` },
    danger: { background: COLORS.danger, color: "#fff", border: "none" },
    success: { background: COLORS.success, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.border}` },
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "9px 20px", fontSize: 14 }, lg: { padding: "12px 28px", fontSize: 15 } };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], ...sizes[size], borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, opacity: disabled ? 0.6 : 1, transition: "opacity 0.15s", ...s }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, color = COLORS.primary, icon }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500 }}>{label}</span>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      </div>
      <span style={{ fontSize: 28, fontWeight: 800, color }}>{value}</span>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!login || !password) { setError("Please fill all fields"); return; }
    const user = INITIAL_STATE.users.find(u =>
      (u.username === login || u.mobile === login) && u.password === password && u.active
    );
    if (user) onLogin(user);
    else setError("Invalid credentials. Please try again.");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0d2238 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: COLORS.accent, borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 }}>🏢</div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>PropConnect CRM</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: 0, fontSize: 14 }}>Real Estate Lead Management</p>
        </div>
        <div style={{ background: COLORS.surface, borderRadius: 16, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: COLORS.dark }}>Sign In</h2>
          <FormField label="Mobile Number / Username" required>
            <input style={inputStyle} placeholder="Enter mobile or username" value={login} onChange={e => { setLogin(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </FormField>
          <FormField label="Password" required>
            <input type="password" style={inputStyle} placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </FormField>
          {error && <div style={{ background: "#fee2e2", color: COLORS.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <Btn onClick={handleLogin} style={{ width: "100%" }} size="lg">Sign In →</Btn>
          <div style={{ marginTop: 20, padding: "14px", background: "#f0f4f8", borderRadius: 8, fontSize: 12, color: COLORS.muted }}>
            <strong>Demo:</strong> admin / admin123 &nbsp;|&nbsp; ravi / ravi123
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ current, onNav, user, onLogout, collapsed, onToggle }) {
  const adminNav = [
    { key: "dashboard", icon: "◈", label: "Dashboard" },
    { key: "projects", icon: "🏗", label: "Projects" },
    { key: "leads", icon: "👥", label: "Leads" },
    { key: "followups", icon: "📅", label: "Follow-Ups" },
    { key: "staff", icon: "👤", label: "Staff" },
    { key: "reports", icon: "📊", label: "Reports" },
    { key: "settings", icon: "⚙", label: "Settings" },
  ];
  const staffNav = [
    { key: "dashboard", icon: "◈", label: "Dashboard" },
    { key: "leads", icon: "👥", label: "My Leads" },
    { key: "followups", icon: "📅", label: "Follow-Ups" },
  ];
  const nav = user.role === "admin" ? adminNav : staffNav;

  return (
    <div style={{ width: collapsed ? 64 : 220, minHeight: "100vh", background: COLORS.primary, display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, position: "relative" }}>
      <div style={{ padding: collapsed ? "18px 0" : "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 36, height: 36, background: COLORS.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏢</div>
        {!collapsed && <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>PropConnect</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>CRM</div>
        </div>}
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        {nav.map(item => (
          <div key={item.key} onClick={() => onNav(item.key)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 0" : "11px 20px", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start",
              background: current === item.key ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: current === item.key ? `3px solid ${COLORS.accent}` : "3px solid transparent",
              color: current === item.key ? "#fff" : "rgba(255,255,255,0.6)", transition: "all 0.15s" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: current === item.key ? 700 : 500 }}>{item.label}</span>}
          </div>
        ))}
      </nav>

      <div style={{ padding: collapsed ? "12px 0" : "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar name={user.name} size={32} color={COLORS.accent} />
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "capitalize" }}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout} style={{ width: "100%", padding: collapsed ? "8px" : "8px 12px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {!collapsed && "Sign Out"} 🚪
        </button>
      </div>

      <button onClick={onToggle} style={{ position: "absolute", right: -12, top: 72, width: 24, height: 24, borderRadius: "50%", background: COLORS.primary, border: `2px solid ${COLORS.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", zIndex: 10 }}>
        {collapsed ? "›" : "‹"}
      </button>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ state, user }) {
  const { leads, followUps, users, projects } = state;
  const today = new Date().toDateString();

  const myLeads = user.role === "admin" ? leads : leads.filter(l => l.assignedTo === user.id);
  const todayFU = followUps.filter(f => f.nextFollowUp && new Date(f.nextFollowUp).toDateString() === today && myLeads.find(l => l.id === f.leadId));
  const closedDeals = myLeads.filter(l => l.status === "Deal Closed");
  const pending = followUps.filter(f => f.nextFollowUp && new Date(f.nextFollowUp) < new Date() && !myLeads.find(l => l.id === f.leadId && l.status === "Deal Closed"));

  const recentLeads = [...myLeads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const sourceStats = sourceList.map(s => ({ source: s, count: myLeads.filter(l => l.source === s).length })).filter(x => x.count > 0);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800, color: COLORS.dark }}>
        {user.role === "admin" ? "Admin Dashboard" : `Welcome, ${user.name.split(" ")[0]} 👋`}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Leads" value={myLeads.length} icon="👥" color={COLORS.primary} />
        <StatCard label="Today's Follow-Ups" value={todayFU.length} icon="📅" color={COLORS.warning} />
        <StatCard label="Deals Closed" value={closedDeals.length} icon="✅" color={COLORS.success} />
        <StatCard label="Missed Follow-Ups" value={pending.length} icon="⚠️" color={COLORS.danger} />
        {user.role === "admin" && <StatCard label="Active Projects" value={projects.filter(p => p.status === "active").length} icon="🏗" color="#7c3aed" />}
        {user.role === "admin" && <StatCard label="Active Staff" value={users.filter(u => u.role === "staff" && u.active).length} icon="👤" color="#0891b2" />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Recent Leads</h3>
          {recentLeads.map(lead => {
            const proj = projects.find(p => p.id === lead.projectId);
            return (
              <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <Avatar name={lead.name} size={36} color={proj?.color || COLORS.primary} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{lead.mobile} · {proj?.name}</div>
                </div>
                <Badge status={lead.status} />
              </div>
            );
          })}
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Lead Sources</h3>
          {sourceStats.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 14 }}>No data</p> : sourceStats.map(s => (
            <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: COLORS.dark, width: 110, flexShrink: 0 }}>{s.source}</span>
              <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 8 }}>
                <div style={{ width: `${(s.count / myLeads.length) * 100}%`, background: COLORS.primary, borderRadius: 4, height: 8, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, minWidth: 20 }}>{s.count}</span>
            </div>
          ))}

          <h3 style={{ margin: "20px 0 12px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Status Breakdown</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {statusList.map(st => {
              const count = myLeads.filter(l => l.status === st).length;
              const c = statusColors[st];
              return count > 0 ? (
                <div key={st} style={{ background: c.bg, color: c.text, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {st}: {count}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {todayFU.length > 0 && (
        <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#92400e" }}>⏰ Today's Follow-Ups ({todayFU.length})</h3>
          {todayFU.slice(0, 3).map(f => {
            const lead = leads.find(l => l.id === f.leadId);
            return lead ? (
              <div key={f.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #fde68a" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark }}>{lead.name}</span>
                <span style={{ fontSize: 12, color: COLORS.muted }}>{lead.mobile}</span>
                <Badge status={lead.status} />
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#92400e", fontWeight: 600 }}>{f.type}</span>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
function Leads({ state, setState, user }) {
  const { leads, projects, users } = state;
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [showFollowUpFor, setShowFollowUpFor] = useState(null);

  const myLeads = user.role === "admin" ? leads : leads.filter(l => l.assignedTo === user.id);

  const filtered = myLeads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name.toLowerCase().includes(q) || l.mobile.includes(q) || l.email?.toLowerCase().includes(q);
    const matchProject = filterProject === "all" || l.projectId === parseInt(filterProject);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchProject && matchStatus;
  });

  const handleSaveLead = (leadData) => {
    if (editLead) {
      setState(s => ({ ...s, leads: s.leads.map(l => l.id === editLead.id ? { ...leadData, id: l.id, createdAt: l.createdAt } : l) }));
    } else {
      setState(s => ({ ...s, leads: [...s.leads, { ...leadData, id: Date.now(), createdAt: new Date().toISOString() }] }));
    }
    setShowAdd(false); setEditLead(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this lead?")) setState(s => ({ ...s, leads: s.leads.filter(l => l.id !== id) }));
  };

  const handleAddFollowUp = (followUpData) => {
    setState(s => ({
      ...s,
      followUps: [...s.followUps, { ...followUpData, id: Date.now(), createdBy: user.id }],
      leads: s.leads.map(l => l.id === followUpData.leadId ? { ...l, status: followUpData.status } : l),
    }));
    setShowFollowUpFor(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.dark }}>{user.role === "admin" ? "All Leads" : "My Leads"}</h2>
        {user.role === "admin" && <Btn onClick={() => { setEditLead(null); setShowAdd(true); }}>+ Add Lead</Btn>}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: "1 1 200px", maxWidth: 280 }} placeholder="🔍 Search name, mobile..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...selectStyle, flex: "0 0 160px" }} value={filterProject} onChange={e => setFilterProject(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select style={{ ...selectStyle, flex: "0 0 140px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          {statusList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fb" }}>
                {["Lead", "Mobile", "Project", "Source", "Budget", "Status", "Assigned To", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: COLORS.muted, textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: COLORS.muted, fontSize: 14 }}>No leads found</td></tr>
              ) : filtered.map(lead => {
                const proj = projects.find(p => p.id === lead.projectId);
                const assignee = users.find(u => u.id === lead.assignedTo);
                return (
                  <tr key={lead.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={lead.name} size={32} color={proj?.color || COLORS.primary} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark }}>{lead.name}</div>
                          {lead.email && <div style={{ fontSize: 12, color: COLORS.muted }}>{lead.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 14, color: COLORS.dark }}>{lead.mobile}</div>
                      {lead.altMobile && <div style={{ fontSize: 12, color: COLORS.muted }}>{lead.altMobile}</div>}
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <a href={`tel:${lead.mobile}`} style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 10, textDecoration: "none" }}>📞 Call</a>
                        <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 10, textDecoration: "none" }}>💬 WA</a>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.dark }}>{proj?.name || "-"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.muted }}>{lead.source}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.dark }}>{lead.budget}</td>
                    <td style={{ padding: "12px 16px" }}><Badge status={lead.status} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      {assignee ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Avatar name={assignee.name} size={24} />
                        <span style={{ fontSize: 13, color: COLORS.dark }}>{assignee.name.split(" ")[0]}</span>
                      </div> : "-"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.muted, whiteSpace: "nowrap" }}>{fmt(lead.createdAt)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                        <button onClick={() => setViewLead(lead)} style={{ border: "none", background: "#f3f4f6", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>View</button>
                        <button onClick={() => setShowFollowUpFor(lead)} style={{ border: "none", background: "#e0f2fe", color: "#0369a1", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>+ FU</button>
                        {user.role === "admin" && <>
                          <button onClick={() => { setEditLead(lead); setShowAdd(true); }} style={{ border: "none", background: "#fef9c3", color: "#854d0e", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Edit</button>
                          <button onClick={() => handleDelete(lead.id)} style={{ border: "none", background: "#fee2e2", color: COLORS.danger, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Del</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(showAdd || editLead) && (
        <LeadForm lead={editLead} projects={projects} users={users} user={user} onSave={handleSaveLead} onClose={() => { setShowAdd(false); setEditLead(null); }} />
      )}
      {viewLead && <LeadDetail lead={viewLead} state={state} user={user} onClose={() => setViewLead(null)} onAddFU={() => { setShowFollowUpFor(viewLead); setViewLead(null); }} />}
      {showFollowUpFor && <FollowUpForm lead={showFollowUpFor} user={user} onSave={handleAddFollowUp} onClose={() => setShowFollowUpFor(null)} />}
    </div>
  );
}

function LeadForm({ lead, projects, users, user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: lead?.name || "", mobile: lead?.mobile || "", altMobile: lead?.altMobile || "",
    email: lead?.email || "", source: lead?.source || "Facebook", projectId: lead?.projectId || projects[0]?.id || 1,
    budget: lead?.budget || "", location: lead?.location || "", notes: lead?.notes || "",
    assignedTo: lead?.assignedTo || users.find(u => u.role === "staff")?.id || "", status: lead?.status || "Interested",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const staff = users.filter(u => u.role === "staff" && u.active);

  const handleSave = () => {
    if (!form.name || !form.mobile) { alert("Name and mobile are required"); return; }
    onSave({ ...form, projectId: parseInt(form.projectId), assignedTo: parseInt(form.assignedTo) });
  };

  return (
    <Modal title={lead ? "Edit Lead" : "Add New Lead"} onClose={onClose} width={600}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <FormField label="Full Name" required><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Lead name" /></FormField>
        <FormField label="Mobile Number" required><input style={inputStyle} value={form.mobile} onChange={e => set("mobile", e.target.value)} placeholder="10-digit mobile" /></FormField>
        <FormField label="Alternate Number"><input style={inputStyle} value={form.altMobile} onChange={e => set("altMobile", e.target.value)} placeholder="Alt mobile (optional)" /></FormField>
        <FormField label="Email"><input style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@example.com" /></FormField>
        <FormField label="Lead Source" required>
          <select style={selectStyle} value={form.source} onChange={e => set("source", e.target.value)}>
            {sourceList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Project" required>
          <select style={selectStyle} value={form.projectId} onChange={e => set("projectId", e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormField>
        <FormField label="Budget Range"><input style={inputStyle} value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="e.g. 50-70L" /></FormField>
        <FormField label="Preferred Location"><input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Perungudi" /></FormField>
        <FormField label="Assign To">
          <select style={selectStyle} value={form.assignedTo} onChange={e => set("assignedTo", e.target.value)}>
            <option value="">-- Select Staff --</option>
            {staff.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </FormField>
        <FormField label="Status">
          <select style={selectStyle} value={form.status} onChange={e => set("status", e.target.value)}>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Notes / Requirements">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Requirements, notes..." />
      </FormField>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave}>{lead ? "Update Lead" : "Add Lead"}</Btn>
      </div>
    </Modal>
  );
}

function LeadDetail({ lead, state, user, onClose, onAddFU }) {
  const { projects, users, followUps } = state;
  const proj = projects.find(p => p.id === lead.projectId);
  const assignee = users.find(u => u.id === lead.assignedTo);
  const leadFU = followUps.filter(f => f.leadId === lead.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <Modal title="Lead Details" onClose={onClose} width={600}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "16px", background: "#f8f9fb", borderRadius: 10 }}>
        <Avatar name={lead.name} size={52} color={proj?.color || COLORS.primary} />
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: COLORS.dark }}>{lead.name}</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <a href={`tel:${lead.mobile}`} style={{ fontSize: 14, color: COLORS.primary, textDecoration: "none", fontWeight: 600 }}>📞 {lead.mobile}</a>
            <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#15803d", textDecoration: "none" }}>💬 WhatsApp</a>
            <Badge status={lead.status} />
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        {[
          ["Project", proj?.name], ["Source", lead.source], ["Budget", lead.budget], ["Location", lead.location],
          ["Assigned To", assignee?.name], ["Email", lead.email || "-"], ["Alt Mobile", lead.altMobile || "-"], ["Added On", fmt(lead.createdAt)],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark }}>{v || "-"}</div>
          </div>
        ))}
      </div>
      {lead.notes && <div style={{ marginTop: 12, padding: 12, background: "#fffbeb", borderRadius: 8, fontSize: 13, color: COLORS.dark }}><strong>Notes:</strong> {lead.notes}</div>}

      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Follow-Up History ({leadFU.length})</h4>
          <Btn size="sm" onClick={onAddFU}>+ Add Follow-Up</Btn>
        </div>
        {leadFU.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 13 }}>No follow-ups yet</p> : leadFU.map(f => (
          <div key={f.id} style={{ padding: "10px 14px", background: "#f8f9fb", borderRadius: 8, marginBottom: 8, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: COLORS.primary }}>{f.type}</span>
              <Badge status={f.status} />
            </div>
            <div style={{ color: COLORS.dark, marginBottom: 4 }}>{f.notes}</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>
              {fmtTime(f.date)} {f.nextFollowUp ? `→ Next: ${fmtTime(f.nextFollowUp)}` : ""}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function FollowUpForm({ lead, user, onSave, onClose }) {
  const [form, setForm] = useState({
    leadId: lead.id, type: "Call", notes: "", status: lead.status || "Interested",
    date: new Date().toISOString().slice(0, 16), nextFollowUp: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => {
    if (!form.notes) { alert("Please add notes"); return; }
    onSave({ ...form, date: new Date(form.date).toISOString(), nextFollowUp: form.nextFollowUp ? new Date(form.nextFollowUp).toISOString() : null });
  };
  return (
    <Modal title={`Add Follow-Up: ${lead.name}`} onClose={onClose}>
      <FormField label="Follow-Up Type" required>
        <select style={selectStyle} value={form.type} onChange={e => set("type", e.target.value)}>
          {followUpTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </FormField>
      <FormField label="Date & Time" required>
        <input type="datetime-local" style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} />
      </FormField>
      <FormField label="Lead Status After" required>
        <select style={selectStyle} value={form.status} onChange={e => set("status", e.target.value)}>
          {statusList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FormField>
      <FormField label="Notes" required>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="What happened in this follow-up?" />
      </FormField>
      <FormField label="Next Follow-Up (Optional)">
        <input type="datetime-local" style={inputStyle} value={form.nextFollowUp} onChange={e => set("nextFollowUp", e.target.value)} />
      </FormField>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave}>Save Follow-Up</Btn>
      </div>
    </Modal>
  );
}

// ─── FOLLOW-UPS ───────────────────────────────────────────────────────────────
function FollowUps({ state, setState, user }) {
  const { followUps, leads, projects, users } = state;
  const [filter, setFilter] = useState("today");
  const [showFollowUpFor, setShowFollowUpFor] = useState(null);
  const today = new Date().toDateString();

  const myLeadIds = user.role === "admin" ? leads.map(l => l.id) : leads.filter(l => l.assignedTo === user.id).map(l => l.id);
  const myFU = followUps.filter(f => myLeadIds.includes(f.leadId));

  const filtered = myFU.filter(f => {
    if (!f.nextFollowUp) return filter === "all";
    const d = new Date(f.nextFollowUp).toDateString();
    if (filter === "today") return d === today;
    if (filter === "missed") return new Date(f.nextFollowUp) < new Date() && d !== today;
    if (filter === "upcoming") return new Date(f.nextFollowUp) > new Date();
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddFollowUp = (followUpData) => {
    setState(s => ({
      ...s,
      followUps: [...s.followUps, { ...followUpData, id: Date.now(), createdBy: user.id }],
      leads: s.leads.map(l => l.id === followUpData.leadId ? { ...l, status: followUpData.status } : l),
    }));
    setShowFollowUpFor(null);
  };

  const tabs = [
    { key: "today", label: `Today (${myFU.filter(f => f.nextFollowUp && new Date(f.nextFollowUp).toDateString() === today).length})` },
    { key: "missed", label: `Missed (${myFU.filter(f => f.nextFollowUp && new Date(f.nextFollowUp) < new Date() && new Date(f.nextFollowUp).toDateString() !== today).length})` },
    { key: "upcoming", label: "Upcoming" },
    { key: "all", label: "All" },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800, color: COLORS.dark }}>Follow-Ups</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#f3f4f6", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: filter === t.key ? COLORS.surface : "transparent",
              color: filter === t.key ? COLORS.primary : COLORS.muted,
              boxShadow: filter === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: COLORS.muted, background: COLORS.surface, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
            No follow-ups for this filter
          </div>
        ) : filtered.map(f => {
          const lead = leads.find(l => l.id === f.leadId);
          const proj = projects.find(p => p.id === lead?.projectId);
          const isMissed = f.nextFollowUp && new Date(f.nextFollowUp) < new Date() && new Date(f.nextFollowUp).toDateString() !== today;
          return (
            <div key={f.id} style={{ background: COLORS.surface, border: `1px solid ${isMissed ? "#fca5a5" : COLORS.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <Avatar name={lead?.name || "?"} size={40} color={proj?.color || COLORS.primary} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark }}>{lead?.name}</span>
                  <Badge status={f.status} />
                  <span style={{ fontSize: 12, background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{f.type}</span>
                  {isMissed && <span style={{ fontSize: 12, background: "#fee2e2", color: COLORS.danger, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>Missed</span>}
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 14, color: COLORS.dark }}>{f.notes}</p>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: COLORS.muted, flexWrap: "wrap" }}>
                  <span>📅 {fmtTime(f.date)}</span>
                  {f.nextFollowUp && <span style={{ color: isMissed ? COLORS.danger : COLORS.muted }}>⏰ Next: {fmtTime(f.nextFollowUp)}</span>}
                  {lead?.mobile && <a href={`tel:${lead.mobile}`} style={{ textDecoration: "none", color: COLORS.primaryLight }}>📞 {lead.mobile}</a>}
                </div>
              </div>
              {lead && (
                <button onClick={() => setShowFollowUpFor(lead)} style={{ border: "none", background: "#e0f2fe", color: "#0369a1", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  + Follow-Up
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showFollowUpFor && <FollowUpForm lead={showFollowUpFor} user={user} onSave={handleAddFollowUp} onClose={() => setShowFollowUpFor(null)} />}
    </div>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function Projects({ state, setState }) {
  const { projects, leads } = state;
  const [showAdd, setShowAdd] = useState(false);
  const [editProj, setEditProj] = useState(null);

  const handleSave = (data) => {
    if (editProj) setState(s => ({ ...s, projects: s.projects.map(p => p.id === editProj.id ? { ...data, id: p.id } : p) }));
    else setState(s => ({ ...s, projects: [...s.projects, { ...data, id: Date.now() }] }));
    setShowAdd(false); setEditProj(null);
  };

  const projectColors = ["#1a3c5e", "#16a34a", "#7c3aed", "#0891b2", "#dc2626", "#d97706"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.dark }}>Projects</h2>
        <Btn onClick={() => { setEditProj(null); setShowAdd(true); }}>+ New Project</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {projects.map(proj => {
          const projLeads = leads.filter(l => l.projectId === proj.id);
          const closed = projLeads.filter(l => l.status === "Deal Closed").length;
          return (
            <div key={proj.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: proj.color || COLORS.primary, padding: "20px 20px 16px", position: "relative" }}>
                <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                  {proj.logo || proj.name[0]}
                </div>
                <h3 style={{ margin: "0 0 4px", color: "#fff", fontSize: 17, fontWeight: 800 }}>{proj.name}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{proj.location} · {proj.type}</p>
                <div style={{ position: "absolute", top: 16, right: 16, background: proj.status === "active" ? "#dcfce7" : "#fee2e2", color: proj.status === "active" ? "#166534" : COLORS.danger, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {proj.status}
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[["Total", projLeads.length, COLORS.primary], ["Closed", closed, COLORS.success], ["Active", projLeads.length - closed, COLORS.warning]].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: "center", background: "#f8f9fb", borderRadius: 8, padding: "8px 4px" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="secondary" onClick={() => { setEditProj(proj); setShowAdd(true); }} style={{ flex: 1 }}>Edit</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setState(s => ({ ...s, projects: s.projects.map(p => p.id === proj.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p) }))} style={{ flex: 1 }}>
                    {proj.status === "active" ? "Disable" : "Enable"}
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(showAdd || editProj) && (
        <Modal title={editProj ? "Edit Project" : "New Project"} onClose={() => { setShowAdd(false); setEditProj(null); }}>
          {(() => {
            const [form, setForm] = useState({ name: editProj?.name || "", location: editProj?.location || "", type: editProj?.type || "Apartment", logo: editProj?.logo || "", color: editProj?.color || projectColors[0], status: editProj?.status || "active" });
            const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
            const handleSaveLocal = () => { if (!form.name) { alert("Project name required"); return; } handleSave(form); };
            return (
              <>
                <FormField label="Project Name" required><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Prestige Sunrise" /></FormField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <FormField label="Location"><input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. OMR, Chennai" /></FormField>
                  <FormField label="Type">
                    <select style={selectStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                      {["Apartment", "Villa", "Plots", "Commercial", "Township"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </FormField>
                </div>
                <FormField label="Logo / Short Code"><input style={inputStyle} value={form.logo} onChange={e => set("logo", e.target.value)} placeholder="e.g. PS (2-3 letters)" maxLength={3} /></FormField>
                <FormField label="Brand Color">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {projectColors.map(c => (
                      <div key={c} onClick={() => set("color", c)} style={{ width: 32, height: 32, background: c, borderRadius: 8, cursor: "pointer", border: form.color === c ? "3px solid #fff" : "none", outline: form.color === c ? `3px solid ${c}` : "none" }} />
                    ))}
                  </div>
                </FormField>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                  <Btn variant="ghost" onClick={() => { setShowAdd(false); setEditProj(null); }}>Cancel</Btn>
                  <Btn onClick={handleSaveLocal}>{editProj ? "Update" : "Create Project"}</Btn>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

// ─── STAFF ────────────────────────────────────────────────────────────────────
function Staff({ state, setState }) {
  const { users, leads, projects } = state;
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const staff = users.filter(u => u.role === "staff");

  const handleSave = (data) => {
    if (editUser) setState(s => ({ ...s, users: s.users.map(u => u.id === editUser.id ? { ...data, id: u.id, avatar: u.avatar, role: "staff" } : u) }));
    else setState(s => ({ ...s, users: [...s.users, { ...data, id: Date.now(), role: "staff", avatar: data.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }] }));
    setShowAdd(false); setEditUser(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.dark }}>Staff Management</h2>
        <Btn onClick={() => { setEditUser(null); setShowAdd(true); }}>+ Add Staff</Btn>
      </div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fb" }}>
              {["Staff Member", "Login", "Mobile", "Projects", "Leads", "Closed", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: COLORS.muted, textAlign: "left", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map(member => {
              const memberLeads = leads.filter(l => l.assignedTo === member.id);
              const closed = memberLeads.filter(l => l.status === "Deal Closed").length;
              const memberProjects = member.projects === "all" ? projects : projects.filter(p => member.projects?.includes(p.id));
              return (
                <tr key={member.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={member.name} size={36} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{member.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.muted }}>{member.username}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.dark }}>{member.mobile}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {memberProjects.slice(0, 2).map(p => (
                        <span key={p.id} style={{ fontSize: 11, background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
                      ))}
                      {memberProjects.length > 2 && <span style={{ fontSize: 11, color: COLORS.muted }}>+{memberProjects.length - 2}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{memberLeads.length}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: COLORS.success }}>{closed}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: member.active ? "#dcfce7" : "#fee2e2", color: member.active ? "#166534" : COLORS.danger, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {member.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditUser(member); setShowAdd(true); }} style={{ border: "none", background: "#fef9c3", color: "#854d0e", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Edit</button>
                      <button onClick={() => setState(s => ({ ...s, users: s.users.map(u => u.id === member.id ? { ...u, active: !u.active } : u) }))}
                        style={{ border: "none", background: "#f3f4f6", color: COLORS.muted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>
                        {member.active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(showAdd || editUser) && (
        <Modal title={editUser ? "Edit Staff" : "Add Staff Member"} onClose={() => { setShowAdd(false); setEditUser(null); }}>
          {(() => {
            const [form, setForm] = useState({
              name: editUser?.name || "", username: editUser?.username || "", mobile: editUser?.mobile || "",
              password: editUser?.password || "", email: editUser?.email || "",
              projects: editUser?.projects || [], active: editUser?.active !== false,
            });
            const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
            const toggleProject = (id) => setForm(f => ({ ...f, projects: f.projects.includes(id) ? f.projects.filter(p => p !== id) : [...f.projects, id] }));
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <FormField label="Full Name" required><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} /></FormField>
                  <FormField label="Username" required><input style={inputStyle} value={form.username} onChange={e => set("username", e.target.value)} /></FormField>
                  <FormField label="Mobile" required><input style={inputStyle} value={form.mobile} onChange={e => set("mobile", e.target.value)} /></FormField>
                  <FormField label="Email"><input style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} /></FormField>
                  <FormField label="Password" required><input type="password" style={inputStyle} value={form.password} onChange={e => set("password", e.target.value)} /></FormField>
                </div>
                <FormField label="Assigned Projects">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {state.projects.map(p => (
                      <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, padding: "6px 12px", borderRadius: 8, border: `1px solid ${form.projects.includes(p.id) ? COLORS.primary : COLORS.border}`, background: form.projects.includes(p.id) ? "#eff6ff" : COLORS.surface }}>
                        <input type="checkbox" checked={form.projects.includes(p.id)} onChange={() => toggleProject(p.id)} style={{ margin: 0 }} />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </FormField>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <Btn variant="ghost" onClick={() => { setShowAdd(false); setEditUser(null); }}>Cancel</Btn>
                  <Btn onClick={() => { if (!form.name || !form.username || !form.mobile || !form.password) { alert("Fill required fields"); return; } handleSave(form); }}>{editUser ? "Update" : "Add Staff"}</Btn>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
function Reports({ state }) {
  const { leads, followUps, users, projects } = state;
  const [period, setPeriod] = useState("all");

  const staffStats = users.filter(u => u.role === "staff").map(u => ({
    ...u,
    total: leads.filter(l => l.assignedTo === u.id).length,
    closed: leads.filter(l => l.assignedTo === u.id && l.status === "Deal Closed").length,
    interested: leads.filter(l => l.assignedTo === u.id && l.status === "Interested").length,
    followUps: followUps.filter(f => f.createdBy === u.id).length,
  }));

  const projectStats = projects.map(p => ({
    ...p,
    total: leads.filter(l => l.projectId === p.id).length,
    closed: leads.filter(l => l.projectId === p.id && l.status === "Deal Closed").length,
  }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.dark }}>Reports & Analytics</h2>
        <Btn variant="secondary" onClick={() => alert("Export functionality — connect to backend API for real CSV export")}>Export CSV</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Leads" value={leads.length} color={COLORS.primary} />
        <StatCard label="Deals Closed" value={leads.filter(l => l.status === "Deal Closed").length} color={COLORS.success} />
        <StatCard label="Conversion Rate" value={`${Math.round((leads.filter(l => l.status === "Deal Closed").length / leads.length) * 100)}%`} color={COLORS.warning} />
        <StatCard label="Total Follow-Ups" value={followUps.length} color="#7c3aed" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Staff Performance</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "Leads", "Closed", "FU's", "Rate"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 12, color: COLORS.muted, fontWeight: 600, padding: "6px 8px", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffStats.sort((a, b) => b.closed - a.closed).map(s => (
                <tr key={s.id}>
                  <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 600, color: COLORS.dark }}>{s.name.split(" ")[0]}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13 }}>{s.total}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13, color: COLORS.success, fontWeight: 700 }}>{s.closed}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13 }}>{s.followUps}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13 }}>
                    <span style={{ background: s.total > 0 && (s.closed / s.total) > 0.3 ? "#dcfce7" : "#f3f4f6", color: s.total > 0 && (s.closed / s.total) > 0.3 ? COLORS.success : COLORS.muted, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                      {s.total > 0 ? Math.round((s.closed / s.total) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Project Performance</h3>
          {projectStats.map(p => (
            <div key={p.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark }}>{p.name}</span>
                <span style={{ fontSize: 13, color: COLORS.muted }}>{p.closed} / {p.total} closed</span>
              </div>
              <div style={{ background: "#f3f4f6", borderRadius: 4, height: 8 }}>
                <div style={{ width: p.total > 0 ? `${(p.closed / p.total) * 100}%` : "0%", background: p.color || COLORS.primary, borderRadius: 4, height: 8, transition: "width 0.4s" }} />
              </div>
            </div>
          ))}

          <h3 style={{ margin: "20px 0 12px", fontSize: 15, fontWeight: 700, color: COLORS.dark }}>Lead Source Analysis</h3>
          {sourceList.map(s => {
            const count = leads.filter(l => l.source === s).length;
            if (!count) return null;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.dark, width: 100, flexShrink: 0 }}>{s}</span>
                <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${(count / leads.length) * 100}%`, background: COLORS.accent, borderRadius: 4, height: 6 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 24 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings({ state, setState }) {
  const [companyName, setCompanyName] = useState("PropConnect CRM");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: COLORS.dark }}>Settings</h2>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: COLORS.dark }}>Company / Branding</h3>
        <FormField label="Company Name"><input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} /></FormField>
        <FormField label="Company Logo"><div style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 8, padding: 24, textAlign: "center", color: COLORS.muted, fontSize: 14, cursor: "pointer" }}>Click to upload logo (PNG/SVG)</div></FormField>
      </div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: COLORS.dark }}>Follow-Up Reminders</h3>
        <FormField label="Reminder Before (minutes)">
          <select style={selectStyle}>
            {[15, 30, 60, 120, 1440].map(m => <option key={m} value={m}>{m < 60 ? `${m} mins` : m === 1440 ? "1 day" : `${m / 60} hrs`}</option>)}
          </select>
        </FormField>
        <FormField label="Browser Notifications">
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked /> Enable browser notifications
          </label>
        </FormField>
      </div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: COLORS.dark }}>Lead Status Labels</h3>
        <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 12px" }}>Current status labels (customization coming soon)</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {statusList.map(s => <Badge key={s} status={s} />)}
        </div>
      </div>
      <Btn onClick={handleSave} size="lg">{saved ? "✓ Saved!" : "Save Settings"}</Btn>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => { setIsMobile(window.innerWidth < 768); setSidebarCollapsed(window.innerWidth < 768); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!currentUser) return <LoginPage onLogin={user => { setCurrentUser(user); setPage("dashboard"); }} />;

  const renderPage = () => {
    const props = { state, setState, user: currentUser };
    switch (page) {
      case "dashboard": return <Dashboard {...props} />;
      case "leads": return <Leads {...props} />;
      case "followups": return <FollowUps {...props} />;
      case "projects": return currentUser.role === "admin" ? <Projects {...props} /> : null;
      case "staff": return currentUser.role === "admin" ? <Staff {...props} /> : null;
      case "reports": return currentUser.role === "admin" ? <Reports {...props} /> : null;
      case "settings": return currentUser.role === "admin" ? <Settings {...props} /> : null;
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <Sidebar current={page} onNav={setPage} user={currentUser} onLogout={() => setCurrentUser(null)} collapsed={sidebarCollapsed || isMobile} onToggle={() => setSidebarCollapsed(c => !c)} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, color: COLORS.muted }}>
            <span style={{ fontWeight: 600, color: COLORS.dark }}>PropConnect CRM</span>
            <span style={{ margin: "0 8px" }}>·</span>
            <span style={{ textTransform: "capitalize" }}>{page}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 13, color: COLORS.muted }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <Avatar name={currentUser.name} size={32} />
          </div>
        </div>
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
