import { useEffect, useState } from 'react';
import { chamar, mensagemDeErro } from './api.js';
import CartaoTreino from './CartaoTreino.jsx';

export default function Treinos({ onSessaoExpirada }) {
  const [treinos, setTreinos] = useState([]);
  const [total, setTotal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');

  // ---------------------------------------------------------------
  // PRONTO: busca de dados (useEffect + fetch). Isso e conteudo das
  // semanas 7 e 8 de Inovacao e vem pronto. Leia, entenda o fluxo
  // (tela -> fetch -> rota -> camadas -> SQLite) e NAO precisa mexer.
  // ---------------------------------------------------------------
  async function carregar() {
    try {
      const lista = await chamar('GET', '/treinos');
      if (lista.status === 200) {
        setTreinos(lista.dados);
      } else {
        setErro(mensagemDeErro(lista, 'GET /treinos'));
      }

      const t = await chamar('GET', '/treinos/total');
      setTotal(t.status === 200 && t.json ? t.dados.total : null);
    } catch {
      setErro('Não consegui falar com a API.');
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  // PRONTO: trata a resposta de uma acao que exige login.
  // Devolve true se deu certo.
  function conferir(r, rota) {
    if (r.status === 401) {
      onSessaoExpirada();
      return false;
    }
    if (r.status >= 400) {
      setErro(mensagemDeErro(r, rota));
      return false;
    }
    setErro('');
    return true;
  }

  // PRONTO: acoes que falam com a API. A tela so chama estas funcoes.
  async function enviarNovoTreino() {
    const r = await chamar('POST', '/treinos', {
      nome: nome,
      duracao: Number(duracao),
    });
    if (conferir(r, 'POST /treinos')) {
      setNome('');
      setDuracao('');
      carregar();
    }
  }

  async function concluir(id) {
    const r = await chamar('PUT', `/treinos/${id}/concluir`);
    if (conferir(r, 'PUT /treinos/:id/concluir')) {
      carregar();
    }
  }

  async function apagar(id) {
    const r = await chamar('DELETE', `/treinos/${id}`);
    if (conferir(r, 'DELETE /treinos/:id')) {
      carregar();
    }
  }

  // ---------------------------------------------------------------
  // TAREFA 6: validacao do formulario "Novo treino", ANTES de chamar
  // enviarNovoTreino(). Regras:
  //   - nome nao pode ser vazio (trim())
  //   - duracao precisa ser um numero inteiro de 1 a 180
  // Em caso de problema: setErro('texto') e NAO chame enviarNovoTreino.
  // ---------------------------------------------------------------
  function aoEnviar(evento) {
    evento.preventDefault();

    if (nome.trim() === '') {
      setErro('Informe o nome do treino.');
      return;
    }

    const duracaoNumero = Number(duracao);
    if (
      duracao === '' ||
      !Number.isInteger(duracaoNumero) ||
      duracaoNumero < 1 ||
      duracaoNumero > 180
    ) {
      setErro('A duração precisa ser um número inteiro de 1 a 180.');
      return;
    }

    setErro('');
    enviarNovoTreino();
  }

  return (
    <>
      {/* TAREFA 5: deixe os dois campos CONTROLADOS (value + onChange,
          igual ao Login). Os estados nome e duracao ja existem la em cima. */}
      <form className="cartao" onSubmit={aoEnviar}>
        <h2>Novo treino</h2>
        <div className="linha-form">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>
          <div>
            <label htmlFor="duracao">Duração (min)</label>
            <input
              id="duracao"
              type="number"
              min="1"
              max="180"
              value={duracao}
              onChange={(evento) => setDuracao(evento.target.value)}
            />
          </div>
          <button type="submit">Adicionar</button>
        </div>
      </form>

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}

      <section className="cartao">
        <h2>
          Meus treinos{' '}
          <span className="selo">
            {total === null ? 'total: ?' : `total: ${total}`}
          </span>
        </h2>

        {carregando && <p className="suave">Carregando...</p>}

        {!carregando && treinos.length === 0 && (
          <p className="suave">
            Nenhum treino ainda. Cadastre o primeiro acima.
          </p>
        )}

        <ul className="lista">
          {treinos.map((treino) => (
            <CartaoTreino
              key={treino.id}
              treino={treino}
              onConcluir={concluir}
              onApagar={apagar}
            />
          ))}
        </ul>
      </section>
    </>
  );
}
