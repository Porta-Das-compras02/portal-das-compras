import { useState, useMemo } from 'react';
import { products, categories, type Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b-2 border-dashed border-green-500 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Achados que valem a pena,<br />
                direto no seu endereço.
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Eletrônicos, moda, casa, esportes e beleza — curadoria com preços honestos.
              </p>

              {/* Search Bar */}
              <div className="border-2 border-dashed border-green-500 rounded-lg p-2 bg-white">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus:ring-0 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="border-b-2 border-dashed border-green-500 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
              {categories.map((cat, index) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    className={`rounded-full px-6 font-semibold transition ${
                      selectedCategory === cat.id
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'border-2 border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {cat.label}
                  </Button>
                  {index < categories.length - 1 && (
                    <span className="text-green-500 text-sm hidden md:inline">···</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {filteredProducts.length} produtos
            </h2>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum produto encontrado. Tente outra busca.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
