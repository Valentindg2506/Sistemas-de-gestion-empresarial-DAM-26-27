/** Exportaciones de la misma tabla a CSV, HTML y Markdown, sin tocar SQLite. */
class SteelBlueExportaciones {
  static campos(columnas) {
    return columnas.map(columna => typeof columna === "string" ? columna : columna.name);
  }

  static escaparHTML(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  static escaparMarkdown(valor) {
    return this.escaparHTML(valor).replaceAll("\\", "\\\\").replaceAll("|", "\\|")
      .replace(/([`*_[\]{}()!~])/g, "\\$1").replace(/\r\n|\r|\n/g, "<br>");
  }

  static html(nombre, columnas, registros) {
    const campos = this.campos(columnas);
    const esc = valor => this.escaparHTML(valor);
    const titulo = esc(nombreLegible(nombre));
    const marca = esc(document.querySelector("[data-nombre]")?.textContent || "SteelBlue");
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo} · ${marca}</title>
  <style>
    *{box-sizing:border-box}body{font:13px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#1d1c22;background:#f7f6f8;margin:0;padding:32px}
    header,.tabla{max-width:1100px;margin:0 auto}header{padding:12px 0 26px}header p{color:#706c79;font-size:12px;font-weight:650}
    h1{font-size:30px;font-weight:650;letter-spacing:-1px;margin:8px 0;color:#315f87}
    .tabla{overflow-x:auto;border:1px solid #eeecf0;border-radius:18px;background:#fff;padding:8px 0}
    table{border-collapse:collapse;width:100%}caption{text-align:left;padding:16px 20px;color:#706c79;font-size:12px}
    th,td{border-bottom:1px solid #eeecf0;padding:12px 20px;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere}
    th{background:#f8f7f9;color:#706c79;font-size:11px;font-weight:650}tbody tr:last-child td{border-bottom:0}tbody tr:nth-child(even){background:#fcfbfd}
    @media(max-width:620px){body{padding:16px}th,td{padding:10px 12px}}
    @media print{body{margin:0;padding:0;background:white}.tabla{overflow:visible;border:0;border-radius:0}thead{display:table-header-group}tr{break-inside:avoid}}
  </style>
</head>
<body>
  <header><p>${marca}</p><h1>${titulo}</h1></header>
  <div class="tabla"><table>
    <caption>${registros.length} registros</caption>
    <thead><tr>${campos.map(campo => `<th scope="col">${esc(campo)}</th>`).join("")}</tr></thead>
    <tbody>${registros.map(registro => `<tr>${campos.map(campo => `<td>${esc(registro[campo])}</td>`).join("")}</tr>`).join("\n")}</tbody>
  </table></div>
</body>
</html>\n`;
  }

  static markdown(nombre, columnas, registros) {
    const campos = this.campos(columnas);
    const fila = valores => "| " + valores.map(valor => this.escaparMarkdown(valor)).join(" | ") + " |";
    return [
      "# " + this.escaparMarkdown(nombreLegible(nombre)), "",
      registros.length + " registros", "", fila(campos),
      "| " + campos.map(() => "---").join(" | ") + " |",
      ...registros.map(registro => fila(campos.map(campo => registro[campo]))), ""
    ].join("\n");
  }

  static descargar(nombre, columnas, registros, formato = "csv") {
    if (formato === "csv") return SteelBlueCSV.descargar(nombre, columnas, registros);
    const markdown = formato === "md";
    const texto = markdown ? this.markdown(nombre, columnas, registros) : this.html(nombre, columnas, registros);
    const blob = new Blob([texto], {type: markdown ? "text/markdown;charset=utf-8" : "text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = String(nombre).replace(/[^a-zA-Z0-9_-]/g, "_") + (markdown ? ".md" : ".html");
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  static controles({tabla, columnas, registros}) {
    const zona = document.createElement("div");
    zona.className = "controles-exportacion";
    const selector = document.createElement("select");
    selector.setAttribute("aria-label", "Formato de exportación de " + nombreLegible(tabla));
    [["csv", "CSV"], ["html", "HTML"], ["md", "Markdown"]].forEach(([valor, texto]) => {
      const opcion = document.createElement("option");
      opcion.value = valor;
      opcion.textContent = texto;
      selector.appendChild(opcion);
    });
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton secundario boton-exportar";
    boton.textContent = "Exportar CSV";
    boton.disabled = !columnas.length;
    selector.onchange = () => { boton.textContent = "Exportar " + selector.selectedOptions[0].textContent; };
    boton.onclick = () => {
      const filas = typeof registros === "function" ? registros() : registros;
      this.descargar(tabla, columnas, filas, selector.value);
    };
    zona.append(selector, boton);
    return zona;
  }
}
