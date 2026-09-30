// ===== Reservas (vista de muestra) =====
// Todo el formulario funciona; sólo falta conectar submitReservation()
// con el panel de administración (Convex) cuando esté listo.

// ----- Prefijo de teléfono con banderas -----
let prefix = PHONE_CODES[0];
function renderCC() {
  const other = prefix === "other";
  $("#cc-btn").innerHTML = other
    ? `<span class="cc-flag">${FLAGS.globe}</span><span>${t("phoneOther")}</span><i>▾</i>`
    : `<span class="cc-flag">${FLAGS[prefix.flag]}</span><span>${prefix.code}</span><i>▾</i>`;
  $("#cc-custom").hidden = !other;
  $("#cc-picker").classList.toggle("is-other", other);
  $("#cc-menu").innerHTML = PHONE_CODES.map((p, i) => `
    <li role="option" data-i="${i}" aria-selected="${prefix === p}" class="${prefix === p ? "on" : ""}">
      <span class="cc-flag">${FLAGS[p.flag]}</span><span class="cc-name">${p.name}</span><b>${p.code}</b></li>`).join("") +
    `<li role="option" data-i="other" class="${other ? "on" : ""}"><span class="cc-flag">${FLAGS.globe}</span><span class="cc-name">${t("phoneOther")}</span><b>+…</b></li>`;
}
$("#cc-btn").addEventListener("click", () => $("#cc-picker").classList.toggle("open"));
$("#cc-menu").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  prefix = li.dataset.i === "other" ? "other" : PHONE_CODES[+li.dataset.i];
  $("#cc-picker").classList.remove("open");
  renderCC();
  if (prefix === "other") $("#cc-custom").focus();
  clearError("phone");
});
$("#cc-custom").addEventListener("input", (e) => { e.target.value = "+" + e.target.value.replace(/\D/g, "").slice(0, 4); });
document.addEventListener("click", (e) => { if (!$("#cc-picker").contains(e.target)) $("#cc-picker").classList.remove("open"); });
const dialCode = () => (prefix === "other" ? $("#cc-custom").value.trim() : prefix.code);

const state = { people: 2, date: null, shift: null, time: null, reason: null };
const DAYS_AHEAD = 21;

const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const toHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const loc = () => LANGS.find((l) => l.id === lang).locale;

// Fecha de hoy en Buenos Aires (YYYY-MM-DD)
function todayBA() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());
}
function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
const weekday = (iso) => new Date(iso + "T12:00:00").getDay();

// ----- Render -----
function renderPeople() {
  $("#p-out").innerHTML = `${state.people}<small>${t("resPeople").toLowerCase()}</small>`;
  $("#p-minus").disabled = state.people <= 1;
  $("#p-plus").disabled = state.people >= RESERVATIONS.maxPeople;
  $("#p-hint").innerHTML = state.people >= RESERVATIONS.maxPeople
    ? `${t("resMax").replace("{max}", RESERVATIONS.maxPeople)} <a href="${waLink(t("wa"))}" target="_blank" rel="noopener">WhatsApp →</a>`
    : "";
}

function renderDays() {
  const today = todayBA();
  let html = "";
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const iso = addDays(today, i);
    const d = new Date(iso + "T12:00:00");
    const closed = !BUSINESS.openDays.includes(weekday(iso));
    const top = i === 0 ? t("today") : d.toLocaleDateString(loc(), { weekday: "short" });
    html += `<button type="button" class="day ${state.date === iso ? "on" : ""}" data-date="${iso}" ${closed ? "disabled title='" + t("resMonday") + "'" : ""}>
      <small>${top}</small><b>${d.getDate()}</b><span>${d.toLocaleDateString(loc(), { month: "short" })}</span></button>`;
  }
  $("#days").innerHTML = html;
}

function renderShifts() {
  $("#shifts").innerHTML = RESERVATIONS.shifts.map((s) =>
    `<button type="button" class="chip ${state.shift === s.id ? "on" : ""}" data-shift="${s.id}">${s.name[lang]}</button>`
  ).join("");
}

function slotsFor(shiftId) {
  const s = RESERVATIONS.shifts.find((x) => x.id === shiftId);
  if (!s) return [];
  const out = [];
  for (let m = toMin(s.from); m <= toMin(s.to); m += RESERVATIONS.slotMinutes) out.push(toHHMM(m));
  return out;
}

function renderTimes() {
  const { hour, minute } = nowBA();
  const isToday = state.date === todayBA();
  const nowMin = hour * 60 + minute + 60; // mínimo 1 h de anticipación
  const slots = slotsFor(state.shift);
  // Sin turno elegido: se explica qué hacer. Hoy sin horarios libres: se avisa.
  const allPast = isToday && slots.length > 0 && slots.every((s) => toMin(s) < nowMin);
  $("#times").innerHTML = slots.length
    ? slots.map((s) => {
        const past = isToday && toMin(s) < nowMin;
        return `<button type="button" class="chip ${state.time === s ? "on" : ""}" data-time="${s}" ${past ? "disabled" : ""}>${s}</button>`;
      }).join("") + (allPast ? `<p class="hint">${t("resNoSlots")}</p>` : "")
    : `<p class="hint">${t("resPickShift")}</p>`;
}

function renderReasons() {
  $("#reasons").innerHTML = RESERVATIONS.reasons[lang].map((r, i) =>
    `<button type="button" class="chip ${state.reason === i ? "on" : ""}" data-reason="${i}">${r}</button>`
  ).join("");
}

function summaryText() {
  const date = state.date
    ? new Date(state.date + "T12:00:00").toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" })
    : "—";
  return `${ICONS.calendar}<span><b>${state.people}</b> ${t("resPeople").toLowerCase()} · <b>${date}</b>${state.time ? ` · <b>${state.time} h</b>` : ""}</span>`;
}
function renderSummary() { $("#summary").innerHTML = summaryText(); }

function renderAll() {
  applyTexts();
  $("#f-notes").placeholder = t("resNotesPh");
  renderCC(); renderPeople(); renderDays(); renderShifts(); renderTimes(); renderReasons(); renderSummary();
}

// ----- Eventos -----
$("#p-minus").onclick = () => { state.people = Math.max(1, state.people - 1); renderPeople(); renderSummary(); };
$("#p-plus").onclick = () => { state.people = Math.min(RESERVATIONS.maxPeople, state.people + 1); renderPeople(); renderSummary(); };

$("#days").onclick = (e) => {
  const b = e.target.closest("[data-date]");
  if (!b || b.disabled) return;
  state.date = b.dataset.date; state.time = null;
  renderDays(); renderTimes(); renderSummary(); clearError("date");
};
$("#shifts").onclick = (e) => {
  const b = e.target.closest("[data-shift]");
  if (!b) return;
  state.shift = b.dataset.shift; state.time = null;
  renderShifts(); renderTimes(); renderSummary(); clearError("shift");
};
$("#times").onclick = (e) => {
  const b = e.target.closest("[data-time]");
  if (!b || b.disabled) return;
  state.time = b.dataset.time;
  renderTimes(); renderSummary(); clearError("time");
};
$("#reasons").onclick = (e) => {
  const b = e.target.closest("[data-reason]");
  if (!b) return;
  state.reason = +b.dataset.reason;
  renderReasons(); clearError("reason");
};
$$(".input").forEach((i) => i.addEventListener("input", () => clearError(i.name)));

function clearError(f) { $(`.field[data-f="${f}"]`)?.classList.remove("error"); $("#form-error").textContent = ""; }

// ----- Envío -----
// Por ahora la reserva se manda por WhatsApp al local (como el pedido).
// TODO (admin): cuando esté el panel, sumar la llamada a Convex, por ejemplo:
//   await convex.mutation(api.reservations.create, data)
// Mensaje con etiquetas fijas en español para que sea fácil de leer en el local.
function reservationMessage(data) {
  const date = new Date(data.date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const shift = RESERVATIONS.shifts.find((s) => s.id === data.shift);
  const lines = ["*RESERVA WEB · Pizzería Los Campeones*", ""];
  lines.push(`Nombre: ${data.name}`);
  lines.push(`Teléfono: ${data.phone}`);
  lines.push(`Personas: ${data.people}`);
  lines.push(`Fecha: ${date}`);
  lines.push(`Horario: ${data.time} h${shift ? ` (${shift.name.es})` : ""}`);
  lines.push(`Motivo: ${data.reason}`);
  if (data.notes) lines.push(`Comentarios: ${data.notes}`);
  return lines.join("\n");
}

// Se abre WhatsApp antes de cualquier "await" para que el navegador no lo bloquee.
async function submitReservation(data) {
  const link = waLink(reservationMessage(data));
  const win = window.open(link, "_blank");
  if (win) win.opener = null;
  else location.href = link; // si el navegador bloqueó la ventana nueva
  return { ok: true };
}

$("#res-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#f-name").value.trim();
  const phone = $("#f-phone").value.replace(/\D/g, "");
  const missing = [];
  if (!name) missing.push("name");
  if (phone.length < 6 || dialCode().replace(/\D/g, "").length < 1) missing.push("phone");
  if (!state.date) missing.push("date");
  if (!state.shift) missing.push("shift");
  if (!state.time) missing.push("time");
  if (state.reason === null) missing.push("reason");
  if (missing.length) {
    missing.forEach((f) => $(`.field[data-f="${f}"]`).classList.add("error"));
    $("#form-error").textContent = t("resRequired");
    $(`.field[data-f="${missing[0]}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const data = {
    name, phone: dialCode() + phone, people: state.people, date: state.date, time: state.time,
    shift: state.shift, reason: RESERVATIONS.reasons.es[state.reason], notes: $("#f-notes").value.trim(), lang,
    createdAt: new Date().toISOString(), status: "pendiente",
  };
  const res = await submitReservation(data);
  if (res.ok) {
    $("#done-summary").innerHTML = summaryText();
    $("#res-form").style.display = "none";
    $("#res-done").classList.add("show");
    scrollTo({ top: 0, behavior: "smooth" });
  }
});

$("#res-again").onclick = () => {
  $("#res-done").classList.remove("show");
  $("#res-form").style.display = "";
  $("#res-form").reset();
  Object.assign(state, { people: 2, date: null, shift: null, time: null, reason: null });
  renderAll();
};

mountChrome("book", renderAll);
renderAll();
