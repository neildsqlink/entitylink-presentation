import { useState, useEffect, useCallback, useRef } from "react";

/* Resolve public-folder assets against the deployed base URL */
const A = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ─── EntityLink brand tokens ─── */
const B = {
  primary: "#E8612D",
  primaryDark: "#c94f1f",
  primaryLight: "#ff7a45",
  dark: "#0f172a",
  dark800: "#1e293b",
  dark700: "#334155",
  gray100: "#f8fafc",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  white: "#ffffff",
  na: "#3b82f6",
  emea: "#8b5cf6",
  apac: "#06b6d4",
  cala: "#f59e0b",
  israel: "#10b981",
  red: "#ef4444",
  font: "Heebo",
  fontEn: "Inter",
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ─── Hooks ─── */
function useCountUp(active, target, { duration = 1400, delay = 0 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    let raf;
    let start;
    const t = setTimeout(() => {
      const step = (ts) => {
        if (start === undefined) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, target, duration, delay]);
  return val;
}

/* Re-usable reveal style: fade + rise with the signature ease */
const rise = (active, delay = 0, dist = 24) => ({
  opacity: active ? 1 : 0,
  transform: active ? "translateY(0)" : `translateY(${dist}px)`,
  transition: `all 0.8s ${EASE} ${delay}ms`,
});

const riseX = (active, delay = 0, dist = 34) => ({
  opacity: active ? 1 : 0,
  transform: active ? "translateX(0)" : `translateX(${dist}px)`,
  transition: `all 0.8s ${EASE} ${delay}ms`,
});

const pop = (active, delay = 0) => ({
  opacity: active ? 1 : 0,
  transform: active ? "scale(1) translateY(0)" : "scale(0.72) translateY(18px)",
  transition: `all 0.65s ${EASE} ${delay}ms`,
});

/* ─── Chrome / layout pieces ─── */
function SlideWrap({ active, children, style = {} }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0) scale(1)" : "translateY(26px) scale(0.99)",
        transition: `all 0.7s ${EASE}`,
        pointerEvents: active ? "auto" : "none",
        padding: "48px 68px 78px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.5,
        backgroundImage: `linear-gradient(${B.gray200} 1px, transparent 1px), linear-gradient(90deg, ${B.gray200} 1px, transparent 1px)`,
        backgroundSize: "46px 46px",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 0%, transparent 75%)",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 0%, transparent 75%)",
      }}
    />
  );
}

function Glow({ x = "85%", y = "12%", color = B.primary, size = 640, opacity = 0.07 }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${x} - ${size / 2}px)`,
        top: `calc(${y} - ${size / 2}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

function Kicker({ active, children, delay = 100, center = false }) {
  return (
    <div
      style={{
        color: B.primary,
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: "0.08em",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: 10,
        ...rise(active, delay, 16),
      }}
    >
      <span
        style={{
          width: active ? 30 : 0,
          height: 3,
          background: B.primary,
          borderRadius: 3,
          transition: `width 0.7s ${EASE} ${delay + 250}ms`,
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}

/* ─── Flat line-icon library (no emojis) ─── */
function FlatIcon({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <rect x="7" y="13" width="3" height="6" />
          <rect x="12" y="9" width="3" height="10" />
          <rect x="17" y="5" width="3" height="14" />
        </svg>
      );
    case "envelope":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 7 9-7" />
        </svg>
      );
    case "folder":
      return (
        <svg {...p}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "scale":
      return (
        <svg {...p}>
          <path d="M12 4v17" />
          <path d="M8 21h8" />
          <path d="M4 7h16" />
          <path d="M5 7l-2.5 5a3 3 0 0 0 5 0L5 7z" />
          <path d="M19 7l-2.5 5a3 3 0 0 0 5 0L19 7z" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <path d="M3 21h18" />
          <path d="M5 21V9l7-4 7 4v12" />
          <path d="M9 21v-5h6v5" />
          <path d="M9 12h.01M15 12h.01" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9" />
          <path d="M12 3a14 14 0 0 0-4 9 14 14 0 0 0 4 9" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 8l9 6 9-6" />
        </svg>
      );
    case "users":
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
          <path d="M17.5 13.6a6.5 6.5 0 0 1 4 6.4" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "gear":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "eye-off":
      return (
        <svg {...p}>
          <path d="M3 3l18 18" />
          <path d="M10.5 5.2A9.6 9.6 0 0 1 12 5c5 0 9 4.5 10 7-.4 1.1-1.4 2.6-2.9 3.9M6.6 6.6C4.1 8.1 2.6 10.3 2 12c1 2.5 5 7 10 7 1.5 0 2.9-.4 4.1-1" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      );
    case "link":
      return (
        <svg {...p}>
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.4 4.5" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.4-1.4" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "filter":
      return (
        <svg {...p}>
          <path d="M3 5h18l-7 8v5l-4 2v-7z" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M12 3v12" />
          <path d="M8 11l4 4 4-4" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case "database":
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      );
    case "tree":
      return (
        <svg {...p}>
          <rect x="9" y="3" width="6" height="5" rx="1.2" />
          <rect x="3" y="16" width="6" height="5" rx="1.2" />
          <rect x="15" y="16" width="6" height="5" rx="1.2" />
          <path d="M12 8v3" />
          <path d="M6 16v-3h12v3" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M12 3.5L2.5 20h19z" />
          <path d="M12 9.5v4.5" />
          <path d="M12 17.2h.01" />
        </svg>
      );
    case "document":
      return (
        <svg {...p}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          <path d="M8 13h8M8 17h8M8 9h2" />
        </svg>
      );
    case "petition":
      return (
        <svg {...p}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          <path d="M9 14l2 2 4-4.5" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...p}>
          <path d="M16 3l5 5-12 12H4v-5z" />
          <path d="M13 6l5 5" />
        </svg>
      );
    default:
      return null;
  }
}

/* Tinted rounded box around an icon — the standard bullet visual */
function IconBox({ name, color = B.primary, size = 38, icon = 19, style = {} }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `${color}14`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <FlatIcon name={name} size={icon} color={color} />
    </span>
  );
}

/* macOS-style browser window around screenshots */
function MacWindow({ active, title, src, delay = 500, children, style = {} }) {
  return (
    <div
      dir="ltr"
      style={{
        background: B.white,
        border: `1px solid ${B.gray200}`,
        borderRadius: 16,
        boxShadow: "0 30px 70px rgba(15,23,42,0.16), 0 6px 18px rgba(15,23,42,0.06)",
        overflow: "hidden",
        opacity: active ? 1 : 0,
        transform: active
          ? "perspective(1400px) rotateX(0deg) translateY(0) scale(1)"
          : "perspective(1400px) rotateX(10deg) translateY(46px) scale(0.94)",
        transition: `all 1s ${EASE} ${delay}ms`,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: B.gray100,
          borderBottom: `1px solid ${B.gray200}`,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: 12, color: B.gray500, fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ position: "relative", lineHeight: 0 }}>
        <img src={src} alt={title} style={{ display: "block", width: "100%", height: "auto" }} />
        {children}
      </div>
    </div>
  );
}

/* Floating callout chip pinned around a window */
function Callout({ active, delay, style, color = B.primary, children }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 5,
        background: B.white,
        border: `1px solid ${B.gray200}`,
        borderInlineStart: `4px solid ${color}`,
        borderRadius: 12,
        padding: "9px 15px",
        fontSize: 14,
        fontWeight: 700,
        color: B.dark,
        boxShadow: "0 14px 34px rgba(15,23,42,0.16)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.6)",
        transition: `all 0.6s ${EASE} ${delay}ms`,
        ...style,
      }}
    >
      <span style={{ animation: active ? `floaty 4s ease-in-out ${delay}ms infinite` : "none", display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </div>
  );
}

/* ══════════════════ SLIDE 1 — HERO ══════════════════ */

/* A network of entities linking together — the EntityLink motif.
   Nodes pop in, then links draw themselves between them. */
const NET_NODES = [
  { x: 110, y: 120, r: 7 }, { x: 300, y: 70, r: 5 }, { x: 520, y: 150, r: 9 },
  { x: 760, y: 80, r: 5 }, { x: 1010, y: 130, r: 7 }, { x: 1160, y: 260, r: 5 },
  { x: 180, y: 330, r: 5 }, { x: 420, y: 380, r: 7 }, { x: 660, y: 300, r: 11 },
  { x: 900, y: 370, r: 6 }, { x: 90, y: 540, r: 6 }, { x: 330, y: 590, r: 8 },
  { x: 600, y: 560, r: 5 }, { x: 850, y: 600, r: 7 }, { x: 1100, y: 520, r: 8 },
];
const NET_LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [6, 7], [7, 8], [2, 8],
  [8, 9], [9, 5], [6, 10], [10, 11], [11, 7], [11, 12], [12, 8], [12, 13], [13, 9], [13, 14], [14, 5],
];

function HeroNetwork({ active }) {
  return (
    <svg
      viewBox="0 0 1240 680"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {NET_LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={NET_NODES[a].x} y1={NET_NODES[a].y}
          x2={NET_NODES[b].x} y2={NET_NODES[b].y}
          stroke={B.primary}
          strokeOpacity={0.16}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={active ? 0 : 1}
          style={{ transition: `stroke-dashoffset 1.2s ${EASE} ${400 + i * 90}ms` }}
        />
      ))}
      {NET_NODES.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y} r={n.r}
          fill={i % 3 === 0 ? B.primary : B.gray300}
          opacity={active ? (i % 3 === 0 ? 0.35 : 0.5) : 0}
          style={{
            transition: `opacity 0.6s ease ${200 + i * 70}ms`,
            transformOrigin: `${n.x}px ${n.y}px`,
            animation: active ? `nodeBreathe ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` : "none",
          }}
        />
      ))}
    </svg>
  );
}

function HeroSlide({ active }) {
  return (
    <SlideWrap active={active}>
      <HeroNetwork active={active} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 980 }}>
        <div style={{ overflow: "hidden", padding: "6px 0" }}>
          <img
            src={A("/logo_entitylink.svg")}
            alt="EntityLink"
            style={{
              height: "clamp(90px, 15vh, 150px)",
              width: "auto",
              maxWidth: "70vw",
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0) scale(1)" : "translateY(60px) scale(0.92)",
              transition: `all 1.1s ${EASE} 450ms`,
              filter: active ? "blur(0)" : "blur(10px)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "clamp(20px, 2.6vw, 30px)",
            fontWeight: 300,
            color: B.gray500,
            marginTop: 30,
            lineHeight: 1.5,
            ...rise(active, 950, 26),
          }}
        >
          ניהול ישויות משפטיות בעידן של{" "}
          <b style={{ fontWeight: 700, color: B.dark }}>צמיחה, רגולציה ומורכבות תאגידית</b>
        </p>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: B.gray400,
            fontSize: 16,
            ...rise(active, 1300, 16),
          }}
        >
          <span style={{ fontWeight: 600, color: B.dark700 }}>ניל דהאן</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: B.gray300 }} />
          <span>סמנכ״ל מוצר</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: B.gray300 }} />
          <span dir="ltr" style={{ fontFamily: `'${B.fontEn}', sans-serif` }}>SQLink Group</span>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 2 — PROBLEM ══════════════════ */

const PAIN_ITEMS = [
  { icon: "chart", text: "מידע מפוזר בין אקסלים, מיילים ומערכות נפרדות" },
  { icon: "eye-off", text: "קושי לראות את מבנה האחזקות המלא במבט אחד" },
  { icon: "clock", text: "דדליינים רגולטוריים שמתפספסים" },
  { icon: "globe", text: "חוסר שקיפות בין מדינות וגופים" },
];

const CHAOS_CARDS = [
  { icon: "chart", label: "Entities_FINAL_v7.xlsx", note: "עודכן לפני 4 חודשים", rot: -7, x: "6%", y: "6%", color: "#16A34A" },
  { icon: "envelope", label: "RE: RE: FW: מסמכי התאגדות", note: "קבור בתיבת המייל", rot: 5, x: "44%", y: "17%", color: B.na },
  { icon: "folder", label: "תיקייה משותפת · גרסה ישנה", note: "מי עדכן אחרון?", rot: -4, x: "12%", y: "48%", color: B.cala },
  { icon: "scale", label: "דדליין הגשה — מחר!", note: "אף אחד לא קיבל תזכורת", rot: 6, x: "48%", y: "58%", color: B.red },
];

function ProblemSlide({ active }) {
  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="10%" y="15%" color={B.red} opacity={0.05} />
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "4vw", alignItems: "center", width: "100%", maxWidth: 1360, position: "relative", zIndex: 1 }}>
        <div>
          <Kicker active={active}>האתגר</Kicker>
          <h2 style={{ fontSize: "clamp(34px, 4.2vw, 54px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 30px", ...rise(active, 250) }}>
            המידע קיים — <span style={{ color: B.primary }}>אבל הוא מפוזר</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PAIN_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "15px 20px",
                  borderRadius: 14,
                  background: B.white,
                  border: `1px solid ${B.gray200}`,
                  boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
                  fontSize: "clamp(16px, 1.6vw, 21px)",
                  color: B.dark700,
                  ...riseX(active, 550 + i * 150),
                }}
              >
                <IconBox name={item.icon} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: "clamp(15px, 1.5vw, 19px)", fontWeight: 600, color: B.primaryDark, fontStyle: "italic", ...rise(active, 1250, 14) }}>
            וכשהרגולטור שואל שאלה — מבזבזים ימים על איסוף מידע.
          </div>
        </div>

        {/* chaos board */}
        <div style={{ position: "relative", height: "min(58vh, 520px)" }}>
          {CHAOS_CARDS.map((c, i) => (
            <div
              key={i}
              dir="rtl"
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                width: "min(50%, 264px)",
                "--rot": `${c.rot}deg`,
                display: "flex",
                alignItems: "center",
                gap: 13,
                background: `linear-gradient(180deg, #ffffff 0%, ${c.color}0a 100%)`,
                border: `1px solid ${c.color}2e`,
                borderRadius: 18,
                padding: "15px 16px",
                boxShadow: `0 22px 46px -14px ${c.color}3d, 0 4px 14px rgba(15,23,42,0.06)`,
                backdropFilter: "blur(2px)",
                opacity: active ? 1 : 0,
                transform: active ? `rotate(${c.rot}deg) scale(1)` : `rotate(${c.rot * 2.4}deg) scale(0.55) translateY(60px)`,
                transition: `all 0.85s ${EASE} ${650 + i * 190}ms`,
                animation: active ? `cardSway ${4.5 + i * 0.7}s ease-in-out ${i * 0.6}s infinite` : "none",
              }}
            >
              <IconBox name={c.icon} color={c.color} size={42} icon={21} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div dir="auto" style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3, color: B.dark, marginBottom: 4 }}>{c.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: B.gray500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.note}</span>
                </div>
              </div>
            </div>
          ))}
          {["?", "!", "?"].map((q, i) => (
            <div
              key={`q${i}`}
              style={{
                position: "absolute",
                left: `${20 + i * 30}%`,
                top: `${10 + i * 26}%`,
                fontSize: 34,
                fontWeight: 900,
                color: i === 1 ? B.red : B.primary,
                opacity: active ? 0.5 : 0,
                transition: `opacity 0.6s ease ${1500 + i * 200}ms`,
                animation: active ? `questionBob ${3.2 + i}s ease-in-out ${i * 0.9}s infinite` : "none",
                pointerEvents: "none",
              }}
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 3 — SOLUTION GRID ══════════════════ */

const FEATURES = [
  { icon: "building", title: "ניהול ישויות", desc: "פרופיל מלא לכל חברה לאורך כל מחזור החיים" },
  { icon: "tree", title: "עץ ארגוני", desc: "מבנה האחזקות והבעלות במבט אחד" },
  { icon: "gear", title: "תהליכי עבודה", desc: "Workflows אוטומטיים עם דדליינים" },
  { icon: "globe", title: "מפה גלובלית", desc: "כל הישויות לפי אזור, סטטוס וסוג" },
  { icon: "folder", title: "ארכיון מסמכים", desc: "תיעוד מלא עם בקרת גרסאות" },
  { icon: "chart", title: "דוחות ואנליטיקה", desc: "ייצוא ל-PDF/Excel ומעקב KPI" },
];

function SolutionSlide({ active }) {
  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="88%" y="10%" />
      <div style={{ width: "100%", maxWidth: 1280, position: "relative", zIndex: 1 }}>
        <Kicker active={active}>הפתרון · יכולות הפלטפורמה</Kicker>
        <h2 style={{ fontSize: "clamp(34px, 4.2vw, 54px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 40px", ...rise(active, 250) }}>
          פלטפורמה <span style={{ color: B.primary }}>אחת</span> לניהול כל הישויות
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                background: B.white,
                border: `1px solid ${B.gray200}`,
                borderRadius: 18,
                padding: "26px 24px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
                position: "relative",
                overflow: "hidden",
                ...pop(active, 500 + i * 120),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  insetInlineStart: 0,
                  insetInlineEnd: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${B.primary}, ${B.primaryLight})`,
                  transform: active ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "right",
                  transition: `transform 0.9s ${EASE} ${800 + i * 120}ms`,
                }}
              />
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: "rgba(232,97,45,0.09)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  transform: active ? "scale(1) rotate(0deg)" : "scale(0) rotate(-30deg)",
                  transition: `transform 0.7s ${EASE} ${650 + i * 120}ms`,
                }}
              >
                <FlatIcon name={f.icon} size={26} color={B.primary} />
              </div>
              <div style={{ fontSize: "clamp(17px, 1.7vw, 22px)", fontWeight: 700, color: B.dark, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: "clamp(13px, 1.3vw, 16px)", color: B.gray500, lineHeight: 1.45 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 4 — ANIMATED ORG TREE ══════════════════ */

/* Tree geometry in a 0–100 coordinate space (x, y = node centers).
   Cards mimic the real EntityLink org-chart: pastel header with flag +
   name, body with Country / SAP #, and a Shareholders section. */
const TREE = {
  root: {
    x: 50, y: 10, name: "Northvale Holdings", color: B.primary, header: "#FFDFC8",
    flag: "🇺🇸", country: "United States", sap: "10001",
  },
  l2: [
    { x: 13, y: 45, name: "Northvale US Inc.", color: B.na, header: "#BEE3F8", flag: "🇺🇸", country: "United States", sap: "99127", holder: "Northvale Holdings", pct: 100 },
    { x: 38, y: 45, name: "Northvale GmbH", color: B.emea, header: "#E4D6F8", flag: "🇩🇪", country: "Germany", sap: "55669", holder: "Northvale Holdings", pct: 100 },
    { x: 63, y: 45, name: "Northvale APAC Pte.", color: B.apac, header: "#C6EFF8", flag: "🇸🇬", country: "Singapore", sap: "6655", holder: "Northvale Holdings", pct: 80 },
    { x: 88, y: 45, name: "Northvale Israel Ltd.", color: B.israel, header: "#CDF3E1", flag: "🇮🇱", country: "Israel", sap: "12345", holder: "Northvale Holdings", pct: 100 },
  ],
  l3: [
    { x: 13, y: 86, parent: 0, name: "Northvale Canada", color: B.na, header: "#BEE3F8", flag: "🇨🇦", country: "Canada", sap: "44456", holder: "Northvale US Inc.", pct: 75 },
    { x: 38, y: 86, parent: 1, name: "Northvale France SAS", color: B.emea, header: "#E4D6F8", flag: "🇫🇷", country: "France", sap: "12312", holder: "Northvale GmbH", pct: 60 },
    { x: 63, y: 86, parent: 2, name: "Northvale Japan KK", color: B.apac, header: "#C6EFF8", flag: "🇯🇵", country: "Japan", sap: "5556", holder: "Northvale APAC Pte.", pct: 55 },
    { x: 88, y: 86, parent: 3, name: "Northvale R&D Ltd.", color: B.israel, header: "#CDF3E1", flag: "🇮🇱", country: "Israel", sap: "12346", holder: "Northvale Israel Ltd.", pct: 100 },
  ],
};

function connectorPath(x1, y1, x2, y2) {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

function TreeNode({ active, delay, node, root = false }) {
  /* count-up in hundredths so the shareholder % lands on e.g. "100.00%" */
  const pctRaw = useCountUp(active, (node.pct || 0) * 100, { duration: 1000, delay: delay + 350 });
  return (
    <div
      dir="ltr"
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: active ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.4)",
        opacity: active ? 1 : 0,
        transition: `all 0.7s ${EASE} ${delay}ms`,
        width: root ? 208 : 192,
        background: B.white,
        border: `1px solid ${B.gray200}`,
        borderRadius: 10,
        overflow: "hidden",
        textAlign: "left",
        fontFamily: `'${B.fontEn}', sans-serif`,
        boxShadow: root ? "0 16px 40px rgba(232,97,45,0.16)" : "0 10px 26px rgba(15,23,42,0.1)",
        zIndex: 2,
      }}
    >
      <div
        style={{
          background: node.header,
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: root ? 13.5 : 12.5,
          fontWeight: 600,
          color: B.dark,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>{node.flag}</span>
        <FlatIcon name="globe" size={13} color={B.dark700} strokeWidth={1.6} />
        {node.name}
      </div>
      <div style={{ padding: "8px 10px 9px" }}>
        <div style={{ fontSize: 11, color: B.gray500, marginBottom: 4 }}>Country: {node.country}</div>
        <div style={{ fontSize: 11, color: B.gray500 }}>SAP #: {node.sap}</div>
        {node.holder && (
          <>
            <div style={{ height: 1, background: B.gray200, margin: "8px 0 6px" }} />
            <div style={{ fontSize: 10.5, color: B.gray400, marginBottom: 5 }}>Shareholders</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, color: B.dark700 }}>
              <span>{node.holder}:</span>
              <span style={{ fontWeight: 700, color: B.dark, fontVariantNumeric: "tabular-nums" }}>{(pctRaw / 100).toFixed(2)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrgTreeSlide({ active }) {
  /* connector draw delays: root→L2 after root pops, L2→L3 later */
  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="14%" y="80%" color={B.israel} opacity={0.05} />
      <div style={{ display: "grid", gridTemplateColumns: "0.75fr 1.6fr", gap: "3vw", alignItems: "center", width: "100%", maxWidth: 1500, position: "relative", zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: "clamp(28px, 3.2vw, 44px)", fontWeight: 800, lineHeight: 1.14, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 26px", ...rise(active, 250) }}>
            עץ ארגוני — כל המבנה <span style={{ color: B.primary }}>במבט אחד</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "link", text: "מבנה אחזקות, חברות בנות ובעלי מניות" },
              { icon: "trend", text: "אחוזי החזקה, זכויות הצבעה וסוגי מניות" },
              { icon: "filter", text: "צבעים לפי סוג ישות, אזור ופרמטרים נוספים" },
              { icon: "download", text: "ייצוא מלא של העץ הארגוני" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  fontSize: "clamp(15px, 1.45vw, 19px)",
                  color: B.dark700,
                  ...riseX(active, 2500 + i * 180),
                }}
              >
                <IconBox name={item.icon} size={36} icon={18} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, fontSize: "clamp(13.5px, 1.3vw, 16px)", color: B.gray500, ...rise(active, 3100, 12) }}>
            לחיצה על כל ישות פותחת את הפרופיל המלא שלה.
          </div>
        </div>

        {/* the self-building tree */}
        <div dir="ltr" style={{ position: "relative", height: "min(66vh, 620px)" }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          >
            {TREE.l2.map((n, i) => (
              <path
                key={`c2-${i}`}
                d={connectorPath(TREE.root.x, TREE.root.y + 7, n.x, n.y - 12)}
                fill="none"
                stroke={B.gray400}
                strokeOpacity={0.8}
                strokeWidth={0.18}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={active ? 0 : 1}
                style={{ transition: `stroke-dashoffset 0.9s ${EASE} ${700 + i * 130}ms` }}
              />
            ))}
            {TREE.l3.map((n, i) => (
              <path
                key={`c3-${i}`}
                d={connectorPath(TREE.l2[n.parent].x, TREE.l2[n.parent].y + 12, n.x, n.y - 12)}
                fill="none"
                stroke={B.gray400}
                strokeOpacity={0.8}
                strokeWidth={0.18}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={active ? 0 : 1}
                style={{ transition: `stroke-dashoffset 0.9s ${EASE} ${1650 + i * 130}ms` }}
              />
            ))}
          </svg>

          {/* connection dots at card anchors, like the real chart */}
          {[
            { x: TREE.root.x, y: TREE.root.y + 7, d: 700 },
            ...TREE.l2.flatMap((n, i) => [
              { x: n.x, y: n.y - 12, d: 1050 + i * 130 },
              { x: n.x, y: n.y + 12, d: 1650 + i * 130 },
            ]),
            ...TREE.l3.map((n, i) => ({ x: n.x, y: n.y - 12, d: 2000 + i * 130 })),
          ].map((pt, i) => (
            <div
              key={`dot-${i}`}
              style={{
                position: "absolute",
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: B.gray400,
                transform: "translate(-50%, -50%)",
                opacity: active ? 1 : 0,
                transition: `opacity 0.4s ease ${pt.d}ms`,
                zIndex: 1,
              }}
            />
          ))}

          <TreeNode active={active} delay={350} node={TREE.root} root />
          {TREE.l2.map((n, i) => (
            <TreeNode key={`n2-${i}`} active={active} delay={1050 + i * 150} node={n} />
          ))}
          {TREE.l3.map((n, i) => (
            <TreeNode key={`n3-${i}`} active={active} delay={2000 + i * 150} node={n} />
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 5 — ENTITY MANAGEMENT ══════════════════ */


function EntitiesSlide({ active }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!active) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 2600);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="10%" y="12%" color={B.na} opacity={0.05} />
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.35fr", gap: "3.5vw", alignItems: "center", width: "100%", maxWidth: 1460, position: "relative", zIndex: 1 }}>
        <div>
          <Kicker active={active}>ניהול ישויות</Kicker>
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 46px)", fontWeight: 800, lineHeight: 1.14, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 26px", ...rise(active, 250) }}>
            כל ישות — <span style={{ color: B.primary }}>פרופיל מלא</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              { icon: "building", text: "חברות קבוצה, סניפים וספקי שירות במקום אחד" },
              { icon: "users", text: "נושאי משרה, מורשי חתימה ובעלי מניות" },
              { icon: "database", text: "מספרי רישום, נתוני מס וסטטוס" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  fontSize: "clamp(15px, 1.5vw, 20px)",
                  color: B.dark700,
                  lineHeight: 1.4,
                  ...riseX(active, 500 + i * 170),
                }}
              >
                <IconBox name={item.icon} size={36} icon={18} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, fontSize: "clamp(13.5px, 1.3vw, 16px)", color: B.gray500, ...rise(active, 1100, 12) }}>
            הכול מקושר לעץ הארגוני שראינו.
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {/* browser window that drills from the list into a single entity */}
          <div
            dir="ltr"
            style={{
              background: B.white,
              border: `1px solid ${B.gray200}`,
              borderRadius: 16,
              boxShadow: "0 30px 70px rgba(15,23,42,0.16), 0 6px 18px rgba(15,23,42,0.06)",
              overflow: "hidden",
              opacity: active ? 1 : 0,
              transform: active
                ? "perspective(1400px) rotateX(0deg) translateY(0) scale(1)"
                : "perspective(1400px) rotateX(10deg) translateY(46px) scale(0.94)",
              transition: `all 1s ${EASE} 450ms`,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: B.gray100, borderBottom: `1px solid ${B.gray200}` }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <span style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: 12, color: B.gray500, fontWeight: 500 }}>
                EntityLink — {entered ? "Northvale Israel Ltd." : "Legal Entities"}
              </span>
            </div>
            <div style={{ position: "relative", lineHeight: 0 }}>
              <img
                src={A("/screenshots/01-legal-entities.png")}
                alt="Legal Entities"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  opacity: entered ? 0 : 1,
                  transform: entered ? "scale(1.08)" : "scale(1)",
                  transition: `all 0.85s ${EASE}`,
                }}
              />
              <img
                src={A("/screenshots/04-entity-overview.png")}
                alt="Northvale Israel Ltd. — Overview"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  display: "block",
                  opacity: entered ? 1 : 0,
                  transform: entered ? "scale(1)" : "scale(1.06)",
                  transition: `all 0.85s ${EASE}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 6 — SHAREHOLDERS & TRANSACTIONS ══════════════════ */

/* Mimics the real Shareholders screen: cap table + a live transaction.
   Northvale Holdings transfers 20% to a new investor — percentages
   count, the donut re-slices, and a transaction row is logged. */
function ShDonut({ pct }) {
  /* two segments on a pathLength=100 circle; purple grows clockwise from 12 o'clock */
  return (
    <svg width="118" height="118" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="47" fill="none" stroke={B.gray200} strokeWidth="16" />
      <circle
        cx="64" cy="64" r="47" fill="none"
        stroke={B.primary} strokeWidth="16"
        strokeLinecap={pct > 0 ? "butt" : "round"}
        pathLength="100"
        strokeDasharray={`${100 - pct} ${pct}`}
        strokeDashoffset={-pct}
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dasharray 0.2s linear, stroke-dashoffset 0.2s linear" }}
      />
      <circle
        cx="64" cy="64" r="47" fill="none"
        stroke={B.emea} strokeWidth="16"
        pathLength="100"
        strokeDasharray={`${pct} ${100 - pct}`}
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dasharray 0.2s linear" }}
      />
      <text x="64" y="61" textAnchor="middle" fontSize="13.5" fontWeight="700" fill={B.dark} fontFamily={`'${B.fontEn}', sans-serif`}>
        1,000,000
      </text>
      <text x="64" y="77" textAnchor="middle" fontSize="9.5" fill={B.gray500} fontFamily={`'${B.fontEn}', sans-serif`}>
        Shares
      </text>
    </svg>
  );
}

function ShareholdersSlide({ active }) {
  const [txStarted, setTxStarted] = useState(false);
  useEffect(() => {
    if (!active) {
      setTxStarted(false);
      return;
    }
    const t = setTimeout(() => setTxStarted(true), 2600);
    return () => clearTimeout(t);
  }, [active]);

  const pct = useCountUp(txStarted, 20, { duration: 1300, delay: 250 });

  const cell = { padding: "8px 12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const grid = { display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr", alignItems: "center" };

  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="12%" y="80%" color={B.emea} opacity={0.05} />
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.35fr", gap: "3.5vw", alignItems: "center", width: "100%", maxWidth: 1460, position: "relative", zIndex: 1 }}>
        <div>
          <Kicker active={active}>בעלי מניות</Kicker>
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 46px)", fontWeight: 800, lineHeight: 1.14, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 26px", ...rise(active, 250) }}>
            בעלי מניות — <span style={{ color: B.primary }}>כל טרנזקציה מתועדת</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              { icon: "users", text: "בעלי מניות, אחוזי החזקה וזכויות הצבעה — לכל ישות" },
              { icon: "trend", text: "הקצאות והעברות מניות — עם המסמכים המצורפים" },
              { icon: "clock", text: "מבט לכל נקודת זמן — מי החזיק מה, ומתי" },
              { icon: "scale", text: "אחוז כלכלי מול זכויות הצבעה — שקוף וברור" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, fontSize: "clamp(15px, 1.45vw, 19px)", color: B.dark700, lineHeight: 1.4, ...riseX(active, 500 + i * 170) }}>
                <IconBox name={item.icon} size={36} icon={18} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, fontSize: "clamp(13.5px, 1.3vw, 16px)", color: B.gray500, ...rise(active, 1250, 12) }}>
            Due Diligence או סכסוך בעלי מניות? שרשרת ההעברות המלאה — בשניות.
          </div>
        </div>

        {/* Shareholders panel — app-faithful, LTR */}
        <div
          dir="ltr"
          style={{
            background: B.white,
            border: `1px solid ${B.gray200}`,
            borderRadius: 16,
            boxShadow: "0 30px 70px rgba(15,23,42,0.12), 0 6px 18px rgba(15,23,42,0.05)",
            padding: "16px 20px 18px",
            position: "relative",
            overflow: "hidden",
            fontFamily: `'${B.fontEn}', sans-serif`,
            textAlign: "left",
            ...rise(active, 450, 34),
          }}
        >
          {/* header: title + view toggle + transaction button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: B.dark, ...rise(active, 700, 8) }}>Shareholders as of Today</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", border: `1px solid ${B.gray200}`, borderRadius: 8, overflow: "hidden", ...pop(active, 850) }}>
                {["List", "Org Chart", "Org Table"].map((v, i) => (
                  <span key={v} style={{ fontSize: 10, fontWeight: 600, padding: "5px 10px", background: i === 0 ? B.dark : B.white, color: i === 0 ? B.white : B.gray500, borderLeft: i > 0 ? `1px solid ${B.gray200}` : "none" }}>
                    {v}
                  </span>
                ))}
              </div>
              <div
                style={{
                  background: B.primary,
                  color: B.white,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "6px 13px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: txStarted ? "none" : active ? "0 0 0 5px rgba(232,97,45,0.15)" : "none",
                  animation: active && !txStarted ? "pulseRing 1.6s ease-out 1400ms infinite" : "none",
                  ...pop(active, 950),
                }}
              >
                <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> Transaction
              </div>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${B.gray200}`, marginBottom: 12, ...rise(active, 900, 8) }}>
            {["Active Shareholders", "Shareholders History", "Transactions", "Notes"].map((t, i) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 600, paddingBottom: 7, color: i === 0 ? B.primary : B.gray500, borderBottom: i === 0 ? `2px solid ${B.primary}` : "2px solid transparent" }}>
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 158px", gap: 14, alignItems: "start" }}>
            <div>
              {/* cap table */}
              <div style={{ borderRadius: 9, overflow: "hidden", border: `1px solid ${B.gray200}`, ...rise(active, 1100, 14) }}>
                <div style={{ ...grid, background: B.dark, color: B.white, fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>
                  <span style={cell}>Name</span>
                  <span style={cell}>Holdings %</span>
                  <span style={cell}>Share Class</span>
                  <span style={cell}>Voting Rights</span>
                </div>
                <div style={{ ...grid, fontSize: 11, color: B.dark700, background: B.white }}>
                  <span style={{ ...cell, fontWeight: 600, color: B.dark, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.israel, flexShrink: 0 }} />
                    Northvale Holdings
                  </span>
                  <span style={{ ...cell, fontWeight: 700, color: B.dark, fontVariantNumeric: "tabular-nums" }}>{100 - pct}%</span>
                  <span style={cell}>General</span>
                  <span style={{ ...cell, fontVariantNumeric: "tabular-nums" }}>{100 - pct}%</span>
                </div>
                <div
                  style={{
                    ...grid,
                    fontSize: 11,
                    color: B.dark700,
                    background: "rgba(139,92,246,0.06)",
                    borderTop: `1px solid ${B.gray100}`,
                    maxHeight: txStarted ? 40 : 0,
                    opacity: txStarted ? 1 : 0,
                    transform: txStarted ? "translateX(0)" : "translateX(26px)",
                    transition: `all 0.7s ${EASE} 200ms`,
                    overflow: "hidden",
                  }}
                >
                  <span style={{ ...cell, fontWeight: 600, color: B.dark, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.emea, flexShrink: 0 }} />
                    Atlas Capital Partners
                  </span>
                  <span style={{ ...cell, fontWeight: 700, color: B.emea, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
                  <span style={cell}>General</span>
                  <span style={{ ...cell, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
                </div>
              </div>

              {/* transactions log */}
              <div style={{ marginTop: 12, ...rise(active, 1300, 12) }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: B.gray500, marginBottom: 6, letterSpacing: 0.4 }}>TRANSACTIONS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, color: B.dark700, background: B.gray100, borderRadius: 7, padding: "6px 10px" }}>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: B.gray500 }}>07/03/2025</span>
                    <span style={{ fontWeight: 700, color: B.israel }}>Issuance</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>1,000,000 Ordinary → Northvale Holdings</span>
                    <span style={{ marginLeft: "auto", flexShrink: 0 }}><FlatIcon name="petition" size={12} color={B.gray400} /></span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 10.5,
                      color: B.dark700,
                      background: "rgba(232,97,45,0.07)",
                      border: `1px solid rgba(232,97,45,0.25)`,
                      borderRadius: 7,
                      padding: "6px 10px",
                      maxHeight: txStarted ? 34 : 0,
                      opacity: txStarted ? 1 : 0,
                      transform: txStarted ? "translateY(0)" : "translateY(-8px)",
                      transition: `all 0.65s ${EASE} 1300ms`,
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontVariantNumeric: "tabular-nums", color: B.gray500 }}>07/02/2026</span>
                    <span style={{ fontWeight: 700, color: B.primary }}>Transfer</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>20% · Northvale Holdings → Atlas Capital Partners</span>
                    <span style={{ marginLeft: "auto", flexShrink: 0 }}><FlatIcon name="petition" size={12} color={B.primary} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ownership donut */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...pop(active, 1450) }}>
              <ShDonut pct={pct} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: B.dark700, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: B.primary, flexShrink: 0 }} />
                  Northvale Holdings
                  <b style={{ color: B.dark, fontVariantNumeric: "tabular-nums" }}>{100 - pct}%</b>
                </span>
                <span style={{ fontSize: 10, color: B.dark700, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", opacity: txStarted ? 1 : 0.3, transition: "opacity 0.5s ease 400ms" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: B.emea, flexShrink: 0 }} />
                  Atlas Capital
                  <b style={{ color: B.dark, fontVariantNumeric: "tabular-nums" }}>{pct}%</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 7 — CORPORATE ARCHIVE ══════════════════ */

/* Mimics the real EntityLink Archive screen: a corporate-standard folder
   tree on the left, and documents that fly into their folders. */
const AR_FOLDERS = [
  { name: "Main Folder", indent: 0, main: true },
  { name: "1.1 Basic Data", indent: 1 },
  { name: "1.2 General Meetings", indent: 1 },
  { name: "1.5 Articles of Association", indent: 1 },
  { name: "2.1 Board of Directors", indent: 1 },
  { name: "2.4 Officers Agreements", indent: 1 },
  { name: "3.1 Powers of Attorney", indent: 1 },
];
const AR_DOCS = [
  { name: "Certificate of Incorporation.pdf", folder: 1 },
  { name: "Registrar Extract 2026.pdf", folder: 1 },
  { name: "AGM Minutes 04-2026.pdf", folder: 2 },
  { name: "Articles of Association v3.pdf", folder: 3 },
  { name: "Board Resolution 12-2026.pdf", folder: 4 },
  { name: "Officer Agreement — D. Levy.pdf", folder: 5 },
  { name: "POA — A. Cohen.pdf", folder: 6 },
];
const AR_FILTERS = ["All Categories", "Regular", "Financial", "Law Firm", "Banking", "Tax"];

const AR_ROW_H = 38;
const AR_TREE_TOP = 6;
const folderTop = (f) => AR_TREE_TOP + f * AR_ROW_H;

function ArchiveSlide({ active }) {
  const [filed, setFiled] = useState(() => AR_DOCS.map(() => false));
  const [arrived, setArrived] = useState(() => AR_DOCS.map(() => false));

  useEffect(() => {
    if (!active) {
      setFiled(AR_DOCS.map(() => false));
      setArrived(AR_DOCS.map(() => false));
      return;
    }
    const ts = [];
    AR_DOCS.forEach((_, i) => {
      ts.push(setTimeout(() => setFiled((f) => f.map((v, k) => (k === i ? true : v))), 2500 + i * 520));
      ts.push(setTimeout(() => setArrived((f) => f.map((v, k) => (k === i ? true : v))), 2500 + i * 520 + 680));
    });
    return () => ts.forEach(clearTimeout);
  }, [active]);

  const folderCount = (f) => arrived.filter((a, i) => a && AR_DOCS[i].folder === f).length;
  const totalArrived = arrived.filter(Boolean).length;
  const allDone = totalArrived === AR_DOCS.length;

  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <Glow x="90%" y="85%" color={B.emea} opacity={0.05} />
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.35fr", gap: "3.5vw", alignItems: "center", width: "100%", maxWidth: 1460, position: "relative", zIndex: 1 }}>
        <div>
          <Kicker active={active}>ארכיון מסמכים</Kicker>
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 46px)", fontWeight: 800, lineHeight: 1.14, letterSpacing: "-0.5px", color: B.dark, margin: "0 0 26px", ...rise(active, 250) }}>
            ארכיון תאגידי — <span style={{ color: B.primary }}>כל מסמך במקומו</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              { icon: "folder", text: "תיקיות בסטנדרט תאגידי — רישום, אסיפות, דירקטוריון" },
              { icon: "users", text: "מסמכי הארגון ומסמכי נושאי המשרה — במקום אחד" },
              { icon: "filter", text: "סינון לפי קטגוריה, תאריך וישות — איתור בשניות" },
              { icon: "check", text: "בקרת גרסאות, הרשאות ותיעוד מלא" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, fontSize: "clamp(15px, 1.45vw, 19px)", color: B.dark700, lineHeight: 1.4, ...riseX(active, 500 + i * 170) }}>
                <IconBox name={item.icon} size={36} icon={18} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, fontSize: "clamp(13.5px, 1.3vw, 16px)", color: B.gray500, ...rise(active, 1250, 12) }}>
            ביקורת או Due Diligence? הכול מתויק וזמין — בלחיצה.
          </div>
        </div>

        {/* Archive panel — app-faithful, LTR */}
        <div
          dir="ltr"
          style={{
            background: B.white,
            border: `1px solid ${B.gray200}`,
            borderRadius: 16,
            boxShadow: "0 30px 70px rgba(15,23,42,0.12), 0 6px 18px rgba(15,23,42,0.05)",
            padding: "16px 20px 20px",
            position: "relative",
            overflow: "hidden",
            fontFamily: `'${B.fontEn}', sans-serif`,
            textAlign: "left",
            ...rise(active, 450, 34),
          }}
        >
          {/* breadcrumb */}
          <div style={{ fontSize: 11, color: B.gray400, ...rise(active, 700, 10) }}>
            Home / Legal Entities / <span style={{ color: B.gray500 }}>Northvale Israel Ltd.</span> / <span style={{ color: B.dark, fontWeight: 600 }}>Archive</span>
          </div>

          {/* title + create */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 10px" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: B.dark, ...rise(active, 800, 10) }}>Archive</div>
            <div
              style={{
                background: B.primary,
                color: B.white,
                fontSize: 11.5,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                gap: 5,
                ...pop(active, 950),
              }}
            >
              <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> Create
            </div>
          </div>

          {/* filter chips */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "nowrap" }}>
            {AR_FILTERS.map((f, i) => (
              <span
                key={f}
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  background: i === 0 ? B.dark : B.white,
                  color: i === 0 ? B.white : B.gray500,
                  border: i === 0 ? `1px solid ${B.dark}` : `1px solid ${B.gray200}`,
                  ...pop(active, 900 + i * 60),
                }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* body: folder tree + flying docs / table */}
          <div style={{ position: "relative", height: AR_TREE_TOP + AR_FOLDERS.length * AR_ROW_H + 6 }}>
            {/* indent guide line */}
            <div
              style={{
                position: "absolute",
                left: 9,
                top: folderTop(0) + 30,
                width: 1.5,
                background: B.gray200,
                height: active ? folderTop(AR_FOLDERS.length - 1) - folderTop(0) - 12 : 0,
                transition: `height 0.9s ${EASE} 1400ms`,
              }}
            />

            {/* folder rows */}
            {AR_FOLDERS.map((f, i) => {
              const count = f.main ? totalArrived : folderCount(i);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: f.indent * 20,
                    top: folderTop(i),
                    width: "46%",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 8px",
                    borderRadius: 7,
                    background: f.main ? "#FCE7EE" : "transparent",
                    opacity: active ? 1 : 0,
                    transform: active ? "translateX(0)" : "translateX(-14px)",
                    transition: `opacity 0.55s ${EASE} ${1000 + i * 110}ms, transform 0.55s ${EASE} ${1000 + i * 110}ms`,
                  }}
                >
                  <span style={{ fontSize: 9, color: B.gray400, width: 8, flexShrink: 0 }}>{f.main ? "⊟" : "▸"}</span>
                  <FlatIcon name="folder" size={14} color={f.main ? B.primaryDark : B.gray500} strokeWidth={1.7} />
                  <span style={{ fontSize: 12, fontWeight: f.main ? 700 : 600, color: B.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {f.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: count > 0 ? B.primary : B.gray400,
                      fontVariantNumeric: "tabular-nums",
                      transition: "color 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    ({count})
                  </span>
                </div>
              );
            })}

            {/* documents — appear as a pile, then fly into folders */}
            {AR_DOCS.map((d, i) => {
              const isFiled = filed[i];
              const tgtTop = folderTop(d.folder) + 3;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: isFiled ? "10%" : "54%",
                    top: isFiled ? tgtTop : AR_TREE_TOP + i * (AR_ROW_H - 4),
                    width: "43%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: B.white,
                    border: `1px solid ${B.gray200}`,
                    borderRadius: 8,
                    padding: "6px 10px",
                    boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
                    opacity: active ? (arrived[i] ? 0 : 1) : 0,
                    transform: `scale(${arrived[i] ? 0.3 : active ? 1 : 0.6})`,
                    transition: `left 0.7s ${EASE}, top 0.7s ${EASE}, opacity 0.45s ease ${active && !isFiled ? 1500 + i * 100 : 150}ms, transform 0.6s ${EASE} ${active && !isFiled ? 1500 + i * 100 : 0}ms`,
                    zIndex: 3,
                  }}
                >
                  <FlatIcon name="document" size={14} color={B.primary} strokeWidth={1.7} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: B.dark700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.name}
                  </span>
                </div>
              );
            })}

            {/* results table — fades in once everything is filed */}
            <div
              style={{
                position: "absolute",
                left: "52%",
                top: AR_TREE_TOP + 2,
                width: "46%",
                borderRadius: 9,
                overflow: "hidden",
                border: `1px solid ${B.gray200}`,
                opacity: allDone ? 1 : 0,
                transform: allDone ? "translateY(0)" : "translateY(14px)",
                transition: `all 0.7s ${EASE} 300ms`,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.9fr 1fr", background: B.dark, color: B.white, fontSize: 9.5, fontWeight: 600, padding: "7px 10px", gap: 8, letterSpacing: 0.3 }}>
                <span>Date</span>
                <span>Name</span>
                <span>Category</span>
              </div>
              {[
                { date: "12/03/2026", name: "Board Resolution 12-2026", cat: "Corporate" },
                { date: "04/15/2026", name: "Officer Agreement — D. Levy", cat: "Legal" },
                { date: "05/02/2026", name: "POA — A. Cohen", cat: "Legal" },
                { date: "05/11/2026", name: "AGM Minutes 04-2026", cat: "Corporate" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.9fr 1fr",
                    fontSize: 9.5,
                    color: B.dark700,
                    padding: "7px 10px",
                    gap: 8,
                    background: i % 2 ? B.gray100 : B.white,
                    borderTop: `1px solid ${B.gray100}`,
                    opacity: allDone ? 1 : 0,
                    transition: `opacity 0.5s ease ${500 + i * 130}ms`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.date}</span>
                  <span style={{ fontWeight: 600, color: B.dark, overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                  <span>{r.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 7 — CLOSING STATS ══════════════════ */

function StatBlock({ active, delay, target, suffix = "", prefix = "", label }) {
  const val = useCountUp(active, target, { duration: 1600, delay });
  return (
    <div style={{ textAlign: "center", ...rise(active, delay, 30) }}>
      <div
        dir="ltr"
        style={{
          fontSize: "clamp(64px, 8.5vw, 118px)",
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: `'${B.fontEn}', sans-serif`,
          background: `linear-gradient(135deg, ${B.primary}, ${B.primaryLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefix}
        {val}
        {suffix}
      </div>
      <div style={{ fontSize: "clamp(16px, 1.7vw, 22px)", color: B.gray500, marginTop: 12 }}>{label}</div>
    </div>
  );
}

function StatsSlide({ active }) {
  return (
    <SlideWrap active={active}>
      <GridBackdrop />
      <HeroNetwork active={active} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 1100 }}>
        <Kicker active={active} delay={100} center>
          השורה התחתונה
        </Kicker>
        <h2 style={{ fontSize: "clamp(36px, 4.6vw, 60px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-1px", color: B.dark, margin: "0 0 56px", ...rise(active, 250) }}>
          ממידע מפוזר — <span style={{ color: B.primary }}>לשליטה אחת</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(48px, 7vw, 110px)", marginBottom: 60 }}>
          <StatBlock active={active} delay={600} target={1} label="מקור אמת" />
          <StatBlock active={active} delay={850} target={50} prefix="+" label="מדינות" />
          <StatBlock active={active} delay={1100} target={100} suffix="%" label="תיעוד ומעקב" />
        </div>
        <div
          style={{
            fontSize: "clamp(22px, 2.6vw, 34px)",
            fontWeight: 800,
            ...rise(active, 1900, 20),
          }}
        >
          <span
            style={{
              background: `linear-gradient(90deg, ${B.dark} 30%, ${B.primary} 50%, ${B.dark} 70%)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: active ? "shimmer 3.5s linear 2400ms infinite" : "none",
            }}
          >
            EntityLink — נהלו כל ישות, מעבר לכל גבול.
          </span>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ SLIDE 8 — THANKS ══════════════════ */

function ThanksSlide({ active }) {
  return (
    <SlideWrap active={active}>
      <HeroNetwork active={active} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-1.5px", color: B.dark, margin: 0, ...rise(active, 150, 36) }}>
          תודה <span style={{ color: B.primary }}>רבה</span>
        </h2>
        <img
          src={A("/logo_entitylink.svg")}
          alt="EntityLink"
          style={{
            height: "clamp(48px, 8vh, 76px)",
            margin: "40px 0 44px",
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.85)",
            transition: `all 0.9s ${EASE} 500ms`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: "clamp(24px, 2.6vw, 34px)", fontWeight: 800, color: B.dark, ...rise(active, 800, 18) }}>ניל דהאן</div>
          <div style={{ fontSize: "clamp(17px, 1.8vw, 22px)", color: B.gray500, ...rise(active, 950, 18) }}>סמנכ״ל מוצר</div>
          <div
            dir="ltr"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "clamp(16px, 1.7vw, 21px)",
              color: B.dark700,
              fontFamily: `'${B.fontEn}', sans-serif`,
              marginTop: 8,
              padding: "10px 24px",
              borderRadius: 999,
              background: B.white,
              border: `1px solid ${B.gray200}`,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              ...pop(active, 1150),
            }}
          >
            <FlatIcon name="mail" size={18} color={B.primary} /> neild@sqlink.com
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: "clamp(14px, 1.4vw, 17px)", color: B.gray400, ...rise(active, 1450, 14) }}>
          אשמח להראות לכם דמו חי של המערכת
        </div>
      </div>
    </SlideWrap>
  );
}

/* ══════════════════ DECK SHELL ══════════════════ */

const SLIDE_COMPONENTS = [HeroSlide, ProblemSlide, SolutionSlide, OrgTreeSlide, EntitiesSlide, ShareholdersSlide, ArchiveSlide, StatsSlide, ThanksSlide];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback(
    (dir) => {
      if (isTransitioning) return;
      const next = dir === "forward" ? current + 1 : current - 1;
      if (next < 0 || next >= SLIDE_COMPONENTS.length) return;
      setIsTransitioning(true);
      setCurrent(next);
      setTimeout(() => setIsTransitioning(false), 550);
    },
    [current, isTransitioning]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        navigate("forward");
      }
      if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigate("backward");
      }
      if (e.key === "Home") setCurrent(0);
      if (e.key === "End") setCurrent(SLIDE_COMPONENTS.length - 1);
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    <div
      dir="rtl"
      onClick={() => navigate("forward")}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: `radial-gradient(ellipse 60% 50% at 85% 15%, rgba(232,97,45,0.06) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)`,
        fontFamily: `'${B.font}', 'SF Pro Display', -apple-system, sans-serif`,
        cursor: "pointer",
        userSelect: "none",
        color: B.dark,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes nodeBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.35); } }
        @keyframes cardSway { 0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(0); } 50% { transform: rotate(calc(var(--rot, 0deg) + 1.6deg)) translateY(-4px); } }
        @keyframes questionBob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-12px) rotate(4deg); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(232,97,45,0.35); } 100% { box-shadow: 0 0 0 14px rgba(232,97,45,0); } }
        ::selection { background: rgba(232,97,45,0.2); }
      `}</style>

      {/* progress bar — anchored right, grows leftwards (RTL) */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, zIndex: 100, background: "rgba(15,23,42,0.05)", display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            height: "100%",
            width: `${((current + 1) / SLIDE_COMPONENTS.length) * 100}%`,
            background: `linear-gradient(270deg, ${B.primary}, ${B.primaryLight})`,
            transition: `width 0.7s ${EASE}`,
            borderRadius: "0 0 0 2px",
          }}
        />
      </div>

      {/* slides */}
      {SLIDE_COMPONENTS.map((Slide, i) => (
        <Slide key={i} active={current === i} />
      ))}

      {/* nav dots — first slide on the right (RTL) */}
      <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 101, direction: "rtl" }}>
        {SLIDE_COMPONENTS.map((_, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            style={{
              width: current === i ? 24 : 7,
              height: 7,
              borderRadius: 4,
              background: current === i ? `linear-gradient(90deg, ${B.primary}, ${B.primaryLight})` : B.gray300,
              transition: `all 0.5s ${EASE}`,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* footer */}
      <div style={{ position: "fixed", bottom: 20, right: 30, zIndex: 100, fontSize: 14, fontWeight: 800, color: B.dark, letterSpacing: 0.3, fontFamily: `'${B.fontEn}', sans-serif` }} dir="ltr">
        Entity<span style={{ color: B.primary }}>Link</span>
      </div>
      <div style={{ position: "fixed", bottom: 20, left: 30, zIndex: 100, fontSize: 13, color: B.gray400, fontVariantNumeric: "tabular-nums" }} dir="ltr">
        {current + 1} / {SLIDE_COMPONENTS.length}
      </div>
    </div>
  );
}
