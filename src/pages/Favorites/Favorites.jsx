import { Link } from 'react-router-dom'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useProducts } from '../../hooks/useProducts'
import { ProductCard } from '../../components/product/ProductCard'
import { ProductCardSkeleton } from '../../components/product/ProductCardSkeleton'

/**
 * Fase 4 — Favoritos.
 *
 * Não existe um "productService.getFavoritos()" separado: a lista de
 * favoritos guardada no store é só uma lista de IDs (ver favoritesStore.js).
 * Por isso aqui a gente busca TODOS os produtos com useProducts() e filtra
 * pelo lado do cliente. Reaproveita o mesmo <ProductCard /> da Home —
 * mesmo visual, mesmo botão de favoritar, zero código duplicado.
 */
export function Favorites() {
  const produtoIds = useFavoritesStore((state) => state.produtoIds)
  const { produtos, carregando, erro } = useProducts()

  const favoritos = produtos.filter((produto) => produtoIds.includes(produto.id))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Favoritos</h1>

      {carregando && (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: produtoIds.length || 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {erro && (
        <p className="mt-4 text-red-600">
          Não foi possível carregar seus favoritos. Tente novamente em instantes.
        </p>
      )}

      {!carregando && !erro && favoritos.length === 0 && (
        <div className="mt-8">
          <p className="text-neutral-500">
            Você ainda não favoritou nenhum produto.
          </p>
          <Link
            to="/"
            className="mt-3 inline-block font-medium text-neutral-900 underline"
          >
            Ver produtos
          </Link>
        </div>
      )}

      {!carregando && !erro && favoritos.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {favoritos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  )
}
