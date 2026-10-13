const CATEGORIAS = [
    { id: 'roupas', nome: 'Roupas' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'acessorios', nome: 'Acessórios' },
    { id: 'casa', nome: 'Casa' },
]

const formatarMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export default function PaginaLojista({ produtos = [] }) {
    const totaisPorCategoria = CATEGORIAS.map((categoria) => {
        const itensCategoria = produtos.filter((produto) => produto.category === categoria.id)

        const valorPotencial = itensCategoria.reduce((total, produto) => {
            const quantidade = Number(produto.estoque || 0)
            const preco = Number(produto.price || 0)
            return total + quantidade * preco
        }, 0)

        const unidadesEmEstoque = itensCategoria.reduce((total, produto) => {
            return total + Number(produto.estoque || 0)
        }, 0)

        return {
            ...categoria,
            valorPotencial,
            unidadesEmEstoque,
        }
    })

    const produtosSemPreco = produtos.filter((produto) => !produto.price || Number(produto.price) <= 0)
    const unidadesSemPreco = produtosSemPreco.reduce((total, produto) => {
        return total + Number(produto.estoque || 0)
    }, 0)

    const totalGeral = totaisPorCategoria.reduce((total, categoria) => {
        return total + categoria.valorPotencial
    }, 0)

    const totalUnidades = totaisPorCategoria.reduce((total, categoria) => {
        return total + categoria.unidadesEmEstoque
    }, 0)

    return (
        <section>
            <p className="sobretitulo">Painel do lojista</p>
            <h1>Potencial de faturamento</h1>

            <div className="dashboard-lojista">
                <div className="resumo-lojista">
                    <p className="rotulo rotulo-lojista">Total</p>
                    <p className="valor-total-lojista">{formatarMoeda.format(totalGeral)}</p>
                    <p className="texto-auxiliar-lojista">
                        {totalUnidades} unidades em estoque em todas as categorias.
                    </p>
                </div>

                <div className="lista-categorias-lojista">
                    {totaisPorCategoria.map((categoria) => (
                        <article key={categoria.id} className="cartao-categoria-lojista">
                            <div>
                                <p className="rotulo rotulo-categoria">{categoria.nome}</p>
                                <h2>{formatarMoeda.format(categoria.valorPotencial)}</h2>
                            </div>

                            <div className="meta-categoria-lojista">
                                <span>{categoria.unidadesEmEstoque} itens</span>
                                <span>{categoria.valorPotencial > 0 ? 'Potencial total' : 'Sem itens em estoque'}</span>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="resumo-lojista resumo-lojista-alerta">
                    <p className="rotulo rotulo-lojista">Aguardando preço do time de suprimentos</p>
                    <p className="valor-total-lojista valor-total-lojista-pequeno">
                        {produtosSemPreco.length} produtos
                    </p>
                    <p className="texto-auxiliar-lojista">
                        {unidadesSemPreco} unidades estão paradas até o preço ser definido.
                    </p>
                </div>
            </div>
        </section>
    )
}