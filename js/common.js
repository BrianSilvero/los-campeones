// ===== Funciones compartidas por las tres páginas =====

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function getLang() { try { return localStorage.getItem("lc-lang"); } catch (e) { return null; } }
function saveLang(l) { try { localStorage.setItem("lc-lang", l); } catch (e) {} }
function deviceLang() {
  const l = (navigator.language || "es").slice(0, 2);
  return LANGS.some((x) => x.id === l) ? l : "es";
}

let lang = getLang() || deviceLang();

// ===== Modo salón (entró por el QR/NFC del local) =====
// Dura hasta cerrar la pestaña (sessionStorage).
const IS_SALON = (() => {
  try {
    if (new URLSearchParams(location.search).has(SALON_PARAM)) sessionStorage.setItem("lc-mode", "salon");
    return sessionStorage.getItem("lc-mode") === "salon";
  } catch (e) { return new URLSearchParams(location.search).has(SALON_PARAM); }
})();
if (IS_SALON) document.documentElement.classList.add("mode-salon");
const t = (key) => UI[lang][key] ?? UI.es[key] ?? key;
const yearsOpen = () => new Date().getFullYear() - BUSINESS.founded;

function money(n) {
  const loc = LANGS.find((l) => l.id === lang).locale;
  return "$" + new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(n);
}
const waLink = (text) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
const flagOf = (id) => FLAGS[LANGS.find((l) => l.id === id).flag];

// Hora actual en Buenos Aires (sirva el teléfono de donde sirva)
function nowBA() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: +get("hour") % 24, minute: +get("minute") };
}
function isOpenNow() {
  const { day, hour } = nowBA();
  return BUSINESS.openDays.includes(day) && hour >= BUSINESS.openFrom && hour < BUSINESS.openTo;
}
function isLunchNow() {
  const { day, hour } = nowBA();
  return LUNCH.days.includes(day) && hour >= LUNCH.from && hour < LUNCH.to;
}
function statusHTML() {
  const open = isOpenNow();
  const { day, hour } = nowBA();
  let sub;
  if (open) sub = t("closesAt");
  else if (day === 1) sub = t("opensTue");
  else if (BUSINESS.openDays.includes(day) && hour < BUSINESS.openFrom) sub = t("opensAt8");
  else sub = t("opensTomorrow");
  // Cartelito colgado tipo bar: verde ABIERTO / rojo CERRADO
  return `<span class="status sign ${open ? "is-open" : "is-closed"}" title="${sub}">
    <span class="sign-hang" aria-hidden="true"><svg viewBox="0 0 60 14"><circle cx="30" cy="2.2" r="1.8" fill="currentColor"/><path d="M30 2.5 8 13M30 2.5 52 13" stroke="currentColor" stroke-width="1" fill="none"/></svg></span>
    <span class="sign-board"><b>${open ? t("signOpen") : t("signClosed")}</b></span>
    <small class="sign-sub">${sub}</small>
  </span>`;
}

// Selector de idioma de la cabecera
function mountLangPicker(el, onChange) {
  function draw() {
    el.innerHTML = `
      <button class="lp-current" aria-haspopup="true" aria-label="Idioma">
        <span class="lp-flag">${flagOf(lang)}</span><span>${lang.toUpperCase()}</span><span class="lp-caret">▾</span>
      </button>
      <div class="lp-menu">
        ${LANGS.map((l) => `
          <button data-lang="${l.id}" class="${l.id === lang ? "active" : ""}">
            <span class="lp-flag">${flagOf(l.id)}</span>${l.name}
          </button>`).join("")}
      </div>`;
  }
  draw();
  el.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-lang]");
    if (opt) {
      lang = opt.dataset.lang;
      saveLang(lang);
      el.classList.remove("open");
      draw();
      onChange();
      return;
    }
    if (e.target.closest(".lp-current")) el.classList.toggle("open");
  });
  document.addEventListener("click", (e) => { if (!el.contains(e.target)) el.classList.remove("open"); });
  return draw;
}

// ===== Cabecera y barra inferior compartidas por las 3 páginas =====
// page: "menu" | "about" | "book"
function mountChrome(page, onLang = () => {}) {
  const menuHref = page === "menu" ? "#" : "index.html#carta";
  const link = (id, href, key, icon) =>
    `<a href="${href}" class="${page === id ? "on" : ""}" ${page === id ? 'aria-current="page"' : ""}>
       <span class="nav-ico">${ICONS[icon]}</span><span data-i18n="${key}"></span></a>`;

  $("#topbar").innerHTML = `
    <a href="${menuHref}" class="top-logo" aria-label="Pizzería Los Campeones">
      <img src="img/logo-negativo.png" alt="Pizzería Los Campeones" width="92" height="41" />
    </a>
    <nav class="top-nav" aria-label="Principal">
      ${link("menu", menuHref, "navMenu", "pizza")}
      ${link("about", "nosotros.html", "story", "book")}
      ${link("book", "reservar.html", "book", "calendar")}
    </nav>
    <div class="top-status" id="top-status"></div>
    <a class="icon-btn" id="call-btn" href="tel:${BUSINESS.mainPhone}" aria-label="Llamar">${ICONS.phone}</a>
    <div class="lang-picker" id="lang-picker"></div>`;

  $("#bottom-nav").innerHTML = IS_SALON ? `
    ${link("menu", menuHref, "navMenu", "pizza")}
    ${link("about", "nosotros.html", "story", "book")}
    <a href="#" class="bn-contact" data-contact><span class="nav-ico">${ICONS.pin}</span><span data-i18n="contact"></span></a>` : `
    ${link("menu", menuHref, "navMenu", "pizza")}
    ${link("about", "nosotros.html", "story", "book")}
    ${link("book", "reservar.html", "book", "calendar")}
    <a class="bn-order" id="bn-order" target="_blank" rel="noopener"><span class="nav-ico">${ICONS.whatsapp}</span><span data-i18n="navOrder"></span></a>`;
  if (IS_SALON) {
    const book = $('.top-nav a[href="reservar.html"]');
    if (book) book.outerHTML = `<a href="#" data-contact><span class="nav-ico">${ICONS.pin}</span><span data-i18n="contact"></span></a>`;
    $$("[data-contact]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openContact(); }));
  }

  if (page === "menu") {
    $$('#topbar a[href="#"], #bottom-nav a[href="#"]').forEach((a) =>
      a.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); })
    );
  }

  const refresh = () => {
    $("#top-status").innerHTML = statusHTML();
    if ($("#bn-order")) $("#bn-order").href = waLink(t("wa"));
    $("#call-btn").setAttribute("aria-label", t("call"));
  };
  const redrawPicker = mountLangPicker($("#lang-picker"), () => { applyTexts(); refresh(); onLang(); });
  applyTexts($("#topbar"));
  applyTexts($("#bottom-nav"));
  refresh();
  setInterval(refresh, 60000);
  return () => { redrawPicker(); refresh(); };
}

// Foto con respaldo: si todavía no existe, queda un recuadro elegante
function imgOrPlaceholder(src, alt, cls = "", icon = "pizza") {
  return `<div class="ph ${cls}">
    <span class="ph-icon">${ICONS[icon] || ICONS.pizza}</span>
    ${src ? `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()" />` : ""}
  </div>`;
}

// Textos con data-i18n
function applyTexts(root = document) {
  document.documentElement.lang = lang;
  $$("[data-i18n]", root).forEach((el) => (el.textContent = t(el.dataset.i18n).replace("{years}", yearsOpen())));
  $$("[data-icon]", root).forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ""));
  $$("[data-filete]", root).forEach((el) => (el.innerHTML = FILETE));
}

// Aparición suave al hacer scroll
let revealIO;
function observeReveal() {
  revealIO ??= new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); revealIO.unobserve(en.target); }
    }),
    { threshold: 0.1 }
  );
  $$(".reveal:not(.visible)").forEach((el) => revealIO.observe(el));
}

// Barra dorada de progreso + estado "scrolled"
function mountScrollBar() {
  const bar = $("#scroll-bar");
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    document.body.classList.toggle("scrolled", scrollY > 40);
  };
  addEventListener("scroll", update, { passive: true });
  update();
}

// ===== Brasas en tiempo real (canvas) =====
// "strong": carga e idiomas · "soft": fondo delicado de la carta
function mountEmbers(canvas) {
  if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const soft = canvas.dataset.embers === "soft";
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, parts = [], running = true;

  const count = () => {
    const base = soft ? (innerWidth < 700 ? 14 : 24) : (innerWidth < 700 ? 38 : 60);
    return base;
  };
  const spawn = (fromBottom) => ({
    x: Math.random() * w,
    y: fromBottom ? h + Math.random() * 40 : Math.random() * h,
    r: (soft ? 0.7 : 0.9) + Math.random() * (soft ? 1.1 : 1.9),
    vy: (soft ? 0.18 : 0.35) + Math.random() * (soft ? 0.35 : 0.9),
    drift: (Math.random() - 0.5) * 0.35,
    phase: Math.random() * Math.PI * 2,
    life: 0,
    max: (soft ? 900 : 520) + Math.random() * 500,
    hue: 22 + Math.random() * 20,
  });
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: count() }, () => spawn(false));
  }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = soft ? "source-over" : "lighter";
    for (const p of parts) {
      p.life++;
      p.y -= p.vy;
      p.x += p.drift + Math.sin((p.life + p.phase * 50) / 40) * 0.25;
      const fade = Math.min(1, p.life / 60) * Math.max(0, 1 - p.life / p.max);
      const flicker = 0.65 + 0.35 * Math.sin(p.life / 6 + p.phase);
      const a = fade * flicker * (soft ? 0.45 : 0.9);
      if (p.y < -10 || p.life > p.max) Object.assign(p, spawn(true));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue + 15}, 100%, 70%, ${a})`);
      g.addColorStop(0.35, `hsla(${p.hue}, 100%, 55%, ${a * 0.6})`);
      g.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  resize();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });
  requestAnimationFrame(frame);
  return { stop() { running = false; canvas.remove(); } };
}


// ===== Ficha de contacto (modo salón) =====
function openContact() {
  let el = $("#contact-sheet");
  if (!el) {
    document.body.insertAdjacentHTML("beforeend", `<div class="cart-bg" id="contact-bg"></div><aside class="cart contact-sheet" id="contact-sheet" role="dialog" aria-modal="true"></aside>`);
    el = $("#contact-sheet");
    $("#contact-bg").addEventListener("click", closeContact);
    addEventListener("keydown", (e) => e.key === "Escape" && closeContact());
  }
  el.innerHTML = `
    <span class="sheet-handle"></span>
    <header class="cart-head">
      <span class="cart-ico">${ICONS.pin}</span><h2>${t("contact")}</h2>
      <button class="cart-close" aria-label="${t("close")}">${ICONS.close}</button>
    </header>
    <p class="contact-sub">${t("contactSub")}</p>
    <div class="contact-card">
      <p><span class="ci">${ICONS.pin}</span>${BUSINESS.address}</p>
      <p><span class="ci">${ICONS.clock}</span>${t("hoursText")} · ${t("mondayClosed")}</p>
      <p><span class="ci">${ICONS.phone}</span>${BUSINESS.phones.join(" · ")}</p>
      <p><span class="ci">${ICONS.mail}</span>${BUSINESS.email}</p>
    </div>
    <div class="contact-actions">
      <a class="btn btn-dark" href="tel:${BUSINESS.mainPhone}">${ICONS.phone}${t("callUs")}</a>
      <a class="btn btn-wa" href="https://wa.me/${BUSINESS.whatsapp}" target="_blank" rel="noopener">${ICONS.whatsapp}${t("writeUs")}</a>
    </div>
    <a class="btn btn-gold btn-block" href="${BUSINESS.maps}" target="_blank" rel="noopener">${ICONS.pin}${t("howToGet")}</a>
    ${BUSINESS.instagram ? `<a class="link" href="${BUSINESS.instagram}" target="_blank" rel="noopener">Instagram →</a>` : ""}`;
  $(".cart-close", el).onclick = closeContact;
  document.body.classList.add("contact-open");
}
function closeContact() { document.body.classList.remove("contact-open"); }
