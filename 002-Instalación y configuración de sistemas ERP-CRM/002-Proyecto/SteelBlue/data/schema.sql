PRAGMA foreign_keys = ON;

-- Mantengo las siete entidades y las relaciones del modelo de clase.
CREATE TABLE IF NOT EXISTS clientes(
    nombre TEXT,
    pais TEXT,
    telefono TEXT,
    email TEXT,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS productos(
    nombre TEXT,
    tipo TEXT,
    precio REAL,
    capacidad INTEGER,
    autonomia INTEGER,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS empleados(
    nombre TEXT,
    apellidos TEXT,
    departamento TEXT,
    puesto TEXT,
    salario REAL,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS proveedores(
    nombre TEXT,
    pais TEXT,
    especialidad TEXT,
    email TEXT,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS pedidos(
    fecha TEXT,
    estado TEXT,
    cliente_id INTEGER,
    total REAL,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(cliente_id) REFERENCES clientes(identificador)
);

CREATE TABLE IF NOT EXISTS lineaspedido(
    pedido_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    precio_unitario REAL,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(pedido_id) REFERENCES pedidos(identificador),
    FOREIGN KEY(producto_id) REFERENCES productos(identificador)
);

CREATE TABLE IF NOT EXISTS componentes(
    nombre TEXT,
    tipo TEXT,
    proveedor_id INTEGER,
    precio REAL,
    stock INTEGER,
    identificador INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(proveedor_id) REFERENCES proveedores(identificador)
);
