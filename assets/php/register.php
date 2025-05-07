<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calorease";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("error en conexion: " . $conn->connect_error);
}
//cargar 
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $usuario = $_POST['usuario'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';
    $contrasena2 = $_POST['contrasena2'] ?? '';

    
    if ($contrasena === $contrasena2) {
        $sql = "INSERT INTO usuario (email, contraseña)
                VALUES ('$email', '$contrasena');";
        
        if ($conn->query($sql) === TRUE) {
            echo "Usuario cargado correctamente *aca poner pantalla bonita*";
            echo"<br>";
            echo '<h2> <a href="../../Views/user/login.html">Logearse</a> </h2>';
            echo"<br>";
            echo '<h2> <a href="../../index.html">Ir a inicio</a> </h2>';
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "contraseñas distintas";
    }
}
?>