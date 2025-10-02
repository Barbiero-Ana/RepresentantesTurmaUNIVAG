// Credenciais ofuscadas
const LOGIN_CREDENTIALS = {
    username: atob('VW5pdmFnQHJlcHJlc2VudGFudGVz'),
    password: atob('VW5pdmFnQDIwMjU=')
};

// ID da planilha do Google Sheets
const PLANILHA_ID = '1L0w97aKcFFxGjhjYzzVyM5bhAn7dcvJm';
// Usando proxy CORS para contornar restrições
const PLANILHA_URL = `https://docs.google.com/spreadsheets/d/${PLANILHA_ID}/export?format=xlsx&gid=0`;
