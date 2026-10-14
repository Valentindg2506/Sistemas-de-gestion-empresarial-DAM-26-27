# DarkGoldenRod

Proyecto académico de Sistemas de Gestión Empresarial (DAM). Mantiene el alcance CRUD del cierre de la unidad 02 de DarkOrange y su separación entre cliente y servidor. Incluye una aplicación ERP y su web de presentación.

## Ejecución local

Se necesita PHP con la extensión `SQLite3`. Desde esta carpeta:

```bash
php -S localhost:8000
```

- ERP: `http://localhost:8000/`
- Web corporativa: `http://localhost:8000/web/`
- Instalador: `http://localhost:8000/instalador.html`
- Exportación: `http://localhost:8000/servicios/salida.php`

La base `data/darkgoldenrod.db` ya incluye datos ficticios. El usuario que ejecuta PHP debe poder escribir en la base y en la carpeta `data`, porque SQLite crea archivos temporales junto a ella. No se necesitan paquetes, compilación ni servicios externos.

## Estructura

```text
DarkGoldenRod/
├── index.html
├── codigo.js
├── estilo.css
├── instalador.html
├── inst.css
├── api/
│   ├── superapi.php
│   └── instalar.php
├── data/
│   ├── config.php
│   ├── darkgoldenrod.db
│   ├── schema.sql
│   ├── demo.sql
│   └── modelodedatos.txt
├── servicios/
│   ├── entrada.php
│   └── salida.php
├── modulos/
│   └── .gitkeep
├── nucleo/
│   └── .gitkeep
├── util/
│   └── .gitkeep
└── web/
    ├── index.html
    ├── codigo.js
    └── estilo.css
```

Las carpetas `modulos`, `nucleo` y `util` se conservan para próximas unidades. Los archivos principales y las responsabilidades siguen la estructura de clase.

## Avance de la unidad

Hay siete tablas: clientes, productos, empleados, proveedores, componentes, pedidos y líneas de pedido. Mantienen los campos, tipos, claves y relaciones del `schema.sql` de `017-DarkOrange`, con otros datos de demostración del mismo contexto aeronáutico.

La aplicación permite consultar, crear, editar y eliminar registros. Los formularios se generan desde las columnas de SQLite y las claves primarias se asignan automáticamente. La exportación devuelve todas las tablas en JSON; el servicio de entrada queda reservado.

La API conserva las rutas `modulos`, `entidades`, `estructura`, `tabla`, `registro`, `crear`, `actualizar` y `eliminar`. Las lecturas utilizan GET y las escrituras POST con `FormData`, como en clase. Los errores también se devuelven en JSON.

Ventas, RR. HH., Facturación y Compras se muestran como módulos previstos. Autenticación, permisos, facturas y procesos completos de negocio quedan para unidades posteriores.

## Instalador

Tiene únicamente el formulario de modelo de texto de clase. Por ejemplo:

```text
almacenes
-nombre
-ubicacion
-responsable
```

Crea un `id INTEGER PRIMARY KEY AUTOINCREMENT` y campos de tipo TEXT. No modifica tablas existentes ni borra sus registros. Las tablas nuevas aparecen en el menú al volver a la aplicación.

El modelo textual no define tipos numéricos ni relaciones. Por eso las siete tablas de demostración se entregan ya preparadas desde `schema.sql`; el instalador no ofrece un selector para instalar ese modelo. `modelodedatos.txt` conserva un ejemplo completo del formato de clase. `schema.sql` y `demo.sql` documentan la base entregada; volver a ejecutar estos dos archivos sobre la demostración intacta no duplica sus ejemplos.

## Decisiones

- **HTML, CSS y JavaScript sin frameworks:** mantienen el nivel y la forma de trabajar de la unidad. Se usan funciones sencillas, variables y comentarios en español, `fetch` y `.then`.
- **PHP y SQLite:** conservan la arquitectura de clase. PHP organiza las operaciones con `switch` y la base local permite practicar sin configurar un servidor de bases de datos.
- **Marca compartida:** `data/config.php` contiene `nombre` y `color`. El ERP, el instalador y la web leen esa configuración. El color inicial es DarkGoldenRod, `#B8860B`.
- **Diseño propio:** dorado predominante en cabecera, navegación, portada e instalador; títulos con serif, tarjetas en tres columnas y una web con presentación centrada. Las tablas y formularios tienen fondos claros para facilitar la lectura.
- **Datos independientes:** la base se llama `darkgoldenrod.db`; no utiliza ni modifica bases de otros proyectos. Todos los nombres y contactos de ejemplo son ficticios.
- **Validación básica:** consultas preparadas, comprobación de tipos y relaciones, confirmación de borrado y mensajes de error. La instalación se realiza en una transacción para no dejar tablas a medio crear.
- **Texto seguro:** los valores de los registros se muestran como texto y no se ejecutan como HTML.

La referencia de alcance es la versión final `017-DarkOrange`, junto con el planteamiento de entrega de la unidad. El informe `016-DarkOrange` documenta una etapa anterior; el cierre de la unidad añade el CRUD.
