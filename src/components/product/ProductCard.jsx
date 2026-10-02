import { Link } from 'react-router-dom'
import { formatarPreco } from '../../utils/formatters'
import { useFavoritesStore } from '../../store/favoritesStore'

/**
 * Card de produto. Recebe o objeto `produto` inteiro (mesmo formato que
 * vem de productService.getAll) e não sabe nada sobre onde é renderizado —
 * por isso serve pra Home, resultado de busca, "produtos relacionados",
 * etc, sem duplicar código.
 *
 * O botão de favorito fica dentro do card, mas para de propagar o clique
 * pro <Link> (senão clicar em favoritar navegaria pra página do produto).
 */
export function ProductCard({ produto }) {
  const isFavorito = useFavoritesStore((state) => state.isFavorito(produto.id))
  const alternarFavorito = useFavoritesStore((state) => state.alternarFavorito)

  const semEstoque = produto.estoque === 0
  const temPromocao = produto.precoPromocional != null

  function handleFavoritoClick(event) {
    event.preventDefault() // não navega pro /produto/:id
    alternarFavorito(produto.id)
  }

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 transition-shadow hover:shadow-md"
    >
      <button
        type="button"
        onClick={handleFavoritoClick}
        aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={isFavorito}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
      >
        <span className={isFavorito ? 'text-orange-600' : 'text-neutral-400'}>
          {isFavorito ? '♥' : '♡'}
        </span>
      </button>

      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={produto.imagens[0]}
          alt={produto.nome}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        {semEstoque && (
          <div className="absolute inset-x-0 top-0 bg-neutral-900/80 py-1 text-center text-xs font-medium text-white">
            Fora de estoque
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
          {produto.nome}
        </h3>

        <div className="mt-auto flex items-center gap-2">
          {temPromocao ? (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatarPreco(produto.preco)}
              </span>
              <span className="text-base font-semibold text-orange-600">
                {formatarPreco(produto.precoPromocional)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-neutral-900">
              {formatarPreco(produto.preco)}
            </span>
          )}
        </div>

        {produto.totalAvaliacoes > 0 && (
          <span className="text-xs text-neutral-500">
            ★ {produto.avaliacaoMedia.toFixed(1)} ({produto.totalAvaliacoes})
          </span>
        )}
      </div>
    </Link>
  )
}
