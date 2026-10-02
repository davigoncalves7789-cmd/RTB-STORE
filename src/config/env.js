/**
 * Ponto único de leitura das variáveis de ambiente.
 *
 * Por que isso existe mesmo sem backend ainda:
 * nenhum outro arquivo do projeto deve chamar `import.meta.env.X` diretamente.
 * Se um dia uma variável mudar de nome, ou precisarmos de um valor calculado
 * (ex: normalizar a baseURL da API), só mexemos aqui — o resto do app nem
 * percebe.
 *
 * Hoje só existe VITE_API_URL (não usada ainda, mas já preparada para o
 * Express futuro). Conforme o projeto evoluir, outras entram aqui:
 * VITE_FIREBASE_*, VITE_MERCADO_PAGO_PUBLIC_KEY, etc.
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
