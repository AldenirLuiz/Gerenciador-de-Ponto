document.addEventListener('DOMContentLoaded', () => {
    // Função para fazer o backup dos dados em um arquivo JSON
    function backupData() {
        const employeeList = JSON.parse(localStorage.getItem('employees')) || [];
        if (employeeList.length === 0) {
            alert('Não há dados para fazer backup.');
            return;
        }

        // Converte os dados para JSON
        const jsonData = JSON.stringify(employeeList);

        // Cria um objeto Blob com os dados JSON
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Cria um link para download do arquivo
        const url = URL.createObjectURL(blob);

        // Cria um elemento <a> para o link de download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup-gerenciamento-ponto.json'; // Nome do arquivo de backup

        // Adiciona o elemento <a> ao DOM e simula um clique para iniciar o download
        document.body.appendChild(a);
        a.click();

        // Remove o elemento <a> do DOM
        document.body.removeChild(a);

        // Revoga a URL do objeto Blob
        URL.revokeObjectURL(url);
    }

    // Função para restaurar os dados de um arquivo JSON
    function restoreData() {
        const restoreInput = document.getElementById('restore-data');

        if (!restoreInput.files || restoreInput.files.length === 0) {
            alert('Por favor, selecione um arquivo para restaurar.');
            return;
        }

        const file = restoreInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const jsonData = event.target.result;
                const employeeList = JSON.parse(jsonData);

                // Salva os dados no localStorage
                localStorage.setItem('employees', JSON.stringify(employeeList));

                alert('Dados restaurados com sucesso!');
            } catch (error) {
                alert('Erro ao restaurar os dados: ' + error.message);
            }
        };

        reader.readAsText(file);
    }

    // Função para limpar os dados salvos no localStorage
    function clearData() {
        if (confirm('Tem certeza de que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('employees');
            alert('Dados limpos com sucesso!');
        }
    }

    // Adiciona os event listeners aos botões
    const backupButton = document.getElementById('backup-data');
    if (backupButton) {
        backupButton.addEventListener('click', backupData);
    }

    const restoreButton = document.getElementById('restore-button');
    if (restoreButton) {
        restoreButton.addEventListener('click', function() {
            document.getElementById('restore-data').click(); // Simula o clique no input file
        });
    }

    const restoreInput = document.getElementById('restore-data');
    if (restoreInput) {
        restoreInput.addEventListener('change', restoreData); // Adiciona o evento de change ao input file
    }

    const clearButton = document.getElementById('clear-data');
    if (clearButton) {
        clearButton.addEventListener('click', clearData);
    }
});