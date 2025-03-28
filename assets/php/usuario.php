<?php
if (isset($_POST["username"])) {
    $fullName = trim($_POST["username"]);
    $edad = trim($_POST["edad"]);
    $email = trim($_POST["email"]);
    $telefono = trim($_POST["telefono"]);
    $gender = $_POST["genero"];
    $huellaSiNo = $_POST["compensation"];
    $estudianteSiNo = $_POST["estudiante"];

    
    $huellaSiNo = (int)$huellaSiNo;
    $edad = (int)$edad;
    $estudianteSiNo = (int)$estudianteSiNo;


    $dbHost = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbName = 'formulario';

    $conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    else {
        $sql = ("INSERT INTO usuario (nombre, email, telefono, compensar, estudiante, genero, edad) VALUES ('$fullName', '$email', '$telefono', $huellaSiNo, $estudianteSiNo, '$gender', $edad);");
        $result = $conn->query($sql);
    }

    if ($result) {
        echo "<h2>Datos Guardados exitosamente.</h2>";
    } else {
        echo "<h2>Error al guardar los datos: " . $conn->error . "</h2>";
    }

    
}
?>