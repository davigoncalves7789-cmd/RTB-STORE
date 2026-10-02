import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useProduct } from '../../hooks/useProduct'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'

/**
 * Rota dinâmica /produto/:id — Fase 3.
 * Galeria de imagens, descrição completa, preço (com suporte a promoção)
 * e bloco de avaliação (nota + total; o botão "Avaliar" ainda é
 * placeholder até a integração com Firebase entrar).
 */
export function ProductPage() {
  const { id } = useParams()
  const { produto, carregando, erro } = useProduct(id)
  const [imagemAtiva, setImagemAtiva] = useState(0)

  const adicionarItem = useCartStore((state) => state.adicionarItem)
  const isFavorito = useFavoritesStore((state) =>
    produto ? state.isFavorito(produto.id) : false
  )
  const alternarFavorito = useFavoritesStore((state) => state.alternarFavorito)

  if (carregando) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Troque por <Skeleton /> se já tiver um componente de loading em
            src/components/common — deixei simples aqui pra não assumir a
            API dele sem ver o arquivo. */}
        <div className="grid animate-pulse grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-lg bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-neutral-200" />
            <div className="h-6 w-1/4 rounded bg-neutral-200" />
            <div className="h-24 w-full rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-red-600">
          Não foi possível carregar este produto. Tente novamente em instantes.
        </p>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-neutral-500">Produto não encontrado.</p>
      </div>
    )
  }

  const temPromocao = produto.precoPromocional != null
  const semEstoque = produto.estoque === 0

  const formatarPreco = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
            <img
              src={produto.imagens[imagemAtiva]}
              alt={produto.nome}
              className="h-full w-full object-cover"
            />
          </div>

          {produto.imagens.length > 1 && (
            <div className="mt-4 flex gap-3">
              {produto.imagens.map((imagem, index) => (
                <button
                  key={imagem}
                  onClick={() => setImagemAtiva(index)}
                  className={`h-20 w-20 overflow-hidden rounded-md border-2 transition ${
                    index === imagemAtiva
                      ? 'border-neutral-900'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imagem}
                    alt={`${produto.nome} — foto ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div>
          <h1 className="text-2xl font-bold">{produto.nome}</h1>

          {/* Avaliação */}
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-yellow-500" aria-hidden="true">
              {'★'.repeat(Math.round(produto.avaliacaoMedia))}
              {'☆'.repeat(5 - Math.round(produto.avaliacaoMedia))}
            </span>
            <span className="text-neutral-600">
              {produto.avaliacaoMedia.toFixed(1)} ({produto.totalAvaliacoes}{' '}
              avaliações)
            </span>
          </div>

          {/* Preço */}
          <div className="mt-4">
            {temPromocao ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-neutral-400 line-through">
                  {formatarPreco(produto.preco)}
                </span>
                <span className="text-3xl font-bold text-neutral-900">
                  {formatarPreco(produto.precoPromocional)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-neutral-900">
                {formatarPreco(produto.preco)}
              </span>
            )}
          </div>

          {/* Descrição */}
          <p className="mt-6 leading-relaxed text-neutral-600">
            {produto.descricao}
          </p>

          {/* Estoque + ação */}
          <div className="mt-8">
            {semEstoque ? (
              <p className="mb-3 text-sm font-medium text-red-600">
                Produto sem estoque no momento.
              </p>
            ) : (
              <p className="mb-3 text-sm text-neutral-500">
                {produto.estoque} unidades disponíveis
              </p>
            )}

            <button
              disabled={semEstoque}
              onClick={() => adicionarItem(produto.id, 1)}
              className="w-full rounded-md bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {semEstoque ? 'Indisponível' : 'Adicionar ao carrinho'}
            </button>

            <button
              type="button"
              onClick={() => alternarFavorito(produto.id)}
              aria-pressed={isFavorito}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <span className={isFavorito ? 'text-orange-600' : 'text-neutral-400'}>
                {isFavorito ? '♥' : '♡'}
              </span>
              {isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </button>
          </div>

          {/* Avaliar produto — placeholder até o Firebase entrar */}
          <button
            disabled
            title="Disponível em breve"
            className="mt-3 w-full rounded-md border border-neutral-300 px-6 py-3 font-medium text-neutral-400"
          >
            Avaliar produto (em breve)
          </button>
        </div>
      </div>
    </div>
  )
}
