export function CategoryTiles({ categorias, ativa, onSelecionar }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {categorias.map(({ slug, label, imagem, total }) => {
        const selecionada = ativa === slug

        return (
          <li key={slug}>
            <button
              type="button"
              onClick={() => onSelecionar(selecionada ? null : slug)}
              aria-pressed={selecionada}
              className={`group flex w-full flex-col items-center rounded-xl border bg-creme p-4 text-center transition-colors hover:border-dourado ${
                selecionada ? 'border-dourado-escuro' : 'border-transparent'
              }`}
            >
              <span className="aspect-square w-full overflow-hidden rounded-lg bg-white/70">
                {imagem && (
                  <img
                    src={imagem}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
              </span>
              <span className="mt-4 font-display text-2xl font-medium uppercase tracking-wide">
                {label}
              </span>
              <span className="text-xs text-grafite">
                {total} {total === 1 ? 'produto' : 'produtos'}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
