// ===== Íconos en línea dorada, ornamentos fileteados, banderas y la copa =====

const svg = (inner, vb = "0 0 24 24", extra = "") =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

const ICONS = {
  pizza: svg(`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6.5"/><path d="M12 3v18M3.2 12h17.6M5.6 5.6l12.8 12.8"/><circle cx="9" cy="8.5" r=".9" fill="currentColor"/><circle cx="15.5" cy="10" r=".9" fill="currentColor"/><circle cx="10" cy="15.5" r=".9" fill="currentColor"/>`),
  slice: svg(`<path d="M12 3 3.5 20.5Q12 23.5 20.5 20.5Z"/><path d="M5 17.5Q12 20 19 17.5"/><circle cx="12" cy="10" r="1.1" fill="currentColor"/><circle cx="10" cy="15" r="1" fill="currentColor"/><circle cx="14.3" cy="14.8" r="1" fill="currentColor"/>`),
  cup: svg(`<path d="M7 3h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4c0 3 1.5 4.5 3.3 5M17 5h3c0 3-1.5 4.5-3.3 5"/><path d="M12 13v4M9 21h6M10 17h4l.6 4H9.4z"/><path d="m12 5.2.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" fill="currentColor" stroke="none"/>`),
  calzone: svg(`<path d="M3 16a9 9 0 0 1 18 0z"/><path d="M3 16h18"/><path d="M8 11.5q2-1.5 4 0t4 0" opacity=".7"/>`),
  empanada: svg(`<path d="M3 15.5a9 8 0 0 1 18 0z"/><path d="M3.5 13.2q1.2-1 1.8.4.8-1.6 2 -.2.9-1.8 2.2-.4 1-1.8 2.3-.2 1.1-1.6 2.2.2 1.1-1.2 2 .4.9-.8 1.6.4"/>`),
  cutlery: svg(`<path d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18"/><path d="M17 3c-2.2 2-2.2 7 0 9v9"/><circle cx="12" cy="12" r="0" /> `),
  bottle: svg(`<path d="M10 2h4v4l2 3v11.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20.5V9l2-3z"/><path d="M8 12h8M8 17h8"/>`),
  flan: svg(`<path d="M7 18h10l-2-9H9z"/><path d="M9 9q3-2 6 0"/><path d="M9.6 11.5q.8 1.6 1.4 0 .8 1.8 1.6 0 .8 1.4 1.4 0"/><path d="M4 20.5h16"/>`),
  book: svg(`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/>`),
  calendar: svg(`<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9.5 15 2 2 3.5-3.5"/>`),
  phone: svg(`<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.9a16 16 0 0 0 4.7 4.7l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>`),
  pin: svg(`<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>`),
  clock: svg(`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`),
  mail: svg(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>`),
  grid: svg(`<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>`),
  kid: svg(`<ellipse cx="12" cy="8.5" rx="5.5" ry="6.5"/><path d="M12 15v1.2l-1 1.3h2l-1-1.3"/><path d="M12 17.5c0 2 1.5 2.5 1 4.5"/><path d="M9.5 6.5c.6-1 1.5-1.5 2.5-1.5"/>`),
  bag: svg(`<path d="M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>`),
  trash: svg(`<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>`),
  plus: svg(`<path d="M12 5v14M5 12h14"/>`),
  minus: svg(`<path d="M5 12h14"/>`),
  close: svg(`<path d="M6 6l12 12M18 6 6 18"/>`),
  back: svg(`<path d="M15 5l-7 7 7 7"/>`),
  arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  users: svg(`<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>`),
  // Argentos
  ball: svg(`<circle cx="12" cy="12" r="9"/><path d="M12 7.8l3.6 2.6-1.4 4.2H9.8L8.4 10.4z"/><path d="M12 7.8V3.2M15.6 10.4l4.4-1.3M14.2 14.6l2.7 3.8M9.8 14.6 7.1 18.4M8.4 10.4 4 9.1"/>`),
  hat: svg(`<path d="M2.5 16.5q9.5 4.5 19 0"/><path d="M6.5 16c0-6 2.3-9 5.5-9s5.5 3 5.5 9"/><path d="M6.8 13.4h10.4"/><path d="M10 7.3q2 1.4 4 0"/>`),
  bandoneon: svg(`<rect x="1.8" y="6.5" width="5" height="11" rx="1.2"/><rect x="17.2" y="6.5" width="5" height="11" rx="1.2"/><path d="M6.8 6.5 9.2 17.5 11.6 6.5 14 17.5l1.6-5 1.6-6"/><path d="M6.8 17.5h10.4M6.8 6.5h10.4" opacity=".5"/><circle cx="4.3" cy="10" r=".6" fill="currentColor"/><circle cx="4.3" cy="13" r=".6" fill="currentColor"/><circle cx="19.7" cy="10" r=".6" fill="currentColor"/><circle cx="19.7" cy="13" r=".6" fill="currentColor"/>`),
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.5 1.1 6.3L12 17.3l-5.6 3 1.1-6.3-4.6-4.5 6.3-.9z"/></svg>`,
  leaf: svg(`<path d="M5 19c0-8 5-14 15-14 0 9-5 14-13 14"/><path d="M5 19 14 10"/>`),
  chili: svg(`<path d="M8 8c-3 3-4 9-2 12 5-1 11-6 11-11 0-2-1.5-3-3-3"/><path d="M14 6c0-2 1-3 3-3"/>`),
  wheat: svg(`<path d="M12 22V8"/><path d="M12 12c-3 0-4-2-4-4 3 0 4 2 4 4zM12 12c3 0 4-2 4-4-3 0-4 2-4 4zM12 17c-3 0-4-2-4-4 3 0 4 2 4 4zM12 17c3 0 4-2 4-4-3 0-4 2-4 4zM12 8c-1.5-1-1.5-3 0-5 1.5 2 1.5 4 0 5z"/><path d="M4 4l16 16"/>`),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"/></svg>`,
  instagram: svg(`<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>`),
  facebook: svg(`<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>`),
};

// Ornamento fileteado porteño (separador). Mitad izquierda + espejo.
const FILETE_HALF = `
  <path d="M96 12H62"/>
  <path d="M62 12c-6 0-10-5-7-8.5 2.6-3 7.4-.3 6 3-1 2.4-4.4 1.8-4-.6"/>
  <path d="M62 12c-6 0-10 5-7 8.5 2.6 3 7.4.3 6-3-1-2.4-4.4-1.8-4 .6"/>
  <path d="M50 12H26"/>
  <path d="M26 12c-5 0-9-3.5-12-3.5-3.5 0-5 2.2-5 3.5s1.5 3.5 5 3.5c3 0 7-3.5 12-3.5"/>
  <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/>
  <path d="M38 12c0-3 2-5 4-5M38 12c0 3 2 5 4 5" opacity=".7"/>`;
const FILETE = `<svg class="filete" viewBox="0 0 200 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true">
  <g>${FILETE_HALF}</g><g transform="translate(200 0) scale(-1 1)">${FILETE_HALF}</g>
  <path d="M100 4.5 106 12 100 19.5 94 12Z" fill="currentColor" stroke="none"/>
  <circle cx="100" cy="12" r="1.6" fill="#111" stroke="none"/>
</svg>`;

// Esquinas fileteadas para marcos
const CORNER = `<svg class="corner" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
  <path d="M2 38V14C2 7 7 2 14 2h24"/>
  <path d="M8 38V18c0-6 4-10 10-10h20" opacity=".6"/>
  <path d="M14 14c4 0 6 2.5 6 5.5 0 2.4-2 4-4 3.5-1.8-.4-2.2-2.8-.6-3.6"/>
</svg>`;

// Banderas (los emojis de bandera no se ven en Windows)
const FLAGS = {
  ar: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#f6b40e" stroke="#85340a" stroke-width=".4"/></svg>`,
  es: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>`,
  gb: `<svg viewBox="0 0 60 30"><clipPath id="gbc"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><path d="M0,0v30h60v-30z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#gbc)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>`,
  br: `<svg viewBox="0 0 30 21"><rect width="30" height="21" fill="#009c3b"/><path d="M15 2.5 27.5 10.5 15 18.5 2.5 10.5z" fill="#ffdf00"/><circle cx="15" cy="10.5" r="4.6" fill="#002776"/><path d="M10.6 9.4q4.6-1 8.8 1.8" stroke="#fff" stroke-width=".8" fill="none"/></svg>`,
};

// La copa que se llena (pantalla de idiomas). id único por botón.
function trophySVG(id) {
  const shape = `
    <path d="M20 8h24v14c0 9.4-5.4 16-12 16s-12-6.6-12-16z"/>
    <path d="M29 37.5h6l-1 9h-4z"/>
    <path d="M23 46.5h18v6H23z"/>
    <path d="M19 52.5h26v4H19z"/>`;
  return `<svg class="trophy" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <clipPath id="tc-${id}">${shape}</clipPath>
      <linearGradient id="tg-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe7a8"/><stop offset=".45" stop-color="#d6b26a"/><stop offset="1" stop-color="#8a6a33"/>
      </linearGradient>
    </defs>
    <g clip-path="url(#tc-${id})">
      <g class="liquid">
        <path class="wave" fill="url(#tg-${id})" d="M-64 4 Q-56 0 -48 4 T-32 4 T-16 4 T0 4 T16 4 T32 4 T48 4 T64 4 T80 4 T96 4 T112 4 T128 4 V80 H-64 Z"/>
      </g>
      <g class="bubbles" fill="#fff6d6">
        <circle cx="27" cy="30" r="1"/><circle cx="35" cy="26" r=".8"/><circle cx="31" cy="20" r="1.1"/><circle cx="38" cy="16" r=".7"/>
      </g>
    </g>
    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
      ${shape}
      <path d="M20 12h-7c0 8 3 13 8.5 14.5M44 12h7c0 8-3 13-8.5 14.5"/>
    </g>
    <path class="gleam" d="M24 12v10c0 5 1.5 9 4 11.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;
}
