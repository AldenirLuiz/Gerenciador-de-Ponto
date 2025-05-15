document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar os funcionários no dropdown
    function populateEmployeeDropdown() {
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
        const employeeSelect = document.getElementById('employee-select');

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

    // Função para filtrar as horas por mês
    function filterHours() {
        const employeeSelect = document.getElementById('employee-select');
        const monthSelect = document.getElementById('month-select');
        const hoursResult = document.getElementById('hours-result');

        const employeeIndex = employeeSelect.value;
        const month = monthSelect.value;

        if (employeeIndex === '' || month === '') {
            alert('Por favor, selecione um funcionário e um mês.');
            return;
        }

        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
        const employee = employeeList[employeeIndex];

        if (!employee || !employee.attendance) {
            hoursResult.innerHTML = '<p>Nenhum registro de ponto encontrado para este funcionário.</p>';
            return;
        }

        const filteredAttendance = employee.attendance.filter(record => {
            const recordMonth = record.date.substring(5, 7); // Extrai o mês da data (YYYY-MM-DD)
            return recordMonth === month;
        });

        if (filteredAttendance.length === 0) {
            hoursResult.innerHTML = '<p>Nenhum registro de ponto encontrado para este funcionário no mês selecionado.</p>';
            return;
        }

        // Cria a tabela para exibir os resultados
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Entrada Manhã</th>
                        <th>Saída Manhã</th>
                        <th>Entrada Tarde</th>
                        <th>Saída Tarde</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredAttendance.forEach(record => {
            tableHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.morningEntry}</td>
                    <td>${record.morningExit}</td>
                    <td>${record.afternoonEntry}</td>
                    <td>${record.afternoonExit}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        hoursResult.innerHTML = tableHTML;
    }

    // Adiciona o evento de clique ao botão "Filtrar"
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', filterHours);
    }

    // Carrega os funcionários no dropdown ao carregar a página
    populateEmployeeDropdown();
});