// This file contains the main JavaScript logic for managing employees. 
// It handles loading employee data from local storage, displaying it on the main page, 
// and providing functions to add, edit, or delete employee records.
document.getElementById('backup-data').addEventListener('click', backupData);
// Função para carregar os funcionários do localStorage e exibi-los na tabela
function loadEmployees() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];

    const tbody = document.querySelector('#employee-list tbody');
    if (!tbody) {
        console.error('Elemento #employee-list tbody não encontrado no DOM.');
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
            <td>${employee.hoursWorked || 'N/A'}</td>
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
    const employeeSelect = document.getElementById('employee-select-daily');

    // Limpa o conteúdo atual do dropdown
    employeeSelect.innerHTML = '<option value="">Selecione um Funcionário</option>';

    // Adiciona cada funcionário como uma opção no dropdown
    employeeList.forEach((employee, index) => {
        const option = document.createElement('option');
        option.value = index; // Usa o índice como valor
        option.textContent = employee.name; // Exibe o nome do funcionário
        employeeSelect.appendChild(option);
    });
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
                    <td>${record.morningStatus || 'N/A'}</td>
                    <td>${record.afternoonStatus || 'N/A'}</td>
                `;

                tbody.appendChild(row);
            });
        }
    });
}

// Função para lidar com o registro de ponto
function handleAttendance(event) {
    event.preventDefault();

    const attendanceDateInput = document.getElementById('attendance-date');
    const employeeSelect = document.getElementById('employee-select-daily');
    const morningEntry = document.getElementById('morning-entry');
    const morningExit = document.getElementById('morning-exit');
    const afternoonEntry = document.getElementById('afternoon-entry');
    const afternoonExit = document.getElementById('afternoon-exit');
    const morningStatus = document.getElementById('morning-status');
    const afternoonStatus = document.getElementById('afternoon-status');

    if (!attendanceDateInput || !employeeSelect || !morningEntry || !morningExit || !afternoonEntry || !afternoonExit || !morningStatus || !afternoonStatus) {
        console.error('Um ou mais elementos necessários não foram encontrados no DOM.');
        return;
    }

    const attendanceDate = attendanceDateInput.value;
    const employeeIndex = employeeSelect.value;

    if (employeeIndex === '') {
        alert('Por favor, selecione um funcionário válido.');
        return;
    }

    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employeeList[employeeIndex];
    if (!employee) {
        alert('Funcionário não encontrado.');
        return;
    }

    if (!employee.attendance) {
        employee.attendance = [];
    }

    // Verifica se já existe um registro para o mesmo funcionário e data
    const duplicateEntry = employee.attendance.some(record => record.date === attendanceDate);
    if (duplicateEntry) {
        alert('Já existe um registro de ponto para este funcionário nesta data.');
        return;
    }

    // Adiciona o registro de ponto
    employee.attendance.push({
        date: attendanceDate,
        morningEntry: morningEntry.value || 'N/A',
        morningExit: morningExit.value || 'N/A',
        afternoonEntry: afternoonEntry.value || 'N/A',
        afternoonExit: afternoonExit.value || 'N/A',
        morningStatus: morningStatus.value || 'N/A',
        afternoonStatus: afternoonStatus.value || 'N/A'
    });

    localStorage.setItem('employees', JSON.stringify(employeeList));

    // Atualiza apenas os dados necessários
    loadAttendanceHistory();
    loadEmployeeSummary();

    alert('Ponto registrado com sucesso!');
}

// Função para habilitar ou desabilitar os campos de horário com base no status
function toggleTimeFields() {
    //const attendanceStatus = document.getElementById('attendance-status').value;
    const timeFields = [
        document.getElementById('morning-entry'),
        document.getElementById('morning-exit'),
        document.getElementById('afternoon-entry'),
        document.getElementById('afternoon-exit')
    ];

    
}

// Função para habilitar ou desabilitar os campos de horário com base no status da manhã
function toggleMorningFields() {
    const morningStatus = document.getElementById('morning-status').value;
    const morningFields = [
        document.getElementById('morning-entry'),
        document.getElementById('morning-exit')
    ];

    if (morningStatus === 'absent') {
        // Desabilita e limpa os campos de horário da manhã
        morningFields.forEach(field => {
            field.value = ''; // Limpa o valor
            field.disabled = true; // Desabilita o campo
        });
    } else {
        // Habilita os campos de horário da manhã
        morningFields.forEach(field => {
            field.disabled = false; // Habilita o campo
        });
    }
}

// Função para habilitar ou desabilitar os campos de horário com base no status da tarde
function toggleAfternoonFields() {
    const afternoonStatus = document.getElementById('afternoon-status').value;
    const afternoonFields = [
        document.getElementById('afternoon-entry'),
        document.getElementById('afternoon-exit')
    ];

    if (afternoonStatus === 'absent') {
        // Desabilita e limpa os campos de horário da tarde
        afternoonFields.forEach(field => {
            field.value = ''; // Limpa o valor
            field.disabled = true; // Desabilita o campo
        });
    } else {
        // Habilita os campos de horário da tarde
        afternoonFields.forEach(field => {
            field.disabled = false; // Habilita o campo
        });
    }
}

// Função para calcular e exibir o resumo dos funcionários
function loadEmployeeSummary() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const tbody = document.querySelector('#employee-summary tbody');

    if (!tbody) {
        console.error('Elemento #employee-summary tbody não encontrado no DOM.');
        return;
    }

    // Limpa o conteúdo atual do tbody
    tbody.innerHTML = '';

    // Itera sobre cada funcionário e calcula o resumo
    employeeList.forEach(employee => {
        let totalHours = 0;
        let totalDaysPresent = 0;

        if (employee.attendance && employee.attendance.length > 0) {
            employee.attendance.forEach(record => {
                // Calcula as horas trabalhadas pela manhã
                if (record.morningEntry !== 'N/A' && record.morningExit !== 'N/A') {
                    totalHours += calculateHours(record.morningEntry, record.morningExit);
                }
                // Calcula as horas trabalhadas à tarde
                if (record.afternoonEntry !== 'N/A' && record.afternoonExit !== 'N/A') {
                    totalHours += calculateHours(record.afternoonEntry, record.afternoonExit);
                }
                // Incrementa os dias presentes se o status for "present"
                if (record.status === 'present' || record.morningStatus === 'present' || record.afternoonStatus === 'present') {
                    totalDaysPresent++;
                }
            });
        }

        // Cria uma nova linha para o resumo
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${totalHours.toFixed(2)} horas</td>
            <td>${totalDaysPresent} dias</td>
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

// Função para fazer o backup dos dados em um arquivo XLSX ou CSV
function backupData() {
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    if (employeeList.length === 0) {
        alert('Nenhum dado encontrado para fazer backup.');
        return;
    }

    // Obtém o formato selecionado
    const format = document.getElementById('backup-format').value;

    if (format === 'xlsx') {
        // Backup em formato XLSX
        const data = [];
        data.push(['Nome', 'Posição', 'Data', 'Entrada Manhã', 'Saída Manhã', 'Entrada Tarde', 'Saída Tarde', 'Status']); // Cabeçalho

        employeeList.forEach(employee => {
            if (employee.attendance && employee.attendance.length > 0) {
                employee.attendance.forEach(record => {
                    data.push([
                        employee.name,
                        employee.position,
                        record.date || 'N/A',
                        record.morningEntry || 'N/A',
                        record.morningExit || 'N/A',
                        record.afternoonEntry || 'N/A',
                        record.afternoonExit || 'N/A',
                        record.status || 'N/A'
                    ]);
                });
            } else {
                data.push([employee.name, employee.position, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
            }
        });

        // Cria a planilha e o arquivo Excel
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionários');

        // Salva o arquivo Excel
        XLSX.writeFile(workbook, 'backup_employees.xlsx');
    } else if (format === 'csv') {
        // Backup em formato CSV
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Nome,Posição,Data,Entrada Manhã,Saída Manhã,Entrada Tarde,Saída Tarde,Status\n';

        employeeList.forEach(employee => {
            if (employee.attendance && employee.attendance.length > 0) {
                employee.attendance.forEach(record => {
                    csvContent += `${employee.name},${employee.position},${record.date || 'N/A'},${record.morningEntry || 'N/A'},${record.morningExit || 'N/A'},${record.afternoonEntry || 'N/A'},${record.afternoonExit || 'N/A'},${record.status || 'N/A'}\n`;
                });
            } else {
                csvContent += `${employee.name},${employee.position},N/A,N/A,N/A,N/A,N/A,N/A\n`;
            }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'backup_employees.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Formato de backup inválido.');
    }
}

// Função para restaurar os dados a partir de um arquivo CSV
function restoreBackup(event) {
    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (!file) {
        alert('Nenhum arquivo selecionado.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        const rows = csvContent.split('\n').slice(1); // Divide o conteúdo em linhas e ignora o cabeçalho
        const restoredEmployees = {};

        rows.forEach(row => {
            const [name, position, date, morningEntry, morningExit, afternoonEntry, afternoonExit, status] = row.split(',');

            if (!name || !position) return; // Ignora linhas inválidas

            // Adiciona o funcionário ao objeto restaurado
            if (!restoredEmployees[name]) {
                restoredEmployees[name] = {
                    name: name.trim(),
                    position: position.trim(),
                    attendance: []
                };
            }

            // Adiciona o registro de ponto ao funcionário
            if (date && date.trim() !== 'N/A') {
                restoredEmployees[name].attendance.push({
                    date: date.trim(),
                    morningEntry: morningEntry.trim() || 'N/A',
                    morningExit: morningExit.trim() || 'N/A',
                    afternoonEntry: afternoonEntry.trim() || 'N/A',
                    afternoonExit: afternoonExit.trim() || 'N/A',
                    status: status.trim() || 'N/A'
                });
            }
        });

        // Converte o objeto restaurado em uma lista e salva no localStorage
        const employeeList = Object.values(restoredEmployees);
        localStorage.setItem('employees', JSON.stringify(employeeList));

        alert('Backup restaurado com sucesso!');
        loadEmployees(); // Atualiza a tabela de funcionários
        loadAttendanceHistory(); // Atualiza o histórico de ponto
        loadEmployeeSummary(); // Atualiza o resumo dos funcionários
    };

    reader.readAsText(file); // Lê o conteúdo do arquivo como texto
}

// Função para limpar os dados salvos no localStorage
function clearData() {
    if (confirm('Tem certeza de que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('employees');
        alert('Todos os dados foram limpos com sucesso.');
        loadEmployees(); // Atualiza a tabela de funcionários
        loadAttendanceHistory(); // Atualiza o histórico de ponto
        loadEmployeeSummary(); // Atualiza o resumo dos funcionários
    }
}

// Função para filtrar o histórico de ponto por data
function filterAttendanceByDate() {
    const selectedDate = document.getElementById('filter-date').value; // Obtém a data selecionada
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const filteredAttendance = document.getElementById('filtered-attendance');

    // Limpa os resultados anteriores
    filteredAttendance.innerHTML = '';

    if (!selectedDate) {
        alert('Por favor, selecione uma data para filtrar.');
        return;
    }

    // Filtra os registros de ponto com base na data selecionada
    const filteredData = employeeList.flatMap(employee => {
        return (employee.attendance || []).filter(record => record.date === selectedDate).map(record => ({
            name: employee.name,
            ...record
        }));
    });

    // Exibe os resultados filtrados
    if (filteredData.length > 0) {
        filteredData.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.name}</td>
                <td>${record.date || 'N/A'}</td>
                <td>${record.morningEntry || 'N/A'}</td>
                <td>${record.morningExit || 'N/A'}</td>
                <td>${record.afternoonEntry || 'N/A'}</td>
                <td>${record.afternoonExit || 'N/A'}</td>
                <td>${record.status || 'N/A'}</td>
            `;
            filteredAttendance.appendChild(row);
        });
    } else {
        // Exibe uma mensagem caso nenhum registro seja encontrado
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">Nenhum registro encontrado para a data selecionada.</td>`;
        filteredAttendance.appendChild(row);
    }
}

// Função para salvar o relatório dos dados filtrados
function saveFilteredReport() {
    const table = document.getElementById('filtered-attendance');
    const rows = table.querySelectorAll('tr');

    if (rows.length === 0) {
        alert('Nenhum dado disponível para salvar no relatório.');
        return;
    }

    // Cria os dados para o relatório
    const data = [];
    data.push(['Nome', 'Data', 'Entrada', 'Saída', 'Entrada', 'Saída', 'Status']); // Cabeçalho

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            data.push(Array.from(cells).map(cell => cell.textContent.trim()));
        }
    });

    // Cria a planilha e o arquivo Excel
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

    // Salva o arquivo Excel
    XLSX.writeFile(workbook, 'relatorio_historico_ponto.xlsx');
}

// Função para abrir uma nova página com a tabela de histórico filtrada
function openFilteredReport() {
    const table = document.getElementById('filtered-attendance');
    const rows = table.querySelectorAll('tr');

    if (rows.length === 0) {
        alert('Nenhum dado disponível para salvar no relatório.');
        return;
    }

    // Cria o conteúdo HTML para a nova página
    const newWindow = window.open('', '_blank');
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Relatório de Histórico de Ponto</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 10px;
                    padding: 0;
                }
                h1 {
                    text-align: center;
                    font-size: 10px;
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 8px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 6px;
                    text-align: center;
                }
                th {
                    background-color: #f4f4f4;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
                .print-button {
                    display: block;
                    margin: 10px auto;
                    padding: 8px 16px;
                    font-size: 14px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .print-button:hover {
                    background-color: #45a049;
                }
                @media print {
                    .print-button {
                        display: none; /* Oculta o botão de impressão ao imprimir */
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    table {
                        page-break-inside: avoid; /* Evita quebra de página dentro da tabela */
                    }
                }
            </style>
        </head>
        <body>
            <h1>Relatório de Histórico de Ponto</h1>
            <table>
                <thead>
                    <tr>
                        <th>NOME</th>
                        <th>DATA</th>
                        <th>ENTRADA</th>
                        <th>SAÍDA</th>
                        <th>ENTRADA</th>
                        <th>SAÍDA</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(rows).map(row => row.outerHTML).join('')}
                </tbody>
            </table>
            <button class="print-button" onclick="window.print()">Imprimir Relatório</button>
        </body>
        </html>
    `;

    // Escreve o conteúdo na nova janela
    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

// Adiciona eventos de mudança aos campos de status
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('morning-status').addEventListener('change', toggleMorningFields);
    document.getElementById('afternoon-status').addEventListener('change', toggleAfternoonFields);
});

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    // Funções auxiliares
    function initializeDropdown() {
        const employeeSelect = document.getElementById('employee-select');
        const employeeSelectDaily = document.getElementById('employee-select-daily');
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];

        if (employeeSelect) {
            employeeSelect.innerHTML = '<option value="">Selecione um funcionário</option>';
            employeeList.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.name;
                option.textContent = employee.name;
                employeeSelect.appendChild(option);
            });
        }

        if (employeeSelectDaily) {
            employeeSelectDaily.innerHTML = '<option value="">Selecione um Funcionário</option>';
            employeeList.forEach((employee, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = employee.name;
                employeeSelectDaily.appendChild(option);
            });
        }
    }

    function initializeDateField() {
        const attendanceDateInput = document.getElementById('attendance-date');
        if (attendanceDateInput) {
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            attendanceDateInput.value = formattedDate;
        }
    }

    function toggleFields(statusElementId, fields) {
        const status = document.getElementById(statusElementId).value;
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (status === 'absent') {
                field.value = '';
                field.disabled = true;
            } else {
                field.disabled = false;
            }
        });
    }

    // Eventos
    function addEventListeners() {
        const attendanceForm = document.getElementById('attendance-form');
        if (attendanceForm) {
            attendanceForm.addEventListener('submit', handleAttendance);
        }

        const morningStatus = document.getElementById('morning-status');
        if (morningStatus) {
            morningStatus.addEventListener('change', () => toggleFields('morning-status', ['morning-entry', 'morning-exit']));
        }

        const afternoonStatus = document.getElementById('afternoon-status');
        if (afternoonStatus) {
            afternoonStatus.addEventListener('change', () => toggleFields('afternoon-status', ['afternoon-entry', 'afternoon-exit']));
        }

        const filterButton = document.getElementById('filter-button');
        if (filterButton) {
            filterButton.addEventListener('click', filterAttendanceByDate);
        }

        const backupButton = document.getElementById('backup-data');
        if (backupButton) {
            backupButton.addEventListener('click', backupData);
        }

        const clearButton = document.getElementById('clear-data');
        if (clearButton) {
            clearButton.addEventListener('click', clearData);
        }

        const restoreBackupInput = document.getElementById('restore-backup');
        if (restoreBackupInput) {
            restoreBackupInput.addEventListener('change', restoreBackup);
        }

        const saveReportButton = document.getElementById('save-report-button');
        if (saveReportButton) {
            saveReportButton.addEventListener('click', saveFilteredReport);
        }

        const toggleButtons = document.querySelectorAll('.toggle-table');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetTable = document.getElementById(targetId);

                if (targetTable) {
                    targetTable.classList.toggle('hidden');
                }
            });
        });

        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('nav.menu');
        if (menuToggle && menu) {
            menuToggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    }

    // Inicializa o dropdown de funcionários
    initializeDropdown();

    // Inicializa o campo de data
    initializeDateField();

    // Carrega os dados iniciais
    loadEmployees();
    loadAttendanceHistory();
    loadEmployeeSummary();

    // Adiciona os eventos
    addEventListeners();
});

document.addEventListener('DOMContentLoaded', () => {
    // Botão para filtrar por data
    const filterDateButton = document.getElementById('filter-date-button');
    if (filterDateButton) {
        filterDateButton.addEventListener('click', filterAttendanceByDate);
    }

    // Botão para filtrar horas por mês
    const filterMonthButton = document.getElementById('filter-month-button');
    if (filterMonthButton) {
        filterMonthButton.addEventListener('click', filterHoursByMonth);
    }
});

function filterHoursByMonth() {
    const selectedMonth = document.getElementById('month-select').value; // Obtém o mês selecionado
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    const hoursResult = document.getElementById('hours-result');

    // Limpa os resultados anteriores
    hoursResult.innerHTML = '';

    if (!selectedMonth) {
        alert('Por favor, selecione um mês para filtrar.');
        return;
    }

    // Filtra os registros de ponto com base no mês selecionado
    const filteredData = employeeList.flatMap(employee => {
        return (employee.attendance || []).filter(record => record.date.startsWith(`2025-${selectedMonth}`)).map(record => ({
            name: employee.name,
            ...record
        }));
    });

    // Exibe os resultados filtrados
    if (filteredData.length > 0) {
        filteredData.forEach(record => {
            const row = document.createElement('div');
            row.textContent = `${record.name} - ${record.date}`;
            hoursResult.appendChild(row);
        });
    } else {
        hoursResult.textContent = 'Nenhum registro encontrado para o mês selecionado.';
    }
}

