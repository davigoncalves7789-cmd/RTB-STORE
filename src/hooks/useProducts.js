import { useEffect, useState } from 'react'
import * as productService from '../services/productService'

/**
 * Hook que busca a lista de produtos.
 *
 * Componentes chamam `useProducts({ categoria, busca })` e recebem
 * `{ produtos, carregando, erro }` — nunca chamam productService direto.
 * Isso mantém a lógica de "buscar dados + tratar loading/erro" fora dos
 * componentes de UI (separação de responsabilidades).
 */
export function useProducts({ categoria, busca } = {}) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    productService
      .getAll({ categoria, busca })
      .then((dados) => {
        if (ativo) setProdutos(dados)
      })
      .catch((err) => {
        if (ativo) setErro(err)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false // evita setState em componente já desmontado
    }
  }, [categoria, busca])

  return { produtos, carregando, erro }
}
