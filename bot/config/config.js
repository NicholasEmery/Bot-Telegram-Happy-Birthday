const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../secure/.env') });

module.exports = {
  botToken: process.env.BOT_TOKEN,
  grupoEquipe: {
    id: process.env.GRUPO_EQUIPE_ID,
    jsonFile: './bot/data/equipe.json',
  },
  grupoAlunos: {
    id: process.env.GRUPO_ALUNOS_ID,
    jsonFile: './bot/data/alunos.json',
  },
  messageTemplateFileAlunos: './bot/messages/mensagemAlunos.txt',
  messageTemplateFileEquipe: './bot/messages/mensagemEquipe.txt'
};
