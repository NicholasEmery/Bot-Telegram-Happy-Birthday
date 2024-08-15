const schedule = require('node-schedule');
const { generateImage } = require('../utils/imageUtils');

function scheduleBirthdayMessages(bot, birthdayData, groupConfig, birthdayMessageTemplate) {
  const now = new Date();

  for (const [datetime, { name, username }] of Object.entries(birthdayData)) {
    const scheduledDate = new Date(datetime);

    if (scheduledDate > now) {
      console.log(`Agendando mensagem de aniversário para @${username} em ${scheduledDate}`);
      schedule.scheduleJob(scheduledDate, async () => {
        const imagePath = await generateImage(bot, { name, username, user_id: birthdayData.user_id, image: birthdayData.image });
        if (!imagePath) {
          console.error(`Erro ao gerar imagem para @${username}`);
          return;
        }

        const birthdayMessage = birthdayMessageTemplate.replace('{username}', `@${username}`);
        bot.telegram.sendPhoto(groupConfig.id, { source: imagePath }, {
          caption: birthdayMessage,
        }).catch((err) => {
          console.error(`Erro ao enviar mensagem para @${username}:`, err);
        });
      });
    } else {
      console.log(`Data de aniversário para @${username} já passou: ${scheduledDate}`);
    }
  }
}

module.exports = {
  scheduleBirthdayMessages,
};
