// La web comparte la misma configuración de marca que la aplicación.
fetch("../data/config.php", {cache: "no-store"})
.then(function(respuesta){
	if(!respuesta.ok){ throw new Error("No se pudo leer la configuración.") }
	return respuesta.json()
})
.then(function(datos){
	document.querySelectorAll("[data-nombre]").forEach(function(elemento){
		elemento.textContent = datos.nombre
	})
	document.title = datos.nombre + " · Un lugar para cada dato"
	document.documentElement.style.setProperty("--color_corporativo", datos.color)
})
.catch(function(){
	// Si no responde PHP, la página sigue mostrando la marca inicial.
})
