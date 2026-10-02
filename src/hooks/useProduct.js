import { useEffect, useState } from 'react'
import * as productService from '../services/productService'

export function useProduct(id) {
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    productService
      .getById(id)
      .then((dados) => {
        if (ativo) setProduto(dados)
      })
      .catch((err) => {
        if (ativo) setErro(err)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  return { produto, carregando, erro }
}
