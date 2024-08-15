const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');
 // Certifique-se de ter o pacote node-fetch instalado

// Função para obter a foto de perfil do usuário usando o ID da foto
async function getProfilePhoto(bot, photoId) {
  try {
    console.log(`Tentando obter a foto com ID: ${photoId}`);
    
    const file = await bot.telegram.getFile(photoId);
    console.log(`Caminho do arquivo de foto: ${file.file_path}`);
    
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    console.log(`URL da foto de perfil: ${fileUrl}`);
    
    return fileUrl;
  } catch (error) {
    console.error(`Erro ao buscar foto com ID ${photoId}: ${error.message}`);
    return null;
  }
}

// Função para baixar e salvar a imagem
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao baixar imagem: ${response.statusText}`);
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer);
  } catch (error) {
    console.error(`Erro ao salvar imagem: ${error.message}`);
  }
}

// Função para gerar imagem personalizada
async function generateImage(bot, userInfo) {
  const { name, username, image, photo_id } = userInfo; // Extraindo photo_id do JSON

  const width = 1080;
  const height = 1920;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Carregar imagem de background
  try {
    const backgroundImage = await loadImage(path.join('./tests/Images/imgFundo/fundo.png'));
    context.drawImage(backgroundImage, 0, 0, width, height);
  } catch (err) {
    console.error(`Erro ao carregar imagem de background: ${err.message}`);
    return null;
  }

  let imgAlunoPath;

  // Se o 'photo_id' estiver presente, obter e baixar a imagem de perfil
  if (photo_id) {
    const profileImageUrl = await getProfilePhoto(photo_id);
    console.log(profileImageUrl); 
    if (profileImageUrl) {
      const profileImagePath = path.join('./tests/Images', image); // Usar o nome do campo 'image' do JSON
      await downloadImage(profileImageUrl, profileImagePath);
      imgAlunoPath = profileImagePath;
    }
  }

  // Verificar se a imagem do aluno foi baixada com sucesso
  if (!imgAlunoPath || !fs.existsSync(imgAlunoPath)) {
    console.warn(`Imagem de perfil não encontrada ou não foi possível baixá-la. Usando imagem padrão.`);
    imgAlunoPath = path.join('./tests/Images', 'acolher.jpg'); // Caminho da imagem padrão
  }

  // Carregar a imagem do aluno e desenhá-la com bordas arredondadas
  try {
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
  } catch (err) {
    console.error(`Erro ao carregar imagem do aluno: ${err.message}`);
    return null;
  }

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
  const imagePath = path.join('./tests/generated', `${image}`);
  fs.writeFileSync(imagePath, buffer);

  return imagePath;
}

module.exports = {
  generateImage,
};
