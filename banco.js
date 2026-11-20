const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcrypt');

const db = new DatabaseSync('treinos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        nome    TEXT    NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario     TEXT NOT NULL UNIQUE,
        senha_hash  TEXT NOT NULL
    )
`);

const qtdUsuarios = db.prepare(
    'SELECT COUNT(*) AS total FROM usuarios'
).get().total;

if (qtdUsuarios === 0) {
    const inserir = db.prepare(
        'INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)'
    );
    inserir.run('diego', bcrypt.hashSync('1234', 10));
    inserir.run('aluno', bcrypt.hashSync('senha', 10));
}

module.exports = db;
