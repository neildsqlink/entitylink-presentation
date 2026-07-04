import fs from "fs";
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, PageBreak,
} from "docx";

const ORANGE = "E8612D";
const ORANGE_DK = "C94F1F";
const DARK = "1E293B";
const GRAY = "64748B";

// spoken-line paragraph (RTL)
const line = (children, { bold = false, q = false, after = 160 } = {}) =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after, line: 340 },
    children: children.map((c) =>
      typeof c === "string"
        ? new TextRun({ text: c, rightToLeft: true, font: "Arial", size: q ? 30 : 28, bold: bold || q, color: DARK })
        : c
    ),
  });

// bold inline run
const b = (text, { size = 28 } = {}) => new TextRun({ text, rightToLeft: true, font: "Arial", size, bold: true, color: DARK });
const t = (text, { size = 28 } = {}) => new TextRun({ text, rightToLeft: true, font: "Arial", size, color: DARK });
// latin inline (LTR word inside RTL) — keep rightToLeft false so it renders correctly
const en = (text, { size = 26 } = {}) => new TextRun({ text, font: "Arial", size, color: DARK });

const cardHeader = (num, title, time) => [
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 40 },
    children: [
      new TextRun({ text: time + "     ", font: "Arial", size: 20, color: GRAY }),
      new TextRun({ text: num, rightToLeft: true, font: "Arial", size: 22, bold: true, color: ORANGE }),
    ],
  }),
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ORANGE, space: 6 } },
    children: [new TextRun({ text: title, rightToLeft: true, font: "Arial", size: 40, bold: true, color: DARK })],
  }),
];

const cue = (text) =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 60, after: 220 },
    shading: { type: "clear", fill: "FFF3EC" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "FFD9C4", space: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "FFD9C4", space: 6 },
      left: { style: BorderStyle.SINGLE, size: 2, color: "FFD9C4", space: 6 },
      right: { style: BorderStyle.SINGLE, size: 2, color: "FFD9C4", space: 6 },
    },
    children: [new TextRun({ text: "🎬  " + text, rightToLeft: true, font: "Arial", size: 22, color: ORANGE_DK })],
  });

const clickTag = () =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 320 },
    children: [new TextRun({ text: "← קליק", rightToLeft: true, font: "Arial", size: 20, bold: true, color: ORANGE })],
  });

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const children = [];

// COVER
children.push(
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { before: 2600, after: 100 },
    children: [new TextRun({ text: "EntityLink", font: "Arial", size: 66, bold: true, color: DARK })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "כרטיסיות דיבור · כנס יועצים משפטיים", rightToLeft: true, font: "Arial", size: 28, color: GRAY })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 500 },
    children: [new TextRun({ text: "ניהול ישויות משפטיות בעידן של צמיחה, רגולציה ומורכבות תאגידית", rightToLeft: true, font: "Arial", size: 24, color: GRAY })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [b("ניל דהאן · סמנכ״ל מוצר · SQLink Group", { size: 26 })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "‎~6 דקות · 9 שקפים · קליק / חץ שמאלה = שקף הבא · F = מסך מלא", rightToLeft: true, font: "Arial", size: 22, color: GRAY })] }),
  pageBreak(),
);

// helper to build a card
function card({ num, title, time, cueText, lines, click = true }) {
  children.push(...cardHeader(num, title, time));
  children.push(cue(cueText));
  lines.forEach((l) => children.push(l));
  if (click) children.push(clickTag());
  children.push(pageBreak());
}

// 1
card({
  num: "כרטיסייה 1 · פתיחה", title: "פתיחה", time: "0:00–0:35",
  cueText: "לתת לרשת ברקע להתחבר 2–3 שניות, לחייך, ואז להתחיל בנחת.",
  lines: [
    line(["בוקר טוב. תודה שאתם כאן."]),
    line(["אני רוצה לפתוח בשלוש שאלות קטנות:"]),
    line(["כמה זמן ייקח לכם למצוא הסכם שנחתם לפני שנתיים?"], { q: true }),
    line(["להוציא את מבנה האחזקות של הקבוצה, מעודכן להיום?"], { q: true }),
    line(["ואיך הוא נראה — לפני שנתיים?"], { q: true }),
    line([t("אם חייכתם עכשיו במבוכה — "), b("אתם במקום הנכון.")]),
    line(["קוראים לי ניל דהאן, ובשש הדקות הקרובות אני אראה לכם איך כל זה הופך לשאלה של שניות."]),
  ],
});

// 2
card({
  num: "כרטיסייה 2 · האתגר", title: "המידע קיים — הוא פשוט מפוזר", time: "0:35–1:15",
  cueText: "כרטיסי הכאוס נופלים משמאל — אפשר להצביע עליהם בחיוך.",
  lines: [
    line([t("אז מה הבעיה? "), b("זו אף פעם לא בעיה של מידע חסר."), t(" המידע קיים.")]),
    line(["הוא פשוט מפוזר — אקסל אחד, שרשור מייל, וגרסה ישנה בתיקייה משותפת."]),
    line(["וברגע שמגיעה שאלה מרגולטור, או שהדירקטוריון מבקש תשובה — מתחילים לחפש."]),
    line(["ימים שלמים, על משהו שהיה צריך לקחת דקות."], { bold: true }),
  ],
});

// 3
card({
  num: "כרטיסייה 3 · הפתרון", title: "הכול במקום אחד", time: "1:15–1:55",
  cueText: "שישה כרטיסים קופצים פנימה.",
  lines: [
    line(["אז בואו נדבר על הפתרון."]),
    line([t("EntityLink מרכזת את כל הישויות של הארגון "), b("במקום אחד"), t(" — החברות, המבנה, האנשים והמסמכים.")]),
    line(["שישה עולמות שעובדים יחד."]),
    line([t("ובמקום לספר לכם — אני פשוט אראה. "), b("ארבעה מסכים אמיתיים מהמערכת.")]),
  ],
});

// 4
card({
  num: "כרטיסייה 4 · עץ ארגוני", title: "כל המבנה במבט אחד", time: "1:55–2:45",
  cueText: "העץ בונה את עצמו (~3 שניות) — לתת לו רגע, לא לדבר מעליו.",
  lines: [
    line([t("נתחיל מהתמונה הגדולה: "), b("העץ הארגוני.")]),
    line(["תראו איך הוא נבנה מעצמו — חברת האם, החברות הבנות, צבועות לפי אזור."]),
    line(["כל כרטיס הוא ישות אמיתית: מדינה, נתוני רישום, ומי מחזיק בה — עם האחוזים המדויקים."]),
    line([t("אפשר לסנן, לחזור אחורה בזמן, ולייצא "), en("PDF"), t(" מוכן לדירקטוריון.")]),
    line([t("במקום לצייר את זה מחדש כל רבעון — "), b("זה פשוט תמיד מעודכן.")]),
    line(["ולחיצה על כל ישות פותחת את הפרופיל שלה. בואו ניכנס."]),
  ],
});

// 5
card({
  num: "כרטיסייה 5 · ניהול ישויות", title: "כל ישות — פרופיל מלא", time: "2:45–3:30",
  cueText: "מסך אמיתי מהמערכת נכנס + שני תגים צפים.",
  lines: [
    line(["זו רשימת כל הישויות — חברות, סניפים וספקי שירות, במקום אחד."]),
    line([t("לכל אחת פרופיל מלא: "), b("נושאי משרה, מורשי חתימה,"), t(" נתוני רישום וסטטוס.")]),
    line(["והכי חשוב — הכול מקושר. מהרשימה לעץ, מהעץ לפרופיל, ומהפרופיל למסמכים."]),
  ],
});

// 6
card({
  num: "כרטיסייה 6 · בעלי מניות", title: "כל טרנזקציה מתועדת", time: "3:30–4:20",
  cueText: "הטרנזקציה רצה לבד אחרי ~3 שניות — לתזמן את ״תראו״ אליה.",
  lines: [
    line([t("ובתוך כל ישות — "), b("מי מחזיק בה.")]),
    line(["כל תמונת הבעלות: מי, כמה, איזה סוג מניות, ומה זכויות ההצבעה."]),
    line([b("ותראו מה קורה כשמתבצעת טרנזקציה"), t(" — העברה של עשרים אחוז: האחוזים מתעדכנים לבד, בעל מניות חדש נכנס, והכול נרשם עם המסמכים.")]),
    line([t("צריך להוכיח מי החזיק במה, ומתי? "), b("זה שם. בשניות.")]),
  ],
});

// 7
card({
  num: "כרטיסייה 7 · ארכיון", title: "כל מסמך במקומו", time: "4:20–5:00",
  cueText: "המסמכים עפים לתיקיות בזמן שמדברים — להצביע ב״תראו״.",
  lines: [
    line([t("וכל המסמכים? יושבים ב"), b("ארכיון מסודר.")]),
    line(["תיקיות שכל אחד כאן מכיר — מסמכי יסוד, אסיפות, החלטות דירקטוריון, ייפויי כוח."]),
    line(["תראו — כל מסמך שנכנס מתויק אוטומטית למקום שלו."]),
    line([t("ביקורת מחר בבוקר? במקום שבועות של איסוף — "), b("הכול כבר מסודר, וזמין בלחיצה.")]),
  ],
});

// 8
card({
  num: "כרטיסייה 8 · סיכום", title: "ממידע מפוזר — למקום אחד", time: "5:00–5:40",
  cueText: "המספרים נספרים לבד — לחכות שנייה עד שמסיימים לרוץ.",
  lines: [
    line(["אז בשורה התחתונה."]),
    line([t("במקום אקסלים ומיילים — "), b("מקום אחד. מקור אמת אחד.")]),
    line(["כל הישויות, בכל מדינה, עם תיעוד מלא."]),
    line(["EntityLink — נהלו כל ישות, מעבר לכל גבול."], { bold: true }),
  ],
});

// 9
card({
  num: "כרטיסייה 9 · תודה", title: "תודה רבה", time: "5:40+",
  cueText: "להשאיר את השקף על המסך בזמן השאלות. לחייך. סיימת 🙂",
  click: false,
  lines: [
    line(["תודה רבה שהקשבתם."]),
    line([t("אשמח להראות לכם "), b("דמו חי"), t(" של המערכת — תתפסו אותי אחרי, או שלחו לי מייל.")]),
    line(["תודה!"]),
  ],
});

// TIPS (no trailing page break)
children.push(...cardHeader("נספח", "טיפים קטנים", ""));
[
  "F = מסך מלא לפני שמתחילים. קליק או חץ שמאלה = קדימה, חץ ימינה = אחורה.",
  "האנימציות רצות לבד עם הכניסה לשקף — אין ״קליקים פנימיים״. אפשר לדבר בזמן שהן רצות.",
  "שקפים 4 ו-6 הם הרגעים הכי יפים — שם כדאי להאט ולתת למסך לעבוד.",
  "נשמו. משפט קצר, נשימה, משפט קצר. אתם מכירים את החומר טוב יותר מכולם באולם.",
].forEach((tip) =>
  children.push(new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 140, line: 320 },
    children: [new TextRun({ text: "•  " + tip, rightToLeft: true, font: "Arial", size: 26, color: DARK })],
  }))
);

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 28 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("speech-cue-cards.docx", buf);
  console.log("docx done");
});
