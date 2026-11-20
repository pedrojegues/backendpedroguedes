const service = require('../services/treinosService.js');

function idValido(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function listar(req, res) {
    let minimo;
    if (req.query.minimo !== undefined) {
        minimo = Number(req.query.minimo);
        if (!Number.isFinite(minimo) || minimo < 0) {
            return res.status(400).json({ erro: 'O parametro minimo deve ser um numero.' });
        }
    }
    return res.status(200).json(service.listarTodos(minimo, req.query.busca));
}

function buscarUm(req, res) {
    const id = idValido(req.params.id);
    if (id === null) {
        return res.status(400).json({ erro: 'Id invalido.' });
    }
    const treino = service.buscarPorId(id);
    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    return res.status(200).json(treino);
}

function criar(req, res) {
    const resultado = service.criarTreino(req.body);
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    return res.status(201).json(resultado.treino);
}

function atualizar(req, res) {
    const id = idValido(req.params.id);
    if (id === null) {
        return res.status(400).json({ erro: 'Id invalido.' });
    }
    const resultado = service.atualizarTreino(id, req.body);
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    return res.status(200).json(resultado.treino);
}

function remover(req, res) {
    const id = idValido(req.params.id);
    if (id === null) {
        return res.status(400).json({ erro: 'Id invalido.' });
    }
    const resultado = service.removerTreino(id);
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    return res.status(204).end();
}

function contar(req, res) {
    return res.status(200).json(service.contarTreinos());
}

function resumo(req, res) {
    const resultado = service.resumoTreinos();
    resultado.media = Number(resultado.media.toFixed(2));
    return res.status(200).json(resultado);
}

module.exports = { listar, buscarUm, criar, atualizar, remover, contar, resumo };
