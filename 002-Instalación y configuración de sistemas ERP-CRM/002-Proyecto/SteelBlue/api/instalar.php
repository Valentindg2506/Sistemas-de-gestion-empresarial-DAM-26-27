<?php

	$titulo = "Instalación completada";
	$mensaje = "";
	$correcto = false;
	$db = null;
	$transaccion = false;
	$tablasModelo = [];

	try{
		if($_SERVER["REQUEST_METHOD"] != "POST"){
			http_response_code(405);
			header("Allow: POST");
			throw new InvalidArgumentException("Abre el formulario del instalador para configurar la base de datos.");
		}

		// Leo el modelo escrito en el formulario, como en el instalador de clase.
		$modelo = $_POST["modelo"] ?? "";
		if(!is_string($modelo) || trim($modelo) == ""){
			throw new InvalidArgumentException("Escribe al menos una tabla en el modelo de datos.");
		}
		$tabla = null;
		$nombres = [];
		foreach(explode("\n", $modelo) as $linea){
			$linea = trim($linea);
			if($linea == ""){
				continue;
			}
			$esCampo = $linea[0] == "-";
			$nombre = $esCampo ? trim(substr($linea, 1)) : $linea;
			if(!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $nombre) || stripos($nombre, "sqlite_") === 0){
				throw new InvalidArgumentException("Los nombres deben usar letras sin tildes, números y guiones bajos, y no empezar por un número ni por sqlite_.");
			}
			if($esCampo){
				if($tabla === null){
					throw new InvalidArgumentException("Escribe el nombre de una tabla antes de sus campos.");
				}
				$columnas = array_map("strtolower", $tablasModelo[$tabla]);
				if(strtolower($nombre) == "id" || in_array(strtolower($nombre), $columnas)){
					throw new InvalidArgumentException("No repitas campos ni añadas id: el instalador lo crea automáticamente.");
				}
				$tablasModelo[$tabla][] = $nombre;
			}else{
				if(in_array(strtolower($nombre), $nombres)){
					throw new InvalidArgumentException("No repitas el nombre de una tabla en el modelo.");
				}
				$tabla = $nombre;
				$nombres[] = strtolower($nombre);
				$tablasModelo[$tabla] = [];
			}
		}

		$db = new SQLite3(__DIR__."/../data/steelblue.db");
		$db->enableExceptions(true);
		$db->busyTimeout(5000);
		$db->exec("PRAGMA foreign_keys = ON");
		// La transacción evita dejar una instalación a medias si hay un error.
		$db->exec("BEGIN IMMEDIATE");
		$transaccion = true;

		// Creo las tablas y añado la clave id automáticamente.
		foreach($tablasModelo as $tabla => $columnas){
			$sql = 'CREATE TABLE IF NOT EXISTS "'.$tabla.'" (id INTEGER PRIMARY KEY AUTOINCREMENT';
			foreach($columnas as $columna){
				$sql .= ', "'.$columna.'" TEXT';
			}
			$sql .= ")";
			$db->exec($sql);
		}
		$mensaje = "Modelo procesado: ".count($tablasModelo)." tablas. Las tablas existentes y sus registros se han conservado. Los campos nuevos son de texto y tienen una clave id automática.";
		$db->exec("COMMIT");
		$transaccion = false;
		$correcto = true;
	}catch(Throwable $error){
		if($db != null && $transaccion){
			$db->exec("ROLLBACK");
		}
		if(http_response_code() < 400){
			http_response_code(400);
		}
		$titulo = "No se pudo completar la instalación";
		$mensaje = $error instanceof InvalidArgumentException
			? $error->getMessage() : "Revisa el modelo y comprueba que PHP puede escribir en la carpeta data.";
	}finally{
		if($db != null){
			$db->close();
		}
	}

?>
<!doctype html>
<html lang="es">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Instalación · SteelBlue</title>
		<link rel="stylesheet" href="../inst.css">
		<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%234682B4'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-family='Arial' font-weight='bold' font-size='16' fill='white'%3ESB%3C/text%3E%3C/svg%3E">
	</head>
	<body>
		<main class="instalacion resultado">
			<a class="marca" href="../web/index.html"><span class="simbolo" aria-hidden="true">SB</span><span data-nombre>SteelBlue</span></a>
			<p class="etiqueta">PUESTA EN MARCHA</p>
			<h1><?= htmlspecialchars($titulo, ENT_QUOTES, "UTF-8") ?></h1>
			<p class="introduccion"><?= htmlspecialchars($mensaje, ENT_QUOTES, "UTF-8") ?></p>
			<div class="enlaces-resultado">
				<?php if($correcto){ ?>
					<a class="boton" href="../index.html">Abrir el ERP <span aria-hidden="true">→</span></a>
				<?php } ?>
				<a class="boton secundario" href="../instalador.html">Volver al instalador</a>
			</div>
		</main>
		<script>
			fetch("../data/config.php", {cache: "no-store"})
			.then(function(respuesta){ return respuesta.json() })
			.then(function(datos){
				document.querySelector("[data-nombre]").textContent = datos.nombre
				document.title = "Instalación · " + datos.nombre
				document.documentElement.style.setProperty("--color_corporativo", datos.color)
			})
			.catch(function(){ /* Mantengo los valores iniciales si no responde la configuración. */ })
		</script>
	</body>
</html>
