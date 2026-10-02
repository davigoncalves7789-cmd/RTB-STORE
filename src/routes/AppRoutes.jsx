import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'

/**
 * Cada página é importada com `lazy()`, então o Vite gera um chunk JS
 * separado por rota. Quem visita a Home não baixa o código do Checkout —
 * isso é o que mantém o bundle inicial pequeno mesmo o app crescendo.
 */
const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })))
const ProductPage = lazy(() =>
  import('../pages/ProductPage').then((m) => ({ default: m.ProductPage }))
)
const Cart = lazy(() => import('../pages/Cart').then((m) => ({ default: m.Cart })))
const Favorites = lazy(() =>
  import('../pages/Favorites').then((m) => ({ default: m.Favorites }))
)
const Checkout = lazy(() =>
  import('../pages/Checkout').then((m) => ({ default: m.Checkout }))
)

function CarregandoPagina() {
  return <div className="mx-auto max-w-6xl px-4 py-10 text-neutral-400">Carregando…</div>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<CarregandoPagina />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
