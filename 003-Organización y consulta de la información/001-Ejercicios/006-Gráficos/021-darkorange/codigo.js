let tablaActual = "";
let cambioVista = 0;

function marcarMenu(tabla = "") {
  document.querySelectorAll("#entidades a").forEach(a => a.classList.toggle("activo", a.dataset.tabla === tabla));
  document.querySelector("#boton-dashboard").classList.toggle("activo", !tabla && document.querySelector("section").dataset.vista === "dashboard");
  document.querySelector("#boton-reporting").classList.toggle("activo", document.querySelector("section").dataset.vista === "reporting");
}

function mostrarDashboard() {
  ++cambioVista;
  tablaActual = "";
  document.querySelector("section").dataset.vista = "dashboard";
  document.querySelector("section").scrollTop = 0;
  new DarkorangeDashboard({
    contenedor: "section",
    irAEntidad: cargarEntidad,
    irAReporting: mostrarReporting
  }).render();
  marcarMenu();
}

function mostrarReporting() {
  ++cambioVista;
  tablaActual = "";
  document.querySelector("section").dataset.vista = "reporting";
  document.querySelector("section").scrollTop = 0;
  marcarMenu();
  new DarkorangeReporting({contenedor: "section"}).render();
}

fetch("data/config.php")
  .then(r => r.json())
  .then(datos => {
    document.querySelector("h1").textContent = datos.nombre;
    document.documentElement.style.setProperty("--color_corporativo", datos.color);
  })
  .catch(() => {});

fetch("api/superapi.php?ruta=modulos")
  .then(r => r.json())
  .then(datos => {
    const menu = document.querySelector("#modulos");
    datos.forEach(dato => {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = dato;
      a.addEventListener("click", evento => evento.preventDefault());
      menu.appendChild(a);
    });
  })
  .catch(() => {});

fetch("api/superapi.php?ruta=entidades")
  .then(r => r.json())
  .then(datos => {
    const menu = document.querySelector("#entidades");
    datos.forEach(tabla => {
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.tabla = tabla;
      a.textContent = tabla;
      a.onclick = evento => {
        evento.preventDefault();
        cargarEntidad(tabla);
      };
      menu.appendChild(a);
    });
    marcarMenu(tablaActual);
  })
  .catch(() => {
    document.querySelector("#entidades").textContent = "No se pudieron cargar las entidades.";
  });

async function cargarEntidad(tabla) {
  tablaActual = tabla;
  const peticion = ++cambioVista;
  const seccion = document.querySelector("section");
  seccion.dataset.vista = "entidad";
  seccion.scrollTop = 0;
  seccion.innerHTML = '<div class="vacio">Cargando entidad…</div>';
  marcarMenu(tabla);

  let datos;
  try {
    const respuesta = await fetch("api/superapi.php?ruta=tabla&tabla=" + encodeURIComponent(tabla));
    if (!respuesta.ok) throw new Error("No se pudo consultar la entidad");
    datos = await respuesta.json();
  } catch (error) {
    if (peticion === cambioVista) seccion.textContent = "Error al cargar " + tabla + ": " + error.message;
    return;
  }
  if (peticion !== cambioVista) return;

  seccion.innerHTML = `
    <div class="barra">
      <div><small>ENTIDAD</small><h2></h2></div>
    </div>
    <div id="zona-formulario"></div>
    <div id="zona-tabla"></div>
  `;
  seccion.querySelector("h2").textContent = tabla;

  new DarkorangeFormulario({
    contenedor: "#zona-formulario",
    tabla,
    columnas: datos.columnas,
    alGuardar: () => cargarEntidad(tabla)
  }).render();

  new DarkorangeTabla({
    contenedor: "#zona-tabla",
    tabla,
    columnas: datos.columnas,
    registros: datos.registros
  }).render();
}

document.querySelector("#boton-dashboard").onclick = mostrarDashboard;
document.querySelector("#boton-reporting").onclick = mostrarReporting;
// Renderizado inmediato: no espera a que la API termine de responder.
mostrarDashboard();
