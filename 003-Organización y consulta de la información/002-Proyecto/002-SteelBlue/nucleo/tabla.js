class SteelBlueTabla {
  constructor({contenedor, tabla, columnas, registros, clavePrimaria}) {
    this.contenedor = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
    this.tabla = tabla;
    this.columnas = columnas || [];
    this.registros = registros || [];
    this.clavePrimaria = clavePrimaria;
  }

  render() {
    this.contenedor.innerHTML = `
      <div class="cabecera-pagina">
        <div><p class="etiqueta">DATOS DE LA EMPRESA</p><h1></h1><p class="subtitulo">Consulta los datos y mantén tus registros al día.</p></div>
        <button class="boton" data-accion="crear" type="button">+ Nuevo registro</button>
      </div>
      <div class="zona-analitica"></div>
      <div class="panel-tabla">
        <div class="resumen-tabla"><h2>Todos los registros <span class="contador">${this.registros.length}</span></h2></div>
        <div class="contenedor-tabla"><table><caption class="solo-lectores"></caption><thead></thead><tbody></tbody></table></div>
        <div class="pie-tabla">Los cambios se guardan en la base de datos de tu instalación.</div>
      </div>`;
    this.contenedor.querySelector("h1").textContent = nombreLegible(this.tabla);
    this.contenedor.querySelector("caption").textContent = "Registros de " + nombreLegible(this.tabla);
    this.contenedor.querySelector(".resumen-tabla").appendChild(SteelBlueExportaciones.controles({
      tabla: this.tabla, columnas: this.columnas, registros: this.registros
    }));
    this.crearGrafica();
    const cabecera = document.createElement("tr");
    this.columnas.forEach(columna => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = nombreLegible(columna.name);
      cabecera.appendChild(th);
    });
    if (this.clavePrimaria) {
      const acciones = document.createElement("th");
      acciones.scope = "col";
      acciones.className = "columna-acciones";
      acciones.textContent = "Acciones";
      cabecera.appendChild(acciones);
    }
    this.contenedor.querySelector("thead").appendChild(cabecera);
    const tbody = this.contenedor.querySelector("tbody");
    this.registros.forEach(registro => {
      const fila = document.createElement("tr");
      this.columnas.forEach(columna => {
        const td = document.createElement("td");
        const valor = registro[columna.name];
        td.textContent = valor === null || valor === undefined || valor === "" ? "—" : valor;
        if (valor === null || valor === undefined || valor === "") td.className = "sin-dato";
        else if (columna.name === this.clavePrimaria) td.className = "celda-id";
        else if (columna.name === "estado") td.className = "celda-estado";
        fila.appendChild(td);
      });
      if (this.clavePrimaria) {
        const td = document.createElement("td");
        const acciones = document.createElement("div");
        acciones.className = "acciones";
        [["editar", "Editar"], ["eliminar", "Eliminar"]].forEach(([accion, texto]) => {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.className = "boton-tabla" + (accion === "eliminar" ? " eliminar" : "");
          boton.dataset.accion = accion;
          boton.dataset.id = registro[this.clavePrimaria];
          boton.textContent = texto;
          acciones.appendChild(boton);
        });
        td.appendChild(acciones);
        fila.appendChild(td);
      }
      tbody.appendChild(fila);
    });
    if (!this.registros.length) {
      const vacio = document.createElement("div");
      vacio.className = "vacio dentro-panel";
      vacio.innerHTML = '<h2>El primer registro empieza aquí</h2><p>Esta tabla todavía está vacía. Añade un registro para empezar.</p><button class="boton secundario" data-accion="crear" type="button">Crear el primer registro</button>';
      this.contenedor.querySelector(".contenedor-tabla").after(vacio);
    }
  }

  crearGrafica() {
    const campos = SteelBlueAnalitica.campos(this.columnas, this.registros);
    if (!campos.length) return;
    const zona = this.contenedor.querySelector(".zona-analitica");
    zona.innerHTML = `
      <div class="analitica-entidad">
        <div class="analitica-cabecera"><div><span class="etiqueta-superior">ANÁLISIS DE TABLA</span><h3>Frecuencia de registros</h3></div>
          <div class="analitica-controles"><select aria-label="Campo para agrupar registros"></select>
            <select aria-label="Tipo de gráfica"><option value="horizontal">Barras</option><option value="anillo">Anillo</option></select></div>
        </div><div class="analitica-grafica"></div><p class="analitica-nota"></p>
      </div>`;
    const [campo, tipo] = zona.querySelectorAll("select");
    campos.forEach(columna => {
      const opcion = document.createElement("option");
      opcion.value = columna.name;
      opcion.textContent = nombreLegible(columna.name);
      campo.appendChild(opcion);
    });
    const actualizar = () => {
      const {etiquetas, datos} = SteelBlueAnalitica.frecuencias(this.registros, campo.value);
      new GraficaSVG(zona.querySelector(".analitica-grafica"), {
        tipo: tipo.value, etiquetas, datos, titulo: "Frecuencia de " + nombreLegible(campo.value) + " en " + nombreLegible(this.tabla)
      }).dibujar();
      zona.querySelector(".analitica-nota").textContent = `${this.registros.length} registros · ${etiquetas.length} grupos representados · Datos de la base de datos`;
    };
    campo.onchange = actualizar;
    tipo.onchange = actualizar;
    actualizar();
  }
}
