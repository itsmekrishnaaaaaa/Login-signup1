document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const passwordRequirements = document.getElementById("password-requirements");
    const strengthBar = document.getElementById("strength-bar");
    const strengthMessage = document.getElementById("strength-message");
    const passwordToggleIcons = document.querySelectorAll(".toggle-password");

    passwordField.addEventListener("focus", function () {
        passwordRequirements.style.display = "block";
    });

    confirmPasswordField.addEventListener("focus", function(){
        passwordRequirements.style.display ="none";
    })
    passwordField.addEventListener("input", function () {
        const password = passwordField.value;
        updateRequirementStatus("uppercase", /[A-Z]/.test(password));
        updateRequirementStatus("lowercase", /[a-z]/.test(password));
        updateRequirementStatus("symbol", /[!@#$%^&*(),.?":{}|<>]/.test(password));
        updateRequirementStatus("length", password.length >= 8);
        updateRequirementStatus("number",/[1-9]/.test(password) );

        const strength = calculatePasswordStrength(password);
        strengthBar.style.width = strength * 33.33 + "%";
        strengthBar.style.backgroundColor = getPasswordStrengthColor(strength);
        strengthMessage.textContent = getPasswordStrengthMessage(strength);
        strengthMessage.style.color = getPasswordStrengthColor(strength);
    });

    function updateRequirementStatus(id, isValid) {
        const requirement = document.getElementById(id);
        requirement.style.color = isValid ? "green" : "red";
    }

    function calculatePasswordStrength(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLengthValid = password.length >= 8;
        const hasNumber = /[1-9]/.test(password);

        if (hasUppercase && hasLowercase && hasSymbol && isLengthValid && hasNumber) {
            return 3;
        } else if ((hasUppercase || hasLowercase) && hasSymbol && isLengthValid) {
            return 2;
        } else {
            return 1;
        }
    }

    function getPasswordStrengthColor(strength) {
        switch (strength) {
            case 3: return "green";
            case 2: return "yellow";
            case 1: return "red";
            default: return "red";
        }
    }

    function getPasswordStrengthMessage(strength) {
        switch (strength) {
            case 3: return "Very Strong";
            case 2: return "Medium";
            case 1: return "Weak";
            default: return "";
        }
    }

    passwordToggleIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
            const fieldId = icon.getAttribute("data-target");
            togglePasswordVisibility(fieldId);
        });
    });

    function togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        const toggler = document.querySelector(`.toggle-password[data-target="${fieldId}"]`);
        const isPasswordVisible = field.type === "text";

        field.type = isPasswordVisible ? "password" : "text";
        toggleEyeIcon(toggler);

        if (fieldId === "confirmPassword" && isPasswordVisible) {
            strengthMessage.style.display = "none";
        }
    }

    function toggleEyeIcon(toggler) {
        toggler.classList.toggle("fa-eye", toggler.classList.contains("fa-eye-slash"));
        toggler.classList.toggle("fa-eye-slash", !toggler.classList.contains("fa-eye-slash"));
    }

    function validateCaptcha() {
        const response = grecaptcha.getResponse();
        if (response.length === 0) {
            alert("Please complete the captcha verification.");
            return false;
        }
        return true;
    }

    function validateForm() {
        if (usernameField.value.trim() === "") {
            alert("Username is required");
            return false;
        }
        if (emailField.value.trim() === "") {
            alert("Email is required");
            return false;
        } else if (!emailField.value.includes("@")) {
            alert("Email is invalid");
            return false;
        }
        if (passwordField.value !== confirmPasswordField.value) {
            alert("Passwords do not match");
            return false;
        }
        return true;
    }

    function validatePasswordStrength(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLengthValid = password.length >= 8;
        const hasNumber = /[1-9]/.test(password);

        let isValid = true;

        if (!hasUppercase) {
            alert("Password must contain at least one uppercase letter");
            isValid = false;
        }

        if (!hasLowercase) {
            alert("Password must contain at least one lowercase letter");
            isValid = false;
        }

        if (!hasSymbol) {
            alert("Password must contain at least one symbol");
            isValid = false;
        }

        if (!isLengthValid) {
            alert("Password must be at least 8 characters long");
            isValid = false;
        }

        if (!hasNumber) {
            alert("Password must contain at least one number");
            isValid = false;
        }

        return isValid;
    }

    function openAuthPopup() {
        document.getElementById('authPopup').style.display = 'block';
    }

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateCaptcha() || !validateForm() || !validatePasswordStrength(passwordField.value)) {
            return;
        }
        

        const formData = new FormData(signupForm);
        fetch("./php/signup.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data.success) {
                alert(data.success);
                openAuthPopup();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while processing your request.");
        });
    });
});
