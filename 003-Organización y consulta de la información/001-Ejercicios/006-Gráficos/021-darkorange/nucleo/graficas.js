/** Gráficas SVG reutilizables, sin librerías externas.
 * Adaptado del ejemplo de barras, tarta y anillo adjuntado al proyecto.
 */
class GraficaSVG {
  constructor(elemento, opciones = {}) {
    this.elemento = typeof elemento === "string" ? document.querySelector(elemento) : elemento;
    this.tipo = opciones.tipo || "barras";
    this.datos = (opciones.datos || []).map(n => Math.max(0, Number(n) || 0));
    this.etiquetas = opciones.etiquetas || this.datos.map((_, i) => `Elemento ${i + 1}`);
    this.colores = opciones.colores || ["#ed780b", "#374151", "#f5b24c", "#64748b", "#c3540a", "#269c87", "#8874b0", "#9bafba"];
    this.total = this.datos.reduce((a, b) => a + b, 0);
    this.unidad = opciones.unidad || "";
    this.leyenda = opciones.leyenda ?? (this.tipo === "anillo" || this.tipo === "tarta");
    this.titulo = opciones.titulo || "Gráfico";
    this.NS = "http://www.w3.org/2000/svg";
  }

  crear(etiqueta, atributos = {}, texto = null) {
    const nodo = document.createElementNS(this.NS, etiqueta);
    Object.entries(atributos).forEach(([clave, valor]) => nodo.setAttribute(clave, String(valor)));
    if (texto !== null) nodo.textContent = texto;
    return nodo;
  }

  color(indice) { return this.colores[indice % this.colores.length]; }
  numero(valor) { return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(valor); }
  valor(valor) { return this.numero(valor) + this.unidad; }

  lienzo(ancho, alto) {
    const svg = this.crear("svg", {
      viewBox: `0 0 ${ancho} ${alto}`,
      role: "img",
      "aria-label": this.titulo,
      preserveAspectRatio: "xMidYMid meet"
    });
    svg.classList.add("grafica-svg");
    svg.appendChild(this.crear("title", {}, this.titulo));
    this.elemento.appendChild(svg);
    return svg;
  }

  texto(svg, texto, x, y, atributos = {}) {
    const nodo = this.crear("text", {
      x, y, fill: "#697384", "font-size": 12, "dominant-baseline": "middle", ...atributos
    }, String(texto));
    svg.appendChild(nodo);
    return nodo;
  }

  tooltip() {
    let tooltip = document.querySelector("#grafica-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "grafica-tooltip";
      tooltip.className = "tooltip-grafica";
      tooltip.setAttribute("role", "status");
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  activarTooltip(figura, dato, indice) {
    const etiqueta = this.etiquetas[indice] || `Elemento ${indice + 1}`;
    const porcentaje = this.tipo === "lineas" ? "" : ` (${this.total ? this.numero(dato / this.total * 100) : 0} %)`;
    const detalle = `${etiqueta}: ${this.valor(dato)}${porcentaje}`;
    figura.setAttribute("tabindex", "0");
    figura.setAttribute("aria-label", detalle.trim());
    const mostrar = evento => {
      const tooltip = this.tooltip();
      tooltip.replaceChildren();
      const fuerte = document.createElement("strong");
      fuerte.textContent = etiqueta;
      const linea = document.createElement("span");
      linea.textContent = this.tipo === "lineas" ? this.valor(dato) : `${this.valor(dato)} · ${this.total ? this.numero(dato / this.total * 100) : 0} % del total`;
      tooltip.append(fuerte, linea);
      tooltip.style.display = "grid";
      const r = figura.getBoundingClientRect();
      const x = evento.clientX || r.left + r.width / 2;
      const y = evento.clientY || r.top;
      tooltip.style.left = `${Math.max(8, Math.min(x + 14, window.innerWidth - tooltip.offsetWidth - 8))}px`;
      tooltip.style.top = `${Math.max(8, Math.min(y + 14, window.innerHeight - tooltip.offsetHeight - 8))}px`;
    };
    const ocultar = () => { this.tooltip().style.display = "none"; };
    figura.addEventListener("mousemove", mostrar);
    figura.addEventListener("focus", mostrar);
    figura.addEventListener("mouseleave", ocultar);
    figura.addEventListener("blur", ocultar);
  }

  barras() {
    const ancho = 680, alto = 268, margen = {izq: 44, der: 16, arriba: 24, abajo: 45};
    const svg = this.lienzo(ancho, alto);
    const h = alto - margen.arriba - margen.abajo;
    const w = ancho - margen.izq - margen.der;
    const maximo = Math.max(1, ...this.datos) * 1.12;
    for (let i = 0; i <= 4; i++) {
      const y = margen.arriba + i * h / 4;
      svg.appendChild(this.crear("line", { x1: margen.izq, x2: ancho - margen.der, y1: y, y2: y, stroke: "#e7e9ee" }));
      this.texto(svg, this.numero(maximo * (1 - i / 4)), margen.izq - 7, y, {"text-anchor":"end", "font-size": 10});
    }
    const paso = w / Math.max(1, this.datos.length);
    this.datos.forEach((dato, i) => {
      const bh = dato / maximo * h;
      const x = margen.izq + i * paso + paso * .18;
      const barra = this.crear("rect", {x, y: margen.arriba + h - bh, width: paso * .64, height: Math.max(bh, .6), rx: 5, fill: this.color(i)});
      this.activarTooltip(barra, dato, i);
      svg.appendChild(barra);
      this.texto(svg, String(this.etiquetas[i]).slice(0, 11), margen.izq + i * paso + paso / 2, alto - 21, {"text-anchor":"middle", "font-size": 11});
    });
  }

  horizontal() {
    const ancho = 680, alto = Math.max(102, this.datos.length * 37 + 26);
    const svg = this.lienzo(ancho, alto);
    const maximo = Math.max(1, ...this.datos);
    this.datos.forEach((dato, i) => {
      const y = 10 + i * 37;
      const etiqueta = String(this.etiquetas[i]);
      this.texto(svg, etiqueta.length > 23 ? etiqueta.slice(0, 22) + "…" : etiqueta, 7, y + 12, { "font-size": 12 });
      svg.appendChild(this.crear("rect", { x: 174, y: y + 4, width: 425, height: 19, rx: 6, fill: "#f0f1f3" }));
      const figura = this.crear("rect", { x: 174, y: y + 4, width: Math.max(.6, dato / maximo * 425), height: 19, rx: 6, fill: this.color(i) });
      this.activarTooltip(figura, dato, i);
      svg.appendChild(figura);
      this.texto(svg, this.valor(dato), 614, y + 13, { "font-size": 12, "font-weight": 600 });
    });
  }

  lineas() {
    const ancho = 680, alto = 268, izq = 45, der = 20, arriba = 27, abajo = 42;
    const svg = this.lienzo(ancho, alto);
    const w = ancho - izq - der, h = alto - arriba - abajo;
    const maximo = Math.max(1, ...this.datos) * 1.16;
    for (let i = 0; i <= 4; i++) {
      const y = arriba + h / 4 * i;
      svg.appendChild(this.crear("line", {x1: izq, x2: ancho - der, y1: y, y2: y, stroke: "#e7e9ee"}));
      this.texto(svg, this.numero(maximo * (1 - i / 4)), izq - 8, y, {"font-size":10,"text-anchor":"end"});
    }
    const puntos = this.datos.map((dato, i) => ({
      x: izq + (this.datos.length === 1 ? w / 2 : i * w / (this.datos.length - 1)),
      y: arriba + h - dato / maximo * h
    }));
    if (puntos.length) {
      const camino = puntos.map((p,i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
      const area = `${camino} L ${puntos.at(-1).x} ${arriba + h} L ${puntos[0].x} ${arriba + h} Z`;
      svg.appendChild(this.crear("path", {d: area, fill: "#ed780b", "fill-opacity": .09}));
      svg.appendChild(this.crear("path", {d: camino, fill: "none", stroke: "#ed780b", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round"}));
    }
    puntos.forEach((p, i) => {
      const circulo = this.crear("circle", {cx: p.x, cy: p.y, r: 5, fill: "#ed780b", stroke: "#fff", "stroke-width": 2});
      this.activarTooltip(circulo, this.datos[i], i);
      svg.appendChild(circulo);
      this.texto(svg, String(this.etiquetas[i]).slice(0, 10), p.x, alto - 17, {"font-size":11,"text-anchor":"middle"});
    });
  }

  punto(cx, cy, radio, angulo) {
    return {x: cx + radio * Math.cos(angulo), y: cy + radio * Math.sin(angulo)};
  }

  sector(cx, cy, radioExterior, radioInterior, inicio, fin) {
    const p1 = this.punto(cx, cy, radioExterior, inicio), p2 = this.punto(cx, cy, radioExterior, fin);
    const grande = fin - inicio > Math.PI ? 1 : 0;
    if (fin - inicio >= Math.PI * 2 - 0.000001) {
      const exterior = `M ${cx-radioExterior} ${cy} a ${radioExterior} ${radioExterior} 0 1 0 ${radioExterior*2} 0 a ${radioExterior} ${radioExterior} 0 1 0 ${-radioExterior*2} 0`;
      if (!radioInterior) return exterior + " Z";
      return `${exterior} M ${cx-radioInterior} ${cy} a ${radioInterior} ${radioInterior} 0 1 1 ${radioInterior*2} 0 a ${radioInterior} ${radioInterior} 0 1 1 ${-radioInterior*2} 0 Z`;
    }
    if (!radioInterior) return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radioExterior} ${radioExterior} 0 ${grande} 1 ${p2.x} ${p2.y} Z`;
    const p3 = this.punto(cx, cy, radioInterior, fin), p4 = this.punto(cx, cy, radioInterior, inicio);
    return `M ${p1.x} ${p1.y} A ${radioExterior} ${radioExterior} 0 ${grande} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${radioInterior} ${radioInterior} 0 ${grande} 0 ${p4.x} ${p4.y} Z`;
  }

  circular(interior) {
    const svg = this.lienzo(340, 290);
    if (!this.total) return;
    let angulo = -Math.PI / 2;
    this.datos.forEach((dato, indice) => {
      if (!dato) return;
      const final = angulo + dato / this.total * Math.PI * 2;
      const figura = this.crear("path", {
        d: this.sector(170, 140, 112, interior, angulo, final),
        fill: this.color(indice), stroke: "#fff", "stroke-width": 2, "fill-rule": "evenodd"
      });
      this.activarTooltip(figura, dato, indice);
      svg.appendChild(figura);
      angulo = final;
    });
    if (interior) {
      this.texto(svg, this.numero(this.total), 170, 135, {"font-size":28, "font-weight":700, fill: "#202732", "text-anchor":"middle"});
      this.texto(svg, "TOTAL", 170, 163, {"font-size":11, "letter-spacing":2, "text-anchor":"middle"});
    }
  }

  leyendas() {
    const leyenda = document.createElement("div");
    leyenda.className = "grafica-leyenda";
    this.datos.forEach((dato, indice) => {
      const item = document.createElement("span");
      const punto = document.createElement("i");
      punto.style.background = this.color(indice);
      const nombre = document.createElement("span");
      nombre.textContent = `${this.etiquetas[indice]} (${this.valor(dato)})`;
      item.append(punto, nombre);
      leyenda.appendChild(item);
    });
    this.elemento.appendChild(leyenda);
  }

  dibujar() {
    if (!this.elemento) return;
    this.elemento.replaceChildren();
    if (!this.datos.length || !this.total) {
      const vacio = document.createElement("p");
      vacio.className = "grafica-vacia";
      vacio.textContent = "Todavía no hay datos para representar.";
      this.elemento.appendChild(vacio);
      return;
    }
    if (this.tipo === "horizontal") this.horizontal();
    else if (this.tipo === "lineas") this.lineas();
    else if (this.tipo === "anillo") this.circular(66);
    else if (this.tipo === "tarta") this.circular(0);
    else this.barras();
    if (this.leyenda) this.leyendas();
  }
}
