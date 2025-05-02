document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (validateCredentials(username, password)) {
            sessionStorage.setItem('loggedInUser', username);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password. Please try again.';
        }
    });

    function validateCredentials(username, password) {
        // Example hardcoded credentials for demonstration
        const validUsername = 'aldenir';
        const validPassword = 'lancer007';

        return username === validUsername && password === validPassword;
    }
});