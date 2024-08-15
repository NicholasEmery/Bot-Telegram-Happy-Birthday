const { Telegraf } = require('telegraf');
const config = require('./bot/config/config');
const { scheduleBirthdayMessages } = require('./bot/event/schedule');
const { readJsonFile, readMessageFile } = require('./bot/utils/fileUtils');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../secure/.env') });

const bot = new Telegraf(config.botToken);

bot.launch().then(() => console.log('Bot está ligado')).catch(err => {
  console.error('Erro ao iniciar o bot:', err);
});

const birthdayData1 = readJsonFile(config.grupoEquipe.jsonFile);
const birthdayData2 = readJsonFile(config.grupoAlunos.jsonFile);
const birthdayMessageTemplateAlunos = readMessageFile(config.messageTemplateFileAlunos);
const birthdayMessageTemplateEquipe = readMessageFile(config.messageTemplateFileEquipe);

scheduleBirthdayMessages(bot, birthdayData1, config.grupoEquipe, birthdayMessageTemplateEquipe);
scheduleBirthdayMessages(bot, birthdayData2, config.grupoAlunos, birthdayMessageTemplateAlunos);
