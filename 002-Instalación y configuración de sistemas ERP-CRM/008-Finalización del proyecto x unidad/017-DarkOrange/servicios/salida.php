<?php

$db = new SQLite3('../data/darkorange.db');

$result = $db->query("
	SELECT name
	FROM sqlite_master
	WHERE type='table'
	AND name NOT LIKE 'sqlite_%'
	ORDER BY name
");

$basededatos = [];

while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {

	$tabla = $fila['name'];

	$resultadoTabla = $db->query(
		'SELECT * FROM "' . str_replace('"', '""', $tabla) . '"'
	);

	$registros = [];

	while ($registro = $resultadoTabla->fetchArray(SQLITE3_ASSOC)) {
		$registros[] = $registro;
	}

	$basededatos[$tabla] = $registros;
}

header('Content-Type: application/json; charset=utf-8');

echo json_encode(
	$basededatos,
	JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
);

$db->close();

?>
