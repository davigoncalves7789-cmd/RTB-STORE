import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabase'
import { Button } from '../../components/common/Button'
import { ProductList } from './ProductList'
import { ProductForm } from './ProductForm'

const estiloInput =
  'mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20'

export function Admin() {
  const [sessao, setSessao] = useState(undefined)
  const [eAdmin, setEAdmin] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [entrando, setEntrando] = useState(false)
  const [tela, setTela] = useState('lista')
  const [produtoEditando, setProdutoEditando] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) =>
      setSessao(nova)
    )
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (sessao === undefined) return
    if (sessao === null) {
      setEAdmin(false)
      setVerificando(false)
      return
    }

    let ativo = true
    setVerificando(true)
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (!ativo) return
      setEAdmin(!error && data === true)
      setVerificando(false)
    })

    return () => {
      ativo = false
    }
  }, [sessao])

  async function entrar(e) {
    e.preventDefault()
    setErro(null)
    setEntrando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })
    setEntrando(false)
    if (error) setErro('E-mail ou senha incorretos.')
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  function abrirForm(produto) {
    setProdutoEditando(produto)
    setTela('form')
  }

  function fecharForm() {
    setProdutoEditando(null)
    setTela('lista')
  }

  if (sessao === undefined || verificando) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <p className="text-neutral-500">Carregando...</p>
      </div>
    )
  }

  if (!sessao) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold">Admin</h1>

        <form onSubmit={entrar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className={estiloInput}
            />
          </div>

          <div>
            <label htmlFor="senha" className="text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
              className={estiloInput}
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <Button type="submit" disabled={entrando} className="w-full">
            {entrando ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    )
  }

  if (!eAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-4 text-red-600">Esta conta não tem permissão de administrador.</p>
        <Button variante="outline" onClick={sair} className="mt-4">
          Sair
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          {tela === 'lista' && (
            <Button onClick={() => abrirForm(null)}>Novo produto</Button>
          )}
          <Button variante="outline" onClick={sair}>
            Sair
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {tela === 'lista' ? (
          <ProductList onEditar={abrirForm} />
        ) : (
          <ProductForm
            produto={produtoEditando}
            onSalvo={fecharForm}
            onCancelar={fecharForm}
          />
        )}
      </div>
    </div>
  )
}