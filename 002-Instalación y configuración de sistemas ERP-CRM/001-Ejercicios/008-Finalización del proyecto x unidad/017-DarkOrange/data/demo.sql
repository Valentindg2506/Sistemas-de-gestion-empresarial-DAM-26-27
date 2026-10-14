INSERT INTO clientes VALUES
('Iberia','España','915874100','compras@iberia.es',NULL),
('Lufthansa','Alemania','496986799','procurement@lufthansa.de',NULL),
('Air France','Francia','331415656','compras@airfrance.fr',NULL),
('Emirates','Emiratos Árabes Unidos','97147081111','purchasing@emirates.ae',NULL);

INSERT INTO productos VALUES
('Aquila 100','Regional',89000000,90,3500,NULL),
('Aquila 200','Medio alcance',125000000,160,6200,NULL),
('Condor 400','Largo alcance',245000000,280,12000,NULL);

INSERT INTO empleados VALUES
('Ana','Martínez','Ingeniería','Ingeniera aeronáutica',52000,NULL),
('Carlos','García','Ingeniería','Ingeniero de motores',55000,NULL),
('Laura','Sánchez','Producción','Jefa de producción',62000,NULL);

INSERT INTO proveedores VALUES
('AeroEngines Europe','Reino Unido','Motores','ventas@aeroengines.com',NULL),
('CompositeTech','España','Materiales compuestos','ventas@compositetech.es',NULL),
('Avionics Systems','Estados Unidos','Aviónica','sales@avionics.com',NULL);

INSERT INTO componentes VALUES
('Motor AX-900','Motor',1,12500000,24,NULL),
('Panel fibra carbono','Estructura',2,85000,450,NULL),
('Sistema navegación NAV-X','Aviónica',3,450000,80,NULL);

INSERT INTO pedidos VALUES
('2026-01-15','En fabricación',1,250000000,NULL),
('2026-02-03','Confirmado',2,490000000,NULL);

INSERT INTO lineaspedido VALUES
(1,2,2,125000000,NULL),
(2,3,2,245000000,NULL);
