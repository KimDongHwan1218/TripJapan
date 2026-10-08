// 브랜드 이미지(앱 아이콘·스플래시·알림 아이콘)를 로고 SVG에서 고해상도로 생성.
// 예전엔 60×27px PNG 하나를 아이콘·스플래시·알림에 다 써서 흐릿하고, 색도 옛 하늘색/분홍이었음(2026-10-08).
// 사용: node scripts/gen-brand-assets.js  → assets/brand/*.png
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "brand");
fs.mkdirSync(OUT, { recursive: true });

// tabi_logo.svg의 글자 path(앞 4개)와 점(마지막 원)을 색만 바꿔 다시 조립
const src = fs.readFileSync(path.join(ROOT, "assets/images/tabi_logo.svg"), "utf8");
const paths = [...src.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const letters = paths.slice(0, 4);
const dot = paths[4];

const BRAND_RED = "#E30003"; // styles/colors.ts primary
const TEXT = "#2F2F31"; // styles/colors.ts textPrimary

// 로고(80×36)를 size×size 정사각 캔버스 가운데에 widthRatio 너비로 배치한 SVG
function logoSvg({ size, widthRatio, letterColor, dotColor, bg }) {
  const w = size * widthRatio;
  const scale = w / 80;
  const h = 36 * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ""}
  <g transform="translate(${x} ${y}) scale(${scale})">
    ${letters.map((d) => `<path d="${d}" fill="${letterColor}"/>`).join("\n    ")}
    <path d="${dot}" fill="${dotColor}"/>
  </g>
</svg>`;
}

async function out(name, svg) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, name));
  console.log("✓", name);
}

(async () => {
  // 스플래시: 흰 배경 위에 진한 글자 + 빨간 점(앱 헤더 로고와 같은 조합). 투명 정사각 — 배경색은 app.config에서
  await out("splash.png", logoSvg({ size: 1024, widthRatio: 0.72, letterColor: TEXT, dotColor: BRAND_RED }));
  // 앱 아이콘(iOS·구형 안드로이드): 빨강 바탕 + 흰 로고
  await out("icon.png", logoSvg({ size: 1024, widthRatio: 0.62, letterColor: "#FFFFFF", dotColor: "#FFFFFF", bg: BRAND_RED }));
  // 안드로이드 적응형 아이콘 전경: 투명 + 흰 로고, 안전 영역(가운데 66%) 안에 들어가게 더 작게. 배경색은 app.config
  await out("adaptive-foreground.png", logoSvg({ size: 1024, widthRatio: 0.5, letterColor: "#FFFFFF", dotColor: "#FFFFFF" }));
  // 알림 아이콘: 안드로이드는 알파값만 쓰는 흰 단색이어야 함(컬러면 흰 네모로 보임)
  await out("notification.png", logoSvg({ size: 96, widthRatio: 0.86, letterColor: "#FFFFFF", dotColor: "#FFFFFF" }));
})();
