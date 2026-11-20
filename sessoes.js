const { randomUUID } = require('node:crypto');

const sessoes = new Map();

function criar(usuarioId) {
    const token = randomUUID();
    sessoes.set(token, usuarioId);
    return token;
}

function usuarioIdDaSessao(token) {
    return sessoes.get(token);
}

function encerrar(token) {
    sessoes.delete(token);
}

function temSessoesAtivas() {
    return sessoes.size > 0;
}

module.exports = { criar, usuarioIdDaSessao, encerrar, temSessoesAtivas };
