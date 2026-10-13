import test from 'node:test'
import assert from 'node:assert/strict'

import { filtrarProdutosDisponiveis, agruparListaEspera } from './estoque.js'

test('filtra produtos sem estoque da loja', () => {
    const produtos = [
        { id: 'a', estoque: 0 },
        { id: 'b', estoque: 3 },
        { id: 'c', estoque: 10 },
    ]

    assert.deepEqual(filtrarProdutosDisponiveis(produtos), [
        { id: 'b', estoque: 3 },
        { id: 'c', estoque: 10 },
    ])
})

test('agrupa clientes que estão na fila de espera por produto', () => {
    const listaEspera = [
        { produtoId: 'a', nome: 'Ana', email: 'ana@email.com' },
        { produtoId: 'a', nome: 'Beto', email: 'beto@email.com' },
        { produtoId: 'b', nome: 'Carla', email: 'carla@email.com' },
    ]

    assert.deepEqual(agruparListaEspera(listaEspera), [
        {
            produtoId: 'a',
            nome: 'Ana',
            email: 'ana@email.com',
            quantidade: 2,
            interessados: [
                { nome: 'Ana', email: 'ana@email.com' },
                { nome: 'Beto', email: 'beto@email.com' },
            ],
        },
        {
            produtoId: 'b',
            nome: 'Carla',
            email: 'carla@email.com',
            quantidade: 1,
            interessados: [{ nome: 'Carla', email: 'carla@email.com' }],
        },
    ])
})
