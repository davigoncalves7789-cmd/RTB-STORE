import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export function Header() {
  const totalItens = useCartStore((state) => state.totalItens())

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          loja<span className="text-orange-600">.</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/favoritos" className="hover:text-orange-600">
            Favoritos
          </Link>
          <Link to="/carrinho" className="hover:text-orange-600">
            Carrinho{totalItens > 0 && ` (${totalItens})`}
          </Link>
        </nav>
      </div>
    </header>
  )
}
