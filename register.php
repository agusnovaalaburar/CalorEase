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
$email = $_POST["email"];

$usuario = $_POST["usuario"];

$contraseña = $_POST["contraseña"];

$contraseña2 = $_POST["contraseña2"]

if($contraseña == $contraseña2)
{

$sql = "INSERT INTO usuarios (id_usuario, email, usuario, contraseña)
VALUES ('', '$email', '$usuario', '$contraseña');";
}
else
{
    echo "contraseñas distintas";
}

if ($conn->query($sql) === TRUE) {
  echo "cargado";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();





?>