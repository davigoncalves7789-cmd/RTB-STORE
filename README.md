# loja-react

E-commerce em React + Vite, construído em fases. Este README é atualizado a cada fase.

## Rodando o projeto

```bash
npm install
cp .env.example .env
npm run dev
```

## Stack

React · Vite · React Router DOM · Zustand · Tailwind CSS v4 · Axios · JavaScript (sem TypeScript)

## Fase 1 — Estrutura e configuração (concluída)

O que foi entregue:

- **Estrutura de pastas completa** (`src/components`, `pages`, `routes`, `services`, `store`, `hooks`, `utils`, `data`, `config`) — ver seção abaixo.
- **Tailwind v4** integrado via plugin do Vite (sem `tailwind.config.js`/PostCSS separados — a v4 simplificou isso).
- **Roteamento** com `react-router-dom`, já com **lazy loading por rota** (cada página é um chunk JS separado — confirmado no build).
- **4 stores Zustand**: carrinho (persistido em localStorage), favoritos (idem), usuário (sem persist — token não deve ficar em localStorage) e filtros.
- **Camada `services/`**: `productService.js` já lê de `data/produtos.json`, mas com a mesma assinatura `async` que vai ter quando virar chamada HTTP para o Express. `api.js` já tem a instância do Axios configurada (comentários mostram onde entra o interceptor de JWT). `userService.js` define o contrato do login (ainda lança erro — propositalmente, não simula login falso).
- **`.env.example`** com `VITE_API_URL` e placeholders comentados para Firebase e Mercado Pago.
- **Páginas placeholder** (Home, ProductPage, Cart, Favorites, Checkout) — cada uma só confirma que a rota funciona; o conteúdo real de cada uma é do escopo das próximas fases (indicado no comentário de cada arquivo).
- **`ProtectedRoute`** já escrito (não usado ainda em nenhuma rota) — pronto para quando existir login.

## Estrutura de pastas

```
src/
├── components/
│   ├── common/       # Button, Skeleton (genéricos, sem regra de negócio)
│   ├── layout/        # Header, Footer, MainLayout
│   └── product/       # (vazio ainda — ProductCard entra na Fase 2)
├── pages/              # uma pasta por página, cada uma com index.js de barrel
├── routes/             # AppRoutes.jsx (lazy loading) + ProtectedRoute.jsx
├── services/           # api.js, productService.js, userService.js
├── store/              # cartStore, favoritesStore, userStore, filterStore (Zustand)
├── hooks/              # useProducts, useProduct
├── utils/              # formatters.js, constants.js
├── data/               # produtos.json (fonte de dados atual)
└── config/             # env.js (leitura centralizada de .env)
```

**Por que nenhum componente importa `produtos.json` direto:** só `productService.js` conhece a fonte de dados. Trocar JSON local por PostgreSQL via Express no futuro significa mudar só esse arquivo — nenhuma página muda.

## Roadmap das próximas fases

- **Fase 2** — Front básico: Header/Footer reais, `ProductCard`, grid de produtos na Home usando `useProducts`.
- **Fase 3** — Página de produto dinâmica (`/produto/:id`) com dados reais via `useProduct`, galeria de imagens, skeleton loading.
- **Fase 4** — Carrinho e favoritos funcionando de ponta a ponta com os stores já existentes.
- **Fase 5** — Filtros e busca (`filterStore` já existe, falta a UI).
- **Fase 6** — Performance: `React.memo`/`useMemo`/`useCallback` onde fizer sentido, otimização de imagens, revisão de re-renders.

## Preparação para o backend (ainda não implementado)

| Peça futura | Onde entra |
|---|---|
| Express + PostgreSQL | `productService.js` troca o import do JSON por chamadas via `api.js` |
| Firebase Auth (login Google) | `userService.js` implementa `loginWithGoogle`; popula `userStore` |
| JWT | Interceptor comentado em `services/api.js` |
| Rotas protegidas | `routes/ProtectedRoute.jsx` passa a envolver rotas em `AppRoutes.jsx` |
| Mercado Pago | Novo `services/paymentService.js`, chamado só na tela de Checkout |
| Painel admin | Novas rotas sob `/admin/*`, reaproveitando os mesmos services |
