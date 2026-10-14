# darkorange — componentes C/R

Se han extraído dos componentes reutilizables a `nucleo/`:

- `formulario.js`: componente **C (Create)**. Recibe tabla + columnas, omite PK/id, genera controles y envía JSON a la API.
- `tabla.js`: componente **R (Read)**. Recibe tabla + columnas + registros y construye la tabla.

`codigo.js` queda como orquestador: descubre las entidades, pide `ruta=tabla` y monta ambos componentes para cualquier tabla SQLite.

La API valida siempre el nombre de tabla contra `sqlite_master` y filtra los campos recibidos contra `PRAGMA table_info`, por lo que no depende de nombres concretos como clientes/empleados/productos.

## Dashboard y analítica gráfica

- La **pantalla inicial** es `Dashboard`, con KPI simulados y gráficas de líneas, anillo y barras horizontales. Se indica en la interfaz que **son datos ficticios** y no se confunden con la base de datos.
- En cada **entidad**, antes de la tabla, hay una gráfica de **frecuencia de registros reales**. Se puede elegir la columna y cambiar entre **Barras** y **Anillo**. Se actualiza al guardar un nuevo registro.
- En **Reporting** se muestran dos gráficas resumen basadas en registros reales y una gráfica de frecuencia por entidad. Los filtros de cada tabla actualizan también su gráfica. Las gráficas SVG quedan incluidas en **Imprimir / PDF**.
- `nucleo/graficas.js` contiene un componente SVG reutilizable (barras, barras horizontales, línea, tarta y anillo), adaptado del archivo de ejemplo suministrado y sin dependencias externas.
- `nucleo/analitica.js` agrupa registros por campo y cuenta frecuencias; `nucleo/dashboard.js` monta la pantalla de bienvenida.

Para probarlo, abre el proyecto desde un **servidor PHP con extensión SQLite3** y entra en `index.html` (no abrir con `file://`, ya que la API requiere PHP). La base de datos de ejemplo ya está incluida.
