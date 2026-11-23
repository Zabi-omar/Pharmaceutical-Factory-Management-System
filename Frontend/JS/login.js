
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

// Show / Hide Password
togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
});

// Login Form
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    loginMessage.classList.remove("hidden", "text-red-600");
    loginMessage.classList.add("text-blue-600");

    loginMessage.textContent =
        "Login interface is ready. Authentication will be connected to Oracle through the backend.";
});
