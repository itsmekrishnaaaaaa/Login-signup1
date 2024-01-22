
function verifyAuthToken() {
    const enteredCode = document.getElementById('authCode').value;

    // Make an AJAX request to verify the authentication code
    fetch('./php/verify_token.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'code=' + encodeURIComponent(enteredCode),
    })
    .then(response => response.json())
    .then(data => {


        // Close the popup if verification is successful
        if (data.success) {
            alert('user Registered successfully');
            closePopup();

            // Redirect to login page
            window.location.href = 'login.html';
        }else{
            alert('Invalid Code! Please try again')
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request.'+ error.message);
    });
}

function closePopup() {
    document.getElementById('authPopup').style.display = 'none';
}
