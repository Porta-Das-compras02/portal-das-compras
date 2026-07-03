import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleViewDetails = () => {
    navigate(`/produto?id=${product.id}`);
  };

  return (
    <div className="border-2 border-green-500 rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gray-100 h-48 cursor-pointer group"
        onClick={handleViewDetails}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
          <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3
          className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 h-10 cursor-pointer hover:text-green-600 transition"
          onClick={handleViewDetails}
        >
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

        {/* Video UGC */}
        <div className="mb-3 rounded-lg overflow-hidden bg-black">
          <video
            controls
            className="w-full h-24 object-cover"
            poster="https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400"
          >
            <source src="/ugc-video.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo HTML5.
          </video>
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

        {/* View Details Link */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-2 text-green-600 hover:text-green-700 font-semibold py-2 rounded transition border border-green-500 hover:bg-green-50"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
