document.addEventListener('DOMContentLoaded', () => {
    const filterDateInput = document.getElementById('filter-date');
    const filterMonthSelect = document.getElementById('filter-month');

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

        // Itera sobre cada funcionário e exibe o histórico de ponto
        employeeList.forEach(employee => {
            if (employee.attendance && employee.attendance.length > 0) {
                employee.attendance.forEach(record => {
                    const recordMonth = record.date.substring(5, 7); // Extrai o mês da data (YYYY-MM-DD)

                    // Verifica se a data do registro corresponde à data do filtro e ao mês do filtro
                    if ((!filterDate || record.date === filterDate) &&
                        (!filterMonth || recordMonth === filterMonth)) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${employee.name}</td>
                            <td>${record.date}</td>
                            <td>${record.morningEntry}</td>
                            <td>${record.morningExit}</td>
                            <td>${record.afternoonEntry}</td>
                            <td>${record.afternoonExit}</td>
                            <td>${record.morningStatus} / ${record.afternoonStatus}</td>
                        `;
                        tbody.appendChild(row);
                    }
                });
            }
        });
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

        loadAttendanceHistory(filterDate, filterMonth);
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

    // Carrega o histórico de ponto ao carregar a página
    loadAttendanceHistory();
});