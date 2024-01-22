<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();

    if (isset($_SESSION['temp_user'])) {
        $newPassword = $_POST['newPassword'];

        $hashedPreviousPassword = $_SESSION['temp_user']['hashedPreviousPassword'];

        if (password_verify($newPassword, $hashedPreviousPassword)) {
            echo json_encode(array('error' => 'New password must be different from the previous password.'));
        } else {
            $servername = "localhost";
            $db_username = "root";
            $db_password = "";
            $db_name = "pasalment";

            $conn = new mysqli($servername, $db_username, $db_password, $db_name);

            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            $email = $_SESSION['temp_user']['email'];
            $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $updateQuery = "UPDATE users SET password = ? WHERE email = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("ss", $hashedNewPassword, $email);

            if ($stmt->execute()) {
                echo json_encode(array('success' => 'Password updated successfully.'));
            } else {
                echo json_encode(array('error' => 'Error updating password.', 'details' => $conn->error));
            }

            $stmt->close();
            $conn->close();

            unset($_SESSION['temp_user']);
        }
    } else {
        echo json_encode(array('error' => 'Session data not found.'));
    }
} else {
    echo json_encode(array('error' => 'Invalid request method.'));
}

?>
