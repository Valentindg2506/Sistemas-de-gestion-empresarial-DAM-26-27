<?php

	header("Content-Type: application/json; charset=utf-8");

	$db = new SQLite3("../data/darkorange.db");

	$ruta = $_GET["ruta"] ?? "";

	function tablaValida($db,$tabla){

		$stmt = $db->prepare("
			SELECT name
			FROM sqlite_master
			WHERE type = 'table'
			AND name = :tabla
			AND name NOT LIKE 'sqlite_%'
		");

		$stmt->bindValue(":tabla",$tabla,SQLITE3_TEXT);

		$resultado = $stmt->execute();

		return $resultado->fetchArray(SQLITE3_ASSOC) != false;

	}


	function columnasTabla($db,$tabla){

		$tablaSegura = str_replace('"','""',$tabla);

		$resultado = $db->query('PRAGMA table_info("'.$tablaSegura.'")');

		$columnas = [];

		while($fila = $resultado->fetchArray(SQLITE3_ASSOC)){

			$columnas[] = $fila;

		}

		return $columnas;

	}


	function clavePrimaria($db,$tabla){

		$columnas = columnasTabla($db,$tabla);

		foreach($columnas as $columna){

			if($columna["pk"] == 1){

				return $columna["name"];

			}

		}

		return null;

	}


	switch($ruta){


		case "modulos":

			echo json_encode([
				"ventas",
				"rrhh",
				"facturacion",
				"compras"
			]);

		break;


		case "entidades":

			$result = $db->query("
				SELECT name
				FROM sqlite_master
				WHERE type='table'
				AND name NOT LIKE 'sqlite_%'
				ORDER BY name
			");

			$entidades = [];

			while($fila = $result->fetchArray(SQLITE3_ASSOC)){

				$entidades[] = $fila["name"];

			}

			echo json_encode($entidades);

		break;


		case "estructura":

			$tabla = $_GET["tabla"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"error"=>"Tabla no válida"
				]);

				break;

			}

			echo json_encode([
				"columnas"=>columnasTabla($db,$tabla),
				"clavePrimaria"=>clavePrimaria($db,$tabla)
			]);

		break;


		case "tabla":

			$tabla = $_GET["tabla"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"error"=>"Tabla no válida"
				]);

				break;

			}

			$tablaSegura = str_replace('"','""',$tabla);

			$result = $db->query('SELECT * FROM "'.$tablaSegura.'"');

			$registros = [];

			while($fila = $result->fetchArray(SQLITE3_ASSOC)){

				$registros[] = $fila;

			}

			echo json_encode([
				"registros"=>$registros,
				"clavePrimaria"=>clavePrimaria($db,$tabla)
			]);

		break;


		case "registro":

			$tabla = $_GET["tabla"] ?? "";
			$id = $_GET["id"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"error"=>"Tabla no válida"
				]);

				break;

			}

			$clavePrimaria = clavePrimaria($db,$tabla);

			if($clavePrimaria == null){

				echo json_encode([
					"error"=>"La tabla no tiene clave primaria"
				]);

				break;

			}

			$tablaSegura = str_replace('"','""',$tabla);
			$claveSegura = str_replace('"','""',$clavePrimaria);

			$stmt = $db->prepare(
				'SELECT * FROM "'.$tablaSegura.'" WHERE "'.$claveSegura.'" = :id'
			);

			$stmt->bindValue(":id",$id);

			$resultado = $stmt->execute();

			$registro = $resultado->fetchArray(SQLITE3_ASSOC);

			echo json_encode([
				"registro"=>$registro,
				"clavePrimaria"=>$clavePrimaria
			]);

		break;


		case "crear":

			$tabla = $_POST["tabla"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"ok"=>false,
					"error"=>"Tabla no válida"
				]);

				break;

			}

			$columnas = columnasTabla($db,$tabla);

			$campos = [];
			$valores = [];
			$datos = [];

			foreach($columnas as $columna){

				if($columna["pk"] == 1){
					continue;
				}

				$nombre = $columna["name"];

				if(isset($_POST[$nombre])){

					$campos[] = '"'.str_replace('"','""',$nombre).'"';
					$valores[] = ":".$nombre;
					$datos[$nombre] = $_POST[$nombre];

				}

			}

			if(count($campos) == 0){

				echo json_encode([
					"ok"=>false,
					"error"=>"No hay datos para insertar"
				]);

				break;

			}

			$tablaSegura = str_replace('"','""',$tabla);

			$sql = 'INSERT INTO "'.$tablaSegura.'" (';
			$sql .= implode(",",$campos);
			$sql .= ") VALUES (";
			$sql .= implode(",",$valores);
			$sql .= ")";

			$stmt = $db->prepare($sql);

			foreach($datos as $clave=>$valor){

				$stmt->bindValue(":".$clave,$valor,SQLITE3_TEXT);

			}

			$resultado = $stmt->execute();

			echo json_encode([
				"ok"=>$resultado != false
			]);

		break;


		case "actualizar":

			$tabla = $_POST["tabla"] ?? "";
			$id = $_POST["id"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"ok"=>false,
					"error"=>"Tabla no válida"
				]);

				break;

			}

			$clavePrimaria = clavePrimaria($db,$tabla);

			if($clavePrimaria == null){

				echo json_encode([
					"ok"=>false,
					"error"=>"La tabla no tiene clave primaria"
				]);

				break;

			}

			$columnas = columnasTabla($db,$tabla);

			$sets = [];
			$datos = [];

			foreach($columnas as $columna){

				if($columna["pk"] == 1){
					continue;
				}

				$nombre = $columna["name"];

				if(isset($_POST[$nombre])){

					$sets[] = '"'.str_replace('"','""',$nombre).'" = :'.$nombre;
					$datos[$nombre] = $_POST[$nombre];

				}

			}

			$tablaSegura = str_replace('"','""',$tabla);
			$claveSegura = str_replace('"','""',$clavePrimaria);

			$sql = 'UPDATE "'.$tablaSegura.'" SET ';
			$sql .= implode(",",$sets);
			$sql .= ' WHERE "'.$claveSegura.'" = :id';

			$stmt = $db->prepare($sql);

			foreach($datos as $clave=>$valor){

				$stmt->bindValue(":".$clave,$valor,SQLITE3_TEXT);

			}

			$stmt->bindValue(":id",$id);

			$resultado = $stmt->execute();

			echo json_encode([
				"ok"=>$resultado != false
			]);

		break;


		case "eliminar":

			$tabla = $_POST["tabla"] ?? "";
			$id = $_POST["id"] ?? "";

			if(!tablaValida($db,$tabla)){

				echo json_encode([
					"ok"=>false,
					"error"=>"Tabla no válida"
				]);

				break;

			}

			$clavePrimaria = clavePrimaria($db,$tabla);

			if($clavePrimaria == null){

				echo json_encode([
					"ok"=>false,
					"error"=>"La tabla no tiene clave primaria"
				]);

				break;

			}

			$tablaSegura = str_replace('"','""',$tabla);
			$claveSegura = str_replace('"','""',$clavePrimaria);

			$stmt = $db->prepare(
				'DELETE FROM "'.$tablaSegura.'" WHERE "'.$claveSegura.'" = :id'
			);

			$stmt->bindValue(":id",$id);

			$resultado = $stmt->execute();

			echo json_encode([
				"ok"=>$resultado != false
			]);

		break;


		default:

			echo json_encode([
				"error"=>"Ruta no encontrada"
			]);

		break;

	}


	$db->close();

?>
