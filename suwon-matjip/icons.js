/* ============================================================
   수원 맛집 리스트 - 메뉴/업종별 테마 일러스트 아이콘 (인라인 SVG)
   ============================================================ */

const ICON_DARK = '#12414F';

function svgWrap(inner) {
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}
function bg(fill = '#EAF7FC') {
  return `<circle cx="32" cy="32" r="30" fill="${fill}"/>`;
}
function steam(cx = 32, color = '#BFE7F5') {
  return `
    <path d="M${cx - 7} 15 q3 -6 0 -10 q-3 4 0 10" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M${cx} 12 q3 -6 0 -10 q-3 4 0 10" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M${cx + 7} 15 q3 -6 0 -10 q-3 4 0 10" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}
function bowl(bodyFill, brothFill, handles = false) {
  return `
    ${handles ? `
    <rect x="6" y="29" width="6" height="6" rx="2" fill="${bodyFill}" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <rect x="52" y="29" width="6" height="6" rx="2" fill="${bodyFill}" stroke="${ICON_DARK}" stroke-width="1.4"/>` : ''}
    <path d="M12 30 Q32 45 52 30 L48 48 Q32 56 16 48 Z" fill="${bodyFill}" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="30" rx="20" ry="7" fill="${brothFill}" stroke="${ICON_DARK}" stroke-width="1.6"/>`;
}
function plate(fill = '#FFFFFF') {
  return `<ellipse cx="32" cy="46" rx="23" ry="7.5" fill="${fill}" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="44" rx="23" ry="7.5" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.2" opacity="0.55"/>`;
}
function storefront(accent) {
  return `
    <rect x="14" y="24" width="36" height="26" rx="3" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <rect x="13" y="17" width="38" height="9" rx="2" fill="${accent}" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <rect x="17" y="35" width="10" height="15" fill="${accent}" opacity="0.28" stroke="${ICON_DARK}" stroke-width="1"/>
    <rect x="37" y="35" width="10" height="15" fill="${accent}" opacity="0.28" stroke="${ICON_DARK}" stroke-width="1"/>
    <rect x="28" y="41" width="8" height="9" fill="#8A5A3B" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <circle cx="34" cy="45" r="0.8" fill="#FFE0B2"/>`;
}

const ICONS = {
  /* ---------------- 한식 ---------------- */
  korean_soup: svgWrap(`${bg()}${steam(31)}
    <path d="M12 30 Q32 45 52 30 L48 48 Q32 56 16 48 Z" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="30" rx="20" ry="7" fill="#E8C39E" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <circle cx="25" cy="29" r="2.3" fill="none" stroke="#4CAF50" stroke-width="1.4"/>
    <circle cx="35" cy="27" r="2" fill="none" stroke="#4CAF50" stroke-width="1.4"/>
    <circle cx="30" cy="33" r="1.6" fill="none" stroke="#66BB6A" stroke-width="1.2"/>`),

  korean_tang: svgWrap(`${bg()}${steam(31)}${bowl('#8A5A3B', '#B23B1F', true)}
    <rect x="21" y="27" width="11" height="4" rx="2" fill="#FFFDF7" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="20" cy="27" r="3" fill="#FFFDF7" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="20" cy="31" r="3" fill="#FFFDF7" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="33" cy="27" r="3" fill="#FFFDF7" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="33" cy="31" r="3" fill="#FFFDF7" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <ellipse cx="41" cy="31" rx="6" ry="4" fill="#C97B4A" stroke="${ICON_DARK}" stroke-width="1.2"/>`),

  korean_jjigae: svgWrap(`${bg()}${steam(31)}
    <rect x="10" y="25" width="4" height="6" rx="1.5" fill="#37474F" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <rect x="50" y="25" width="4" height="6" rx="1.5" fill="#37474F" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <path d="M12 28 Q32 42 52 28 L47 48 Q32 55 17 48 Z" fill="#37474F" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="28" rx="19" ry="6.5" fill="#E64A19" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <rect x="26" y="25" width="6" height="6" fill="#FFF8E1" stroke="${ICON_DARK}" stroke-width="1"/>
    <circle cx="38" cy="26" r="2.4" fill="#4CAF50" stroke="${ICON_DARK}" stroke-width="1"/>`),

  korean_jorim: svgWrap(`${bg()}
    <ellipse cx="32" cy="42" rx="22" ry="8" fill="#263238" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M14 40 Q22 30 34 33 Q46 35 50 41 Q40 45 27 43 Q18 42 14 40 Z" fill="#8D4B2B" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <circle cx="20" cy="38" r="1" fill="#FFFFFF"/><circle cx="26" cy="35" r="1" fill="#FFFFFF"/>
    <circle cx="34" cy="37" r="1" fill="#FFFFFF"/><circle cx="41" cy="39" r="1" fill="#FFFFFF"/>
    <circle cx="45" cy="38" r="2.6" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>`),

  korean_baekban: svgWrap(`${bg()}
    <ellipse cx="32" cy="42" rx="24" ry="9" fill="#F4E4C1" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="40" rx="9" ry="6" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="16" cy="41" r="4.4" fill="#81C784" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="48" cy="41" r="4.4" fill="#E57373" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="20" cy="49" r="3.6" fill="#FFD54F" stroke="${ICON_DARK}" stroke-width="1.1"/>
    <circle cx="44" cy="49" r="3.6" fill="#A1887F" stroke="${ICON_DARK}" stroke-width="1.1"/>`),

  /* ---------------- 중식 ---------------- */
  chinese_chinese: svgWrap(`${bg()}${steam(31)}${bowl('#FFFFFF', '#3E2723')}
    <path d="M22 29 q4 -3 8 0 q4 3 8 0 q4 -3 8 0" stroke="#FFE0B2" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="23" y="24" width="10" height="3" rx="1.5" fill="#66BB6A" stroke="${ICON_DARK}" stroke-width="1"/>`),

  chinese_mala: svgWrap(`${bg()}${steam(31)}${bowl('#7F0000', '#C62828', true)}
    <path d="M23 26 q3 -5 6 -2 q-1 5 -6 2Z" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <path d="M33 24 q3 -5 6 -2 q-1 5 -6 2Z" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <circle cx="28" cy="30" r="1" fill="#212121"/><circle cx="36" cy="31" r="1" fill="#212121"/>
    <circle cx="32" cy="33" r="1" fill="#212121"/>`),

  chinese_hotpot: svgWrap(`${bg()}${steam(26)}${steam(38)}
    <path d="M12 30 Q32 45 52 30 L48 48 Q32 56 16 48 Z" fill="#263238" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="32" cy="30" rx="20" ry="7" fill="#FAFAFA" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M32 23 A20 7 0 0 1 32 37 Z" fill="#B71C1C" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <line x1="20" y1="20" x2="24" y2="30" stroke="#8D6E63" stroke-width="2" stroke-linecap="round"/>
    <circle cx="20" cy="18" r="2" fill="#E57373" stroke="${ICON_DARK}" stroke-width="1"/>`),

  /* ---------------- 아시안 ---------------- */
  asian_pho: svgWrap(`${bg()}${steam(31)}${bowl('#FFFFFF', '#F3E5C8')}
    <path d="M20 30 q4 -2 8 0 q4 2 8 0 q4 -2 8 0" stroke="#FFF8E1" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M18 26 q6 -8 8 0" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
    <path d="M42 24 a5 5 0 1 1 6 3 q-3 1 -6 -3Z" fill="#C5E1A5" stroke="${ICON_DARK}" stroke-width="1"/>
    <path d="M24 22 q2 -5 6 -3 q-1 5 -6 3Z" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>`),

  asian_tomyum: svgWrap(`${bg()}${steam(31)}${bowl('#B23B1F', '#E64A19')}
    <path d="M40 22 q7 2 6 9 q-6 1 -8 -5 q-1 -3 2 -4Z" fill="#FF8A65" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <path d="M22 24 q10 -6 6 6" fill="none" stroke="#81C784" stroke-width="2" stroke-linecap="round"/>
    <path d="M20 20 q3 -4 6 -1 q-2 4 -6 1Z" fill="#66BB6A" stroke="${ICON_DARK}" stroke-width="1"/>`),

  asian_etc: svgWrap(`${bg()}
    <path d="M8 46 Q10 30 22 26 L22 46 Z" fill="#66BB6A" stroke="${ICON_DARK}" stroke-width="1.3" opacity="0.85"/>
    ${plate()}
    <ellipse cx="34" cy="42" rx="12" ry="6" fill="#FFD54F" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <path d="M26 40 q6 -4 12 0 q4 2 6 5" fill="none" stroke="#8D4B2B" stroke-width="2" stroke-linecap="round"/>`),

  /* ---------------- 양식 ---------------- */
  western_donkatsu: svgWrap(`${bg()}${plate()}
    <rect x="16" y="34" width="32" height="9" rx="3" fill="#D4A24C" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <path d="M15 46 q6 -4 10 0 q6 -4 10 0 q6 -4 10 0" fill="none" stroke="#81C784" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M22 38 q4 3 8 0 q4 3 8 0" fill="none" stroke="#8D4B2B" stroke-width="1.6" stroke-linecap="round"/>`),

  western_etc: svgWrap(`${bg()}${plate()}
    <path d="M32 44 q-10 0 -10 -8 q4 2 6 -2 q2 5 6 1 q1 4 6 0 q0 6 -8 9Z" fill="#F2C14E" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="24" cy="36" r="2" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <circle cx="40" cy="34" r="1.6" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <path d="M18 30 q2 -6 0 -10 M20 30 q2 -6 0 -10 M22 30 q2 -6 0 -10" stroke="#B0BEC5" stroke-width="1.3" fill="none" stroke-linecap="round"/>`),

  /* ---------------- 일식 ---------------- */
  japanese_sashimi: svgWrap(`${bg('#E3F6FC')}
    <path d="M14 34 Q22 18 40 24 Q52 28 50 34 Q52 40 40 44 Q22 50 14 34Z" fill="#4FC3F7" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M40 24 Q52 28 50 34 Q52 40 40 44 Q48 34 40 24Z" fill="#0288D1" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="22" cy="30" r="1.8" fill="${ICON_DARK}"/>
    <path d="M26 24 Q30 30 26 36" fill="none" stroke="#0288D1" stroke-width="1.2"/>
    <path d="M30 22 Q35 30 30 40" fill="none" stroke="#0288D1" stroke-width="1.2" opacity="0.7"/>`),

  japanese_sushi: svgWrap(`${bg()}
    <ellipse cx="32" cy="42" rx="15" ry="9" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M18 36 Q32 20 46 36 Q46 30 32 26 Q18 30 18 36Z" fill="#EF9A9A" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <rect x="18" y="34" width="28" height="6" fill="#263238" stroke="${ICON_DARK}" stroke-width="1.1"/>`),

  japanese_udon: svgWrap(`${bg()}${steam(31)}${bowl('#FFFFFF', '#FFF3C4')}
    <path d="M18 30 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0" stroke="#FDF1D3" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M28 26 a5 5 0 0 1 10 0 Z" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <circle cx="33" cy="25" r="2" fill="#FFC107"/>
    <circle cx="42" cy="30" r="2.6" fill="#F48FB1" stroke="${ICON_DARK}" stroke-width="1"/>`),

  /* ---------------- 패스트푸드 ---------------- */
  fastfood_pizza: svgWrap(`${bg()}
    <path d="M32 14 L54 46 Q32 56 10 46 Z" fill="#FFDB70" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M32 14 L54 46 Q32 56 10 46 Z" fill="none" stroke="#E8A33D" stroke-width="4" stroke-dasharray="0 34 100" />
    <circle cx="30" cy="30" r="2.4" fill="#C62828"/>
    <circle cx="24" cy="40" r="2.4" fill="#C62828"/>
    <circle cx="36" cy="42" r="2.4" fill="#C62828"/>
    <path d="M14 46 Q32 54 50 46" fill="none" stroke="#E8A33D" stroke-width="3" stroke-linecap="round"/>`),

  fastfood_burger: svgWrap(`${bg()}
    <path d="M16 32 Q32 16 48 32 Z" fill="#E0A85C" stroke="${ICON_DARK}" stroke-width="1.5"/>
    <circle cx="24" cy="22" r="0.9" fill="#FFF3C4"/><circle cx="32" cy="19" r="0.9" fill="#FFF3C4"/><circle cx="40" cy="22" r="0.9" fill="#FFF3C4"/>
    <path d="M14 34 q18 6 36 0 l-2 5 q-16 5 -32 0Z" fill="#81C784" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <rect x="14" y="39" width="36" height="6" rx="2" fill="#8D4B2B" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <circle cx="20" cy="47" r="2.4" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <circle cx="30" cy="48" r="2.4" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <rect x="14" y="49" width="36" height="7" rx="3" fill="#D9973F" stroke="${ICON_DARK}" stroke-width="1.5"/>`),

  fastfood_chicken: svgWrap(`${bg()}
    <path d="M26 16 Q44 16 42 32 Q40 46 30 48 Q20 50 20 38 Q18 24 26 16Z" fill="#C97B32" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M30 48 Q26 54 22 56" stroke="#F5DEB3" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="28" cy="26" r="1" fill="#8D4B2B"/><circle cx="34" cy="30" r="1" fill="#8D4B2B"/>
    <circle cx="30" cy="36" r="1" fill="#8D4B2B"/><circle cx="24" cy="32" r="1" fill="#8D4B2B"/>`),

  /* ---------------- 디저트 ---------------- */
  dessert_yogurt: svgWrap(`${bg()}
    <path d="M20 22 L44 22 L40 50 Q32 54 24 50 Z" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.6" opacity="0.9"/>
    <ellipse cx="32" cy="24" rx="12" ry="3.2" fill="#F5F5F5" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="27" cy="28" r="1.4" fill="#8D6E63"/><circle cx="34" cy="27" r="1.4" fill="#8D6E63"/><circle cx="30" cy="32" r="1.4" fill="#8D6E63"/>
    <circle cx="38" cy="30" r="2.6" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>
    <line x1="42" y1="14" x2="36" y2="30" stroke="#B0BEC5" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="42" cy="13" rx="2.4" ry="3.2" fill="#CFD8DC" stroke="${ICON_DARK}" stroke-width="1"/>`),

  dessert_coffee: svgWrap(`${bg()}${steam(30)}
    <ellipse cx="30" cy="48" rx="16" ry="3.6" fill="#CFD8DC" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <path d="M18 26 L42 26 L39 44 Q30 48 21 44 Z" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="30" cy="26" rx="12" ry="3" fill="#6F4E37" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <path d="M42 30 q7 0 6 8 q-5 2 -7 -3" fill="none" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <ellipse cx="49" cy="42" rx="4" ry="5" fill="#6F4E37" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <path d="M49 38 q0 5 0 9" stroke="${ICON_DARK}" stroke-width="1"/>`),

  dessert_cake: svgWrap(`${bg()}
    <path d="M18 46 L46 46 L40 26 Q32 30 24 26 Z" fill="#FFF3E0" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <path d="M20 40 L44 40" stroke="#D4A24C" stroke-width="3"/>
    <path d="M22 33 L42 33" stroke="#D4A24C" stroke-width="3" opacity="0.7"/>
    <path d="M24 26 Q32 30 40 26 L38 22 Q32 25 26 22 Z" fill="#FFFFFF" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="32" cy="20" r="2.6" fill="#E53935" stroke="${ICON_DARK}" stroke-width="1"/>`),

  /* ---------------- 편의점 ---------------- */
  convenience_gs25: svgWrap(`${bg()}${storefront('#1E88C9')}`),
  convenience_cu: svgWrap(`${bg()}${storefront('#8E24AA')}`),
  convenience_seven: svgWrap(`${bg()}${storefront('#F57C00')}`),

  /* ---------------- 무한리필 ---------------- */
  buffet_buffet: svgWrap(`${bg()}
    <rect x="14" y="46" width="36" height="6" rx="2" fill="#B0BEC5" stroke="${ICON_DARK}" stroke-width="1.4"/>
    <rect x="20" y="40" width="24" height="6" rx="2" fill="#CFD8DC" stroke="${ICON_DARK}" stroke-width="1.2"/>
    <circle cx="23" cy="33" r="7" fill="#FFCC80" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="41" cy="32" r="8" fill="#EF9A9A" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <circle cx="32" cy="24" r="6.4" fill="#A5D6A7" stroke="${ICON_DARK}" stroke-width="1.3"/>`),

  buffet_meat: svgWrap(`${bg()}
    <path d="M18 50 q2 -6 0 -11" stroke="#FF8A65" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M32 52 q2 -6 0 -11" stroke="#FF8A65" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M46 50 q2 -6 0 -11" stroke="#FF8A65" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="32" cy="40" rx="22" ry="7" fill="#37474F" stroke="${ICON_DARK}" stroke-width="1.6"/>
    <line x1="14" y1="40" x2="50" y2="40" stroke="#546E7A" stroke-width="1.2"/>
    <ellipse cx="25" cy="35" rx="8" ry="4" fill="#B23B1F" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <ellipse cx="40" cy="33" rx="7" ry="4" fill="#C97B4A" stroke="${ICON_DARK}" stroke-width="1.3"/>`),

  buffet_donkatsu: svgWrap(`${bg()}${plate()}
    <rect x="18" y="35" width="28" height="7" rx="3" fill="#D4A24C" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <rect x="20" y="28" width="24" height="7" rx="3" fill="#E0B15E" stroke="${ICON_DARK}" stroke-width="1.3"/>
    <rect x="22" y="21" width="20" height="7" rx="3" fill="#EABF70" stroke="${ICON_DARK}" stroke-width="1.3"/>`),

  default: svgWrap(`${bg()}${bowl('#FFFFFF', '#CFE9F2')}`),
};

function getDishIcon(category, sub) {
  return ICONS[`${category}_${sub}`] || ICONS.default;
}
