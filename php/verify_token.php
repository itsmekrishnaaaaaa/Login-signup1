<?php
header('Content-Type: application/json');
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    $inputToken = $_POST['code']; 

    if (isset($_SESSION['temp_user']) && $inputToken == $_SESSION['temp_user']['token']) {
        $servername = "localhost";
        $db_username = "root";
        $db_password = "";
        $db_name = "pasalment";

        $conn = new mysqli($servername, $db_username, $db_password, $db_name);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $username = $_SESSION['temp_user']['username'];
        $email = $_SESSION['temp_user']['email'];
        // Password is already hashed when stored in session
        $password = $_SESSION['temp_user']['password']; 

        $insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("sss", $username, $email, $password);

        if ($stmt->execute()) {
            echo json_encode(array('success' => 'User registered successfully.'));
        } else {
            echo json_encode(array('error' => 'Error in registration.'));
        }

        unset($_SESSION['temp_user']);
        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(array('error' => 'Incorrect verification code.'));
    }
}
?>
