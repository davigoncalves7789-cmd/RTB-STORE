import { MercadoPagoConfig } from 'mercadopago';
import 'dotenv/config';

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error('MERCADO_PAGO_ACCESS_TOKEN não definido no .env — o servidor não pode iniciar sem isso.');
}

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});
