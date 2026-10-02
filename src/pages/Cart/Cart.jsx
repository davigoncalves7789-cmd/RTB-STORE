import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useProducts } from '../../hooks/useProducts'
import { formatarPreco } from '../../utils/formatters'

/**
 * Fase 4 — Carrinho.
 *
 * O cartStore guarda só { produtoId, quantidade } — de propósito, pra não
 * duplicar preço/nome/imagem no localStorage (se o preço mudar no catálogo,
 * o carrinho reflete o preço atual, não um valor congelado desatualizado).
 * Por isso cruzamos aqui com useProducts() pra montar a linha completa.
 *
 * O botão "Finalizar compra" ainda não fala com o Mercado Pago — isso é
 * combinado, entra numa etapa separada com o Payment Brick. Por enquanto
 * ele leva pra /checkout, que segue como placeholder da Fase 1.
 */
export function Cart() {
  const itens = useCartStore((state) => state.itens)
  const atualizarQuantidade = useCartStore((state) => state.atualizarQuantidade)
  const removerItem = useCartStore((state) => state.removerItem)
  const { produtos, carregando, erro } = useProducts()

  const itensComProduto = itens
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)
      return produto ? { ...item, produto } : null
    })
    .filter(Boolean)

  const subtotal = itensComProduto.reduce((soma, item) => {
    const precoUnitario = item.produto.precoPromocional ?? item.produto.preco
    return soma + precoUnitario * item.quantidade
  }, 0)

  if (carregando) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold">Carrinho</h1>
        <p className="mt-4 text-neutral-500">Carregando...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold">Carrinho</h1>
        <p className="mt-4 text-red-600">
          Não foi possível carregar seu carrinho. Tente novamente em instantes.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Carrinho</h1>

      {itensComProduto.length === 0 ? (
        <div className="mt-8">
          <p className="text-neutral-500">Seu carrinho está vazio.</p>
          <Link
            to="/"
            className="mt-3 inline-block font-medium text-neutral-900 underline"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Lista de itens */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {itensComProduto.map(({ produto, quantidade }) => {
              const precoUnitario = produto.precoPromocional ?? produto.preco

              return (
                <div
                  key={produto.id}
                  className="flex gap-4 rounded-lg border border-neutral-200 p-4"
                >
                  <Link
                    to={`/produto/${produto.id}`}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100"
                  >
                    <img
                      src={produto.imagens[0]}
                      alt={produto.nome}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/produto/${produto.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {produto.nome}
                    </Link>

                    <span className="mt-1 text-sm text-neutral-500">
                      {formatarPreco(precoUnitario)} un.
                    </span>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            atualizarQuantidade(produto.id, quantidade - 1)
                          }
                          aria-label="Diminuir quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">
                          {quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            atualizarQuantidade(produto.id, quantidade + 1)
                          }
                          aria-label="Aumentar quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removerItem(produto.id)}
                        className="text-sm text-neutral-500 underline hover:text-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <span className="font-semibold text-neutral-900">
                    {formatarPreco(precoUnitario * quantidade)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Resumo — fixo na lateral direita */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-neutral-200 p-5">
              <h2 className="font-semibold text-neutral-900">Resumo</h2>

              <div className="mt-4 flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>{formatarPreco(subtotal)}</span>
              </div>

              <p className="mt-1 text-xs text-neutral-400">
                Frete calculado na próxima etapa.
              </p>

              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-md bg-neutral-900 px-6 py-3 text-center font-medium text-white transition hover:bg-neutral-700"
              >
                Finalizar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
