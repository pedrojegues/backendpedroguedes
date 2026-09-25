const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const app = express();

app.use(express.json());

const db = new DatabaseSync('treinos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL
  )
`);

function validarTreino(corpo) {
  if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
    return 'O campo nome e obrigatorio e deve ser um texto.';
  }
  if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
  }
  return null;
}

// [Exercício 11] Rota de Resumo (Inserida antes de /treinos/:id)
app.get('/treinos/resumo', (req, res) => {
  const resumo = db.prepare('SELECT COUNT(*) AS total, SUM(duracao) AS minutos, AVG(duracao) AS media FROM treinos').get();
  
  // Garante que se o banco estiver vazio, retorne 0 em vez de null
  res.status(200).json({
    total: resumo.total || 0,
    minutos: resumo.minutos || 0,
    media: resumo.media || 0
  });
});

app.get('/treinos/total', (req, res) => {
  const resultado = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
  res.status(200).json(resultado);
});

// [Exercício 10] Atualizado para aceitar filtro por query string (?minimo e ?busca)
app.get('/treinos', (req, res) => {
  const minimo = Number(req.query.minimo);
  const busca = req.query.busca;

  // Se houver parâmetro de busca por nome
  if (typeof busca === 'string' && busca.trim() !== '') {
    const treinosBuscados = db
      .prepare('SELECT * FROM treinos WHERE nome LIKE ? ORDER BY duracao DESC')
      .all(`%${busca}%`); // O % vai no valor passado por parâmetro
    return res.status(200).json(treinosBuscados);
  }

  // Se houver parâmetro de duração mínima
  if (!isNaN(minimo)) {
    const treinosFiltrados = db // Corrigido o espaço em branco que havia aqui
      .prepare('SELECT * FROM treinos WHERE duracao >= ? ORDER BY duracao DESC')
      .all(minimo);
    return res.status(200).json(treinosFiltrados);
  }

  const todosTreinos = db.prepare('SELECT * FROM treinos ORDER BY duracao DESC').all();
  res.status(200).json(todosTreinos);
});

app.get('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);
  
  // [Exercício 12] Validação de ID inválido (não numérico ou não inteiro)
  if (isNaN(id) || !Number.isInteger(Number(req.params.id))) {
    return res.status(400).json({ erro: 'O ID informado deve ser um numero inteiro.' });
  }

  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }
  res.status(200).json(treino);
});

app.post('/treinos', (req, res) => {
  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  const resultado = db
    .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
    .run(req.body.nome, req.body.duracao);

  const novo = db
    .prepare('SELECT * FROM treinos WHERE id = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(novo);
});

app.put('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);

  // Validação de ID também no PUT
  if (isNaN(id) || !Number.isInteger(Number(req.params.id))) {
    return res.status(400).json({ erro: 'O ID informado deve ser um numero inteiro.' });
  }

  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
    .run(req.body.nome, req.body.duracao, id);

  const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  res.status(200).json(atualizado);
});

app.delete('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);

  // Validação de ID também no DELETE
  if (isNaN(id) || !Number.isInteger(Number(req.params.id))) {
    return res.status(400).json({ erro: 'O ID informado deve ser um numero inteiro.' });
  }

  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
  res.status(204).end();
});

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
