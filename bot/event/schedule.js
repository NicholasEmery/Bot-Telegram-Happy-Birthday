const schedule = require('node-schedule');
const { generateImage } = require('../utils/imageUtils');
require('../utils/fileUtils');

function scheduleBirthdayMessages(bot, birthdayData, chatId, birthdayMessageTemplate) {
  const now = new Date();
  
  for (const [datetime, { name, username }] of Object.entries(birthdayData)) {
    const scheduledDate = new Date(datetime);

    if (scheduledDate > now) {
      schedule.scheduleJob(scheduledDate, async () => {
        const imagePath = await generateImage(bot, name, username);
        const birthdayMessage = birthdayMessageTemplate.replace('{username}', `@${username}`);

        bot.telegram.sendPhoto(chatId, { source: imagePath }, {
          caption: birthdayMessage,
        }).catch((err) => {
          console.error(`Erro ao enviar mensagem para @${username}:`, err);
        });
      });
    }
  }
}

module.exports = {
  scheduleBirthdayMessages,
};
