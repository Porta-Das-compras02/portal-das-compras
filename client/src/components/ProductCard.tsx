import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div className="border-2 border-dashed border-green-500 rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-green-600 font-semibold">
            Economize R$ {product.discount.toFixed(2)}
          </p>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
