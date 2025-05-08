<?php
if (!isset($_SESSION)) session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calorease";

// Conexión
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Error en conexión: " . $conn->connect_error);
}

$id_usuario = $_SESSION['id_usuario'];

$sql = "SELECT peso, altura, imc, obj_kcal, obj_fisico FROM usuario WHERE id_usuario = $id_usuario";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $datos = $result->fetch_assoc();

    $_SESSION['peso'] = $datos['peso'];
    $_SESSION['altura'] = $datos['altura'];
    $_SESSION['imc'] = $datos['imc'];
    $_SESSION['obj_kcal'] = $datos['obj_kcal'];
    $_SESSION['obj_fisico'] = $datos['obj_fisico'];

} else {
    echo "Usuario no encontrado.";
}

$conn->close();
?>
