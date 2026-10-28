import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import pagamentosRoutes from './routes/pagamentos.routes.js';

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL não definido — o servidor não pode iniciar sem isso.');
}

const origensPermitidas = process.env.FRONTEND_URL.split(',').map((o) => o.trim());

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: origensPermitidas, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '20kb' }));

const opcoesLimite = { standardHeaders: 'draft-7', legacyHeaders: false };

app.use(
  '/api',
  rateLimit({ ...opcoesLimite, windowMs: 15 * 60 * 1000, limit: 300 })
);

app.use(
  '/api/pagamentos',
  rateLimit({
    ...opcoesLimite,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { erro: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' },
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/pagamentos', pagamentosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});