<?php
if (!isset($_SESSION)) session_start();

// include '../conexion.php';

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
if (!isset($_POST['nombre']) || empty(trim($_POST['nombre']))) {
    echo "Error: el campo 'nombre' es obligatorio.";
} elseif (!isset($_POST['apellido']) || empty(trim($_POST['apellido']))) {
    echo "Error: el campo 'apellido' es obligatorio.";
} elseif (!isset($_POST['altura']) || !is_numeric($_POST['altura'])) {
    echo "Error: el campo 'altura' es obligatorio y debe ser un número.";
} elseif (!isset($_POST['peso']) || !is_numeric($_POST['peso'])) {
    echo "Error: el campo 'peso' es obligatorio y debe ser un número.";
} elseif (!isset($_POST['objKCAL']) || !is_numeric($_POST['objKCAL'])) {
    echo "Error: el campo 'objKCAL' es obligatorio y debe ser un número.";
} elseif (!isset($_POST['objetivo_fisico']) || empty(trim($_POST['objetivo_fisico']))) {
    echo "Error: debes seleccionar un objetivo físico.";
} else {
    // Si todos los datos están bien, seguir con la lógica
    $nombre = limpiar($_POST['nombre']);
    $apellido = limpiar($_POST['apellido']);
    $altura = floatval($_POST['altura']);
    $peso = floatval($_POST['peso']);
    $objKCAL = intval($_POST['objKCAL']);
    $objetivo = limpiar($_POST['objetivo_fisico']);

    $imc = $peso / pow($altura, 2);

    error_log("Datos recibidos: $nombre, $apellido, $altura, $peso, $imc, $objKCAL, $objetivo, ID: $id_usuario");

    $stmt = $conexion->prepare("UPDATE usuario SET Nombre = ?, Apellido = ?, Altura = ?, Peso = ?, IMC = ?, Obj_KCAL = ?, Obj_Fisico = ? WHERE ID_usuario = ?");
    $stmt->bind_param("ssdddssi", $nombre, $apellido, $altura, $peso, $imc, $objKCAL, $objetivo, $id_usuario);

    if ($stmt->execute()) {
        echo "Datos actualizados con éxito.";
    } else {
        echo "Error al actualizar: " . $stmt->error;
    }

    $stmt->close();
}

$conexion->close();
?>