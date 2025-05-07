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
            echo "cargado";
            echo"<br>";
            echo '<a href="../../login.html">Continuar</a>';
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "contraseñas distintas";
    }
}
?>