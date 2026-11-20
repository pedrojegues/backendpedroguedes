const db = require('./banco.js');

const antes = db.prepare(
    'SELECT COUNT(*) AS total FROM treinos'
).get().total;

const resultado = db.prepare(
    'INSERT INTO treinos (nome, duracao) VALUES (?, ?)'
).run('Teste banco 2', 20);

const criado = db.prepare(
    'SELECT * FROM treinos WHERE id = ?'
).get(resultado.lastInsertRowid);

const depois = db.prepare(
    'SELECT COUNT(*) AS total FROM treinos'
).get().total;

console.log({
    antes,
    depois,
    criado,
    persistenciaConfirmada: criado !== undefined && depois === antes + 1,
});
