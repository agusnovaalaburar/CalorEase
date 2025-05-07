<?php
session_start(); // Importante: iniciar la sesión

include '../conexion.php';

// Verificar que el usuario esté logueado
if (!isset($_SESSION['id_usuario'])) {
    echo "Sesión no iniciada.";
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// Verificar conexión
$conexion = new mysqli("localhost", "root", "", "calorease");
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Función para limpiar datos
function limpiar($valor)
{
    return htmlspecialchars(strip_tags(trim($valor)));
}

// Verificar que se enviaron los datos requeridos
if (
    isset($_POST['nombre'], $_POST['apellido'], $_POST['altura'], $_POST['peso'], $_POST['objKCAL'], $_POST['objetivo_fisico']) &&
    !empty($_POST['nombre']) && !empty($_POST['apellido']) &&
    is_numeric($_POST['altura']) && is_numeric($_POST['peso']) && is_numeric($_POST['objKCAL'])
) {
    // Limpiar y almacenar
    $nombre = limpiar($_POST['nombre']);
    $apellido = limpiar($_POST['apellido']);
    $altura = floatval($_POST['altura']);
    $peso = floatval($_POST['peso']);
    $objKCAL = intval($_POST['objKCAL']);
    $objetivo = limpiar($_POST['objetivo_fisico']);

    // Calcular IMC
    $imc = $peso / pow($altura, 2);

    // Log de depuración
    error_log("Datos recibidos: $nombre, $apellido, $altura, $peso, $imc, $objKCAL, $objetivo, ID: $id_usuario");

    // Actualizar los datos en la tabla usuario
    $stmt = $conexion->prepare("UPDATE usuario SET Nombre = ?, Apellido = ?, Altura = ?, Peso = ?, IMC = ?, Obj_KCAL = ?, Obj_Fisico = ? WHERE id = ?");
    $stmt->bind_param("ssdddssi", $nombre, $apellido, $altura, $peso, $imc, $objKCAL, $objetivo, $id_usuario);

    if ($stmt->execute()) {
        echo "Datos actualizados con éxito.";
    } else {
        echo "Error al actualizar: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Faltan campos obligatorios o hay valores no válidos.";
}

$conexion->close();
?>