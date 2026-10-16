function IconeCartao() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  )
}

function IconeCadeado() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

const BENEFICIOS = [
  { titulo: 'Pix, crédito e débito', texto: 'Escolha como pagar', Icone: IconeCartao },
  { titulo: 'Pagamento seguro', texto: 'Processado pelo Mercado Pago', Icone: IconeCadeado },
]

export function Footer() {
  return (
    <footer className="mt-16">
      <div className="bg-creme">
        <ul className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-8 sm:flex-row sm:gap-16">
          {BENEFICIOS.map(({ titulo, texto, Icone }) => (
            <li key={titulo} className="flex items-center gap-3">
              <span className="text-dourado-escuro">
                <Icone />
              </span>
              <div>
                <p className="text-sm font-medium text-tinta">{titulo}</p>
                <p className="text-xs text-grafite">{texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white py-10">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4">
          <span className="h-px flex-1 bg-areia" />
          <img
            src="/logo-raissa-thaynara.png"
            alt="Raissa Thaynara Beauty"
            className="h-16 w-auto"
          />
          <span className="h-px flex-1 bg-areia" />
        </div>
        <p className="mt-6 text-center text-xs text-grafite">
          © {new Date().getFullYear()} Raissa Thaynara Beauty. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}