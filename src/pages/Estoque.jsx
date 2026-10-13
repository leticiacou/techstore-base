import { agruparListaEspera } from '../utils/estoque'

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const filaPorProduto = agruparListaEspera(listaEspera)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Lista de espera</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const fila = filaPorProduto.find(
                (item) => String(item.produtoId) === String(produto.id)
              )
              const interessados = fila?.interessados ?? []

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {interessados.length > 0 ? (
                      <ul className="lista-espera-linha">
                        {interessados.map((interessado) => (
                          <li key={`${produto.id}-${interessado.email}`}>
                            {interessado.nome} · {interessado.email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="texto-suave">Nenhuma</span>
                    )}
                  </td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
