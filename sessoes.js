const { randomUUID } = require('node:crypto');
const sessoes = new Map(); // token -> id do usuario
function criar(usuarioId) {
const token = randomUUID(); // etiqueta aleatoria e unica
sessoes.set(token, usuarioId);
return token;
}
function usuarioIdDaSessao(token) {
return sessoes.get(token); // o id, ou undefined se nao existe
}
function encerrar(token) {
sessoes.delete(token);
}
module.exports = { criar, usuarioIdDaSessao, encerrar };

const db = require('../banco.js');
function buscarPorUsuario(usuario) {
return db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);
}
function buscarPorId(id) {
return db.prepare('SELECT id, usuario FROM usuarios WHERE id = ?').get(id);
}
module.exports = { buscarPorUsuario, buscarPorId };

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

module.exports = { criar, usuarioIdDaSessao, encerrar };
