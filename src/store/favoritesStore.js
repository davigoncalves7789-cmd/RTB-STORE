import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      produtoIds: [],

      alternarFavorito: (produtoId) => {
        const atual = get().produtoIds
        const jaExiste = atual.includes(produtoId)
        set({
          produtoIds: jaExiste
            ? atual.filter((id) => id !== produtoId)
            : [...atual, produtoId],
        })
      },

      isFavorito: (produtoId) => get().produtoIds.includes(produtoId),
    }),
    { name: 'loja-react:favoritos' }
  )
)
