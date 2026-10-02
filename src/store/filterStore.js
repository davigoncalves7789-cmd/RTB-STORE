import { create } from 'zustand'

/**
 * Estado dos filtros da listagem de produtos (categoria, busca, ordenação).
 *
 * Fica em store global (não em useState local da página) porque múltiplos
 * componentes precisam ler e escrever nele: a barra de busca no Header,
 * a sidebar de categorias, e a grid de produtos — sem esse store, teríamos
 * que subir esse estado manualmente por várias camadas de props.
 */
export const useFilterStore = create((set) => ({
  categoria: null,
  busca: '',
  ordenacao: 'relevancia', // 'relevancia' | 'menor-preco' | 'maior-preco'

  setCategoria: (categoria) => set({ categoria }),
  setBusca: (busca) => set({ busca }),
  setOrdenacao: (ordenacao) => set({ ordenacao }),
  limparFiltros: () => set({ categoria: null, busca: '', ordenacao: 'relevancia' }),
}))
