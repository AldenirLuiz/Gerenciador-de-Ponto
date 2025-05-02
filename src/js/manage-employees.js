// Função para carregar os funcionários do localStorage e exibi-los na tabela
function loadEmployees() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const tbody = document.querySelector('#employee-list tbody');

    // Limpa o conteúdo atual do tbody
    tbody.innerHTML = '';

    // Adiciona cada funcionário na tabela
    employeeList.forEach((employee, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>
                <button onclick="deleteEmployee(${index})">Delete</button>
            </td>
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
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
        
        // Adiciona o novo funcionário com a propriedade attendance inicializada
        employeeList.push({ 
            name, 
            position, 
            attendance: [] // Inicializa o histórico de ponto como um array vazio
        });

        localStorage.setItem('employees', JSON.stringify(employeeList));
        loadEmployees(); // Atualiza a tabela
        document.getElementById('add-employee-form').reset(); // Limpa o formulário
        alert('Employee added successfully!');
    } else {
        alert('Please fill in all fields.');
    }
}

// Função para deletar um funcionário
function deleteEmployee(index) {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    employeeList.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employeeList));
    loadEmployees(); // Recarrega a tabela
}

// Adiciona eventos
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    document.getElementById('add-employee-form').addEventListener('submit', addEmployee);
});