// ===== Página "Contacto" =====

function render() {
  applyTexts();
  $("#c-address").textContent = BUSINESS.address;
  $("#c-map").src = "https://www.google.com/maps?q=" + encodeURIComponent(BUSINESS.address) + "&output=embed";
  $("#c-status").innerHTML = statusHTML().replace("status ", "status status-light ");
  $("#c-phones").innerHTML = BUSINESS.phones
    .map((p) => `<li><a href="tel:+54${p.replace(/\D/g, "")}">${ICONS.phone}${p}</a></li>`).join("");
  $("#c-email").textContent = BUSINESS.email;
  $("#c-email").href = "mailto:" + BUSINESS.email;
  $("#c-wa").textContent = BUSINESS.whatsappLabel;
  $("#c-wa").href = `https://wa.me/${BUSINESS.whatsapp}`;
  $("#qa-call").href = "tel:" + BUSINESS.mainPhone;
  $("#qa-wa").href = waLink(t("wa"));
  $("#qa-map").href = BUSINESS.maps;
}

mountChrome("contact", render);
render();
