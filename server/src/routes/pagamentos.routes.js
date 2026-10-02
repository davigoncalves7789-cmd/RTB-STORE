import { Router } from 'express';
import { Preference } from 'mercadopago';
import { mercadoPagoClient } from '../config/mercadoPago.js';

const router = Router();

router.post('/criar-preferencia', async (req, res) => {
  try {
    const { itens } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Carrinho vazio ou inválido.' });
    }

    const preference = new Preference(mercadoPagoClient);

    const resultado = await preference.create({
      body: {
        items: itens.map((item) => ({
          title: item.nome,
          quantity: item.quantidade,
          unit_price: Number(item.preco),
          currency_id: 'BRL',
        })),
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/sucesso`,
          failure: `${process.env.FRONTEND_URL}/checkout/erro`,
          pending: `${process.env.FRONTEND_URL}/checkout/pendente`,
        },
        auto_return: 'approved',
      },
    });

    res.json({ checkoutUrl: resultado.init_point });
  } catch (erro) {
    console.error('Erro ao criar preferência de pagamento:', erro);
    res.status(500).json({ erro: 'Não foi possível iniciar o pagamento.' });
  }
});

export default router;
