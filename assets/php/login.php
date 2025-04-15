<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calorease";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error en conexión: " . $conn->connect_error);
}

// Recibir datos del formulario
$emaillog = $_POST["emaillog"];
$contraseñalog = $_POST["contraseñalog"];

// Evitar inyecciones SQL
$emaillog = $conn->real_escape_string($emaillog);

// Obtener la contraseña del usuario
$sql = "SELECT contraseña FROM usuarios WHERE mail = '$emaillog'";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    echo "Usuario inexistente";
    exit;
}

$row = $result->fetch_assoc();
$pass = $row['contraseña'];

// Verificar contraseña
if ($contraseñalog == $pass) {
    // Obtener id del usuario
    $sql_id = "SELECT id_usuario FROM usuarios WHERE mail = '$emaillog'";
    $result_id = $conn->query($sql_id);

    if ($result_id->num_rows > 0) {
        $row_id = $result_id->fetch_assoc();
        $id = $row_id['id_usuario'];
        
        // Aquí podrías iniciar sesión, guardar la ID, etc.
        echo "Inicio de sesión exitoso. ID de usuario: " . $id;
    } else {
        echo "No se pudo obtener el ID del usuario.";
    }
} else {
    echo "Usuario o contraseña incorrecta";
}

$conn->close();
?>
