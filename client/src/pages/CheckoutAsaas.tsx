import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Check } from 'lucide-react';
import { useState as useStateHook } from 'react';

export default function CheckoutAsaas() {
  const { items, totalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'card'>('pix');
  const [copied, setCopied] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    cep: '',
    whatsapp: '',
    email: '',
  });

  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
            <Button
              onClick={() => navigate('/')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Voltar para Compras
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    else if (!/^\d{5}-?\d{3}$/.test(formData.cep)) newErrors.cep = 'CEP inválido';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório';
    else if (!/^\d{10,11}$/.test(formData.whatsapp.replace(/\D/g, ''))) newErrors.whatsapp = 'WhatsApp inválido';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCardData = () => {
    const newErrors: Record<string, string> = {};

    if (!cardData.holderName.trim()) newErrors.holderName = 'Nome do titular é obrigatório';
    if (!cardData.number.trim()) newErrors.number = 'Número do cartão é obrigatório';
    else if (!/^\d{13,19}$/.test(cardData.number.replace(/\s/g, ''))) newErrors.number = 'Número do cartão inválido';
    if (!cardData.expiryMonth) newErrors.expiryMonth = 'Mês é obrigatório';
    if (!cardData.expiryYear) newErrors.expiryYear = 'Ano é obrigatório';
    if (!cardData.cvv.trim()) newErrors.cvv = 'CVV é obrigatório';
    else if (!/^\d{3,4}$/.test(cardData.cvv)) newErrors.cvv = 'CVV inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCardData()) return;

    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      const endpoint = `/api/payments/asaas/${paymentMethod}`;

      const payload: any = {
        orderId,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.whatsapp,
        totalPrice,
        address: formData.address,
        cep: formData.cep,
      };

      if (paymentMethod === 'card') {
        payload.cardData = cardData;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentData(data);
        clearCart();
      } else {
        alert('Erro ao processar pagamento: ' + data.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tela de confirmação de pagamento
  if (paymentData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-dashed border-green-500 p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Pagamento Iniciado!
                  </h1>
                  <p className="text-gray-600">
                    Siga as instruções abaixo para completar seu pagamento
                  </p>
                </div>

                {paymentMethod === 'pix' && paymentData.qrCode && (
                  <div className="space-y-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h2 className="font-semibold text-gray-900 mb-4">QR Code PIX</h2>
                      <div className="bg-white p-4 rounded border-2 border-dashed border-green-500 flex items-center justify-center h-48">
                        <div className="text-center">
                          <div className="text-6xl mb-2">📱</div>
                          <p className="text-sm text-gray-600">Escaneie com seu app bancário</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h2 className="font-semibold text-gray-900 mb-3">Código PIX (Copia e Cola)</h2>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={paymentData.pixKey || ''}
                          readOnly
                          className="flex-1 bg-white border-2 border-dashed border-green-500 p-3 rounded font-mono text-xs"
                        />
                        <Button
                          onClick={() => copyToClipboard(paymentData.pixKey || '')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'boleto' && paymentData.boletoCode && (
                  <div className="space-y-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h2 className="font-semibold text-gray-900 mb-3">Código de Barras</h2>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={paymentData.boletoCode || ''}
                          readOnly
                          className="flex-1 bg-white border-2 border-dashed border-green-500 p-3 rounded font-mono text-xs"
                        />
                        <Button
                          onClick={() => copyToClipboard(paymentData.boletoCode || '')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      {paymentData.boletoUrl && (
                        <a
                          href={paymentData.boletoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-4"
                        >
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                            Baixar Boleto
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
                    <h2 className="font-semibold text-gray-900 mb-2">✅ Cartão Processado</h2>
                    <p className="text-gray-600">
                      Seu pagamento foi enviado para processamento. Você receberá uma confirmação em breve.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>ID do Pagamento:</strong> {paymentData.paymentId}
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                      <strong>Status:</strong> {paymentData.status}
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
                  >
                    Voltar para Início
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              {step === 'info' ? (
                <Card className="border-2 border-dashed border-green-500 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informações de Entrega
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-semibold mb-2 block">
                        Nome Completo *
                      </Label>
                      <Input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="João Silva"
                        className={`border-2 ${errors.fullName ? 'border-red-500' : 'border-green-500'}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label className="text-gray-700 font-semibold mb-2 block">
                        Email *
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className={`border-2 ${errors.email ? 'border-red-500' : 'border-green-500'}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label className="text-gray-700 font-semibold mb-2 block">
                        Endereço *
                      </Label>
                      <Input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Rua das Flores, 123, Apto 45"
                        className={`border-2 ${errors.address ? 'border-red-500' : 'border-green-500'}`}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-semibold mb-2 block">
                          CEP *
                        </Label>
                        <Input
                          name="cep"
                          type="text"
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder="12345-678"
                          className={`border-2 ${errors.cep ? 'border-red-500' : 'border-green-500'}`}
                        />
                        {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-2 block">
                          WhatsApp *
                        </Label>
                        <Input
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="11999999999"
                          className={`border-2 ${errors.whatsapp ? 'border-red-500' : 'border-green-500'}`}
                        />
                        {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                      </div>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg mt-6"
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-green-500 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Escolha a Forma de Pagamento
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* PIX */}
                    <label className="border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="pix"
                          checked={paymentMethod === 'pix'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">PIX</span>
                          <p className="text-sm text-gray-600">Taxa: 0,99%</p>
                        </div>
                      </div>
                    </label>

                    {/* Boleto */}
                    <label className="border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="boleto"
                          checked={paymentMethod === 'boleto'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">Boleto Bancário</span>
                          <p className="text-sm text-gray-600">Taxa: 2,99%</p>
                        </div>
                      </div>
                    </label>

                    {/* Cartão */}
                    <label className="border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">Cartão de Crédito</span>
                          <p className="text-sm text-gray-600">Taxa: 2,99%</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Dados do Cartão */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Dados do Cartão</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-2 block">
                          Nome do Titular *
                        </Label>
                        <Input
                          name="holderName"
                          type="text"
                          value={cardData.holderName}
                          onChange={handleCardChange}
                          placeholder="João Silva"
                          className={`border-2 ${errors.holderName ? 'border-red-500' : 'border-green-500'}`}
                        />
                        {errors.holderName && <p className="text-red-500 text-sm mt-1">{errors.holderName}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-2 block">
                          Número do Cartão *
                        </Label>
                        <Input
                          name="number"
                          type="text"
                          value={cardData.number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`border-2 ${errors.number ? 'border-red-500' : 'border-green-500'}`}
                        />
                        {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-700 font-semibold mb-2 block">
                            Mês *
                          </Label>
                          <select
                            name="expiryMonth"
                            value={cardData.expiryMonth}
                            onChange={(e) => setCardData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                            className={`w-full border-2 p-2 rounded ${errors.expiryMonth ? 'border-red-500' : 'border-green-500'}`}
                          >
                            <option value="">Mês</option>
                            {[...Array(12)].map((_, i) => (
                              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                        </div>

                        <div>
                          <Label className="text-gray-700 font-semibold mb-2 block">
                            Ano *
                          </Label>
                          <select
                            name="expiryYear"
                            value={cardData.expiryYear}
                            onChange={(e) => setCardData(prev => ({ ...prev, expiryYear: e.target.value }))}
                            className={`w-full border-2 p-2 rounded ${errors.expiryYear ? 'border-red-500' : 'border-green-500'}`}
                          >
                            <option value="">Ano</option>
                            {[...Array(10)].map((_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <option key={year} value={String(year).slice(-2)}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                          {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                        </div>

                        <div>
                          <Label className="text-gray-700 font-semibold mb-2 block">
                            CVV *
                          </Label>
                          <Input
                            name="cvv"
                            type="text"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            maxLength={4}
                            className={`border-2 ${errors.cvv ? 'border-red-500' : 'border-green-500'}`}
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('info')}
                      variant="outline"
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    >
                      Voltar
                    </Button>

                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Confirmar Pagamento'
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-dashed border-green-500 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name.substring(0, 20)}... x{item.quantity}</span>
                      <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
