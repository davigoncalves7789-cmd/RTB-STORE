import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

const CLASSES_GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'

/**
 * ProductGrid encapsula os 3 estados possíveis de uma listagem: carregando,
 * vazia, ou com resultados. Quem usa esse componente (Home hoje, resultado
 * de busca ou "relacionados" depois) só passa os dados — não repete essa
 * lógica de estado em cada tela.
 */
export function ProductGrid({ produtos, carregando }) {
  if (carregando) {
    return (
      <div className={CLASSES_GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <p className="py-16 text-center text-neutral-500">
        Nenhum produto encontrado.
      </p>
    )
  }

  return (
    <div className={CLASSES_GRID}>
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  )
}
