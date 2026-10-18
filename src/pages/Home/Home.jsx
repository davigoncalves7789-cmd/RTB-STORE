import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { ProductGrid } from '../../components/product/ProductGrid'
import { HeroBanner } from '../../components/home/HeroBanner'
import { CategoryTiles } from '../../components/home/CategoryTiles'

const rotulo = (slug) => slug.charAt(0).toUpperCase() + slug.slice(1)

function TituloSecao({ id, children }) {
  return (
    <div>
      <span className="mb-3 block h-px w-10 bg-dourado" aria-hidden="true" />
      <h2 id={id} className="font-display text-3xl font-medium uppercase tracking-wide sm:text-4xl">
        {children}
      </h2>
    </div>
  )
}

export function Home() {
  const { produtos, carregando, erro } = useProducts()
  const [categoria, setCategoria] = useState(null)

  const categorias = Object.values(
    produtos.reduce((acc, p) => {
      if (!p.categoria) return acc
      acc[p.categoria] ??= {
        slug: p.categoria,
        label: rotulo(p.categoria),
        imagem: p.imagens?.[0],
        total: 0,
      }
      acc[p.categoria].total += 1
      return acc
    }, {})
  )

  const visiveis = categoria
    ? produtos.filter((p) => p.categoria === categoria)
    : produtos

  function selecionar(slug) {
    setCategoria(slug)
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById('produtos')
      ?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="sr-only">Raissa Thaynara Beauty</h1>

      <HeroBanner />

      {erro && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível carregar os produtos agora.
        </p>
      )}

      {categorias.length > 1 && (
        <section aria-labelledby="titulo-categorias" className="mb-14">
          <div className="mb-6">
            <TituloSecao id="titulo-categorias">Nossas categorias</TituloSecao>
          </div>
          <CategoryTiles
            categorias={categorias}
            ativa={categoria}
            onSelecionar={selecionar}
          />
        </section>
      )}

      <section id="produtos" aria-labelledby="titulo-produtos" className="scroll-mt-28">
        <div className="mb-6 flex items-end justify-between gap-4">
          <TituloSecao id="titulo-produtos">
            {categoria ? rotulo(categoria) : 'Nossos produtos'}
          </TituloSecao>
          {categoria && (
            <button
              type="button"
              onClick={() => setCategoria(null)}
              className="pb-1 text-sm text-grafite underline hover:text-dourado-escuro"
            >
              Ver todos os produtos
            </button>
          )}
        </div>

        <ProductGrid produtos={visiveis} carregando={carregando} />
      </section>
    </div>
  )
}
