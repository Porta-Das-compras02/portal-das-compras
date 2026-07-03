import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function Confirmation() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const orderNumber = params.get('pedido') || 'XXXXX';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-green-500" />
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Pedido Confirmado!
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Obrigado por sua compra. Seu pedido foi recebido com sucesso.
              </p>
            </div>

            {/* Order Details */}
            <Card className="border-2 border-dashed border-green-500 p-8 mb-8">
              <div className="text-center mb-8 pb-8 border-b border-gray-200">
                <p className="text-gray-600 mb-2">Número do Pedido</p>
                <p className="text-4xl font-bold text-green-600">
                  #{orderNumber}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">
                    Pedido Recebido
                  </span>
                </div>

                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Próximo Passo:</span>
                  <span className="font-semibold text-gray-900">
                    Preparação da Entrega
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo Estimado:</span>
                  <span className="font-semibold text-gray-900">
                    5-7 dias úteis
                  </span>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="border-2 border-dashed border-green-500 p-8 mb-8 bg-green-50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Próximos Passos
              </h2>

              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <span>Você receberá um SMS de confirmação no WhatsApp</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <span>Seu pedido será preparado para envio</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <span>Você receberá o código de rastreamento</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <span>Seu produto será entregue no endereço informado</span>
                </li>
              </ol>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg"
              >
                Continuar Comprando
              </Button>

              <Button
                variant="outline"
                onClick={() => window.print()}
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg"
              >
                Imprimir Pedido
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">
                Dúvidas sobre seu pedido?
              </p>
              <p className="text-gray-900 font-semibold">
                Entre em contato conosco pelo WhatsApp
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
