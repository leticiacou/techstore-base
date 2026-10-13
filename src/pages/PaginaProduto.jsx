import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({
  produtos,
  onAdicionar,
  listaEspera = [],
  onAdicionarNaListaEspera,
}) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = Number(produto.estoque || 0) === 0
  const interessados = listaEspera.filter((item) => String(item.produtoId) === String(produto.id))
  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        Number(item.estoque || 0) > 0
    )
    .slice(0, 4)

  function handleSubmit(event) {
    event.preventDefault()

    const nome = formulario.nome.trim()
    const email = formulario.email.trim()

    if (!nome || !email || !onAdicionarNaListaEspera) return

    onAdicionarNaListaEspera(produto.id, produto.title, nome, email)
    setFormulario({ nome: '', email: '' })
    setMensagem('Você foi adicionado à lista de espera. Vamos te avisar quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className={`detalhe-estoque ${esgotado ? 'detalhe-estoque-esgotado' : ''}`}>
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {!esgotado && (
            <button className="botao botao-grande" onClick={() => onAdicionar(produto)}>
              Adicionar ao carrinho
            </button>
          )}

          {esgotado && (
            <div className="lista-espera-bloco">
              <p className="texto-auxiliar-lojista">
                Quer receber um aviso quando esse item voltar ao estoque?
              </p>

              {mensagem ? (
                <p className="mensagem-sucesso">{mensagem}</p>
              ) : (
                <form className="lista-espera-form" onSubmit={handleSubmit}>
                  <div className="lista-espera-campos">
                    <label>
                      Nome
                      <input
                        type="text"
                        value={formulario.nome}
                        onChange={(event) =>
                          setFormulario((estado) => ({ ...estado, nome: event.target.value }))
                        }
                        placeholder="Seu nome"
                        required
                      />
                    </label>

                    <label>
                      E-mail
                      <input
                        type="email"
                        value={formulario.email}
                        onChange={(event) =>
                          setFormulario((estado) => ({ ...estado, email: event.target.value }))
                        }
                        placeholder="seu@email.com"
                        required
                      />
                    </label>
                  </div>

                  <button type="submit" className="botao botao-secundario">
                    Avise-me quando voltar
                  </button>
                </form>
              )}

              {interessados.length > 0 && (
                <div className="lista-espera-resultado">
                  <p>Já aguardam a volta deste produto:</p>
                  <ul>
                    {interessados.map((interessado) => (
                      <li key={`${produto.id}-${interessado.email}`}>
                        {interessado.nome} · {interessado.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.length === 0 ? (
          <div className="estado-vazio">
            <p>Nenhum produto relacionado disponível no momento.</p>
          </div>
        ) : (
          relacionados.map((item) => (
            <article key={item.id} className="card">
              <Link to={`/produto/${item.id}`} className="card-link">
                <div className="card-imagem-moldura">
                  <img src={item.image} alt={item.title} className="card-imagem" />
                </div>
                <h3 className="card-titulo">{item.title}</h3>
              </Link>
              <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
              <button className="botao" onClick={() => onAdicionar(item)}>
                Adicionar ao carrinho
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
