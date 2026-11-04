<?php

	// Estos dos valores personalizan la marca del ERP y de la web.
	header("Content-Type: application/json; charset=utf-8");
	header("Cache-Control: no-store");

	echo json_encode([
		"nombre" => "SteelBlue",
		"color" => "#4682B4"
	], JSON_UNESCAPED_UNICODE);

?>
