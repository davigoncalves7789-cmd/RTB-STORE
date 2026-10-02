import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Carrinho de compras.
 *
 * Usamos o middleware `persist` do Zustand para salvar em localStorage —
 * isso resolve "carrinho sobrevive a um F5" hoje. Quando o usuário logar
 * (Firebase Auth) e o backend existir, o mesmo store passa a sincronizar
 * com uma tabela `carrinho` no Postgres em vez de (ou além de) localStorage;
 * as telas que consomem `useCartStore` não mudam nada.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      itens: [], // { produtoId, quantidade }

      adicionarItem: (produtoId, quantidade = 1) => {
        const itens = get().itens
        const existente = itens.find((i) => i.produtoId === produtoId)

        if (existente) {
          set({
            itens: itens.map((i) =>
              i.produtoId === produtoId
                ? { ...i, quantidade: i.quantidade + quantidade }
                : i
            ),
          })
        } else {
          set({ itens: [...itens, { produtoId, quantidade }] })
        }
      },

      removerItem: (produtoId) => {
        set({ itens: get().itens.filter((i) => i.produtoId !== produtoId) })
      },

      atualizarQuantidade: (produtoId, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(produtoId)
          return
        }
        set({
          itens: get().itens.map((i) =>
            i.produtoId === produtoId ? { ...i, quantidade } : i
          ),
        })
      },

      limparCarrinho: () => set({ itens: [] }),

      totalItens: () => get().itens.reduce((soma, i) => soma + i.quantidade, 0),
    }),
    { name: 'loja-react:carrinho' }
  )
)
