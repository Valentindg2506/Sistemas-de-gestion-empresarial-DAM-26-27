class DarkorangeTabla {
  constructor({contenedor, tabla, columnas, registros}) {
    this.contenedor = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
    this.tabla = tabla;
    this.columnas = columnas || [];
    this.registros = registros || [];
  }

  render() {
    this.contenedor.replaceChildren();

    const cabecera = document.createElement("div");
    cabecera.className = "tabla-cabecera";
    const titulo = document.createElement("h3");
    titulo.textContent = "Listado de " + this.tabla;
    const botonCSV = document.createElement("button");
    botonCSV.type = "button";
    botonCSV.textContent = "Exportar CSV";
    botonCSV.disabled = !this.columnas.length;
    botonCSV.addEventListener("click", () => {
      DarkorangeCSV.descargar(this.tabla, this.columnas, this.registros);
    });
    cabecera.append(titulo, botonCSV);
    this.contenedor.appendChild(cabecera);

    if (!this.columnas.length) {
      const vacio = document.createElement("p");
      vacio.className = "vacio";
      vacio.textContent = "No hay columnas.";
      this.contenedor.appendChild(vacio);
      return;
    }

    this.crearGrafica();

    const envoltorio = document.createElement("div");
    envoltorio.className = "tabla-contenedor";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trh = document.createElement("tr");
    this.columnas.forEach(columna => {
      const th = document.createElement("th");
      th.textContent = columna.name;
      trh.appendChild(th);
    });
    thead.appendChild(trh);

    this.registros.forEach(registro => {
      const tr = document.createElement("tr");
      this.columnas.forEach(columna => {
        const td = document.createElement("td");
        td.textContent = registro[columna.name] ?? "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    envoltorio.appendChild(table);
    this.contenedor.appendChild(envoltorio);

    if (!this.registros.length) {
      const vacio = document.createElement("p");
      vacio.className = "vacio";
      vacio.textContent = "Todavía no hay registros.";
      this.contenedor.appendChild(vacio);
    }
    return table;
  }

  crearGrafica() {
    const opciones = DarkorangeAnalitica.campos(this.columnas, this.registros);
    if (!opciones.length) return;

    const panel = document.createElement("div");
    panel.className = "analitica-entidad";
    const superior = document.createElement("div");
    superior.className = "analitica-cabecera";
    const textos = document.createElement("div");
    textos.innerHTML = '<span class="etiqueta-superior">ANÁLISIS DE TABLA</span><h3>Frecuencia de registros</h3>';
    const controles = document.createElement("div");
    controles.className = "analitica-controles";
    const selector = document.createElement("select");
    selector.setAttribute("aria-label", "Campo para agrupar registros");
    opciones.forEach(c => {
      const option = document.createElement("option");
      option.value = c.name;
      option.textContent = c.name;
      selector.appendChild(option);
    });
    const tipo = document.createElement("select");
    tipo.setAttribute("aria-label", "Tipo de gráfica");
    [["horizontal", "Barras"], ["anillo", "Anillo"]].forEach(([valor, etiqueta]) => {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = etiqueta;
      tipo.appendChild(option);
    });
    controles.append(selector, tipo);
    superior.append(textos, controles);
    const grafica = document.createElement("div");
    grafica.className = "analitica-grafica";
    const nota = document.createElement("p");
    nota.className = "analitica-nota";
    panel.append(superior, grafica, nota);
    this.contenedor.appendChild(panel);

    const redibujar = () => {
      const {etiquetas, datos} = DarkorangeAnalitica.frecuencias(this.registros, selector.value);
      new GraficaSVG(grafica, {
        tipo: tipo.value, etiquetas, datos, titulo: `Frecuencia de ${selector.value} en ${this.tabla}`
      }).dibujar();
      nota.textContent = `${this.registros.length} registros · ${etiquetas.length} grupos representados · datos reales de SQLite`;
    };
    selector.addEventListener("change", redibujar);
    tipo.addEventListener("change", redibujar);
    redibujar();
  }
}
