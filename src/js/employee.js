document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar os funcionários do localStorage e exibi-los na tabela
    function loadEmployees() {
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];

        const tbody = document.querySelector('#employee-list tbody');
        if (!tbody) {
            console.error('Corpo da tabela de funcionários não encontrado.');
            return;
        }

        // Limpa o conteúdo atual do tbody
        tbody.innerHTML = '';

        // Adiciona cada funcionário na tabela
        employeeList.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.position}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Função para adicionar um novo funcionário
    function addEmployee(event) {
        event.preventDefault();

        const name = document.getElementById('employee-name').value;
        const position = document.getElementById('employee-position').value;

        if (name && position) {
            let employeeList = JSON.parse(localStorage.getItem('employees')) || [];

            employeeList.push({
                name: name,
                position: position,
                attendance: []
            });

            localStorage.setItem('employees', JSON.stringify(employeeList));

            loadEmployees();

            document.getElementById('employee-name').value = '';
            document.getElementById('employee-position').value = '';
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    }

    // Adiciona o evento de submit ao formulário
    const employeeForm = document.getElementById('employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', addEmployee);
    }

    // Carrega os funcionários ao carregar a página
    loadEmployees();
});