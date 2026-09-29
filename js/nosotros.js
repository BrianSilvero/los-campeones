// ===== Página "Nuestra historia" =====

function render() {
  applyTexts();
  $("#years-count").dataset.count = yearsOpen();
  $("#years-count").textContent = yearsOpen();

  $("#gallery").innerHTML = GALLERY.map((g, i) => `
    <figure class="reveal" style="--d:${i * 70}ms">
      ${imgOrPlaceholder(g.img, g.caption[lang], "", i === 0 ? "cup" : "pizza")}
      <figcaption>${g.caption[lang]}</figcaption>
    </figure>`).join("");

  renderReviews($("#reviews"));
  $("#address").textContent = BUSINESS.address;
  $("#map-link").href = BUSINESS.maps;
  $("#phones").innerHTML =
    BUSINESS.phones.map((p) => `<li><a href="tel:+54${p.replace(/\D/g, "")}">${p}</a></li>`).join("") +
    `<li><a href="https://wa.me/${BUSINESS.whatsapp}" target="_blank" rel="noopener">WhatsApp ${BUSINESS.whatsappLabel}</a></li>`;
  $("#email").textContent = BUSINESS.email;
  $("#email").href = "mailto:" + BUSINESS.email;
  $("#status-now").innerHTML = statusHTML().replace("status ", "status status-light ");

  $("#faq-list").innerHTML = FAQ
    .map((f) => `<details class="reveal"><summary>${f.q[lang]}</summary><p>${f.a[lang]}</p></details>`).join("");

  $("#wa-link").href = waLink(t("wa"));
  // Las redes van en el pie de página; acá no se repiten (SHOW_BODY_SOCIALS = false)
  const SHOW_BODY_SOCIALS = false;
  $("#socials").innerHTML = !SHOW_BODY_SOCIALS ? "" :
    (BUSINESS.instagram ? `<a href="${BUSINESS.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>` : "") +
    (BUSINESS.facebook ? `<a href="${BUSINESS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>` : "");
  observeReveal();
}

// Contadores animados
function countUp(el) {
  const end = +el.dataset.count;
  const start = end > 1000 ? end - 60 : 0;
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min((now - t0) / 1300, 1);
    el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

mountChrome("about", render);
render();
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
}));
$$("[data-count]").forEach((el) => cio.observe(el));
mountScrollBar();
