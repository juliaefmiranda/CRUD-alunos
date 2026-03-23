import sharp from 'sharp';
// Sharp é uma biblioteca de processamento de imagens que permite redimensionar, converter e otimizar fotos
import multer from 'multer';
// Multer é um middleware para lidar com uploads de arquivos multipart/form-data, usado para processar as fotos enviadas pelos clientes
import fs from 'fs';
// FS é o módulo de sistema de arquivos do Node.js, usado para criar pastas, ler e escrever arquivos de foto
import path from 'path';
// Path é o módulo de manipulação de caminhos do Node.js, usado para construir caminhos de arquivos de forma segura e compatível com diferentes sistemas operacionais

const UPLOADS_DIR = './uploads';

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
// fs é usado para criar a pasta uploads (se não existir) e para ler/escrever arquivos de foto
// existsSync verifica se o arquivo existe, unlinkSync remove o arquivo do disco
// mkdirSync cria a pasta uploads para armazenar as fotos enviadas

// Configuração do diskStorage — salva arquivo no disco com nome padronizado
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    // cb é a função de callback do multer, recebe o erro (null se não houver) e o destino do arquivo
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // extname extrai a extensão do arquivo original (ex: .jpg, .png)
        // O nome do arquivo é aluno_ID_TIMESTAMP.ext (ex: aluno_1_123456.jpg)
        cb(null, `aluno_${req.params.id}_${Date.now()}${ext}`);
    },
});

// Exporta o middleware de upload pronto para usar na rota
export const upload = multer({ storage });

/**
 * Processa a imagem com Sharp (redimensiona + converte para JPEG),
 * sobrescreve o arquivo em disco e retorna o caminho.
 */
export async function processarFoto(filePath) {
    const processado = await sharp(fs.readFileSync(filePath))
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    fs.writeFileSync(filePath, processado);
    return filePath.replace(/\\/g, '/');
}

/**
 * Remove o arquivo de foto do disco, se existir.
 */
export function removerFoto(filePath) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
