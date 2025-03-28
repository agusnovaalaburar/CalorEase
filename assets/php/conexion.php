<?php
session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = '';
$DATABASE_NAME = 'bim-database';

$tabla_db = 'users';

$conexion = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);


if (mysqli_connect_error()) {
  exit('Fallo en la conexión de MySQL:' . mysqli_connect_error());
}
