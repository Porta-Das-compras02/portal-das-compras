import axios from 'axios';

const asaasApi = axios.create({
  baseURL: process.env.VITE_ASAAS_API_URL || 'https://api.asaas.com/v3',
  headers: {
    'access_token': process.env.ASAAS_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface AsaasCustomer {
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  postalCode?: string;
}

export interface AsaasPaymentRequest {
  customer: AsaasCustomer;
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX' | 'DEBIT_ACCOUNT';
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
  notificationUrl?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone: string;
    address: string;
    addressNumber: string;
    complement?: string;
    province: string;
    city: string;
    postalCode: string;
  };
}

/**
 * Criar pagamento no Asaas
 */
export async function createAsaasPayment(data: AsaasPaymentRequest) {
  try {
    const response = await asaasApi.post('/payments', data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar pagamento Asaas:', error.response?.data);
    const errorMessage = error.response?.data?.errors?.[0]?.detail || 
                        error.response?.data?.message ||
                        'Erro ao criar pagamento';
    throw new Error(errorMessage);
  }
}

/**
 * Obter detalhes de um pagamento
 */
export async function getAsaasPayment(paymentId: string) {
  try {
    const response = await asaasApi.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao obter pagamento:', error.response?.data);
    throw new Error('Erro ao obter pagamento');
  }
}

/**
 * Processar webhook do Asaas
 */
export async function processAsaasWebhook(payload: any) {
  const { id, status, externalReference } = payload;

  // Status: PENDING, CONFIRMED, RECEIVED, OVERDUE, REFUNDED, DELETED, DECLINED
  const statusMap: Record<string, string> = {
    'PENDING': 'pendente',
    'CONFIRMED': 'confirmado',
    'RECEIVED': 'recebido',
    'OVERDUE': 'vencido',
    'REFUNDED': 'reembolsado',
    'DECLINED': 'recusado',
    'DELETED': 'deletado',
  };

  return {
    paymentId: id,
    orderId: externalReference,
    status: statusMap[status] || status,
    processedAt: new Date(),
  };
}

/**
 * Criar pagamento com PIX
 */
export async function createAsaasPixPayment(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
}) {
  const payment = await createAsaasPayment({
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone.replace(/\D/g, ''),
    },
    billingType: 'PIX',
    value: order.totalPrice,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: `Pedido #${order.id}`,
    externalReference: order.id,
    notificationUrl: `${process.env.VITE_APP_URL}/api/webhooks/asaas`,
  });

  return payment;
}

/**
 * Criar pagamento com Boleto
 */
export async function createAsaasBoletoPayment(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
}) {
  const payment = await createAsaasPayment({
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone.replace(/\D/g, ''),
    },
    billingType: 'BOLETO',
    value: order.totalPrice,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
    description: `Pedido #${order.id}`,
    externalReference: order.id,
    notificationUrl: `${process.env.VITE_APP_URL}/api/webhooks/asaas`,
  });

  return payment;
}

/**
 * Criar pagamento com Cartão de Crédito
 */
export async function createAsaasCardPayment(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  cardData: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
  address: string;
  cep: string;
}) {
  const payment = await createAsaasPayment({
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone.replace(/\D/g, ''),
    },
    billingType: 'CREDIT_CARD',
    value: order.totalPrice,
    dueDate: new Date().toISOString().split('T')[0],
    description: `Pedido #${order.id}`,
    externalReference: order.id,
    creditCard: {
      holderName: order.cardData.holderName,
      number: order.cardData.number.replace(/\s/g, ''),
      expiryMonth: order.cardData.expiryMonth,
      expiryYear: order.cardData.expiryYear,
      ccv: order.cardData.cvv,
    },
    creditCardHolderInfo: {
      name: order.customerName,
      email: order.customerEmail,
      cpfCnpj: '00000000000', // Você pode solicitar CPF do cliente
      phone: order.customerPhone.replace(/\D/g, ''),
      address: order.address.split(',')[0] || 'Rua',
      addressNumber: order.address.split(',')[1]?.trim() || '0',
      province: 'SP', // Você pode extrair do CEP
      city: 'São Paulo', // Você pode extrair do CEP
      postalCode: order.cep.replace('-', ''),
    },
    notificationUrl: `${process.env.VITE_APP_URL}/api/webhooks/asaas`,
  });

  return payment;
}
