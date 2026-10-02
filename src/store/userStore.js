import { create } from 'zustand'

/**
 * Estado do usuário autenticado.
 *
 * Sem persist() de propósito: token de sessão não deve ficar em
 * localStorage (risco de XSS). Quando o Firebase Auth entrar, ele mesmo
 * cuida da persistência de sessão (via seu próprio mecanismo seguro) e
 * só repassa o usuário atual para este store através de um listener
 * (onAuthStateChanged), não o contrário.
 */
export const useUserStore = create((set) => ({
  usuario: null, // { id, nome, email, foto } quando logado
  token: null,
  isAuthenticated: false,

  setUsuario: (usuario, token) =>
    set({ usuario, token, isAuthenticated: Boolean(usuario) }),

  logout: () => set({ usuario: null, token: null, isAuthenticated: false }),
}))
