// ATENÇÃO: Verifique se estas credenciais estão 100% corretas
// ID da planilha do Google Sheets
const spreadsheetId = '1YPGTd7JzSJ0BBkDOtd_v6GDCr48b0TVb79fneIOSf04'; 
// SUA CHAVE DE API PESSOAL (MUITO IMPORTANTE)
const apiKey = 'AIzaSyBELNtkmRDqT7Kjw4MVIU-Z-3KygTYMVLA';

// Nota: O código de clique do botão de doação foi removido, 
// pois o botão no HTML agora é um link telefônico direto.

// Função para carregar e exibir dados da planilha do Google Sheets
function loadGoogleSheetData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'acoes' // DEVE CORRESPONDER EXATAMENTE AO NOME DA ABA
    }).then(function(response) {
        const data = response.result.values;
        const tableBody = document.querySelector('#actions-table tbody');

        // Limpa o conteúdo existente na tabela
        tableBody.innerHTML = '';
        
        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2">Nenhum dado encontrado na planilha.</td></tr>';
            return;
        }

        // Remove a primeira linha (cabeçalho da planilha) da exibição 
        const rowsToDisplay = data.slice(1); 

        // Preenche a tabela com os dados da planilha
        rowsToDisplay.forEach(function(row) {
            const rowData = row.map(item => item || ''); // Lida com valores nulos

            const tableRow = document.createElement('tr');
            
            rowData.forEach(function(cellData) {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                tableRow.appendChild(cell);
            });

            tableBody.appendChild(tableRow);
        });
    }).catch(function(error) {
        // MENSAGEM DE ERRO VISÍVEL NA TELA
        console.error("Erro ao carregar dados do Google Sheets:", error);
        const tableBody = document.querySelector('#actions-table tbody');
        tableBody.innerHTML = '<tr><td colspan="2">Erro de Requisição. Verifique o compartilhamento da planilha, a Chave de API e a restrição de rede.</td></tr>';
    });
}

// Função para inicializar a API do Google Sheets
function initGoogleSheetsApi() {
    gapi.client.init({
        apiKey: apiKey, 
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        loadGoogleSheetData();
    });
}

// Carrega a API do Google Sheets e inicia a aplicação
gapi.load('client', initGoogleSheetsApi);