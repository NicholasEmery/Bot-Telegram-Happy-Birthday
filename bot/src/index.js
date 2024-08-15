const { Telegraf } = require('telegraf');
const config = require('../config/config');
const { scheduleBirthdayMessages } = require('../event/schedule');
const { readJsonFile, readMessageFile } = require('../utils/fileUtils');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../secure/.env') });

const bot = new Telegraf(config.botToken);

bot.launch().then(console.log('Bot está ligado')).catch(err => {
  console.error('Erro ao iniciar o bot:', err);
});

const birthdayData1 = readJsonFile(config.grupoEquipe.jsonFile);
const birthdayData2 = readJsonFile(config.grupoAlunos.jsonFile);
const birthdayMessageTemplate = readMessageFile(config.messageTemplateFile);

scheduleBirthdayMessages(bot, birthdayData1, config.grupoEquipe.id, birthdayMessageTemplate);
scheduleBirthdayMessages(bot, birthdayData2, config.grupoAlunos.id, birthdayMessageTemplate);