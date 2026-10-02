import produtos from '../data/produtos.json'
// import api from './api' // <- descomenta quando o backend Express existir

/**
 * productService: única porta de entrada para dados de produto.
 *
 * NENHUM componente ou página deve importar `produtos.json` diretamente.
 * Todos passam por aqui. Isso é o que permite trocar "ler um arquivo JSON"
 * por "chamar uma API Express + PostgreSQL" sem tocar em nenhuma tela.
 *
 * As funções já são `async` mesmo lendo dados locais síncronos — de propósito,
 * para que a troca futura (`await api.get(...)`) não mude a forma como quem
 * chama usa essa função.
 */

export async function getAll({ categoria, busca } = {}) {
  // Futuro:
  // const { data } = await api.get('/produtos', { params: { categoria, busca } })
  // return data

  let resultado = produtos

  if (categoria) {
    resultado = resultado.filter((p) => p.categoria === categoria)
  }

  if (busca) {
    const termo = busca.toLowerCase()
    resultado = resultado.filter((p) => p.nome.toLowerCase().includes(termo))
  }

  return resultado
}

export async function getById(id) {
  // Futuro:
  // const { data } = await api.get(`/produtos/${id}`)
  // return data

  return produtos.find((p) => p.id === id) ?? null
}
