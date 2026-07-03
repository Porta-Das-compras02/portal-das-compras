import express, { Request, Response } from 'express';
import {
  createAsaasPixPayment,
  createAsaasBoletoPayment,
  createAsaasCardPayment,
  processAsaasWebhook,
} from '../services/asaas';

const router = express.Router();

/**
 * POST /api/payments/asaas/pix
 * Criar pagamento PIX
 */
router.post('/asaas/pix', async (req: Request, res: Response) => {
  try {
    const { orderId, customerName, customerEmail, customerPhone, totalPrice } = req.body;

    // Validar dados
    if (!orderId || !customerName || !customerEmail || !customerPhone || !totalPrice) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Criar pagamento PIX
    const payment = await createAsaasPixPayment({
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
    });

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      pixKey: payment.pixKey || null,
      qrCode: payment.qrCode || null,
      expirationDate: payment.expirationDate || null,
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/asaas/boleto
 * Criar pagamento Boleto
 */
router.post('/asaas/boleto', async (req: Request, res: Response) => {
  try {
    const { orderId, customerName, customerEmail, customerPhone, totalPrice } = req.body;

    if (!orderId || !customerName || !customerEmail || !customerPhone || !totalPrice) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const payment = await createAsaasBoletoPayment({
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
    });

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      boletoCode: payment.boletoCode || null,
      boletoUrl: payment.boletoUrl || null,
      dueDate: payment.dueDate || null,
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento Boleto:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/asaas/card
 * Criar pagamento com Cartão de Crédito
 */
router.post('/asaas/card', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
      cardData,
      address,
      cep,
    } = req.body;

    if (!orderId || !customerName || !customerEmail || !customerPhone || !totalPrice || !cardData) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Validar dados do cartão
    if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
      return res.status(400).json({ error: 'Dados do cartão incompletos' });
    }

    const payment = await createAsaasCardPayment({
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
      cardData,
      address,
      cep,
    });

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento Cartão:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/webhooks/asaas
 * Receber notificações do Asaas
 */
router.post('/webhooks/asaas', async (req: Request, res: Response) => {
  try {
    const webhook = await processAsaasWebhook(req.body);

    console.log('Webhook Asaas recebido:', webhook);

    // Aqui você atualiza o status do pedido no seu banco de dados
    // Exemplo: await updateOrderStatus(webhook.orderId, webhook.status);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
