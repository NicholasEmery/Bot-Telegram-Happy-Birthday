const fs = require('fs');

// Função para ler o arquivo JSON e retornar os dados
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, err.message);
    return {};
  }
}

// Função para ler a mensagem de aniversário de um arquivo de texto
function readMessageFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, err.message);
    return '';
  }
}

module.exports = {
  readJsonFile,
  readMessageFile,
};