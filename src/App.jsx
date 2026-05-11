import { useState, useEffect, useRef, useMemo } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f1117",
  surface: "#181c27",
  card: "#1e2335",
  border: "#2a3050",
  accent: "#4f9cf9",
  accentDim: "#1e3a6e",
  green: "#3ecf8e",
  amber: "#f5a623",
  red: "#f06a6a",
  purple: "#a78bfa",
  teal: "#2dd4bf",
  text: "#e8eaf0",
  muted: "#7a849e",
  faint: "#3a4060",
};

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const s = {
  app: { background: C.bg, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif", color: C.text, display: "flex", flexDirection: "column" },
  header: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "12px 0" },
  logo: { fontSize: 18, fontWeight: 700, color: C.accent, letterSpacing: 1, whiteSpace: "nowrap", fontFamily: "sans-serif" },
  badge: { fontSize: 10, background: C.red, color: "#fff", padding: "2px 7px", borderRadius: 4, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 1 },
  searchWrap: { flex: 1, minWidth: 180 },
  search: { width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 14px", color: C.text, fontSize: 14, fontFamily: "sans-serif", boxSizing: "border-box" },
  tabBar: { display: "flex", gap: 4, background: C.surface, padding: "8px 20px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" },
  tab: (active) => ({ padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s", background: active ? C.accentDim : "transparent", color: active ? C.accent : C.muted }),
  main: { maxWidth: 1100, margin: "0 auto", padding: "24px 20px", flex: 1 },
  sectionTitle: { fontSize: 26, fontWeight: 700, color: C.accent, marginBottom: 6, fontFamily: "sans-serif" },
  sectionSub: { fontSize: 14, color: C.muted, marginBottom: 24, fontFamily: "sans-serif" },
  topicGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, marginBottom: 24 },
  topicCard: (active) => ({ background: active ? C.accentDim : C.card, border: `1px solid ${active ? C.accent : C.border}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all .2s" }),
  topicNum: { fontSize: 11, fontFamily: "sans-serif", color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  topicTitle: { fontSize: 15, fontWeight: 700, fontFamily: "sans-serif", color: C.text, marginBottom: 6 },
  topicSnip: { fontSize: 13, color: C.muted, lineHeight: 1.5 },
  contentBox: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 20 },
  contentTitle: { fontSize: 22, fontWeight: 700, color: C.accent, marginBottom: 4, fontFamily: "sans-serif" },
  defBox: { background: "#1a2840", border: `1px solid ${C.accent}`, borderLeft: `4px solid ${C.accent}`, borderRadius: 8, padding: "12px 18px", marginBottom: 18 },
  defText: { fontSize: 15, lineHeight: 1.7, color: C.text },
  subhead: { fontSize: 16, fontWeight: 700, color: C.teal, marginTop: 22, marginBottom: 10, fontFamily: "sans-serif", borderBottom: `1px solid ${C.faint}`, paddingBottom: 6 },
  subhead2: { fontSize: 14, fontWeight: 700, color: C.amber, marginTop: 16, marginBottom: 8, fontFamily: "sans-serif" },
  ul: { paddingLeft: 20, margin: "0 0 14px 0" },
  li: { marginBottom: 8, lineHeight: 1.75, fontSize: 14, color: C.text },
  ol: { paddingLeft: 20, margin: "0 0 14px 0" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 18, fontSize: 13 },
  th: { background: C.accentDim, color: C.accent, padding: "9px 14px", textAlign: "left", fontFamily: "sans-serif", fontWeight: 700, border: `1px solid ${C.border}` },
  td: { padding: "8px 14px", border: `1px solid ${C.border}`, lineHeight: 1.6, verticalAlign: "top", color: C.text },
  trEven: { background: C.surface },
  trOdd: { background: C.card },
  bdBox: { background: "#1c2820", border: `1px solid ${C.green}`, borderLeft: `4px solid ${C.green}`, borderRadius: 8, padding: "12px 18px", marginTop: 18, marginBottom: 4 },
  bdLabel: { fontSize: 11, color: C.green, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" },
  diagBox: { background: "#1e1a28", border: `1px dashed ${C.purple}`, borderRadius: 8, padding: "12px 18px", marginTop: 14, marginBottom: 4 },
  diagLabel: { fontSize: 11, color: C.purple, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" },
  codeBlock: { background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px", fontFamily: "'Courier New', monospace", fontSize: 13, color: "#7dd3fc", overflowX: "auto" },
  pill: (color) => ({ display: "inline-block", background: color + "22", color: color, border: `1px solid ${color}55`, borderRadius: 4, padding: "1px 8px", fontSize: 12, fontFamily: "sans-serif" }),
  answerCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20, overflow: "hidden" },
  answerHeader: (open) => ({ background: open ? C.accentDim : C.surface, padding: "16px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: open ? `1px solid ${C.accent}` : "none" }),
  answerTag: (color) => ({ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }),
  answerQ: { fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "sans-serif", lineHeight: 1.4 },
  answerBody: { padding: "22px 28px" },
  chevron: (open) => ({ fontSize: 18, color: C.accent, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }),
  flashGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 },
  flashCard: (flipped) => ({ height: 220, perspective: 800, cursor: "pointer" }),
  flashInner: (flipped) => ({ position: "relative", width: "100%", height: "100%", transition: "transform .5s", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }),
  flashFace: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", borderRadius: 12, padding: "18px 22px", boxSizing: "border-box", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "center" },
  flashFront: { background: C.card, border: `1px solid ${C.border}` },
  flashBack: { background: "#1a2840", border: `1px solid ${C.accent}`, transform: "rotateY(180deg)" },
  flashNum: { fontSize: 10, fontFamily: "sans-serif", color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  flashQ: { fontSize: 14, fontWeight: 700, fontFamily: "sans-serif", color: C.amber, lineHeight: 1.5 },
  flashA: { fontSize: 13, color: C.text, lineHeight: 1.65 },
  quickRef: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10, marginBottom: 20 },
  qrItem: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", display: "flex", gap: 10 },
  qrKey: { fontSize: 13, color: C.amber, fontFamily: "sans-serif", fontWeight: 700, minWidth: 0, flex: 1, lineHeight: 1.5 },
  qrVal: { fontSize: 13, color: C.text, textAlign: "right", lineHeight: 1.5 },
  tipBox: { background: "#1a2020", border: `1px solid ${C.green}`, borderRadius: 10, padding: "16px 22px", marginBottom: 16 },
  tipTitle: { fontFamily: "sans-serif", fontWeight: 700, color: C.green, marginBottom: 8, fontSize: 14 },
  searchResult: { background: C.card, border: `1px solid ${C.amber}`, borderRadius: 10, padding: "14px 20px", marginBottom: 10, cursor: "pointer" },
  srPart: { fontSize: 11, fontFamily: "sans-serif", color: C.amber, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  srTitle: { fontSize: 15, fontWeight: 700, fontFamily: "sans-serif", color: C.text, marginBottom: 4 },
  srSnip: { fontSize: 13, color: C.muted, lineHeight: 1.5 },
  noResults: { textAlign: "center", padding: "60px 20px", color: C.muted, fontFamily: "sans-serif" },
  progressBar: { height: 3, background: C.accentDim, borderRadius: 2, marginBottom: 20, overflow: "hidden" },
  progressFill: (pct) => ({ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 2, transition: "width .3s" }),
  navBtn: (disabled) => ({ padding: "8px 18px", borderRadius: 8, border: `1px solid ${disabled ? C.border : C.accent}`, background: "transparent", color: disabled ? C.muted : C.accent, cursor: disabled ? "not-allowed" : "pointer" }),
  topBtn: { position: "fixed", bottom: 24, right: 24, background: C.accent, color: "#fff", border: "none", borderRadius: 50, width: 44, height: 44, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
};

// ─── HELPER: render markdown-like text ───────────────────────────────────────
function Md({ children }) {
  if (!children) return null;
  const text = String(children);
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} style={{ color: "#f5e6c0" }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </span>
  );
}

// ─── TABLE COMPONENT ───────────────────────────────────────────────────────────
function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 18 }}>
      <table style={s.table}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={s.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={ri % 2 === 0 ? s.trEven : s.trOdd}>
              {row.map((cell, ci) => <td key={ci} style={s.td}><Md>{cell}</Md></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ACCORDION ─────────────────────────────────────────────────────────────────
function Accordion({ tag, tagColor, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={s.answerCard}>
      <div style={s.answerHeader(open)} onClick={() => setOpen(!open)}>
        <div>
          <div style={s.answerTag(tagColor)}>{tag}</div>
          <div style={s.answerQ}>{title}</div>
        </div>
        <span style={s.chevron(open)}>▾</span>
      </div>
      {open && <div style={s.answerBody}>{children}</div>}
    </div>
  );
}

// ─── SECTION: STUDY NOTES (Part A) ───────────────────────────────────────────
function StudyNotes({ searchQuery }) {
  const [activeTopic, setActiveTopic] = useState(null);
  const topics = useTopics();
  const filtered = searchQuery
    ? topics.filter(t => (t.title + t.def + JSON.stringify(t)).toLowerCase().includes(searchQuery.toLowerCase()))
    : topics;

  if (activeTopic !== null) {
    const t = topics[activeTopic];
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveTopic(null)} style={{ ...s.navBtn(false), fontSize: 13 }}>← All Topics</button>
          <span style={{ color: C.muted, fontFamily: "sans-serif", fontSize: 13 }}>Topic {activeTopic + 1} of {topics.length}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setActiveTopic(Math.max(0, activeTopic - 1))} style={s.navBtn(activeTopic === 0)} disabled={activeTopic === 0}>← Prev</button>
          <button onClick={() => setActiveTopic(Math.min(topics.length - 1, activeTopic + 1))} style={s.navBtn(activeTopic === topics.length - 1)} disabled={activeTopic === topics.length - 1}>Next →</button>
        </div>
        <div style={s.progressBar}><div style={s.progressFill(((activeTopic + 1) / topics.length) * 100)} /></div>
        <TopicDetail topic={t} />
      </div>
    );
  }

  return (
    <div>
      <div style={s.sectionTitle}>📚 Study Notes — Part A</div>
      <div style={s.sectionSub}>13 syllabus topics · Click any card to expand full notes</div>
      {filtered.length === 0 && <div style={s.noResults}>No topics match "{searchQuery}"</div>}
      <div style={s.topicGrid}>
        {filtered.map((t, i) => {
          const idx = topics.indexOf(t);
          return (
            <div key={i} style={s.topicCard(false)} onClick={() => setActiveTopic(idx)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = "#1e2845"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}>
              <div style={s.topicNum}>Topic {idx + 1}</div>
              <div style={s.topicTitle}>{t.title}</div>
              <div style={s.topicSnip}>{t.def.slice(0, 100)}…</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicDetail({ topic: t }) {
  return (
    <div style={s.contentBox}>
      <div style={{ ...s.pill(C.accent), marginBottom: 10, fontFamily: "sans-serif" }}>Topic {t.num}</div>
      <div style={s.contentTitle}>{t.title}</div>
      <div style={s.defBox}>
        <div style={{ fontSize: 11, color: C.accent, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>One-Line Definition</div>
        <div style={s.defText}><Md>{t.def}</Md></div>
      </div>
      {t.keyPoints && (
        <>
          <div style={s.subhead}>🔑 Key Points</div>
          <ul style={s.ul}>
            {t.keyPoints.map((p, i) => <li key={i} style={s.li}><Md>{p}</Md></li>)}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── SECTION: MODEL ANSWERS (Part B) ─────────────────────────────────────────
function ModelAnswers({ searchQuery }) {
  const answers = useAnswers();
  const filtered = searchQuery
    ? answers.filter(a => (a.q + a.tag + JSON.stringify(a.sections)).toLowerCase().includes(searchQuery.toLowerCase()))
    : answers;

  const secA = filtered.filter(a => a.tag === "Section A — 20 Marks");
  const secB = filtered.filter(a => a.tag === "Section B — 10 Marks");

  return (
    <div>
      <div style={s.sectionTitle}>✍️ Model Answers — Part B</div>
      <div style={s.sectionSub}>5 Section A (20-mark) + 8 Section B (10-mark) full model answers · Click to expand</div>

      {secA.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={s.pill(C.red)}>Section A</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 14, color: C.muted }}>Answer any 2 of 3 · 20 marks each · 600–800 words in exam</span>
          </div>
          {secA.map((a, i) => (
            <Accordion key={i} tag={a.tag} tagColor={C.red} title={a.q}>
              <AnswerBody sections={a.sections} />
            </Accordion>
          ))}
        </>
      )}

      {secB.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 14px" }}>
            <span style={s.pill(C.green)}>Section B</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 14, color: C.muted }}>Answer any 3 of 5 · 10 marks each · 250–350 words in exam</span>
          </div>
          {secB.map((a, i) => (
            <Accordion key={i} tag={a.tag} tagColor={C.green} title={a.q}>
              <AnswerBody sections={a.sections} />
            </Accordion>
          ))}
        </>
      )}

      {filtered.length === 0 && <div style={s.noResults}>No answers match "{searchQuery}"</div>}
    </div>
  );
}

function AnswerBody({ sections }) {
  return (
    <div>
      {sections.map((sec, si) => (
        <div key={si}>
          {sec.heading && <div style={sec.level === 2 ? s.subhead : s.subhead2}>{sec.heading}</div>}
          {sec.paras && sec.paras.map((p, pi) => (
            <p key={pi} style={{ fontSize: 14, lineHeight: 1.8, color: C.text, marginBottom: 12 }}><Md>{p}</Md></p>
          ))}
          {sec.items && (
            <ul style={s.ul}>
              {sec.items.map((item, ii) => <li key={ii} style={s.li}><Md>{item}</Md></li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SECTION: FLASH CARDS (Part C) ───────────────────────────────────────────
function FlashCards({ searchQuery }) {
  const cards = useCards();
  const [flipped, setFlipped] = useState({});
  const [showAll, setShowAll] = useState(false);
  const filtered = searchQuery
    ? cards.filter(c => (c.q + c.a).toLowerCase().includes(searchQuery.toLowerCase()))
    : cards;

  const toggleFlip = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }));
  const resetAll = () => setFlipped({});

  return (
    <div>
      <div style={s.sectionTitle}>🃏 Flash Cards — Part C</div>
      <div style={s.sectionSub}>20 high-priority flash cards · Click any card to flip and reveal the answer</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={resetAll} style={{ ...s.navBtn(false), cursor: "pointer" }}>Reset All</button>
        <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.muted, alignSelf: "center" }}>
          {Object.values(flipped).filter(Boolean).length} / {filtered.length} revealed
        </span>
      </div>

      <div style={s.flashGrid}>
        {filtered.map((c, i) => (
          <div key={i} style={s.flashCard(flipped[i])} onClick={() => toggleFlip(i)}>
            <div style={s.flashInner(!!flipped[i])}>
              <div style={{ ...s.flashFace, ...s.flashFront }}>
                <div style={s.flashNum}>Card {c.num} · Click to flip</div>
                <div style={s.flashQ}>{c.q}</div>
              </div>
              <div style={{ ...s.flashFace, ...s.flashBack }}>
                <div style={s.flashNum}>Card {c.num} · Answer</div>
                <div style={s.flashA}><Md>{c.a}</Md></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div style={s.noResults}>No cards match "{searchQuery}"</div>}
    </div>
  );
}

// ─── DATA: TOPICS ────────────────────────────────────────────────────────────
function useTopics() {
  return useMemo(() => [
    {
      num: 1, title: "SOIL — Definition, Components, Functions",
      def: "**Soil** is a biologically active, porous natural body composed of minerals, organic matter, water, air, and micro/macro-organisms that supports plant life.",
      keyPoints: [
        "Soil is called the **\"skin of the Earth\"** — it is the outermost layer of the Earth's crust",
        "Study of soil has two branches: **Pedology** (formation, morphology, classification) and **Edaphology** (influence of soil on organisms)",
        "Optimum soil composition by volume: **45% minerals + 5% organic matter + 25% water + 25% air**",
        "Soil is an **open system** — it continuously exchanges matter and energy with its surroundings",
      ],
    },
  ], []);
}

function useAnswers() {
  return useMemo(() => [
    {
      tag: "Section A — 20 Marks",
      q: "A1. What are the major components of soil?",
      sections: [{ heading: "Introduction", level: 2, paras: ["Soil consists of four major components: mineral matter (45%), organic matter (5%), water (25%), and air (25%)."] }],
    },
  ], []);
}

function useCards() {
  return useMemo(() => [
    { num: 1, q: "What is soil?", a: "Soil is a biologically active, porous natural body formed from weathered rock and organic matter." },
  ], []);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("notes");
  const [search, setSearch] = useState("");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = [
    { id: "notes", label: "📚 Study Notes (Part A)" },
    { id: "answers", label: "✍️ Model Answers (Part B)" },
    { id: "cards", label: "🃏 Flash Cards (Part C)" },
  ];

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>GETh 201</div>
          <span style={s.badge}>EXAM PREP</span>
          <div style={{ color: C.muted, fontFamily: "sans-serif", fontSize: 13 }}>University of Dhaka · Geography of Soil & Biogeography</div>
          <div style={s.searchWrap}>
            <input
              style={s.search}
              placeholder="🔍 Search topics, terms, questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={s.tabBar}>
        {tabs.map(t => (
          <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Main Content */}
      <div style={s.main}>
        {tab === "notes" && <StudyNotes searchQuery={search} />}
        {tab === "answers" && <ModelAnswers searchQuery={search} />}
        {tab === "cards" && <FlashCards searchQuery={search} />}
      </div>

      {/* Back to Top */}
      {showTop && (
        <button style={s.topBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      )}
    </div>
  );
}
