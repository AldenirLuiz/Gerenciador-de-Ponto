document.addEventListener('DOMContentLoaded', () => {
    const filterDateInput = document.getElementById('filter-date');
    const filterMonthSelect = document.getElementById('filter-month');
    const saveReportButton = document.getElementById('save-report-button');

    // Função para carregar o histórico de ponto
    function loadAttendanceHistory(filterDate = null, filterMonth = null) {
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
        const tbody = document.querySelector('#filtered-attendance');

        if (!tbody) {
            console.error('Corpo da tabela de histórico de ponto não encontrado.');
            return;
        }

        // Limpa o conteúdo atual do tbody
        tbody.innerHTML = '';

        let tableHTML = ''; // Variável para armazenar o HTML da tabela

        // Itera sobre cada funcionário e exibe o histórico de ponto
        employeeList.forEach((employee, employeeIndex) => {
            if (employee.attendance && employee.attendance.length > 0) {
                employee.attendance.forEach((record, recordIndex) => {
                    const recordMonth = record.date.substring(5, 7); // Extrai o mês da data (YYYY-MM-DD)

                    // Verifica se a data do registro corresponde à data do filtro e ao mês do filtro
                    if ((!filterDate || record.date === filterDate) &&
                        (!filterMonth || recordMonth === filterMonth)) {
                        const morningStatus = record.morningStatus === 'present' ? 'presente' : 'ausente';
                        const afternoonStatus = record.afternoonStatus === 'present' ? 'presente' : 'ausente';

                        tableHTML += `
                            <tr>
                                <td>${employee.name}</td>
                                <td>${record.date}</td>
                                <td>${record.morningEntry}</td>
                                <td>${record.morningExit}</td>
                                <td>${record.afternoonEntry}</td>
                                <td>${record.afternoonExit}</td>
                                <td>${morningStatus} / ${afternoonStatus}</td>
                                <td>
                                    <button class="edit-button" data-employee-index="${employeeIndex}" data-record-index="${recordIndex}">Editar</button>
                                    <button class="remove-button" data-employee-index="${employeeIndex}" data-record-index="${recordIndex}">Remover</button>
                                </td>
                            </tr>
                        `;
                    }
                });
            }
        });

        tbody.innerHTML = tableHTML; // Define o HTML da tabela no tbody

        // Adiciona os event listeners para os botões de editar e remover
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach(button => {
            button.addEventListener('click', handleRemove);
        });

        return tableHTML; // Retorna o HTML da tabela
    }

    // Função para lidar com o filtro por data
    function handleFilter() {
        let filterDate = filterDateInput.value;
        let filterMonth = filterMonthSelect.value;

        // Se a data for selecionada, limpa o mês
        if (filterDate) {
            filterMonthSelect.value = '';
            filterMonth = null;
        }
        // Se o mês for selecionado, limpa a data
        else if (filterMonth) {
            filterDateInput.value = '';
            filterDate = null;
        }

        const tableHTML = loadAttendanceHistory(filterDate, filterMonth); // Carrega o histórico de ponto e obtém o HTML da tabela

        // Salva o HTML da tabela no localStorage
        localStorage.setItem('reportTableHTML', tableHTML);
    }

    // Função para lidar com a edição de uma entrada
    function handleEdit(event) {
        const employeeIndex = event.target.dataset.employeeIndex;
        const recordIndex = event.target.dataset.recordIndex;

        // Pede a senha para confirmar a edição
        const password = prompt('Digite a senha para editar esta entrada:');

        if (password === 'lancer007') {
            // Implementar a lógica para editar a entrada
            alert(`Editar entrada do funcionário ${employeeIndex}, registro ${recordIndex}`);
        } else {
            alert('Senha incorreta. A edição não foi permitida.');
        }
    }

    // Função para lidar com a remoção de uma entrada
    function handleRemove(event) {
        const employeeIndex = event.target.dataset.employeeIndex;
        const recordIndex = event.target.dataset.recordIndex;

        // Pede a senha para confirmar a remoção
        const password = prompt('Digite a senha para remover esta entrada:');

        if (password === 'lancer007') {
            // Implementar a lógica para remover a entrada
            const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
            const employee = employeeList[employeeIndex];

            if (employee && employee.attendance && employee.attendance.length > recordIndex) {
                employee.attendance.splice(recordIndex, 1); // Remove o registro do array

                localStorage.setItem('employees', JSON.stringify(employeeList)); // Atualiza o localStorage

                loadAttendanceHistory(); // Recarrega o histórico de ponto
            } else {
                alert('Registro não encontrado.');
            }
        } else {
            alert('Senha incorreta. A remoção não foi permitida.');
        }
    }

    // Função para salvar o relatório
    function saveReport() {
        handleFilter(); // Executa o filtro para obter o HTML da tabela

        // Abre uma nova página com o relatório
        window.open('report.html', '_blank');
    }

    // Adiciona o evento de clique ao botão "Filtrar"
    const filterButton = document.getElementById('filter-date-button');
    if (filterButton) {
        filterButton.addEventListener('click', handleFilter);
    }

    // Adiciona os event listeners para limpar o outro filtro ao selecionar um
    filterDateInput.addEventListener('change', () => {
        if (filterDateInput.value) {
            filterMonthSelect.value = '';
        }
    });

    filterMonthSelect.addEventListener('change', () => {
        if (filterMonthSelect.value) {
            filterDateInput.value = '';
        }
    });

    // Adiciona o evento de clique ao botão "Salvar Relatório"
    if (saveReportButton) {
        saveReportButton.addEventListener('click', saveReport);
    }

    // Carrega o histórico de ponto ao carregar a página
    loadAttendanceHistory();
});