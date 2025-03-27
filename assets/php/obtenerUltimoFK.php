<?php
// obtenerUltimoFK.php

// Configura tu conexión a la base de datos
$host = 'localhost';
$dbname = 'formulario';
$username = 'root';
$password = '';

try {
    // Conexión a la base de datos
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para obtener el último valor de la columna FK
    $query = "SELECT id_huella FROM footprint ORDER BY id_huella DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Obtenemos el último valor de la FK
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    // Devolvemos el resultado en formato JSON
    echo json_encode($resultado);
} catch (PDOException $e) {
    // En caso de error, devolvemos un mensaje
    echo json_encode(['error' => $e->getMessage()]);
}
?>