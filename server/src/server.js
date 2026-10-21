import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pagamentosRoutes from './routes/pagamentos.routes.js';
 
const app = express();
 
app.use(express.json());
 
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
 
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});
 
app.use('/api/pagamentos', pagamentosRoutes);
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});