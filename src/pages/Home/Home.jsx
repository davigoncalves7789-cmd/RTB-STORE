import { useProducts } from '../../hooks/useProducts'
import { ProductGrid } from '../../components/product/ProductGrid'

export function Home() {
  // Sem filtros ainda (categoria/busca) — isso entra na Fase 5, quando a UI
  // do filterStore existir. Por enquanto useProducts() traz tudo.
  const { produtos, carregando, erro } = useProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-neutral-900">
        Todos os produtos
      </h1>

      {erro && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível carregar os produtos agora.
        </p>
      )}

      <ProductGrid produtos={produtos} carregando={carregando} />
    </div>
  )
}
