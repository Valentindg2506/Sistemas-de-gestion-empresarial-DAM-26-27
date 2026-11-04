/** Inicio de demostración: los KPI y las series de esta pantalla son ficticios. */
class SteelBlueDashboard {
  constructor({contenedor = "section", irAEntidad = null, irAReporting = null} = {}) {
    this.contenedor = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
    this.irAEntidad = irAEntidad;
    this.irAReporting = irAReporting;
  }

  render() {
    this.contenedor.innerHTML = `
      <div class="dashboard-intro">
        <div><span class="etiqueta-superior">TU ESPACIO DE TRABAJO</span><h1>Dashboard</h1><p>Resumen visual de la actividad del ERP.</p></div>
        <span class="sello-demo">Datos de demostración</span>
      </div>
      <div class="dashboard-aviso">Las cifras y tendencias de este dashboard son <strong>inventadas para mostrar el diseño</strong>. Las gráficas de las entidades y del reporting sí utilizan los registros de tu instalación.</div>
      <div class="dashboard-graficas">
        <div class="dashboard-superior">
          <div class="dashboard-kpis">
            <article class="kpi kpi-principal">
              <span>Ingresos este mes</span>
              <div class="kpi-valor"><strong>190.000 €</strong><small><b>↗ +11,1 %</b> respecto al mes anterior</small></div>
              <span class="kpi-pie">Una visión de tu actividad<br>Mes actual · EUR · demo</span>
            </article>
            <div class="dashboard-indicadores">
              <article class="kpi"><span>Pedidos activos</span><strong>128</strong><small><b>↗ +8,5 %</b><br>respecto al mes anterior</small></article>
              <article class="kpi"><span>Clientes nuevos</span><strong>34</strong><small><b>↗ +6,3 %</b><br>respecto al mes anterior</small></article>
              <article class="kpi"><span>Tasa de entregas</span><strong>92 %</strong><small><b>↗ +2,4 ptos.</b> respecto al mes anterior</small></article>
            </div>
          </div>
          <article class="panel-grafica grafica-ingresos"><div class="panel-titulo"><div><span class="etiqueta-superior">EVOLUCIÓN</span><h3>Ingresos mensuales</h3></div><small>En miles de euros · demo</small></div><div id="dashboard-ingresos"></div></article>
        </div>
        <div class="dashboard-inferior">
          <article class="panel-grafica principal"><div class="panel-titulo"><div><span class="etiqueta-superior">RENDIMIENTO</span><h3>Modelos con mayor demanda</h3></div><small>Unidades · demo</small></div><div id="dashboard-modelos"></div></article>
          <article class="panel-grafica"><div class="panel-titulo"><div><span class="etiqueta-superior">DISTRIBUCIÓN</span><h3>Estado de los pedidos</h3></div><small>128 pedidos · demo</small></div><div id="dashboard-estados"></div></article>
        </div>
      </div>
      <div class="dashboard-acciones"><div><strong>Consultar datos reales</strong><p>Accede a una entidad para ver la frecuencia de sus registros o genera el reporte general.</p></div><div><button type="button" id="dashboard-clientes" class="boton secundario">Ver clientes</button><button type="button" class="boton" id="dashboard-reporting">Abrir reporting</button></div></div>
    `;
    new GraficaSVG(this.contenedor.querySelector("#dashboard-ingresos"), {
      tipo: "lineas", titulo: "Ingresos de enero a octubre, en miles de euros, datos ficticios",
      etiquetas: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"],
      datos: [68, 83, 96, 92, 108, 121, 135, 156, 171, 190], unidad: " mil €"
    }).dibujar();
    new GraficaSVG(this.contenedor.querySelector("#dashboard-estados"), {
      tipo: "anillo", titulo: "Distribución simulada de los pedidos",
      etiquetas: ["Entregados", "En fabricación", "Confirmados", "Pendientes"],
      datos: [49, 36, 27, 16]
    }).dibujar();
    new GraficaSVG(this.contenedor.querySelector("#dashboard-modelos"), {
      tipo: "horizontal", titulo: "Demanda ficticia por modelo de aeronave",
      etiquetas: ["SB-180 Cierzo", "SB-90 Albor", "SB-300 Boreal", "SB-220 Levante", "SB-Cargo 400"],
      datos: [38, 31, 26, 19, 14]
    }).dibujar();
    this.contenedor.querySelector("#dashboard-clientes").onclick = () => this.irAEntidad?.("clientes");
    this.contenedor.querySelector("#dashboard-reporting").onclick = () => this.irAReporting?.();
  }
}
