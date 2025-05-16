// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Código comum a todas as páginas, como a gestão do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    const employeeForm = document.getElementById('employee-form');

    if (employeeForm) {
        employeeForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const nameInput = document.getElementById('name');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const managementLevelInput = document.getElementById('management-level');

            const name = nameInput.value;
            const username = usernameInput.value;
            const managementLevel = managementLevelInput.value;
            let password = '';

            if (managementLevel === 'manager') {
                password = passwordInput.value;
            }

            // Recupera os funcionários do localStorage
            const employees = JSON.parse(localStorage.getItem('employees')) || [];

            // Cria um novo objeto de funcionário
            const newEmployee = {
                name: name,
                username: username,
                password: password,
                managementLevel: managementLevel
            };

            // Adiciona o novo funcionário ao array de funcionários
            employees.push(newEmployee);

            // Salva os funcionários no localStorage
            localStorage.setItem('employees', JSON.stringify(employees));

            // Limpa o formulário
            nameInput.value = '';
            usernameInput.value = '';
            passwordInput.value = '';
            managementLevelInput.value = 'employee';

            // Exibe uma mensagem de sucesso
            alert('Funcionário salvo com sucesso!');

            // Atualiza a tabela de funcionários
            displayEmployees();
        });
    }

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value;
            const password = passwordInput.value;

            // Recupera os funcionários do localStorage
            const employees = JSON.parse(localStorage.getItem('employees')) || [];

            // Procura um funcionário com o nome de usuário e senha fornecidos
            const employee = employees.find(employee => employee.username === username && employee.password === password);

            if (employee) {
                // Login bem-sucedido
                alert('Login bem-sucedido!');
                window.location.href = 'src/attendance.html'; // Redireciona para a página de gerenciamento de ponto
            } else {
                // Login falhou
                alert('Nome de usuário ou senha incorretos.');
            }
        });
    }

    // Função para exibir os funcionários na tabela
    function displayEmployees() {
        const employeeTableBody = document.querySelector('#employee-table tbody');

        // Verifica se o elemento employeeTableBody existe
        if (employeeTableBody) {
            // Limpa o corpo da tabela
            employeeTableBody.innerHTML = '';

            // Recupera os funcionários do localStorage
            const employees = JSON.parse(localStorage.getItem('employees')) || [];

            // Itera sobre os funcionários e cria as linhas da tabela
            employees.forEach((employee, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.username}</td>
                    <td>${employee.managementLevel}</td>
                    <td><button class="delete-button" data-index="${index}">Deletar</button></td>
                `;
                employeeTableBody.appendChild(row);
            });

            // Adiciona os event listeners para os botões de deletar
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', deleteEmployee);
            });
        } else {
            console.error('Elemento #employee-table tbody não encontrado.');
        }
    }

    // Função para deletar um funcionário
    function deleteEmployee(event) {
        const index = event.target.dataset.index;

        // Recupera os funcionários do localStorage
        const employees = JSON.parse(localStorage.getItem('employees')) || [];

        // Remove o funcionário do array
        employees.splice(index, 1);

        // Salva os funcionários no localStorage
        localStorage.setItem('employees', JSON.stringify(employees));

        // Atualiza a tabela de funcionários
        displayEmployees();
    }

    // Adiciona a lógica para verificar se existe um funcionário com nível de gestão
    const createAccountLink = document.getElementById('create-account-link');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link

            // Recupera os funcionários do localStorage
            const employees = JSON.parse(localStorage.getItem('employees')) || [];

            // Verifica se existe um funcionário com nível de gestão
            const hasManager = employees.some(employee => employee.managementLevel === 'manager');

            if (!hasManager) {
                // Redireciona para a página de gerenciamento de funcionários
                window.location.href = 'manage-employees.html';
            } else {
                // Obtém o nome do primeiro funcionário com nível de gestão
                const managerName = employees.find(employee => employee.managementLevel === 'manager').name;

                // Exibe um alerta com o nome do usuário
                alert(`Já existe um usuário com nível de gestão: ${managerName}`);

                // Redireciona para a página de login
                window.location.href = 'index.html';
            }
        });
    }

    // Exibe os funcionários na tabela ao carregar a página
    displayEmployees();
});