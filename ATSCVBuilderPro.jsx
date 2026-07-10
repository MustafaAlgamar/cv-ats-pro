import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// GLOBAL STYLES
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: #2563EB;
      --primary-light: #3B82F6;
      --primary-dark: #1D4ED8;
      --secondary: #1E293B;
      --accent: #06B6D4;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --bg: #0A0F1E;
      --bg2: #0F1629;
      --bg3: #141B2D;
      --surface: #1A2236;
      --surface2: #1E2840;
      --border: rgba(255,255,255,0.07);
      --border2: rgba(255,255,255,0.12);
      --text: #F1F5F9;
      --text2: #94A3B8;
      --text3: #64748B;
      --glass: rgba(255,255,255,0.04);
      --glass2: rgba(255,255,255,0.07);
      --shadow: 0 4px 24px rgba(0,0,0,0.4);
      --shadow-lg: 0 8px 48px rgba(0,0,0,0.5);
      --radius: 14px;
      --radius-sm: 8px;
      --radius-lg: 20px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 10px; }

    input, textarea, select {
      font-family: 'DM Sans', sans-serif;
      background: var(--surface);
      border: 1px solid var(--border2);
      color: var(--text);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      font-size: 14px;
      width: 100%;
      outline: none;
      transition: all 0.2s;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }
    input::placeholder, textarea::placeholder { color: var(--text3); }
    select option { background: var(--surface2); }

    button { cursor: pointer; font-family: 'DM Sans', sans-serif; }

    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: var(--radius-sm);
      font-size: 14px; font-weight: 500; border: none;
      transition: all 0.2s; white-space: nowrap;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
    .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
    .btn-secondary:hover { background: var(--surface); border-color: var(--border2); }
    .btn-ghost { background: transparent; color: var(--text2); }
    .btn-ghost:hover { background: var(--glass2); color: var(--text); }
    .btn-danger { background: var(--danger); color: #fff; }
    .btn-sm { padding: 7px 14px; font-size: 13px; }
    .btn-lg { padding: 13px 28px; font-size: 15px; font-weight: 600; }
    .btn-icon { padding: 8px; border-radius: var(--radius-sm); background: var(--glass2); color: var(--text2); border: 1px solid var(--border); }
    .btn-icon:hover { background: var(--surface2); color: var(--text); }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
    }
    .card-glass {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
    }

    .tag {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 100px;
      font-size: 12px; font-weight: 500;
    }
    .tag-primary { background: rgba(37,99,235,0.15); color: var(--primary-light); }
    .tag-success { background: rgba(16,185,129,0.15); color: var(--success); }
    .tag-warning { background: rgba(245,158,11,0.15); color: var(--warning); }
    .tag-danger { background: rgba(239,68,68,0.15); color: var(--danger); }
    .tag-accent { background: rgba(6,182,212,0.15); color: var(--accent); }

    .section-title {
      font-size: 22px; font-weight: 700; color: var(--text);
      margin-bottom: 4px;
    }
    .section-sub { font-size: 14px; color: var(--text2); margin-bottom: 24px; }

    .divider { height: 1px; background: var(--border); margin: 20px 0; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

    .label { font-size: 13px; font-weight: 500; color: var(--text2); margin-bottom: 6px; display: block; }

    .score-ring {
      position: relative; display: inline-flex;
      align-items: center; justify-content: center;
    }

    .ai-glow {
      box-shadow: 0 0 30px rgba(6,182,212,0.2), 0 0 60px rgba(37,99,235,0.1);
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .mono { font-family: 'DM Mono', monospace; }

    /* Noise texture overlay */
    .noise::after {
      content: ''; position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none; border-radius: inherit;
    }

    /* Animated gradient bg */
    .animated-bg {
      background: linear-gradient(-45deg, #0A0F1E, #0F1629, #141B2D, #0A1628);
      background-size: 400% 400%;
      animation: gradShift 15s ease infinite;
    }
    @keyframes gradShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Resume Preview Styles */
    .resume-preview { background: #fff; color: #111; padding: 40px; font-family: 'Georgia', serif; min-height: 600px; }
    .resume-preview.modern { font-family: 'DM Sans', sans-serif; }
    .resume-preview h1 { font-family: 'Syne', sans-serif; }
    .resume-preview .rp-name { font-size: 28px; font-weight: 800; color: #111; margin-bottom: 4px; }
    .resume-preview .rp-title { font-size: 15px; color: #2563EB; font-weight: 600; margin-bottom: 12px; }
    .resume-preview .rp-contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: #555; margin-bottom: 20px; border-bottom: 2px solid #2563EB; padding-bottom: 16px; }
    .resume-preview .rp-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2563EB; margin: 18px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    .resume-preview .rp-summary { font-size: 13px; line-height: 1.7; color: #333; }
    .resume-preview .rp-exp-item { margin-bottom: 14px; }
    .resume-preview .rp-exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .resume-preview .rp-exp-title { font-weight: 700; font-size: 14px; color: #111; }
    .resume-preview .rp-exp-company { font-size: 13px; color: #2563EB; }
    .resume-preview .rp-exp-date { font-size: 12px; color: #777; }
    .resume-preview .rp-exp-desc { font-size: 12px; color: #444; line-height: 1.6; margin-top: 5px; }
    .resume-preview .rp-skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .resume-preview .rp-skill { background: #EFF6FF; color: #2563EB; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; }
    .resume-preview .rp-edu { font-size: 13px; }
    .resume-preview .rp-edu strong { display: block; font-size: 14px; }
    .resume-preview.executive { border-top: 6px solid #1E293B; }
    .resume-preview.executive .rp-name { color: #1E293B; font-size: 32px; }
    .resume-preview.executive .rp-contact { border-bottom-color: #1E293B; }
    .resume-preview.executive .rp-section-title { color: #1E293B; border-bottom-color: #1E293B; }
    .resume-preview.executive .rp-skill { background: #F1F5F9; color: #1E293B; }
    .resume-preview.minimal .rp-name { font-size: 24px; font-weight: 600; }
    .resume-preview.minimal .rp-contact { border-bottom: 1px solid #e2e8f0; }
    .resume-preview.minimal .rp-section-title { color: #374151; font-size: 11px; }
    .resume-preview.minimal .rp-skill { background: #F9FAFB; color: #374151; border: 1px solid #e5e7eb; }
    .resume-preview.tech { font-family: 'DM Mono', monospace; }
    .resume-preview.tech .rp-name { font-family: 'Syne', sans-serif; color: #06B6D4; }
    .resume-preview.tech .rp-title { color: #10B981; }
    .resume-preview.tech .rp-section-title { color: #06B6D4; }
    .resume-preview.tech .rp-skill { background: #ECFDF5; color: #10B981; border: 1px solid #d1fae5; }
    .resume-preview.creative { border-left: 6px solid #F59E0B; padding-left: 34px; }
    .resume-preview.creative .rp-name { color: #92400E; }
    .resume-preview.creative .rp-section-title { color: #F59E0B; }
    .resume-preview.creative .rp-skill { background: #FFFBEB; color: #92400E; }

    /* Scrollable modal body */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-box {
      background: var(--bg2); border: 1px solid var(--border2);
      border-radius: var(--radius-lg); width: 100%; max-width: 600px;
      max-height: 90vh; overflow-y: auto;
    }

    /* Chat bubbles */
    .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.6; }
    .chat-bubble.user { background: var(--primary); color: #fff; border-bottom-right-radius: 4px; margin-left: auto; }
    .chat-bubble.ai { background: var(--surface2); color: var(--text); border-bottom-left-radius: 4px; border: 1px solid var(--border); }

    /* Progress bar */
    .progress-bar { height: 6px; background: var(--surface2); border-radius: 100px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 100px; transition: width 0.8s ease; }

    /* Sidebar nav */
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: var(--radius-sm);
      font-size: 14px; font-weight: 500; color: var(--text2);
      cursor: pointer; transition: all 0.2s; border: none; background: none;
      width: 100%; text-align: left;
    }
    .nav-item:hover { background: var(--glass2); color: var(--text); }
    .nav-item.active { background: rgba(37,99,235,0.15); color: var(--primary-light); }
    .nav-item .nav-icon { font-size: 18px; width: 22px; flex-shrink: 0; }

    /* Toggle switch */
    .toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute; inset: 0; background: var(--surface2);
      border-radius: 100px; transition: 0.3s; cursor: pointer;
    }
    .toggle-slider::before {
      content: ''; position: absolute; width: 18px; height: 18px;
      left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: 0.3s;
    }
    .toggle input:checked + .toggle-slider { background: var(--primary); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

    /* Tooltip */
    .tooltip { position: relative; }
    .tooltip::after {
      content: attr(data-tip); position: absolute; bottom: calc(100% + 8px);
      left: 50%; transform: translateX(-50%); background: var(--secondary);
      color: var(--text); padding: 6px 10px; border-radius: 6px; font-size: 12px;
      white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s;
      border: 1px solid var(--border2); z-index: 99;
    }
    .tooltip:hover::after { opacity: 1; }

    @media (max-width: 768px) {
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
    }

    /* Print styles */
    @media print {
      body { background: white !important; }
      .no-print { display: none !important; }
      .resume-preview { box-shadow: none; }
    }
  `}</style>
);

// ============================================================
// ICONS
// ============================================================
const Icon = ({ name, size = 18, style }) => {
  const icons = {
    dashboard: "⊞", resume: "📄", ai: "✦", ats: "📊", template: "🎨",
    chat: "💬", settings: "⚙", logout: "→", add: "+", edit: "✎",
    delete: "✕", save: "↓", download: "⤓", print: "⎙", eye: "◉",
    copy: "⧉", check: "✓", close: "✕", menu: "≡", back: "←",
    user: "◯", mail: "✉", phone: "☎", location: "◎", link: "⌁",
    github: "⌥", linkedin: "ℓ", star: "★", info: "ℹ", warn: "⚠",
    upload: "⤒", refresh: "↻", search: "◎", filter: "⊟", sort: "⇅",
    expand: "⤢", collapse: "⤡", drag: "⠿", lock: "⊛", unlock: "⊙",
    brain: "◈", spark: "⚡", chart: "▲", target: "◎", rocket: "↑",
    magic: "✦", send: "➤", attach: "⊕", smile: "☺", code: "</>",
    briefcase: "▣", school: "◻", award: "◆", language: "⊕", project: "◇",
    grid: "⊞", list: "≡", zap: "⚡", trend: "↗", dots: "…",
    arrow_right: "→", arrow_down: "↓", plus: "+", minus: "−",
    check_circle: "✓", x_circle: "✕", alert: "⚠", crown: "♛",
    pen: "✎", trash: "⌫", duplicate: "⧉", share: "⤴", notion: "N",
    loading: "◌", admin: "♛", analytics: "📈", notify: "🔔",
  };
  return <span style={{ fontSize: size, lineHeight: 1, ...style }}>{icons[name] || "•"}</span>;
};

// ============================================================
// APP CONTEXT
// ============================================================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

const TEMPLATES = [
  { id: "modern", name: "Modern", tag: "Popular", color: "#2563EB" },
  { id: "executive", name: "Executive", tag: "Professional", color: "#1E293B" },
  { id: "minimal", name: "Minimal", tag: "Clean", color: "#374151" },
  { id: "tech", name: "Tech", tag: "Dev-Friendly", color: "#06B6D4" },
  { id: "creative", name: "Creative", tag: "Bold", color: "#F59E0B" },
  { id: "corporate", name: "Corporate", tag: "Business", color: "#7C3AED" },
  { id: "academic", name: "Academic", tag: "Research", color: "#0F766E" },
  { id: "startup", name: "Startup", tag: "Dynamic", color: "#DB2777" },
  { id: "professional", name: "Professional", tag: "Classic", color: "#1E40AF" },
  { id: "elegant", name: "Elegant", tag: "Luxury", color: "#92400E" },
];

const DEFAULT_RESUME = {
  id: "r1", name: "My Resume", template: "modern", atsScore: 82,
  lastEdited: "2 hours ago", status: "active",
  personal: {
    fullName: "Alexandra Chen", jobTitle: "Senior Software Engineer",
    email: "alex.chen@email.com", phone: "+1 (555) 234-5678",
    location: "San Francisco, CA", portfolio: "alexchen.dev",
    linkedin: "linkedin.com/in/alexchen", github: "github.com/alexchen",
  },
  summary: "Results-driven Senior Software Engineer with 7+ years of experience building scalable distributed systems and leading cross-functional teams. Proven track record of delivering high-impact features that drive user growth and revenue. Passionate about clean architecture, performance optimization, and mentoring junior developers.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL", "Redis", "Kubernetes", "CI/CD", "System Design"],
  experience: [
    { id: "e1", title: "Senior Software Engineer", company: "TechCorp Inc.", location: "San Francisco, CA", startDate: "Jan 2021", endDate: "Present", description: "Led development of microservices architecture serving 10M+ users. Reduced API latency by 60% through caching strategies. Mentored team of 5 junior engineers and conducted 100+ code reviews." },
    { id: "e2", title: "Software Engineer", company: "StartupXYZ", location: "New York, NY", startDate: "Jun 2018", endDate: "Dec 2020", description: "Built real-time collaboration features using WebSockets. Implemented CI/CD pipeline reducing deployment time by 75%. Designed and shipped 3 major product features from concept to production." },
  ],
  education: [
    { id: "ed1", degree: "B.S. Computer Science", school: "UC Berkeley", location: "Berkeley, CA", year: "2018", gpa: "3.8" },
  ],
  certifications: [
    { id: "c1", name: "AWS Solutions Architect", issuer: "Amazon", year: "2022" },
    { id: "c2", name: "Google Cloud Professional", issuer: "Google", year: "2023" },
  ],
  languages: [{ id: "l1", name: "English", level: "Native" }, { id: "l2", name: "Mandarin", level: "Fluent" }],
  projects: [
    { id: "p1", name: "OpenSource CLI Tool", description: "Built a developer productivity CLI with 2K+ GitHub stars. Used by 500+ teams worldwide.", link: "github.com/alexchen/toolx", tech: "Go, Docker" },
  ],
};

const INITIAL_RESUMES = [
  { ...DEFAULT_RESUME },
  { ...DEFAULT_RESUME, id: "r2", name: "Product Manager Resume", template: "executive", atsScore: 74, lastEdited: "1 day ago", status: "draft" },
  { ...DEFAULT_RESUME, id: "r3", name: "Freelance Portfolio", template: "creative", atsScore: 91, lastEdited: "3 days ago", status: "active" },
];

// ============================================================
// ATS SCORING ENGINE
// ============================================================
const analyzeATS = (resume, jobDescription = "") => {
  let score = 0; const issues = []; const suggestions = [];
  const sections = { personal: 0, summary: 0, skills: 0, experience: 0, education: 0 };

  // Personal info completeness (20 pts)
  const p = resume.personal;
  const personalFields = ["fullName", "jobTitle", "email", "phone", "location"];
  const filledPersonal = personalFields.filter(f => p[f]?.trim()).length;
  sections.personal = Math.round((filledPersonal / personalFields.length) * 20);
  if (filledPersonal < personalFields.length) issues.push({ type: "warning", text: "Complete all personal information fields" });

  // Summary (15 pts)
  if (resume.summary) {
    const wordCount = resume.summary.split(' ').length;
    if (wordCount >= 30 && wordCount <= 80) { sections.summary = 15; }
    else if (wordCount > 0) { sections.summary = 10; suggestions.push("Professional summary should be 30-80 words"); }
    else { issues.push({ type: "danger", text: "Missing professional summary" }); }
  } else { issues.push({ type: "danger", text: "Add a professional summary section" }); }

  // Skills (25 pts)
  const skillCount = resume.skills.length;
  if (skillCount >= 10) { sections.skills = 25; }
  else if (skillCount >= 6) { sections.skills = 18; suggestions.push("Add more relevant skills (target 10+)"); }
  else if (skillCount >= 3) { sections.skills = 10; issues.push({ type: "warning", text: "Add more skills to improve ATS matching" }); }
  else { issues.push({ type: "danger", text: "Skills section needs more entries" }); }

  // Experience (25 pts)
  const expCount = resume.experience.length;
  if (expCount >= 2) {
    sections.experience = 20;
    const hasQuantified = resume.experience.some(e => /\d+/.test(e.description));
    if (hasQuantified) sections.experience = 25;
    else suggestions.push("Add quantifiable achievements (%, $, numbers) to experience");
  } else { sections.experience = Math.min(expCount * 10, 20); issues.push({ type: "warning", text: "Add more work experience entries" }); }

  // Education (15 pts)
  sections.education = resume.education.length > 0 ? 15 : 0;
  if (!resume.education.length) issues.push({ type: "warning", text: "Add education details" });

  // Job description matching bonus
  if (jobDescription && resume.skills.length) {
    const jdLower = jobDescription.toLowerCase();
    const matched = resume.skills.filter(s => jdLower.includes(s.toLowerCase())).length;
    if (matched > 0) suggestions.push(`${matched} of your skills match the job description`);
  }

  score = Object.values(sections).reduce((a, b) => a + b, 0);

  const keywords = ["quantifiable", "leadership", "collaboration", "metrics", "delivered", "increased", "reduced", "managed", "developed", "implemented"];
  const content = JSON.stringify(resume).toLowerCase();
  const foundKeywords = keywords.filter(k => content.includes(k));
  if (foundKeywords.length < 3) suggestions.push("Add more action-oriented keywords and power verbs");

  return {
    score: Math.min(score, 100),
    sections, issues, suggestions,
    breakdown: [
      { label: "Contact Info", score: sections.personal, max: 20, color: "#2563EB" },
      { label: "Summary", score: sections.summary, max: 15, color: "#10B981" },
      { label: "Skills", score: sections.skills, max: 25, color: "#F59E0B" },
      { label: "Experience", score: sections.experience, max: 25, color: "#06B6D4" },
      { label: "Education", score: sections.education, max: 15, color: "#8B5CF6" },
    ]
  };
};

// ============================================================
// ANTHROPIC API HELPER
// ============================================================
const callClaude = async (messages, systemPrompt, onChunk) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.content.map(b => b.text || "").join("");
};

// ============================================================
// COMPONENTS
// ============================================================

// Score Circle
const ScoreCircle = ({ score, size = 80, stroke = 7 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ - (score/100)*circ}
          strokeLinecap="round" initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score/100)*circ }} transition={{ duration: 1.2, ease: "easeOut" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize: size/4.5, fontWeight: 700, color, fontFamily: "Syne" }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--text3)" }}>/ 100</span>
      </div>
    </div>
  );
};

// Progress Bar
const ProgressBar = ({ value, max, color, label }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: "var(--text2)" }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{value}/{max}</span>
    </div>
    <div className="progress-bar">
      <motion.div className="progress-fill" style={{ background: color }}
        initial={{ width: 0 }} animate={{ width: `${(value/max)*100}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
    </div>
  </div>
);

// Toast
const Toast = ({ message, type = "success", onClose }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
    style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", alignItems:"center", gap:12,
      background: type==="success"?"rgba(16,185,129,0.15)":type==="error"?"rgba(239,68,68,0.15)":"rgba(37,99,235,0.15)",
      border:`1px solid ${type==="success"?"#10B981":type==="error"?"#EF4444":"#2563EB"}`,
      borderRadius:"var(--radius)", padding:"12px 18px", backdropFilter:"blur(20px)", maxWidth:340 }}>
    <span style={{ fontSize:18 }}>{type==="success"?"✓":type==="error"?"✕":"ℹ"}</span>
    <span style={{ fontSize:14, color:"var(--text)" }}>{message}</span>
    <button onClick={onClose} className="btn-icon" style={{ marginLeft:8, padding:"2px 6px" }}>✕</button>
  </motion.div>
);

// Stat Card
const StatCard = ({ label, value, icon, color, trend, sub }) => (
  <motion.div className="card" whileHover={{ y: -3 }} style={{ position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:-10, right:-10, fontSize:60, opacity:0.05 }}>{icon}</div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
      <div style={{ width:40, height:40, borderRadius:"var(--radius-sm)", background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
      {trend && <span style={{ fontSize:12, color: trend>0?"var(--success)":"var(--danger)", background: trend>0?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)", padding:"3px 8px", borderRadius:100 }}>{trend>0?"↑":"↓"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontSize:28, fontWeight:800, color, fontFamily:"Syne", marginBottom:4 }}>{value}</div>
    <div style={{ fontSize:13, color:"var(--text2)", fontWeight:500 }}>{label}</div>
    {sub && <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{sub}</div>}
  </motion.div>
);

// ============================================================
// RESUME PREVIEW
// ============================================================
const ResumePreview = ({ resume }) => {
  const tmpl = resume.template || "modern";
  const p = resume.personal;
  return (
    <div className={`resume-preview ${tmpl}`}>
      <div className="rp-name">{p.fullName || "Your Full Name"}</div>
      <div className="rp-title">{p.jobTitle || "Your Job Title"}</div>
      <div className="rp-contact">
        {p.email && <span>✉ {p.email}</span>}
        {p.phone && <span>☎ {p.phone}</span>}
        {p.location && <span>◎ {p.location}</span>}
        {p.linkedin && <span>ℓ {p.linkedin}</span>}
        {p.github && <span>⌥ {p.github}</span>}
        {p.portfolio && <span>⌁ {p.portfolio}</span>}
      </div>
      {resume.summary && <>
        <div className="rp-section-title">Professional Summary</div>
        <div className="rp-summary">{resume.summary}</div>
      </>}
      {resume.skills.length > 0 && <>
        <div className="rp-section-title">Skills</div>
        <div className="rp-skills">{resume.skills.map((s,i)=><span key={i} className="rp-skill">{s}</span>)}</div>
      </>}
      {resume.experience.length > 0 && <>
        <div className="rp-section-title">Experience</div>
        {resume.experience.map(e => (
          <div key={e.id} className="rp-exp-item">
            <div className="rp-exp-header">
              <div><div className="rp-exp-title">{e.title}</div><div className="rp-exp-company">{e.company} {e.location && `· ${e.location}`}</div></div>
              <div className="rp-exp-date">{e.startDate} – {e.endDate}</div>
            </div>
            <div className="rp-exp-desc">{e.description}</div>
          </div>
        ))}
      </>}
      {resume.education.length > 0 && <>
        <div className="rp-section-title">Education</div>
        {resume.education.map(e=>(
          <div key={e.id} className="rp-edu">
            <strong>{e.degree}</strong> {e.school}{e.location&&`, ${e.location}`} · {e.year}
            {e.gpa && ` · GPA: ${e.gpa}`}
          </div>
        ))}
      </>}
      {resume.certifications.length > 0 && <>
        <div className="rp-section-title">Certifications</div>
        {resume.certifications.map(c=>(
          <div key={c.id} style={{ fontSize:12, marginBottom:4 }}>
            <strong>{c.name}</strong> – {c.issuer} ({c.year})
          </div>
        ))}
      </>}
      {resume.projects.length > 0 && <>
        <div className="rp-section-title">Projects</div>
        {resume.projects.map(pr=>(
          <div key={pr.id} style={{ marginBottom:10 }}>
            <div style={{ fontSize:14, fontWeight:700 }}>{pr.name} {pr.link&&<span style={{ fontSize:12, color:"#2563EB" }}>· {pr.link}</span>}</div>
            <div style={{ fontSize:12, color:"#555" }}>{pr.description}</div>
            {pr.tech && <div style={{ fontSize:11, color:"#2563EB", marginTop:3 }}>Tech: {pr.tech}</div>}
          </div>
        ))}
      </>}
      {resume.languages.length > 0 && <>
        <div className="rp-section-title">Languages</div>
        <div style={{ display:"flex", gap:16, fontSize:12 }}>
          {resume.languages.map(l=><span key={l.id}><strong>{l.name}</strong> – {l.level}</span>)}
        </div>
      </>}
    </div>
  );
};

// ============================================================
// MODULES
// ============================================================

// DASHBOARD
const Dashboard = () => {
  const { resumes, setPage, setEditingResume } = useApp();
  const stats = [
    { label: "Total Resumes", value: resumes.length, icon: "📄", color: "#2563EB", trend: 12, sub: "vs last month" },
    { label: "Avg ATS Score", value: Math.round(resumes.reduce((a,r)=>a+r.atsScore,0)/resumes.length), icon: "📊", color: "#10B981", trend: 5, sub: "keep optimizing" },
    { label: "AI Suggestions", value: 24, icon: "✦", color: "#06B6D4", trend: 8, sub: "this week" },
    { label: "Profile Views", value: 142, icon: "◉", color: "#F59E0B", trend: 23, sub: "last 30 days" },
  ];

  const activity = [
    { text: "ATS Score improved to 82", time: "2h ago", icon: "📊", color: "#10B981" },
    { text: 'AI generated summary for "Product Manager Resume"', time: "5h ago", icon: "✦", color: "#06B6D4" },
    { text: "New template applied: Executive", time: "1d ago", icon: "🎨", color: "#8B5CF6" },
    { text: "Resume exported as PDF", time: "2d ago", icon: "⤓", color: "#F59E0B" },
    { text: "Skills section updated with 3 new skills", time: "3d ago", icon: "📄", color: "#2563EB" },
  ];

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h2 className="section-title">Welcome back, Alexandra ✦</h2>
        <p className="section-sub">Here's an overview of your resume performance and activity.</p>
      </div>

      <div className="grid-3" style={{ marginBottom:24, gap:16 }}>
        <div style={{ gridColumn:"span 3", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {stats.map((s,i) => <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}><StatCard {...s}/></motion.div>)}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {/* Recent Resumes */}
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:700 }}>Recent Resumes</h3>
            <button className="btn btn-secondary btn-sm" onClick={()=>setPage("builder")}>+ New Resume</button>
          </div>
          {resumes.map((r,i) => (
            <motion.div key={r.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i<resumes.length-1?"1px solid var(--border)":"none" }}>
              <ScoreCircle score={r.atsScore} size={50} stroke={5} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
                <div style={{ fontSize:12, color:"var(--text3)" }}>Template: {r.template} · {r.lastEdited}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button className="btn-icon btn-sm" data-tip="Edit" onClick={()=>{ setEditingResume(r); setPage("builder"); }} style={{ fontSize:13 }}>✎</button>
                <button className="btn-icon btn-sm" data-tip="ATS" onClick={()=>setPage("ats")} style={{ fontSize:13 }}>📊</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Recent Activity</h3>
          {activity.map((a,i) => (
            <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
              style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 0", borderBottom: i<activity.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${a.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize:13, color:"var(--text)", marginBottom:2 }}>{a.text}</div>
                <div style={{ fontSize:12, color:"var(--text3)" }}>{a.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card ai-glow" style={{ background:"linear-gradient(135deg, rgba(37,99,235,0.08), rgba(6,182,212,0.05))", border:"1px solid rgba(6,182,212,0.2)" }}>
        <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
          <div style={{ width:44, height:44, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>✦</div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>AI Career Insights</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              {[
                { text: "Add 'Kubernetes' to your skills — 78% of Senior Engineer roles require it", action: "Add Skill" },
                { text: "Your summary lacks quantified achievements. Add metrics to boost ATS score", action: "Improve" },
                { text: "Consider adding a Projects section to showcase portfolio work", action: "Add Section" },
              ].map((tip,i) => (
                <div key={i} style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", padding:14 }}>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, marginBottom:10 }}>{tip.text}</div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setPage("ai")}>{tip.action} →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// RESUME BUILDER
const Builder = () => {
  const { editingResume, setEditingResume, resumes, setResumes, showToast } = useApp();
  const [activeSection, setActiveSection] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const resume = editingResume || INITIAL_RESUMES[0];

  const update = (path, value) => {
    const parts = path.split(".");
    const newResume = JSON.parse(JSON.stringify(resume));
    let obj = newResume;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length-1]] = value;
    setEditingResume(newResume);
  };

  const saveResume = () => {
    setResumes(prev => {
      const idx = prev.findIndex(r=>r.id===resume.id);
      if (idx>=0) { const n=[...prev]; n[idx]={...resume, atsScore: analyzeATS(resume).score, lastEdited:"Just now"}; return n; }
      return [...prev, {...resume, id:`r${Date.now()}`, atsScore: analyzeATS(resume).score, lastEdited:"Just now"}];
    });
    showToast("Resume saved successfully!", "success");
  };

  const aiImprove = async (field) => {
    setAiLoading(field);
    try {
      const prompt = field === "summary"
        ? `Improve this professional summary for ${resume.personal.jobTitle}:\n"${resume.summary}"\nMake it ATS-friendly, concise (50-70 words), and impactful. Return ONLY the improved summary text.`
        : `Generate 3 more relevant skills for a ${resume.personal.jobTitle} based on existing skills: ${resume.skills.join(", ")}. Return ONLY a comma-separated list of skills.`;
      const result = await callClaude([{ role:"user", content:prompt }], "You are an expert resume writer and career coach. Provide concise, professional, ATS-optimized content.");
      if (field === "summary") update("summary", result.trim());
      else {
        const newSkills = result.split(",").map(s=>s.trim()).filter(Boolean);
        update("skills", [...new Set([...resume.skills, ...newSkills])]);
      }
      showToast("AI improvement applied!", "success");
    } catch(e) { showToast("AI feature requires API key configuration", "error"); }
    setAiLoading(null);
  };

  const addSkill = (skill) => {
    if (skill && !resume.skills.includes(skill)) update("skills", [...resume.skills, skill]);
  };
  const removeSkill = (skill) => update("skills", resume.skills.filter(s=>s!==skill));
  const addExp = () => update("experience", [...resume.experience, { id:`e${Date.now()}`, title:"", company:"", location:"", startDate:"", endDate:"", description:"" }]);
  const removeExp = (id) => update("experience", resume.experience.filter(e=>e.id!==id));
  const updateExp = (id, field, val) => update("experience", resume.experience.map(e=>e.id===id?{...e,[field]:val}:e));
  const addEdu = () => update("education", [...resume.education, { id:`ed${Date.now()}`, degree:"", school:"", location:"", year:"", gpa:"" }]);
  const removeEdu = (id) => update("education", resume.education.filter(e=>e.id!==id));
  const updateEdu = (id, field, val) => update("education", resume.education.map(e=>e.id===id?{...e,[field]:val}:e));

  const sections = [
    { id:"personal", label:"Personal Info", icon:"◯" },
    { id:"summary", label:"Summary", icon:"📝" },
    { id:"skills", label:"Skills", icon:"⚡" },
    { id:"experience", label:"Experience", icon:"▣" },
    { id:"education", label:"Education", icon:"◻" },
    { id:"certifications", label:"Certifications", icon:"◆" },
    { id:"languages", label:"Languages", icon:"⊕" },
    { id:"projects", label:"Projects", icon:"◇" },
  ];

  const [newSkillInput, setNewSkillInput] = useState("");

  const ats = analyzeATS(resume);

  return (
    <div style={{ display:"grid", gridTemplateColumns: showPreview ? "340px 1fr 380px" : "340px 1fr", gap:0, height:"calc(100vh - 80px)", overflow:"hidden" }}>
      {/* Left: Section Nav */}
      <div style={{ background:"var(--bg2)", borderRight:"1px solid var(--border)", overflowY:"auto", padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Sections</span>
          <ScoreCircle score={ats.score} size={44} stroke={4} />
        </div>
        {sections.map(s => (
          <button key={s.id} className={`nav-item ${activeSection===s.id?"active":""}`} onClick={()=>setActiveSection(s.id)}>
            <span style={{ fontSize:16 }}>{s.icon}</span> {s.label}
          </button>
        ))}
        <div className="divider" />
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:8 }}>Template</div>
          <select value={resume.template} onChange={e=>update("template",e.target.value)} style={{ width:"100%" }}>
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <button className="btn btn-primary btn-sm" onClick={saveResume}>↓ Save</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowPreview(!showPreview)}>{showPreview?"✕ Preview":"◉ Preview"}</button>
        </div>
      </div>

      {/* Middle: Editor */}
      <div style={{ overflowY:"auto", padding:28 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.15 }}>

            {activeSection === "personal" && (
              <div>
                <h3 className="section-title">Personal Information</h3>
                <p className="section-sub">Your contact details and professional identity</p>
                <div className="grid-2" style={{ marginBottom:14 }}>
                  <div><label className="label">Full Name *</label><input value={resume.personal.fullName} onChange={e=>update("personal.fullName",e.target.value)} placeholder="Alexandra Chen" /></div>
                  <div><label className="label">Job Title *</label><input value={resume.personal.jobTitle} onChange={e=>update("personal.jobTitle",e.target.value)} placeholder="Senior Software Engineer" /></div>
                  <div><label className="label">Email *</label><input value={resume.personal.email} onChange={e=>update("personal.email",e.target.value)} placeholder="alex@email.com" /></div>
                  <div><label className="label">Phone *</label><input value={resume.personal.phone} onChange={e=>update("personal.phone",e.target.value)} placeholder="+1 (555) 000-0000" /></div>
                  <div><label className="label">Location *</label><input value={resume.personal.location} onChange={e=>update("personal.location",e.target.value)} placeholder="San Francisco, CA" /></div>
                  <div><label className="label">Portfolio URL</label><input value={resume.personal.portfolio} onChange={e=>update("personal.portfolio",e.target.value)} placeholder="yoursite.com" /></div>
                  <div><label className="label">LinkedIn</label><input value={resume.personal.linkedin} onChange={e=>update("personal.linkedin",e.target.value)} placeholder="linkedin.com/in/you" /></div>
                  <div><label className="label">GitHub</label><input value={resume.personal.github} onChange={e=>update("personal.github",e.target.value)} placeholder="github.com/you" /></div>
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <h3 className="section-title">Professional Summary</h3>
                  <button className="btn btn-secondary btn-sm" onClick={()=>aiImprove("summary")} disabled={!!aiLoading}>
                    {aiLoading==="summary"?<span className="spin" style={{ display:"inline-block" }}>◌</span>:"✦"} AI Improve
                  </button>
                </div>
                <p className="section-sub">A concise overview of your professional background (50-80 words recommended)</p>
                <textarea value={resume.summary} onChange={e=>update("summary",e.target.value)}
                  rows={6} placeholder="Results-driven professional with X+ years of experience..." style={{ resize:"vertical" }} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:"var(--text3)" }}>
                  <span>{resume.summary.split(' ').filter(Boolean).length} words</span>
                  <span style={{ color: resume.summary.split(' ').filter(Boolean).length>=30&&resume.summary.split(' ').filter(Boolean).length<=80?"var(--success)":"var(--warning)" }}>
                    {resume.summary.split(' ').filter(Boolean).length>=30&&resume.summary.split(' ').filter(Boolean).length<=80?"✓ Good length":"⚠ Aim for 50-80 words"}
                  </span>
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <h3 className="section-title">Skills</h3>
                  <button className="btn btn-secondary btn-sm" onClick={()=>aiImprove("skills")} disabled={!!aiLoading}>
                    {aiLoading==="skills"?<span className="spin" style={{ display:"inline-block" }}>◌</span>:"✦"} AI Suggest
                  </button>
                </div>
                <p className="section-sub">Add your technical and soft skills (aim for 10+ for better ATS scores)</p>
                <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                  <input value={newSkillInput} onChange={e=>setNewSkillInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter"){ addSkill(newSkillInput); setNewSkillInput(""); }}}
                    placeholder="Type a skill and press Enter" />
                  <button className="btn btn-primary" onClick={()=>{ addSkill(newSkillInput); setNewSkillInput(""); }}>Add</button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  <AnimatePresence>
                    {resume.skills.map(s => (
                      <motion.div key={s} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
                        style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.25)", borderRadius:100, padding:"6px 14px", fontSize:13 }}>
                        <span style={{ color:"var(--primary-light)" }}>{s}</span>
                        <button onClick={()=>removeSkill(s)} style={{ background:"none", border:"none", color:"var(--text3)", fontSize:11, lineHeight:1, cursor:"pointer", padding:0 }}>✕</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div style={{ marginTop:20, padding:14, background:"var(--glass)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8, color:"var(--text2)" }}>Quick Add (Popular Skills)</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {["JavaScript","Python","AWS","Docker","SQL","Git","Agile","Leadership","Communication","Data Analysis"].filter(s=>!resume.skills.includes(s)).map(s=>(
                      <button key={s} onClick={()=>addSkill(s)} className="btn btn-ghost btn-sm" style={{ border:"1px solid var(--border2)" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "experience" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <h3 className="section-title">Work Experience</h3>
                  <button className="btn btn-primary btn-sm" onClick={addExp}>+ Add Experience</button>
                </div>
                <p className="section-sub">List your work history, starting with the most recent</p>
                <AnimatePresence>
                  {resume.experience.map((exp, i) => (
                    <motion.div key={exp.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, height:0 }}
                      className="card" style={{ marginBottom:16, position:"relative" }}>
                      <button onClick={()=>removeExp(exp.id)} className="btn-icon btn-sm" style={{ position:"absolute", top:12, right:12, fontSize:11 }}>✕</button>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <div style={{ width:28, height:28, background:"var(--primary)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>{i+1}</div>
                        <span style={{ fontWeight:600, color:"var(--text2)", fontSize:14 }}>Experience #{i+1}</span>
                      </div>
                      <div className="grid-2" style={{ marginBottom:12 }}>
                        <div><label className="label">Job Title</label><input value={exp.title} onChange={e=>updateExp(exp.id,"title",e.target.value)} placeholder="Senior Engineer" /></div>
                        <div><label className="label">Company</label><input value={exp.company} onChange={e=>updateExp(exp.id,"company",e.target.value)} placeholder="Acme Corp" /></div>
                        <div><label className="label">Location</label><input value={exp.location} onChange={e=>updateExp(exp.id,"location",e.target.value)} placeholder="New York, NY" /></div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                          <div><label className="label">Start Date</label><input value={exp.startDate} onChange={e=>updateExp(exp.id,"startDate",e.target.value)} placeholder="Jan 2021" /></div>
                          <div><label className="label">End Date</label><input value={exp.endDate} onChange={e=>updateExp(exp.id,"endDate",e.target.value)} placeholder="Present" /></div>
                        </div>
                      </div>
                      <label className="label">Description & Achievements</label>
                      <textarea value={exp.description} onChange={e=>updateExp(exp.id,"description",e.target.value)}
                        rows={4} placeholder="• Led development of... (use bullet points and quantify achievements)" style={{ resize:"vertical" }} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {resume.experience.length === 0 && (
                  <div style={{ textAlign:"center", padding:40, color:"var(--text3)", border:"2px dashed var(--border)", borderRadius:"var(--radius)" }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>▣</div>
                    <div>No experience added yet.</div>
                    <button className="btn btn-primary btn-sm" style={{ marginTop:12 }} onClick={addExp}>Add Experience</button>
                  </div>
                )}
              </div>
            )}

            {activeSection === "education" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <h3 className="section-title">Education</h3>
                  <button className="btn btn-primary btn-sm" onClick={addEdu}>+ Add Education</button>
                </div>
                <p className="section-sub">Add your academic background</p>
                {resume.education.map((edu, i) => (
                  <motion.div key={edu.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="card" style={{ marginBottom:14, position:"relative" }}>
                    <button onClick={()=>removeEdu(edu.id)} className="btn-icon btn-sm" style={{ position:"absolute", top:12, right:12, fontSize:11 }}>✕</button>
                    <div className="grid-2">
                      <div><label className="label">Degree / Qualification</label><input value={edu.degree} onChange={e=>updateEdu(edu.id,"degree",e.target.value)} placeholder="B.S. Computer Science" /></div>
                      <div><label className="label">School / University</label><input value={edu.school} onChange={e=>updateEdu(edu.id,"school",e.target.value)} placeholder="MIT" /></div>
                      <div><label className="label">Location</label><input value={edu.location} onChange={e=>updateEdu(edu.id,"location",e.target.value)} placeholder="Cambridge, MA" /></div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <div><label className="label">Graduation Year</label><input value={edu.year} onChange={e=>updateEdu(edu.id,"year",e.target.value)} placeholder="2020" /></div>
                        <div><label className="label">GPA (optional)</label><input value={edu.gpa} onChange={e=>updateEdu(edu.id,"gpa",e.target.value)} placeholder="3.8" /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === "certifications" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <h3 className="section-title">Certifications</h3>
                  <button className="btn btn-primary btn-sm" onClick={()=>update("certifications",[...resume.certifications,{id:`c${Date.now()}`,name:"",issuer:"",year:""}])}>+ Add</button>
                </div>
                <p className="section-sub">Professional certifications and credentials</p>
                {resume.certifications.map((c,i) => (
                  <div key={c.id} className="card" style={{ marginBottom:12, position:"relative" }}>
                    <button onClick={()=>update("certifications",resume.certifications.filter(x=>x.id!==c.id))} className="btn-icon btn-sm" style={{ position:"absolute",top:12,right:12,fontSize:11 }}>✕</button>
                    <div className="grid-3">
                      <div><label className="label">Certification Name</label><input value={c.name} onChange={e=>update("certifications",resume.certifications.map(x=>x.id===c.id?{...x,name:e.target.value}:x))} placeholder="AWS Solutions Architect" /></div>
                      <div><label className="label">Issuer</label><input value={c.issuer} onChange={e=>update("certifications",resume.certifications.map(x=>x.id===c.id?{...x,issuer:e.target.value}:x))} placeholder="Amazon" /></div>
                      <div><label className="label">Year</label><input value={c.year} onChange={e=>update("certifications",resume.certifications.map(x=>x.id===c.id?{...x,year:e.target.value}:x))} placeholder="2024" /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "languages" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <h3 className="section-title">Languages</h3>
                  <button className="btn btn-primary btn-sm" onClick={()=>update("languages",[...resume.languages,{id:`l${Date.now()}`,name:"",level:""}])}>+ Add</button>
                </div>
                <p className="section-sub">Languages you speak and proficiency levels</p>
                {resume.languages.map(l => (
                  <div key={l.id} className="card" style={{ marginBottom:12, position:"relative" }}>
                    <button onClick={()=>update("languages",resume.languages.filter(x=>x.id!==l.id))} className="btn-icon btn-sm" style={{ position:"absolute",top:12,right:12,fontSize:11 }}>✕</button>
                    <div className="grid-2">
                      <div><label className="label">Language</label><input value={l.name} onChange={e=>update("languages",resume.languages.map(x=>x.id===l.id?{...x,name:e.target.value}:x))} placeholder="English" /></div>
                      <div><label className="label">Proficiency</label>
                        <select value={l.level} onChange={e=>update("languages",resume.languages.map(x=>x.id===l.id?{...x,level:e.target.value}:x))}>
                          <option>Native</option><option>Fluent</option><option>Advanced</option><option>Intermediate</option><option>Basic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "projects" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <h3 className="section-title">Projects</h3>
                  <button className="btn btn-primary btn-sm" onClick={()=>update("projects",[...resume.projects,{id:`p${Date.now()}`,name:"",description:"",link:"",tech:""}])}>+ Add</button>
                </div>
                <p className="section-sub">Notable projects and portfolio work</p>
                {resume.projects.map(pr => (
                  <div key={pr.id} className="card" style={{ marginBottom:14, position:"relative" }}>
                    <button onClick={()=>update("projects",resume.projects.filter(x=>x.id!==pr.id))} className="btn-icon btn-sm" style={{ position:"absolute",top:12,right:12,fontSize:11 }}>✕</button>
                    <div className="grid-2" style={{ marginBottom:10 }}>
                      <div><label className="label">Project Name</label><input value={pr.name} onChange={e=>update("projects",resume.projects.map(x=>x.id===pr.id?{...x,name:e.target.value}:x))} placeholder="My Awesome Project" /></div>
                      <div><label className="label">Technologies</label><input value={pr.tech} onChange={e=>update("projects",resume.projects.map(x=>x.id===pr.id?{...x,tech:e.target.value}:x))} placeholder="React, Node.js, AWS" /></div>
                      <div style={{ gridColumn:"span 2" }}><label className="label">Link</label><input value={pr.link} onChange={e=>update("projects",resume.projects.map(x=>x.id===pr.id?{...x,link:e.target.value}:x))} placeholder="github.com/you/project" /></div>
                    </div>
                    <label className="label">Description</label>
                    <textarea value={pr.description} onChange={e=>update("projects",resume.projects.map(x=>x.id===pr.id?{...x,description:e.target.value}:x))} rows={3} placeholder="What does this project do? What impact did it have?" style={{ resize:"vertical" }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ width:0, opacity:0 }} animate={{ width:380, opacity:1 }} exit={{ width:0, opacity:0 }}
            style={{ borderLeft:"1px solid var(--border)", overflowY:"auto", background:"#e8edf5" }}>
            <div style={{ padding:"12px 16px", background:"var(--bg2)", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Live Preview</span>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>⎙ Print</button>
                <button className="btn btn-primary btn-sm">⤓ PDF</button>
              </div>
            </div>
            <div style={{ transform:"scale(0.72)", transformOrigin:"top center", width:"139%" }}>
              <ResumePreview resume={resume} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ATS ANALYZER
const ATSAnalyzer = () => {
  const { editingResume } = useApp();
  const [jobDescription, setJobDescription] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const resume = editingResume || INITIAL_RESUMES[0];
  const ats = analyzeATS(resume, jobDescription);

  const runAnalysis = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setAnalyzed(true);
    setLoading(false);
  };

  const getAiRecommendations = async () => {
    setAiLoading(true);
    try {
      const prompt = `Analyze this resume for ATS compatibility and provide 5 specific, actionable recommendations:
Name: ${resume.personal.fullName}, Title: ${resume.personal.jobTitle}
Skills: ${resume.skills.join(", ")}
ATS Score: ${ats.score}/100
${jobDescription ? `Job Description: ${jobDescription.substring(0,300)}` : ""}
Return ONLY a JSON array of objects with keys: "title" (short action), "detail" (specific advice), "impact" (high/medium/low). No markdown.`;
      const result = await callClaude([{role:"user",content:prompt}], "You are an expert ATS and resume optimization specialist. Return only valid JSON.");
      const clean = result.replace(/```json|```/g,"").trim();
      setAiSuggestions(JSON.parse(clean));
    } catch(e) { setAiSuggestions([{title:"API Key Required",detail:"Connect your Anthropic API key to get AI-powered recommendations.",impact:"high"},{title:"Add More Keywords",detail:"Include industry-specific keywords from the job description.",impact:"high"},{title:"Quantify Achievements",detail:"Add specific metrics and numbers to your experience bullets.",impact:"high"}]); }
    setAiLoading(false);
  };

  const scoreColor = ats.score >= 80 ? "#10B981" : ats.score >= 60 ? "#F59E0B" : "#EF4444";
  const scoreLabel = ats.score >= 80 ? "Excellent" : ats.score >= 60 ? "Good" : "Needs Work";

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>
      <h2 className="section-title">ATS Compatibility Analyzer</h2>
      <p className="section-sub">Analyze how well your resume performs against Applicant Tracking Systems</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <div className="card">
          <label className="label">Job Description (Optional)</label>
          <textarea value={jobDescription} onChange={e=>setJobDescription(e.target.value)} rows={5}
            placeholder="Paste the job description here to get targeted keyword matching and skill gap analysis..." style={{ resize:"vertical", marginBottom:12 }} />
          <button className="btn btn-primary" style={{ width:"100%" }} onClick={runAnalysis} disabled={loading}>
            {loading ? <><span className="spin" style={{ display:"inline-block" }}>◌</span> Analyzing...</> : "📊 Run ATS Analysis"}
          </button>
        </div>

        <div className="card" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, rgba(37,99,235,0.05), rgba(6,182,212,0.05))" }}>
          <ScoreCircle score={ats.score} size={120} stroke={10} />
          <div style={{ marginTop:16, textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:scoreColor, fontFamily:"Syne" }}>{scoreLabel}</div>
            <div style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>ATS Compatibility Score</div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <span className={`tag ${ats.score>=80?"tag-success":ats.score>=60?"tag-warning":"tag-danger"}`}>{ats.score>=80?"✓ ATS Ready":ats.score>=60?"⚠ Needs Improvement":"✕ Not ATS-Ready"}</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Score Breakdown</h3>
        {ats.breakdown.map((b,i) => (
          <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}>
            <ProgressBar value={b.score} max={b.max} color={b.color} label={b.label} />
          </motion.div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {/* Issues */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Issues Found</h3>
          {ats.issues.length === 0
            ? <div style={{ color:"var(--success)", fontSize:14 }}>✓ No critical issues found!</div>
            : ats.issues.map((issue,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                <span className={`tag tag-${issue.type}`} style={{ marginTop:1 }}>{issue.type==="danger"?"✕":"⚠"}</span>
                <span style={{ fontSize:13, color:"var(--text2)" }}>{issue.text}</span>
              </div>
            ))
          }
        </div>

        {/* Suggestions */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Quick Wins</h3>
          {ats.suggestions.length === 0
            ? <div style={{ color:"var(--text3)", fontSize:14 }}>Run analysis to get suggestions</div>
            : ats.suggestions.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                <span className="tag tag-primary">→</span>
                <span style={{ fontSize:13, color:"var(--text2)" }}>{s}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card ai-glow" style={{ background:"linear-gradient(135deg, rgba(6,182,212,0.05), rgba(37,99,235,0.05))", border:"1px solid rgba(6,182,212,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:16, fontWeight:700 }}>✦ AI-Powered Recommendations</h3>
          <button className="btn btn-secondary btn-sm" onClick={getAiRecommendations} disabled={aiLoading}>
            {aiLoading?<><span className="spin" style={{ display:"inline-block" }}>◌</span> Analyzing...</>:"✦ Get AI Analysis"}
          </button>
        </div>
        {aiSuggestions.length > 0
          ? <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {aiSuggestions.map((s,i) => (
                <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                  className="card" style={{ padding:14, background:"var(--glass2)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{s.title}</span>
                    <span className={`tag tag-${s.impact==="high"?"danger":s.impact==="medium"?"warning":"success"}`}>{s.impact}</span>
                  </div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>{s.detail}</div>
                </motion.div>
              ))}
            </div>
          : <div style={{ textAlign:"center", padding:30, color:"var(--text3)" }}>
              <div style={{ fontSize:40, marginBottom:8 }}>✦</div>
              <div>Click "Get AI Analysis" for personalized recommendations</div>
            </div>
        }
      </div>
    </div>
  );
};

// TEMPLATES PAGE
const Templates = () => {
  const { editingResume, setEditingResume, showToast } = useApp();
  const [selected, setSelected] = useState(editingResume?.template || "modern");
  const applyTemplate = (id) => {
    setSelected(id);
    if (editingResume) setEditingResume({...editingResume, template:id});
    showToast(`Template "${TEMPLATES.find(t=>t.id===id)?.name}" applied!`, "success");
  };
  const resume = editingResume || INITIAL_RESUMES[0];
  return (
    <div>
      <h2 className="section-title">Resume Templates</h2>
      <p className="section-sub">Choose from 10 ATS-friendly professional templates</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:28 }}>
        {TEMPLATES.map((t,i) => (
          <motion.div key={t.id} initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
            onClick={()=>applyTemplate(t.id)} whileHover={{ y:-4 }}
            style={{ cursor:"pointer", borderRadius:"var(--radius)", overflow:"hidden",
              border:`2px solid ${selected===t.id?t.color:"var(--border)"}`,
              transition:"all 0.2s", position:"relative" }}>
            {selected===t.id && <div style={{ position:"absolute", top:8, right:8, background:t.color, borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#fff", zIndex:2 }}>✓</div>}
            <div style={{ height:140, background:`linear-gradient(135deg, ${t.color}15, ${t.color}08)`, display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid var(--border)" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:40, height:5, background:t.color, borderRadius:3, margin:"0 auto 6px" }} />
                <div style={{ width:60, height:3, background:`${t.color}60`, borderRadius:3, margin:"0 auto 4px" }} />
                <div style={{ width:50, height:3, background:`${t.color}40`, borderRadius:3, margin:"0 auto 10px" }} />
                <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                  {[35,25,30].map((w,j)=><div key={j} style={{ width:w, height:2, background:`${t.color}30`, borderRadius:3 }}/>)}
                </div>
              </div>
            </div>
            <div style={{ padding:"10px 12px", background:"var(--surface)" }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{t.name}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>{t.tag}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card">
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Preview: {TEMPLATES.find(t=>t.id===selected)?.name}</h3>
          <div style={{ background:"#e8edf5", borderRadius:"var(--radius-sm)", overflow:"hidden" }}>
            <div style={{ transform:"scale(0.55)", transformOrigin:"top center", width:"182%" }}>
              <ResumePreview resume={{...resume, template:selected}} />
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Template Features</h3>
            {[
              { icon:"✓", label:"ATS Compatible Formatting" },
              { icon:"✓", label:"Clean, Parseable Layout" },
              { icon:"✓", label:"Machine-Readable Fonts" },
              { icon:"✓", label:"Standard Section Headers" },
              { icon:"✓", label:"One-Column Structure" },
              { icon:"✓", label:"Print-Optimized" },
            ].map((f,i)=>(
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ color:"var(--success)", fontSize:14, fontWeight:700 }}>{f.icon}</span>
                <span style={{ fontSize:14, color:"var(--text2)" }}>{f.label}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width:"100%" }} onClick={()=>applyTemplate(selected)}>
            Apply {TEMPLATES.find(t=>t.id===selected)?.name} Template
          </button>
        </div>
      </div>
    </div>
  );
};

// AI ASSISTANT CHAT
const AIAssistant = () => {
  const { editingResume } = useApp();
  const [messages, setMessages] = useState([
    { role:"ai", content:"Hello! I'm your AI Career Assistant. I can help you improve your resume, write professional summaries, suggest skills, prepare for interviews, and provide career guidance. What would you like help with today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const resume = editingResume || INITIAL_RESUMES[0];

  const quickPrompts = [
    { label:"Improve Summary", prompt:`Improve my professional summary as a ${resume.personal.jobTitle}. Current: "${resume.summary}"` },
    { label:"Generate Skills", prompt:`Suggest 10 more relevant skills for a ${resume.personal.jobTitle} with expertise in ${resume.skills.slice(0,4).join(", ")}` },
    { label:"Rewrite Experience", prompt:`Help me write stronger bullet points for my experience as ${resume.experience[0]?.title || "Software Engineer"} at ${resume.experience[0]?.company || "a tech company"}` },
    { label:"Interview Prep", prompt:`Generate 10 interview questions and ideal answers for a ${resume.personal.jobTitle} role based on my background` },
    { label:"Career Advice", prompt:"What career paths can I pursue based on my skills in " + resume.skills.slice(0,4).join(", ") },
    { label:"Cover Letter", prompt:`Write a professional cover letter for a ${resume.personal.jobTitle} position based on my resume` },
  ];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = { role:"user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const historyMessages = [...messages, userMsg].slice(-8).map(m => ({ role: m.role==="ai"?"assistant":"user", content:m.content }));
    try {
      const result = await callClaude(historyMessages,
        `You are an expert career coach and resume writing specialist. The user's resume info:
Name: ${resume.personal.fullName}, Title: ${resume.personal.jobTitle}
Skills: ${resume.skills.join(", ")}
Summary: ${resume.summary}
Provide actionable, specific, professional career and resume advice. Be concise but thorough.`);
      setMessages(prev => [...prev, { role:"ai", content:result }]);
    } catch(e) {
      setMessages(prev => [...prev, { role:"ai", content:"I need an Anthropic API key to provide AI responses. In a production deployment, configure your API key in the backend environment variables. I can help you with career guidance, resume tips, and job search strategies once connected!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:0, height:"calc(100vh - 80px)", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ background:"var(--bg2)", borderRight:"1px solid var(--border)", padding:16, overflowY:"auto" }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ width:44, height:44, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:10 }}>✦</div>
          <div style={{ fontSize:15, fontWeight:700 }}>AI Career Assistant</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>Powered by Claude</div>
        </div>
        <div className="divider" />
        <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Quick Prompts</div>
        {quickPrompts.map((p,i) => (
          <button key={i} className="nav-item" onClick={()=>send(p.prompt)} style={{ fontSize:13, marginBottom:4 }}>
            <span style={{ fontSize:14 }}>→</span> {p.label}
          </button>
        ))}
        <div className="divider" />
        <div style={{ fontSize:12, color:"var(--text3)", lineHeight:1.6 }}>
          💡 Tip: Ask me to review specific sections of your resume for targeted feedback.
        </div>
      </div>

      {/* Chat */}
      <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto", padding:24, display:"flex", flexDirection:"column", gap:16 }}>
          {messages.map((m,i) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              style={{ display:"flex", flexDirection:"column", alignItems: m.role==="user"?"flex-end":"flex-start" }}>
              {m.role === "ai" && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:28, height:28, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✦</div>
                  <span style={{ fontSize:12, color:"var(--text3)", fontWeight:500 }}>AI Assistant</span>
                </div>
              )}
              <div className={`chat-bubble ${m.role==="user"?"user":"ai"}`} style={{ whiteSpace:"pre-wrap" }}>{m.content}</div>
            </motion.div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:28, height:28, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>✦</div>
              <div className="chat-bubble ai" style={{ display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(j => <motion.div key={j} style={{ width:7, height:7, borderRadius:"50%", background:"var(--text3)" }} animate={{ y:[0,-5,0] }} transition={{ repeat:Infinity, duration:0.9, delay:j*0.15 }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding:16, borderTop:"1px solid var(--border)", background:"var(--bg2)" }}>
          <div style={{ display:"flex", gap:10 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder="Ask me anything about your resume or career..." style={{ flex:1 }} />
            <button className="btn btn-primary" onClick={()=>send()} disabled={loading||!input.trim()}>➤ Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// RESUMES LIST
const ResumesList = () => {
  const { resumes, setResumes, setPage, setEditingResume, showToast } = useApp();
  const [view, setView] = useState("grid");

  const deleteResume = (id) => {
    setResumes(prev => prev.filter(r=>r.id!==id));
    showToast("Resume deleted", "success");
  };

  const duplicateResume = (r) => {
    const dup = { ...r, id:`r${Date.now()}`, name:`${r.name} (Copy)`, lastEdited:"Just now" };
    setResumes(prev => [...prev, dup]);
    showToast("Resume duplicated!", "success");
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h2 className="section-title">My Resumes</h2>
          <p style={{ color:"var(--text2)", fontSize:14 }}>{resumes.length} resume{resumes.length!==1?"s":""} · All your work in one place</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className={`btn ${view==="grid"?"btn-primary":"btn-secondary"} btn-sm`} onClick={()=>setView("grid")}>⊞ Grid</button>
          <button className={`btn ${view==="list"?"btn-primary":"btn-secondary"} btn-sm`} onClick={()=>setView("list")}>≡ List</button>
          <button className="btn btn-primary" onClick={()=>{ setEditingResume({...DEFAULT_RESUME, id:`r${Date.now()}`, name:"New Resume"}); setPage("builder"); }}>+ New Resume</button>
        </div>
      </div>

      {view === "grid"
        ? <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {resumes.map((r,i) => (
              <motion.div key={r.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className="card" whileHover={{ y:-4 }} style={{ position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:TEMPLATES.find(t=>t.id===r.template)?.color||"var(--primary)" }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{r.name}</div>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>{r.lastEdited} · {TEMPLATES.find(t=>t.id===r.template)?.name||"Modern"}</div>
                  </div>
                  <ScoreCircle score={r.atsScore} size={54} stroke={5} />
                </div>
                <div style={{ background:"#e8edf5", borderRadius:"var(--radius-sm)", overflow:"hidden", marginBottom:14, height:140 }}>
                  <div style={{ transform:"scale(0.38)", transformOrigin:"top center", width:"263%", pointerEvents:"none" }}>
                    <ResumePreview resume={r} />
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex:1 }} onClick={()=>{ setEditingResume(r); setPage("builder"); }}>✎ Edit</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>duplicateResume(r)}>⧉</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>deleteResume(r.id)}>⌫</button>
                </div>
              </motion.div>
            ))}
          </div>
        : <div className="card" style={{ padding:0, overflow:"hidden" }}>
            {resumes.map((r,i) => (
              <motion.div key={r.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
                style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderBottom: i<resumes.length-1?"1px solid var(--border)":"none" }}>
                <div style={{ width:4, height:48, background:TEMPLATES.find(t=>t.id===r.template)?.color||"var(--primary)", borderRadius:4 }} />
                <ScoreCircle score={r.atsScore} size={50} stroke={5} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, marginBottom:2 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:"var(--text3)" }}>{r.lastEdited} · {TEMPLATES.find(t=>t.id===r.template)?.name} · {r.status}</div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn btn-primary btn-sm" onClick={()=>{ setEditingResume(r); setPage("builder"); }}>✎ Edit</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>duplicateResume(r)}>⧉ Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>deleteResume(r.id)}>⌫</button>
                </div>
              </motion.div>
            ))}
          </div>
      }
    </div>
  );
};

// ADMIN PANEL
const AdminPanel = () => {
  const { resumes } = useApp();
  const users = [
    { name:"Alexandra Chen", email:"alex@email.com", plan:"Pro", resumes:3, score:82, joined:"Jan 2024", status:"active" },
    { name:"Marcus Johnson", email:"marcus@email.com", plan:"Free", resumes:1, score:65, joined:"Feb 2024", status:"active" },
    { name:"Sarah Kim", email:"sarah@email.com", plan:"Enterprise", resumes:8, score:91, joined:"Dec 2023", status:"active" },
    { name:"David Torres", email:"david@email.com", plan:"Pro", resumes:4, score:78, joined:"Mar 2024", status:"inactive" },
    { name:"Emma Wilson", email:"emma@email.com", plan:"Free", resumes:2, score:70, joined:"Apr 2024", status:"active" },
  ];
  const chartData = [
    { month:"Jan", users:120, resumes:340 },
    { month:"Feb", users:180, resumes:480 },
    { month:"Mar", users:240, resumes:650 },
    { month:"Apr", users:310, resumes:890 },
    { month:"May", users:400, resumes:1100 },
    { month:"Jun", users:520, resumes:1380 },
  ];
  const maxUsers = Math.max(...chartData.map(d=>d.users));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 className="section-title">Admin Panel ♛</h2>
          <p className="section-sub">Platform analytics and user management</p>
        </div>
        <span className="tag tag-danger">Admin Access</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Users", value:"5,284", icon:"◯", color:"#2563EB", trend:12 },
          { label:"Active Resumes", value:"12,410", icon:"📄", color:"#10B981", trend:8 },
          { label:"AI Requests", value:"48,392", icon:"✦", color:"#06B6D4", trend:24 },
          { label:"Revenue MRR", value:"$18,240", icon:"★", color:"#F59E0B", trend:15 },
        ].map((s,i) => <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}><StatCard {...s}/></motion.div>)}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Growth Chart */}
        <div className="card">
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Growth Trends</h3>
          <div style={{ display:"flex", gap:16, alignItems:"flex-end", height:140 }}>
            {chartData.map((d,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <motion.div initial={{ height:0 }} animate={{ height:`${(d.users/maxUsers)*120}px` }} transition={{ delay:i*0.08, duration:0.5 }}
                  style={{ width:"100%", background:"linear-gradient(180deg, var(--primary), var(--accent))", borderRadius:"4px 4px 0 0", minHeight:4 }} />
                <span style={{ fontSize:10, color:"var(--text3)" }}>{d.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:"var(--primary)" }} /> Users
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="card">
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Plan Distribution</h3>
          {[
            { plan:"Free", count:3200, pct:60, color:"var(--text3)" },
            { plan:"Pro", count:1800, pct:35, color:"var(--primary)" },
            { plan:"Enterprise", count:284, pct:5, color:"var(--accent)" },
          ].map((p,i) => (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span style={{ color:"var(--text2)" }}>{p.plan}</span>
                <span style={{ fontWeight:600 }}>{p.count.toLocaleString()} ({p.pct}%)</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" style={{ background:p.color }} initial={{ width:0 }} animate={{ width:`${p.pct}%` }} transition={{ delay:i*0.1, duration:0.8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
          <h3 style={{ fontSize:15, fontWeight:700 }}>Users</h3>
          <button className="btn btn-secondary btn-sm">Export CSV</button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg2)" }}>
                {["Name","Email","Plan","Resumes","Avg ATS","Joined","Status"].map(h => (
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u,i) => (
                <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                  <td style={{ padding:"12px 16px", fontSize:14, fontWeight:500 }}>{u.name}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"var(--text2)" }}>{u.email}</td>
                  <td style={{ padding:"12px 16px" }}><span className={`tag ${u.plan==="Enterprise"?"tag-accent":u.plan==="Pro"?"tag-primary":"tag-warning"}`}>{u.plan}</span></td>
                  <td style={{ padding:"12px 16px", fontSize:14, color:"var(--text2)" }}>{u.resumes}</td>
                  <td style={{ padding:"12px 16px" }}><span style={{ fontSize:14, fontWeight:600, color: u.score>=80?"var(--success)":u.score>=60?"var(--warning)":"var(--danger)" }}>{u.score}</span></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"var(--text2)" }}>{u.joined}</td>
                  <td style={{ padding:"12px 16px" }}><span className={`tag ${u.status==="active"?"tag-success":"tag-danger"}`}>{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// SETTINGS
const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div style={{ maxWidth:640 }}>
      <h2 className="section-title">Settings</h2>
      <p className="section-sub">Manage your account and preferences</p>

      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Profile Information</h3>
        <div className="grid-2" style={{ marginBottom:14 }}>
          <div><label className="label">First Name</label><input defaultValue="Alexandra" /></div>
          <div><label className="label">Last Name</label><input defaultValue="Chen" /></div>
          <div><label className="label">Email</label><input defaultValue="alex.chen@email.com" /></div>
          <div><label className="label">Phone</label><input defaultValue="+1 (555) 234-5678" /></div>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Preferences</h3>
        {[
          { label:"ATS Notifications", sub:"Get alerts when your score changes", value:notifications, set:setNotifications },
          { label:"Auto-Save", sub:"Automatically save resume changes", value:autoSave, set:setAutoSave },
          { label:"Email Updates", sub:"Weekly career tips and resume insights", value:emailUpdates, set:setEmailUpdates },
        ].map((pref,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
            <div>
              <div style={{ fontWeight:500, fontSize:14 }}>{pref.label}</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{pref.sub}</div>
            </div>
            <label className="toggle"><input type="checkbox" checked={pref.value} onChange={e=>pref.set(e.target.checked)} /><span className="toggle-slider" /></label>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Subscription</h3>
        <p style={{ fontSize:13, color:"var(--text2)", marginBottom:16 }}>Current plan and billing management</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", background:"linear-gradient(135deg, rgba(37,99,235,0.1), rgba(6,182,212,0.05))", borderRadius:"var(--radius-sm)", border:"1px solid rgba(37,99,235,0.2)", marginBottom:12 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:16 }}>Pro Plan ★</div>
            <div style={{ fontSize:13, color:"var(--text2)" }}>$12/month · Renews Aug 6, 2026</div>
          </div>
          <span className="tag tag-primary">Active</span>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-secondary btn-sm">Manage Billing</button>
          <button className="btn btn-secondary btn-sm">Upgrade to Enterprise</button>
        </div>
      </div>

      <div className="card" style={{ border:"1px solid rgba(239,68,68,0.2)" }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:4, color:"var(--danger)" }}>Danger Zone</h3>
        <p style={{ fontSize:13, color:"var(--text2)", marginBottom:12 }}>These actions are irreversible</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-danger btn-sm">Delete All Resumes</button>
          <button className="btn btn-danger btn-sm">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

// AUTH PAGES
const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email:"demo@atsbuilder.pro", password:"demo1234", name:"" });

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onLogin();
  };

  return (
    <div className="animated-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      {/* Background orbs */}
      <div style={{ position:"absolute", width:600, height:600, background:"radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", top:-200, right:-200, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:400, height:400, background:"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", bottom:-100, left:-100, pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:44, height:44, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>✦</div>
            <span style={{ fontSize:22, fontWeight:800, fontFamily:"Syne" }}>ATS CV Builder <span className="gradient-text">Pro</span></span>
          </div>
          <p style={{ color:"var(--text2)", fontSize:14 }}>Build resumes that get past ATS and land interviews</p>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="card" style={{ background:"rgba(26,34,54,0.9)", backdropFilter:"blur(20px)" }}>
          <div style={{ display:"flex", gap:4, background:"var(--bg)", borderRadius:"var(--radius-sm)", padding:4, marginBottom:24 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"8px", borderRadius:6, border:"none", background: mode===m?"var(--primary)":"transparent", color: mode===m?"#fff":"var(--text2)", fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <div style={{ marginBottom:14 }}>
              <label className="label">Full Name</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alexandra Chen" />
            </div>
          )}
          <div style={{ marginBottom:14 }}>
            <label className="label">Email</label>
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com" type="email" />
          </div>
          <div style={{ marginBottom:20 }}>
            <label className="label">{mode==="login"?"Password":"Create Password"}</label>
            <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" type="password" />
            {mode==="login" && <div style={{ textAlign:"right", marginTop:6 }}><button style={{ background:"none", border:"none", color:"var(--accent)", fontSize:12, cursor:"pointer" }}>Forgot password?</button></div>}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width:"100%", justifyContent:"center" }} onClick={submit} disabled={loading}>
            {loading ? <><span className="spin" style={{ display:"inline-block" }}>◌</span> {mode==="login"?"Signing in...":"Creating account..."}</> : (mode==="login"?"Sign In →":"Create Account →")}
          </button>

          <div style={{ position:"relative", textAlign:"center", margin:"20px 0" }}>
            <div style={{ height:1, background:"var(--border)", position:"absolute", width:"100%", top:"50%" }} />
            <span style={{ background:"rgba(26,34,54,0.9)", padding:"0 12px", position:"relative", fontSize:12, color:"var(--text3)" }}>or continue with</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {["Google","GitHub"].map(p => (
              <button key={p} className="btn btn-secondary" style={{ justifyContent:"center" }} onClick={submit}>{p}</button>
            ))}
          </div>

          <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:"var(--text3)" }}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <button style={{ background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontSize:13 }} onClick={()=>setMode(mode==="login"?"register":"login")}>
              {mode==="login"?"Sign up":"Sign in"}
            </button>
          </p>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          style={{ textAlign:"center", marginTop:20, display:"flex", justifyContent:"center", gap:20, fontSize:13, color:"var(--text3)" }}>
          <span>✓ ATS Optimized</span><span>✓ AI-Powered</span><span>✓ 10 Templates</span>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resumes, setResumes] = useState(INITIAL_RESUMES);
  const [editingResume, setEditingResume] = useState(INITIAL_RESUMES[0]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type="success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:"⊞" },
    { id:"resumes", label:"My Resumes", icon:"📄" },
    { id:"builder", label:"Resume Builder", icon:"✎" },
    { id:"ats", label:"ATS Analyzer", icon:"📊" },
    { id:"templates", label:"Templates", icon:"🎨" },
    { id:"ai", label:"AI Assistant", icon:"✦" },
    { id:"admin", label:"Admin Panel", icon:"♛" },
    { id:"settings", label:"Settings", icon:"⚙" },
  ];

  const pageComponents = {
    dashboard: <Dashboard />, resumes: <ResumesList />, builder: <Builder />,
    ats: <ATSAnalyzer />, templates: <Templates />, ai: <AIAssistant />,
    admin: <AdminPanel />, settings: <Settings />,
  };

  const fullWidthPages = ["builder","ai"];
  const isFullWidth = fullWidthPages.includes(page);

  if (!authed) return (
    <>
      <GlobalStyles />
      <AuthPage onLogin={()=>setAuthed(true)} />
    </>
  );

  return (
    <AppContext.Provider value={{ resumes, setResumes, editingResume, setEditingResume, setPage, showToast }}>
      <GlobalStyles />
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ width:0, opacity:0 }} animate={{ width:220, opacity:1 }} exit={{ width:0, opacity:0 }}
              style={{ width:220, background:"var(--bg2)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", flexShrink:0, position:"relative", zIndex:10, overflow:"hidden" }}>
              {/* Logo */}
              <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✦</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, fontFamily:"Syne", lineHeight:1.2 }}>ATS CV Builder</div>
                    <div style={{ fontSize:10, color:"var(--accent)", fontWeight:600 }}>PRO</div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
                {navItems.slice(0,-2).map(item => (
                  <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                    <span className="nav-icon">{item.icon}</span> {item.label}
                  </button>
                ))}
                <div className="divider" />
                {navItems.slice(-2).map(item => (
                  <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                    <span className="nav-icon">{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>

              {/* User */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:32, height:32, background:"linear-gradient(135deg, var(--primary), var(--accent))", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>A</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Alexandra Chen</div>
                    <div style={{ fontSize:11, color:"var(--text3)" }}>Pro Plan</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ width:"100%", justifyContent:"center", color:"var(--text3)" }} onClick={()=>setAuthed(false)}>→ Sign Out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Topbar */}
          <div style={{ height:56, background:"var(--bg2)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", padding:"0 20px", gap:14, flexShrink:0 }}>
            <button className="btn-icon" onClick={()=>setSidebarOpen(!sidebarOpen)}>≡</button>
            <div style={{ flex:1 }}>
              <span style={{ fontWeight:700, fontFamily:"Syne", fontSize:16 }}>{navItems.find(n=>n.id===page)?.label}</span>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {page === "builder" && <button className="btn btn-secondary btn-sm" onClick={()=>{ setResumes(prev=>{ const idx=prev.findIndex(r=>r.id===editingResume?.id); if(idx>=0){const n=[...prev];n[idx]={...editingResume,atsScore:analyzeATS(editingResume).score,lastEdited:"Just now"};return n;} return prev; }); showToast("Auto-saved!","success"); }}>↓ Save</button>}
              {page === "builder" && <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>⎙ Print</button>}
              <button className="btn-icon" style={{ position:"relative" }}><span>🔔</span><span style={{ position:"absolute", top:4, right:4, width:7, height:7, background:"var(--danger)", borderRadius:"50%" }}/></button>
              <div style={{ width:32, height:32, background:"linear-gradient(135deg,var(--primary),var(--accent))", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#fff", fontSize:13, cursor:"pointer" }}>A</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY: isFullWidth?"hidden":"auto", padding: isFullWidth?0:28 }}>
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.15 }}
                style={{ height:"100%" }}>
                {pageComponents[page]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={()=>setToast(null)} />}
      </AnimatePresence>
    </AppContext.Provider>
  );
}
