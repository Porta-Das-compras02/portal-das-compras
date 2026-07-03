# ⚙️ Configuração da Chave de API do Asaas

## 🔑 Sua Chave de API

Sua chave de API do Asaas foi fornecida. Agora você precisa configurá-la no seu ambiente.

---

## 📝 Passo 1: Configurar em Desenvolvimento Local

### Opção A: Arquivo `.env.local` (Recomendado para desenvolvimento)

1. Na raiz do projeto, crie um arquivo chamado `.env.local`:

```bash
touch .env.local
```

2. Adicione as seguintes linhas (substitua `SUA_CHAVE_ASAAS` pela sua chave real):

```env
# Asaas Configuration
ASAAS_API_KEY=SUA_CHAVE_ASAAS
VITE_ASAAS_API_URL=https://api.asaas.com/v3
VITE_APP_URL=http://localhost:3000
NODE_ENV=development
```

3. **IMPORTANTE**: Adicione `.env.local` ao `.gitignore` para não expor a chave:

```bash
echo ".env.local" >> .gitignore
```

4. Reinicie o servidor:

```bash
npm run dev
```

---

## 🚀 Passo 2: Configurar em Produção

### Opção A: Variáveis de Ambiente do Sistema

Se você está usando um serviço de hosting (Vercel, Netlify, Railway, etc.):

1. Vá para o painel de configuração do seu hosting
2. Procure por "Environment Variables" ou "Variáveis de Ambiente"
3. Adicione as seguintes variáveis:

```
ASAAS_API_KEY = SUA_CHAVE_ASAAS
VITE_ASAAS_API_URL = https://api.asaas.com/v3
VITE_APP_URL = https://seu-dominio.com
NODE_ENV = production
```

4. Faça deploy novamente

### Opção B: Docker

Se você está usando Docker:

```dockerfile
ENV ASAAS_API_KEY=SUA_CHAVE_ASAAS
ENV VITE_ASAAS_API_URL=https://api.asaas.com/v3
ENV VITE_APP_URL=https://seu-dominio.com
ENV NODE_ENV=production
```

### Opção C: Manus Hosting

Se você está usando o Manus para hospedar:

1. Vá para **Settings** → **Secrets**
2. Clique em **"Add Secret"**
3. Adicione:
   - **Name**: `ASAAS_API_KEY`
   - **Value**: `SUA_CHAVE_ASAAS`

4. Clique em **"Save"**
5. Faça deploy

---

## ✅ Verificar Configuração

### 1. Testar em Desenvolvimento

```bash
# Inicie o servidor
npm run dev

# Vá para http://localhost:3000
# Adicione um produto ao carrinho
# Clique em "Ir para Checkout"
# Preencha os dados
# Escolha PIX como forma de pagamento
# Clique em "Confirmar Pagamento"

# Você deve ver um QR Code e um código PIX
```

### 2. Verificar Logs

Se houver erro, verifique os logs:

```bash
# Terminal do servidor
npm run dev

# Procure por mensagens de erro sobre Asaas
```

### 3. Testar com cURL

```bash
curl -X POST http://localhost:3000/api/payments/asaas/pix \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-123",
    "customerName": "Teste",
    "customerEmail": "teste@email.com",
    "customerPhone": "11999999999",
    "totalPrice": 100
  }'
```

Você deve receber uma resposta com o QR Code do PIX.

---

## 🔐 Segurança

### ✅ Faça:

- ✓ Guarde sua chave de API em segurança
- ✓ Nunca commite `.env` ou `.env.local` no Git
- ✓ Use HTTPS em produção
- ✓ Rotacione sua chave periodicamente

### ❌ Nunca Faça:

- ✗ Exponha sua chave no código
- ✗ Envie a chave para o GitHub
- ✗ Compartilhe a chave com outras pessoas
- ✗ Use a chave em aplicações não confiáveis

---

## 📊 Estrutura de Diretórios

```
portal-das-compras-clone/
├── .env.local              ← Sua chave (NÃO commitar!)
├── .gitignore              ← Deve incluir .env.local
├── server/
│   ├── services/
│   │   └── asaas.ts        ← Usa ASAAS_API_KEY
│   ├── routes/
│   │   └── payments.ts     ← Endpoints de pagamento
│   └── index.ts            ← Servidor
├── client/
│   └── src/
│       └── pages/
│           └── CheckoutAsaas.tsx ← Página de checkout
└── package.json
```

---

## 🧪 Testar Pagamentos

### PIX (Recomendado para teste)

1. Vá para http://localhost:3000
2. Adicione produtos
3. Clique em "Ir para Checkout"
4. Preencha os dados
5. Escolha **PIX**
6. Você verá um QR Code
7. **Não é necessário pagar em teste**

### Cartão de Crédito

Use cartões de teste fornecidos pelo Asaas:

```
Número: 4111111111111111
Validade: 12/25
CVV: 123
```

### Boleto

1. Escolha **Boleto Bancário**
2. Um código de barras será gerado
3. Você pode visualizar o boleto

---

## 🔔 Configurar Webhooks

Para receber notificações quando um pagamento for confirmado:

1. Vá para o dashboard do Asaas: https://app.asaas.com
2. Clique em **Configurações** → **Webhooks**
3. Clique em **"Adicionar Webhook"**
4. Preencha:
   - **URL**: `https://seu-dominio.com/api/webhooks/asaas`
   - **Eventos**: Selecione:
     - `payment.confirmed`
     - `payment.received`
     - `payment.declined`
5. Clique em **"Salvar"**

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se a chave está correta
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique os logs do servidor
4. Consulte a documentação do Asaas: https://docs.asaas.com

---

## ✨ Pronto!

Seu Portal das Compras agora está configurado para receber pagamentos reais via Asaas! 🎉

**Próximos passos:**
1. ✅ Configurar a chave de API
2. ✅ Testar em desenvolvimento
3. ✅ Configurar webhooks
4. ✅ Fazer deploy em produção
5. ✅ Monitorar transações

Boa sorte! 🚀
