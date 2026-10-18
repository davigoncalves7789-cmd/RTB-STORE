import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { formatarPreco } from '../../utils/formatters'

const INTERVALO_MS = 5000
const MAX_SLIDES = 5

function IconeSeta() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function HeroBanner() {
  const { produtos } = useProducts()
  const slides = produtos.filter((p) => p.imagens?.length).slice(0, MAX_SLIDES)
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || pausado) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(
      () => setIndice((i) => (i + 1) % slides.length),
      INTERVALO_MS
    )
    return () => clearTimeout(id)
  }, [indice, pausado, slides.length])

  const atual = slides[indice]

  return (
    <section aria-label="Destaques" className="mb-12 overflow-hidden rounded-2xl bg-creme">
      <div className="grid items-center gap-10 px-6 py-10 sm:px-12 sm:py-14 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-grafite">
            Raissa Thaynara Beauty
            <span className="h-px w-10 bg-dourado" aria-hidden="true" />
          </p>
          <h2 className="mt-5 font-display text-5xl font-medium uppercase leading-[1.05] sm:text-6xl">
            Beleza que valoriza você
          </h2>
          <p className="mt-5 max-w-sm text-lg text-grafite">
            Produtos selecionados para realçar sua beleza.
          </p>
          {atual && (
            <Link
              to={`/produto/${atual.id}`}
              className="mt-8 inline-flex items-center gap-3 bg-dourado-escuro px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-tinta"
            >
              Comprar agora
              <IconeSeta />
            </Link>
          )}
        </div>

        {slides.length > 0 && (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Produtos em destaque"
            className="mx-auto w-full max-w-sm"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
          >
            <div className="relative aspect-[4/5]">
              <div
                className="absolute inset-x-6 inset-y-0 rounded-t-full border border-areia/70 bg-white/70"
                aria-hidden="true"
              />
              {slides.map((produto, i) => (
                <div
                  key={produto.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} de ${slides.length}`}
                  inert={i !== indice}
                  className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                    i === indice ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Link
                    to={`/produto/${produto.id}`}
                    className="flex h-full flex-col items-center justify-end px-10 pb-6 text-center"
                  >
                    <img
                      src={produto.imagens[0]}
                      alt={produto.nome}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-[68%] w-full object-contain mix-blend-multiply"
                    />
                    <span className="mt-4 line-clamp-2 text-sm text-tinta">
                      {produto.nome}
                    </span>
                    <span className="mt-1 font-display text-2xl font-semibold text-dourado-escuro">
                      {formatarPreco(produto.precoPromocional ?? produto.preco)}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-center">
              {slides.map((produto, i) => (
                <button
                  key={produto.id}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-label={`Ver ${produto.nome}`}
                  aria-current={i === indice}
                  className="p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      i === indice ? 'w-6 bg-dourado-escuro' : 'w-1.5 bg-areia'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}