<?php
session_start();
include 'obtenerUsuario.php';
include 'obtenerDatos.php';

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['id_usuario'])) {
    echo "Acceso denegado. Por favor inicia sesión.";
    exit;
}

// Mostrar contenido de sesión
$id_usuario = $_SESSION['id_usuario'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sesión iniciada</title>
</head>
<body>
    <h1>Bienvenido</h1>
    <p>Has iniciado sesión exitosamente.</p>
    <h1>Hola, <?php echo htmlspecialchars($nombre_usuario); ?>!</h1>
    <p>Tu ID de usuario es: <?php echo htmlspecialchars($id_usuario); ?></p>
    <p>Tu peso es: <?php echo $_SESSION['peso']; ?> kg</p>
    <p>Tu altura es: <?php echo $_SESSION['altura']; ?> cm</p>
    <p>Tu IMC es: <?php echo $_SESSION['imc']; ?></p>
    <p>Tu objetivo calórico: <?php echo $_SESSION['obj_kcal']; ?> kcal</p>
    <p>Tu objetivo físico: <?php echo $_SESSION['obj_fisico']; ?></p>
    <a href="cerrarsesion.php">Cerrar sesión</a>
</body>
</html>
