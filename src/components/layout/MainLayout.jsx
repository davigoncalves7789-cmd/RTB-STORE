import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Layout compartilhado por todas as rotas da loja.
 * `<Outlet />` é onde o React Router injeta a página atual — assim
 * Header/Footer não são recriados a cada troca de rota.
 */
export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
