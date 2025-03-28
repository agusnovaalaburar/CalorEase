<?php
$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'formulario';

$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else {
    $select = ("SELECT email FROM usuario ORDER BY id DESC LIMIT 1");
    $result = $conn->query($select);
    if ($result && $row = $result->fetch_row()) {
        $email = $row[0];
    }

    $select = ("SELECT MAX(compensar) FROM usuario;");
    $result = $conn->query($select);
    if ($result && $row = $result->fetch_row()) {
        $compensar = (int) $row[0];
    }

    if ($compensar == 1 && $email) {
        $subject = "Test Email";
        $message = "This is a test email sent from PHP!";
        $headers = "From: sender@example.com";

        // send mail
        if (mail($email, $subject, $message, $headers)) {
            echo "Email sent successfully!";
        } else {
            echo "Failed to send email.";
        }
    }
    
}
?>