const express = require('express');
const treinosController = require('./controllers/treinoControllers.js');
const authController = require('./controllers/authController.js');

const app = express();
app.use(express.json());

app.get('/treinos', treinosController.listar);
app.get('/treinos/total', treinosController.contar);
app.get('/treinos/resumo', treinosController.resumo);
app.get('/treinos/:id', treinosController.buscarUm);
app.post('/treinos', authController.exigirLogin, treinosController.criar);
app.put('/treinos/:id', treinosController.atualizar);
app.delete('/treinos/:id', treinosController.remover);

app.post('/login', authController.login);
app.get('/perfil', authController.perfil);
app.post('/logout', authController.logout);

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
