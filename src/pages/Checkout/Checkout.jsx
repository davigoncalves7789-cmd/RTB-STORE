import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useProducts } from '../../hooks/useProducts'
import { formatarPreco } from '../../utils/formatters'
import api from '../../services/api'
import { processarPagamento } from '../../services/paymentService'
 
const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
 
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
  const { produtos } = useProducts()
  const sdkPronto = useMercadoPagoSdk()
 
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const containerRef = useRef(null)
  const brickRef = useRef(null)
 
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
 
  useEffect(() => {
    if (!sdkPronto || !aceitouTermos || subtotal <= 0 || brickRef.current) return
 
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
            setErro(null)
            return processarPagamento(api, formData, subtotal)
              .then((res) => {
                setResultado(res)
                if (res.status === 'approved') limparCarrinho()
              })
              .catch(() => {
                setErro('Não foi possível processar o pagamento. Tente novamente.')
              })
          },
          onError: () => {
            setErro('Erro ao carregar o formulário de pagamento.')
          },
        },
      })
      .then((brick) => {
        brickRef.current = brick
      })
 
    return () => {
      brickRef.current?.unmount()
      brickRef.current = null
    }
  }, [sdkPronto, aceitouTermos, subtotal])
 
  if (itensComProduto.length === 0 && !resultado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-neutral-500">Seu carrinho está vazio.</p>
      </div>
    )
  }
 
  if (resultado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
 
        {resultado.status === 'approved' && (
          <p className="mt-4 font-medium text-green-600">
            Pagamento aprovado! Seu pedido foi confirmado.
          </p>
        )}
 
        {resultado.status === 'pending' && resultado.pontoInteracao && (
          <div className="mt-4">
            <p className="font-medium text-neutral-700">
              Escaneie o QR Code ou copie o código para pagar via Pix:
            </p>
            <img
              src={`data:image/jpeg;base64,${resultado.pontoInteracao.transaction_data.qr_code_base64}`}
              alt="QR Code Pix"
              className="mt-3 h-56 w-56"
            />
            <textarea
              readOnly
              value={resultado.pontoInteracao.transaction_data.qr_code}
              className="mt-3 w-full rounded border border-neutral-300 p-2 text-xs"
              rows={3}
            />
          </div>
        )}
 
        {resultado.status === 'rejected' && (
          <p className="mt-4 font-medium text-red-600">
            Pagamento recusado. Verifique os dados e tente novamente.
          </p>
        )}
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
              {formatarPreco(
                (produto.precoPromocional ?? produto.preco) * quantidade
              )}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold">
          <span>Total</span>
          <span>{formatarPreco(subtotal)}</span>
        </div>
      </div>
 
      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}
 
      {!aceitouTermos ? (
        <div className="mt-6">
          <label className="flex items-start gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              className="mt-1"
            />
            Estou ciente de que vou inserir os dados do meu cartão para
            pagamento e que essa informação é processada diretamente pelo
            Mercado Pago, não sendo armazenada por este site.
          </label>
        </div>
      ) : (
        <div id="payment-brick-container" ref={containerRef} className="mt-6" />
      )}
    </div>
  )
}
 