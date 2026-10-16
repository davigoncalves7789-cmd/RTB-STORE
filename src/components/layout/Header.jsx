import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

const AVISOS = ['Pix, cartão de crédito e débito', 'Compra segura']

const linkClasse = ({ isActive }) =>
  `pb-1 text-xs tracking-wide transition-colors hover:text-dourado-escuro sm:text-sm ${
    isActive ? 'border-b border-dourado-escuro text-tinta' : 'text-grafite'
  }`

function IconeBolsa() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function Header() {
  const totalItens = useCartStore((state) => state.totalItens())

  return (
    <>
      <div className="bg-creme text-xs tracking-wide text-grafite">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-2 sm:gap-10">
          {AVISOS.map((aviso) => (
            <li key={aviso}>{aviso}</li>
          ))}
        </ul>
      </div>

      <header className="sticky top-0 z-20 border-b border-areia/60 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
          <nav className="flex items-center gap-3 sm:gap-5" aria-label="Principal">
            <NavLink to="/" end className={linkClasse}>
              Início
            </NavLink>
            <NavLink to="/favoritos" className={linkClasse}>
              Favoritos
            </NavLink>
          </nav>

          <Link to="/">
            <img
              src="/logo-raissa-thaynara.png"
              alt="Raissa Thaynara Beauty, ir para o início"
              className="h-14 w-auto sm:h-16"
            />
          </Link>

          <div className="flex justify-end">
            <Link
              to="/carrinho"
              aria-label={`Carrinho, ${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`}
              className="relative p-2 text-tinta transition-colors hover:text-dourado-escuro"
            >
              <IconeBolsa />
              {totalItens > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-dourado-escuro px-1 text-[11px] font-medium text-white">
                  {totalItens}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}