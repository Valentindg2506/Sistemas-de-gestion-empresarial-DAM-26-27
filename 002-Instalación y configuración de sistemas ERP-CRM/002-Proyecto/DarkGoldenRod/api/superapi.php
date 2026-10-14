<?php

	header("Content-Type: application/json; charset=utf-8");
	header("Cache-Control: no-store");

	// Todas las rutas devuelven JSON, también cuando hay un error.
	function responder($datos, $estado = 200){
		http_response_code($estado);
		echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
		exit;
	}

	function nombreSeguro($nombre){
		return '"'.str_replace('"', '""', $nombre).'"';
	}

	function tablaValida($db, $tabla){
		$stmt = $db->prepare("SELECT name FROM sqlite_master
			WHERE type = 'table' AND name = :tabla AND name NOT LIKE 'sqlite_%'");
		$stmt->bindValue(":tabla", $tabla, SQLITE3_TEXT);
		return $stmt->execute()->fetchArray(SQLITE3_ASSOC) != false;
	}

	function columnasTabla($db, $tabla){
		$resultado = $db->query("PRAGMA table_info(".nombreSeguro($tabla).")");
		$columnas = [];
		while($fila = $resultado->fetchArray(SQLITE3_ASSOC)){
			$columnas[] = $fila;
		}
		return $columnas;
	}

	function clavePrimaria($columnas){
		foreach($columnas as $columna){
			if($columna["pk"] == 1){
				return $columna["name"];
			}
		}
		return null;
	}

	function buscarRegistro($db, $tabla, $clave, $id){
		$stmt = $db->prepare("SELECT * FROM ".nombreSeguro($tabla).
			" WHERE ".nombreSeguro($clave)." = :id");
		$stmt->bindValue(":id", $id, SQLITE3_INTEGER);
		return $stmt->execute()->fetchArray(SQLITE3_ASSOC);
	}

	// Recojo solo columnas reales. La clave primaria la genera SQLite.
	function recogerDatos($columnas){
		$datos = [];
		foreach($columnas as $columna){
			$nombre = $columna["name"];
			if($columna["pk"] == 1 || !array_key_exists($nombre, $_POST)){
				continue;
			}
			if(!is_string($_POST[$nombre])){
				responder(["ok" => false, "error" => "El campo ".$nombre." no es válido."], 400);
			}
			$valor = $_POST[$nombre];
			$tipo = strtoupper($columna["type"]);
			$tipoSQLite = SQLITE3_TEXT;
			if($tipo == "INTEGER" || $tipo == "REAL"){
				if(trim($valor) == ""){
					$valor = null;
					$tipoSQLite = SQLITE3_NULL;
				}else if($tipo == "INTEGER"){
					$valor = filter_var(trim($valor), FILTER_VALIDATE_INT);
					if($valor === false){
						responder(["ok" => false, "error" => "El campo ".$nombre." necesita un número entero."], 400);
					}
					$tipoSQLite = SQLITE3_INTEGER;
				}else{
					if(!is_numeric($valor) || !is_finite((float)$valor)){
						responder(["ok" => false, "error" => "El campo ".$nombre." necesita un número."], 400);
					}
					$valor = (float)$valor;
					$tipoSQLite = SQLITE3_FLOAT;
				}
			}
			$datos[$nombre] = ["valor" => $valor, "tipo" => $tipoSQLite];
		}
		if(count($datos) == 0){
			responder(["ok" => false, "error" => "No hay datos para guardar."], 400);
		}
		return $datos;
	}

	$ruta = $_GET["ruta"] ?? "";
	if(!is_string($ruta)){
		responder(["ok" => false, "error" => "Ruta no válida."], 400);
	}
	$rutasLectura = ["modulos", "entidades", "estructura", "tabla", "registro"];
	$rutasEscritura = ["crear", "actualizar", "eliminar"];
	if(!in_array($ruta, array_merge($rutasLectura, $rutasEscritura))){
		responder(["ok" => false, "error" => "Ruta no encontrada."], 404);
	}
	$metodo = in_array($ruta, $rutasEscritura) ? "POST" : "GET";
	if($_SERVER["REQUEST_METHOD"] != $metodo){
		header("Allow: ".$metodo);
		responder(["ok" => false, "error" => "Esta ruta necesita una petición ".$metodo."."], 405);
	}
	if($ruta == "modulos"){
		responder(["ventas", "rrhh", "facturacion", "compras"]);
	}

	$archivo = __DIR__."/../data/darkgoldenrod.db";
	if(!is_file($archivo)){
		responder(["ok" => false, "error" => "La base de datos todavía no está instalada. Abre el instalador."], 503);
	}

	try{
		// Uso una ruta absoluta para que no dependa de dónde arranque PHP.
		$db = new SQLite3($archivo, SQLITE3_OPEN_READWRITE);
		$db->enableExceptions(true);
		$db->busyTimeout(5000);
		$db->exec("PRAGMA foreign_keys = ON");

		if($ruta == "entidades"){
			$resultado = $db->query("SELECT name FROM sqlite_master
				WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
			$entidades = [];
			while($fila = $resultado->fetchArray(SQLITE3_ASSOC)){
				$entidades[] = $fila["name"];
			}
			responder($entidades);
		}

		$entrada = $metodo == "POST" ? $_POST : $_GET;
		$tabla = $entrada["tabla"] ?? "";
		if(!is_string($tabla) || !tablaValida($db, $tabla)){
			responder(["ok" => false, "error" => "Tabla no válida."], 400);
		}
		$columnas = columnasTabla($db, $tabla);
		$clave = clavePrimaria($columnas);

		if(in_array($ruta, ["registro", "actualizar", "eliminar"])){
			if($clave == null){
				responder(["ok" => false, "error" => "La tabla no tiene clave primaria."], 400);
			}
			$id = $entrada["id"] ?? "";
			if(!is_string($id) || filter_var($id, FILTER_VALIDATE_INT) === false){
				responder(["ok" => false, "error" => "Identificador no válido."], 400);
			}
			$registro = buscarRegistro($db, $tabla, $clave, (int)$id);
			if($registro === false){
				responder(["ok" => false, "error" => "El registro ya no existe."], 404);
			}
		}

		switch($ruta){
			case "estructura":
				responder(["columnas" => $columnas, "clavePrimaria" => $clave]);
			break;

			case "tabla":
				$resultado = $db->query("SELECT * FROM ".nombreSeguro($tabla));
				$registros = [];
				while($fila = $resultado->fetchArray(SQLITE3_ASSOC)){
					$registros[] = $fila;
				}
				responder(["registros" => $registros, "clavePrimaria" => $clave]);
			break;

			case "registro":
				responder(["registro" => $registro, "clavePrimaria" => $clave]);
			break;

			case "crear":
			case "actualizar":
				$datos = recogerDatos($columnas);
				$campos = [];
				$valores = [];
				$asignaciones = [];
				$contador = 0;
				foreach($datos as $nombre => $dato){
					$parametro = ":campo".$contador;
					$campos[] = nombreSeguro($nombre);
					$valores[] = $parametro;
					$asignaciones[] = nombreSeguro($nombre)." = ".$parametro;
					$contador++;
				}
				if($ruta == "crear"){
					$sql = "INSERT INTO ".nombreSeguro($tabla)." (".implode(",", $campos).
						") VALUES (".implode(",", $valores).")";
				}else{
					$sql = "UPDATE ".nombreSeguro($tabla)." SET ".implode(",", $asignaciones).
						" WHERE ".nombreSeguro($clave)." = :id";
				}
				// Los valores van separados de la consulta, con parámetros preparados.
				$stmt = $db->prepare($sql);
				$contador = 0;
				foreach($datos as $dato){
					$stmt->bindValue(":campo".$contador, $dato["valor"], $dato["tipo"]);
					$contador++;
				}
				if($ruta == "actualizar"){
					$stmt->bindValue(":id", (int)$id, SQLITE3_INTEGER);
				}
				$stmt->execute();
				responder(["ok" => true]);
			break;

			case "eliminar":
				$stmt = $db->prepare("DELETE FROM ".nombreSeguro($tabla).
					" WHERE ".nombreSeguro($clave)." = :id");
				$stmt->bindValue(":id", (int)$id, SQLITE3_INTEGER);
				$stmt->execute();
				responder(["ok" => true]);
			break;
		}
	}catch(Throwable $error){
		$codigo = isset($db) ? $db->lastErrorCode() : 0;
		if($codigo == 19){
			responder(["ok" => false, "error" => "No se puede guardar o eliminar: revisa los identificadores relacionados y los registros que dependen de este."], 409);
		}
		responder(["ok" => false, "error" => "No se pudo completar la operación en la base de datos."], 500);
	}

?>
