import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useProducts } from '../../hooks/useProducts'
import { formatarPreco } from '../../utils/formatters'
import { processarPagamento } from '../../services/paymentService'

const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
const COOLDOWN_MS = 3000

const FORM_VAZIO = {
  nome: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
}

const digitos = (valor) => valor.replace(/\D/g, '')

function validar(f) {
  if (f.nome.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome.'
  if (digitos(f.telefone).length < 10) return 'Informe o telefone com DDD.'
  if (digitos(f.cep).length !== 8) return 'O CEP precisa ter 8 números.'
  if (![f.rua, f.numero, f.bairro, f.cidade].every((v) => v.trim())) {
    return 'Preencha rua, número, bairro e cidade.'
  }
  if (!/^[A-Za-z]{2}$/.test(f.estado.trim())) return 'Use a sigla do estado, como SP.'
  return null
}

const estiloInput =
  'mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20'

function Campo({ id, label, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input id={id} className={estiloInput} {...props} />
    </div>
  )
}

function useMercadoPagoSdk() {
  const [pronto, setPronto] = useState(!!window.MercadoPago)

  useEffect(() => {
    if (window.MercadoPago) return
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.onload = () => setPronto(true)
    document.body.appendChild(script)
  }, [])

  return pronto
}

export function Checkout() {
  const itens = useCartStore((state) => state.itens)
  const limparCarrinho = useCartStore((state) => state.limparCarrinho)
  const { produtos, carregando } = useProducts()
  const sdkPronto = useMercadoPagoSdk()

  const [etapa, setEtapa] = useState('dados')
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState(null)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const brickRef = useRef(null)
  const promessaRef = useRef(null)
  const liberadoEmRef = useRef(0)
  const chaveRef = useRef(crypto.randomUUID())

  const itensComProduto = itens
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)
      return produto ? { ...item, produto } : null
    })
    .filter(Boolean)

  const subtotal = itensComProduto.reduce((soma, item) => {
    const preco = item.produto.precoPromocional ?? item.produto.preco
    return soma + preco * item.quantidade
  }, 0)

  const atualizar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function buscarCep() {
    const cep = digitos(form.cep)
    if (cep.length !== 8) return
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const dados = await resposta.json()
      if (dados.erro) return
      setForm((f) => ({
        ...f,
        rua: dados.logradouro || f.rua,
        bairro: dados.bairro || f.bairro,
        cidade: dados.localidade || f.cidade,
        estado: dados.uf || f.estado,
      }))
    } catch {
      // sem autopreenchimento, a pessoa digita o endereço
    }
  }

  function confirmarDados(e) {
    e.preventDefault()
    const mensagem = validar(form)
    if (mensagem) {
      setErroForm(mensagem)
      return
    }
    setErroForm(null)
    setEtapa('pagamento')
  }

  useEffect(() => {
    if (
      etapa !== 'pagamento' ||
      !aceitouTermos ||
      !sdkPronto ||
      subtotal <= 0 ||
      resultado
    ) {
      return
    }

    let cancelado = false
    const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' })

    mp.bricks()
      .create('payment', 'payment-brick-container', {
        initialization: { amount: subtotal },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            bankTransfer: 'all',
          },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: ({ formData }) => {
            if (promessaRef.current) return promessaRef.current

            if (Date.now() < liberadoEmRef.current) {
              setErro('Aguarde alguns segundos antes de tentar de novo.')
              return Promise.reject(new Error('cooldown'))
            }

            setErro(null)
            const itensPedido = itens.map(({ produtoId, quantidade }) => ({
              produtoId,
              quantidade,
            }))
            const cliente = {
              ...form,
              telefone: digitos(form.telefone),
              cep: digitos(form.cep),
              estado: form.estado.trim().toUpperCase(),
            }

            const promessa = processarPagamento(
              formData,
              itensPedido,
              cliente,
              chaveRef.current
            )
              .then((res) => {
                setResultado(res)
                if (res.status === 'approved') limparCarrinho()
                else liberadoEmRef.current = Date.now() + COOLDOWN_MS
              })
              .catch((e) => {
                liberadoEmRef.current = Date.now() + COOLDOWN_MS
                setErro(
                  e?.response?.data?.erro ||
                    'Não foi possível processar o pagamento. Tente novamente.'
                )
                throw e
              })
              .finally(() => {
                promessaRef.current = null
                chaveRef.current = crypto.randomUUID()
              })

            promessaRef.current = promessa
            return promessa
          },
          onError: () => {
            setErro('Erro ao carregar o formulário de pagamento.')
          },
        },
      })
      .then((brick) => {
        if (cancelado) brick.unmount()
        else brickRef.current = brick
      })

    return () => {
      cancelado = true
      brickRef.current?.unmount()
      brickRef.current = null
    }
  }, [etapa, aceitouTermos, sdkPronto, subtotal, resultado])

  if (carregando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-neutral-500">Carregando...</p>
      </div>
    )
  }

  if (resultado) {
    const pix = resultado.pontoInteracao?.transaction_data
    const emAnalise = ['pending', 'in_process'].includes(resultado.status)

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>

        {resultado.status === 'approved' && (
          <>
            <p className="mt-4 font-medium text-green-700">
              Pagamento aprovado. Seu pedido foi confirmado.
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Número do pedido: {resultado.pedidoId}
            </p>
          </>
        )}

        {emAnalise && pix && (
          <div className="mt-4">
            <p className="font-medium text-neutral-800">
              Escaneie o QR Code ou copie o código para pagar com Pix.
            </p>
            <img
              src={`data:image/jpeg;base64,${pix.qr_code_base64}`}
              alt="QR Code do Pix"
              className="mt-3 h-56 w-56"
            />
            <label htmlFor="pix-codigo" className="mt-3 block text-sm text-neutral-600">
              Pix copia e cola
            </label>
            <textarea
              id="pix-codigo"
              readOnly
              value={pix.qr_code}
              rows={3}
              className="mt-1 w-full rounded-md border border-neutral-300 p-2 text-xs"
            />
            <p className="mt-2 text-sm text-neutral-600">
              Número do pedido: {resultado.pedidoId}
            </p>
          </div>
        )}

        {emAnalise && !pix && (
          <p className="mt-4 font-medium text-neutral-800">
            Seu pagamento está em análise. Guarde o número do pedido: {resultado.pedidoId}
          </p>
        )}

        {resultado.status === 'rejected' && (
          <div className="mt-4">
            <p className="font-medium text-red-600">
              Pagamento recusado. Confira os dados do cartão ou escolha outra forma de pagamento.
            </p>
            <button
              type="button"
              onClick={() => setResultado(null)}
              className="mt-4 rounded-md bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    )
  }

  if (itensComProduto.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-neutral-500">Seu carrinho está vazio.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-4 rounded-lg border border-neutral-200 p-4">
        {itensComProduto.map(({ produto, quantidade }) => (
          <div key={produto.id} className="flex justify-between py-1 text-sm">
            <span>
              {produto.nome} x{quantidade}
            </span>
            <span>
              {formatarPreco((produto.precoPromocional ?? produto.preco) * quantidade)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold">
          <span>Total</span>
          <span>{formatarPreco(subtotal)}</span>
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {erro}
        </p>
      )}

      {etapa === 'dados' ? (
        <form onSubmit={confirmarDados} noValidate className="mt-6 grid grid-cols-6 gap-4">
          <h2 className="col-span-6 text-lg font-semibold">Dados de entrega</h2>

          <Campo id="nome" label="Nome completo" className="col-span-6" value={form.nome} onChange={atualizar('nome')} autoComplete="name" />
          <Campo id="telefone" label="Telefone com DDD" className="col-span-6 sm:col-span-3" value={form.telefone} onChange={atualizar('telefone')} autoComplete="tel" inputMode="tel" />
          <Campo id="cep" label="CEP" className="col-span-6 sm:col-span-3" value={form.cep} onChange={atualizar('cep')} onBlur={buscarCep} autoComplete="postal-code" inputMode="numeric" maxLength={9} />
          <Campo id="rua" label="Rua" className="col-span-6 sm:col-span-4" value={form.rua} onChange={atualizar('rua')} autoComplete="address-line1" />
          <Campo id="numero" label="Número" className="col-span-6 sm:col-span-2" value={form.numero} onChange={atualizar('numero')} />
          <Campo id="complemento" label="Complemento (opcional)" className="col-span-6 sm:col-span-3" value={form.complemento} onChange={atualizar('complemento')} autoComplete="address-line2" />
          <Campo id="bairro" label="Bairro" className="col-span-6 sm:col-span-3" value={form.bairro} onChange={atualizar('bairro')} />
          <Campo id="cidade" label="Cidade" className="col-span-4" value={form.cidade} onChange={atualizar('cidade')} autoComplete="address-level2" />
          <Campo id="estado" label="Estado (sigla)" className="col-span-2" value={form.estado} onChange={atualizar('estado')} maxLength={2} autoComplete="address-level1" />

          {erroForm && (
            <p role="alert" className="col-span-6 text-sm text-red-600">
              {erroForm}
            </p>
          )}

          <button
            type="submit"
            className="col-span-6 rounded-md bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Continuar para o pagamento
          </button>
        </form>
      ) : (
        <>
          <div className="mt-6 flex justify-between gap-4 rounded-lg border border-neutral-200 p-4 text-sm">
            <div className="text-neutral-600">
              <p className="font-medium text-neutral-900">{form.nome}</p>
              <p>
                {form.rua}, {form.numero}
                {form.complemento && ` - ${form.complemento}`}
              </p>
              <p>
                {form.bairro} - {form.cidade}/{form.estado.toUpperCase()} - CEP {form.cep}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAceitouTermos(false)
                setEtapa('dados')
              }}
              className="self-start text-neutral-600 underline hover:text-neutral-900"
            >
              Editar
            </button>
          </div>

          {!aceitouTermos ? (
            <label className="mt-6 flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                className="mt-1"
              />
              Estou ciente de que vou inserir os dados do meu cartão para pagamento e que
              essa informação é processada diretamente pelo Mercado Pago, não sendo
              armazenada por este site.
            </label>
          ) : (
            <div id="payment-brick-container" className="mt-6" />
          )}
        </>
      )}
    </div>
  )
}