// This file contains the main JavaScript logic for managing employees. 
// It handles loading employee data from local storage, displaying it on the main page, 
// and providing functions to add, edit, or delete employee records.

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
            <td>${employee.hoursWorked}</td>
            <td>
                <button onclick="deleteEmployee(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Função para carregar os funcionários no dropdown
function populateEmployeeDropdown() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const employeeSelect = document.getElementById('employee-select');

    // Limpa o conteúdo atual do dropdown
    employeeSelect.innerHTML = '';

    // Adiciona cada funcionário como uma opção no dropdown
    employeeList.forEach((employee, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = employee.name;
        employeeSelect.appendChild(option);
    });
}

// Função para deletar um funcionário
function deleteEmployee(index) {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    employeeList.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employeeList));
    loadEmployees(); // Recarrega a tabela
}

// Função para carregar o histórico de ponto
function loadAttendanceHistory() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const tbody = document.querySelector('#attendance-history tbody');

    // Limpa o conteúdo atual do tbody
    tbody.innerHTML = '';

    // Itera sobre cada funcionário e exibe o histórico de ponto
    employeeList.forEach(employee => {
        if (employee.attendance && employee.attendance.length > 0) {
            employee.attendance.forEach(record => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${record.date || 'N/A'}</td>
                    <td>${record.morningEntry || 'N/A'}</td>
                    <td>${record.morningExit || 'N/A'}</td>
                    <td>${record.afternoonEntry || 'N/A'}</td>
                    <td>${record.afternoonExit || 'N/A'}</td>
                    <td>${record.status || 'N/A'}</td>
                `;

                tbody.appendChild(row);
            });
        }
    });
}

// Função para lidar com o registro de ponto
function handleAttendance(event) {
    event.preventDefault();

    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const employeeIndex = document.getElementById('employee-select').value;
    const attendanceStatus = document.getElementById('attendance-status').value;
    const morningEntry = document.getElementById('morning-entry').value;
    const morningExit = document.getElementById('morning-exit').value;
    const afternoonEntry = document.getElementById('afternoon-entry').value;
    const afternoonExit = document.getElementById('afternoon-exit').value;

    if (employeeIndex !== '' && employeeList[employeeIndex]) {
        const employee = employeeList[employeeIndex];

        // Adiciona o registro de ponto ao histórico
        employee.attendance.push({
            date: new Date().toLocaleDateString(),
            morningEntry: morningEntry || 'N/A',
            morningExit: morningExit || 'N/A',
            afternoonEntry: afternoonEntry || 'N/A',
            afternoonExit: afternoonExit || 'N/A',
            status: attendanceStatus
        });

        localStorage.setItem('employees', JSON.stringify(employeeList));
        loadAttendanceHistory();
        loadEmployeeSummary(); // Atualiza o resumo após registrar o ponto
        alert('Attendance recorded successfully!');
    } else {
        alert('Please select a valid employee.');
    }
}

// Função para habilitar ou desabilitar os campos de horário com base no status
function toggleTimeFields() {
    const attendanceStatus = document.getElementById('attendance-status').value;
    const timeFields = [
        document.getElementById('morning-entry'),
        document.getElementById('morning-exit'),
        document.getElementById('afternoon-entry'),
        document.getElementById('afternoon-exit')
    ];

    if (attendanceStatus === 'absent') {
        // Desabilita e limpa os campos de horário
        timeFields.forEach(field => {
            field.value = ''; // Limpa o valor
            field.disabled = true; // Desabilita o campo
        });
    } else {
        // Habilita os campos de horário
        timeFields.forEach(field => {
            field.disabled = false; // Habilita o campo
        });
    }
}

// Função para calcular e exibir o resumo dos funcionários
function loadEmployeeSummary() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const tbody = document.querySelector('#employee-summary tbody');

    // Limpa o conteúdo atual do tbody
    tbody.innerHTML = '';

    // Itera sobre cada funcionário e calcula o resumo
    employeeList.forEach(employee => {
        let totalHours = 0;
        let totalDaysPresent = 0;

        if (employee.attendance && employee.attendance.length > 0) {
            employee.attendance.forEach(record => {
                if (record.status === 'present') {
                    totalDaysPresent++;

                    // Calcula as horas trabalhadas (se os horários forem válidos)
                    const morningHours = calculateHours(record.morningEntry, record.morningExit);
                    const afternoonHours = calculateHours(record.afternoonEntry, record.afternoonExit);
                    totalHours += morningHours + afternoonHours;
                }
            });
        }

        // Cria uma nova linha para o resumo
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${totalHours.toFixed(2)} hours</td>
            <td>${totalDaysPresent} days</td>
        `;

        tbody.appendChild(row);
    });
}

// Função para calcular a diferença de horas entre dois horários
function calculateHours(entry, exit) {
    if (!entry || !exit || entry === 'N/A' || exit === 'N/A') {
        return 0; // Retorna 0 se os horários forem inválidos
    }

    const [entryHours, entryMinutes] = entry.split(':').map(Number);
    const [exitHours, exitMinutes] = exit.split(':').map(Number);

    const entryTime = entryHours + entryMinutes / 60;
    const exitTime = exitHours + exitMinutes / 60;

    return Math.max(0, exitTime - entryTime); // Garante que o resultado não seja negativo
}

// Adiciona o evento de mudança ao campo de status
document.getElementById('attendance-status').addEventListener('change', toggleTimeFields);

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    populateEmployeeDropdown();
    loadAttendanceHistory();
    loadEmployeeSummary(); // Carrega o resumo dos funcionários
    document.getElementById('attendance-form').addEventListener('submit', event => {
        handleAttendance(event);
        loadEmployeeSummary(); // Atualiza o resumo após registrar o ponto
    });
    toggleTimeFields();
});

