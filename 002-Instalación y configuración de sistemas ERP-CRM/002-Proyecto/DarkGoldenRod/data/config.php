<?php

	// El nombre y el color se comparten con el ERP, el instalador y la web.
	header("Content-Type: application/json; charset=utf-8");
	header("Cache-Control: no-store");

	echo json_encode([
		"nombre" => "DarkGoldenRod",
		"color" => "#B8860B"
	], JSON_UNESCAPED_UNICODE);

?>
