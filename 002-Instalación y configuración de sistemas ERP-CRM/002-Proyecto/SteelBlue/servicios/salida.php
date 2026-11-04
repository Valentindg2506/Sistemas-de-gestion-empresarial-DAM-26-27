<?php

	header("Content-Type: application/json; charset=utf-8");
	header("Cache-Control: no-store");
	$archivo = __DIR__."/../data/steelblue.db";
	if(!is_file($archivo)){
		http_response_code(503);
		echo json_encode(["error" => "La base de datos todavía no está instalada."], JSON_UNESCAPED_UNICODE);
		exit;
	}

	try{
		// Para exportar solo necesito abrir la base en modo lectura.
		$db = new SQLite3($archivo, SQLITE3_OPEN_READONLY);
		$db->enableExceptions(true);
		$db->busyTimeout(5000);
		$db->exec("BEGIN");
		$resultado = $db->query("SELECT name FROM sqlite_master
			WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
		$basededatos = [];
		while($fila = $resultado->fetchArray(SQLITE3_ASSOC)){
			$tabla = $fila["name"];
			$tablaSegura = str_replace('"', '""', $tabla);
			$resultadoTabla = $db->query('SELECT * FROM "'.$tablaSegura.'"');
			$registros = [];
			while($registro = $resultadoTabla->fetchArray(SQLITE3_ASSOC)){
				$registros[] = $registro;
			}
			$basededatos[$tabla] = $registros;
		}
		$db->exec("COMMIT");
		$db->close();
		echo json_encode($basededatos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
	}catch(Throwable $error){
		http_response_code(500);
		echo json_encode(["error" => "No se pudo exportar la base de datos."], JSON_UNESCAPED_UNICODE);
	}

?>
