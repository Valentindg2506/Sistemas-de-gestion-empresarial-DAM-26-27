<?php

switch ($_GET['ruta']) {

    case "modulos":
        echo '
            ["ventas", "rrhh", "facturacion", "compras"]
        ';
        break;

    case "entidades":
        $db = new SQLite3('../data/darkorange.db');

        $result = $db->query("
            SELECT name
            FROM sqlite_master
            WHERE type = 'table';
        ");

        $entidades = [];

        while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
            $entidades[] = $fila['name'];
        }

        echo json_encode($entidades);

        $db->close();
        break;

    case "tabla":
        echo '
            {
                "clientes": [
                    {
                        "id": 1,
                        "nombre": "Carlos",
                        "apellidos": "Martínez López",
                        "email": "carlos.martinez@example.com",
                        "telefono": "+34 611 234 501",
                        "tipo": "comprador",
                        "estado": "interesado",
                        "ciudad": "Valencia",
                        "presupuesto": 250000
                    },
                    {
                        "id": 2,
                        "nombre": "Laura",
                        "apellidos": "García Ferrer",
                        "email": "laura.garcia@example.com",
                        "telefono": "+34 622 345 612",
                        "tipo": "vendedor",
                        "estado": "contactado",
                        "ciudad": "Valencia",
                        "presupuesto": 320000
                    },
                    {
                        "id": 3,
                        "nombre": "Javier",
                        "apellidos": "Sánchez Navarro",
                        "email": "javier.sanchez@example.com",
                        "telefono": "+34 633 456 723",
                        "tipo": "comprador",
                        "estado": "nuevo",
                        "ciudad": "Torrent",
                        "presupuesto": 180000
                    },
                    {
                        "id": 4,
                        "nombre": "María",
                        "apellidos": "Pérez Romero",
                        "email": "maria.perez@example.com",
                        "telefono": "+34 644 567 834",
                        "tipo": "vendedor",
                        "estado": "interesado",
                        "ciudad": "Paterna",
                        "presupuesto": 295000
                    },
                    {
                        "id": 5,
                        "nombre": "Daniel",
                        "apellidos": "Gómez Ruiz",
                        "email": "daniel.gomez@example.com",
                        "telefono": "+34 655 678 945",
                        "tipo": "comprador",
                        "estado": "contactado",
                        "ciudad": "Valencia",
                        "presupuesto": 210000
                    },
                    {
                        "id": 6,
                        "nombre": "Lucía",
                        "apellidos": "Torres Martín",
                        "email": "lucia.torres@example.com",
                        "telefono": "+34 666 789 156",
                        "tipo": "comprador",
                        "estado": "compró",
                        "ciudad": "Mislata",
                        "presupuesto": 235000
                    },
                    {
                        "id": 7,
                        "nombre": "Pablo",
                        "apellidos": "Navarro Gil",
                        "email": "pablo.navarro@example.com",
                        "telefono": "+34 677 890 267",
                        "tipo": "vendedor",
                        "estado": "vendió",
                        "ciudad": "Burjassot",
                        "presupuesto": 275000
                    },
                    {
                        "id": 8,
                        "nombre": "Sofía",
                        "apellidos": "Moreno Vidal",
                        "email": "sofia.moreno@example.com",
                        "telefono": "+34 688 901 378",
                        "tipo": "comprador",
                        "estado": "no contesta",
                        "ciudad": "Valencia",
                        "presupuesto": 300000
                    },
                    {
                        "id": 9,
                        "nombre": "Álvaro",
                        "apellidos": "Castro Molina",
                        "email": "alvaro.castro@example.com",
                        "telefono": "+34 699 012 489",
                        "tipo": "vendedor",
                        "estado": "nuevo",
                        "ciudad": "Aldaia",
                        "presupuesto": 190000
                    },
                    {
                        "id": 10,
                        "nombre": "Claudia",
                        "apellidos": "Ortega Pastor",
                        "email": "claudia.ortega@example.com",
                        "telefono": "+34 610 123 590",
                        "tipo": "comprador",
                        "estado": "interesado",
                        "ciudad": "Valencia",
                        "presupuesto": 350000
                    },
                    {
                        "id": 11,
                        "nombre": "Miguel",
                        "apellidos": "Vázquez Costa",
                        "email": "miguel.vazquez@example.com",
                        "telefono": "+34 621 234 601",
                        "tipo": "vendedor",
                        "estado": "contactado",
                        "ciudad": "Sagunto",
                        "presupuesto": 225000
                    },
                    {
                        "id": 12,
                        "nombre": "Elena",
                        "apellidos": "Ramos Ferri",
                        "email": "elena.ramos@example.com",
                        "telefono": "+34 632 345 712",
                        "tipo": "comprador",
                        "estado": "nuevo",
                        "ciudad": "Valencia",
                        "presupuesto": 275000
                    },
                    {
                        "id": 13,
                        "nombre": "Adrián",
                        "apellidos": "Ibáñez Soler",
                        "email": "adrian.ibanez@example.com",
                        "telefono": "+34 643 456 823",
                        "tipo": "comprador",
                        "estado": "descartado",
                        "ciudad": "Manises",
                        "presupuesto": 160000
                    },
                    {
                        "id": 14,
                        "nombre": "Nuria",
                        "apellidos": "Blasco Pérez",
                        "email": "nuria.blasco@example.com",
                        "telefono": "+34 654 567 934",
                        "tipo": "vendedor",
                        "estado": "interesado",
                        "ciudad": "Valencia",
                        "presupuesto": 410000
                    },
                    {
                        "id": 15,
                        "nombre": "Sergio",
                        "apellidos": "Mora Sánchez",
                        "email": "sergio.mora@example.com",
                        "telefono": "+34 665 678 145",
                        "tipo": "comprador",
                        "estado": "contactado",
                        "ciudad": "Xirivella",
                        "presupuesto": 200000
                    },
                    {
                        "id": 16,
                        "nombre": "Andrea",
                        "apellidos": "Domínguez León",
                        "email": "andrea.dominguez@example.com",
                        "telefono": "+34 676 789 256",
                        "tipo": "vendedor",
                        "estado": "nuevo",
                        "ciudad": "Paterna",
                        "presupuesto": 330000
                    },
                    {
                        "id": 17,
                        "nombre": "Fernando",
                        "apellidos": "Herrera Martí",
                        "email": "fernando.herrera@example.com",
                        "telefono": "+34 687 890 367",
                        "tipo": "comprador",
                        "estado": "compró",
                        "ciudad": "Valencia",
                        "presupuesto": 290000
                    },
                    {
                        "id": 18,
                        "nombre": "Paula",
                        "apellidos": "Esteban Navarro",
                        "email": "paula.esteban@example.com",
                        "telefono": "+34 698 901 478",
                        "tipo": "vendedor",
                        "estado": "vendió",
                        "ciudad": "Torrent",
                        "presupuesto": 265000
                    },
                    {
                        "id": 19,
                        "nombre": "Rubén",
                        "apellidos": "Serrano Vidal",
                        "email": "ruben.serrano@example.com",
                        "telefono": "+34 609 012 589",
                        "tipo": "comprador",
                        "estado": "no contesta",
                        "ciudad": "Valencia",
                        "presupuesto": 240000
                    },
                    {
                        "id": 20,
                        "nombre": "Cristina",
                        "apellidos": "Ferrer Martínez",
                        "email": "cristina.ferrer@example.com",
                        "telefono": "+34 620 123 690",
                        "tipo": "comprador",
                        "estado": "interesado",
                        "ciudad": "Alboraya",
                        "presupuesto": 380000
                    }
                ]
            }
        ';
        break;
}
?>
