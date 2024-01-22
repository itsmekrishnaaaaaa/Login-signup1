<?php
header('Content-Type: application/json');
ini_set('display_errors', 1); 
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    $inputToken = $_POST['code']; 
    if (isset($_SESSION['temp_user']) && $inputToken == $_SESSION['temp_user']['verificationCode']) {
        // Verification successful
        echo json_encode(array('success'=> 'code verified'));
    } else {
        // Incorrect verification code
        echo json_encode(array('error' => 'Incorrect verification code.'));
    }

}
?>
