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

document.addEventListener('DOMContentLoaded', function() {
    // Preencher automaticamente o campo de data com a data atual
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const attendanceDateInput = document.getElementById('attendance-date');
    attendanceDateInput.value = formattedDate;
    
    if (attendanceDateInput) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        attendanceDateInput.value = formattedDate;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('month-select');
    const filterButton = document.getElementById('filter-button');
    const hoursResult = document.getElementById('hours-result');
    

    // Exemplo de dados de horas trabalhadas
    const employeeHours = [
        { name: 'João Silva', month: '01', hours: 160 },
        { name: 'Maria Oliveira', month: '02', hours: 150 },
        { name: 'João Silva', month: '02', hours: 170 },
        { name: 'Maria Oliveira', month: '01', hours: 140 },
    ];

    filterButton.addEventListener('click', function() {
        const selectedMonth = monthSelect.value;
        const filteredHours = employeeHours.filter(entry => entry.month === selectedMonth);

        // Limpa os resultados anteriores
        hoursResult.innerHTML = '';

        if (filteredHours.length > 0) {
            const resultTable = document.createElement('table');
            resultTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Mês</th>
                        <th>Horas</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredHours.map(entry => `
                        <tr>
                            <td>${entry.name}</td>
                            <td>${entry.month}</td>
                            <td>${entry.hours}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            hoursResult.appendChild(resultTable);
        } else {
            hoursResult.textContent = 'Nenhum dado disponível para o mês selecionado.';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const employeeSelect = document.getElementById('employee-select');

    // Obtém a lista de funcionários do localStorage
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];

    // Verifica se há funcionários na lista
    if (employeeList.length === 0) {
        console.warn('Nenhum funcionário encontrado no localStorage.');
    }

    // Preenche a caixa de seleção com os nomes dos funcionários
    employeeList.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.name;
        option.textContent = employee.name;
        employeeSelect.appendChild(option);
    });
});