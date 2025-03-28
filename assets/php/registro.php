<?php
function revisarMayus($string)
{
    $contadorMayus = 0;

    for ($i = 0; $i < strlen($string); $i++) {
        $char = $string[$i];

        if (ctype_upper($char)) {
            $contadorMayus++;
        }
    }
    if ($contadorMayus >= 2) {
        return true;
    } else {
        return false;
    }
}

function revisarNumeros($string)
{
    $contadorNums = 0;
    for ($i = 0; $i < strlen($string); $i++) {
        $char = $string[$i];

        if (is_numeric($char)) {
            $contadorNums++;
        }
    }
    if ($contadorNums >= 2) {
        return true;
    } else {
        return false;
    }
}


if(isset($_POST['btnreg'])){
    include("conexion.php");
    function encryptText($text, $key) {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted = openssl_encrypt($text, 'aes-256-cbc', $key, 0, $iv);
        return base64_encode($iv . $encrypted);
    }

    $nombre = $_POST['Usuario'];
    $ape = $_POST['Apellido'];
    $mail = $_POST['mail'];

    if (revisarMayus($_POST['Contraseña']) && revisarNumeros($_POST['Contraseña']) && strlen($_POST['Contraseña']) >= 6) {
        $contra = encryptText($_POST['Contraseña'], "10");
        $conexion->query("INSERT INTO $tabla_db (NOMBRE, CONTRA, APELLIDO, email) values('$nombre', '$contra', '$ape', '$mail')");
        echo"datos guardados correctamente";
    } 
    else {
    echo 'constraseña invalida xd';
    }
    
    echo '<a href="../../index.html">Volver al inicio</a>';
 
    $conexion->close();
}