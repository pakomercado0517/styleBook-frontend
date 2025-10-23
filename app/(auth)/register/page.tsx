'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/lib/types/auth';

export default function RegisterPage(): React.ReactNode {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Actualiza un campo del formulario
   */
  const handleChange = (field: string, value: string | UserRole): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  /**
   * Maneja el envío del formulario de registro
   * Valida datos, crea cuenta y redirige según el rol
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validación: contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación: longitud mínima
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Validación: mayúscula, minúscula y número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener mayúscula, minúscula y número');
      return;
    }

    setIsLoading(true);

    // Preparar datos para enviar (sin confirmPassword)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = formData;

    // Llamar a la API de registro
    const result = await register(registerData);

    if (!result.success) {
      // Mostrar error si falla
      setError(result.error || 'Error al crear la cuenta');
      toast.error(result.error || 'Error al crear la cuenta');
      setIsLoading(false);
      return;
    }

    // Guardar usuario y token en el store
    setAuth(result.data.user, result.data.token);

    // Mostrar éxito
    toast.success('¡Cuenta creada exitosamente! Bienvenido a StyleBook');

    // Redirigir según el rol del usuario
    const redirectPath =
      result.data.user.role === 'client' ? '/client' : '/provider';
    router.push(redirectPath);
  };

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4 py-12">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Registro */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">
              ✨ Únete a StyleBook
            </Badge>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-2">
              Crear Cuenta
            </h1>
            <p className="font-poppins text-neutral-600">
              Completa tus datos para comenzar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Rol */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins font-medium text-primary-800">
                ¿Qué tipo de cuenta quieres?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('role', 'client')}
                  className={`p-3 rounded-xl border-2 transition-all font-poppins font-medium ${
                    formData.role === 'client'
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-accent-300'
                  }`}
                >
                  👤 Cliente
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('role', 'provider')}
                  className={`p-3 rounded-xl border-2 transition-all font-poppins font-medium ${
                    formData.role === 'provider'
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-accent-300'
                  }`}
                >
                  🏢 Proveedor
                </button>
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                placeholder="Juan"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Apellido"
                type="text"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-poppins">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-neutral-600 font-poppins">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
            >
              Inicia sesión aquí
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
