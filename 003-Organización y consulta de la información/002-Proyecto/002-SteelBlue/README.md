# SteelBlue · Organización y consulta de la información

ERP académico con HTML, CSS, JavaScript, PHP y SQLite. Sigue la organización por componentes de DarkOrange 022 y conserva la identidad azul y el CRUD de SteelBlue.

## Puesta en marcha

Necesitas PHP con la extensión `SQLite3`. Desde esta carpeta ejecuta:

```bash
php -S localhost:8000
```

Abre `http://localhost:8000/index.html`. La base `data/steelblue.db` incluida contiene datos ficticios y se conserva al actualizar el código. No abras el HTML mediante `file://`: las peticiones necesitan PHP.

El instalador sigue disponible en `instalador.html`. Crea las tablas que falten a partir del modelo de texto; las tablas existentes y sus registros se conservan. No carga automáticamente los ejemplos de `data/demo.sql` ni modifica columnas existentes.

## Diseño y tema

La apariencia está adaptada de la plantilla Vertis de `000-Plantilla`, con el azul de SteelBlue. El ERP, la web de presentación, el instalador y sus resultados comparten tipografía, tarjetas, iconos y controles. Los recursos necesarios están incluidos en SteelBlue; la aplicación no carga archivos desde la carpeta de la plantilla.

- `tokens.css` define los colores, radios, tipografía y paleta de las gráficas. El acento sigue utilizando el color de `data/config.php`.
- `nucleo/interfaz.js` gestiona los iconos, los paneles de navegación y los modos claro y oscuro. El botón de sol/luna recuerda el tema en este navegador y lo comparte entre las páginas del proyecto. La primera visita utiliza el modo claro.
- Cambiar el tema conserva la vista, los datos escritos en formularios, los filtros y la ordenación; no vuelve a consultar ni modifica los registros.
- En escritorio se accede a las entidades desde la barra de iconos o desde la pestaña «Entidades». En móvil se utiliza la barra inferior y el panel con los nombres completos. El botón de opciones mantiene accesibles la web, el instalador, JSON y los módulos previstos.
- Los documentos PDF se imprimen sobre fondo blanco desde cualquiera de los temas. La exportación HTML conserva sus estilos propios para poder abrirse sin servidor; CSV, Markdown y JSON mantienen sus formatos.

## Componentes

`codigo.js` coordina la navegación y las peticiones. Los componentes reutilizables están en `nucleo/`, como en el proyecto de clase:

| Archivo | Responsabilidad |
| --- | --- |
| `formulario.js` | Formularios de creación y edición, tipos de entrada y guardado. |
| `tabla.js` | Listados con edición, borrado, análisis y exportaciones. |
| `dashboard.js` | Inicio con cuatro indicadores y tres gráficas de demostración. |
| `graficas.js` | Gráficas SVG de barras, barras horizontales, líneas, tarta y anillo. |
| `analitica.js` | Selección de campos y cálculo de frecuencias sobre registros reales. |
| `reporting.js` | Informe general, filtros, ordenación, sumas, promedios e impresión/PDF. |
| `csv.js` | Generación y descarga de CSV, incorporada desde DarkOrange 022. |
| `exportaciones.js` | Selector de formatos y exportaciones adicionales HTML y Markdown. |
| `interfaz.js` | Tema compartido, iconos SVG y navegación adaptable. |

La API, la configuración, los datos y los servicios mantienen sus carpetas. No se utilizan frameworks ni librerías externas. El nombre y el color se configuran en `data/config.php`.

## Dashboard y datos reales

- El dashboard es la pantalla inicial. Sus indicadores y series son inventados para presentar el diseño y se señalan como datos de demostración.
- Las siete entidades y Reporting utilizan los registros de la base de datos. Las entidades se descubren automáticamente, sin fijar sus nombres en los componentes.
- En cada entidad se puede elegir el campo de agrupación y alternar barras y anillo. La gráfica se actualiza al crear, editar o borrar registros. Las frecuencias agrupan los siete valores más habituales y el resto en «Otros»; las fechas se agrupan por mes.
- Reporting incluye dos gráficas generales y una de frecuencia por tabla. Los filtros por columna se combinan y actualizan el contador, las sumas, los promedios y la gráfica de esa tabla. Los encabezados alternan orden ascendente y descendente.
- «Imprimir / PDF» abre la impresión del navegador. El informe se prepara para A4, conserva los filtros aplicados y las gráficas, y oculta los controles.

## Exportaciones

Cada entidad y cada tabla de Reporting tienen un selector CSV / HTML / Markdown y su botón de descarga. La entidad exporta todos sus registros cargados. Reporting exporta únicamente las filas visibles, en el orden aplicado; las filas de sumas y promedios no forman parte de la descarga.

- **CSV**: separador `;`, BOM UTF-8, finales CRLF, campos entre comillas dobles y escape de comillas. Se protegen los textos que podrían interpretarse como fórmulas en una hoja de cálculo.
- **HTML**: documento independiente con codificación UTF-8, título, contador y tabla con estilos incluidos. Se puede abrir sin servidor y no necesita recursos externos. Los valores se escapan como texto.
- **Markdown**: archivo `.md` con título, contador y tabla. Se escapan los delimitadores, las barras verticales y el HTML de los datos; los saltos de línea de las celdas se representan con `<br>`.
- **JSON**: se conserva «Exportar datos JSON» en el menú, mediante `servicios/salida.php`, para consultar la base de datos completa.

Los formatos por tabla incluyen las columnas originales, incluida la clave primaria, y admiten tablas vacías con sus cabeceras. Las descargas se generan en el navegador y no alteran la base de datos.

## Contrato de la API

`GET api/superapi.php?ruta=tabla&tabla=clientes` devuelve `tabla`, `columnas`, `clavePrimaria` y `registros`. Las columnas proceden de `PRAGMA table_info`.

Se mantienen las rutas de lectura `modulos`, `entidades`, `estructura`, `tabla` y `registro`; y las rutas POST `crear`, `actualizar` y `eliminar`. Las escrituras utilizan `FormData`, validan los campos contra el esquema y conservan las comprobaciones de relaciones de SQLite. La clave primaria se detecta desde los metadatos; no se presupone que se llame `id`.

Los módulos de ventas, RR. HH., facturación y compras siguen previstos para próximas unidades.
