import AlunoModel from '../models/AlunoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
        }

        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'O id enviado não é um número válido!' });


        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            removerFoto(req.file.path)
            return res.status(400).json({
                error: 'O aluno não possui registros.'
            });
        }

        if (aluno.foto) {
            await fs.unlink(aluno.foto).catch(() => {});
        }

        aluno.foto = await processarFoto(req.file.path);


        await aluno.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: aluno.foto });

    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        res.status(500).json({ error: 'Erro interno ao salvar foto do aluno.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        if (!aluno.foto) {
            return res.status(400).json({
                error: 'Este aluno não tem foto cadastrada.'
            });
        }

        res.sendFile(aluno.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar foto do aluno.' });
    }
};
