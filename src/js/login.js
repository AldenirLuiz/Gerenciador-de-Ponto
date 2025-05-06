document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message'); // Corrigido o ID

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio do formulário

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Substitua os valores abaixo pelos valores corretos para validação
        const correctUsername = 'faculdade';
        const correctPassword = 'lancer007';

        if (username !== correctUsername || password !== correctPassword) {
            errorMessage.textContent = 'Nome de usuário ou senha incorretos. Tente novamente.';
            errorMessage.style.display = 'block'; // Exibe a mensagem de erro
        } else {
            errorMessage.style.display = 'none'; // Oculta a mensagem de erro
            // Redireciona ou executa outra ação ao fazer login com sucesso
            window.location.href = 'src/index.html'; // Exemplo de redirecionamento
        }
    });
});