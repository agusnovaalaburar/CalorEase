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


$emaillog = $_POST["emaillog"];

$contraseñalog = $_POST["contraseñalog"];



$result = mysql_query("SELECT contraseña FROM usuarios WHERE mail = '$emaillog'");
if (!$result) {
    echo 'usuario inexistente' . mysql_error();
    exit;
}
$pass = mysql_fetch_row($result);

//checkear
if($contraseñalog == $pass)
{
//sacar id para session
  $result = mysql_query("SELECT id_usuario FROM usuarios WHERE mail = '$emaillog'");
$id = mysql_fetch_row($result);


$sql = "SELECT contraseña FROM usuarios WHERE usuario 
VALUES ('', '$email', '$usuario', '$contraseña');";
}
else
{
    echo "usuario o contraseña incorrecta";
}

if ($conn->query($sql) === TRUE) {
  echo "cargado";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

?>