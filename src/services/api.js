import axios from 'axios'
import { env } from '../config/env'

/**
 * Instância central do Axios.
 *
 * Nenhum service deve importar `axios` diretamente — todos importam
 * esta instância. Isso é o que nos permite, no futuro, adicionar em UM
 * lugar só:
 *   - interceptor de request: anexar o JWT em toda chamada autenticada
 *   - interceptor de response: tratamento centralizado de erros (401
 *     redireciona pro login, 500 loga em um serviço de monitoramento, etc)
 *
 * Nenhum dos services atuais (productService, userService) usa isso ainda,
 * porque ainda não existe backend — mas a instância já nasce pronta para
 * quando o Express entrar em cena.
 */
const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
})

// Exemplo do que entra aqui quando o JWT existir (deixado comentado
// propositalmente — não é código fictício rodando, é a próxima etapa real):
//
// api.interceptors.request.use((config) => {
//   const token = useUserStore.getState().token
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })
//
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useUserStore.getState().logout()
//     }
//     return Promise.reject(error)
//   }
// )

export default api
