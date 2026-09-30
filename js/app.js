// ===== Carta: carga → idiomas → carta por pestañas =====

const SPLASH_MS = 1000;   // pantalla de carga
const FILL_MS = 1150;     // la copa se llena

// ---------------- Pantalla 0 → 1 ----------------
function startFlow() {
  // Volviendo desde otra página, o la intro ya se vio en esta pestaña: directo a la carta.
  // Las puertas se ven cada vez que se abre la página de nuevo (al cerrar la pestaña
  // se borra sessionStorage); los idiomas sólo la primera vez (queda guardado).
  let introSeen = false;
  try { introSeen = sessionStorage.getItem("lc-intro") === "1"; sessionStorage.setItem("lc-intro", "1"); } catch (e) {}
  if ((location.hash && location.hash !== "#") || introSeen) {
    ["#gate", "#splash", "#lang-screen"].forEach((s) => $(s)?.remove());
    showApp(false);
    return;
  }
  const hasLang = !!getLang();
  // Después de las puertas: la primera vez se elige idioma; después, directo a la carta
  const afterIntro = () => {
    if (!hasLang) return showLangScreen();
    $("#lang-screen")?.remove();
    showApp(true);
  };
  document.body.classList.add("intro");
  applyTexts($("#gate"));
  applyTexts($("#lang-screen"));
  buildLangOptions();
  mountEmbers($("#splash .ember-canvas"));

  // Puertas: se abren → logo con brillo → se cierran (lisas) → se abren de nuevo → idiomas
  const gate = $("#gate");
  gate.classList.add("shut");
  const T = [];
  T.push(setTimeout(() => gate.classList.replace("shut", "open"), 150));
  T.push(setTimeout(() => gate.classList.replace("open", "shut"), 2100));
  T.push(setTimeout(() => { $("#splash")?.remove(); afterIntro(); }, 2550));
  T.push(setTimeout(() => gate.classList.replace("shut", "open"), 2650));
  T.push(setTimeout(() => gate.remove(), 3300));
  // tocar la pantalla saltea la intro
  const skip = () => {
    T.forEach(clearTimeout);
    gate.remove();
    $("#splash")?.remove();
    afterIntro();
  };
  gate.addEventListener("click", skip, { once: true });
  $("#splash").addEventListener("click", skip, { once: true });
}

function buildLangOptions() {
  const suggested = getLang() || deviceLang();
  $("#lang-title").textContent = UI[suggested].chooseLang;
  $("#lang-options").innerHTML = LANGS.map((l, i) => `
    <button class="lang-opt ${l.id === suggested ? "suggested" : ""}" data-lang="${l.id}" style="--i:${i}">
      <span class="fill" aria-hidden="true"><span class="fill-wave"></span></span>
      <span class="lang-flag">${flagOf(l.id)}</span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-arrow">›</span>
      <span class="lang-cup" aria-hidden="true">
        ${trophySVG(l.id)}
        <span class="cup-stars">${ICONS.star}${ICONS.star}${ICONS.star}</span>
        <span class="cup-burst"></span>
      </span>
    </button>`).join("");
}

function showLangScreen() {
  const scr = $("#lang-screen");
  if (scr.classList.contains("in")) return;
  scr.classList.add("in");
  mountEmbers($(".ember-canvas", scr));
}

// Al elegir: se llena la copa y la pantalla sube como una cortina
let choosing = false;
$("#lang-options").addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-opt");
  if (!btn || choosing) return;
  choosing = true;
  const changed = lang !== btn.dataset.lang;
  lang = btn.dataset.lang;
  saveLang(lang);
  if (changed) { redrawChrome(); renderAll(); }
  $("#lang-options").classList.add("choosing");
  btn.style.setProperty("--fill-ms", FILL_MS + "ms");
  requestAnimationFrame(() => btn.classList.add("picked"));
  setTimeout(() => btn.classList.add("full"), FILL_MS);
  // Cortina: la pantalla de idiomas sube y deja ver la carta debajo
  setTimeout(() => {
    showApp(true);
    const scr = $("#lang-screen");
    scr.classList.add("curtain");
    setTimeout(() => scr.remove(), 650);
  }, FILL_MS + 380);
});

function showApp(animate) {
  const app = $("#app");
  if (!window.__bgEmbers) window.__bgEmbers = mountEmbers($(".ember-bg"));
  app.classList.add("in");
  if (!animate) app.classList.add("no-anim");
  document.body.classList.remove("locked", "intro");
  moveIndicator($(".cat.active"), false);
  mountScrollBar();
}

const redrawChrome = mountChrome("menu", renderAll);

// ---------------- Estado de la carta ----------------
// Orden plano de categorías según los grupos
function orderedCategories() {
  return GROUPS.flatMap((g) => g.cats).map((id) => CATEGORIES.find((c) => c.id === id));
}
const groupOf = (catId) => GROUPS.find((g) => g.cats.includes(catId));
const lastInGroup = {}; // recuerda la última subcategoría vista en cada grupo
const catFromHash = () => {
  const id = location.hash.replace("#", "");
  return CATEGORIES.some((c) => c.id === id) ? id : null;
};
let current = catFromHash() || (isLunchNow() ? "mediodia" : orderedCategories()[0].id);
let pizzaStyle = (() => { try { return localStorage.getItem("lc-style") || "p"; } catch (e) { return "p"; } })();

const imgOf = (p) => `img/productos/${p.id}.webp`;
const tagsOf = (p) => (PODIUM.includes(p.id) ? ["star", ...p.tags] : p.tags);
const TAG_ICON = { star: "star", veggie: "leaf", spicy: "chili", gf: "wheat" };
const tagMini = (tag) => `<i class="mini mini-${tag}" title="${t("tag." + tag)}" aria-label="${t("tag." + tag)}">${ICONS[TAG_ICON[tag]]}</i>`;
const tagChip = (tag) => `<span class="tag tag-${tag}"><i>${ICONS[TAG_ICON[tag]]}</i>${t("tag." + tag)}</span>`;

// Foto opcional: el hueco sólo aparece cuando la foto existe
const thumb = (src, alt) => MISSING_IMG.has(src) ? "" :
  `<span class="thumb"><img src="${src}" alt="${alt}" loading="lazy" onload="this.parentNode.classList.add('has')" onerror="markMissing(this);this.parentNode.remove()" /></span>`;

// ---------------- Render ----------------
function renderTabs() {
  const g0 = groupOf(current);
  $("#cats-track").innerHTML = GROUPS.map((g) => `
    <button class="cat ${g === g0 ? "active" : ""}" role="tab" aria-selected="${g === g0}" data-group="${g.id}">
      <i>${ICONS[g.icon]}</i><span>${g.name[lang]}</span>
      ${g.id === "mediodia" && isLunchNow() ? `<em class="now-badge">●</em>` : ""}
    </button>`).join("");
}

// Botones de subcategoría dentro del grupo (Clásicas / Especiales, etc.)
function renderSubcats() {
  const g = groupOf(current);
  const el = $("#subcats");
  if (g.cats.length < 2) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  el.style.setProperty("--n", g.cats.length);
  el.innerHTML = g.cats.map((id) => {
    const c = CATEGORIES.find((x) => x.id === id);
    return `<button role="tab" aria-selected="${id === current}" class="sub ${id === current ? "on" : ""}" data-cat="${id}">
      <i>${ICONS[c.icon]}</i><span>${(c.short || c.name)[lang]}</span></button>`;
  }).join("") + `<span class="sub-thumb" aria-hidden="true"></span>`;
  el.dataset.idx = g.cats.indexOf(current);
  el.style.setProperty("--idx", g.cats.indexOf(current));
}

function renderStyleToggle(cat) {
  const el = $("#style-toggle");
  if (cat.type !== "pizza") { el.hidden = true; return; }
  el.hidden = false;
  el.dataset.style = pizzaStyle;
  el.classList.add("v2");
  el.innerHTML = `
    <button class="sw-label ${pizzaStyle === "p" ? "on" : ""}" data-style="p">
      <b>${t("piedra")}</b><small>${t("super")} · ${t("mediana")}</small></button>
    <button class="switch" role="switch" aria-checked="${pizzaStyle === "m"}" aria-label="${t("pizzaSwitch")}" data-toggle>
      <span class="knob"></span></button>
    <button class="sw-label ${pizzaStyle === "m" ? "on" : ""}" data-style="m">
      <b>${t("molde")}</b><small>${t("grande")} · ${t("chica")}</small></button>`;
}

function pizzaRow(p, i) {
  const [a, b] = pizzaStyle === "p" ? p.p : p.m;
  const labels = pizzaStyle === "p" ? [t("super"), t("mediana")] : [t("grande"), t("chica")];
  const porc = pizzaStyle === "p" ? [10, 8] : [8, 6];
  const price = (label, n, v) => v
    ? `<span class="pr" title="${n} ${t("porc")}"><small>${label}</small><b>${money(v)}</b></span>` : "";
  const prices = a || b
    ? price(labels[0], porc[0], a) + price(labels[1], porc[1], b)
    : `<span class="pr-none">${t("onlyPiedra")}</span>`;
  return `
    <li style="--i:${i}">
      <button class="row row-pizza" data-id="${p.id}">
        ${thumb(imgOf(p), p.name)}
        <span class="row-main">
          <span class="row-name">${p.name}${tagsOf(p).map(tagMini).join("")}</span>
          <span class="row-desc">${p.desc[lang]}</span>
          <span class="row-prices">${prices}</span>
        </span>
        <span class="row-chev" aria-hidden="true">›</span>
      </button>
    </li>`;
}

const listKey = (catId, i) => `${catId}:${i}`;
function listRow(it, i) {
  const key = listKey(current, i);
  const q = Cart.qtyOf(key);
  const off = it.available === false;
  return `
    <li style="--i:${i}">
      <div class="row row-list ${it.featured ? "featured" : ""} ${off ? "off" : ""}">
        <span class="row-main">
          <span class="row-name">${it.name}${off ? `<em class="nostock">${t("noStock")}</em>` : ""}</span>
          ${lang !== "es" && it.hint ? `<span class="row-desc">${it.hint[lang]}</span>` : ""}
        </span>
        <span class="row-dots"></span>
        <b class="row-price">${money(it.price)}</b>
        <button class="add-btn ${q ? "has" : ""}" data-add="${i}" ${off ? "disabled" : ""} aria-label="${t("addToOrder")}: ${it.name}">
          ${ICONS.plus}<em>${q || ""}</em></button>
      </div>
    </li>`;
}

function renderRows(cat) {
  const rows = $("#rows");
  rows.className = "rows rows-" + cat.type;
  rows.innerHTML = cat.type === "pizza"
    ? PIZZAS.filter((p) => p.cat === cat.id).map(pizzaRow).join("")
    : LIST_ITEMS[cat.id].items.map(listRow).join("");
}

function renderPanel(dir = 0) {
  const cat = CATEGORIES.find((c) => c.id === current);
  lastInGroup[groupOf(current).id] = current;
  renderSubcats();
  $("#panel").classList.toggle("has-subs", groupOf(current).cats.length > 1);
  const list = LIST_ITEMS[cat.id];
  const count = cat.type === "pizza" ? PIZZAS.filter((p) => p.cat === cat.id).length : list.items.length;

  $("#panel-icon").innerHTML = ICONS[cat.icon];
  $("#panel-title").textContent = cat.name[lang];
  // En inglés y portugués se aclara la moneda para que un turista no lea dólares
  $("#panel-note").textContent = (list?.note ? list.note[lang] : `${count} ${t("items")}`) + (lang !== "es" ? ` · ${t("pricesARS")}` : "");
  renderStyleToggle(cat);
  renderRows(cat);
  $("#tap-hint").hidden = cat.type !== "pizza";

  // botón "Siguiente categoría" al final de la lista
  const order = orderedCategories();
  const nxt = order[order.findIndex((c) => c.id === current) + 1];
  const nb = $("#next-cat");
  nb.hidden = !nxt;
  if (nxt) {
    nb.dataset.cat = nxt.id;
    nb.innerHTML = `<small>${t("next")}</small><span class="nc-ico">${ICONS[nxt.icon]}</span><b>${nxt.name[lang]}</b><span class="nc-arrow">${ICONS.arrow}</span>`;
  }

  // entrada animada según hacia dónde cambiaste
  const panel = $("#panel");
  panel.classList.remove("from-left", "from-right", "enter");
  void panel.offsetWidth;
  panel.classList.add("enter", dir < 0 ? "from-left" : "from-right");
}

function renderAll() {
  applyTexts();
  reviewBadge($("#g-badge"), "nosotros.html#resenas");
  if (window.Cart) Cart.renderBar();
  $("#wa-float").href = waLink(t("wa"));
  $("#footer-addr").textContent = BUSINESS.address;
  renderTabs();
  renderPanel();
  requestAnimationFrame(() => moveIndicator($(".cat.active"), false));
}

// ---------------- Cambio de pestaña ----------------
function moveIndicator(btn, smooth = true) {
  if (!btn) return;
  const ind = $("#cats-indicator");
  const track = $("#cats-track");
  ind.style.transition = smooth ? "" : "none";
  ind.style.width = btn.offsetWidth + "px";
  ind.style.height = btn.offsetHeight + "px";
  ind.style.transform = `translate(${track.offsetLeft + btn.offsetLeft - track.scrollLeft}px, ${track.offsetTop + btn.offsetTop - track.scrollTop}px)`;
  if (!smooth) requestAnimationFrame(() => (ind.style.transition = ""));
}

function selectCat(id) {
  if (id === current) return;
  const order = orderedCategories().map((c) => c.id);
  const dir = order.indexOf(id) - order.indexOf(current);
  current = id;
  history.replaceState(null, "", "#" + id);
  const gid = groupOf(id).id;
  $$(".cat").forEach((b) => {
    const on = b.dataset.group === gid;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  const btn = $(".cat.active");
  const track = $("#cats-track");
  if (track.scrollWidth > track.clientWidth + 2) {
    track.scrollTo({ left: btn.offsetLeft - track.clientWidth / 2 + btn.offsetWidth / 2, behavior: "smooth" });
  }
  moveIndicator(btn);
  renderPanel(dir);
  // si habías bajado, volvemos al comienzo de la lista
  const stickyH = $(".topbar").offsetHeight + (innerWidth < 1024 ? $("#cats").offsetHeight : 0);
  const top = $("#main").getBoundingClientRect().top + scrollY - stickyH - 8;
  if (scrollY > top) scrollTo({ top, behavior: "smooth" });
}

$("#cats-track").addEventListener("click", (e) => {
  const b = e.target.closest(".cat");
  if (!b) return;
  const g = GROUPS.find((x) => x.id === b.dataset.group);
  selectCat(lastInGroup[g.id] || g.cats[0]);
});
$("#cats-track").addEventListener("scroll", () => moveIndicator($(".cat.active"), false), { passive: true });
addEventListener("resize", () => moveIndicator($(".cat.active"), false));

// Selector A la piedra / Al molde
$("#style-toggle").addEventListener("click", (e) => {
  const b = e.target.closest("[data-style], [data-toggle]");
  if (!b) return;
  const next = b.hasAttribute("data-toggle") ? (pizzaStyle === "p" ? "m" : "p") : b.dataset.style;
  if (next === pizzaStyle) return;
  pizzaStyle = next;
  try { localStorage.setItem("lc-style", pizzaStyle); } catch (err) {}
  const cat = CATEGORIES.find((c) => c.id === current);
  renderStyleToggle(cat);
  renderRows(cat);
  const rows = $("#rows");
  rows.classList.remove("swap"); void rows.offsetWidth; rows.classList.add("swap");
});

// Deslizar el dedo a los costados cambia de categoría
let touch = null;
$("#panel").addEventListener("touchstart", (e) => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
$("#panel").addEventListener("touchend", (e) => {
  if (!touch) return;
  const dx = e.changedTouches[0].clientX - touch.x;
  const dy = e.changedTouches[0].clientY - touch.y;
  touch = null;
  if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return;
  const order = orderedCategories().map((c) => c.id);
  const next = order[order.indexOf(current) + (dx < 0 ? 1 : -1)];
  if (next) selectCat(next);
}, { passive: true });

// ---------------- Ficha de la pizza ----------------
function openSheet(id) {
  const p = PIZZAS.find((x) => x.id === id);
  if (!p) return;
  const opts = [
    [t("piedra"), t("super"), 10, p.p[0], "p"], [t("piedra"), t("mediana"), 8, p.p[1], "p"],
    [t("molde"), t("grande"), 8, p.m[0], "m"], [t("molde"), t("chica"), 6, p.m[1], "m"],
  ].filter((o) => o[3]);
  const first = Math.max(0, opts.findIndex((o) => o[4] === pizzaStyle));

  $("#sheet").innerHTML = `
    <span class="sheet-handle"></span>
    <button class="sheet-close" aria-label="${t("close")}">${ICONS.close}</button>
    <div class="sheet-photo">${imgOrPlaceholder(imgOf(p), p.name, "sheet-img", "pizza")}</div>
    <div class="sheet-body">
      <div class="tags">${tagsOf(p).map(tagChip).join("")}</div>
      <h3>${p.name}</h3>
      <p>${p.desc[lang]}</p>
      <p class="sheet-label">${IS_SALON ? t("sizesTitle") : t("chooseSize")}</p>
      <div class="size-pick">
        ${opts.map((o, i) => `
          <label class="sp ${i === first ? "on" : ""}">
            <input type="radio" name="size" value="${i}" ${i === first ? "checked" : ""} />
            <span class="sp-style">${o[0]}</span>
            <span class="sp-name">${o[1]} <small>${o[2]} ${t("porc")}</small></span>
            <b>${money(o[3])}</b>
          </label>`).join("")}
      </div>
      <div class="sheet-buy">
        <div class="stepper big" aria-label="${t("qty")}">
          <button data-q="-1" aria-label="−">${ICONS.minus}</button><output id="sheet-qty">1</output><button data-q="1" aria-label="+">${ICONS.plus}</button>
        </div>
        <button class="btn btn-gold btn-add" id="sheet-add">${ICONS.bag}<span>${t("addShort")}</span><b id="sheet-add-total"></b></button>
      </div>
      <a class="btn btn-wa-outline btn-block" id="sheet-order" target="_blank" rel="noopener">${ICONS.whatsapp}${t("orderOnly")}</a>
      <p class="allergy">${t("allergy")}</p>
    </div>`;

  let qty = 1;
  const sel = () => opts[+$('input[name="size"]:checked', $("#sheet")).value];
  const updateLink = () => {
    const o = sel();
    $("#sheet-order").href = waLink(`${t("waItem")}${qty} × ${p.name} · ${o[0]} ${o[1]} (${money(o[3] * qty)})`);
    $$(".sp", $("#sheet")).forEach((l) => l.classList.toggle("on", l.querySelector("input").checked));
    $("#sheet-qty").textContent = qty;
    $("#sheet-add-total").textContent = money(o[3] * qty);
  };
  $("#sheet").onclick = (e) => {
    const q = e.target.closest("[data-q]");
    if (q) { qty = Math.max(1, Math.min(20, qty + +q.dataset.q)); updateLink(); }
    if (e.target.closest("#sheet-add")) {
      const o = sel();
      Cart.add({ key: `${p.id}:${o[4]}:${o[1]}`, name: p.name, detail: `${o[0]} · ${o[1]}`, price: o[3], available: p.available }, qty);
      closeSheet();
    }
  };
  $("#sheet").onchange = updateLink;
  updateLink();
  document.body.classList.add("sheet-open");
}
function closeSheet() { document.body.classList.remove("sheet-open"); }

$("#rows").addEventListener("click", (e) => {
  const add = e.target.closest(".add-btn");
  if (add) {
    const i = +add.dataset.add;
    const it = LIST_ITEMS[current].items[i];
    const cat = CATEGORIES.find((c) => c.id === current);
    Cart.add({ key: listKey(current, i), name: it.name, detail: cat.name[lang], price: it.price, available: it.available });
    return;
  }
  const row = e.target.closest(".row-pizza");
  if (row) openSheet(row.dataset.id);
});
document.addEventListener("cart:change", () => {
  $$(".add-btn").forEach((b) => {
    const q = Cart.qtyOf(listKey(current, +b.dataset.add));
    b.classList.toggle("has", q > 0);
    b.querySelector("em").textContent = q || "";
  });
});
$("#sheet-bg").addEventListener("click", closeSheet);
$("#sheet").addEventListener("click", (e) => e.target.closest(".sheet-close") && closeSheet());
addEventListener("keydown", (e) => e.key === "Escape" && closeSheet());
$("#subcats").addEventListener("click", (e) => {
  const b = e.target.closest(".sub");
  if (b) selectCat(b.dataset.cat);
});
$("#next-cat").addEventListener("click", (e) => selectCat(e.currentTarget.dataset.cat));

// ---------------- Al subir, la carta termina de subir sola ----------------
// Si al volver hacia arriba el scroll se frena justo donde Clásicas/Especiales
// y el interruptor quedan debajo de las barras fijas, termina de subir suave
// hasta mostrarlos enteros. Sólo al subir, y sólo en esa franja del principio.
// En el celular se mira hacia dónde movió el dedo la persona (no hacia dónde se
// movió la página): Chrome en iPhone, al cerrar su panel "Volver a cargar", empuja
// la página hacia abajo y la deja con los controles tapados.
(function settleAtTop() {
  let lastY = scrollY, scrollUp = false, timer = 0;
  let usingTouch = false, touching = false, startY = 0, moveY = 0, fingerUp = false, fixes = 0;
  // Hasta dónde llega la franja: hasta donde empieza la lista (con un margen chico),
  // o sea mientras estás viendo el principio de la carta con los controles tapados
  const zone = () => {
    const rows = $("#rows");
    if (!rows || !rows.offsetParent) return 0;
    const bars = $(".topbar").offsetHeight + (innerWidth < 1024 ? $("#cats").offsetHeight : 0);
    return rows.getBoundingClientRect().top + scrollY - bars + 40;
  };
  const settle = () => {
    const up = usingTouch ? fingerUp : scrollUp;
    if (touching || !up || document.body.classList.contains("locked")) return;
    const y = scrollY;
    // como mucho dos correcciones por gesto, por si el navegador vuelve a empujar
    if (y > 0 && y < zone() && fixes < 2) { fixes++; scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const later = () => { clearTimeout(timer); timer = setTimeout(settle, 140); };
  addEventListener("scroll", () => {
    const y = scrollY;
    if (y !== lastY) scrollUp = y < lastY;
    lastY = y;
    later();
  }, { passive: true });
  addEventListener("wheel", () => { usingTouch = false; fixes = 0; }, { passive: true });
  // Mientras el dedo está apoyado no se hace nada; al soltar, se espera a que frene
  addEventListener("touchstart", (e) => {
    usingTouch = true; touching = true; fixes = 0; clearTimeout(timer);
    startY = moveY = e.touches[0]?.clientY ?? 0;
  }, { passive: true });
  addEventListener("touchmove", (e) => { moveY = e.touches[0]?.clientY ?? moveY; }, { passive: true });
  const end = () => {
    touching = false;
    if (Math.abs(moveY - startY) < 8) return; // fue un toque, no un deslizamiento
    fingerUp = moveY > startY; // dedo hacia abajo = la página sube
    later();
  };
  addEventListener("touchend", end, { passive: true });
  addEventListener("touchcancel", end, { passive: true });
})();

// La carta se dibuja apenas carga la página (Google también la lee);
// la carga y los idiomas quedan por encima.
renderAll();
startFlow();
