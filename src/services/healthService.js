import api from './api'

let tentativa = null

export function acordarServidor() {
  if (!tentativa) {
    tentativa = api
      .get('/health', { timeout: 70000 })
      .then(() => true)
      .catch(() => {
        tentativa = null
        return false
      })
  }
  return tentativa
}