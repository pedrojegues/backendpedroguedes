const service = require('../services/treinosService.js');

function listar(req, res) {
    res.status(200).json(service.listarTodos());
}

function buscarUm(req, res) {
    const id = Number(req.params.id);
    const treino = service.buscarPorId(id);
    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    res.status(200).json(treino);
}

function criar(req, res) {
    const resultado = service.criarTreino(req.body);
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    res.status(201).json(resultado.treino);
}

function atualizar(req, res) {
    const id = Number(req.params.id);
    const resultado = service.atualizarTreino(id, req.body);
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    res.status(200).json(resultado.treino);
}

function remover(req, res) {
    const id = Number(req.params.id);
    const resultado = service.removerTreino(id);
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    res.status(204).end();
}

module.exports = { listar, buscarUm, criar, atualizar, remover };

function lerCookie(req, nome) {
const cabecalho = req.headers.cookie; // "sid=9f2c; tema=escuro" ou undefined
if (!cabecalho) return null;
const pares = cabecalho.split(';'); // ["sid=9f2c", " tema=escuro"]
for (const par of pares) {
const [chave, valor] = par.trim().split('=');
if (chave === nome) return valor;
}
return null;
}
