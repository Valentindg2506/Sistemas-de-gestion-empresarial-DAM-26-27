// La web comparte la configuración de marca con la aplicación.
fetch("../data/config.php", {cache:"no-store"})
  .then(respuesta => {
    if (!respuesta.ok) throw new Error("No se pudo leer la configuración.");
    return respuesta.json();
  })
  .then(datos => {
    document.querySelectorAll("[data-nombre]").forEach(elemento => { elemento.textContent = datos.nombre; });
    document.title = datos.nombre + " · Un lugar para cada dato";
    document.documentElement.style.setProperty("--color_corporativo", datos.color);
  })
  .catch(() => { /* La marca inicial sigue visible si no responde PHP. */ });

// Los enlaces del menú señalan la sección que se está consultando.
const seccionesWeb = ["presentacion", "funciones", "estructura", "empezar"];
function marcarSeccionWeb(nombre) {
  document.querySelectorAll("[data-seccion]").forEach(enlace => {
    const activo = enlace.dataset.seccion === nombre;
    enlace.classList.toggle("activo", activo);
    if (activo) enlace.setAttribute("aria-current", "location");
    else enlace.removeAttribute("aria-current");
  });
}
let scrollWebPendiente = false;
function actualizarSeccionWeb() {
  let nombre = "presentacion";
  seccionesWeb.forEach(id => {
    if (document.getElementById(id).getBoundingClientRect().top <= window.innerHeight * .35) nombre = id;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) nombre = "empezar";
  marcarSeccionWeb(nombre);
  scrollWebPendiente = false;
}
window.addEventListener("scroll", () => {
  if (!scrollWebPendiente) {
    scrollWebPendiente = true;
    requestAnimationFrame(actualizarSeccionWeb);
  }
}, {passive:true});
window.addEventListener("resize", actualizarSeccionWeb);
actualizarSeccionWeb();
