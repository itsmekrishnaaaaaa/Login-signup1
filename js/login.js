document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        fetch("./php/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                "username=" +
                encodeURIComponent(username) +
                "&password=" +
                encodeURIComponent(password),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.href = "Home.html";
                } else {
                    alert("Wrong Username or Password");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

document
    .getElementById("forgotpassword")
    .addEventListener("click", function () {
        document.getElementById("forgotPasswordPopup").style.display =
            "block";
    });

document
    .getElementById("closePopup")
    .addEventListener("click", function () {
        document.getElementById("forgotPasswordPopup").style.display = "none";
    });

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        var forgotEmail = document.getElementById("forgotEmail").value;

        fetch("./php/forgotPassword.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "forgotEmail=" + encodeURIComponent(forgotEmail),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Verification code sent. Check your email.");

                    document.getElementById("forgotPasswordPopup").style.display =
                        "none";
                    document.getElementById("tokenValidationPopup").style.display =
                        "block";

                } else {
                    alert("Email Not Found in server");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });


document
    .getElementById("tokenValidationForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        var verificationCode =
            document.getElementById("verificationCode").value;

        fetch("./php/verifytoken.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "code=" + encodeURIComponent(verificationCode),
        })
            .then((response) => response.json())
            .then((verificationData) => {
                if (verificationData.success) {
                    alert("Code Verified");
                    window.location.replace("resetPs.html");
                } else {
                    alert(
                        verificationData.error || "Verification failed."
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });