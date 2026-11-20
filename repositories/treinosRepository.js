const db = require('../banco.js');

function listarTodos(minimo, busca) {
    if (minimo !== undefined) {
        return db.prepare(
            'SELECT * FROM treinos WHERE duracao >= ? ORDER BY duracao DESC'
        ).all(minimo);
    }
    if (busca !== undefined) {
        return db.prepare(
            'SELECT * FROM treinos WHERE nome LIKE ? ORDER BY duracao DESC'
        ).all(`%${busca}%`);
    }
    return db.prepare(
        'SELECT * FROM treinos ORDER BY duracao DESC'
    ).all();
}

function buscarPorId(id) {
    return db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
}

function criar(nome, duracao) {
    const resultado = db
        .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
        .run(nome, duracao);
    return buscarPorId(resultado.lastInsertRowid);
}

function atualizar(id, nome, duracao) {
    db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
      .run(nome, duracao, id);
    return buscarPorId(id);
}

function remover(id) {
    const resultado = db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
    return resultado.changes > 0;
}

function contar() {
    return db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
}

function resumo() {
    return db.prepare(
        'SELECT COUNT(*) AS total, COALESCE(SUM(duracao), 0) AS minutos, COALESCE(AVG(duracao), 0) AS media FROM treinos'
    ).get();
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover, contar, resumo };