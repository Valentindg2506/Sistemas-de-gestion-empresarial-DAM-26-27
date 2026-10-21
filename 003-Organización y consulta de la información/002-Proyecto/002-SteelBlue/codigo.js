// Coordino las vistas; los componentes reutilizables están en nucleo/.
let tablaActual = "";
let peticionActual = 0;
let registroPendiente = null;
let temporizadorMensaje = null;
const contenido = document.querySelector("#contenido");
const confirmacion = document.querySelector("#confirmacion");

const nombres = {
  clientes: "Clientes", productos: "Productos", empleados: "Empleados",
  proveedores: "Proveedores", componentes: "Componentes", pedidos: "Pedidos",
  lineaspedido: "Líneas de pedido", ventas: "Ventas", rrhh: "RR. HH.",
  facturacion: "Facturación", compras: "Compras"
};
const campos = {
  nombre: "Nombre", apellidos: "Apellidos", pais: "País", telefono: "Teléfono",
  email: "Correo electrónico", tipo: "Tipo", precio: "Precio", capacidad: "Capacidad",
  autonomia: "Autonomía", departamento: "Departamento", puesto: "Puesto",
  salario: "Salario", especialidad: "Especialidad", fecha: "Fecha", estado: "Estado",
  cliente_id: "ID del cliente", pedido_id: "ID del pedido", producto_id: "ID del producto",
  proveedor_id: "ID del proveedor", total: "Total", cantidad: "Cantidad",
  precio_unitario: "Precio unitario", stock: "Stock", identificador: "ID", id: "ID"
};

function nombreLegible(nombre) {
  return nombres[nombre] || campos[nombre] || String(nombre).replaceAll("_", " ");
}

async function leerRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok || datos.error) throw new Error(datos.error || "No se pudo completar la petición.");
  return datos;
}

function mostrarMensaje(texto, tipo = "exito") {
  const mensaje = document.querySelector("#mensaje");
  clearTimeout(temporizadorMensaje);
  document.querySelector("#texto-mensaje").textContent = texto;
  mensaje.className = "mensaje " + tipo;
  mensaje.hidden = false;
  if (tipo !== "error") temporizadorMensaje = setTimeout(() => { mensaje.hidden = true; }, 6500);
}

function mostrarError(error) {
  mostrarMensaje(error.message || "No se pudo conectar con el servidor.", "error");
}

function marcarMenu() {
  const vista = contenido.dataset.vista;
  document.querySelector("#inicio").classList.toggle("activo", vista === "dashboard");
  document.querySelector("#boton-reporting").classList.toggle("activo", vista === "reporting");
  document.querySelectorAll("#entidades a").forEach(enlace => {
    const seleccionado = enlace.dataset.tabla === tablaActual;
    enlace.classList.toggle("activo", seleccionado);
    if (seleccionado) enlace.setAttribute("aria-current", "page");
    else enlace.removeAttribute("aria-current");
  });
  SteelBlueInterfaz.marcarVista(vista);
}

function cambiarVista(vista, tabla = "") {
  tablaActual = tabla;
  contenido.dataset.vista = vista;
  clearTimeout(temporizadorMensaje);
  document.querySelector("#mensaje").hidden = true;
  document.querySelector("#grafica-tooltip")?.style.setProperty("display", "none");
  marcarMenu();
  return ++peticionActual;
}

function mostrarCarga() {
  contenido.innerHTML = '<div class="cargando" role="status"><span class="indicador-carga"></span>Cargando datos…</div>';
}

function mostrarDashboard() {
  cambiarVista("dashboard");
  new SteelBlueDashboard({contenedor: contenido, irAEntidad: cargarTabla, irAReporting: mostrarReporting}).render();
}

function mostrarReporting() {
  const peticion = cambiarVista("reporting");
  new SteelBlueReporting({contenedor: contenido, esActual: () => peticion === peticionActual}).render();
}

async function cargarTabla(tabla, mensaje = "") {
  const peticion = cambiarVista("entidad", tabla);
  mostrarCarga();
  try {
    const datos = await fetch("api/superapi.php?ruta=tabla&tabla=" + encodeURIComponent(tabla)).then(leerRespuesta);
    if (peticion !== peticionActual) return;
    new SteelBlueTabla({contenedor: contenido, ...datos}).render();
    if (mensaje) mostrarMensaje(mensaje);
  } catch (error) {
    if (peticion !== peticionActual) return;
    contenido.innerHTML = '<div class="vacio"><h2>No se pudo cargar la tabla</h2><p>Comprueba la conexión y vuelve a intentarlo.</p><button class="boton" data-accion="recargar" type="button">Volver a intentar</button></div>';
    mostrarError(error);
  }
}

async function mostrarFormulario(tabla, id = null) {
  const peticion = cambiarVista("formulario", tabla);
  mostrarCarga();
  try {
    const [estructura, datos] = await Promise.all([
      fetch("api/superapi.php?ruta=estructura&tabla=" + encodeURIComponent(tabla)).then(leerRespuesta),
      id === null ? Promise.resolve({registro: {}}) : fetch("api/superapi.php?ruta=registro&tabla=" + encodeURIComponent(tabla) + "&id=" + encodeURIComponent(id)).then(leerRespuesta)
    ]);
    if (peticion !== peticionActual) return;
    new SteelBlueFormulario({
      contenedor: contenido, tabla, columnas: estructura.columnas, registro: datos.registro, id,
      esActual: () => peticion === peticionActual,
      alGuardar: () => cargarTabla(tabla, id === null ? "Registro creado correctamente." : "Cambios guardados correctamente.")
    }).render();
  } catch (error) {
    if (peticion !== peticionActual) return;
    cargarTabla(tabla);
    mostrarError(error);
  }
}

function eliminarRegistro(tabla, id) {
  registroPendiente = {tabla, id, peticion: peticionActual};
  document.querySelector("#detalle-confirmacion").textContent = "Vas a eliminar el registro " + id + " de " + nombreLegible(tabla) + ".";
  confirmacion.returnValue = "cancelar";
  confirmacion.showModal();
}

confirmacion.addEventListener("close", async () => {
  const registro = registroPendiente;
  registroPendiente = null;
  if (confirmacion.returnValue !== "eliminar" || registro === null) return;
  const datos = new FormData();
  datos.append("tabla", registro.tabla);
  datos.append("id", registro.id);
  try {
    await fetch("api/superapi.php?ruta=eliminar", {method: "POST", body: datos}).then(leerRespuesta);
    if (registro.peticion === peticionActual) cargarTabla(registro.tabla, "Registro eliminado correctamente.");
  } catch (error) {
    if (registro.peticion === peticionActual) mostrarError(error);
  }
});

contenido.addEventListener("click", evento => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  switch (boton.dataset.accion) {
    case "crear": mostrarFormulario(tablaActual); break;
    case "editar": mostrarFormulario(tablaActual, boton.dataset.id); break;
    case "eliminar": eliminarRegistro(tablaActual, boton.dataset.id); break;
    case "recargar": cargarTabla(tablaActual); break;
  }
});

fetch("data/config.php", {cache: "no-store"}).then(leerRespuesta).then(datos => {
  document.querySelectorAll("[data-nombre]").forEach(elemento => { elemento.textContent = datos.nombre; });
  document.title = datos.nombre + " · Gestión empresarial";
  document.querySelector(".marca").setAttribute("aria-label", "Web de " + datos.nombre);
  document.documentElement.style.setProperty("--color_corporativo", datos.color);
}).catch(mostrarError);

fetch("api/superapi.php?ruta=modulos").then(leerRespuesta).then(datos => {
  const menu = document.querySelector("#modulos");
  datos.forEach(modulo => {
    const elemento = document.createElement("div");
    elemento.className = "modulo-previsto";
    const nombre = document.createElement("span");
    nombre.textContent = nombreLegible(modulo);
    const estado = document.createElement("span");
    estado.className = "estado-modulo";
    estado.textContent = "Próximamente";
    elemento.append(nombre, estado);
    menu.appendChild(elemento);
  });
}).catch(mostrarError);

fetch("api/superapi.php?ruta=entidades").then(leerRespuesta).then(datos => {
  const menu = document.querySelector("#entidades");
  menu.replaceChildren();
  datos.forEach(tabla => {
    const enlace = document.createElement("a");
    enlace.href = "#contenido";
    enlace.dataset.tabla = tabla;
    enlace.setAttribute("aria-label", nombreLegible(tabla));
    enlace.title = nombreLegible(tabla);
    const icono = document.createElement("span");
    icono.className = "icono-entidad";
    icono.setAttribute("aria-hidden", "true");
    const iconos = {clientes:"users", productos:"box", empleados:"briefcase", proveedores:"truck", componentes:"layers", pedidos:"clipboard", lineaspedido:"list"};
    icono.innerHTML = SteelBlueInterfaz.icono(iconos[tabla] || "box");
    const texto = document.createElement("span");
    texto.className = "nombre-entidad";
    texto.textContent = nombreLegible(tabla);
    enlace.append(icono, texto);
    enlace.onclick = evento => { evento.preventDefault(); cargarTabla(tabla); };
    menu.appendChild(enlace);
  });
  if (!datos.length) menu.textContent = "No hay entidades. Abre el instalador para crear las tablas.";
  marcarMenu();
}).catch(error => {
  document.querySelector("#entidades").textContent = "No se pudieron cargar las entidades. Comprueba el servidor o abre el instalador.";
  mostrarError(error);
});

document.querySelector("#inicio").onclick = mostrarDashboard;
document.querySelector("#boton-reporting").onclick = mostrarReporting;
document.querySelector("#cerrar-mensaje").onclick = () => { document.querySelector("#mensaje").hidden = true; };
mostrarDashboard();
