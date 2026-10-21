class SteelBlueFormulario {
  constructor({contenedor, tabla, columnas, registro = {}, id = null, api = "api/superapi.php", alGuardar = null, esActual = () => true}) {
    this.contenedor = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
    this.tabla = tabla;
    this.columnas = columnas || [];
    this.registro = registro;
    this.id = id;
    this.api = api;
    this.alGuardar = alGuardar;
    this.esActual = esActual;
  }

  tipoInput(columna) {
    const nombre = columna.name.toLowerCase();
    const tipo = (columna.type || "").toUpperCase();
    if (/email|correo/.test(nombre)) return "email";
    if (/tel[eé]fono/.test(nombre)) return "tel";
    if (/fecha/.test(nombre) || tipo.includes("DATE")) return "date";
    if (/INT|REAL|NUM|DECIMAL|FLOAT|DOUBLE/.test(tipo)) return "number";
    return "text";
  }

  render() {
    const editar = this.id !== null;
    this.contenedor.innerHTML = `
      <div class="cabecera-pagina">
        <div><p class="etiqueta"></p><h1>${editar ? "Editar registro" : "Nuevo registro"}</h1><p class="subtitulo"></p></div>
        <button class="boton secundario" data-accion="recargar" type="button">← Volver a la tabla</button>
      </div>
      <form id="formulario-registro" class="formulario-registro">
        <div class="titulo-formulario"><h2>Información del registro</h2><p>El identificador se asigna automáticamente.</p></div>
        <div class="rejilla-campos"></div>
        <div class="pie-formulario"><span>Revisa los datos antes de guardar.</span><div>
          <button class="boton secundario" type="button" data-accion="recargar">Cancelar</button>
          <button class="boton" type="submit">${editar ? "Guardar cambios" : "Crear registro"}</button>
        </div></div>
      </form>`;
    this.contenedor.querySelector(".etiqueta").textContent = nombreLegible(this.tabla).toUpperCase() + (editar ? " / REGISTRO " + this.id : " / NUEVO");
    this.contenedor.querySelector(".subtitulo").textContent = nombreLegible(this.tabla) + " · Completa los datos del registro.";
    this.formulario = this.contenedor.querySelector("form");
    const rejilla = this.formulario.querySelector(".rejilla-campos");
    this.columnas.forEach((columna, indice) => {
      if (columna.pk) return;
      const control = document.createElement("div");
      control.className = "campo";
      const etiqueta = document.createElement("label");
      etiqueta.htmlFor = "campo-" + indice;
      etiqueta.textContent = nombreLegible(columna.name);
      const input = document.createElement("input");
      input.id = etiqueta.htmlFor;
      input.name = columna.name;
      input.type = this.tipoInput(columna);
      input.value = this.registro[columna.name] ?? "";
      if (input.type === "number") input.step = /INT/i.test(columna.type) ? "1" : "any";
      input.required = Boolean(columna.notnull && columna.dflt_value === null);
      control.append(etiqueta, input);
      if (columna.name.endsWith("_id")) {
        const ayuda = document.createElement("small");
        ayuda.id = "ayuda-" + indice;
        ayuda.textContent = "Usa el ID de un registro existente en la tabla relacionada.";
        input.setAttribute("aria-describedby", ayuda.id);
        control.appendChild(ayuda);
      }
      rejilla.appendChild(control);
    });
    this.formulario.onsubmit = evento => this.guardar(evento);
    this.formulario.querySelector("input")?.focus({preventScroll: true});
    return this.formulario;
  }

  async guardar(evento) {
    evento.preventDefault();
    const boton = this.formulario.querySelector("button[type=submit]");
    if (boton.disabled) return;
    const texto = boton.textContent;
    const datos = new FormData(this.formulario);
    datos.append("tabla", this.tabla);
    if (this.id !== null) datos.append("id", this.id);
    boton.disabled = true;
    boton.textContent = "Guardando…";
    try {
      const ruta = this.id === null ? "crear" : "actualizar";
      const respuesta = await fetch(this.api + "?ruta=" + ruta, {method: "POST", body: datos});
      const resultado = await leerRespuesta(respuesta);
      if (this.esActual() && this.alGuardar) await this.alGuardar(resultado);
    } catch (error) {
      if (this.esActual()) mostrarError(error);
    } finally {
      boton.disabled = false;
      boton.textContent = texto;
    }
  }
}
