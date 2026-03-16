import express from 'express';
import 'dotenv/config';
import alunosRoute from './routes/alunosRoute.js';
import pdfRoutes from './routes/pdfRoute.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/aluno', alunosRoute);
app.use('/pdf', pdfRoutes);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
