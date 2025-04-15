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
$email = $_POST["emailreg"] ?? null;


$usuario = $_POST["usuarioreg"]  ?? null;

$contraseña = $_POST["contraseñareg"]  ?? null;

$contraseña2 = $_POST["contraseña2reg"]  ?? null;

if($contraseña == $contraseña2)
{
$sql = "INSERT INTO usuarios (mail, usuario, contraseña) VALUES ('$email', '$usuario', '$contraseña');";
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