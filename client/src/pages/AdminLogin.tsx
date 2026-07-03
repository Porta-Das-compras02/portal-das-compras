import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Credenciais corretas
    const ADMIN_USERNAME = 'claysson';
    const ADMIN_PASSWORD = '1508';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Armazenar token de autenticação
      localStorage.setItem('adminToken', 'authenticated');
      navigate('/admin');
    } else {
      setError('Usuário ou senha incorretos');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-green-500 p-8">
        <div className="text-center mb-8">
          <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            P
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Portal Admin</h1>
          <p className="text-gray-600 mt-2">Acesso Restrito</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label className="text-gray-700 font-semibold mb-2 block">
              Usuário
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="claysson"
              className="border-2 border-green-500 p-3"
              disabled={loading}
            />
          </div>

          <div>
            <Label className="text-gray-700 font-semibold mb-2 block">
              Senha
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="border-2 border-green-500 p-3"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Credenciais de teste:<br />
            <span className="font-semibold">claysson</span> / <span className="font-semibold">1508</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
