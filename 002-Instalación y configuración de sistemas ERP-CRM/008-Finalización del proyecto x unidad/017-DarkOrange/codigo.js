fetch("data/config.php")
.then(function(respuesta){return respuesta.json()})
.then(function(datos){

	console.log("Los datos son")
	console.log(datos)

	let titulo = document.querySelector("h1")
	titulo.textContent = datos.nombre

	document.documentElement.style.setProperty("--color_corporativo",datos.color)

})


fetch("api/superapi.php?ruta=modulos")
.then(function(respuesta){return respuesta.json()})
.then(function(datos){

	let menu = document.querySelector("#modulos")

	datos.forEach(function(dato){

		let enlace = document.createElement("a")

		enlace.href = "#"
		enlace.textContent = dato

		menu.appendChild(enlace)

	})

})


fetch("api/superapi.php?ruta=entidades")
.then(function(respuesta){return respuesta.json()})
.then(function(datos){

	let menu = document.querySelector("#entidades")

	datos.forEach(function(dato){

		let enlace = document.createElement("a")

		enlace.href = "#"
		enlace.textContent = dato

		enlace.onclick = function(evento){

			evento.preventDefault()

			cargarTabla(dato)

		}

		menu.appendChild(enlace)

	})

})


function cargarTabla(tabla){

	fetch("api/superapi.php?ruta=tabla&tabla="+encodeURIComponent(tabla))
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		pintarTabla(tabla,datos)

	})

}


function pintarTabla(tabla,datos){

	let seccion = document.querySelector("section")

	let cadena = ""

	cadena += "<div class='cabecera-tabla'>"
	cadena += "<div>"
	cadena += "<h2>"+tabla+"</h2>"
	cadena += "<p>"+datos.registros.length+" registros</p>"
	cadena += "</div>"
	cadena += "<button class='boton-crear' onclick=\"mostrarFormularioCrear('"+tabla+"')\">Nuevo registro</button>"
	cadena += "</div>"

	if(datos.registros.length == 0){

		cadena += "<div class='vacio'>"
		cadena += "<p>Esta tabla todavía no tiene registros.</p>"
		cadena += "</div>"

		seccion.innerHTML = cadena

		return

	}

	cadena += "<div class='contenedor-tabla'>"
	cadena += "<table>"

	cadena += "<tr>"

	Object.keys(datos.registros[0]).forEach(function(clave){

		cadena += "<th>"+clave+"</th>"

	})

	cadena += "<th>acciones</th>"

	cadena += "</tr>"


	datos.registros.forEach(function(registro){

		cadena += "<tr>"

		Object.keys(registro).forEach(function(clave){

			cadena += "<td>"+escapeHTML(registro[clave])+"</td>"

		})

		cadena += "<td class='acciones'>"
		cadena += "<button onclick=\"mostrarFormularioEditar('"+tabla+"',"+registro[datos.clavePrimaria]+")\">Editar</button>"
		cadena += "<button class='eliminar' onclick=\"eliminarRegistro('"+tabla+"',"+registro[datos.clavePrimaria]+")\">Eliminar</button>"
		cadena += "</td>"

		cadena += "</tr>"

	})

	cadena += "</table>"
	cadena += "</div>"

	seccion.innerHTML = cadena

}


function mostrarFormularioCrear(tabla){

	fetch("api/superapi.php?ruta=estructura&tabla="+encodeURIComponent(tabla))
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		let seccion = document.querySelector("section")

		let cadena = ""

		cadena += "<div class='cabecera-tabla'>"
		cadena += "<div>"
		cadena += "<h2>Nuevo registro</h2>"
		cadena += "<p>Tabla: "+tabla+"</p>"
		cadena += "</div>"
		cadena += "<button class='boton-volver' onclick=\"cargarTabla('"+tabla+"')\">Volver</button>"
		cadena += "</div>"

		cadena += "<form id='formulario-registro'>"

		datos.columnas.forEach(function(columna){

			if(columna.pk == 1){
				return
			}

			cadena += "<div class='campo'>"
			cadena += "<label>"+columna.name+"</label>"
			cadena += "<input name='"+columna.name+"' type='text'>"
			cadena += "</div>"

		})

		cadena += "<button type='submit'>Crear registro</button>"

		cadena += "</form>"

		seccion.innerHTML = cadena

		let formulario = document.querySelector("#formulario-registro")

		formulario.onsubmit = function(evento){

			evento.preventDefault()

			crearRegistro(tabla,formulario)

		}

	})

}


function crearRegistro(tabla,formulario){

	let datosFormulario = new FormData(formulario)

	datosFormulario.append("tabla",tabla)

	fetch("api/superapi.php?ruta=crear",{
		method:"POST",
		body:datosFormulario
	})
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		if(datos.ok == true){

			cargarTabla(tabla)

		}else{

			alert(datos.error)

		}

	})

}


function mostrarFormularioEditar(tabla,id){

	fetch("api/superapi.php?ruta=registro&tabla="+encodeURIComponent(tabla)+"&id="+encodeURIComponent(id))
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		let seccion = document.querySelector("section")

		let cadena = ""

		cadena += "<div class='cabecera-tabla'>"
		cadena += "<div>"
		cadena += "<h2>Editar registro</h2>"
		cadena += "<p>Tabla: "+tabla+"</p>"
		cadena += "</div>"
		cadena += "<button class='boton-volver' onclick=\"cargarTabla('"+tabla+"')\">Volver</button>"
		cadena += "</div>"

		cadena += "<form id='formulario-registro'>"

		Object.keys(datos.registro).forEach(function(clave){

			if(clave == datos.clavePrimaria){
				return
			}

			cadena += "<div class='campo'>"
			cadena += "<label>"+clave+"</label>"
			cadena += "<input name='"+clave+"' type='text' value=\""+escapeAtributo(datos.registro[clave])+"\">"
			cadena += "</div>"

		})

		cadena += "<button type='submit'>Guardar cambios</button>"

		cadena += "</form>"

		seccion.innerHTML = cadena

		let formulario = document.querySelector("#formulario-registro")

		formulario.onsubmit = function(evento){

			evento.preventDefault()

			actualizarRegistro(tabla,id,formulario)

		}

	})

}


function actualizarRegistro(tabla,id,formulario){

	let datosFormulario = new FormData(formulario)

	datosFormulario.append("tabla",tabla)
	datosFormulario.append("id",id)

	fetch("api/superapi.php?ruta=actualizar",{
		method:"POST",
		body:datosFormulario
	})
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		if(datos.ok == true){

			cargarTabla(tabla)

		}else{

			alert(datos.error)

		}

	})

}


function eliminarRegistro(tabla,id){

	let confirmar = confirm("¿Seguro que quieres eliminar este registro?")

	if(confirmar == false){
		return
	}

	let datosFormulario = new FormData()

	datosFormulario.append("tabla",tabla)
	datosFormulario.append("id",id)

	fetch("api/superapi.php?ruta=eliminar",{
		method:"POST",
		body:datosFormulario
	})
	.then(function(respuesta){return respuesta.json()})
	.then(function(datos){

		if(datos.ok == true){

			cargarTabla(tabla)

		}else{

			alert(datos.error)

		}

	})

}


function escapeHTML(valor){

	if(valor == null){
		return ""
	}

	return String(valor)
		.replaceAll("&","&amp;")
		.replaceAll("<","&lt;")
		.replaceAll(">","&gt;")

}


function escapeAtributo(valor){

	if(valor == null){
		return ""
	}

	return String(valor)
		.replaceAll("&","&amp;")
		.replaceAll("\"","&quot;")
		.replaceAll("<","&lt;")
		.replaceAll(">","&gt;")

}
