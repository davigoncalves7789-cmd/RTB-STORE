import { useState } from 'react'
import {
  criarProduto,
  atualizarProduto,
  enviarFoto,
} from '../../services/adminService'
import { Button } from '../../components/common/Button'

const CATEGORIAS = ['maquiagem', 'skincare', 'perfumaria']
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
const TAMANHO_MAX_FOTO = 5 * 1024 * 1024
const MAX_FOTOS = 5

const estiloInput =
  'mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20'

const paraTexto = (numero) =>
  numero == null ? '' : String(numero).replace('.', ',')

const paraNumero = (texto) =>
  texto.trim() === '' ? NaN : Number(texto.trim().replace(',', '.'))

function Campo({ id, label, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
    </div>
  )
}

function montarDados(form, quantidadeFotos) {
  const nome = form.nome.trim()
  const categoria = form.categoria.trim().toLowerCase()
  const preco = paraNumero(form.preco)
  const promocional =
    form.precoPromocional.trim() === '' ? null : paraNumero(form.precoPromocional)
  const estoque = paraNumero(form.estoque)

  if (!nome) return { mensagem: 'Informe o nome.' }
  if (!categoria) return { mensagem: 'Informe a categoria.' }
  if (!Number.isFinite(preco) || preco <= 0) {
    return { mensagem: 'Informe um preço válido.' }
  }
  if (
    promocional !== null &&
    (!Number.isFinite(promocional) || promocional <= 0 || promocional >= preco)
  ) {
    return { mensagem: 'O preço promocional precisa ser menor que o preço.' }
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    return { mensagem: 'O estoque precisa ser um número inteiro, de 0 pra cima.' }
  }
  if (form.ativo && quantidadeFotos === 0) {
    return { mensagem: 'Adicione pelo menos uma foto para deixar o produto visível.' }
  }

  return {
    dados: {
      nome,
      descricao: form.descricao.trim(),
      categoria,
      preco,
      preco_promocional: promocional,
      estoque,
      ativo: form.ativo,
    },
  }
}

export function ProductForm({ produto, onSalvo, onCancelar }) {
  const [form, setForm] = useState({
    nome: produto?.nome ?? '',
    descricao: produto?.descricao ?? '',
    categoria: produto?.categoria ?? '',
    preco: paraTexto(produto?.preco),
    precoPromocional: paraTexto(produto?.preco_promocional),
    estoque: produto ? String(produto.estoque) : '0',
    ativo: produto?.ativo ?? false,
  })
  const [fotos, setFotos] = useState(
    (produto?.imagens ?? []).map((url) => ({ chave: url, url, arquivo: null }))
  )
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const atualizar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  function adicionarFotos(e) {
    const escolhidas = Array.from(e.target.files)
    e.target.value = ''

    for (const arquivo of escolhidas) {
      if (!TIPOS_FOTO.includes(arquivo.type)) {
        setErro(`"${arquivo.name}" não é JPG, PNG ou WEBP.`)
        return
      }
      if (arquivo.size > TAMANHO_MAX_FOTO) {
        setErro(`"${arquivo.name}" passa de 5 MB.`)
        return
      }
    }

    if (fotos.length + escolhidas.length > MAX_FOTOS) {
      setErro(`Máximo de ${MAX_FOTOS} fotos por produto.`)
      return
    }

    setErro(null)
    setFotos((atuais) => [
      ...atuais,
      ...escolhidas.map((arquivo) => ({
        chave: crypto.randomUUID(),
        url: URL.createObjectURL(arquivo),
        arquivo,
      })),
    ])
  }

  function removerFoto(chave) {
    setFotos((atuais) => {
      const alvo = atuais.find((f) => f.chave === chave)
      if (alvo?.arquivo) URL.revokeObjectURL(alvo.url)
      return atuais.filter((f) => f.chave !== chave)
    })
  }

  function tornarPrincipal(chave) {
    setFotos((atuais) => {
      const alvo = atuais.find((f) => f.chave === chave)
      return [alvo, ...atuais.filter((f) => f.chave !== chave)]
    })
  }

  async function salvar(e) {
    e.preventDefault()
    const { dados, mensagem } = montarDados(form, fotos.length)

    if (mensagem) {
      setErro(mensagem)
      return
    }

    setErro(null)
    setSalvando(true)

    try {
      const imagens = await Promise.all(
        fotos.map((foto) => (foto.arquivo ? enviarFoto(foto.arquivo) : foto.url))
      )
      const completo = { ...dados, imagens }

      if (produto) await atualizarProduto(produto.id, completo)
      else await criarProduto(completo)
      onSalvo()
    } catch {
      setErro('Não foi possível salvar. Tente novamente.')
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={salvar} noValidate className="grid max-w-2xl grid-cols-6 gap-4">
      <h2 className="col-span-6 text-lg font-semibold">
        {produto ? 'Editar produto' : 'Novo produto'}
      </h2>

      <Campo id="nome" label="Nome" className="col-span-6">
        <input id="nome" value={form.nome} onChange={atualizar('nome')} className={estiloInput} />
      </Campo>

      <Campo id="descricao" label="Descrição" className="col-span-6">
        <textarea
          id="descricao"
          rows={5}
          value={form.descricao}
          onChange={atualizar('descricao')}
          className={estiloInput}
        />
      </Campo>

      <Campo id="categoria" label="Categoria" className="col-span-6 sm:col-span-2">
        <input
          id="categoria"
          list="categorias"
          value={form.categoria}
          onChange={atualizar('categoria')}
          className={estiloInput}
        />
        <datalist id="categorias">
          {CATEGORIAS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Campo>

      <Campo id="preco" label="Preço (R$)" className="col-span-3 sm:col-span-2">
        <input
          id="preco"
          inputMode="decimal"
          value={form.preco}
          onChange={atualizar('preco')}
          className={estiloInput}
        />
      </Campo>

      <Campo id="promocional" label="Promocional (opcional)" className="col-span-3 sm:col-span-2">
        <input
          id="promocional"
          inputMode="decimal"
          value={form.precoPromocional}
          onChange={atualizar('precoPromocional')}
          className={estiloInput}
        />
      </Campo>

      <Campo id="estoque" label="Estoque" className="col-span-3 sm:col-span-2">
        <input
          id="estoque"
          inputMode="numeric"
          value={form.estoque}
          onChange={atualizar('estoque')}
          className={estiloInput}
        />
      </Campo>

      <div className="col-span-6">
        <label htmlFor="fotos" className="text-sm font-medium text-neutral-700">
          Fotos (JPG, PNG ou WEBP, até 5 MB cada, máximo {MAX_FOTOS})
        </label>
        <input
          id="fotos"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={adicionarFotos}
          disabled={salvando || fotos.length >= MAX_FOTOS}
          className="mt-1 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
        />

        {fotos.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {fotos.map((foto, indice) => (
              <li key={foto.chave} className="flex flex-col gap-1">
                <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
                  <img src={foto.url} alt="" className="h-full w-full object-cover" />
                </div>
                {indice === 0 ? (
                  <span className="text-center text-xs font-medium text-neutral-900">
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => tornarPrincipal(foto.chave)}
                    disabled={salvando}
                    className="text-xs text-neutral-600 underline hover:text-neutral-900"
                  >
                    Tornar principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removerFoto(foto.chave)}
                  disabled={salvando}
                  className="text-xs text-neutral-500 underline hover:text-red-600"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="col-span-6 flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.ativo}
          onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked }))}
        />
        Visível na loja
      </label>

      {erro && (
        <p role="alert" className="col-span-6 text-sm text-red-600">
          {erro}
        </p>
      )}

      <div className="col-span-6 flex gap-3">
        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button type="button" variante="outline" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}