import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Extrair ID do produto da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setProductId(id);
  }, []);

  const product = productId ? products.find(p => p.id === productId) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-6">Produto não encontrado</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Voltar para Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/carrinho');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          {/* Detalhes do Produto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Imagem */}
            <div>
              <Card className="border-2 border-green-500 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </div>

            {/* Informações */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Avaliação */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600">(128 avaliações)</span>
              </div>

              {/* Preço */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-lg text-green-600 font-semibold">
                  Economize R$ {product.discount.toFixed(2)}
                </p>
              </div>

              {/* Vídeo UGC */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Veja o Produto em Ação
                </h3>
                <Card className="border-2 border-green-500 overflow-hidden">
                  <video
                    controls
                    className="w-full h-64 bg-black"
                    poster="https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800"
                  >
                    <source src="/ugc-video.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                </Card>
              </div>

              {/* Descrição */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Descrição
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description ||
                    'Produto de alta qualidade com excelente custo-benefício. Perfeito para suas necessidades diárias.'}
                </p>
              </div>

              {/* Quantidade e Adicionar ao Carrinho */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border-2 border-green-500 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Informações Adicionais */}
              <Card className="border-2 border-green-500 p-6 bg-green-50">
                <h3 className="font-bold text-gray-900 mb-4">
                  ✓ Garantia e Segurança
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Frete grátis em compras acima de R$ 100</li>
                  <li>✓ Garantia de 30 dias ou seu dinheiro de volta</li>
                  <li>✓ Pagamento seguro com Asaas</li>
                  <li>✓ Suporte ao cliente 24/7</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Produtos Relacionados */}
          <div className="border-t-2 border-green-500 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(
                  p =>
                    p.category === product.category && p.id !== product.id
                )
                .slice(0, 4)
                .map(relatedProduct => (
                  <Card
                    key={relatedProduct.id}
                    className="border-2 border-green-500 overflow-hidden hover:shadow-lg transition cursor-pointer"
                    onClick={() =>
                      navigate(`/produto?id=${relatedProduct.id}`)
                    }
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-green-600">
                          R$ {relatedProduct.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          R$ {relatedProduct.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        Economize R$ {relatedProduct.discount.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
