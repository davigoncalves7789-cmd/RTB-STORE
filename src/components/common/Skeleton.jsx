/**
 * Bloco de skeleton loading genérico. Recebe classes de Tailwind para
 * controlar tamanho/formato conforme o contexto (card de produto, linha
 * de texto, imagem, etc), em vez de ter um skeleton hardcoded por tela.
 */
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-neutral-200 ${className}`} />
}
