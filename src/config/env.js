/**
 * Ponto único de leitura das variáveis de ambiente.
 *
 * Nenhum outro arquivo do projeto deve chamar `import.meta.env.X` diretamente.
 * Se uma variável mudar de nome, ou precisarmos de um valor calculado,
 * só mexemos aqui — o resto do app nem percebe.
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}