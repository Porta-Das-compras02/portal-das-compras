import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { products, categories } from '@/data/products';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeNew() {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Produtos mais vendidos (primeiros 8)
  const bestSellers = products.slice(0, 8);

  // Verificar scroll
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getCategoryLabel = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.label || id;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Achados que valem a pena, direto no seu endereço.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Eletrônicos, moda, casa, esportes e beleza — curadoria com preços honestos.
            </p>

            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-green-500 p-4 rounded-lg text-lg"
              />
            </div>
          </div>
        </section>

        {/* Primeiro Banner */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ofertas Imperdíveis
                  </h2>
                  <p className="text-lg text-blue-100 mb-6">
                    Descubra produtos incríveis com os melhores preços do mercado. Frete grátis em compras acima de R$ 100.
                  </p>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Ver Promoções
                  </button>
                </div>
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">Até 70%</div>
                  <p className="text-gray-600">de desconto em produtos selecionados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Mais Vendidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categorias em Loop Infinito */}
        <section className="py-12 bg-white overflow-hidden">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Categorias</h2>
          </div>

          <div className="relative">
            {/* Botões de navegação */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            )}

            {/* Container de categorias */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide px-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex gap-4 pb-4">
                {/* Categorias */}
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition ${
                      selectedCategory === category.id
                        ? 'bg-red-500 text-white'
                        : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Produtos por Categoria */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {getCategoryLabel(selectedCategory)}
            </h2>
            <div className="text-gray-600 mb-8">{filteredProducts.length} produtos</div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </section>

        {/* Segundo Banner */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-2">Frete Grátis</div>
                  <p className="text-gray-600">Em compras acima de R$ 100</p>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Compre Agora
                  </h2>
                  <p className="text-lg text-orange-100 mb-6">
                    Aproveite nossas promoções exclusivas e receba seus produtos com frete grátis.
                  </p>
                  <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
