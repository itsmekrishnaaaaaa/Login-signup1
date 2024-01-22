<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Check if user already exists
    $checkQuery = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        echo json_encode(array('error' => 'Username or email already taken'));
    } else {
        // Generate a 6-digit random token
        $token = mt_rand(100000, 999999);

        // Start session and store user data temporarily
        session_start();
        $_SESSION['temp_user'] = [
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'token' => $token
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
            $mail->setFrom('info.krish33@gmail.com', 'Verify Your email'); 
            $mail->addAddress($email, $username);

            // Content
            $mail->isHTML(false); 
            $mail->Subject = 'Authentication Token';
            $mail->Body    = "Dear $username,\n\nYour authentication code is: $token\n\n"
                . "This code is for your use only. Do not share it with anyone. If you did not request this code, 
                please contact support immediately.\n\n"
                . "Best regards,\n  Assignment-Acs";

            $mail->send();
            echo json_encode(array('success' => 'Verification email sent.', 'token' => $token));
        } catch (Exception $e) {
            // Capture the SMTP error message
            $errorMessage = $e->errorMessage();
            echo json_encode(array('error' => $errorMessage));
        }
    }

    $conn->close();
}
?>
