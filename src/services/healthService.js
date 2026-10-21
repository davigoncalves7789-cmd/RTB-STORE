import api from './api'

let emAndamento = null

export function acordarServidor() {
  if (!emAndamento) {
    emAndamento = api
      .get('/health', { timeout: 70000 })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        emAndamento = null
      })
  }
  return emAndamento
}