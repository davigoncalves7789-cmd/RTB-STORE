import { Router } from 'express';
import { Payment } from 'mercadopago';
import { randomUUID } from 'node:crypto';
import { mercadoPagoClient } from '../config/mercadoPago.js';
import { supabase } from '../config/supabase.js';

const router = Router();

const CAMPOS_CLIENTE = ['nome', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];

const limpar = (valor, max = 100) => String(valor ?? '').trim().slice(0, max);

router.post('/processar', async (req, res) => {
  try {
    const { formData, itens, cliente, idempotencyKey } = req.body;

    if (!formData || !Array.isArray(itens) || itens.length === 0 || itens.length > 50 || !cliente) {
      return res.status(400).json({ erro: 'Dados do pedido incompletos.' });
    }

    if (CAMPOS_CLIENTE.some((campo) => !limpar(cliente[campo]))) {
      return res.status(400).json({ erro: 'Preencha todos os dados de entrega.' });
    }

    const ids = [...new Set(itens.map(({ produtoId }) => String(produtoId)))];

    const { data: produtos, error } = await supabase
      .from('produtos')
      .select('id, nome, preco, preco_promocional, estoque')
      .in('id', ids);

    if (error) throw error;

    let total = 0;
    const itensValidados = [];

    for (const { produtoId, quantidade } of itens) {
      const produto = produtos.find((p) => p.id === String(produtoId));
      const qtd = Number(quantidade);

      if (!produto || !Number.isInteger(qtd) || qtd < 1 || qtd > produto.estoque) {
        return res.status(400).json({ erro: 'Item inválido ou sem estoque.' });
      }

      const preco = Number(produto.preco_promocional ?? produto.preco);
      total += preco * qtd;
      itensValidados.push({ id: produto.id, title: produto.nome, quantity: qtd, unit_price: preco });
    }

    total = Math.round(total * 100) / 100;

    const valorFront = Number(formData.transaction_amount);
    if (!(Math.abs(valorFront - total) <= 0.01)) {
      return res.status(409).json({ erro: 'O valor do pedido mudou. Atualize a página.' });
    }

    const pedidoId = randomUUID();
    const chave =
      typeof idempotencyKey === 'string' && /^[\w-]{16,64}$/.test(idempotencyKey)
        ? idempotencyKey
        : undefined;
    const dadosCliente = Object.fromEntries(
      [...CAMPOS_CLIENTE, 'complemento'].map((campo) => [campo, limpar(cliente[campo])])
    );

    const payment = new Payment(mercadoPagoClient);

    const resultado = await payment.create({
      body: {
        transaction_amount: total,
        token: formData.token,
        description: 'Compra na loja',
        installments: formData.installments,
        payment_method_id: formData.payment_method_id,
        issuer_id: formData.issuer_id,
        payer: {
          email: formData.payer?.email,
          identification: formData.payer?.identification,
        },
        external_reference: pedidoId,
        additional_info: { items: itensValidados },
        metadata: {
          pedido_id: pedidoId,
          cliente: dadosCliente,
          itens: itensValidados.map(({ id, quantity }) => ({ id, quantity })),
        },
      },
      requestOptions: chave ? { idempotencyKey: chave } : undefined,
    });

    res.json({
      status: resultado.status,
      statusDetail: resultado.status_detail,
      paymentId: resultado.id,
      pedidoId: resultado.external_reference ?? pedidoId,
      pontoInteracao: resultado.point_of_interaction ?? null,
    });
  } catch (erro) {
    console.error('Erro ao processar pagamento:', erro.message, erro.status ?? '');
    res.status(500).json({ erro: 'Não foi possível processar o pagamento.' });
  }
});

export default router;