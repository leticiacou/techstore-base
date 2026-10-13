import { useMemo, useState } from 'react'
import ProdutoCard from '../components/ProdutoCard'
import { filtrarProdutosDisponiveis } from '../utils/estoque'

const CATEGORIAS = [
  { id: 'todas', nome: 'Todas' },
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
]

export default function Loja({ produtos, onAdicionar }) {
  const [categoria, setCategoria] = useState('todas')

  const produtosDisponiveis = useMemo(
    () => filtrarProdutosDisponiveis(produtos),
    [produtos]
  )

  const produtosVisiveis = useMemo(() => {
    if (categoria === 'todas') {
      return produtosDisponiveis
    }

    return produtosDisponiveis.filter((produto) => produto.category === categoria)
  }, [categoria, produtosDisponiveis])

  return (
    <section>
      <div className="vitrine-topo">
        <p className="sobretitulo">Coleção de outubro</p>
        <h1>Produtos</h1>
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por categoria">
        {CATEGORIAS.map((item) => (
          <button
            key={item.id}
            className={item.id === categoria ? 'filtro filtro-ativo' : 'filtro'}
            aria-pressed={item.id === categoria}
            onClick={() => setCategoria(item.id)}
          >
            {item.nome}
          </button>
        ))}
      </div>

      {produtosVisiveis.length === 0 ? (
        <div className="estado-vazio">
          <p>Todos os produtos desta categoria estão esgotados no momento.</p>
        </div>
      ) : (
        <div className="grade">
          {produtosVisiveis.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAdicionar={onAdicionar} />
          ))}
        </div>
      )}
    </section>
  )
}
