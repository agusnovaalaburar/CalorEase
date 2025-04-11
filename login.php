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
$usuariolog = $_POST["usuariolog"];

$contraseñalog = $_POST["contraseñalog"];

$resultado = mysql_query("SELECT usuario FROM usuarios WHERE usuarios=='$usuariolog'");

$nombre = mysql_fetch_array($resultado);

echo $nombre
//terminar este login arriba y comprobar abajo.

if($contraseña == $contraseña2)
{

$sql = "SELECT contraseña FROM usuarios WHERE usuario 
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