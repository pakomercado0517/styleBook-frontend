'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';

export default function LoginPage(): React.ReactNode {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Login:', { email, password });

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">
              ✨ Bienvenido
            </Badge>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-2">
              Inicia Sesión
            </h1>
            <p className="font-poppins text-neutral-600">
              Accede a tu cuenta de StyleBook
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-accent-600 hover:text-accent-700 font-poppins font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-neutral-500 font-poppins">
                o continúa con
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="md" className="w-full">
              Google
            </Button>
            <Button variant="outline" size="md" className="w-full">
              Facebook
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-neutral-600 font-poppins">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Link a home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-accent-400 font-poppins font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
