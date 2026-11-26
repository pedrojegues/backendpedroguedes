export default function BarraFiltros({
  termoBusca,
  onSearch,
  statusAtivo,
  onStatusChange,
  ordenacaoAtiva,
  onSort,
}) {
  const filtrosStatus = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'pendentes', texto: 'Pendentes' },
    { valor: 'concluidos', texto: 'Concluídos' },
  ];

  const ordenacoes = [
    { valor: 'padrao', texto: 'Ordem padrão' },
    { valor: 'duracao-asc', texto: 'Menor duração' },
    { valor: 'duracao-desc', texto: 'Maior duração' },
    { valor: 'nome', texto: 'Nome' },
  ];

  return (
    <aside className="barra-filtros" aria-label="Filtros de treinos">
      <h3 className="titulo-filtros">Filtros dos treinos</h3>

      <div className="campo-busca">
        <label htmlFor="busca-treino">Buscar treino</label>
        <input
          id="busca-treino"
          className="input-busca"
          type="search"
          placeholder="Nome do treino..."
          value={termoBusca}
          onChange={(evento) => onSearch(evento.target.value)}
        />
      </div>

      <div className="grupo-filtros">
        <p className="subtitulo-filtro">Status</p>
        <div className="grupo-botoes-filtro">
          {filtrosStatus.map((filtro) => (
            <button
              key={filtro.valor}
              type="button"
              className={`btn-filtro${statusAtivo === filtro.valor ? ' ativo' : ''}`}
              aria-pressed={statusAtivo === filtro.valor}
              onClick={() => onStatusChange(filtro.valor)}
            >
              {filtro.texto}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo-filtros">
        <p className="subtitulo-filtro">Ordenar por</p>
        <div className="grupo-botoes-filtro">
          {ordenacoes.map((ordenacao) => (
            <button
              key={ordenacao.valor}
              type="button"
              className={`btn-filtro${ordenacaoAtiva === ordenacao.valor ? ' ativo' : ''}`}
              aria-pressed={ordenacaoAtiva === ordenacao.valor}
              onClick={() => onSort(ordenacao.valor)}
            >
              {ordenacao.texto}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
