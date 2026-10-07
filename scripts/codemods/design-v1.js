/* eslint-disable */
// 디자인 시스템 v1 일괄 적용 코드모드 (docs/design-system.html 규칙).
// TypeScript 구문 트리로 스타일 객체/JSX 속성의 값만 정확히 바꾼다. 사용: node scripts/codemods/design-v1.js [--dry]
// 바꾸는 것: fontSize·lineHeight·fontWeight 스케일, borderRadius 5단계 토큰(+연속 곡률), 여백 4pt 스냅,
// #hex → colors 토큰, activeOpacity 0.7, 뒤로가기 아이콘 chevron-back, 아이콘 크기 4단계, Text/TextInput → 공용 컴포넌트.
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "../..");
const DIRS = ["screens", "components", "navigation"];
const DRY = process.argv.includes("--dry");
const report = { files: 0, changed: 0, counts: {}, unmappedHex: {}, skipped: [] };
const bump = (k) => (report.counts[k] = (report.counts[k] || 0) + 1);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) out.push(p);
  }
  return out;
}

// ── 매핑 규칙 ──────────────────────────────────────────────
const LINE_HEIGHT = { 11: 14, 12: 16, 14: 20, 16: 24, 18: 26, 20: 28, 24: 32, 32: 40, 40: 48 };
function mapFontSize(v, ctx) {
  if (v <= 11.5) return 11;
  if (v < 13) return 12;
  if (v === 13) return ctx.isMeta ? 12 : 14; // 13은 본문(14)도 보조(12)도 아닌 애매한 크기
  if (v < 15) return 14;
  if (v === 15) return ctx.weight >= 600 ? 16 : 14;
  if (v < 18) return 16;
  if (v < 20) return 18;
  if (v < 24) return 20;
  if (v <= 30) return 24;
  if (v <= 35) return 32;
  return 40; // D7: 큰 숫자 예외
}
const WEIGHT = { "800": "700", "900": "700", bold: "700", "300": "400", "200": "400", "100": "400", normal: "400" };
function mapRadius(v) {
  if (v <= 1) return null; // 의도된 미세값은 그대로
  if (v <= 5) return "radius.xs";
  if (v <= 10) return "radius.sm";
  if (v <= 16) return "radius.md";
  if (v <= 24) return "radius.lg";
  return null; // 25 이상은 대부분 원형(아바타·점) — 그대로 둠
}
function snap4(v) {
  const a = Math.abs(v);
  if (a <= 2) return v; // 2 이하는 hairline 보정으로 허용
  const r = Math.round(a / 4) * 4 || 4;
  return Math.sign(v) * r;
}
const SPACING_KEYS = new Set([
  "padding", "paddingHorizontal", "paddingVertical", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
  "paddingStart", "paddingEnd", "margin", "marginHorizontal", "marginVertical", "marginTop", "marginBottom",
  "marginLeft", "marginRight", "marginStart", "marginEnd", "gap", "rowGap", "columnGap",
]);
const RADIUS_KEYS = new Set([
  "borderRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius",
]);
const COLOR_KEYS = new Set([
  "color", "backgroundColor", "borderColor", "borderBottomColor", "borderTopColor", "borderLeftColor",
  "borderRightColor", "tintColor", "shadowColor", "textDecorationColor", "placeholderTextColor",
]);

const norm = (h) => {
  h = h.toUpperCase();
  if (h.length === 4) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  return h;
};
// key 종류: text(글자·아이콘 색) / bg / border / shadow
function mapHex(hex, kind) {
  const h = norm(hex);
  const GRAY = {
    "#2F2F31": "textPrimary", "#333333": "textPrimary", "#222222": "textPrimary", "#111111": "textPrimary", "#1A1A1A": "textPrimary",
    "#55575B": "textSecondary", "#555555": "textSecondary", "#666666": "textSecondary", "#444444": "textSecondary",
    "#7C7C7C": "textTertiary", "#777777": "textTertiary", "#888888": "textTertiary", "#8E9196": "textTertiary", "#999999": "textTertiary", "#AAAAAA": "neutral500",
  };
  if (h === "#FFFFFF") return kind === "bg" || kind === "border" ? "surface" : "textWhite";
  if (h === "#000000") return kind === "shadow" ? "shadow" : kind === "bg" ? "black" : "textPrimary";
  if (GRAY[h]) {
    if (kind === "bg") return h === "#2F2F31" || h === "#333333" || h === "#222222" ? "neutral900" : "neutral500";
    if (kind === "border") return "border";
    if (kind === "icon" && GRAY[h] === "textTertiary") return "neutral500"; // 아이콘은 대비 3:1이면 충분
    return GRAY[h];
  }
  if (["#D9D9DB", "#DDDDDD", "#CCCCCC", "#E0E0E0", "#E0DDD8", "#D8D2CC", "#C7C7CC"].includes(h)) return kind === "bg" ? "neutral300" : kind === "text" || kind === "icon" ? "neutral300" : "border";
  if (["#E9E9EA", "#E8E8E8", "#EEEEEE", "#ECECEC", "#F0F0F0", "#F0EEEB", "#E7E3DF", "#EFEFEF", "#EAEAEA"].includes(h)) return kind === "bg" ? "neutral100" : "divider";
  if (["#F4F4F5", "#F5F5F5", "#F2F2F2", "#F3F3F3", "#F6F6F6"].includes(h)) return kind === "border" ? "divider" : "neutral100";
  if (["#FAFAFA", "#F9F9F9", "#FBFBFB", "#F8F8F8"].includes(h)) return "background";
  if (["#E30003", "#E40004", "#FF3B30", "#E60012", "#FF0000", "#E53935", "#D32F2F"].includes(h)) return "primary";
  if (["#F20D0D"].includes(h)) return "danger";
  if (["#FFE5E3", "#FFF1F0", "#FFEBEE", "#FDECEA"].includes(h)) return "primarySoft";
  if (["#2563EB", "#007AFF", "#1D4ED8", "#3B82F6"].includes(h)) return "fall";
  if (["#34A853", "#2A7A5A", "#2C8C4A", "#4CAF50"].includes(h)) return kind === "text" ? "successText" : "success";
  if (["#F4B400", "#FBBC04", "#FFB800", "#FFC107"].includes(h)) return "warning";
  return null;
}

// ── 변환 ──────────────────────────────────────────────────
function propName(p) {
  if (!p.name) return null;
  if (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) return p.name.text;
  return null;
}
function numLit(node) {
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand))
    return -Number(node.operand.text);
  return null;
}
function isMapStyleObject(obj) {
  // customMapStyle 배열 안의 {featureType, elementType, stylers:[{color}]}는 지도 스타일이라 건드리지 않음
  let n = obj;
  while (n) {
    if (ts.isObjectLiteralExpression(n) && n.properties.some((p) => ["featureType", "elementType", "stylers"].includes(propName(p)))) return true;
    if (ts.isPropertyAssignment(n) && propName(n) === "stylers") return true;
    n = n.parent;
  }
  return false;
}

function transformFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = []; // {start,end,text}
  const need = new Set(); // colors, radius
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");

  function visit(node) {
    if (ts.isObjectLiteralExpression(node) && !isMapStyleObject(node)) handleObject(node);
    if (ts.isJsxAttribute(node)) handleJsxAttr(node);
    ts.forEachChild(node, visit);
  }

  function handleObject(obj) {
    const props = {};
    for (const p of obj.properties) if (ts.isPropertyAssignment(p)) props[propName(p)] = p;
    const fsProp = props.fontSize;
    const weightRaw = props.fontWeight && ts.isStringLiteral(props.fontWeight.initializer) ? props.fontWeight.initializer.text : "400";
    const weight = Number(WEIGHT[weightRaw] || weightRaw) || 400;
    const colorText = props.color ? props.color.initializer.getText(sf) : "";
    const isMeta = /textTertiary|neutral500|8E9196|999|888|777|AAA/i.test(colorText) ||
      /meta|caption|sub|date|time|hint|desc|addr|count|label|small/i.test(obj.parent && ts.isPropertyAssignment(obj.parent) ? propName(obj.parent) || "" : "");

    let newFont = null;
    for (const p of obj.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = propName(p);
      const init = p.initializer;
      const n = numLit(init);

      if (key === "fontSize" && n !== null) {
        const v = mapFontSize(n, { isMeta, weight });
        newFont = v;
        if (v !== n) { edits.push({ start: init.getStart(sf), end: init.end, text: String(v) }); bump("fontSize"); }
      } else if (key === "fontWeight" && ts.isStringLiteral(init) && WEIGHT[init.text]) {
        edits.push({ start: init.getStart(sf), end: init.end, text: `"${WEIGHT[init.text]}"` }); bump("fontWeight");
      } else if (RADIUS_KEYS.has(key) && n !== null) {
        const tok = mapRadius(n);
        if (tok) {
          let text = tok;
          edits.push({ start: init.getStart(sf), end: init.end, text }); need.add("radius"); bump("borderRadius");
          if (key === "borderRadius" && n >= 6 && !props.borderCurve) {
            edits.push({ start: p.end, end: p.end, text: `, borderCurve: "continuous"` }); bump("borderCurve");
          }
        }
      } else if (SPACING_KEYS.has(key) && n !== null) {
        const v = snap4(n);
        if (v !== n) { edits.push({ start: init.getStart(sf), end: init.end, text: String(v) }); bump("spacing"); }
      } else if (COLOR_KEYS.has(key) && ts.isStringLiteral(init) && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(init.text)) {
        const kind = key === "color" || key === "tintColor" || key === "placeholderTextColor" || key === "textDecorationColor" ? "text"
          : key === "shadowColor" ? "shadow" : key === "backgroundColor" ? "bg" : "border";
        const tok = mapHex(init.text, kind);
        if (tok) { edits.push({ start: init.getStart(sf), end: init.end, text: `colors.${tok}` }); need.add("colors"); bump("hex"); }
        else report.unmappedHex[norm(init.text)] = (report.unmappedHex[norm(init.text)] || 0) + 1;
      }
    }
    // lineHeight는 새 fontSize에 맞춰 스케일 행간으로
    if (newFont !== null && props.lineHeight && numLit(props.lineHeight.initializer) !== null && LINE_HEIGHT[newFont]) {
      const lh = LINE_HEIGHT[newFont];
      if (lh !== numLit(props.lineHeight.initializer)) {
        edits.push({ start: props.lineHeight.initializer.getStart(sf), end: props.lineHeight.initializer.end, text: String(lh) }); bump("lineHeight");
      }
    }
  }

  function handleJsxAttr(attr) {
    const name = attr.name.getText(sf);
    const tag = attr.parent && attr.parent.parent ? attr.parent.parent.tagName && attr.parent.parent.tagName.getText(sf) : "";
    const init = attr.initializer;
    if (!init) return;
    const expr = ts.isJsxExpression(init) ? init.expression : init;
    if (!expr) return;
    if (name === "activeOpacity") {
      const n = numLit(expr);
      if (n !== null) {
        const v = n >= 0.9 ? 0.9 : 0.7;
        if (v !== n) { edits.push({ start: expr.getStart(sf), end: expr.end, text: String(v) }); bump("activeOpacity"); }
      }
    } else if (name === "name" && /Ionicons/.test(tag) && ts.isStringLiteral(expr) && /^arrow-back(-outline)?$/.test(expr.text)) {
      edits.push({ start: expr.getStart(sf), end: expr.end, text: `"chevron-back"` }); bump("backIcon");
    } else if (name === "size" && /Ionicons/.test(tag)) {
      const n = numLit(expr);
      if (n !== null && n > 10 && n < 36) {
        const v = n <= 17 ? 16 : n <= 21 ? 20 : n <= 27 ? 24 : 32;
        if (v !== n) { edits.push({ start: expr.getStart(sf), end: expr.end, text: String(v) }); bump("iconSize"); }
      }
    } else if ((name === "color" || name === "placeholderTextColor" || name === "tintColor") && ts.isStringLiteral(expr) && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(expr.text)) {
      const tok = mapHex(expr.text, /Ionicons|Icon/.test(tag) ? "icon" : "text");
      const target = ts.isJsxExpression(init) ? expr : init;
      if (tok) { edits.push({ start: target.getStart(sf), end: target.end, text: ts.isJsxExpression(init) ? `colors.${tok}` : `{colors.${tok}}` }); need.add("colors"); bump("hex"); }
      else report.unmappedHex[norm(expr.text)] = (report.unmappedHex[norm(expr.text)] || 0) + 1;
    }
  }

  visit(sf);

  // Text / TextInput → 공용 컴포넌트(Pretendard)
  if (!/components[\\/]ui[\\/]Text\.tsx$/.test(file)) {
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || st.moduleSpecifier.text !== "react-native" || !st.importClause || !st.importClause.namedBindings) continue;
      const nb = st.importClause.namedBindings;
      if (!ts.isNamedImports(nb)) continue;
      const names = nb.elements.map((e) => e.getText(sf));
      const take = names.filter((n) => n === "Text" || n === "TextInput");
      if (!take.length) continue;
      const rest = names.filter((n) => n !== "Text" && n !== "TextInput");
      let repl = rest.length ? `import { ${rest.join(", ")} } from "react-native";` : "";
      const parts = [];
      if (take.includes("Text")) parts.push("Text");
      const named = take.includes("TextInput") ? `{ TextInput }` : "";
      repl += `\nimport ${[take.includes("Text") ? "Text" : null, named || null].filter(Boolean).join(", ")} from "@/components/ui/Text";`;
      edits.push({ start: st.getStart(sf), end: st.end, text: repl.trimStart() });
      bump("textImport");
    }
  }

  if (!edits.length) return;
  // 필요한 토큰 import 보장
  const hasIdent = (id) => new RegExp(`import[^;]*\\b${id}\\b[^;]*from`).test(src);
  const missing = [...need].filter((id) => !hasIdent(id));
  if (missing.length) {
    const stylesImport = sf.statements.find((s) => ts.isImportDeclaration(s) && /^(@\/styles|(\.\.\/)+styles)$/.test(s.moduleSpecifier.text) &&
      s.importClause && s.importClause.namedBindings && ts.isNamedImports(s.importClause.namedBindings));
    if (stylesImport) {
      const nb = stylesImport.importClause.namedBindings;
      const last = nb.elements[nb.elements.length - 1];
      edits.push({ start: last.end, end: last.end, text: ", " + missing.join(", ") });
    } else {
      const lastImport = [...sf.statements].reverse().find((s) => ts.isImportDeclaration(s));
      const pos = lastImport ? lastImport.end : 0;
      edits.push({ start: pos, end: pos, text: `\nimport { ${missing.join(", ")} } from "@/styles";` });
    }
  }
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let out = src;
  let prev = Infinity;
  for (const e of edits) {
    if (e.end > prev) { report.skipped.push(`${rel}@${e.start} overlap`); continue; }
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
    prev = e.start;
  }
  if (out !== src) {
    report.changed++;
    if (!DRY) fs.writeFileSync(file, out);
  }
}

for (const d of DIRS) for (const f of walk(path.join(ROOT, d))) { report.files++; transformFile(f); }
const top = Object.entries(report.unmappedHex).sort((a, b) => b[1] - a[1]);
console.log(JSON.stringify({ files: report.files, changed: report.changed, counts: report.counts, unmappedHex: Object.fromEntries(top), skipped: report.skipped.length }, null, 1));
