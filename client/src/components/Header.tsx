import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/categorias', label: 'Categorias' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-dashed border-green-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">
                P
              </div>
              <span>Portal das Compras</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`font-medium transition ${
                    location === item.href
                      ? 'text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Cart Button */}
          <Link href="/carrinho">
            <a className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-green-50"
              >
                <ShoppingCart className="w-6 h-6 text-gray-900" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </a>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`block py-2 font-medium transition ${
                    location === item.href
                      ? 'text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
