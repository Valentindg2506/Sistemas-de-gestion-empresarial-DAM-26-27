/** Apariencia y navegación: no modifica los datos ni reconstruye las vistas. */
class SteelBlueInterfaz {
  static clave = "steelblue-tema";

  static dibujos = {
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m4 9v-2a6 6 0 0 0-4-5.7"/>',
    box:'<path d="m12 3 9 5v8l-9 5-9-5V8Zm0 0v18M3 8l9 5 9-5M7.5 5.5l9 5"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a21 21 0 0 0 18 0M12 11v3"/>',
    truck:'<path d="M2 5h12v12H2Zm12 5h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    clipboard:'<rect x="4" y="4" width="16" height="18" rx="2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 11h8M8 16h5"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
    chart:'<path d="M5 20v-7m7 7V4m7 16v-11"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 18v-5m4 5v-8m4 8v-3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',
    wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    moon:'<path d="M20.6 13.2A8.6 8.6 0 0 1 10.8 3.4 8.8 8.8 0 1 0 20.6 13.2Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    external:'<path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    arrow:'<path d="M5 12h14m-7-7 7 7-7 7"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>'
  };

  static icono(nombre) {
    return '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (this.dibujos[nombre] || this.dibujos.box) + '</svg>';
  }

  static aplicarTema(tema) {
    const oscuro = tema === "dark";
    document.documentElement.dataset.theme = oscuro ? "dark" : "light";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = oscuro ? "#121116" : "#f7f6f8";
    document.querySelectorAll("[data-tema]").forEach(boton => {
      boton.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
      boton.setAttribute("title", oscuro ? "Activar modo claro" : "Activar modo oscuro");
      boton.setAttribute("aria-pressed", String(oscuro));
      boton.innerHTML = this.icono(oscuro ? "sun" : "moon");
    });
  }

  static marcarVista(vista) {
    document.querySelector("#boton-entidades")?.classList.toggle("activo", vista === "entidad" || vista === "formulario");
    document.querySelectorAll(".navegacion-movil [data-vista]").forEach(boton => {
      const activo = boton.dataset.vista === vista || boton.dataset.vista === "entidades" && ["entidad", "formulario"].includes(vista);
      boton.classList.toggle("activo", activo);
      if (activo) boton.setAttribute("aria-current", "page");
      else boton.removeAttribute("aria-current");
    });
    document.querySelectorAll(".navegacion-vistas button").forEach(boton => {
      if (boton.classList.contains("activo")) boton.setAttribute("aria-current", "page");
      else boton.removeAttribute("aria-current");
    });
  }

  static abrirPanel(nombre, boton) {
    const panel = document.getElementById("panel-" + nombre);
    if (!panel || panel.open) return;
    if (nombre === "entidades") {
      const enlaces = [...document.querySelectorAll("#entidades a")];
      const lista = panel.querySelector(".panel-lista");
      lista.replaceChildren(...enlaces.map(enlace => {
        const copia = enlace.cloneNode(true);
        copia.onclick = evento => { evento.preventDefault(); panel.close(); enlace.click(); };
        return copia;
      }));
      if (!enlaces.length) lista.textContent = document.querySelector("#entidades").textContent;
    }
    boton?.setAttribute("aria-expanded", "true");
    panel.addEventListener("close", () => {
      document.body.classList.remove("panel-abierto");
      boton?.setAttribute("aria-expanded", "false");
    }, {once:true});
    document.body.classList.add("panel-abierto");
    panel.showModal();
  }
}

// Se carga en la cabecera para recuperar el tema antes de mostrar la página.
let temaSteelBlue = "light";
try { if (localStorage.getItem(SteelBlueInterfaz.clave) === "dark") temaSteelBlue = "dark"; } catch {}
SteelBlueInterfaz.aplicarTema(temaSteelBlue);
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-icono]").forEach(elemento => { elemento.innerHTML = SteelBlueInterfaz.icono(elemento.dataset.icono); });
  SteelBlueInterfaz.aplicarTema(document.documentElement.dataset.theme);
  document.querySelectorAll("dialog[data-panel-dialogo]").forEach(panel => {
    panel.addEventListener("click", evento => { if (evento.target === panel) panel.close(); });
  });
});
document.addEventListener("click", evento => {
  const botonTema = evento.target.closest("[data-tema]");
  if (botonTema) {
    const tema = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(SteelBlueInterfaz.clave, tema); } catch {}
    SteelBlueInterfaz.aplicarTema(tema);
  }
  const botonPanel = evento.target.closest("[data-panel]");
  if (botonPanel) SteelBlueInterfaz.abrirPanel(botonPanel.dataset.panel, botonPanel);
  const cerrar = evento.target.closest("[data-cerrar-panel]");
  if (cerrar) cerrar.closest("dialog").close();
  const vista = evento.target.closest(".navegacion-movil [data-vista]");
  if (vista?.dataset.vista === "dashboard") document.querySelector("#inicio").click();
  if (vista?.dataset.vista === "reporting") document.querySelector("#boton-reporting").click();
});
window.addEventListener("storage", evento => {
  if (evento.key === SteelBlueInterfaz.clave) SteelBlueInterfaz.aplicarTema(evento.newValue);
});
