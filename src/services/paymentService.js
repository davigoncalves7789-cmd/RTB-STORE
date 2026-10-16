import api from './api'

export async function processarPagamento(formData, itens, cliente) {
  const { data } = await api.post('/pagamentos/processar', {
    formData,
    itens,
    cliente,
  })
  return data
}