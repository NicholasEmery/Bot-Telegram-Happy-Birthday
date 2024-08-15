const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

// Função para buscar a foto de perfil do usuário do Telegram
async function getUserProfilePhoto(username) {
  try {
    const user = await bot.telegram.getChat(username);
    if (user && user.photo) {
      const fileId = user.photo.big_file_id;
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      return fileUrl;
    }
  } catch (err) {
    console.error(`Erro ao obter a foto de perfil para @${username}:`, err.message);
  }
  return null; // Retorna null se não houver foto de perfil
}

// Função para fazer download da imagem
async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data.pipe(fs.createWriteStream(filepath))
      .on('finish', () => resolve(filepath))
      .on('error', e => reject(e));
  });
}

// Função para gerar imagem personalizada
async function generateImage(name, username) {
  const width = 1080;
  const height = 1920;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Carregar imagem de background
  const backgroundImage = await loadImage(path.join('./bot/Images/imgFundo/fundo.png'));
  context.drawImage(backgroundImage, 0, 0, width, height);

  // Tentar obter a foto de perfil do usuário
  const userProfilePhotoUrl = await getUserProfilePhoto(username);
  let imgAlunoPath;

  if (userProfilePhotoUrl) {
    imgAlunoPath = path.join(__dirname, './bot/Images', `${username}.png`);
    await downloadImage(userProfilePhotoUrl, imgAlunoPath);
  } else {
    // Usar imagem padrão se não houver foto de perfil
    imgAlunoPath = path.join('./bot/Images/nicholas.png');
  }

  // Carregar a imagem do aluno e desenhá-la com bordas arredondadas
  const imgAluno = await loadImage(imgAlunoPath);
  const x = 195;
  const y = 545;
  const w = 690;
  const h = 671;
  const radius = 10;

  // Criar o caminho para a imagem com bordas arredondadas
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + w - radius, y);
  context.arcTo(x + w, y, x + w, y + radius, radius);
  context.lineTo(x + w, y + h - radius);
  context.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  context.lineTo(x + radius, y + h);
  context.arcTo(x, y + h, x, y + h - radius, radius);
  context.lineTo(x, y + radius);
  context.arcTo(x, y, x + radius, y, radius);
  context.clip();
  context.drawImage(imgAluno, x, y, w, h);
  context.restore();

  // Adicionar texto
  context.fillStyle = '#ffffff';
  
  // Verificar o comprimento do nome e ajustar o tamanho da fonte
  if (name.length > 15) { // Ajuste o valor conforme necessário
    context.font = '70px RocaTwo-Rg'; // Fonte menor para nomes longos
  } else {
    context.font = '100px RocaTwo-Rg'; // Fonte maior para nomes curtos
  }
  
  // Calcular o tamanho do texto e centralizá-lo horizontalmente
  const textWidth = context.measureText(name).width;
  const xPosition = (width - textWidth) / 2; // Centralizar o texto horizontalmente
  context.fillText(name, xPosition, 1390);

  // Salvar imagem em arquivo
  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(__dirname, 'generated', `${name}.png`);
  fs.writeFileSync(imagePath, buffer);

  return imagePath;
}

module.exports = {
  generateImage,
};