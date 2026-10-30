import { useEffect, useState } from 'react'
import { listarProdutos, excluirProduto } from '../../services/adminService'
import { formatarPreco } from '../../utils/formatters'

export function ProductList({ onEditar }) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [erroAcao, setErroAcao] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)

  useEffect(() => {
    let ativo = true

    listarProdutos()
      .then((dados) => {
        if (ativo) setProdutos(dados)
      })
      .catch((e) => {
        if (ativo) setErro(e)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  async function excluir(produto) {
    const confirmou = window.confirm(
      `Excluir "${produto.nome}" de vez? Essa ação não pode ser desfeita.`
    )
    if (!confirmou) return

    setErroAcao(null)
    setExcluindoId(produto.id)

    try {
      await excluirProduto(produto)
      setProdutos((atuais) => atuais.filter((p) => p.id !== produto.id))
    } catch {
      setErroAcao('Não foi possível excluir o produto. Tente novamente.')
    } finally {
      setExcluindoId(null)
    }
  }

  if (carregando) {
    return <p className="text-neutral-500">Carregando produtos...</p>
  }

  if (erro) {
    return <p className="text-red-600">Não foi possível carregar os produtos.</p>
  }

  return (
    <div>
      {erroAcao && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {erroAcao}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="border-t border-neutral-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                      {produto.imagens?.[0] && (
                        <img
                          src={produto.imagens[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="line-clamp-2 font-medium text-neutral-900">
                      {produto.nome}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{produto.categoria}</td>
                <td className="px-4 py-3 text-neutral-900">
                  {formatarPreco(Number(produto.preco_promocional ?? produto.preco))}
                </td>
                <td className="px-4 py-3 text-neutral-600">{produto.estoque}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      produto.ativo
                        ? 'rounded-full bg-green-50 px-2 py-1 text-xs text-green-700'
                        : 'rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-500'
                    }
                  >
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onEditar(produto)}
                    disabled={excluindoId !== null}
                    className="text-sm text-neutral-600 underline hover:text-neutral-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(produto)}
                    disabled={excluindoId !== null}
                    className="ml-4 text-sm text-neutral-500 underline hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {excluindoId === produto.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}