-- Datos ficticios para practicar las operaciones del CRUD de la unidad.
-- Los identificadores fijos permiten repetir este archivo sin duplicar ejemplos.
INSERT OR IGNORE INTO clientes (nombre, pais, telefono, email, identificador) VALUES
('Aurora Aero', 'España', '910000201', 'operaciones@auroraaero.example', 1),
('Sierra Wings', 'Portugal', '351000202', 'compras@sierrawings.example', 2),
('Meridiana Air', 'Italia', '390000203', 'flota@meridianaair.example', 3),
('Vela Aeronautics', 'Francia', '330000204', 'pedidos@velaaero.example', 4);

INSERT OR IGNORE INTO productos (nombre, tipo, precio, capacidad, autonomia, identificador) VALUES
('DG-80 Duna', 'Regional', 38000000, 80, 2900, 1),
('DG-160 Siroco', 'Medio alcance', 95000000, 160, 5600, 2),
('DG-280 Solano', 'Largo alcance', 170000000, 280, 10900, 3);

INSERT OR IGNORE INTO empleados (nombre, apellidos, departamento, puesto, salario, identificador) VALUES
('Clara', 'Fuentes', 'Administración', 'Técnica administrativa', 35000, 1),
('Diego', 'Serrano', 'Ingeniería', 'Ingeniero de sistemas', 47000, 2),
('Alba', 'Romero', 'Recursos humanos', 'Técnica de personal', 32000, 3);

INSERT OR IGNORE INTO proveedores (nombre, pais, especialidad, email, identificador) VALUES
('Oliva Motores', 'España', 'Propulsión', 'ventas@olivamotores.example', 1),
('Ámbar Materiales', 'Alemania', 'Materiales compuestos', 'ventas@ambarmateriales.example', 2),
('Prisma Sistemas', 'Francia', 'Aviónica', 'ventas@prismasistemas.example', 3);

INSERT OR IGNORE INTO componentes (nombre, tipo, proveedor_id, precio, stock, identificador) VALUES
('Turbina OM-18', 'Motor', 1, 2800000, 12, 1),
('Panel AM-40', 'Estructura', 2, 18000, 70, 2),
('Control PS-7', 'Aviónica', 3, 75000, 24, 3);

INSERT OR IGNORE INTO pedidos (fecha, estado, cliente_id, total, identificador) VALUES
('2026-10-01', 'En preparación', 1, 76000000, 1),
('2026-10-03', 'Confirmado', 3, 95000000, 2);

INSERT OR IGNORE INTO lineaspedido (pedido_id, producto_id, cantidad, precio_unitario, identificador) VALUES
(1, 1, 2, 38000000, 1),
(2, 2, 1, 95000000, 2);
