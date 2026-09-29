// ===== Pedido (carrito) =====
// El cliente arma el pedido, cambia cantidades o quita productos y lo envía por WhatsApp.
// Queda preparado para conectar con el panel admin, el stock y el pago online.

const Cart = (() => {
  const KEY = "lc-cart";
  let items = [];
  let mode = "pickup";
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} };
  const count = () => items.reduce((n, it) => n + it.qty, 0);
  const total = () => items.reduce((n, it) => n + it.qty * it.price, 0);
  const qtyOf = (key) => items.find((i) => i.key === key)?.qty || 0;

  // ---------- DOM ----------
  document.body.insertAdjacentHTML("beforeend", `
    <button class="cart-bar" id="cart-bar" aria-haspopup="dialog" hidden>
      <span class="cb-ico">${ICONS.bag}<em id="cb-count">0</em></span>
      <span class="cb-text" id="cb-text"></span>
      <b class="cb-total" id="cb-total"></b>
    </button>
    <div class="cart-bg" id="cart-bg"></div>
    <aside class="cart" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <span class="sheet-handle"></span>
      <header class="cart-head">
        <span class="cart-ico">${ICONS.bag}</span>
        <h2 id="cart-title"></h2>
        <button class="cart-close" id="cart-close" aria-label="Cerrar">${ICONS.close}</button>
      </header>
      <div class="cart-body" id="cart-body"></div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`);

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 1600);
  }

  function renderBar() {
    const bar = $("#cart-bar");
    const n = IS_SALON ? 0 : count();
    bar.hidden = n === 0;
    $("#cb-count").textContent = n;
    $("#cb-text").textContent = t("myOrder");
    $("#cb-total").textContent = money(total());
    document.body.classList.toggle("has-cart", n > 0);
  }

  function renderCart() {
    $("#cart-title").textContent = t("orderTitle");
    const body = $("#cart-body");
    if (!items.length) {
      body.innerHTML = `<div class="cart-empty">${ICONS.bag}<p>${t("emptyOrder")}</p></div>`;
      return;
    }
    const n = count();
    body.innerHTML = `
      <ul class="cart-list">
        ${items.map((it) => `
          <li data-key="${it.key}">
            <div class="ci-main">
              <b>${it.name}</b>
              ${it.detail ? `<small>${it.detail}</small>` : ""}
              <span class="ci-unit">${money(it.price)} c/u</span>
            </div>
            <div class="stepper" aria-label="${t("qty")}">
              <button data-act="dec" aria-label="−">${it.qty === 1 ? ICONS.trash : ICONS.minus}</button>
              <output>${it.qty}</output>
              <button data-act="inc" aria-label="+">${ICONS.plus}</button>
            </div>
            <b class="ci-sum">${money(it.qty * it.price)}</b>
          </li>`).join("")}
      </ul>
      <div class="cart-total"><span>${t("subtotal")} · ${n} ${n === 1 ? t("items1") : t("itemsN")}</span><b>${money(total())}</b></div>

      <p class="cart-label">${t("howGet")}</p>
      <div class="mode">
        <button class="${mode === "pickup" ? "on" : ""}" data-mode="pickup">${t("pickup")}</button>
        <button class="${mode === "delivery" ? "on" : ""}" data-mode="delivery">${t("delivery")}</button>
      </div>
      <label class="cart-field"><span>${t("yourName")} <i class="req">*</i></span><input class="input" id="c-name" autocomplete="name" /></label>
      <label class="cart-field" id="c-addr-wrap" ${mode === "delivery" ? "" : "hidden"}><span>${t("address")} <i class="req">*</i></span><input class="input" id="c-addr" autocomplete="street-address" placeholder="${t("addressPh")}" /></label>
      <label class="cart-field"><span>${t("notesOrder")}</span><input class="input" id="c-notes" placeholder="${t("notesOrderPh")}" /></label>
      <p class="cart-note">${mode === "delivery" ? t("deliveryNote") + " " : ""}${t("payNote")}</p>

      <a class="btn btn-wa btn-block" id="c-send" target="_blank" rel="noopener">${ICONS.whatsapp}${t("sendOrder")}</a>
      <button class="cart-clear" id="c-clear">${ICONS.trash}${t("clearOrder")}</button>`;
    // restaurar lo escrito
    const f = renderCart.form || {};
    ["name", "addr", "notes"].forEach((k) => { if (f[k] && $("#c-" + k)) $("#c-" + k).value = f[k]; });
    updateLink();
  }

  // Mensaje para el local: sin precios (los confirma el local / la automatización)
  // y con etiquetas fijas en español para que sea fácil de leer y de procesar.
  function message() {
    const name = $("#c-name")?.value.trim();
    const addr = $("#c-addr")?.value.trim();
    const notes = $("#c-notes")?.value.trim();
    const lines = ["*PEDIDO WEB · Pizzería Los Campeones*", ""];
    lines.push(`Nombre: ${name}`);
    if (mode === "delivery") {
      lines.push("Forma de entrega: Envío a domicilio");
      lines.push(`Dirección de envío: ${addr}`);
    } else {
      lines.push("Forma de entrega: Retiro por el local (Av. Montes de Oca 856)");
    }
    lines.push("", "Productos:");
    items.forEach((it) => lines.push(`• ${it.qty} × ${it.name}${it.detail ? ` (${it.detail.toLowerCase()})` : ""}`));
    if (notes) lines.push("", `Aclaraciones: ${notes}`);
    return lines.join("\n");
  }

  // Campos obligatorios: nombre siempre; dirección sólo si es envío a domicilio
  function validate() {
    const bad = [];
    if (!$("#c-name")?.value.trim()) bad.push("#c-name");
    if (mode === "delivery" && !$("#c-addr")?.value.trim()) bad.push("#c-addr");
    $$(".cart-field", $("#cart")).forEach((f) => f.classList.remove("error"));
    bad.forEach((sel) => {
      const f = $(sel).closest(".cart-field");
      f.classList.add("error");
      if (!$(".req-msg", f)) f.insertAdjacentHTML("beforeend", `<em class="req-msg">${t("reqField")}</em>`);
    });
    if (bad.length) $(bad[0]).focus();
    return !bad.length;
  }

  function updateLink() { const a = $("#c-send"); if (a) a.href = waLink(message()); }

  function refresh() { save(); renderBar(); if (document.body.classList.contains("cart-open")) renderCart(); document.dispatchEvent(new Event("cart:change")); }

  // ---------- API ----------
  function add(item, qty = 1) {
    if (IS_SALON || item.available === false) return;
    const found = items.find((i) => i.key === item.key);
    if (found) found.qty += qty;
    else items.push({ key: item.key, name: item.name, detail: item.detail || "", price: item.price, qty });
    refresh();
    toast(`${t("added")}: ${qty} × ${item.name}`);
    const bar = $("#cart-bar");
    bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump");
  }
  function change(key, delta) {
    const it = items.find((i) => i.key === key);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) { items = items.filter((i) => i !== it); toast(t("removed")); }
    refresh();
  }
  function open() { renderCart(); document.body.classList.add("cart-open"); }
  function close() { document.body.classList.remove("cart-open"); }

  // ---------- Eventos ----------
  $("#cart-bar").addEventListener("click", open);
  $("#cart-bg").addEventListener("click", close);
  $("#cart-close").addEventListener("click", close);
  addEventListener("keydown", (e) => e.key === "Escape" && close());
  $("#cart-body").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.act) change(b.closest("li").dataset.key, b.dataset.act === "inc" ? 1 : -1);
    if (b.dataset.mode) { mode = b.dataset.mode; renderCart(); }
    if (b.id === "c-clear") { items = []; refresh(); renderCart(); }
  });
  $("#cart-body").addEventListener("click", (e) => {
    if (e.target.closest("#c-send") && !validate()) e.preventDefault();
  }, true);
  $("#cart-body").addEventListener("input", (e) => {
    const f = e.target.closest(".cart-field");
    if (f && e.target.value.trim()) { f.classList.remove("error"); $(".req-msg", f)?.remove(); }
    renderCart.form = { name: $("#c-name")?.value, addr: $("#c-addr")?.value, notes: $("#c-notes")?.value };
    updateLink();
  });

  renderBar();
  return { add, change, qtyOf, open, close, renderBar, count };
})();
