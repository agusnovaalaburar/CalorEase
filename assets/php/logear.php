<?php

    if(isset($_POST['btnlog'])){
        include("conexion.php");
        if (!isset($_POST['mail'], $_POST['ContraseñaL'])) {
            header('Location: index.html');
        }
            $mail = $_POST['mail'];

            $query = "SELECT CONTRA FROM users WHERE email = '$mail'";
            $result = $conexion->query($query);

            if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $hashAlmacenado = $row["CONTRA"];}
            else{
                echo "Usuario Incorrecto o Inexistente.";
                echo '<br> <a href="index.html">Volver al inicio</a>';
            }

            function decryptText($encryptedText, $key) {
                $data = base64_decode($encryptedText);
                $ivSize = openssl_cipher_iv_length('aes-256-cbc');
                $iv = substr($data, 0, $ivSize);
                $encrypted = substr($data, $ivSize);
                return openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);
            }
            
            if(!empty($hashAlmacenado)){

                $desencriptado = decryptText($hashAlmacenado, "10");

            if ($desencriptado == $_POST['ContraseñaL']) {
                $result = $conexion->query("SELECT * FROM $tabla_db WHERE email  = '$mail'");
                $row = $result->fetch_assoc();
                $_SESSION['nombre'] = $row['NOMBRE'];
                $_SESSION['apellido'] = $row['APELLIDO'];
                header("Location: inicio.php");
            } else {
             echo "Login failed. Invalid password." . PHP_EOL;
             echo '<br> <a href="index.html">Volver al inicio</a>';
            }
            }

        $conexion->close();
}
