import api from './api'

export async function criarPreferenciaPagamento(itensCarrinho) {
  const { data } = await api.post('/pagamentos/criar-preferencia', {
    itens: itensCarrinho,
  })
  return data.checkoutUrl
}

export async function processarPagamento(api, formData, valorEsperado) {
  const { data } = await api.post('/pagamentos/processar', {
    formData,
    valorEsperado,
  })
  return data
}