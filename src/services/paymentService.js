import api from './api'

export async function processarPagamento(formData, itens, cliente, idempotencyKey) {
  const { data } = await api.post('/pagamentos/processar', {
    formData,
    itens,
    cliente,
    idempotencyKey,
  })
  return data
}