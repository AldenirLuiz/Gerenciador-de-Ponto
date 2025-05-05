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
        option.value = index;
        option.textContent = employee.name;
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
    const attendanceDate = document.getElementById('attendance-date').value; // Obtém a data selecionada
    const employeeIndex = document.getElementById('employee-select-daily').value;
    const attendanceStatus = document.getElementById('attendance-status').value;
    const morningEntry = document.getElementById('morning-entry').value;
    const morningExit = document.getElementById('morning-exit').value;
    const afternoonEntry = document.getElementById('afternoon-entry').value;
    const afternoonExit = document.getElementById('afternoon-exit').value;

    if (employeeIndex !== '' && employeeList[employeeIndex]) {
        const employee = employeeList[employeeIndex];

        // Adiciona o registro de ponto ao histórico
        employee.attendance.push({
            date: attendanceDate, // Já está no formato YYYY-MM-DD vindo do input[type="date"]
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
    data.push(['Nome', 'Data', 'Entrada Manhã', 'Saída Manhã', 'Entrada Tarde', 'Saída Tarde', 'Status']); // Cabeçalho

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
                        <th>ENTRADA MANHÃ</th>
                        <th>SAÍDA MANHÃ</th>
                        <th>ENTRADA TARDE</th>
                        <th>SAÍDA TARDE</th>
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

// Adiciona o evento de mudança ao campo de status
document.getElementById('attendance-status').addEventListener('change', toggleTimeFields);

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    populateEmployeeDropdown();
    loadEmployees();
    loadAttendanceHistory();
    loadEmployeeSummary();
    document.getElementById('attendance-form').addEventListener('submit', event => {
        handleAttendance(event);
        loadEmployeeSummary(); // Atualiza o resumo após registrar o ponto
    });
    toggleTimeFields();
});

document.addEventListener('DOMContentLoaded', function() {
    // Preencher automaticamente o campo de data com a data atual
    const attendanceDateInput = document.getElementById('attendance-date');
    if (attendanceDateInput) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        attendanceDateInput.value = formattedDate;
    }
});

// Adiciona o evento de carregamento da página para preencher o seletor de funcionários
document.addEventListener('DOMContentLoaded', function() {
    const employeeSelect = document.getElementById('employee-select');
    const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
    // Limpa o conteúdo atual do seletor
    employeeSelect.innerHTML = '';
    // Adiciona uma opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um funcionário';
    employeeSelect.appendChild(defaultOption);
    // Adiciona uma opção para cada funcionário
    employeeList.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.name; // Usa o nome como valor
        option.textContent = employee.name; // Exibe o nome no seletor
        employeeSelect.appendChild(option);
    });
    // Verifica se há funcionários na lista
    if (employeeList.length === 0) {
        console.warn('Nenhum funcionário encontrado no localStorage.');
    }

    // Adiciona cada funcionário como uma opção no seletor
    employeeList.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.name; // Usa o nome como valor
        option.textContent = employee.name; // Exibe o nome no seletor
        employeeSelect.appendChild(option);
        // Verifica se o funcionário foi adicionado corretamente
        
    });
});

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

document.addEventListener('DOMContentLoaded', function () {
    const monthSelect = document.getElementById('month-select');
    const employeeSelect = document.getElementById('employee-select');
    const filterButton = document.getElementById('filter-button');
    const hoursResult = document.getElementById('hours-result');

    // Adiciona o evento de clique ao botão de filtro
    filterButton.addEventListener('click', function () {
        const selectedMonth = monthSelect.value; // Mês selecionado (ex: "01" para Janeiro)
        const selectedEmployee = employeeSelect.value; // Nome do funcionário selecionado

        // Obtém a lista de funcionários do localStorage
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];

        // Filtra os dados com base no funcionário e no mês selecionados
        const filteredData = employeeList
            .filter(employee => employee.name === selectedEmployee) // Filtra pelo funcionário
            .flatMap(employee => employee.attendance || []) // Obtém o histórico de ponto
            .filter(record => {
                if (!record.date) return false; // Ignora registros sem data
                const recordMonth = record.date.split('-')[1]; // Extrai o mês da data (YYYY-MM-DD)
                return recordMonth === selectedMonth; // Compara com o mês selecionado
            });

        // Limpa os resultados anteriores
        hoursResult.innerHTML = '';

        if (filteredData.length > 0) {
            // Cria uma tabela para exibir os resultados
            const resultTable = document.createElement('table');
            resultTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Entrada Manhã</th>
                        <th>Saída Manhã</th>
                        <th>Entrada Tarde</th>
                        <th>Saída Tarde</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredData.map(record => `
                        <tr>
                            <td>${record.date || 'N/A'}</td>
                            <td>${record.morningEntry || 'N/A'}</td>
                            <td>${record.morningExit || 'N/A'}</td>
                            <td>${record.afternoonEntry || 'N/A'}</td>
                            <td>${record.afternoonExit || 'N/A'}</td>
                            <td>${record.status || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            hoursResult.appendChild(resultTable);
        } else {
            // Exibe uma mensagem caso nenhum dado seja encontrado
            hoursResult.textContent = 'Nenhum registro encontrado para o funcionário e mês selecionados.';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Outros eventos já existentes...

    // Evento para o botão de backup
    document.getElementById('backup-data').addEventListener('click', backupData);

    // Evento para o botão de limpar dados
    document.getElementById('clear-data').addEventListener('click', clearData);

    // Evento para restaurar backup
    document.getElementById('restore-backup').addEventListener('change', restoreBackup);

    // Evento para o botão de filtrar por data
    document.getElementById('filter-date-button').addEventListener('click', filterAttendanceByDate);

    // Evento para o botão de salvar relatório
    document.getElementById('save-report-button').addEventListener('click', openFilteredReport);

    // Evento para o botão de abrir relatório filtrado
    document.getElementById('save-report-button').addEventListener('click', openFilteredReport);
});

