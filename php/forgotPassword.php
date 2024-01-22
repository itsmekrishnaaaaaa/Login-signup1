<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $forgotEmail = $_POST['forgotEmail'];

    // Database connection variables
    $servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $db_name = "pasalment";

    // Create connection
    $conn = new mysqli($servername, $db_username, $db_password, $db_name);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $forgotEmail = $_POST['forgotEmail'];

    // Prepare the SELECT query to check if the email exists
    $checkEmailQuery = "SELECT username, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkEmailQuery);
    $stmt->bind_param("s", $forgotEmail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $username = $row['username'];
        $hashedPreviousPassword = $row['password'];
        $verificationCode = mt_rand(100000, 999999);
        
        session_start();
        $_SESSION['temp_user'] = [
            'email' => $forgotEmail,
            'username' => $username,
            'verificationCode' => $verificationCode,
            'hashedPreviousPassword' => $hashedPreviousPassword

        ];

        // Send email with PHPMailer
        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';  
            $mail->SMTPAuth   = true;
            $mail->Username   = 'info.krish33@gmail.com'; 
            $mail->Password   = 'vvzj nkba tkby wruq'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
            $mail->Port       = 587; 

            // Recipients
            $mail->setFrom('info.krish33@gmail.com', 'Password Reset');
            $mail->addAddress($forgotEmail);

            // Content
            $mail->isHTML(false); 
            $mail->Subject = 'Password Reset Verification Code';
            $mail->Body    = "Your verification code for $forgotEmail is: \n\n $verificationCode\n\n"
                . "This code is for your use only. Do not share it with anyone. 
                If you did not request this code, please ignore this email.\n\n"
                . "Best regards,\n  Assignment-Acs";

            $mail->send();
            echo json_encode(array('success' => 'Verification code sent.', 'verificationCode' => $verificationCode));
        } catch (Exception $e) {
            echo json_encode(array('error' => 'Failed to send verification code. Please try again.'));
        }
    } else {
        // Email does not exist in the database
        echo json_encode(array('error' => 'Email not found.'));
    }

    $stmt->close();
    $conn->close();
}
?>
