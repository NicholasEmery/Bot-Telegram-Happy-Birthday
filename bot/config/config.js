// Arquivo de Configuração do Bot
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../secure/.env') });

module.exports = {
  botToken: process.env.BOT_TOKEN,
  grupoEquipe: {
    id: process.env.TEST_CHAT_ID,
    jsonFile: './bot/data/equipe.json',
  },
  grupoAlunos: {
    id: process.env.GRUPO_ALUNOS_ID,
    jsonFile: './bot/data/alunos.json',
  },
  messageTemplateFile: './bot/messages/mensagem.txt',
};
