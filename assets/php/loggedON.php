<?php
session_start();

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
    <p>Tu ID de usuario es: <?php echo htmlspecialchars($id_usuario); ?></p>
    <a href="logout.php">Cerrar sesión</a>
</body>
</html>
