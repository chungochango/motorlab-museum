/* =========================================================
   MUSEO DIGITAL · Consentimiento y política de privacidad
   ---------------------------------------------------------
   Módulo compartido por todas las salas. Al incluirlo:
     · inyecta el banner y el modal de la política,
     · gestiona un ÚNICO consentimiento para todo el museo,
     · lo hace caducar a los 6 meses (vuelve a preguntar),
     · expone window.MuseoConsent para que cada sala sepa si
       puede guardar sus preferencias.

   Almacenamiento (localStorage, con espacio de nombres "museo."):
     museo.consent → { status: "accepted" | "essential", date, version }
     museo.preferencias → modo de lectura común a todas las salas
     museo.<sala>  → preferencias de interfaz de cada sala (p. ej. museo.ferrari-f40)

   Uso en una página:
     <link rel="stylesheet" href="assets/museo-consent.css" />
     <script src="assets/museo-consent.js"></script>
     <button type="button" class="mc-footer-link" data-open-privacy>Privacidad</button>
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Configuración ---------- */
  const CONFIG = {
    // ⚠ Para publicar la web, completa el responsable y un contacto (RGPD, art. 13).
    owner: "César Morán García",
    contact: "moranngrr@gmail.com",
    ttlMonths: 6,
    version: 1,                 // si cambia la política de forma relevante, súbelo: se volverá a preguntar
    bannerDelay: 1200,
  };

  const PREFIX = "museo.";
  const KEY = `${PREFIX}consent`;
  const LEGACY_KEYS = ["f40-cookies", "f40-mode", "f40-color", "f40-point", "f40-part", "f40-views", "f40-hs", "f40-audio"];

  /* ---------- Acceso seguro a localStorage ---------- */
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
    remove(k) { try { localStorage.removeItem(k); } catch { /* sin almacenamiento */ } },
    keys() { try { return Object.keys(localStorage); } catch { return []; } },
  };

  const addMonths = (date, n) => { const d = new Date(date); d.setMonth(d.getMonth() + n); return d; };
  const fmtDate = (d) => new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(d);

  // Borra todas las preferencias del museo (y, si se indica, también el consentimiento)
  function purge(includeConsent) {
    ls.keys().forEach((k) => {
      if (k.startsWith(PREFIX) && (includeConsent || k !== KEY)) ls.remove(k);
    });
  }

  /* ---------- Migración desde las claves antiguas (f40-*) ---------- */
  (function migrate() {
    const old = ls.get("f40-cookies");
    if (old && !ls.get(KEY)) {
      ls.set(KEY, JSON.stringify({ status: old === "accepted" ? "accepted" : "essential", date: new Date().toISOString(), version: CONFIG.version }));
    }
    LEGACY_KEYS.forEach((k) => ls.remove(k));
  })();

  /* ---------- Lectura y validación del consentimiento ---------- */
  function read() {
    let data = null;
    try { data = JSON.parse(ls.get(KEY)); } catch { data = null; }
    const valid = data
      && (data.status === "accepted" || data.status === "essential")
      && data.version === CONFIG.version
      && !Number.isNaN(Date.parse(data.date))
      && new Date() < addMonths(data.date, CONFIG.ttlMonths);
    if (!valid) {
      if (data) purge(true);       // caducado o de otra versión: se borra todo y se vuelve a preguntar
      return null;
    }
    return data;
  }

  let state = read();
  const listeners = new Set();
  const emit = () => {
    listeners.forEach((fn) => { try { fn(api.status()); } catch { /* listener ajeno */ } });
    window.dispatchEvent(new CustomEvent("museo:consent", { detail: { status: api.status() } }));
  };

  /* ---------- API pública ---------- */
  const api = {
    status: () => (state ? state.status : null),
    has: () => Boolean(state && state.status === "accepted"),   // ¿se pueden guardar preferencias?
    expiresAt: () => (state ? addMonths(state.date, CONFIG.ttlMonths) : null),
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    set(status) {
      state = { status, date: new Date().toISOString(), version: CONFIG.version };
      ls.set(KEY, JSON.stringify(state));
      if (status !== "accepted") purge(false);                 // solo esenciales: ninguna preferencia
      ui.paint(); ui.hideBanner(); ui.closeModal();
      emit();
    },
    revoke() {                                                  // retira el consentimiento y borra todo
      purge(true);
      state = null;
      ui.paint(); ui.closeModal(); ui.showBanner();
      emit();
    },
    open: () => ui.openModal(),
  };
  window.MuseoConsent = api;

  /* Una fila por sala, generada desde data/cars.js cuando está cargado (window.MUSEO) */
  const roomStorageRows = () => {
    const cars = ((window.MUSEO && window.MUSEO.cars) || []).filter((c) => c.status !== "coming_soon");   // las salas en desarrollo no guardan nada
    const global = `<li data-mc-room><span>Todo el museo: modo de lectura (Historia o Técnico), el mismo en todas las salas</span><code>${PREFIX}preferencias</code></li>`;
    const rows = cars.map((c, i) =>
      `<li data-mc-room><span>Sala ${String(i + 1).padStart(2, "0")} · ${c.name}: el estado de tu visita (última pieza o sistema consultado, reglaje y, si la sala los tiene, color y audio)</span><code>${PREFIX}${c.id}</code></li>`);
    return global + (rows.length ? rows.join("") : `<li data-mc-room><span>Cada sala: el estado de tu visita</span><code>${PREFIX}&lt;sala&gt;</code></li>`);
  };

  /* ---------- Interfaz (se inyecta al cargar el DOM) ---------- */
  const ICON_CLOSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>';

  const ui = {
    banner: null, modal: null, status: null,

    mount() {
      const banner = document.createElement("section");
      banner.className = "mc-banner";
      banner.setAttribute("role", "region");
      banner.setAttribute("aria-label", "Aviso de almacenamiento local");
      banner.hidden = true;
      banner.innerHTML = `
        <p class="mc-banner__text"><strong>Sin cookies de seguimiento.</strong>
          Si lo aceptas, guardaremos en tu navegador tus preferencias de visualización y audio de cada sala
          para recordarlas durante ${CONFIG.ttlMonths} meses.
          <button type="button" class="mc-link" data-open-privacy>Política de privacidad</button></p>
        <div class="mc-banner__actions">
          <button type="button" class="mc-btn" data-consent="essential">Solo esenciales</button>
          <button type="button" class="mc-btn mc-btn--primary" data-consent="accepted">Aceptar</button>
        </div>`;

      const modal = document.createElement("dialog");
      modal.className = "mc-modal";
      modal.setAttribute("aria-labelledby", "mc-title");
      modal.innerHTML = `
        <article class="mc-card">
          <button type="button" class="mc-close" data-close-privacy aria-label="Cerrar la política de privacidad">${ICON_CLOSE}</button>
          <span class="mc-kicker">Privacidad</span>
          <h2 id="mc-title">Política de privacidad</h2>

          <h3>Responsable</h3>
          <p>Museo digital del automóvil, un proyecto interactivo sin ánimo de lucro de divulgación técnica, sin relación con los fabricantes cuyos modelos se exponen.</p>
          <p>Responsable: ${CONFIG.owner} · Contacto: ${CONFIG.contact}</p>

          <h3>Qué guardamos, dónde y para qué</h3>
          <p>No usamos cookies, analítica ni publicidad, y no enviamos datos a ningún servidor propio. Si pulsas «Aceptar», sólo se guarda en el <code>localStorage</code> de tu navegador, en tu dispositivo:</p>
          <ul data-mc-storage>
            <li><span>Tu elección en este aviso y su fecha (caduca a los ${CONFIG.ttlMonths} meses)</span><code>museo.consent</code></li>
          </ul>
          <p>Con «Solo esenciales» no se guarda ninguna preferencia: únicamente tu elección y su fecha, para no volver a preguntarte hasta que caduque.</p>

          <h3>Base legal y conservación</h3>
          <p>Tu consentimiento (RGPD, art. 6.1.a; LSSI, art. 22.2). Se conserva ${CONFIG.ttlMonths} meses; pasado ese plazo se borra todo y te lo volveremos a preguntar.</p>

          <h3>Servicios de terceros</h3>
          <p>Las tipografías (Inter en todo el museo; Overpass, Overpass Mono y Zen Kaku Gothic New en la sala del R34; Titillium Web y JetBrains Mono en la del P1; Barlow Condensed en la del M3; Saira e IBM Plex Mono en la del GT3 RS) se descargan de Google Fonts, por lo que tu navegador realiza una petición a servidores de Google al cargar cada página.</p>

          <h3>Tus derechos</h3>
          <p>Puedes cambiar o retirar tu consentimiento en cualquier momento desde aquí (también desde el enlace del pie de página) o borrando los datos del sitio en tu navegador.</p>

          <p class="mc-status">Estado: <b data-mc-status>sin elegir</b></p>
          <div class="mc-actions">
            <button type="button" class="mc-btn mc-btn--primary" data-consent="accepted">Aceptar preferencias</button>
            <button type="button" class="mc-btn" data-consent="essential">Solo esenciales</button>
            <button type="button" class="mc-btn" data-revoke>Retirar consentimiento y borrar datos</button>
          </div>
        </article>`;

      document.body.append(banner, modal);
      this.banner = banner;
      this.modal = modal;
      this.status = modal.querySelector("[data-mc-status]");

      // Delegación: funciona también con enlaces de la página (data-open-privacy)
      document.addEventListener("click", (e) => {
        const t = e.target.closest("[data-open-privacy], [data-close-privacy], [data-consent], [data-revoke]");
        if (!t) return;
        if (t.matches("[data-open-privacy]")) this.openModal();
        else if (t.matches("[data-close-privacy]")) this.closeModal();
        else if (t.matches("[data-consent]")) api.set(t.dataset.consent);
        else if (t.matches("[data-revoke]")) api.revoke();
      });
      modal.addEventListener("click", (e) => { if (e.target === modal) this.closeModal(); });   // clic fuera de la tarjeta

      this.paint();
      if (!state) setTimeout(() => this.showBanner(), CONFIG.bannerDelay);
    },

    paint() {
      if (!this.status) return;
      if (!state) { this.status.textContent = "sin elegir"; return; }
      const until = fmtDate(api.expiresAt());
      this.status.textContent = state.status === "accepted"
        ? `preferencias aceptadas · válido hasta el ${until}`
        : `solo esenciales · válido hasta el ${until}`;
    },

    showBanner() {
      if (!this.banner || state) return;
      this.banner.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => this.banner.classList.add("is-visible")));
    },

    hideBanner() {
      const b = this.banner;
      if (!b || b.hidden) return;
      b.classList.remove("is-visible");
      const done = () => { b.hidden = true; };
      b.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 800);
    },

    openModal() {
      if (!this.modal || this.modal.open) return;
      // Las salas se listan al abrir: los datos del museo pueden llegar después de montar el aviso
      const list = this.modal.querySelector("[data-mc-storage]");
      list.querySelectorAll("[data-mc-room]").forEach((li) => li.remove());
      list.insertAdjacentHTML("beforeend", roomStorageRows());
      this.paint(); this.modal.showModal();
    },
    closeModal() { if (this.modal && this.modal.open) this.modal.close(); },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => ui.mount(), { once: true });
  else ui.mount();
})();
