export function filtrarProdutosDisponiveis(produtos = []) {
    return produtos.filter((produto) => Number(produto.estoque || 0) > 0)
}

export function agruparListaEspera(listaEspera = []) {
    const mapa = new Map()

    listaEspera.forEach((interessado) => {
        const produtoId = interessado.produtoId ?? interessado.productId
        const nome = interessado.nome ?? interessado.name
        const email = interessado.email

        if (!produtoId || !nome || !email) return

        if (!mapa.has(produtoId)) {
            mapa.set(produtoId, {
                produtoId,
                interessados: [],
            })
        }

        mapa.get(produtoId).interessados.push({ nome, email })
    })

    return Array.from(mapa.values()).map((item) => ({
        produtoId: item.produtoId,
        nome: item.interessados[0]?.nome,
        email: item.interessados[0]?.email,
        quantidade: item.interessados.length,
        interessados: item.interessados,
    }))
}
