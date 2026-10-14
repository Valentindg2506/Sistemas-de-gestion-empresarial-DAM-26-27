// Guardo la entidad seleccionada y un contador para descartar respuestas antiguas.
let tablaActual = ""
let entidades = []
let peticionActual = 0
let registroPendiente = null
let temporizadorMensaje = null
let contenido = document.querySelector("#contenido")
let confirmacion = document.querySelector("#confirmacion")

let nombres = {
	clientes: "Clientes", productos: "Productos", empleados: "Empleados",
	proveedores: "Proveedores", componentes: "Componentes", pedidos: "Pedidos",
	lineaspedido: "Líneas de pedido", ventas: "Ventas", rrhh: "RR. HH.",
	facturacion: "Facturación", compras: "Compras"
}

let campos = {
	nombre: "Nombre", apellidos: "Apellidos", pais: "País", telefono: "Teléfono",
	email: "Correo electrónico", tipo: "Tipo", precio: "Precio", capacidad: "Capacidad",
	autonomia: "Autonomía", departamento: "Departamento", puesto: "Puesto",
	salario: "Salario", especialidad: "Especialidad", fecha: "Fecha", estado: "Estado",
	cliente_id: "ID del cliente", pedido_id: "ID del pedido", producto_id: "ID del producto",
	proveedor_id: "ID del proveedor", total: "Total", cantidad: "Cantidad",
	precio_unitario: "Precio unitario", stock: "Stock", identificador: "ID", id: "ID"
}

let descripciones = {
	clientes: "Contactos y datos comerciales", productos: "Catálogo y características",
	empleados: "Personal y departamentos", proveedores: "Contactos de suministro",
	componentes: "Piezas, proveedores y existencias", pedidos: "Registros y clientes asociados",
	lineaspedido: "Productos y cantidades de cada pedido"
}

function nombreLegible(nombre){
	return nombres[nombre] || campos[nombre] || nombre.replaceAll("_", " ")
}

// Antes de pintar datos compruebo también los errores enviados por PHP.
function leerRespuesta(respuesta){
	return respuesta.json().then(function(datos){
		if(!respuesta.ok || datos.error){
			throw new Error(datos.error || "No se pudo completar la petición.")
		}
		return datos
	})
}

function mostrarMensaje(texto, tipo){
	let mensaje = document.querySelector("#mensaje")
	clearTimeout(temporizadorMensaje)
	document.querySelector("#texto-mensaje").textContent = texto
	mensaje.className = "mensaje " + (tipo || "exito")
	mensaje.hidden = false
	if(tipo != "error"){
		temporizadorMensaje = setTimeout(function(){ mensaje.hidden = true }, 6500)
	}
}

function mostrarError(error){
	mostrarMensaje(error.message || "No se pudo conectar con el servidor.", "error")
}

function seleccionarEntidad(tabla){
	tablaActual = tabla
	document.querySelector("#inicio").classList.toggle("activo", tabla == "")
	document.querySelectorAll("#entidades a").forEach(function(enlace){
		let seleccionado = enlace.dataset.tabla == tabla
		enlace.classList.toggle("activo", seleccionado)
		if(seleccionado){ enlace.setAttribute("aria-current", "page") }
		else{ enlace.removeAttribute("aria-current") }
	})
}

function mostrarCarga(){
	contenido.innerHTML = "<div class='cargando' role='status'><span class='indicador-carga'></span>Cargando datos…</div>"
}

// La configuración cambia tanto el nombre visible como la variable CSS.
fetch("data/config.php", {cache: "no-store"})
.then(leerRespuesta)
.then(function(datos){
	document.querySelectorAll("[data-nombre]").forEach(function(elemento){ elemento.textContent = datos.nombre })
	document.title = datos.nombre + " · Gestión empresarial"
	document.querySelector(".marca").setAttribute("aria-label", "Web de " + datos.nombre)
	document.documentElement.style.setProperty("--color_corporativo", datos.color)
})
.catch(mostrarError)

fetch("api/superapi.php?ruta=modulos")
.then(leerRespuesta)
.then(function(datos){
	let menu = document.querySelector("#modulos")
	datos.forEach(function(modulo){
		let elemento = document.createElement("div")
		elemento.className = "modulo-previsto"
		elemento.innerHTML = "<span>" + escapeHTML(nombreLegible(modulo)) + "</span><span class='estado-modulo'>Próximamente</span>"
		menu.appendChild(elemento)
	})
})
.catch(mostrarError)

fetch("api/superapi.php?ruta=entidades")
.then(leerRespuesta)
.then(function(datos){
	entidades = datos
	let menu = document.querySelector("#entidades")
	menu.innerHTML = ""
	datos.forEach(function(tabla){
		let enlace = document.createElement("a")
		enlace.href = "#contenido"
		enlace.dataset.tabla = tabla
		enlace.innerHTML = "<span class='icono-entidad' aria-hidden='true'>" + escapeHTML(nombreLegible(tabla).slice(0, 1)) + "</span><span>" + escapeHTML(nombreLegible(tabla)) + "</span>"
		enlace.onclick = function(evento){
			evento.preventDefault()
			cargarTabla(tabla)
		}
		menu.appendChild(enlace)
	})
	pintarInicio()
})
.catch(function(error){
	document.querySelector("#entidades").innerHTML = "<p class='texto-menu'>No se pudieron cargar las entidades.</p>"
	contenido.innerHTML = "<div class='vacio'><span class='etiqueta'>PUESTA EN MARCHA</span><h2>Prepara tu base de datos</h2><p>No se han podido cargar los datos. Comprueba el servidor o abre el instalador.</p><a class='boton' href='instalador.html'>Abrir el instalador →</a></div>"
	mostrarError(error)
})

function pintarInicio(){
	peticionActual++
	seleccionarEntidad("")
	let cadena = "<div class='cabecera-pagina'><div><p class='etiqueta'>VISTA GENERAL / UNIDAD 02</p><h1>Un espacio para trabajar.</h1><p class='subtitulo'>Organiza la información y encuentra el registro que necesitas.</p></div><span class='distintivo'>Proyecto en desarrollo</span></div>"
	cadena += "<div class='bienvenida'><div><span class='etiqueta'>GESTIÓN CON CLARIDAD</span><h2>Cada registro,<br>en su sitio.</h2><p>Selecciona una entidad para consultar, añadir,<br>editar o eliminar sus registros.</p></div><div class='mapa-datos'><span class='nota-mapa'>UNA BASE, DATOS RELACIONADOS</span><div class='nodo-dato'>Clientes <span>01</span></div><span class='conector-mapa' aria-hidden='true'>↓</span><div class='nodo-dato'>Pedidos <span>02</span></div><span class='conector-mapa' aria-hidden='true'>↓</span><div class='nodo-dato'>Líneas de pedido <span>03</span></div></div></div>"
	cadena += "<div class='cabecera-entidades'><h2>Explora tus entidades</h2><span>" + entidades.length + " tablas disponibles</span></div><div class='rejilla-entidades'>"
	entidades.forEach(function(tabla, indice){
		cadena += "<button class='tarjeta-entidad' data-accion='abrir' data-tabla='" + escapeAtributo(tabla) + "'><span class='numero-entidad'>" + String(indice + 1).padStart(2, "0") + "</span><strong>" + escapeHTML(nombreLegible(tabla)) + "</strong><small>" + escapeHTML(descripciones[tabla] || "Consultar y gestionar registros") + "</small><span class='flecha' aria-hidden='true'>↗</span></button>"
	})
	cadena += "</div>"
	if(entidades.length == 0){
		cadena += "<div class='vacio'><h2>La base todavía no tiene tablas</h2><p>Abre el instalador para crear el modelo de datos.</p><a class='boton' href='instalador.html'>Abrir instalador →</a></div>"
	}
	contenido.innerHTML = cadena
}

function cargarTabla(tabla, mensaje){
	let peticion = ++peticionActual
	seleccionarEntidad(tabla)
	mostrarCarga()
	fetch("api/superapi.php?ruta=tabla&tabla=" + encodeURIComponent(tabla))
	.then(leerRespuesta)
	.then(function(datos){
		if(peticion != peticionActual){ return }
		pintarTabla(tabla, datos)
		if(mensaje){ mostrarMensaje(mensaje, "exito") }
	})
	.catch(function(error){
		if(peticion != peticionActual){ return }
		contenido.innerHTML = "<div class='vacio'><h2>No se pudo cargar la tabla</h2><p>Comprueba la conexión y vuelve a intentarlo.</p><button class='boton' data-accion='recargar'>Volver a intentar</button></div>"
		mostrarError(error)
	})
}

function pintarTabla(tabla, datos){
	let cantidad = datos.registros.length
	let cadena = "<div class='cabecera-pagina'><div><p class='etiqueta'>ENTIDADES / " + escapeHTML(nombreLegible(tabla).toUpperCase()) + "</p><h1>" + escapeHTML(nombreLegible(tabla)) + "</h1><p class='subtitulo'>Consulta y actualiza la información de esta entidad.</p></div><button class='boton' data-accion='crear'><span aria-hidden='true'>+</span> Añadir registro</button></div>"
	cadena += "<div class='panel-tabla'><div class='resumen-tabla'><h2>Listado de registros <span class='contador'>" + cantidad + "</span></h2><span>" + (cantidad == 1 ? "1 registro" : cantidad + " registros") + "</span></div>"
	if(cantidad == 0){
		cadena += "<div class='vacio dentro-panel'><span class='icono-vacio' aria-hidden='true'>+</span><h2>Todo listo para el primer registro</h2><p>Esta tabla todavía está vacía. Añade los primeros datos para empezar.</p><button class='boton secundario' data-accion='crear'>Añadir el primer registro</button></div></div>"
		contenido.innerHTML = cadena
		return
	}
	cadena += "<div class='contenedor-tabla'><table><caption class='solo-lectores'>Registros de " + escapeHTML(nombreLegible(tabla)) + "</caption><thead><tr>"
	Object.keys(datos.registros[0]).forEach(function(clave){
		cadena += "<th scope='col'>" + escapeHTML(nombreLegible(clave)) + "</th>"
	})
	cadena += "<th scope='col' class='columna-acciones'>Acciones</th></tr></thead><tbody>"
	datos.registros.forEach(function(registro){
		cadena += "<tr>"
		Object.keys(registro).forEach(function(clave){
			let valor = registro[clave]
			let clase = ""
			if(clave == datos.clavePrimaria){ clase = "celda-id" }
			if(clave == "estado"){ clase = "celda-estado" }
			cadena += "<td class='" + clase + "'>" + (valor == null || valor === "" ? "<span class='sin-dato'>—</span>" : escapeHTML(valor)) + "</td>"
		})
		cadena += "<td><div class='acciones'><button class='boton-tabla' data-accion='editar' data-id='" + escapeAtributo(registro[datos.clavePrimaria]) + "'>Editar</button><button class='boton-tabla eliminar' data-accion='eliminar' data-id='" + escapeAtributo(registro[datos.clavePrimaria]) + "'>Eliminar</button></div></td></tr>"
	})
	cadena += "</tbody></table></div><div class='pie-tabla'>Datos guardados en tu instalación local · Puedes editar cada registro desde sus acciones.</div></div>"
	contenido.innerHTML = cadena
}

function mostrarFormularioCrear(tabla){
	mostrarFormulario(tabla, null)
}

function mostrarFormularioEditar(tabla, id){
	mostrarFormulario(tabla, id)
}

function mostrarFormulario(tabla, id){
	let peticion = ++peticionActual
	mostrarCarga()
	let estructura = fetch("api/superapi.php?ruta=estructura&tabla=" + encodeURIComponent(tabla)).then(leerRespuesta)
	let registro = id == null ? Promise.resolve({registro: {}}) : fetch("api/superapi.php?ruta=registro&tabla=" + encodeURIComponent(tabla) + "&id=" + encodeURIComponent(id)).then(leerRespuesta)
	Promise.all([estructura, registro])
	.then(function(datos){
		if(peticion != peticionActual){ return }
		let columnas = datos[0].columnas
		let valores = datos[1].registro
		let titulo = id == null ? "Nuevo registro" : "Editar registro"
		let cadena = "<div class='cabecera-pagina'><div><p class='etiqueta'>" + escapeHTML(nombreLegible(tabla).toUpperCase()) + " / " + (id == null ? "NUEVO" : "REGISTRO " + escapeHTML(id)) + "</p><h1>" + titulo + "</h1><p class='subtitulo'>" + escapeHTML(nombreLegible(tabla)) + " · Completa los datos del registro.</p></div><button class='boton secundario' data-accion='recargar'>← Volver a la tabla</button></div>"
		cadena += "<form id='formulario-registro' class='formulario-registro'><div class='titulo-formulario'><h2>Información del registro</h2><p>El identificador se asigna automáticamente.</p></div><div class='rejilla-campos'>"
		columnas.forEach(function(columna, indice){
			if(columna.pk == 1){ return }
			let tipo = "text"
			if(columna.type == "INTEGER" || columna.type == "REAL"){ tipo = "number" }
			if(columna.name == "email"){ tipo = "email" }
			if(columna.name == "fecha"){ tipo = "date" }
			if(columna.name == "telefono"){ tipo = "tel" }
			let identificador = "campo-" + indice
			let referencia = columna.name.endsWith("_id")
			cadena += "<div class='campo'><label for='" + identificador + "'>" + escapeHTML(nombreLegible(columna.name)) + "</label><input id='" + identificador + "' name='" + escapeAtributo(columna.name) + "' type='" + tipo + "' value='" + escapeAtributo(valores[columna.name]) + "'"
			if(tipo == "number"){ cadena += " step='" + (columna.type == "INTEGER" ? "1" : "any") + "'" }
			if(columna.notnull == 1 && columna.dflt_value == null){ cadena += " required" }
			if(referencia){ cadena += " aria-describedby='ayuda-" + indice + "'" }
			cadena += ">"
			if(referencia){ cadena += "<small id='ayuda-" + indice + "'>Usa el ID de un registro existente en la tabla relacionada.</small>" }
			cadena += "</div>"
		})
		cadena += "</div><div class='pie-formulario'><span>Revisa los datos antes de guardar.</span><div><button class='boton secundario' type='button' data-accion='recargar'>Cancelar</button><button class='boton' type='submit'>" + (id == null ? "Crear registro" : "Guardar cambios") + "</button></div></div></form>"
		contenido.innerHTML = cadena
		let formulario = document.querySelector("#formulario-registro")
		formulario.onsubmit = function(evento){
			evento.preventDefault()
			if(id == null){ crearRegistro(tabla, formulario) }
			else{ actualizarRegistro(tabla, id, formulario) }
		}
		let primerCampo = formulario.querySelector("input")
		if(primerCampo){ primerCampo.focus({preventScroll: true}) }
	})
	.catch(function(error){
		if(peticion != peticionActual){ return }
		cargarTabla(tabla)
		mostrarError(error)
	})
}

function crearRegistro(tabla, formulario){
	guardarRegistro("crear", tabla, null, formulario)
}

function actualizarRegistro(tabla, id, formulario){
	guardarRegistro("actualizar", tabla, id, formulario)
}

function guardarRegistro(ruta, tabla, id, formulario){
	let boton = formulario.querySelector("button[type='submit']")
	if(boton.disabled){ return }
	let texto = boton.textContent
	let peticion = peticionActual
	let datos = new FormData(formulario)
	datos.append("tabla", tabla)
	if(id != null){ datos.append("id", id) }
	boton.disabled = true
	boton.textContent = "Guardando…"
	fetch("api/superapi.php?ruta=" + ruta, {method: "POST", body: datos})
	.then(leerRespuesta)
	.then(function(){
		if(peticion != peticionActual){ return }
		cargarTabla(tabla, id == null ? "Registro creado correctamente." : "Cambios guardados correctamente.")
	})
	.catch(function(error){ if(peticion == peticionActual){ mostrarError(error) } })
	.finally(function(){ boton.disabled = false; boton.textContent = texto })
}

function eliminarRegistro(tabla, id){
	registroPendiente = {tabla: tabla, id: id}
	document.querySelector("#detalle-confirmacion").textContent = "Vas a eliminar el registro " + id + " de " + nombreLegible(tabla) + "."
	confirmacion.returnValue = "cancelar"
	confirmacion.showModal()
}

confirmacion.addEventListener("close", function(){
	if(confirmacion.returnValue != "eliminar" || registroPendiente == null){ return }
	let registro = registroPendiente
	let peticion = peticionActual
	registroPendiente = null
	let datos = new FormData()
	datos.append("tabla", registro.tabla)
	datos.append("id", registro.id)
	fetch("api/superapi.php?ruta=eliminar", {method: "POST", body: datos})
	.then(leerRespuesta)
	.then(function(){
		if(peticion == peticionActual){ cargarTabla(registro.tabla, "Registro eliminado correctamente.") }
	})
	.catch(function(error){ if(peticion == peticionActual){ mostrarError(error) } })
})

// Los botones llevan datos, en lugar de construir código dentro del HTML.
contenido.addEventListener("click", function(evento){
	let boton = evento.target.closest("button[data-accion]")
	if(!boton){ return }
	switch(boton.dataset.accion){
		case "abrir": cargarTabla(boton.dataset.tabla); break
		case "crear": mostrarFormularioCrear(tablaActual); break
		case "editar": mostrarFormularioEditar(tablaActual, boton.dataset.id); break
		case "eliminar": eliminarRegistro(tablaActual, boton.dataset.id); break
		case "recargar": cargarTabla(tablaActual); break
	}
})

document.querySelector("#inicio").onclick = pintarInicio
document.querySelector("#cerrar-mensaje").onclick = function(){ document.querySelector("#mensaje").hidden = true }

// Los valores de la base se muestran como texto, incluso si contienen etiquetas.
function escapeHTML(valor){
	if(valor == null){ return "" }
	return String(valor).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

function escapeAtributo(valor){
	return escapeHTML(valor).replaceAll('"', "&quot;").replaceAll("'", "&#39;")
}
