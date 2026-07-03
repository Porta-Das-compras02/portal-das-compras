import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, ShoppingCart, LogOut } from 'lucide-react';

export default function AdminPanel() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-green-500 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
              P
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Portal Admin</h1>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white flex gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card: Total de Vendas */}
          <Card className="border-2 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total de Vendas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">R$ 0,00</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </Card>

          {/* Card: Pedidos */}
          <Card className="border-2 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pedidos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          {/* Card: Clientes */}
          <Card className="border-2 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Clientes</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </Card>

          {/* Card: Produtos */}
          <Card className="border-2 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Produtos</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">33</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Seção de Gerenciamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gerenciar Produtos */}
          <Card className="border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Produtos</h2>
            <p className="text-gray-600 mb-6">
              Adicione, edite ou remova produtos do seu catálogo.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                Adicionar Produto
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">
                Ver Produtos
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2">
                Gerenciar Categorias
              </Button>
            </div>
          </Card>

          {/* Gerenciar Pedidos */}
          <Card className="border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Pedidos</h2>
            <p className="text-gray-600 mb-6">
              Acompanhe e gerencie todos os pedidos dos clientes.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                Ver Pedidos
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">
                Pedidos Pendentes
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2">
                Pedidos Entregues
              </Button>
            </div>
          </Card>

          {/* Gerenciar Clientes */}
          <Card className="border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Clientes</h2>
            <p className="text-gray-600 mb-6">
              Visualize e gerencie informações dos clientes.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                Ver Clientes
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">
                Clientes Ativos
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2">
                Exportar Dados
              </Button>
            </div>
          </Card>

          {/* Configurações */}
          <Card className="border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h2>
            <p className="text-gray-600 mb-6">
              Configure as opções gerais da sua loja.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                Configurações Gerais
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">
                Formas de Pagamento
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2">
                Relatórios
              </Button>
            </div>
          </Card>
        </div>

        {/* Informações de Status */}
        <Card className="border-2 border-green-500 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Servidor</p>
              <p className="text-lg font-bold text-green-600 mt-2">✓ Online</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Banco de Dados</p>
              <p className="text-lg font-bold text-green-600 mt-2">✓ Conectado</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Asaas</p>
              <p className="text-lg font-bold text-green-600 mt-2">✓ Ativo</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
