import { useState, useEffect, useRef, useMemo } from "react";

// ─── COLOUR TOKENS ───────────────────────────────────────────────────────────
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
  search: { width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 14px", color: C.text, fontSize: 14, fontFamily: "sans-serif", boxSizing: "border-box", outline: "none" },
  tabBar: { display: "flex", gap: 4, background: C.surface, padding: "8px 20px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" },
  tab: (active) => ({ padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s", background: active ? C.accent : "transparent", color: active ? "#fff" : C.muted, whiteSpace: "nowrap" }),
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
  codeBlock: { background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px", fontFamily: "'Courier New', monospace", fontSize: 13, color: "#7dd3fc", overflowX: "auto", whiteSpace: "pre", marginBottom: 14, lineHeight: 1.7 },
  pill: (color) => ({ display: "inline-block", background: color + "22", color: color, border: `1px solid ${color}55`, borderRadius: 4, padding: "1px 8px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, marginRight: 4 }),
  answerCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20, overflow: "hidden" },
  answerHeader: (open) => ({ background: open ? C.accentDim : C.surface, padding: "16px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: open ? `1px solid ${C.border}` : "none" }),
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
  navBtn: (disabled) => ({ padding: "8px 18px", borderRadius: 8, border: `1px solid ${disabled ? C.border : C.accent}`, background: "transparent", color: disabled ? C.muted : C.accent, cursor: disabled ? "default" : "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }),
  topBtn: { position: "fixed", bottom: 24, right: 24, background: C.accent, color: "#fff", border: "none", borderRadius: 50, width: 44, height: 44, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, boxShadow: "0 4px 20px #4f9cf955" },
};

// ─── HELPER: render markdown-like text ───────────────────────────────────────
function Md({ children }) {
  if (!children) return null;
  const text = String(children);
  // Bold
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

// ─── TABLE COMPONENT ─────────────────────────────────────────────────────────
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

// ─── ACCORDION ───────────────────────────────────────────────────────────────
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

      {/* Definition */}
      <div style={s.defBox}>
        <div style={{ fontSize: 11, color: C.accent, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>One-Line Definition</div>
        <div style={s.defText}><Md>{t.def}</Md></div>
      </div>

      {/* Key Points */}
      {t.keyPoints && (
        <>
          <div style={s.subhead}>🔑 Key Points</div>
          <ul style={s.ul}>
            {t.keyPoints.map((p, i) => <li key={i} style={s.li}><Md>{p}</Md></li>)}
          </ul>
        </>
      )}

      {/* Important Terms */}
      {t.terms && (
        <>
          <div style={s.subhead}>📖 Important Terms</div>
          {t.terms.map((group, gi) => (
            <div key={gi}>
              {group.heading && <div style={s.subhead2}>{group.heading}</div>}
              <ul style={s.ul}>
                {group.items.map((item, ii) => <li key={ii} style={s.li}><Md>{item}</Md></li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* Tables */}
      {t.tables && t.tables.map((tbl, ti) => (
        <div key={ti}>
          {tbl.caption && <div style={s.subhead2}>{tbl.caption}</div>}
          <Table headers={tbl.headers} rows={tbl.rows} />
        </div>
      ))}

      {/* Extra Content */}
      {t.extra && t.extra.map((section, si) => (
        <div key={si}>
          <div style={s.subhead}>{section.heading}</div>
          {section.items && <ul style={s.ul}>{section.items.map((item, ii) => <li key={ii} style={s.li}><Md>{item}</Md></li>)}</ul>}
          {section.paras && section.paras.map((p, pi) => <p key={pi} style={{ fontSize: 14, lineHeight: 1.75, color: C.text, marginBottom: 10 }}><Md>{p}</Md></p>)}
          {section.subSections && section.subSections.map((ss, ssi) => (
            <div key={ssi}>
              <div style={s.subhead2}>{ss.heading}</div>
              {ss.items && <ul style={s.ul}>{ss.items.map((item, ii) => <li key={ii} style={s.li}><Md>{item}</Md></li>)}</ul>}
              {ss.paras && ss.paras.map((p, pi) => <p key={pi} style={{ fontSize: 14, lineHeight: 1.75, color: C.text, marginBottom: 10 }}><Md>{p}</Md></p>)}
            </div>
          ))}
        </div>
      ))}

      {/* Diagram Note */}
      {t.diagram && (
        <div style={s.diagBox}>
          <div style={s.diagLabel}>📐 Diagram Note</div>
          <div style={{ fontSize: 13, color: "#c4b5fd", lineHeight: 1.7 }}><Md>{t.diagram}</Md></div>
          {t.diagramCode && <div style={s.codeBlock}>{t.diagramCode}</div>}
        </div>
      )}

      {/* Bangladesh Example */}
      {t.bangladesh && (
        <div style={s.bdBox}>
          <div style={s.bdLabel}>🇧🇩 Bangladesh / Real-World Example</div>
          <div style={{ fontSize: 13, color: "#bbf7d0", lineHeight: 1.7 }}><Md>{t.bangladesh}</Md></div>
        </div>
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
          {sec.table && <Table headers={sec.table.headers} rows={sec.table.rows} />}
          {sec.code && <div style={s.codeBlock}>{sec.code}</div>}
          {sec.diagram && (
            <div style={s.diagBox}>
              <div style={s.diagLabel}>📐 Diagram</div>
              <div style={{ fontSize: 13, color: "#c4b5fd", lineHeight: 1.7 }}><Md>{sec.diagram}</Md></div>
            </div>
          )}
          {sec.bd && (
            <div style={s.bdBox}>
              <div style={s.bdLabel}>🇧🇩 Bangladesh Example</div>
              <div style={{ fontSize: 13, color: "#bbf7d0", lineHeight: 1.7 }}><Md>{sec.bd}</Md></div>
            </div>
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

      {/* Quick Reference Table */}
      <div style={{ marginTop: 40 }}>
        <div style={s.subhead}>📊 Quick Reference — Key Facts to Memorise</div>
        <div style={s.quickRef}>
          {quickRefData.map((item, i) => (
            <div key={i} style={s.qrItem}>
              <div style={s.qrKey}>{item[0]}</div>
              <div style={s.qrVal}>{item[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Tips */}
      <div style={{ marginTop: 32 }}>
        <div style={s.subhead}>🎯 Last-Minute Exam Strategy</div>
        <div style={s.tipBox}>
          <div style={s.tipTitle}>Section A (20 marks each)</div>
          <ul style={s.ul}>
            {["Spend exactly 35–40 minutes per Section A question", "Always write a short Introduction (3–4 lines defining key terms)", "Use bold subheadings — examiners scan for structure", "Draw at least ONE diagram per Section A answer — even a simple labelled sketch earns marks", "End with a Conclusion (3–4 lines synthesising the key point)", "Aim for 600–750 words per answer"].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
          </ul>
        </div>
        <div style={s.tipBox}>
          <div style={s.tipTitle}>Section B (10 marks each)</div>
          <ul style={s.ul}>
            {["Spend 15–20 minutes per Section B answer", "No lengthy introduction — jump straight to the answer", "Use a short definition, then 4–6 well-developed points", "Add a small diagram if time permits", "Aim for 250–320 words per answer"].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
          </ul>
        </div>
        <div style={s.tipBox}>
          <div style={s.tipTitle}>Highest Probability Questions (based on 2022–2024 pattern)</div>
          <ul style={s.ul}>
            {["Section A: Soil profile with figure — appears almost every year", "Section A: Biomes of the world (biochore and biome)", "Section A: Ecosystem components and energy flow", "Section B: Humus and organic matter functions", "Section B: Soil forming processes (Laterization, Podzolization etc.)", "Section B: Plant succession / Hydrosere stages", "Section B: Tundra biome in detail", "Section B: Zoogeographical realms"].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
          </ul>
        </div>
        <div style={s.tipBox}>
          <div style={s.tipTitle}>Diagrams to Practise Drawing Before Exam</div>
          <ul style={s.ul}>
            {["Soil Profile (O-A-E-B-C-R horizons with labels) — MUST PRACTISE", "Soil Texture Triangle (USDA) — sand, silt, clay axes with Loam zone", "Hydrosere cross-section (open water → forest, left to right)", "Food Web (grassland: Grass→Grasshopper→Frog→Snake→Eagle + Decomposers)", "Pyramid of Energy (wide base to narrow top, 10% at each level: 10000→1000→100→10 kcal)", "World Biome Map sketch (latitudinal bands)", "World Zoogeographical Realms Map (6 realms + Wallace's Line)"].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK REF DATA ───────────────────────────────────────────────────────────
const quickRefData = [
  ["Term 'ecosystem' coined by", "A.G. Tansley, 1935"],
  ["Term 'biome' coined by", "Frederick Clements, 1916"],
  ["Father of Biogeography", "Alfred Russel Wallace"],
  ["Father of Plant Geography", "Alexander von Humboldt"],
  ["Jenny's soil formation equation", "1941"],
  ["Lindemann's 10% Law", "1942"],
  ["Energy transfer between trophic levels", "10% (90% lost as heat)"],
  ["Most active humus fraction", "Fulvic acid (soluble in acid & base)"],
  ["Optimal soil pH for most crops", "6.0–6.8"],
  ["Particle density (mineral soil)", "2.60–2.75 g/cm³"],
  ["Bulk density (cultivated loam)", "1.1–1.4 g/cm³"],
  ["Most important soil formation factor", "Climate"],
  ["Most important physical soil property", "Texture"],
  ["Bangladesh dominant USDA soil type", "Inceptisols (floodplain soils)"],
  ["Bangladesh soil series (SRDI)", "~500"],
  ["Bangladesh floodplain soils (%)", "78.96%"],
  ["Bangladesh floristic kingdom", "Paleotropical Kingdom"],
  ["Bangladesh zoogeographical realm", "Oriental Realm"],
  ["World's largest mangrove ecosystem", "Sundarbans (Bangladesh/India)"],
  ["Hydrosere Stage 4 dominant plants", "Phragmites (reed) & Typha (cattail)"],
  ["Tundra soil order (USDA)", "Gelisol"],
  ["Tropical rainforest soil order", "Oxisol (Laterite)"],
  ["Temperate grassland soil", "Mollisol (Chernozem) — most fertile"],
  ["Boreal/Taiga forest soil", "Spodosol (Podzol)"],
  ["Desert soil order", "Aridisol"],
  ["Gleyed soil colour", "Grey/blue-green (reduced Fe²⁺)"],
  ["Symbiotic N-fixing bacteria", "Rhizobium (legume root nodules)"],
  ["N-fixing in Bangladesh rice paddies", "Cyanobacteria (e.g., Anabaena)"],
  ["Wallace's Line location", "Bali/Lombok + Borneo/Sulawesi"],
  ["Permafrost definition", "Permanently frozen ground (tundra/gelisol)"],
  ["CLORPT stands for", "Climate, Living organisms, Organic matter, Relief, Parent material, Time"],
  ["Humus % of total SOM", "60–80%"],
  ["Soil saline if EC >", "4 dS/m"],
  ["Soil profile full development time", "2,000–10,000 years"],
  ["BNF global N fixation per year", "~200 million tonnes N"],
];

// ─── DATA: TOPICS ─────────────────────────────────────────────────────────────
function useTopics() {
  return useMemo(() => [
    {
      num: 1, title: "SOIL — Definition, Components, Functions",
      def: "**Soil** is a biologically active, porous natural body composed of minerals, organic matter, water, air, and micro/macro-organisms that supports plant life and forms the interface between the lithosphere, hydrosphere, atmosphere, and biosphere.",
      keyPoints: [
        "Soil is called the **\"skin of the Earth\"** — it is the outermost layer of the Earth's crust",
        "Study of soil has two branches: **Pedology** (formation, morphology, classification) and **Edaphology** (influence of soil on organisms)",
        "Optimum soil composition by volume: **45% minerals + 5% organic matter + 25% water + 25% air**",
        "Soil is an **open system** — it continuously exchanges matter and energy with its surroundings",
        "Soil density ranges from **1–2 g/cm³**; most soils no older than Pleistocene era",
      ],
      terms: [
        { heading: null, items: [
          "**Pedosphere** — the outermost layer of Earth where soil forms; intersects lithosphere, hydrosphere, atmosphere, biosphere",
          "**Solum** — the upper two horizons (A + B) where active soil-forming processes occur",
          "**Regolith** — loose weathered rock material above solid geology (engineering term for soil)",
          "**Pedon** — the smallest 3-dimensional unit of soil that can be studied (like a soil column)",
          "**Polypedon** — a group of similar pedons; the mapping unit used in soil surveys",
        ]},
      ],
      tables: [
        { caption: "The Four Major Components of Soil", headers: ["Component", "% by Volume", "Details"],
          rows: [["**Mineral Matter**", "~45%", "Inorganic particles from weathered rock (sand, silt, clay)"],["**Organic Matter**", "~5%", "Plant/animal residues in various stages of decomposition"],["**Water**", "~25%", "Held in pores; the soil solution containing dissolved nutrients"],["**Air**", "~25%", "Fills pores not occupied by water; supplies O₂ for root respiration"]] },
      ],
      extra: [
        { heading: "Six Key Functions of Soil in Ecosystem", items: [
          "**Medium for plant growth** — provides anchorage, water, nutrients, temperature regulation",
          "**Water storage, filtration, and purification** — regulates water cycle; prevents flooding",
          "**Modifier of atmosphere** — absorbs O₂ and CH₄; releases CO₂ and N₂O; stores carbon",
          "**Habitat for organisms** — supports billions of microbes per gram; site of decomposition and nutrient cycling",
          "**Recycling system** — decomposes organic wastes; releases nutrients back into ecosystem",
          "**Source of raw materials and platform for structures** — construction material; archaeological record",
        ]},
      ],
      diagram: "Draw a circle divided into 4 segments: 45% Mineral (yellow), 5% Organic (brown), 25% Water (blue), 25% Air (white). Label each. Draw a second diagram showing soil as the interface point of 4 spheres: Lithosphere (bottom), Hydrosphere (left), Atmosphere (top), Biosphere (right), with Soil/Pedosphere at the center.",
      bangladesh: "Bangladesh soils are mostly alluvial, formed by the Ganges-Brahmaputra-Meghna (GBM) river system. About **80% of Bangladesh soils** are formed from fluvial sediments (alluvium). The remaining 20% are from Tertiary-Quaternary hill sediments (12%) and Pleistocene terraces (8%). Bangladesh soils are vital for rice (boro, aus, aman) cultivation.",
    },
    {
      num: 2, title: "SOIL FORMATION — Factors (CLORPT) and Pedogenic Processes",
      def: "**Soil formation (pedogenesis)** is the process by which parent rock material is transformed into soil through the combined action of climate, organisms, topography, parent material, and time.",
      keyPoints: [
        "**C — Climate**: Most important factor. Temperature and precipitation control weathering rates, organic matter accumulation, and leaching. High rainfall = leaching; high temperature = rapid decomposition",
        "**L — Living organisms (Biota)**: Plants add organic matter; bacteria fix nitrogen; earthworms mix soil; lichens are pioneer organisms",
        "**O — Organic matter**: Humus darkens soil, improves structure, increases fertility",
        "**R — Relief/Topography**: Steep slopes = thin, eroded soils; flat areas = deeper, mature soils; aspect affects temperature and moisture",
        "**P — Parent material**: The rock from which soil is derived. Determines mineral content, texture, and initial chemical composition",
        "**T — Time**: Longer time = more developed soil profile with distinct horizons",
      ],
      terms: [
        { heading: null, items: [
          "**Parent material** — the original mineral material from which soil forms (igneous, sedimentary, metamorphic rock, or transported sediment)",
          "**Weathering** — breakdown of rocks into smaller particles through physical, chemical, and biological processes",
          "**Eluviation** — downward movement/washing out of materials (clay, iron, humus) from upper horizons",
          "**Illuviation** — deposition/accumulation of materials washed down from above in lower horizons",
          "**Translocation** — movement of material within the soil profile",
        ]},
      ],
      extra: [
        { heading: "The Five Major Pedogenic Processes", subSections: [
          { heading: "1. LATERIZATION", items: [
            "**Process**: In hot, humid tropical climates, intense chemical weathering causes silica to leach out while iron (Fe) and aluminum (Al) oxides remain and accumulate",
            "**Chemistry**: Silica (SiO₂) is removed; sesquioxides (Fe₂O₃, Al₂O₃) concentrate → red/yellow soil",
            "**Soil produced**: **Laterite / Latosol** (Oxisols in USDA)",
            "**Geographic location**: Tropical rainforest zones — Amazon Basin (Brazil), Congo Basin (Africa), parts of India, Sri Lanka, West Africa",
            "**Bangladesh**: Madhupur Tract red soils show laterization features",
          ]},
          { heading: "2. PODSOLIZATION (Podzolization)", items: [
            "**Process**: In cool, humid climates under coniferous forests, organic acids (from needle litter) cause intense leaching of iron, aluminum, and humus from the A horizon, creating a bleached E horizon; these accumulate in B horizon",
            "**Chemistry**: Fulvic acids chelate Fe³⁺ and Al³⁺ → transported downward → B horizon accumulation",
            "**Soil produced**: **Podzol / Spodosol** — distinctive ash-grey (albic) E horizon above dark B horizon",
            "**Geographic location**: Boreal/Taiga forests — Scandinavia, Russia, Canada, northern USA, Scotland",
            "**Key feature**: Hardpan (iron pan or ortstein) may form in B horizon",
          ]},
          { heading: "3. CALCIFICATION", items: [
            "**Process**: In semi-arid and grassland climates, evaporation exceeds precipitation. Water moves upward by capillary action, depositing calcium carbonate (CaCO₃) in the B or C horizon",
            "**Chemistry**: CaCO₃ precipitates at depth where soil moisture meets upward-moving Ca²⁺ ions",
            "**Soil produced**: **Chernozem / Mollisol** — dark, rich topsoil with calcium carbonate nodules/hardpan (caliche) at depth",
            "**Geographic location**: Grassland steppes — Great Plains (USA), Pampas (Argentina), Ukraine/Russia, Central Asian steppes",
            "**Key feature**: High organic matter content in A horizon; extremely fertile soils",
          ]},
          { heading: "4. GLEIZATION (Gleying)", items: [
            "**Process**: In waterlogged, poorly drained conditions, oxygen is excluded. Anaerobic bacteria reduce ferric iron (Fe³⁺) to ferrous iron (Fe²⁺), producing grey/blue/green colours",
            "**Chemistry**: Fe³⁺ (red/brown oxidized) → Fe²⁺ (grey/blue/green reduced) under anaerobic conditions",
            "**Soil produced**: **Gley soil / Gleysol** — grey to blue-green mottled soil with low chroma",
            "**Geographic location**: Wetlands, floodplains, river deltas — Bangladesh haors and beels, Netherlands, Mississippi Delta",
            "**Bangladesh**: Extremely common in Bangladesh's floodplain soils; most floodplain soils show gleying",
          ]},
          { heading: "5. SALINIZATION", items: [
            "**Process**: In arid and semi-arid regions, high evaporation draws soil water to the surface, depositing soluble salts (NaCl, Na₂SO₄, CaCO₃) at or near the surface",
            "**Chemistry**: Evaporation > precipitation → upward capillary movement → salt accumulation",
            "**Soil produced**: **Solonchak (Salic soil)** — white salt crust on surface; highly alkaline pH (up to 10)",
            "**Geographic location**: Hot deserts and irrigated arid areas — Middle East, Indus Valley, Nile Delta, coastal Bangladesh",
            "**Bangladesh**: Coastal saline soils in Sundarbans and Chittagong coastal areas due to tidal inundation",
          ]},
        ]},
      ],
      diagram: "Draw a two-column comparison table for each process showing: Climate → Process → Horizon Affected → Soil Type → Location. Also draw a world map sketch with labels: Laterization = tropics (equatorial band), Podzolization = 50–70°N, Calcification = 30–50° in continental interiors, Gleization = wetlands globally, Salinization = desert margins.",
      bangladesh: "Bangladesh is exceptionally affected by Gleization (waterlogged floodplain soils — haors, beels, paddy fields) and Salinization (coastal areas of Chittagong, Satkhira, Cox's Bazar). These two processes shape the dominant soil types used for rice and aquaculture.",
    },
    {
      num: 3, title: "PHYSICAL PROPERTIES OF SOIL",
      def: "Physical properties of soil are the measurable characteristics that describe its form, structure, and behavior — including texture, structure, color, bulk density, porosity, water content, and air content.",
      keyPoints: [
        "Physical properties determine a soil's agricultural usefulness, water-holding capacity, aeration, and trafficability",
        "**Texture** is the most important physical property — it is permanent and cannot be easily changed",
        "Order of importance: texture > structure > density > porosity > consistency > temperature > color",
      ],
      terms: [
        { heading: "SOIL TEXTURE", items: [
          "**Soil texture** — the relative proportions of sand, silt, and clay in a soil (determined by particle size analysis/hydrometer method)",
          "**Sand** — 2.0–0.05 mm; coarse, gritty; low water-holding capacity; high drainage; visible to naked eye",
          "**Silt** — 0.05–0.002 mm; smooth, floury feel when moist; moderate water-holding capacity",
          "**Clay** — <0.002 mm; sticky, plastic when wet; high water-holding capacity; holds nutrients; swells and shrinks",
          "**Loam** — ideal agricultural soil texture: ~40% sand + 40% silt + 20% clay; balances drainage and water retention",
          "**Texture triangle (USDA)** — triangular diagram used to determine soil textural class from percentage of sand, silt, clay",
        ]},
        { heading: "SOIL STRUCTURE", items: [
          "**Soil structure** — the arrangement of soil particles into aggregates or 'peds' separated by pores",
          "**Types of structure**: Granular (round, surface horizons), Blocky (angular/subangular, B horizons), Platy (horizontal layers, compacted soils), Prismatic (vertical columns), Single-grain (sand), Massive (dense clay)",
          "**Binding agents**: organic matter (humus), calcium compounds, iron oxides, plant roots, microbial gums",
        ]},
        { heading: "SOIL COLOR (Munsell System)", items: [
          "**Munsell Color System** — standard system using Hue (color), Value (lightness), Chroma (intensity)",
          "Dark/black = high organic matter (e.g., Chernozem)",
          "Red/yellow = iron oxide presence; well-oxidized (aerobic) conditions",
          "Grey/blue-green = reduced iron (Fe²⁺); waterlogged/anaerobic conditions (gleying)",
          "White = calcium carbonate, gypsum, or salt accumulation",
        ]},
        { heading: "BULK DENSITY AND PARTICLE DENSITY", items: [
          "**Particle density** (ρs) = mass of solids ÷ volume of solids; typically **2.6–2.75 g/cm³** for mineral soils",
          "**Bulk density** (ρb) = mass of dry soil ÷ total soil volume (includes pores); typically **1.1–1.4 g/cm³** for cultivated loam",
          "High bulk density = compaction or high sand content",
          "ρb is always less than ρs because pores constitute ~50% of soil volume",
        ]},
        { heading: "SOIL WATER", items: [
          "**Field capacity** — water held after free drainage stops; matric potential −10 to −30 kPa; available to plants",
          "**Permanent wilting point (PWP)** — water held so tightly (−1500 kPa) plants cannot extract it",
          "**Available water** = Field capacity − PWP (the water actually available for plant growth)",
          "**Gravitational water** — water in large pores; drains freely; not available for long",
          "**Hygroscopic water** — tightly bound to soil particles; not available to plants",
        ]},
        { heading: "SOIL AIR", items: [
          "Soil air has higher CO₂ (0.3–3%) and lower O₂ than atmosphere",
          "Gas exchange by **mass flow** (pressure gradient) and **diffusion** (Fick's Law)",
          "**Porosity** (f) = volume of pores ÷ total soil volume; ideally 30–60%",
        ]},
        { heading: "SOIL TEMPERATURE", items: [
          "Influences seed germination, microbial activity, nutrient availability, root growth",
          "Darker soils absorb more heat; organic matter acts as insulating layer",
        ]},
      ],
      diagram: "1. **Texture Triangle**: Equilateral triangle — left side '% Clay' (0 bottom to 100 top), right side '% Sand' (100 bottom to 0 top), base '% Silt'. Mark 'Loam' zone (40% sand, 40% silt, 20% clay) in center-lower area. 2. **Soil Water Bar**: [Hygroscopic water | Available Water (FC−PWP) | Gravitational water] — mark PWP on left boundary of available water, Field Capacity on right boundary.",
      bangladesh: "Bangladesh soils are predominantly silt loam to silty clay loam (floodplain soils). The bulk of rice cultivation depends on the high water-holding capacity of these soils. Waterlogging in haors (seasonal wetlands) leads to gleyed (reduced) soil conditions. High clay content in Old Brahmaputra floodplain gives those soils excellent nutrient-holding capacity.",
    },
    {
      num: 4, title: "CHEMICAL PROPERTIES OF SOIL",
      def: "Chemical properties of soil describe its mineral composition, nutrient status, acidity/alkalinity, ion exchange capacity, and reactivity — all of which determine soil fertility and plant growth.",
      keyPoints: [
        "Soil pH is the single most important chemical property — it controls nutrient availability",
        "Soil colloids (clay and humus) are the seat of chemical activity",
        "Ion exchange determines nutrient availability and buffering capacity",
        "Optimal pH for most crops: **6.0–6.8** (slightly acidic)",
      ],
      terms: [
        { heading: "SOIL pH", items: [
          "**Soil pH** — measure of hydrogen ion (H⁺) concentration in soil solution; scale 0–14",
          "pH 7 = neutral; pH < 7 = acidic; pH > 7 = alkaline/basic; practical range: 3.5–9.5",
          "**Acidic soils** (pH < 5.5): toxic levels of Al³⁺ and Mn²⁺; occurs in high-rainfall leached soils, podzols",
          "**Alkaline soils** (pH > 7.5): low micronutrient availability; occurs in arid regions with CaCO₃ accumulation",
          "pH strongly controlled by parent material, rainfall, and vegetation",
        ]},
        { heading: "SOIL COLLOIDS", items: [
          "**Soil colloids** — extremely fine particles (<0.002 mm or 2 μm) with very large surface area and electrical charges; control most chemical reactions",
          "**Types**: (1) Phyllosilicate clay minerals (kaolinite, montmorillonite), (2) Iron/aluminum oxides (goethite, gibbsite, hematite), (3) Amorphous minerals (allophane, imogolite), (4) Organic colloids (humus)",
          "**Montmorillonite (2:1 clay)** — swells when wet; high CEC; found in Vertisols",
          "**Kaolinite (1:1 clay)** — non-swelling; low CEC; dominant in tropical weathered soils; common in Bangladesh",
        ]},
        { heading: "ION EXCHANGE", items: [
          "**Cation Exchange Capacity (CEC)** — ability of soil to hold and release positively charged ions (cations); measured in cmol(+)/kg",
          "**Cation exchange** — positively charged ions (Ca²⁺, Mg²⁺, K⁺, Na⁺, H⁺, Al³⁺) held on negatively charged colloid surfaces and exchanged with soil solution",
          "High CEC = more fertile soil (clay-rich or humus-rich soils)",
          "**Base saturation** — % of CEC occupied by basic cations (Ca²⁺, Mg²⁺, K⁺, Na⁺); high = fertile soil",
        ]},
        { heading: "BUFFERING", items: [
          "**Buffering capacity** — soil's ability to resist change in pH; provided by colloids, organic matter, and carbonate minerals",
          "Soils with high clay and organic matter content have high buffering capacity",
          "Humus carboxyl groups (R-COOH ⇌ R-COO⁻ + H⁺) contribute significantly to buffering",
        ]},
        { heading: "SOIL SALINITY", items: [
          "**Soil salinity** — high concentration of soluble salts (NaCl, MgSO₄, Na₂SO₄) that reduce plant growth through osmotic stress",
          "Electrical conductivity (EC) used to measure salinity: EC > 4 dS/m = saline soil",
          "**Saline soils (Solonchak)**: white salt crust, high pH; **Sodic soils (Solonetz)**: high exchangeable Na⁺, dispersed structure",
        ]},
        { heading: "SOIL NUTRIENTS", items: [
          "**16 essential nutrients**: C, H, O (from air/water) + N, P, K (macronutrients) + Ca, Mg, S (secondary) + Fe, B, Mn, Cu, Zn, Mo, Cl (micronutrients)",
          "**Nitrogen** — most commonly deficient; from atmospheric fixation and decomposition; mobile in plant",
          "Most nutrients (except N) originate from mineral weathering",
        ]},
      ],
      diagram: "Draw a 'Nutrient Availability vs pH' graph: X-axis = pH from 4 to 9; Y-axis = nutrient availability. Show bands for N, P, K (widest availability at pH 6–7), Fe/Mn (wider at low pH), and Mo (wider at high pH). This classic diagram shows why neutral-slightly acid pH is optimal.",
    },
    {
      num: 5, title: "ORGANIC PROPERTIES OF SOIL",
      def: "Organic properties of soil refer to the content, composition, and transformations of organic matter — including humus, microbial biomass, and nutrients — which determine soil fertility, structure, and biological activity.",
      keyPoints: [
        "Soil organic matter (SOM) = plant residues + animal remains + microbial biomass + humus",
        "Even small amounts of organic matter (5%) have disproportionately large effects on soil properties",
        "**Humus makes up 60–80% of total SOM** — it is the most stable component",
        "Nitrogen fixation converts atmospheric N₂ to plant-available NH₃/NH₄⁺ — critical for soil fertility",
        "Microbial activity is the engine of nutrient cycling in soil",
      ],
      terms: [
        { heading: "ORGANIC MATTER", items: [
          "**Soil Organic Matter (SOM)** — all organic compounds in soil, from fresh plant debris to highly decomposed humus; typically 1–6% in surface horizons",
          "**Non-humic substances** — fresh, recognizable organic material (cellulose, lignin, proteins, lipids); relatively easily decomposed; 20–30% of SOM",
          "**Humic substances** — dark, high-molecular-weight compounds resistant to further decomposition; 60–80% of SOM",
        ]},
        { heading: "HUMUS — Three Fractions", items: [
          "**Humus** — the dark, stable, amorphous organic matter formed from decomposed plant and animal material through biological and chemical transformation",
          "**Humin** — largest molecule; insoluble in acid or base; most stable; lowest activity",
          "**Humic acid** — soluble in base but not acid; medium molecular weight; dark brown color; contributes to soil fertility",
          "**Fulvic acid** — soluble in both acid and base; smallest molecule; highest number of carboxyl groups (-COOH); MOST ACTIVE fraction; dominates in forest soils",
          "Forest soils = high fulvic acid; Grassland/peat soils = high humic acid",
        ]},
        { heading: "HUMIFICATION PROCESS", items: [
          "**Humification** — the biochemical transformation of raw organic materials into humus through decomposition, synthesis, and condensation reactions by soil microorganisms",
          "Stages: Fresh litter → Fragmentation → Decomposition → Synthesis → Humus",
          "Controlled by: moisture, temperature, pH, C:N ratio (ideal ratio ~25:1)",
          "Slow humification = peat/moor formation; rapid humification = active humus in warm, moist soils",
        ]},
        { heading: "NITROGEN FIXATION", items: [
          "**Nitrogen fixation** — conversion of atmospheric N₂ to NH₃/NH₄⁺ by soil microorganisms, making nitrogen available to plants",
          "**Symbiotic fixation**: Rhizobium bacteria in root nodules of legumes (soybean, pea, bean) — most efficient; 50–200 kg N/ha/year",
          "**Free-living (asymbiotic) fixation**: Azotobacter (aerobic), Clostridium (anaerobic), Cyanobacteria (blue-green algae in waterlogged rice fields — very important in Bangladesh!)",
          "**Biological Nitrogen Fixation (BNF)** fixes ~200 million tons of N annually globally",
        ]},
        { heading: "SOIL MICROORGANISMS", items: [
          "Bacteria, fungi, actinomycetes, algae, protozoa — all contribute to decomposition and nutrient cycling",
          "**Bacteria**: most numerous; fix nitrogen, decompose organic matter",
          "**Fungi**: decompose lignin and cellulose; form mycorrhizae with plant roots (improve nutrient uptake)",
          "**Actinomycetes**: produce earthy smell of soil; decompose tough organic matter",
        ]},
        { heading: "SOIL FERTILITY vs. PRODUCTIVITY", items: [
          "**Soil fertility** — inherent capacity of soil to supply essential nutrients to plants in adequate amounts and proper proportions",
          "**Soil productivity** — capacity of soil to produce crops per unit area; includes fertility + management practices",
          "Fertile soil: pH 6.0–6.8, high organic matter, adequate N/P/K, good structure, active microorganisms, abundant topsoil",
        ]},
      ],
      diagram: "Draw the Humification Process as a flow chart: Dead Plant/Animal Material → Physical Fragmentation (by soil fauna) → Biochemical Decomposition (by bacteria/fungi) → Simple molecules (sugars, amino acids) → Synthesis/Condensation (microbial) → Humus (Humin + Humic Acid + Fulvic Acid). Add temperature and moisture as modifying factors.",
      bangladesh: "Cyanobacteria (blue-green algae) in flooded rice paddies of Bangladesh fix atmospheric nitrogen naturally, contributing to the nitrogen budget of rice cultivation without chemical fertilizers. This is especially important in traditional boro rice cultivation in the haor areas (Sylhet, Sunamganj, Netrokona).",
    },
    {
      num: 6, title: "SOIL CLASSIFICATION — Zonal/Azonal/Intrazonal and USDA Taxonomy",
      def: "Soil classification is the systematic grouping of soils into categories based on their common properties, genesis, and characteristics to facilitate understanding, communication, and land-use planning.",
      keyPoints: [
        "Two major systems: Traditional (Great Soil Groups) and Modern (USDA Soil Taxonomy)",
        "Great Soil Groups divide soils into **Zonal, Azonal, and Intrazonal** based on climate and profile development",
        "USDA Taxonomy (1960, revised) uses diagnostic horizons and identifies 12 soil orders",
        "Bangladesh has ~500 soil series identified by SRDI (Soil Resources Development Institute)",
      ],
      tables: [
        { caption: "Traditional Classification: Zonal, Azonal, Intrazonal",
          headers: ["Group", "Definition", "Examples"],
          rows: [
            ["**Zonal soils**", "Well-developed, mature soils with distinct horizons; reflect climate and vegetation of the region", "Laterite (tropics), Podzol (boreal), Chernozem (grasslands), Desert soils (arid)"],
            ["**Azonal soils**", "Young, undeveloped soils without distinct horizons; formed in transported or recently deposited parent material", "Alluvial soils (river deposits), Aeolian soils (wind deposits), Lithosols (skeletal soils on bare rock)"],
            ["**Intrazonal soils**", "Soils dominated by local factors (waterlogging, salt, organic matter) rather than climate", "Gley soils (wet), Saline soils (salt), Peat soils (organic), Rendzina (chalk/limestone)"],
          ]
        },
        { caption: "USDA Soil Taxonomy — 12 Soil Orders",
          headers: ["Order", "Key Feature", "Where Found"],
          rows: [
            ["**Oxisols**", "Highly weathered; rich in Fe/Al oxides; low CEC", "Tropical rainforests (Amazon, Congo)"],
            ["**Ultisols**", "Old, leached, red-yellow; argillic (clay) B horizon", "Humid subtropical (SE USA, SE Asia)"],
            ["**Alfisols**", "Moderate weathering; argillic B; high base saturation", "Temperate deciduous forests"],
            ["**Mollisols**", "Dark, soft A horizon; high organic matter; from grasslands", "Great Plains USA, Ukrainian steppe"],
            ["**Spodosols**", "Bleached E horizon + sesquioxide-rich Bhs horizon", "Boreal forests (podzolization)"],
            ["**Histosols**", ">20–30% organic matter; peat/muck soils", "Wetlands, bogs"],
            ["**Vertisols**", "High shrink-swell clay (smectite); deep cracks when dry", "Sub-humid/semi-arid (India, Sudan)"],
            ["**Aridisols**", "Dry soils; salt/gypsum accumulation", "Deserts"],
            ["**Entisols**", "Minimal soil development; no diagnostic horizons", "Recent alluvium, sandy deserts"],
            ["**Inceptisols**", "Young soils with some development; cambic B horizon", "**Bangladesh floodplains (most common!)**"],
            ["**Gelisols**", "Permafrost within 2 m", "Arctic/subarctic tundra"],
            ["**Andisols**", "From volcanic ash; amorphous minerals (allophane)", "Japan, Pacific Rim, Iceland"],
          ]
        },
      ],
      extra: [
        { heading: "Bangladesh Soil Classification", items: [
          "**SRDI** has identified ~500 soil series",
          "Main types: Floodplain soils (78.96%), Hill soils/Brown Hill Soils (12.69%), Terrace soils (8.35%)",
          "USDA classification: predominantly **Entisols** (young, recent alluvium) and **Inceptisols** (slightly developed floodplain soils); also Histosols (peat), Mollisols (Terai), Ultisols (hills), Alfisols (some areas)",
          "FAO equivalents: Fluvisols, Gleysols, Histosols, Luvisols",
        ]},
      ],
      diagram: "Draw a world map sketch. Label: (1) Tropical belt (10°N–10°S) = Oxisols/Laterite; (2) 10–30°N/S = Aridisols; (3) 30–50°N/S continental interiors = Mollisols; (4) 50–70°N = Spodosols; (5) Tundra (>70°N) = Gelisols; (6) Temperate humid = Alfisols/Ultisols.",
    },
    {
      num: 7, title: "BIOGEOGRAPHY — Definition, Scope, Development",
      def: "**Biogeography** is the scientific study of the spatial and temporal distribution of living organisms (plants and animals) across the Earth's surface, and the environmental, historical, and evolutionary factors that explain these distribution patterns.",
      keyPoints: [
        "Biogeography bridges biology, geography, ecology, geology, evolutionary biology, and palaeontology — it is an **interdisciplinary synthetic science**",
        "Two major branches: **Phytogeography** (plant distribution) and **Zoogeography** (animal distribution)",
        "**Nigel Pears** (1977): 'Biogeography implies a linkage between Biology and Geography. It studies the distribution of biological materials over the earth's surface and the factors responsible for the observed spatial variations.'",
        "**Alfred Russel Wallace** — regarded as the **'Father of Biogeography'**; developed Wallace's Line separating Asian and Australian faunal zones",
      ],
      extra: [
        { heading: "Development of Biogeography", items: [
          "**18th century**: Buffon observed that similar environments in different continents had different animal species → 'Buffon's Law' → founded biogeography",
          "**Alexander von Humboldt** — 'founder of plant geography'; developed concept of physique générale; showed relationship between climate and vegetation",
          "**Charles Darwin and Alfred Russel Wallace** — theory of evolution by natural selection explained distribution patterns",
          "**Continental drift theory (Wegener, 1912)** — explained why fossils of same species found on separated continents",
          "**Island Biogeography (MacArthur & Wilson, 1967)** — equilibrium theory of island species richness",
        ]},
        { heading: "Scope of Biogeography", items: [
          "Examine relationships between complex ecological systems and their spatial extent",
          "Analyse spatial and temporal distribution patterns of organisms",
          "Evaluate ecological potential of areas for given species",
          "Measure impact of human activities on species distribution and extinction",
          "Explore historical reasons for biotic dispersal patterns (using fossil records)",
          "Inform conservation and biodiversity management",
        ]},
      ],
    },
    {
      num: 8, title: "ECOSYSTEM — Definition, Components, Energy Flow",
      def: "An **ecosystem** is a functional unit of the biosphere consisting of all living organisms (biotic community) in a given area and the non-living physical environment (abiotic factors) interacting together through energy flow and nutrient cycling.",
      keyPoints: [
        "Term 'ecosystem' coined by **A.G. Tansley (1935)**",
        "Ecosystems are **open systems** — they exchange energy (sunlight in, heat out) and matter with surroundings",
        "Energy flow through ecosystems is **unidirectional** (cannot be recycled)",
        "Nutrient/matter cycling is **cyclical** (recycled within ecosystem)",
        "**Laws of thermodynamics** govern energy flow: energy cannot be created or destroyed; energy conversion is never 100% efficient",
      ],
      terms: [
        { heading: "ABIOTIC (Non-living) Components", items: [
          "**Climatic factors**: light, temperature, precipitation, wind",
          "**Edaphic factors**: soil type, pH, mineral content, topography",
          "**Inorganic substances**: CO₂, O₂, H₂O, N₂, mineral salts",
          "**Organic compounds**: carbohydrates, proteins, humus — link abiotic and biotic",
        ]},
        { heading: "BIOTIC (Living) Components", items: [
          "**Producers (Autotrophs)**: green plants, algae, cyanobacteria — fix solar energy via photosynthesis; form the base of all food chains",
          "**Primary consumers (Herbivores)**: eat plants (cow, deer, rabbit, grasshopper)",
          "**Secondary consumers (Carnivores)**: eat herbivores (fox, frog, snake)",
          "**Tertiary consumers (Top carnivores)**: eat secondary consumers (eagle, tiger, shark)",
          "**Decomposers (Saprotrophs)**: bacteria and fungi that break down dead organic matter and return nutrients to the soil",
        ]},
        { heading: "Energy Flow and Food Chain/Web", items: [
          "**Food Chain**: Plants → Herbivores → Carnivores → Top Carnivores → Decomposers",
          "**Food Web**: Interconnected network of multiple food chains; more realistic representation of feeding relationships",
          "**10% Law (Lindemann, 1942)**: Only **10% of energy** is transferred from one trophic level to the next; 90% is lost as heat through respiration, excretion, and incomplete digestion",
          "**Pyramid of Numbers**: number of organisms at each trophic level",
          "**Pyramid of Biomass**: total mass of organisms at each level",
          "**Pyramid of Energy**: energy content/flow at each level (always upright — 10% rule)",
        ]},
        { heading: "Types/Classification of Ecosystems", items: [
          "**Natural terrestrial**: Forest (tropical, temperate, boreal), Grassland, Desert, Wetland (pond, lake, river, estuary, mangrove)",
          "**Natural aquatic**: Marine (ocean, coral reef), Freshwater (lake, river, pond)",
          "**Artificial/Man-made**: Cropland, Plantation, Aquaculture, Urban ecosystem",
        ]},
      ],
      diagram: "Draw a Food Web Diagram for a grassland: Grass → Grasshopper → Frog → Snake → Eagle. Add side branch: Grass → Rabbit → Fox → Eagle. Show decomposers (bacteria/fungi) at bottom connecting to all. Then draw a Pyramid of Energy (wide base = producers, narrow top = top carnivores) with 10% labels at each level: 10,000 → 1,000 → 100 → 10 kcal.",
      bangladesh: "The **Sundarbans mangrove ecosystem** of Bangladesh/India is the world's largest mangrove ecosystem. It functions as a complete ecosystem: mangrove trees (producers) → crabs, molluscs, small fish (primary consumers) → larger fish, dolphins, deer (secondary consumers) → Bengal Tiger (apex predator). Decomposers recycle nutrients from fallen mangrove leaves into the soil and water.",
    },
    {
      num: 9, title: "GEOGRAPHICAL DISTRIBUTION OF PLANTS",
      def: "The geographical distribution of plants (phytogeography) refers to the patterns of plant species and communities across the Earth's surface, explained by environmental, historical, dispersal, and evolutionary factors.",
      keyPoints: [
        "Plant distribution is controlled by climatic, edaphic (soil), biotic, and topographic factors",
        "**Dispersal** allows plants to move from their place of origin; barriers prevent dispersal",
        "Global plant diversity is classified into **Floristic Kingdoms (Realms)**",
      ],
      terms: [
        { heading: "Environmental Factors for Plant Growth", items: [
          "**Light** — essential for photosynthesis; plants classified as: heliophytes (sun-loving), sciophytes (shade-loving); photoperiodism controls flowering (short-day, long-day, day-neutral plants)",
          "**Temperature** — determines latitudinal and altitudinal distribution; most plants grow between 6–35°C; vernalization (cold requirement for flowering)",
          "**Water/Precipitation** — most critical factor; plants range from hydrophytes (aquatic) to xerophytes (desert)",
          "**Wind** — affects transpiration, temperature, pollination, seed dispersal; strong winds = dwarfed vegetation",
          "**Soil (Edaphic factors)** — soil pH, texture, nutrient content, drainage affect which species grow",
          "**Biotic factors** — competition, herbivory, pollination, parasitism",
        ]},
        { heading: "Factors of Plant Dispersal", items: [
          "**Wind (Anemochory)** — winged seeds (maple), plumed seeds (dandelion/thistle), light dust seeds (orchids); effective over long distances",
          "**Water (Hydrochory)** — seeds float via rivers/ocean currents; coconut, mangrove propagules; explains island colonization",
          "**Animals (Zoochory)**: (a) **Epizoochory** — seeds attach to fur/feathers (burdock, grass awns); (b) **Endozoochory** — seeds eaten and dispersed in feces (berry fruits); (c) **Ornithochory** — by birds specifically",
          "**Gravity (Barochory)** — heavy fruits fall near parent plant; limited dispersal",
          "**Explosive mechanism (Autochory)** — plant ejects seeds by mechanical tension (touch-me-not, hazel)",
          "**Human (Anthropochory)** — intentional (agriculture) or accidental (weed seeds in crops, ballast water)",
        ]},
        { heading: "Types of Plant Distribution", items: [
          "**Endemic** — restricted to one specific geographic area (e.g., Rafflesia in Borneo/Sumatra)",
          "**Cosmopolitan** — distributed worldwide (e.g., Pteridium aquilinum — bracken fern)",
          "**Disjunct (Discontinuous)** — same species in widely separated areas (e.g., magnolia in eastern Asia and eastern North America)",
          "**Vicarious** — closely related species replacing each other in similar habitats in different regions",
        ]},
        { heading: "Floristic Kingdoms (Good's Classification — 6 Kingdoms)", items: [
          "**Holarctic Kingdom** — largest; northern hemisphere (North America + Europe + Asia north of Himalayas); characteristic plants: Pinus, Betula, Quercus",
          "**Paleotropical Kingdom** — tropical Africa, Asia (South/SE Asia including **Bangladesh**), Pacific; diverse tropical flora; characteristic: palms, figs, mangroves",
          "**Neotropical Kingdom** — Central and South America; Amazon basin; characteristic: bromeliads, cacti, rubber tree",
          "**Australian Kingdom** — Australia + New Zealand; highly endemic flora (~75% endemic); characteristic: Eucalyptus, Acacia, Proteaceae",
          "**South African (Capensis) Kingdom** — smallest but richest per unit area; SW tip of Africa; ~9000 species in small area",
          "**Antarctic Kingdom** — southern South America + sub-Antarctic islands; characteristic: Nothofagus (southern beech)",
        ]},
      ],
    },
    {
      num: 10, title: "BIOCHORE AND BIOMES",
      def: "A **biome** is a large-scale biogeographical unit characterized by a particular type of climate, vegetation, and associated animal life; a **biochore** is a larger unit that groups biomes together based on major ecological formations.",
      keyPoints: [
        "Term 'biome' coined by **Clements (1916)** as a synonym for biotic community",
        "**Biochore** — a major division of the biosphere based on formation class (similar life form/physiognomy of vegetation); broader than biome",
        "**Formation class** — a type of vegetation defined by its dominant plant life form",
        "Major biochores: Forest Biochore, Grassland Biochore, Desert Biochore, Tundra Biochore",
      ],
      tables: [
        { caption: "Characteristics of Major World Biomes",
          headers: ["Biome", "Location", "Climate", "Vegetation", "Animals", "Soil"],
          rows: [
            ["**Tropical Rainforest**", "Equatorial belt (0–10°N/S): Amazon, Congo, SE Asia", "25–30°C; >2000 mm/year; no dry season", "Multi-layered evergreen; lianas, epiphytes; extreme diversity", "Jaguar, toucan, anaconda (Americas); tiger, orangutan (SE Asia)", "Oxisol/Laterite — deep, red, nutrient-poor"],
            ["**Tropical Savanna**", "10–20°N/S: Sub-Saharan Africa, N. Australia, parts of India", "Distinct wet/dry seasons; 500–1500 mm/year; 20–30°C", "Tall grasses + scattered Acacia, Baobab; fire-adapted", "Wildebeest, zebra, giraffe, lion, elephant (Africa)", "Ferralsols/Oxisols; seasonal waterlogging then drought"],
            ["**Temperate Grassland**", "30–55°N/S: Prairies, Steppes, Pampas, Veld", "Semi-arid continental; hot summers, cold winters; 300–900 mm/year", "Dominated by grasses (Poa, Stipa, Festuca); few trees", "Bison, pronghorn (N. America); saiga antelope (Eurasia)", "**Mollisols (Chernozem)** — extremely fertile dark soils"],
            ["**Desert**", "20–35°N/S: Sahara, Arabian, Gobi, Atacama, Sonoran", "Rainfall <250 mm/year; extreme temperature range; high evaporation", "Sparse xerophytes — cacti, succulents, thorny shrubs; CAM photosynthesis", "Camel, fennec fox, jerboa, rattlesnake; nocturnal behavior", "Aridisols; alkaline; salt accumulation; low organic matter"],
            ["**Tundra**", ">66.5°N (Arctic); also Alpine tundra on high mountains", "Mean −10 to −20°C; <250 mm/year; permafrost; growing season 6–10 weeks", "NO TREES; dwarf shrubs (willow, birch), sedges, Sphagnum mosses, lichens", "Caribou, musk ox, arctic fox, lemming, snowy owl, polar bear", "**Gelisols** — permafrost; thin active layer; waterlogged in summer; peat accumulation"],
            ["**Temperate Deciduous Forest**", "E. North America, W. Europe, E. Asia", "Seasonal −5 to 30°C; 700–1500 mm/year; 4 distinct seasons", "Deciduous broadleaf trees (oak, maple, beech); 3–5 layered structure", "Deer, bear, fox, squirrel, woodpecker, salamander", "Alfisols/Brown forest soils; moderate organic matter; good fertility"],
            ["**Boreal Forest (Taiga)**", "50–70°N: Canada, Scandinavia, Russia (largest biome)", "Cold; 300–900 mm/year; long cold winters, brief warm summers", "Coniferous trees (spruce, fir, pine, larch); needle-like leaves; evergreen", "Moose, wolf, lynx, wolverine, brown bear, crossbill", "**Spodosols (Podzols)**; very acidic; bleached E horizon"],
          ]
        },
      ],
      diagram: "Draw a simplified world map. Equatorial band (0–10°N/S) = Tropical Rainforest (green). Above and below (10–25°N/S) = Tropical Savanna (tan). At 25–35°N/S on western continents = Mediterranean (olive). In continental interiors = Desert (yellow). At 30–50°N/S = Temperate Grassland (pale yellow). At 40–60°N on western coasts = Temperate Deciduous Forest (light green). At 50–70°N = Boreal/Taiga (dark green). At 70°N+ = Tundra (pale blue). Poles = Ice/Polar (white).",
    },
    {
      num: 11, title: "DYNAMICS OF VEGETATION — Plant Succession",
      def: "**Plant succession** is the sequential, directional, and predictable change in species composition and community structure of vegetation over time in response to environmental changes, ultimately leading to a stable climax community.",
      keyPoints: [
        "Succession is driven by the fact that organisms modify their own environment, making it suitable for other species and unsuitable for themselves",
        "Ultimate endpoint = **climax community** — the most stable vegetation type for that climate",
        "Succession can be very slow (lithosere on bare rock: hundreds to thousands of years) or relatively fast (secondary succession after fire: decades)",
        "Pioneer species → transitional seral communities → climax",
      ],
      extra: [
        { heading: "Types of Succession", items: [
          "**Primary succession** — begins on bare, sterile substrate with no prior soil (bare rock, sand dune, lava flow, newly formed lake); slow process; starts from absolute zero",
          "**Secondary succession** — begins on disturbed area that previously had vegetation and retains soil and seed bank (abandoned farmland, cleared forest, burned grassland); much faster than primary",
        ]},
        { heading: "Forms of Succession (by Moisture Regime)", items: [
          "**Xerosere** — succession on dry, well-drained surfaces; begins with drought-tolerant pioneers",
          "**Lithosere** — on bare rock; pioneers are crustose lichens → foliose lichens → mosses → herbs → shrubs → trees (forest)",
          "**Psammosere** — on sand dunes; pioneers are marram grass → shrubs → woodland",
          "**Hydrosere** — succession in open water (pond/lake); progresses from aquatic to terrestrial community",
          "**Halosere** — succession in salt marsh/coastal habitats",
        ]},
        { heading: "Hydrosere Succession Stages (Most Commonly Examined!)", subSections: [
          { heading: "Stage 1 — Phytoplankton Stage", paras: ["Open deep water colonized by free-floating algae, phytoplankton, and submerged aquatic plants (Chara, Nitella); organic matter begins accumulating on lake bed"] },
          { heading: "Stage 2 — Submerged Aquatic Stage", paras: ["Water becomes shallower; rooted submerged plants appear (Potamogeton — pondweed, Myriophyllum — water milfoil); sediment accumulation accelerates"] },
          { heading: "Stage 3 — Floating-leaf Stage", paras: ["Water shallower; floating leaf plants appear (Nymphaea — water lily, Nelumbo — lotus); reduce light to submerged species below"] },
          { heading: "Stage 4 — Reed/Swamp Stage", paras: ["Very shallow water; emergent aquatic plants (Phragmites — common reed, Typha — cattail/bulrush); roots trap more sediment; water table at or above soil surface"] },
          { heading: "Stage 5 — Marsh/Fen Stage", paras: ["Waterlogging decreases; sedge-meadow community (Carex spp.); organic peat accumulates; soil begins forming"] },
          { heading: "Stage 6 — Shrub/Carr Stage", paras: ["Shrubs tolerant of wet soils (willow — Salix spp., alder — Alnus); further drying; peat continues accumulating"] },
          { heading: "Stage 7 — Woodland/Forest Stage (Climax)", paras: ["Full forest canopy (oak forest in temperate climates, or tropical forest in tropics); water table well below surface; fully terrestrial ecosystem. **KEY POINT**: Each stage makes the environment less suitable for itself but more suitable for the next seral stage — self-replacement drives succession forward."] },
        ]},
        { heading: "Lithosere Stages (Primary Succession on Rock)", items: [
          "**Stage 1**: Bare rock — pioneer crustose lichens (physically and chemically weather rock)",
          "**Stage 2**: Foliose lichens (more complex; add organic matter)",
          "**Stage 3**: Mosses (thicker organic layer; soil begins forming)",
          "**Stage 4**: Annual herbs and grasses (thin soil)",
          "**Stage 5**: Perennial herbs and ferns",
          "**Stage 6**: Shrubs (deeper rooting; more soil organic matter)",
          "**Stage 7**: Pioneer tree species (birch, pine)",
          "**Stage 8**: Climax forest (oak, beech, or tropical forest depending on climate)",
        ]},
      ],
      diagram: "Draw Hydrosere as a cross-section diagram from left (open water, deep) to right (forest, dry land): Far left: Deep water → Phytoplankton/algae | Left: Shallow water → Submerged plants (Potamogeton) | Center-left: Very shallow → Floating leaves (Nymphaea) | Center: Emergent zone → Reeds (Phragmites, Typha) | Center-right: Marsh → Sedges | Right: Shrub carr (Salix, Alnus) | Far right: Climax forest (Oak). Show water level decreasing left to right with arrow showing direction of succession.",
      bangladesh: "Bangladesh haors (large seasonal lakes in Sylhet region, especially Hakaluki Haor, Tanguar Haor) show hydrosere succession in miniature. During dry season, the haors partially dry out; aquatic vegetation retreats to deeper areas and emergent vegetation (water hyacinth, reeds) colonizes shallow zones. Annual floods reset the succession process.",
    },
    {
      num: 12, title: "ZOOGEOGRAPHY — Animal Dispersal and Realms",
      def: "**Zoogeography** is the branch of biogeography that studies the spatial distribution of animal species and populations, the factors controlling their distribution, and the historical processes (continental drift, dispersal, vicariance) that shaped present patterns.",
      keyPoints: [
        "**Alfred Russel Wallace** is the 'Father of Zoogeography' (and biogeography)",
        "Wallace's most famous contribution: **Wallace's Line** — sharp boundary between Oriental and Australasian faunal regions in SE Asia",
        "Two main processes: **Dispersal** (active movement) and **Vicariance** (populations separated by geographic barriers)",
        "Continental drift is the primary historical explanation for disjunct distributions",
      ],
      extra: [
        { heading: "Animal Dispersal and Migration", items: [
          "**Dispersal** — permanent one-way movement of individuals from one area to another; establishes new populations",
          "**Active dispersal** — animal moves on its own (walking, swimming, flying)",
          "**Passive dispersal** — carried by currents (water, wind), rafting on vegetation mats, or transported by humans",
          "**Geographical barriers**: mountains, oceans, deserts, rivers",
          "**Ecological barriers**: unsuitable climate, habitat, or food",
          "**Migration** — regular, seasonal, two-way movement between areas, usually for breeding or food",
          "**Bird migration**: Arctic tern (Arctic to Antarctic and back — longest migration ~90,000 km/year)",
          "**Fish migration**: Hilsa fish in Bangladesh (from Bay of Bengal up rivers to breed)",
        ]},
      ],
      tables: [
        { caption: "The Six Major Zoogeographical Realms (Wallace's Classification)",
          headers: ["Realm", "Location", "Key Animals", "Characteristic"],
          rows: [
            ["**1. Palearctic**", "Europe, Asia north of Himalayas, North Africa, Siberia, Japan", "Brown bear, wolf, lynx, red deer, mole, many migratory birds", "Largest realm; many species shared with Nearctic (combined = Holarctic)"],
            ["**2. Nearctic**", "North America (north of tropical Mexico), Greenland", "Bison, pronghorn antelope, prairie dog, grizzly bear, American alligator", "Many species shared with Palearctic; unique endemics: pronghorn, American alligator"],
            ["**3. Neotropical**", "Central America, South America, Caribbean Islands", "Jaguar, tapir, giant anteater, sloth, capybara, llama, anaconda, toucan, macaw, hummingbird", "Richest realm in species diversity; evolved in long isolation"],
            ["**4. Ethiopian (Afrotropical)**", "Africa south of Sahara, Madagascar, southern Arabian Peninsula", "Elephant, rhinoceros, hippopotamus, giraffe, zebra, lion, gorilla, chimpanzee, ostrich", "Very high mammal diversity; Madagascar = highly endemic (lemurs, fossas)"],
            ["**5. Oriental**", "South Asia (India, **Bangladesh**, Sri Lanka), SE Asia west of Wallace's Line, S. China, Philippines", "Asian elephant, tiger, leopard, orangutan, gibbon, Indian rhinoceros, king cobra, peacock, mugger crocodile", "**Bangladesh is in this realm!** Bengal tiger, Irrawaddy dolphin, Gangetic dolphin, saltwater crocodile"],
            ["**6. Australasian**", "Australia, New Zealand, New Guinea, Pacific Islands, Indonesia east of Wallace's Line", "Kangaroo, koala, platypus (egg-laying!), echidna, Tasmanian devil, cassowary, emu, kiwi, birds-of-paradise", "Most distinctive fauna; dominated by marsupials and monotremes; isolated since Mesozoic era"],
          ]
        },
      ],
      extra: [
        { heading: "Wallace's Line", items: [
          "Imaginary line drawn by Alfred Russel Wallace separating Oriental (Asian) fauna from Australasian fauna",
          "Runs through the Lombok Strait (between Bali and Lombok), then through the Makassar Strait (between Borneo and Sulawesi)",
          "East of the line = kangaroos, marsupials, birds-of-paradise (Australasian)",
          "West of the line = tigers, elephants, orangutans, gibbons (Oriental)",
          "Deep water trenches prevented mixing of fauna during Pleistocene ice ages (land bridges did not form here)",
        ]},
      ],
      diagram: "Draw a rough outline world map. Draw and label the 6 realms: Palearctic (Eurasia + N. Africa), Nearctic (N. America), Neotropical (S. + Central America), Ethiopian (Sub-Saharan Africa), Oriental (S/SE Asia), Australasian (Australia + New Guinea). Draw a bold dotted line through SE Asia = Wallace's Line. Write 2–3 key animals for each realm directly on the map.",
    },
    {
      num: 13, title: "SOIL PROFILE — Horizons and Characteristics",
      def: "A **soil profile** is a vertical cross-section of soil from the surface down to the parent rock, revealing a sequence of distinct horizontal layers (horizons) that differ in color, texture, structure, and chemical composition.",
      keyPoints: [
        "Soil horizons are designated by capital letters: O, A, E, B, C, R",
        "All horizons together = soil profile; the A + B horizons = **solum** (the true soil)",
        "Soil profile development requires time — typically 2,000–10,000 years for a full profile",
        "Profile depth ranges from a few cm (shallow mountain soils) to several metres",
        "Mature temperate soils have 3–4 horizons; tropical soils may have just 1–2",
      ],
      tables: [
        { caption: "The Major Soil Horizons",
          headers: ["Horizon", "Name", "Characteristics"],
          rows: [
            ["**O**", "Organic horizon", "Surface layer of plant litter and organic debris; largely undecomposed; absent in grasslands; found in forests"],
            ["**A**", "Topsoil", "Mineral horizon with most organic matter; dark colored (humus); highest biological activity; zone of ELUVIATION (washing out); also called 'biomantle'"],
            ["**E**", "Eluvial horizon", "Strongly leached of clay, iron, Al oxides; pale/light colored (quartz-rich); found between A and B in podzolized soils; zone of maximum leaching"],
            ["**B**", "Subsoil", "Zone of ILLUVIATION (deposition from above); accumulates clay, iron oxides, humus, carbonates; brown/reddish color; lower biological activity"],
            ["**C**", "Parent material", "Partially weathered rock; little affected by pedogenic processes; retains rock structure; may contain CaCO₃ or gypsum in arid soils"],
            ["**R**", "Bedrock", "Unweathered, consolidated rock; cannot be excavated by hand"],
          ]
        },
      ],
      extra: [
        { heading: "Suffix Letters (Lower-case) Added to Horizons", items: [
          "**g** = gleying (reduced Fe; grey/blue color)",
          "**k** = accumulation of calcium carbonate",
          "**h** = illuvial organic matter",
          "**s** = sesquioxide accumulation",
          "**t** = clay accumulation (argillic horizon)",
          "**p** = plowed/disturbed (e.g., Ap = plowed A horizon)",
        ]},
      ],
      diagram: "ESSENTIAL — Draw this in EVERY soil profile question",
      diagramCode: `SURFACE OF EARTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  O HORIZON (2–5 cm)                │ Dark brown/black organic litter; leaves, twigs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  A HORIZON (10–30 cm)              │ Dark, humus-rich topsoil; most biological activity;
│                                    │ zone of eluviation; root concentration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  E HORIZON (5–20 cm)               │ Light grey/pale; leached of clay, Fe, Al;
│                                    │ mostly quartz; present in podzols
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  B HORIZON (20–50 cm)              │ Brown/red-brown; illuvial zone;
│                                    │ accumulates clay, Fe oxides, humus; subsoil
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  C HORIZON (50+ cm)                │ Partially weathered parent material;
│                                    │ some rock structure visible
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│  R HORIZON                         │ Unweathered bedrock / parent rock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
↓ Eluviation (A→E→B) — materials move downward; accumulate in B horizon`,
    },
  ], []);
}

// ─── DATA: ANSWERS ────────────────────────────────────────────────────────────
function useAnswers() {
  return useMemo(() => [
    {
      tag: "Section A — 20 Marks",
      q: "A1. What are the major components of soil? How is soil formed? Describe in detail the functions of soil in an ecosystem.",
      sections: [
        { heading: "Introduction", level: 2, paras: ["Soil is the biologically active, porous natural body that occupies the uppermost layer of the Earth's crust. It is formed through the long-term interaction of climate, organisms, topography, parent material, and time. Soil is considered the 'skin of the Earth' and serves as the interface between the lithosphere, hydrosphere, atmosphere, and biosphere."] },
        { heading: "I. Major Components of Soil", level: 2, paras: ["Soil consists of four major components whose proportions determine its character. In an ideal mineral soil, these components by volume are approximately: **45% mineral matter, 5% organic matter, 25% water, and 25% air**."] },
        { heading: "1. Mineral (Inorganic) Matter (~45%)", level: 3, paras: ["Mineral particles are inorganic materials derived from the physical and chemical weathering of parent rocks. They are classified by particle size: **Sand** (2.0–0.05 mm): coarse, visible to the naked eye; low water-holding capacity; dominantly quartz. **Silt** (0.05–0.002 mm): smooth/silky feel when moist; moderate water retention. **Clay** (<0.002 mm): finest; extremely high surface area; very high water-holding and nutrient-holding capacity; plastic and sticky when wet. The relative proportions of sand, silt, and clay determine **soil texture**, which is the most fundamental physical property of soil."] },
        { heading: "2. Organic Matter (~5%)", level: 3, paras: ["Soil organic matter (SOM) includes plant and animal residues in various stages of decomposition, living and dead microbial biomass, and highly transformed humic substances. Though comprising only ~5% by volume, organic matter disproportionately influences soil fertility, structure, water retention, and nutrient cycling. **Humus** — the stable, dark-coloured fraction of SOM — is particularly important for binding soil particles into aggregates and supplying nutrients."] },
        { heading: "3. Soil Water (~25%)", level: 3, paras: ["Water occupies the pore spaces between solid particles. It exists as the **soil solution** — a complex mixture of water and dissolved mineral and organic ions essential for plant nutrition. Water categories include gravitational water (drains freely), capillary/available water (held at field capacity; accessible to plant roots), and hygroscopic water (tightly bound to particle surfaces; unavailable to plants)."] },
        { heading: "4. Soil Air (~25%)", level: 3, paras: ["Air occupies pore spaces not filled by water. Soil air differs from atmospheric air: it has higher CO₂ (0.3–3%) and lower O₂ due to respiration by roots and microorganisms. Adequate soil aeration is essential for aerobic microbial activity and root respiration."] },
        { diagram: "Draw the four-component circle diagram — 45% Mineral, 5% Organic, 25% Water, 25% Air with labelled proportions." },
        { heading: "II. How is Soil Formed? (CLORPT Factors)", level: 2, paras: ["Soil formation, or **pedogenesis**, is the result of the long-term interaction of five soil-forming factors (Jenny, 1941): S = f(C, L, O, R, P, T).", "**Climate (C)** is arguably the most important factor. Temperature and precipitation control the rate and type of weathering, the amount of organic matter that accumulates, and the intensity of leaching.", "**Living organisms (L)** contribute through the addition of organic matter, biological weathering (root acids), nitrogen fixation by bacteria, and physical mixing (bioturbation) by earthworms and burrowing animals.", "**Organic matter (O)** accumulates as organisms die and decompose, building the humus layer that darkens soil, improves structure, and increases fertility.", "**Relief/Topography (R)** controls water drainage and erosion. Steep slopes develop thin, immature soils; flat areas develop deeper, more mature profiles.", "**Parent material (P)** provides the initial minerals. Granite weathers into sandy, acidic soils; limestone produces calcareous, alkaline soils; alluvium produces rich floodplain soils (as in Bangladesh).", "**Time (T)** determines the degree of profile development. Young soils (Entisols) show little horizon differentiation; mature soils (Oxisols, Mollisols) show well-developed profiles."] },
        { heading: "III. Functions of Soil in Ecosystem", level: 2, items: [
          "**Medium for Plant Growth:** Soil provides plants with physical anchorage, supplies water, air, temperature moderation, and mineral nutrients. Without soil, terrestrial plant life would be impossible.",
          "**Water Storage, Filtration, and Purification:** Soil acts as a giant sponge, absorbing rainfall, storing it in pores, and releasing it gradually to plant roots and groundwater. In doing so, it filters out pollutants, pathogens, and sediments. This function prevents flooding and maintains water quality.",
          "**Modifier of the Atmosphere:** Soil is the largest surficial carbon reservoir on Earth. It typically absorbs O₂ and CH₄, and releases CO₂ and N₂O. As global temperatures rise, increased microbial activity may release more CO₂ — a significant feedback in climate change.",
          "**Habitat for Organisms and Centre of Biodiversity:** A single handful of soil contains billions of microorganisms belonging to thousands of species. Bacteria, fungi, actinomycetes, protozoa, earthworms, and arthropods all make soil their home and perform vital ecological functions.",
          "**Recycling System for Nutrients and Organic Wastes:** Soil microorganisms decompose dead organic matter, releasing mineral nutrients (N, P, K, S) back into bioavailable forms for plant uptake. Without decomposers in soil, organic matter would accumulate, nutrients would be locked up, and plant growth would cease.",
          "**Source of Raw Materials and Cultural Heritage:** Soil provides clay for pottery, brick-making, and construction. Topsoil preserves archaeological records. Soil serves as the platform for all human settlements, infrastructure, and agriculture.",
        ]},
        { bd: "Bangladesh's food security depends almost entirely on its alluvial floodplain soils (formed by the GBM river system), which perform all six functions: they support rice cultivation, filter floodwaters, store carbon in Sundarbans mangrove soils, host microbial communities that decompose rice straw, and have been the foundation of Bengali civilization for millennia." },
        { heading: "Conclusion", level: 2, paras: ["Soil is far more than 'dirt' — it is a complex, dynamic system that is fundamental to life on Earth. Its four components, formed over millennia through CLORPT factors, enable it to perform irreplaceable ecological functions ranging from plant growth to climate regulation."] },
      ],
    },
    {
      tag: "Section A — 20 Marks",
      q: "A2. What is the pedogenic process? How is a soil profile developed? Describe the soil profile identifying the characteristics of each layer with a figure.",
      sections: [
        { heading: "Introduction", level: 2, paras: ["Pedogenic processes are the specific soil-forming processes that occur within a developing soil profile, causing the differentiation of the parent material into distinct horizons with different chemical, physical, and biological properties."] },
        { heading: "I. The Five Major Pedogenic Processes", level: 2, items: [
          "**1. LATERIZATION**: In hot, humid tropical climates, intense chemical weathering dissolves silica (SiO₂) and leaches it away, while iron and aluminium sesquioxides (Fe₂O₃, Al₂O₃) concentrate. Result: **Laterite/Oxisol** — deep, red-yellow soil. Location: Congo Basin, Amazon Basin, SE Asia, parts of India. Example: Red, iron-rich soils of tropical West Africa used for bauxite mining.",
          "**2. PODZOLIZATION**: Under cool, humid coniferous forests, organic acids (fulvic acids) from decomposing needle litter chelate and transport iron, aluminium, and humus downward, creating a bleached E horizon and an iron/humus-enriched Bhs horizon. Result: **Podzol (Spodosol)**. Location: Boreal forests of Scandinavia, Russia, Canada.",
          "**3. CALCIFICATION**: In semi-arid grasslands, evapotranspiration exceeds precipitation. CaCO₃ dissolved in rainfall percolates downward but is re-deposited at depth when water evaporates, forming a calcic horizon (caliche). Result: **Mollisol (Chernozem)** — dark, humus-rich topsoil with CaCO₃ at depth. Location: Great Plains USA, Ukrainian steppes.",
          "**4. GLEIZATION**: In waterlogged, oxygen-deficient conditions, anaerobic bacteria reduce ferric iron (Fe³⁺, reddish) to ferrous iron (Fe²⁺, mobile), giving the soil grey-blue-green mottled colouration. Result: **Gley soil (Gleysol)**. Location: Floodplains, wetlands — **Bangladesh haors and beels**, Netherlands, Mississippi Delta.",
          "**5. SALINIZATION**: In arid regions, high evaporation draws saline groundwater upward by capillary action, depositing soluble salts at or near the soil surface. Result: **Solonchak** — white salt crust, alkaline (pH 8.5–10). Location: Middle East irrigated areas, Indus Valley, **coastal Bangladesh**.",
        ]},
        { heading: "II. Development of Soil Profile", level: 2, items: [
          "**Phase 1 — Regolith Phase:** Physical and chemical weathering break down parent rock into loose, unconsolidated material. No distinct horizons exist. (Entisol stage)",
          "**Phase 2 — Organic Matter Accumulation:** Pioneer organisms colonize the surface; organic matter begins accumulating; a rudimentary A horizon forms.",
          "**Phase 3 — Eluviation and Illuviation:** As the soil matures, water movement leaches materials downward from the A horizon, depositing them in the B horizon. This differentiation of A and B horizons is the key step in profile development.",
          "**Phase 4 — Mature Profile:** Full O-A-E-B-C-R horizon sequence develops. The specific properties of each horizon reflect the dominant pedogenic process(es).",
        ]},
        { heading: "III. The Soil Profile — Characteristics of Each Layer", level: 2, paras: ["[DIAGRAM — ESSENTIAL: Draw the following in the exam]"] },
        { code: `SURFACE OF EARTH
═══════════════════════════════════════════════════════
│ O HORIZON (Organic — 2–5 cm)                       │
│ LITTER: Leaf litter, plant debris — partly/fully   │
│ decomposed; dark brown/black                        │
═══════════════════════════════════════════════════════
│ A HORIZON (Topsoil — 10–30 cm)                     │
│ ELUVIATION zone; dark (humus-mixed); most roots    │
│ here; highest biological activity                   │
═══════════════════════════════════════════════════════
│ E HORIZON (Eluvial — 5–20 cm)                      │
│ LEACHING zone (podzolized soils); pale grey/white;  │
│ depleted of clay, Fe, Al; quartz-rich               │
═══════════════════════════════════════════════════════
│ B HORIZON (Subsoil — 20–60 cm)                     │
│ ILLUVIATION zone; brown/reddish; receives           │
│ materials from above; few roots; less organic       │
═══════════════════════════════════════════════════════
│ C HORIZON (50–100+ cm)                             │
│ PARENT MATERIAL; partially weathered rock; little  │
│ biological activity; no pedogenic alteration        │
═══════════════════════════════════════════════════════
│ R HORIZON (Bedrock)                                │
│ Solid, unweathered, consolidated bedrock;          │
│ cannot be dug by hand                               │
═══════════════════════════════════════════════════════
Suffix letters: g=gleying; k=carbonate; h=humus; s=sesquioxide; t=clay; p=plowed` },
        { heading: "Conclusion", level: 2, paras: ["Pedogenic processes transform inert parent rock into a biologically active, layered soil profile through the differential movement and transformation of materials. The five key processes each produce distinctive profile types adapted to different climatic and geographic conditions."] },
      ],
    },
    {
      tag: "Section A — 20 Marks",
      q: "A3. Define biochore and biome. Discuss the salient characteristics of major biomes of the world.",
      sections: [
        { heading: "Introduction", level: 2, paras: ["The biosphere is organized into increasingly large ecological units. Biomes represent the major recognizable units of world vegetation and associated fauna shaped primarily by climate."] },
        { heading: "I. Definition of Biochore", level: 2, paras: ["A **biochore** is a major ecological division of the biosphere, defined by its dominant **formation class** — the characteristic life form and physiognomy (outward appearance) of the dominant vegetation. The term is broader than 'biome' and groups together biomes with similar structural characteristics. The four major biochores are: (1) **Forest Biochore** — dominated by trees; includes tropical rainforest, temperate deciduous forest, boreal forest. (2) **Grassland/Savanna Biochore** — dominated by grasses with few or no trees. (3) **Desert Biochore** — extremely sparse vegetation; dominated by drought-adapted plants. (4) **Tundra Biochore** — treeless, cold; dominated by mosses, lichens, sedges, dwarf shrubs."] },
        { heading: "II. Definition of Biome", level: 2, paras: ["A **biome** is a large regional ecosystem characterized by a distinct type of climate, a specific type of vegetation, and associated animal communities. The term was coined by **Frederick Clements in 1916**. Biomes are defined primarily by climate (especially temperature and precipitation) and vegetation structure, not by specific species composition."] },
        { diagram: "Draw simplified World Biome Map — latitudinal zones from equator to poles: Tropical Rainforest (equatorial) → Savanna → Desert → Temperate Grassland → Temperate Forest → Boreal/Taiga → Tundra → Ice caps." },
        { heading: "III. Salient Characteristics of Major World Biomes", level: 2, items: [
          "**1. Tropical Rainforest**: Location: 0–10°N/S (Amazon, Congo, SE Asia). Climate: 25–30°C; >2000 mm/year rain; no dry season. Vegetation: multi-layered evergreen; extreme species diversity; epiphytes, lianas. Animals: jaguar, toucan, anaconda (Americas); tiger, orangutan (SE Asia). Soil: Oxisol/Laterite — nutrient-poor despite lush biomass. Key: highest net primary productivity (~2200 g/m²/year).",
          "**2. Tropical Savanna**: Location: 5–20°N/S (Sub-Saharan Africa, N. Australia, Brazil). Climate: distinct wet/dry seasons; 500–1500 mm/year; 20–30°C. Vegetation: tall grasses + scattered Acacia, Baobab; fire-adapted. Animals: wildebeest, zebra, giraffe, lion, elephant. Soil: Ferralsol; seasonal waterlogging.",
          "**3. Temperate Grassland**: Location: 35–55°N/S continental interiors (Prairies, Steppes, Pampas, Veld). Climate: semi-arid continental; 300–900 mm/year; hot summers, cold winters. Vegetation: grasses (Poa, Stipa, Festuca); sod-forming; few trees. Animals: bison, pronghorn (N. America); saiga (Eurasia). Soil: **Mollisol (Chernozem)** — extremely fertile dark soils; best agricultural soils.",
          "**4. Desert**: Location: 20–35°N/S (Sahara, Arabian, Gobi, Atacama). Climate: <250 mm/year; extreme temperature range; high evaporation. Vegetation: sparse xerophytes — cacti, succulents, thorny shrubs; CAM photosynthesis. Animals: camel, fennec fox, jerboa; nocturnal behavior; water conservation. Soil: Aridisol — alkaline; salt/gypsum accumulation.",
          "**5. Tundra**: Location: >66.5°N (Alaska, Siberia, N. Canada, Greenland). Climate: mean −10 to −20°C; <250 mm/year; **permafrost**; growing season 6–10 weeks. Vegetation: **NO TREES**; dwarf shrubs (willow, birch), sedges (Carex), Sphagnum mosses, lichens. Animals: caribou, musk ox, arctic fox, lemming, snowy owl, polar bear. Soil: **Gelisol** — thin active layer; waterlogged in summer; peat accumulation. Climate threat: permafrost thaw releases CO₂ and CH₄ → positive climate feedback.",
          "**6. Temperate Deciduous Forest**: Location: E. North America, W. Europe, E. Asia. Climate: seasonal; 700–1500 mm/year; 4 distinct seasons. Vegetation: deciduous broadleaf trees (oak, maple, beech); 3–5 layered structure; shed leaves in autumn. Animals: deer, bear, fox, squirrel, woodpecker. Soil: Alfisols/Brown forest soils.",
          "**7. Boreal Forest (Taiga)**: Location: 50–70°N (Russia, Canada, Scandinavia — largest terrestrial biome). Climate: cold; 300–900 mm/year; long winters. Vegetation: coniferous trees (spruce, fir, pine, larch); needle-like leaves; evergreen. Animals: moose, wolf, lynx, wolverine, brown bear. Soil: **Spodosol (Podzol)** — very acidic; bleached E horizon.",
        ]},
        { heading: "Conclusion", level: 2, paras: ["World biomes represent the grand synthesis of climate, soil, vegetation, and animal life at the landscape scale. Their spatial arrangement reflects the fundamental relationship between the physical environment and biological communities. Understanding biomes is essential for conservation planning, predicting climate change impacts, and sustainable land use management."] },
      ],
    },
    {
      tag: "Section A — 20 Marks",
      q: "A4. Define soil. Describe the physical properties of soil with appropriate figures.",
      sections: [
        { heading: "Introduction", level: 2, paras: ["Soil is defined as the biologically active, porous natural body formed in the uppermost layer of the Earth's crust through the weathering of parent rock material and the accumulation and transformation of organic matter, under the influence of climate, organisms, topography, and time. Dokuchaev defined soil as 'a natural body essentially composed of minerals and organic constituents having a distinct genesis and nature of its own.'"] },
        { heading: "Physical Properties of Soil", level: 2, paras: ["The physical properties of soil describe its external, measurable characteristics — form, composition, and behavior — that can be observed and measured without chemical analysis. In order of decreasing importance: **texture, structure, colour, bulk density, porosity, consistency, temperature, and resistivity**."] },
        { heading: "1. Soil Texture", level: 3, paras: ["**Definition:** Soil texture is the relative proportion (by weight) of the three primary particle size fractions — sand, silt, and clay — in a soil."] },
        { table: { headers: ["Separate", "Diameter (mm)", "Feel"], rows: [["Sand", "2.0–0.05", "Coarse, gritty; visible to naked eye; no plasticity"], ["Silt", "0.05–0.002", "Smooth, floury; silky when moist; some plasticity"], ["Clay", "<0.002", "Sticky, plastic; very high surface area; swells when wet"]] } },
        { paras: ["**Significance:** Texture controls water infiltration, water-holding capacity, aeration, nutrient retention, drainage, workability, and erosion resistance. Sandy soils drain quickly; clay soils hold water but have poor aeration; **loam** (~40% sand + 40% silt + 20% clay) is ideal for agriculture."] },
        { diagram: "DIAGRAM 1 — USDA Soil Texture Triangle: Draw an equilateral triangle with % Clay (left axis 0–100), % Silt (base, 0–100), % Sand (right axis, 0–100). Mark 'Loam' zone at approximately 40% sand, 40% silt, 20% clay in the center-lower area. Also mark Sandy Loam, Clay, Silty Clay, Sandy Clay Loam zones." },
        { heading: "2. Soil Structure", level: 3, paras: ["**Definition:** Soil structure is the arrangement and aggregation of soil particles into larger units called **peds** or **aggregates**, separated by pore spaces."], items: [
          "**Granular** — rounded aggregates 1–5 mm; common in A horizons; ideal for aeration and drainage",
          "**Blocky (angular/subangular)** — cube-like peds; common in B horizons; good for water movement",
          "**Platy** — horizontal layered peds; impedes vertical water movement; found in compacted soils and E horizons",
          "**Prismatic/Columnar** — vertical prisms; found in B horizons of sodic soils; Vertisols",
          "**Massive** — no visible peds; dense, compacted; poor aeration",
          "**Binding agents:** humus, calcium compounds, iron oxides, fungal hyphae, plant roots, microbial polysaccharides",
        ]},
        { diagram: "DIAGRAM 2 — Soil Structure Types: Draw simple sketches of Granular (small rounded clumps), Blocky (cube shapes), Platy (flat horizontal slabs), Prismatic (tall vertical columns), Massive (no structure visible)." },
        { heading: "3. Soil Colour", level: 3, paras: ["Soil colour is determined using the **Munsell Colour System** with three attributes: **Hue** (dominant wavelength), **Value** (lightness 0–10), **Chroma** (colour intensity 0–8+)."] },
        { table: { headers: ["Colour", "Indicates"], rows: [["Black/dark brown", "High organic matter content (humus); Chernozem A horizons"], ["Red/yellow-brown", "Iron oxide (Fe₂O₃/FeOOH); well-drained, aerobic conditions; laterite"], ["Grey/blue-green", "Reduced iron (Fe²⁺); waterlogging; gleying"], ["White", "Calcium carbonate, gypsum, or soluble salt accumulation"], ["Pale/bleached", "Leaching/eluviation; E horizon of podzols"]] } },
        { heading: "4. Bulk Density and Particle Density", level: 3, items: [
          "**Particle density (ρs)** = mass of soil solids ÷ volume of soil solids = typically **2.60–2.75 g/cm³** (nearly constant)",
          "**Bulk density (ρb)** = mass of dry soil ÷ total soil volume (includes pores) = typically **1.1–1.4 g/cm³** for cultivated loam",
          "Formula: ρb = Ms / (Vs + Va + Vw); **always less than ρs**",
          "High bulk density indicates compaction or coarse texture (sandy soils)",
        ]},
        { diagram: "DIAGRAM 3 — Two cubes side by side: Particle Density cube (only solid mineral particles; ρs = 2.65 g/cm³) and Bulk Density cube (minerals + air pores + water pores; ρb = 1.3 g/cm³). Label each." },
        { heading: "5. Soil Porosity and Soil Water", level: 3, items: [
          "**Porosity (f)** = volume of pores ÷ total soil volume; typically **30–60%**",
          "**Maximum water capacity** — all pores filled; soil saturated",
          "**Field capacity** — large pores drained; micropores filled; matric potential −10 to −30 kPa; available to plants",
          "**Permanent Wilting Point (PWP)** — water so tightly held (−1500 kPa) plants cannot extract it",
          "**Available water** = Field Capacity − PWP",
        ]},
        { diagram: "DIAGRAM 4 — Soil Water Availability bar: Left to right: [Hygroscopic water (unavailable)] | [Available Water = FC−PWP] | [Gravitational water, drains freely]. Mark PWP on left boundary, Field Capacity on right boundary of available water zone." },
        { heading: "6. Soil Temperature and Soil Air", level: 3, items: [
          "**Soil temperature** affects seed germination, microbial activity, nutrient availability, root growth; dark soils absorb more solar radiation; organic matter insulates",
          "**Soil air**: higher CO₂ (0.3–3%) and lower O₂ than atmosphere; gas exchange by mass flow and diffusion (Fick's Law)",
        ]},
        { heading: "Conclusion", level: 2, paras: ["The physical properties of soil — texture, structure, colour, density, porosity, water relationships, and temperature — collectively determine a soil's agricultural potential and ecological function. Texture is permanent and forms the foundation; structure can be improved through organic matter additions and careful tillage."] },
      ],
    },
    {
      tag: "Section A — 20 Marks",
      q: "A5. What is meant by ecosystem? Classify ecosystems and explain the characteristic features of each component.",
      sections: [
        { heading: "Introduction", level: 2, paras: ["An **ecosystem** is a functional, self-sustaining unit of the biosphere in which all living organisms (the biotic community) interact with each other and with the non-living physical environment (the abiotic environment) through flows of energy and cycles of nutrients. The term was coined by British ecologist **A.G. Tansley in 1935**."] },
        { heading: "Classification of Ecosystems", level: 2, items: [
          "**Terrestrial Natural Ecosystems**: Forest (tropical rainforest, temperate deciduous, boreal/taiga), Grassland (tropical savanna, temperate steppe), Desert, Tundra, Wetland (freshwater marshes, bogs)",
          "**Aquatic Natural Ecosystems**: Freshwater (pond, lake, river, stream) and Marine (ocean, estuary, mangrove, coral reef, seagrass bed)",
          "**Artificial/Anthropogenic Ecosystems**: Cropland (Bangladesh's paddy fields), Plantation (rubber, tea), Aquaculture pond, Urban ecosystem",
        ]},
        { heading: "Characteristic Features of Ecosystem Components", level: 2, paras: [""] },
        { heading: "I. Abiotic (Non-living) Components", level: 3, paras: ["The abiotic components provide the physical and chemical environment in which organisms live."] },
        { table: { headers: ["Abiotic Factor", "Role in Ecosystem"], rows: [["**Climatic factors** (solar radiation, temperature, precipitation, wind)", "Solar radiation = primary energy source; temperature controls metabolic rates; precipitation determines water availability"], ["**Edaphic factors** (soil type, pH, mineral content)", "Determines which plants grow and hence which animals are supported; Bangladesh's floodplain soils support rice cultivation"], ["**Inorganic substances** (CO₂, O₂, H₂O, N₂, mineral salts)", "CO₂ used in photosynthesis; O₂ for respiration; mineral salts supply plant nutrients"], ["**Organic compounds** (carbohydrates, proteins, humus)", "Link biotic and abiotic components; present in soil and water as result of biological activity"]] } },
        { heading: "II. Biotic (Living) Components", level: 3, paras: [""] },
        { heading: "a) Producers (Autotrophs — First Trophic Level)", level: 3, paras: ["Producers are photosynthetic organisms that capture solar energy: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂. They form the energetic foundation of all ecosystems. In terrestrial ecosystems: green plants (grasses, trees, shrubs); in aquatic ecosystems: phytoplankton, algae, aquatic macrophytes. **Key characteristic**: Producers fix solar energy and make it available to all other trophic levels."] },
        { heading: "b) Consumers (Heterotrophs)", level: 3, items: [
          "**Primary consumers (Herbivores — 2nd Trophic Level):** Feed directly on producers. Examples: cow, deer, rabbit, grasshopper, caterpillar, zooplankton. They are the link between producers and higher-level consumers.",
          "**Secondary consumers (First-level Carnivores — 3rd Trophic Level):** Feed on herbivores. Examples: frog, snake, small bird, fox, tuna.",
          "**Tertiary consumers (Second-level Carnivores — 4th Trophic Level):** Feed on secondary consumers. Examples: eagle, hawk, large shark, tiger. Usually apex predators with no natural predators.",
          "**Omnivores:** Feed on both plants and animals (bear, human, pig).",
          "**10% Law (Lindemann, 1942):** Only 10% of energy is transferred from each trophic level to the next; 90% is lost as heat through respiration, excretion, and incomplete digestion.",
        ]},
        { heading: "c) Decomposers (Saprotrophs/Detritivores)", level: 3, items: [
          "**Bacteria:** Most important decomposers; break down proteins, carbohydrates; fix nitrogen",
          "**Fungi:** Specialized in decomposing cellulose, lignin, and chitin (tough plant/animal materials)",
          "**Detritivores (macrofauna):** Earthworms, millipedes, beetles, termites — physically fragment organic matter, increasing surface area for microbial attack",
          "**Key characteristic:** Decomposers close the nutrient cycle, preventing accumulation of dead organic matter and ensuring nutrient availability for producers. Without them, ecosystems would collapse.",
        ]},
        { diagram: "Draw a food web for a grassland: Grass → Grasshopper → Frog → Snake → Eagle. Add: Grass → Rabbit → Fox → Eagle. Show Decomposers (Bacteria/Fungi) at bottom connecting to all with arrows. Label energy % transfer (10%) at each trophic link. Add Pyramid of Energy: wide base (Producers: 10,000 kcal) tapering to Herbivores (1,000) → Carnivores (100) → Top carnivores (10 kcal)." },
        { heading: "Nutrient Cycling", level: 2, items: [
          "**Carbon cycle:** CO₂ → photosynthesis → organic matter → respiration/decomposition → CO₂",
          "**Nitrogen cycle:** N₂ fixation → plant uptake → consumption → decomposition → nitrification → denitrification → N₂",
          "**Phosphorus cycle:** Mineral weathering → plant uptake → consumption → decomposition → soil → plant uptake",
        ]},
        { bd: "Bangladesh's Sundarbans mangrove ecosystem is the world's largest mangrove, functioning as a complete ecosystem with its own producers (mangrove trees), consumers (crabs, fish, deer, Bengal Tiger), and decomposers. Bangladesh's haor wetland ecosystems (Sylhet region) are freshwater lake ecosystems supporting rich biodiversity of aquatic plants, fish, and migratory birds." },
        { heading: "Conclusion", level: 2, paras: ["An ecosystem is a complex, integrated system where abiotic components provide the physical template, producers convert solar energy into organic matter, consumers transfer energy through trophic levels, and decomposers recycle nutrients. The two fundamental processes — unidirectional energy flow and cyclical nutrient cycling — sustain life and maintain ecosystem stability."] },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B1. Why is humus important in soil? Describe the function of organic matter in soils.",
      sections: [
        { paras: ["**Humus** is the dark, stable, colloidal organic matter in soil formed through the biochemical transformation (humification) of dead plant and animal material by soil microorganisms. It is the most stable fraction of soil organic matter (SOM), comprising 60–80% of total SOM, and plays a disproportionately large role in soil fertility and function."] },
        { heading: "Why Humus is Important", level: 2, items: [
          "**Improves Soil Structure:** Humus acts as a binding agent, cementing mineral particles (sand, silt, clay) into stable aggregates (crumbs/peds). These aggregates improve pore space distribution, facilitating both water infiltration and aeration — essential for root growth and aerobic microbial activity.",
          "**Increases Water-Holding Capacity:** Humus can hold 80–90% of its weight in water. It acts as a sponge, absorbing rainfall and retaining it for plant use during dry periods. This reduces drought stress and soil erosion by reducing runoff.",
          "**Increases Nutrient Retention (CEC):** Humic substances are negatively charged due to ionization of carboxyl (−COOH) and phenolic (−OH) groups. These charges attract and hold positively charged cations (Ca²⁺, Mg²⁺, K⁺, NH₄⁺), preventing their leaching and keeping them available to plant roots.",
          "**Acts as Nutrient Reservoir:** As humus slowly decomposes (mineralization), it releases essential plant nutrients — nitrogen, phosphorus, sulfur — in plant-available inorganic forms. It is a slow-release fertilizer.",
          "**Buffers pH:** Humic acids resist changes in soil pH (buffering), maintaining stable conditions for plant growth and microbial activity. This is especially important in soils subject to acid rain or liming.",
          "**Darkens Soil:** Dark colour of humus-rich soils means they absorb more solar radiation, warming the soil faster in spring — important for early seed germination in temperate regions.",
        ]},
        { heading: "Functions of Organic Matter in Soils", level: 2, items: [
          "**Energy source** for soil microorganisms, driving the decomposition cycle",
          "**Soil aggregation** — fresh organic matter provides food for mycorrhizal fungi whose hyphae physically bind soil particles",
          "**Reduces compaction** — prevents pore spaces from collapsing under pressure",
          "**Suppresses soil-borne diseases** — active microbial communities outcompete pathogens",
          "**Reduces toxic effects** — chelates heavy metals and pesticides, reducing their phytotoxicity and leaching to groundwater",
          "**Three humus fractions**: Humin (most stable, insoluble), Humic acid (soluble in base only), Fulvic acid (soluble in both acid and base; MOST ACTIVE; highest CEC contribution)",
        ]},
        { bd: "In Bangladesh's paddy soils, organic matter (from rice straw incorporation, green manure, cyanobacteria) is critical for sustaining soil fertility across multiple cropping seasons without complete dependence on chemical fertilizers. The traditional practice of keeping rice stubble in the field contributes to humus formation." },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B2. Illustrate the various soil forming processes with examples.",
      sections: [
        { paras: ["**Soil forming (pedogenic) processes** are the specific physical, chemical, and biological processes that transform parent material into a differentiated soil profile with distinct horizons."] },
        { table: { headers: ["Process", "Climate/Conditions", "Key Chemistry", "Soil Produced", "Location/Example"],
          rows: [
            ["**1. Laterization**", "Hot, humid tropics", "SiO₂ leached out; Fe₂O₃, Al₂O₃ remain and concentrate", "Laterite/Oxisol — deep, red-yellow; nutrient-poor", "Amazon, Congo, SE Asia; Madhupur Tract (Bangladesh)"],
            ["**2. Podzolization**", "Cool, humid boreal forest under conifers", "Fulvic acids chelate Fe³⁺, Al³⁺ → transported down; bleached E horizon forms", "Podzol/Spodosol — ash-grey E + dark Bhs horizon", "Scandinavia, Russia, Canada, Scotland; pine forests"],
            ["**3. Calcification**", "Semi-arid grassland; evaporation > precipitation", "CaCO₃ precipitates at depth from upward capillary movement", "Chernozem/Mollisol — dark A horizon + caliche at depth", "Great Plains USA, Ukrainian steppe, Pampas"],
            ["**4. Gleization**", "Waterlogged, anaerobic (Bangladesh haors)", "Fe³⁺ (reddish) → Fe²⁺ (grey/blue/green) under anaerobic conditions", "Gley soil/Gleysol — grey-blue mottled soil", "Bangladesh floodplains, Netherlands, Mississippi Delta"],
            ["**5. Salinization**", "Arid/semi-arid; evaporation > precipitation", "Soluble salts (NaCl, Na₂SO₄) drawn upward by capillary action", "Solonchak — white salt crust, alkaline (pH up to 10)", "Middle East, Indus Valley, coastal Bangladesh"],
          ]
        }},
        { bd: "Bangladesh is affected by two pedogenic processes above all others: Gleization (waterlogged floodplain soils — haors, beels, paddy fields; grey-blue mottled soils) and Salinization (coastal areas of Chittagong, Satkhira, Cox's Bazar; white salt crust). These two processes dominate the soils used for rice cultivation and aquaculture." },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B3. Define biome. Narrate the characteristics of the Tundra Biome in detail.",
      sections: [
        { paras: ["A **biome** is a large regional ecosystem defined by its climate and the characteristic vegetation and animal communities it supports. The term was coined by Frederick Clements (1916). Biomes are the major divisions of the biosphere — each is a recognizable landscape type with consistent ecological structure across its geographic range."] },
        { heading: "TUNDRA BIOME — Detailed Characteristics", level: 2, items: [
          "**Location and Extent:** Above 66.5°N (Arctic circle): Alaska, northern Canada, Siberia, Greenland, Scandinavia, Iceland. **Alpine tundra** also occurs above the tree line on high mountains worldwide. Covers ~20% of Earth's land surface.",
          "**Climate:** Mean annual temperature −10°C to −20°C; winter temperatures can reach −50°C. Precipitation very low (<250 mm/year — desert-like). **Growing season** only 6–10 weeks in Arctic summer. Critically, soil remains **permanently frozen** below the active layer — this is **permafrost** (30 cm to several hundred metres depth). In summer, only the thin **active layer** (20–80 cm) thaws.",
          "**Vegetation — NO TREES:** Low temperatures, short growing season, and permafrost prevent tree establishment. Dominant plants: dwarf willows (Salix), birch (Betula nana), sedges (Carex), cottongrass (Eriophorum), Sphagnum mosses, lichens (Cladonia — reindeer lichen), grasses. Plants are low-growing (cushion form) to avoid wind; dark pigmentation to absorb heat; many reproduce vegetatively.",
          "**Animal Life:** Year-round residents: musk ox (thick fur), arctic fox (seasonal colour change), lemming (key prey; 3–4 year population cycles), snowy owl, ptarmigan, arctic hare. Seasonal visitors: caribou/reindeer (Rangifer tarandus) migrate from boreal forests to tundra in summer; millions of migratory waterfowl breed in summer. Polar bear at tundra-coastal interface.",
          "**Soil — Gelisol:** Thin active layer; poor drainage (impermeable permafrost below) → waterlogged in summer → boggy surface. Very slow decomposition due to cold → **peat accumulation** (stores immense amounts of carbon). Acidic; low nutrient cycling; freeze-thaw cycles cause characteristic surface patterning: polygonal ground, stone circles, pingos (ice-cored mounds).",
          "**Climate Threat:** As permafrost thaws due to global warming, decomposition of stored organic matter releases CO₂ and CH₄ — a major **positive feedback** for global warming.",
          "**Ecological Significance:** Fragile ecosystem with very slow recovery from disturbance; oil spills and vehicle tracks persist for decades. Critical breeding ground for migratory birds. Supports traditional livelihoods of Inuit, Sami, Nenets peoples.",
        ]},
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B4. What do you mean by plant dynamics? Discuss different stages of plant succession.",
      sections: [
        { paras: ["**Plant dynamics** (or vegetation dynamics) refers to the temporal and spatial changes in plant communities over time — including succession (directional progressive change), fluctuation (short-term non-directional change due to weather), cyclical dynamics, and disturbance-driven change. The most important aspect of plant dynamics is **plant succession**."] },
        { paras: ["**Plant Succession** is the sequential, directional, and predictable change in species composition of a plant community over time, driven by the modification of the environment by the plants themselves, ultimately resulting in a stable **climax community** determined by the regional climate."] },
        { heading: "Types of Succession", level: 2, items: [
          "**Primary succession:** Begins on bare, previously unvegetated substrate (bare rock, lava flow, sand dune, new lake). Slow; starts from zero.",
          "**Secondary succession:** Begins on disturbed area that had previous vegetation and retains soil and seed bank (cleared forest, abandoned farmland, burned grassland). Much faster.",
        ]},
        { heading: "Stages of Hydrosere Succession (Most Commonly Examined)", level: 2, paras: [""] },
        { table: { headers: ["Stage", "Community", "Key Process"],
          rows: [
            ["**1. Phytoplankton**", "Free-floating algae, Chara, Nitella", "Open deep water; organic matter begins accumulating on lake bed"],
            ["**2. Submerged plants**", "Potamogeton, Myriophyllum, Elodea", "Rooted submerged plants; sediment accumulation increases; water shallowing"],
            ["**3. Floating-leaf plants**", "Nymphaea (water lily), Nelumbo (lotus), Nuphar", "Water shallower; shade out submerged plants below"],
            ["**4. Reed Swamp**", "Phragmites (reed), Typha (cattail/bulrush)", "Emergent plants; water at soil surface; most sediment trapped; peat begins"],
            ["**5. Marsh/Sedge Fen**", "Carex (sedge-meadow)", "Waterlogging decreasing; peat accumulation; soil forming"],
            ["**6. Carr/Shrub**", "Salix (willow), Alnus (alder)", "Wet-tolerant shrubs; further drying; woody vegetation"],
            ["**7. Climax Forest**", "Oak, Ash (temperate); Tropical forest", "Fully terrestrial; water table well below surface"],
          ]
        }},
        { paras: ["**Key principle:** Each plant community modifies the environment (adding organic matter, raising the substrate, reducing water depth) making it more suitable for the next stage and less suitable for itself — **self-replacement** drives succession forward."] },
        { heading: "Stages of Lithosere (Primary Succession on Bare Rock)", level: 2, items: [
          "Stage 1: Bare rock → Pioneer crustose lichens (weather rock)",
          "Stage 2: Foliose lichens → add organic matter",
          "Stage 3: Mosses → thicker organic layer; soil begins forming",
          "Stage 4: Annual herbs and grasses → thin soil",
          "Stage 5: Perennial herbs and ferns → more soil organic matter",
          "Stage 6: Shrubs → deeper rooting; more soil",
          "Stage 7: Pioneer trees (birch, pine) → canopy forming",
          "Stage 8: Climax forest (oak, beech, or tropical forest)",
        ]},
        { diagram: "Draw Hydrosere cross-section from left (open deep water) to right (climax forest), showing water level decreasing left to right. Label each of the 7 stages with their dominant plant species. Add arrow showing direction of succession →." },
        { bd: "Bangladesh haors (Hakaluki Haor, Tanguar Haor in Sylhet) demonstrate early hydrosere stages. Water hyacinth mats, sedge marshes, and reed beds are visible. Annual monsoon floods reset the succession, preventing full terrestrialization. Without regular flooding, hydrosere would convert these wetlands to terrestrial vegetation over centuries." },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B5. Explain the classification and characteristics of ecosystem with examples.",
      sections: [
        { paras: ["An ecosystem is a functional unit where biotic (living) and abiotic (non-living) components interact through energy flow and nutrient cycling. **A.G. Tansley** coined the term in **1935**."] },
        { heading: "A. Terrestrial Ecosystems", level: 2, items: [
          "**1. Forest Ecosystem:** Characterised by trees as dominant vegetation. Sub-types: Tropical Rainforest (Amazon, Sundarbans fringe of Bangladesh — highest productivity); Temperate Deciduous Forest (seasonal; leaf-shedding; oak, maple dominant — Europe, E. USA, E. Asia); Boreal Forest/Taiga (cold; coniferous; Russia, Canada — largest terrestrial biome).",
          "**2. Grassland Ecosystem:** Dominated by grasses; scattered trees. Tropical savanna (Africa — wildebeest, lion, elephant) vs. temperate steppe (Ukraine, Great Plains USA — bison, prairie dog). Chernozem soils — world's most fertile.",
          "**3. Desert Ecosystem:** Arid (<250 mm rainfall); sparse xerophytic vegetation; extreme temperature range. Low productivity but specialised organisms. Examples: Sahara, Arabian Desert, Gobi Desert.",
          "**4. Tundra Ecosystem:** Treeless, permafrost; Arctic and Alpine. Dominated by mosses, lichens, sedges. Examples: Arctic tundra of Russia/Canada; Alpine tundra of Himalayas, Andes.",
        ]},
        { heading: "B. Aquatic Ecosystems", level: 2, items: [
          "**1. Freshwater Ecosystem:** Lentic (standing water: lakes, ponds, reservoirs — Bangladesh's haors and baors) and Lotic (flowing water: rivers, streams, canals — Padma, Meghna, Jamuna of Bangladesh). Supports freshwater fish, amphibians, aquatic plants.",
          "**2. Marine Ecosystem:** Ocean (vast; phytoplankton are key producers); Coral Reef (extremely high biodiversity; sensitive to temperature — 'rainforests of the sea'); **Estuary/Mangrove** (where freshwater meets saltwater; very high productivity — **Sundarbans of Bangladesh** is world's largest mangrove ecosystem).",
        ]},
        { heading: "C. Artificial/Man-made Ecosystems", level: 2, items: [
          "**Cropland:** Simplified ecosystem; few species; high human input; Bangladesh's paddy fields (boro, aus, aman rice cycles)",
          "**Plantation:** Single-species forests (rubber, tea — Sylhet tea gardens of Bangladesh)",
          "**Aquaculture:** Fish ponds; prawn farms (coastal Bangladesh)",
        ]},
        { paras: ["**Characteristics common to all ecosystems:** (1) abiotic environment as physical template; (2) producers as energy fixers; (3) consumers at multiple trophic levels; (4) decomposers recycling nutrients; (5) energy flow (unidirectional, 10% rule); (6) nutrient cycling (cyclical)."] },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B6. Discuss the factors of plant dispersal with appropriate examples.",
      sections: [
        { paras: ["**Plant dispersal** is the movement of seeds, fruits, spores, or vegetative propagules away from the parent plant to new locations. Dispersal is essential for species survival, colonisation of new habitats, and gene flow between populations."] },
        { heading: "Six Major Mechanisms of Plant Dispersal", level: 2, items: [
          "**1. Wind Dispersal (Anemochory):** The most common mechanism. Adaptations: winged fruits (maple — Acer; ash — Fraxinus); plumed/hairy seeds (dandelion — Taraxacum; thistle — Cirsium; cotton — Gossypium); dust-like seeds (orchids; ferns). Example: Dandelion seeds with parachute-like pappus travel hundreds of meters in wind.",
          "**2. Water Dispersal (Hydrochory):** Seeds/fruits adapted to float and survive immersion in water. Examples: Coconut (Cocos nucifera) — buoyant, waterproof husk; floats thousands of kilometres across oceans to colonise islands. Mangrove propagules (vivipary — germinate on parent tree; propagules float in tidal currents). Important for Bangladesh's mangrove colonization.",
          "**3. Animal Dispersal (Zoochory):** (a) **Epizoochory (external attachment)**: Seeds with hooks, barbs, or sticky surfaces attach to fur or feathers — Burdock (Arctium lappa); grass awns; stick-tight (Bidens). The animal carries seeds while grooming. (b) **Endozoochory (gut passage)**: Fleshy fruits attract animals; seeds pass through gut unharmed and deposited with faeces — berries (Rubus, Sambucus), mangoes, figs. Fruit-eating birds (bulbul, hornbill) are major dispersers in Bangladesh's forests. (c) **Scatter hoarding**: Squirrels bury seeds (acorns); those not recovered germinate — key for oak forest regeneration.",
          "**4. Gravity Dispersal (Barochory):** Heavy fruits/seeds fall directly below parent plant — acorns, chestnuts, walnuts, coconuts. Limited dispersal distance unless aided by slope or water.",
          "**5. Explosive/Mechanical Dispersal (Autochory/Ballochory):** Plant mechanically ejects seeds by building up pressure — Touch-me-not (Impatiens balsamina — common in Bangladesh); squirting cucumber; hazel (Corylus); witch hazel. Seeds may travel 1–15 metres.",
          "**6. Human Dispersal (Anthropochory):** Intentional: introduction of crop plants (rice, wheat, potato) across continents through agriculture. Accidental: weed seeds in crop seed lots, in ballast water of ships, on vehicle tyres. Example: Water hyacinth (Eichhornia crassipes) spread from South America to Bangladesh and now clogs waterways — a major invasive species problem.",
        ]},
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B7. Define Hydrosere. Briefly discuss the process of hydrosere succession.",
      sections: [
        { paras: ["**Hydrosere** (from Greek: hydro = water + sere = series of communities) is a type of primary succession that begins in open, standing water (pond, lake, or shallow bay) and progressively develops through a series of seral communities, ultimately replacing the aquatic ecosystem with a terrestrial one. It represents the process of **terrestrialization** — the conversion of open water to dry land through biological and physical processes."] },
        { heading: "Conditions for Hydrosere", level: 2, items: ["Requires a shallow, relatively still water body; input of sediment or organic material; stable climate; no major disturbance."] },
        { heading: "The Seven Stages of Hydrosere Succession", level: 2, items: [
          "**Stage 1 — Open Water/Phytoplankton Stage:** Pioneer community of free-floating microscopic algae, cyanobacteria, Chara, and Nitella. Begin accumulation of organic matter on lake floor, gradually shallowing the water body.",
          "**Stage 2 — Submerged Aquatic Plant Stage:** Water shallows (2–4 m); rooted submerged aquatics establish: Potamogeton (pondweed), Myriophyllum (water milfoil), Elodea. Root systems trap more sediment. Dead plant material accelerates organic accumulation.",
          "**Stage 3 — Floating-Leaf Plant Stage:** Further shallowing (1–2 m) allows floating-leaf plants: Nymphaea (water lily), Nuphar (yellow water lily), Nelumbo (lotus), Trapa (water chestnut — common in Bangladesh). Large floating leaves create shade that eliminates submerged plants.",
          "**Stage 4 — Reed Swamp Stage:** Very shallow water (0.5–1 m) or waterlogged margins colonised by tall emergent plants: Phragmites australis (common reed), Typha latifolia/angustifolia (cattail/bulrush), Scirpus (club-rush). Extremely effective sediment trappers; dead stems accumulate as peat.",
          "**Stage 5 — Marsh/Sedge Fen Stage:** Water table drops to near soil surface; sedge meadow: Carex species, Juncus (rush), marsh grasses. Peat continues accumulating. Soil is waterlogged but no longer submerged.",
          "**Stage 6 — Shrub/Carr Stage:** Continued drying allows wet-tolerant shrubs: Salix (willow), Alnus glutinosa (alder), Betula (birch). The term 'carr' refers to waterlogged shrubland. These further raise the ground surface through litter accumulation and transpiration.",
          "**Stage 7 — Climax Forest Stage:** Former lake replaced by regional climax forest — oak/ash woodland in temperate climates, or tropical forest in humid tropics. Fully terrestrial ecosystem established.",
        ]},
        { paras: ["**Driving mechanism:** Each community modifies the environment (adds organic matter, raises bed level, reduces water depth) making conditions less suitable for itself but more suitable for the next stage — **self-replacement** drives succession forward."] },
        { bd: "Tanguar Haor and Hakaluki Haor in Sylhet show early hydrosere stages. Water hyacinth mats, sedge marshes, and reed beds are present, beginning the terrestrialization process that, without annual flooding, would eventually convert these wetlands to terrestrial vegetation." },
      ],
    },
    {
      tag: "Section B — 10 Marks",
      q: "B8. Define zoogeography. Discuss the major zoogeographical realms with a world map sketch description.",
      sections: [
        { paras: ["**Zoogeography** is the branch of biogeography that studies the geographical distribution of animal species and communities across the Earth, the ecological and historical factors that determine these distributions, and the evolutionary processes (speciation, dispersal, vicariance) that have shaped them. **Alfred Russel Wallace** — the 'Father of Zoogeography' — developed the first systematic classification of the world's zoogeographical realms in *The Geographical Distribution of Animals* (1876)."] },
        { heading: "World Map Sketch Description", level: 2, paras: ["Draw an oval world map outline. Draw the following regional boundaries with dotted lines and label each:"] },
        { table: { headers: ["Realm", "Location on Map", "Key Animals"],
          rows: [
            ["**1. Palearctic**", "Covers all Europe, Asia north of Himalayas, North Africa, Arabian Peninsula (north)", "Brown bear, wolf, red deer, reindeer (wild), mole. Largest realm. Many species shared with Nearctic → 'Holarctic'"],
            ["**2. Nearctic**", "North America from the Arctic south to the Mexican tropics (Tropic of Cancer)", "Bison, pronghorn antelope, prairie dog, grizzly bear, American alligator. Many species shared with Palearctic."],
            ["**3. Neotropical**", "Central and South America; Caribbean", "Jaguar, tapir, giant anteater, sloth, capybara, llama, anaconda, toucan, macaw, hummingbird, rhea. Richest in endemic species."],
            ["**4. Ethiopian (Afrotropical)**", "Africa south of Sahara; sometimes includes Madagascar", "African elephant, lion, giraffe, hippopotamus, gorilla, chimpanzee, wildebeest, zebra, rhinoceros, ostrich, aardvark"],
            ["**5. Oriental**", "South Asia (India, **Bangladesh**, Pakistan, Sri Lanka) + SE Asia west of Wallace's Line, Philippines", "Asian elephant, Bengal tiger, Indian rhinoceros, orangutan, gibbon, king cobra, peacock, mugger crocodile. **Bangladesh is here!**"],
            ["**6. Australasian**", "Australia, New Zealand, New Guinea, Pacific Islands, Indonesia east of Wallace's Line", "Kangaroo, koala, platypus (monotreme!), echidna (monotreme!), Tasmanian devil, cassowary, emu, kiwi, birds-of-paradise"],
          ]
        }},
        { paras: ["**Wallace's Line:** Draw a bold dotted line running between Bali and Lombok, then between Borneo and Sulawesi. This line separates the Oriental Realm (west: tigers, elephants) from the Australasian Realm (east: marsupials). The distinctiveness of Australasian fauna results from Australia's long isolation (~80 million years). Similarly, the Neotropical realm's rich endemic fauna reflects South America's long isolation before the formation of the Panama land bridge (~3 million years ago)."] },
      ],
    },
  ], []);
}

// ─── DATA: FLASH CARDS ───────────────────────────────────────────────────────
function useCards() {
  return useMemo(() => [
    { num: 1, q: "Give the standard exam-ready definition of soil and name the four major components by volume.", a: "Soil is the biologically active, porous natural body in the uppermost Earth's crust, composed of minerals, organic matter, water, air, and micro/macro-organisms that supports plant life. Four components by volume: **45% mineral matter + 5% organic matter + 25% water + 25% air**." },
    { num: 2, q: "What are the five factors of soil formation? Give the CLORPT mnemonic and one-line role of each.", a: "**C**limate (most important — controls weathering/leaching), **L**iving organisms/Biota (add OM, fix N₂, bioturbate), **O**rganic matter (builds humus, improves structure), **R**elief/Topography (drainage and erosion), **P**arent material (initial mineral composition), **T**ime (longer = more developed profile). Hans Jenny, 1941." },
    { num: 3, q: "Name the five pedogenic processes, their climate, and the soil type each produces.", a: "1. **Laterization** → Hot humid tropics → Laterite/Oxisol (red, Fe/Al-rich). 2. **Podzolization** → Cool humid boreal forest → Podzol/Spodosol (bleached E + dark Bhs). 3. **Calcification** → Semi-arid grassland → Chernozem/Mollisol (dark topsoil + CaCO₃ at depth). 4. **Gleization** → Waterlogged/anaerobic → Gley soil/Gleysol (grey-blue mottled; Fe³⁺ → Fe²⁺). 5. **Salinization** → Arid/semi-arid → Solonchak (white salt crust, alkaline pH up to 10)." },
    { num: 4, q: "Name the six master soil horizons in order (surface to bedrock) and state the key characteristic of each.", a: "**O** — Organic litter at surface. **A** — Dark topsoil; highest OM and biological activity; zone of ELUVIATION. **E** — Pale grey; depleted of clay, Fe, Al; leached (common in podzols). **B** — Brown/red; zone of ILLUVIATION; accumulates clay, Fe oxides, humus. **C** — Partially weathered parent material; little pedogenic alteration. **R** — Unweathered solid bedrock; cannot be dug by hand." },
    { num: 5, q: "Define soil texture. Give the three particle sizes (USDA), their diameter ranges, and key properties.", a: "**Soil texture** = relative proportion of sand, silt, and clay. **Sand**: 2.0–0.05 mm; coarse, gritty; low water/nutrient retention; visible to naked eye. **Silt**: 0.05–0.002 mm; smooth/silky; moderate water holding. **Clay**: <0.002 mm; sticky, plastic; high water and nutrient retention; high surface area; swells when wet. **Loam** (ideal): ~40% sand + 40% silt + 20% clay — best balance for agriculture." },
    { num: 6, q: "Distinguish between particle density and bulk density. Give typical values and what high bulk density indicates.", a: "**Particle density (ρs)** = mass of solids ÷ volume of solids = **2.60–2.75 g/cm³** (constant; excludes pore spaces). **Bulk density (ρb)** = mass of dry soil ÷ TOTAL soil volume (includes pores) = **1.1–1.4 g/cm³** for cultivated loam. ρb is ALWAYS less than ρs (pores = ~50% of volume). **High bulk density** = soil compaction OR high sand content → poor root penetration." },
    { num: 7, q: "What is soil pH? What is the optimal pH range for most crops? What happens at very high and very low pH?", a: "**Soil pH** measures H⁺ concentration in soil solution; scale 0–14. pH 7 = neutral; <7 = acidic; >7 = alkaline. **Optimal for most crops: pH 6.0–6.8** (slightly acidic). Low pH (<5.5): toxic Al³⁺ and Mn²⁺; most nutrients unavailable. High pH (>8): low micronutrient availability (Fe, Mn, Zn become insoluble). Phosphorus most available at pH 6–7. Soil pH controlled by parent material, rainfall, and vegetation." },
    { num: 8, q: "Define humus. Name and describe the three fractions of humus separated by solubility.", a: "**Humus** is the dark, stable, colloidal organic matter formed through humification of dead organic material; comprises 60–80% of total SOM. Three fractions: **Humin** — insoluble in acid or base; largest; most stable; lowest activity. **Humic acid** — soluble in base, NOT in acid; dark brown; contributes to fertility. **Fulvic acid** — soluble in BOTH acid and base; smallest; most carboxyl (-COOH) groups; MOST ACTIVE; dominant in forest soils. Memory: H-H-F → Humin (big, stable), Humic (middle), Fulvic (smallest, most active)." },
    { num: 9, q: "Define nitrogen fixation. Distinguish between symbiotic and free-living fixation with examples.", a: "**Nitrogen fixation** = conversion of atmospheric N₂ to NH₃/NH₄⁺ by microorganisms using nitrogenase enzyme. **Symbiotic fixation**: Rhizobium bacteria in root nodules of legumes (soybean, pea, bean); most efficient — 50–200 kg N/ha/year; mutualistic. **Free-living (asymbiotic)**: Azotobacter (aerobic), Clostridium (anaerobic), **Cyanobacteria/Blue-green algae** (e.g., Anabaena in flooded rice paddies — very important in Bangladesh!) — 5–40 kg N/ha/year. BNF globally fixes ~200 million tonnes N/year." },
    { num: 10, q: "Define and distinguish Zonal, Azonal, and Intrazonal soils. Give two examples of each.", a: "**Zonal**: Mature, well-developed, reflect regional climate; distinct horizons. Examples: Laterite (tropics), Podzol (boreal), Chernozem (grassland), Desert soil. **Azonal**: Young, undeveloped; lack distinct horizons; formed in recently deposited material. Examples: Alluvial soils (Bangladesh floodplains!), Lithosols (bare rock), Aeolian soils (wind deposits). **Intrazonal**: Dominated by local factor, not climate. Examples: Gley soils (waterlogged), Saline/Solonchak (salt-affected), Peat/Histosol (organic matter), Rendzina (chalk)." },
    { num: 11, q: "Name and briefly describe five key USDA soil orders relevant to this course.", a: "1. **Oxisols** — highly weathered tropical; Fe/Al oxides; low CEC; laterization product; tropical rainforests. 2. **Spodosols** — podzolization product; bleached E horizon + sesquioxide Bhs; boreal forests. 3. **Mollisols** — dark, humus-rich A; calcification product; grasslands; Chernozem; world's best agricultural soils. 4. **Inceptisols** — young soils with some development; cambic B horizon; **most common in Bangladesh** (floodplain soils). 5. **Histosols** — >20–30% organic matter; peat and muck soils; wetlands and bogs; Bangladesh's Gopalganj-Khulna beels." },
    { num: 12, q: "Define ecosystem. Who coined the term and when? State the two fundamental processes in ecosystems.", a: "An **ecosystem** is a functional unit of the biosphere where biotic (living) and abiotic (non-living) components interact through energy flow and nutrient cycling. Coined by **A.G. Tansley in 1935**. Two fundamental processes: (1) **Energy flow** — unidirectional (sun → producers → consumers → decomposers); governed by 10% rule (Lindemann, 1942); cannot be recycled. (2) **Nutrient/Matter cycling** — cyclical; elements (C, N, P) recycled through biotic and abiotic compartments." },
    { num: 13, q: "Define food chain, food web, and trophic levels. State the 10% law and who proposed it.", a: "**Food chain**: Linear sequence — Producers → Primary consumers → Secondary consumers → Tertiary consumers → Decomposers. **Food web**: Interconnected network of multiple food chains; more realistic representation. **Trophic levels**: Level 1 (Producers), Level 2 (Herbivores), Level 3 (1st-level carnivores), Level 4 (2nd-level carnivores/apex). **10% Law (Lindemann, 1942)**: Only 10% of energy transferred from one trophic level to the next; 90% lost as heat. Explains why food chains rarely exceed 4–5 levels." },
    { num: 14, q: "Define biogeography. Who is the 'Father of Biogeography'? Name two key scholars and their contributions.", a: "**Biogeography** is the scientific study of the spatial and temporal distribution of living organisms across the Earth's surface, and the ecological, historical, and evolutionary factors explaining these patterns — an interdisciplinary science bridging geography, ecology, evolutionary biology, geology, and palaeontology. **Alfred Russel Wallace** = 'Father of Biogeography'; developed zoogeographical realms and Wallace's Line; co-developed evolution by natural selection. **Alexander von Humboldt** = 'Father of Plant Geography'; showed climate-vegetation relationship. **Buffon (18th century)**: 'Buffon's Law' → founded biogeography." },
    { num: 15, q: "Name and define the six major mechanisms of plant dispersal with one example each.", a: "1. **Anemochory** (Wind): Winged seeds (maple), plumed (dandelion), dust (orchids). 2. **Hydrochory** (Water): Coconut (ocean current); mangrove propagules. 3. **Epizoochory** (External animal): Burdock hooks on fur/feathers. 4. **Endozoochory** (Gut passage): Berries eaten by birds; seeds defecated. 5. **Barochory** (Gravity): Acorns, chestnuts fall near parent plant. 6. **Autochory** (Explosive): Touch-me-not (Impatiens) — Bangladesh example! 7. **Anthropochory** (Human): Invasive water hyacinth in Bangladesh from South America." },
    { num: 16, q: "Distinguish between primary and secondary succession. Name the four main forms of succession.", a: "**Primary succession**: Begins on bare, sterile substrate with NO prior soil or vegetation (bare rock, sand dune, new lake, lava flow); very slow (hundreds–thousands of years); organisms must create soil from scratch. **Secondary succession**: Begins on disturbed area that PREVIOUSLY had vegetation and RETAINS soil + seed bank (abandoned farmland, post-fire grassland, cleared forest); much faster (decades). Four main forms: **Hydrosere** (open water), **Lithosere** (bare rock), **Psammosere** (sand dunes), **Halosere** (salt marsh)." },
    { num: 17, q: "List the seven stages of hydrosere succession in order with the dominant plant type at each stage.", a: "1. **Phytoplankton stage** — free-floating algae, Chara, Nitella (deep open water). 2. **Submerged aquatic** — Potamogeton, Myriophyllum (rooted submerged). 3. **Floating-leaf** — Nymphaea (water lily), Nelumbo (lotus). 4. **Reed/Swamp** — Phragmites (reed), Typha (cattail/bulrush) — emergent; water at soil surface. 5. **Marsh/Sedge-fen** — Carex (sedge), Juncus (rush); peat forming. 6. **Shrub/Carr** — Salix (willow), Alnus (alder); drying. 7. **Climax forest** — Oak, Ash (temperate); tropical forest — fully terrestrial." },
    { num: 18, q: "Give the six key characteristics of the tundra biome: location, temperature, precipitation, vegetation, soil, and one climate threat.", a: "**Location**: Above 66.5°N: Alaska, Siberia, N. Canada, Greenland; also Alpine tundra on high mountains. **Temperature**: Mean annual −10 to −20°C; winters reach −50°C; growing season 6–10 weeks. **Precipitation**: <250 mm/year (desert-like). **Key feature**: **PERMAFROST** — only thin active layer (20–80 cm) thaws in summer. **Vegetation**: NO TREES; dwarf shrubs, sedges (Carex), Sphagnum, lichens (Cladonia), grasses; cushion growth form. **Soil**: Gelisol — thin, waterlogged summer, peat-accumulating, acidic, low decomposition. **Climate threat**: Permafrost thaw → releases CO₂ and CH₄ → amplifies global warming (positive feedback)." },
    { num: 19, q: "Name the six zoogeographical realms. For each, give the main geographic region and one iconic animal.", a: "**Palearctic** — Europe + Asia north of Himalayas + N. Africa → Brown bear. **Nearctic** — North America (to tropical Mexico) → Bison/Pronghorn. **Neotropical** — Central + South America + Caribbean → Jaguar/Sloth/Anaconda. **Ethiopian (Afrotropical)** — Sub-Saharan Africa → African elephant/Giraffe/Lion. **Oriental** — S. Asia + SE. Asia west of Wallace's Line (**Bangladesh is here!**) → Bengal tiger/Asian elephant. **Australasian** — Australia + New Guinea + Pacific east of Wallace's Line → Kangaroo/Platypus/Koala." },
    { num: 20, q: "Name the six floristic kingdoms, their location, and one characteristic plant for each.", a: "1. **Holarctic Kingdom** — Europe + N. Asia + N. America → Pinus, Betula, Quercus. 2. **Paleotropical Kingdom** — Tropical Africa + S./SE. Asia (**includes Bangladesh**) + Pacific → Palms, Ficus, Rhizophora (mangrove). 3. **Neotropical Kingdom** — Central + South America → Cacti, bromeliads, Hevea (rubber tree). 4. **Australian Kingdom** — Australia + New Zealand → Eucalyptus, Acacia, Proteaceae (~75% endemic). 5. **South African (Capensis) Kingdom** — SW Cape, South Africa → Proteaceae, Ericaceae; ~9000 species in small area; richest per unit area. 6. **Antarctic Kingdom** — S. South America + sub-Antarctic → Nothofagus (southern beech)." },
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
          <span style={s.badge}>EXAM IN 3 DAYS</span>
          <div style={{ color: C.muted, fontFamily: "sans-serif", fontSize: 13 }}>University of Dhaka · Geography of Soil & Biogeography · Full Marks: 70</div>
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
