# Comparación 021 vs. 022 e integración final

## Diferencias comprobadas

- **022 añade CSV** mediante `nucleo/csv.js`, con un botón en cada entidad y otro en cada tabla de Reporting. El CSV del Reporting respeta filtrado y orden actual.
- **022 elimina el módulo `nucleo/analitica.js`** y simplifica el componente de gráficos de SVG, sustituyendo `GraficaSVG` por `DarkorangeGraficas`.
- **022 altera la presentación y navegación**: deja de tener el botón Dashboard en la cabecera y varias reglas de diseño responsive y estilos del dashboard de la 021.
- **022 suprime los gráficos resumen de Reporting** y reemplaza las gráficas de tabla configurables por una versión más limitada.
- **El archivo SQLite de ambas versiones es idéntico**, y las diferencias en SQL, PHP y formulario se limitan a saltos de línea de fin de archivo; el nombre en `config.php` cambia mayúscula inicial.
- En la versión combinada se mantiene el código, la apariencia y los gráficos de **021**, sumando solamente la exportación CSV de **022**.

## Integración realizada

| Archivo | Cambio |
| --- | --- |
| `nucleo/csv.js` | Reutilizado desde 022, con protección ante fórmulas en hojas de cálculo, punto y coma, BOM UTF-8 y CRLF. |
| `index.html` | Carga de `csv.js` antes de los componentes. |
| `nucleo/tabla.js` | Botón de exportación completa en la cabecera de la tabla. |
| `nucleo/reporting.js` | Botón por tabla para exportar filas visibles respetando la ordenación. |
| `estilo.css` | Estilos mínimos para botones y ocultación de estos al imprimir. |
| `README.md` | Documentación de CSV. |

No hay cambios de backend ni de estructura SQLite.

## Verificaciones efectuadas

Se validó mediante Chromium headless, usando la SQLite original como fuente de datos y emulando las respuestas de la API PHP en el navegador porque el entorno de pruebas no tiene el módulo PHP SQLite3.

- Captura de dashboard 021 e integrado: **idénticas píxel a píxel** a 1440 × 900.
- Dashboard: **4 KPI** y **3 gráficas SVG**.
- Tabla `clientes`: **10 registros**, selectores de agrupación y gráfica, descarga CSV válida con BOM UTF-8.
- Reporting: **2 gráficos generales**, **7 gráficos de frecuencia** y **7 botones CSV**.
- CSV de Reporting: respeta filtro `país = España` y orden ascendente por nombre.
- Los botones de exportación no aparecen al imprimir.
- Navegación Dashboard → entidades → Reporting → Dashboard y controles a **390 px**.
- Sin errores JavaScript en las pruebas anteriores.

> Las pruebas usan respuestas PHP simuladas a partir de la base SQLite real. Para la validación extremo a extremo en producción se requiere un servidor PHP con `SQLite3` habilitado, según README.
