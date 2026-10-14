-- Todos los nombres y contactos de esta demostración son ficticios.
INSERT INTO clientes (nombre, pais, telefono, email) VALUES
('Brisa Airlines', 'España', '910000101', 'compras@brisa.example'),
('Nordavia', 'Noruega', '470000102', 'flota@nordavia.example'),
('Costa Air', 'Portugal', '351000103', 'pedidos@costaair.example'),
('Horizonte Azul', 'Chile', '560000104', 'compras@horizonte.example');

INSERT INTO productos (nombre, tipo, precio, capacidad, autonomia) VALUES
('SB-90 Albor', 'Regional', 42000000, 90, 3200),
('SB-180 Cierzo', 'Medio alcance', 98000000, 180, 6100),
('SB-300 Boreal', 'Largo alcance', 185000000, 300, 11800);

INSERT INTO empleados (nombre, apellidos, departamento, puesto, salario) VALUES
('Lucía', 'Navarro', 'Ingeniería', 'Ingeniera de estructuras', 48000),
('Mateo', 'Ríos', 'Producción', 'Coordinador de montaje', 46000),
('Elena', 'Vidal', 'Administración', 'Responsable de compras', 44000);

INSERT INTO proveedores (nombre, pais, especialidad, email) VALUES
('Nexo Propulsión', 'España', 'Motores', 'ventas@nexo.example'),
('Atlas Composites', 'Portugal', 'Materiales compuestos', 'ventas@atlas.example'),
('Vector Aviónica', 'Francia', 'Navegación', 'ventas@vector.example');

INSERT INTO componentes (nombre, tipo, proveedor_id, precio, stock) VALUES
('Motor NP-180', 'Motor', 1, 8200000, 18),
('Panel AC-40', 'Estructura', 2, 64000, 320),
('Navegador VA-12', 'Aviónica', 3, 380000, 64);

INSERT INTO pedidos (fecha, estado, cliente_id, total) VALUES
('2026-09-14', 'Confirmado', 1, 196000000),
('2026-09-28', 'En fabricación', 2, 185000000);

INSERT INTO lineaspedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES
(1, 2, 2, 98000000),
(2, 3, 1, 185000000);
