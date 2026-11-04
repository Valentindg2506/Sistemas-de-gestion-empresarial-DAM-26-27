/** Agrupación de frecuencias para cualquier entidad SQLite del proyecto. */
class SteelBlueAnalitica {
  static campos(columnas = [], registros = []) {
    return columnas
      .filter(c => !c.pk && !/^id$|^identificador$|(?:^|_)id$/i.test(c.name) && !/email|correo|telefono|teléfono|observacion|descripcion|direccion|url|password/i.test(c.name))
      .map(columna => {
        const nombre = columna.name.toLowerCase();
        const distintos = new Set(registros.map(r => String(r[columna.name] ?? "").trim())).size;
        const preferida = /^(estado|tipo|categoria|categoría|departamento|pais|país|especialidad|cantidad|puesto|genero|género|sector|provincia|ciudad|stock)$/i.test(nombre);
        const prioritaria = /^(estado|tipo|categoria|categoría|departamento|pais|país)$/i.test(nombre);
        let puntuacion = (prioritaria ? 100 : preferida ? 75 : 5) + (distintos <= 8 ? 20 : 0) - (distintos > 15 ? 40 : 0);
        if (/nombre|apellido/.test(nombre)) puntuacion -= 35;
        if (/fecha/.test(nombre)) puntuacion -= 20;
        return {...columna, puntuacion};
      }).sort((a, b) => b.puntuacion - a.puntuacion || a.name.localeCompare(b.name, "es"));
  }

  static frecuencias(registros = [], campo, limite = 7) {
    if (!campo) return {etiquetas: [], datos: []};
    const frecuencias = new Map();
    registros.forEach(registro => {
      const valor = registro[campo];
      let etiqueta = valor === null || valor === undefined || String(valor).trim() === "" ? "Sin dato" : String(valor).trim();
      // Agrupar fechas ISO por mes en lugar de un punto por día.
      if (/fecha/i.test(campo) && /^\d{4}-\d{2}/.test(etiqueta)) etiqueta = `${etiqueta.slice(5,7)}/${etiqueta.slice(0,4)}`;
      frecuencias.set(etiqueta, (frecuencias.get(etiqueta) || 0) + 1);
    });
    const entradas = [...frecuencias.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0], "es", {numeric:true}));
    const principales = entradas.slice(0, limite);
    if (entradas.length > limite) principales.push(["Otros", entradas.slice(limite).reduce((s, e) => s + e[1], 0)]);
    return {etiquetas: principales.map(([nombre]) => nombre), datos: principales.map(([,numero]) => numero)};
  }
}
