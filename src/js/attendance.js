document.addEventListener('DOMContentLoaded', () => {
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
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const attendanceDate = attendanceDateInput.value;
        const employeeIndex = employeeSelect.value;

        if (employeeIndex === '') {
            alert('Por favor, selecione um funcionário.');
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

        alert('Ponto registrado com sucesso!');
    }

    // Adiciona o evento de submit ao formulário
    const attendanceForm = document.getElementById('attendance-form');
    if (attendanceForm) {
        attendanceForm.addEventListener('submit', handleAttendance);
    }

    // Carrega os funcionários no dropdown ao carregar a página
    populateEmployeeDropdown();
});