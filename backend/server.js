// server.js (com a correção de CORS)

require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors'); // <-- 1. IMPORTAR O PACOTE CORS

const app = express();

// --- CONFIGURAÇÃO DOS MIDDLEWARES ---
app.use(cors()); // <-- 2. USAR O MIDDLEWARE CORS AQUI
app.use(express.json());

// Configura a chave de API do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- DEFINIÇÃO DAS ROTAS ---
// Endpoint para ser chamado pelo seu app React Native
app.post('/api/enviar-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Campos "to", "subject" e "html" são obrigatórios.' });
  }

  const msg = {
    to: to,
    from: process.env.SENDER_EMAIL_VERIFICADO,
    subject: subject,
    html: html,
  };

  console.log(msg)

  try {
    await sgMail.send(msg);
    console.log(`E-mail enviado para ${to}`);
    res.status(200).json({ success: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ error: 'Falha ao enviar o e-mail.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});