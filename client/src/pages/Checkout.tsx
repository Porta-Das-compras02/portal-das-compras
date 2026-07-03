import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    cep: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
            <p className="text-gray-600 mb-8">
              Adicione produtos antes de fazer o checkout.
            </p>
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(formData.cep)) {
      newErrors.cep = 'CEP inválido (use formato 12345-678)';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.whatsapp.replace(/\D/g, ''))) {
      newErrors.whatsapp = 'WhatsApp inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === 'info' ? (
                <Card className="border-2 border-dashed border-green-500 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informações de Entrega
                  </h2>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-gray-700 font-semibold mb-2 block">
                        Nome Completo *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="João Silva"
                        className={`border-2 ${
                          errors.fullName ? 'border-red-500' : 'border-green-500'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address" className="text-gray-700 font-semibold mb-2 block">
                        Endereço *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Rua das Flores, 123, Apto 45"
                        className={`border-2 ${
                          errors.address ? 'border-red-500' : 'border-green-500'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* CEP */}
                    <div>
                      <Label htmlFor="cep" className="text-gray-700 font-semibold mb-2 block">
                        CEP *
                      </Label>
                      <Input
                        id="cep"
                        name="cep"
                        type="text"
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder="12345-678"
                        className={`border-2 ${
                          errors.cep ? 'border-red-500' : 'border-green-500'
                        }`}
                      />
                      {errors.cep && (
                        <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <Label htmlFor="whatsapp" className="text-gray-700 font-semibold mb-2 block">
                        WhatsApp *
                      </Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="11999999999"
                        className={`border-2 ${
                          errors.whatsapp ? 'border-red-500' : 'border-green-500'
                        }`}
                      />
                      {errors.whatsapp && (
                        <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                      )}
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
                <PaymentStep
                  formData={formData}
                  onBack={() => setStep('info')}
                  totalPrice={totalPrice}
                  clearCart={clearCart}
                  navigate={navigate}
                />
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-dashed border-green-500 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name.substring(0, 20)}... x{item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete:</span>
                    <span>Grátis</span>
                  </div>
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

interface PaymentStepProps {
  formData: {
    fullName: string;
    address: string;
    cep: string;
    whatsapp: string;
  };
  onBack: () => void;
  totalPrice: number;
  clearCart: () => void;
  navigate: (path: string) => void;
}

function PaymentStep({
  formData,
  onBack,
  totalPrice,
  clearCart,
  navigate,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
  };

  const handlePayment = () => {
    const orderNumber = generateOrderNumber();
    clearCart();
    navigate(`/confirmacao?pedido=${orderNumber}`);
  };

  return (
    <Card className="border-2 border-dashed border-green-500 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha a Forma de Pagamento</h2>

      <div className="space-y-4 mb-6">
        {/* PIX Option */}
        <label className="border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="pix"
              checked={paymentMethod === 'pix'}
              onChange={(e) => setPaymentMethod(e.target.value as 'pix' | 'card')}
              className="w-4 h-4 accent-green-500"
            />
            <span className="font-semibold text-gray-900">PIX</span>
          </div>
        </label>

        {/* Card Option */}
        <label className="border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'pix' | 'card')}
              className="w-4 h-4 accent-green-500"
            />
            <span className="font-semibold text-gray-900">Cartão de Crédito</span>
          </div>
        </label>
      </div>

      {/* PIX Payment */}
      {paymentMethod === 'pix' && (
        <PixPayment totalPrice={totalPrice} onConfirm={handlePayment} />
      )}

      {/* Card Payment */}
      {paymentMethod === 'card' && (
        <CardPayment
          cardData={cardData}
          setCardData={setCardData}
          onConfirm={handlePayment}
        />
      )}

      <Button
        variant="outline"
        onClick={onBack}
        className="w-full border-green-500 text-green-600 hover:bg-green-50 mt-4"
      >
        Voltar
      </Button>
    </Card>
  );
}

interface PixPaymentProps {
  totalPrice: number;
  onConfirm: () => void;
}

function PixPayment({ totalPrice, onConfirm }: PixPaymentProps) {
  const pixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(7)}52040000530398654${totalPrice.toFixed(2).replace('.', '')}5303986`;

  return (
    <div className="space-y-6 mb-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">QR Code PIX</h3>
        <div className="bg-white p-4 rounded border-2 border-dashed border-green-500 flex items-center justify-center h-48">
          <div className="text-center">
            <div className="text-6xl mb-2">📱</div>
            <p className="text-sm text-gray-600">QR Code PIX</p>
            <p className="text-xs text-gray-500 mt-2">Escaneie com seu app bancário</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Código PIX (Copia e Cola)</h3>
        <div className="bg-white border-2 border-dashed border-green-500 p-3 rounded font-mono text-xs break-all mb-3">
          {pixCode}
        </div>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(pixCode);
            alert('Código PIX copiado!');
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Copiar Código
        </Button>
      </div>

      <Button
        onClick={onConfirm}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
      >
        Confirmar Pagamento
      </Button>
    </div>
  );
}

interface CardPaymentProps {
  cardData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
  setCardData: (data: any) => void;
  onConfirm: () => void;
}

function CardPayment({ cardData, setCardData, onConfirm }: CardPaymentProps) {
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev: any) => ({ ...prev, [name]: value as any }));
  };

  return (
    <div className="space-y-4 mb-6">
      <div>
        <Label className="text-gray-700 font-semibold mb-2 block">
          Número do Cartão
        </Label>
        <Input
          name="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardData.cardNumber}
          onChange={handleCardChange}
          maxLength={19}
          className="border-2 border-green-500"
        />
      </div>

      <div>
        <Label className="text-gray-700 font-semibold mb-2 block">
          Nome do Titular
        </Label>
        <Input
          name="cardHolder"
          type="text"
          placeholder="João Silva"
          value={cardData.cardHolder}
          onChange={handleCardChange}
          className="border-2 border-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-700 font-semibold mb-2 block">
            Validade
          </Label>
          <Input
            name="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={cardData.expiryDate}
            onChange={handleCardChange}
            maxLength={5}
            className="border-2 border-green-500"
          />
        </div>

        <div>
          <Label className="text-gray-700 font-semibold mb-2 block">
            CVV
          </Label>
          <Input
            name="cvv"
            type="text"
            placeholder="123"
            value={cardData.cvv}
            onChange={handleCardChange}
            maxLength={3}
            className="border-2 border-green-500"
          />
        </div>
      </div>

      <Button
        onClick={onConfirm}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
      >
        Confirmar Pagamento
      </Button>
    </div>
  );
}
