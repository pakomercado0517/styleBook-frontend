'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { resetPassword } from '@/lib/api/auth';

/**
 * Componente interno que usa useSearchParams
 */
function ResetPasswordContent(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Validar que haya token al cargar
  useEffect(() => {
    if (!token) {
      toast.error('Token de recuperación no encontrado en la URL');
      setError('Token de recuperación no válido o expirado');
    }
  }, [token]);

  /**
   * Valida la contraseña
   */
  const validatePassword = (): boolean => {
    // Limpiar errores previos
    setError('');

    // Validación: longitud mínima
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validación: mayúscula, minúscula y número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe contener mayúscula, minúscula y número');
      return false;
    }

    // Validación: contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!token) {
      toast.error('Token no válido');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    // Llamar a la API de reset password
    const result = await resetPassword({ token, password });

    if (!result.success) {
      // Mostrar error si falla
      setError(result.error || 'Error al restablecer la contraseña');
      toast.error(result.error || 'Error al restablecer la contraseña');
      setIsLoading(false);
      return;
    }

    // Éxito
    setIsSuccess(true);
    toast.success('¡Contraseña restablecida exitosamente!');

    // Redirigir a login después de 3 segundos
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
        {/* Efectos decorativos dorados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200 text-center">
            <Badge variant="secondary" className="mb-4 bg-red-100 text-red-700">
              ❌ Token Inválido
            </Badge>

            {/* Ícono de error */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-3">
              Enlace no válido
            </h1>
            <p className="font-poppins text-neutral-600 mb-6">
              El enlace de recuperación no es válido o ha expirado. Por favor,
              solicita uno nuevo.
            </p>

            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button variant="gold" size="lg" className="w-full">
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="md" className="w-full">
                  Volver al Login
                </Button>
              </Link>
            </div>
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

  // Estado de éxito
  if (isSuccess) {
    return (
      <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
        {/* Efectos decorativos dorados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200 text-center">
            <Badge variant="primary" className="mb-4">
              ✅ Contraseña Actualizada
            </Badge>

            {/* Ícono de éxito */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-3">
              ¡Contraseña Restablecida!
            </h1>
            <p className="font-poppins text-neutral-600 mb-6">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar
              sesión con tu nueva contraseña.
            </p>

            <div className="space-y-3">
              <p className="text-sm text-neutral-500 font-poppins">
                Redirigiendo al login en 3 segundos...
              </p>
              <Button
                variant="gold"
                size="lg"
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Ir a Iniciar Sesión
              </Button>
            </div>
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

  // Formulario de reset password
  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Reset Password */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">
              🔐 Nueva Contraseña
            </Badge>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-2">
              Restablecer Contraseña
            </h1>
            <p className="font-poppins text-neutral-600">
              Ingresa tu nueva contraseña segura
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nueva Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            {/* Requisitos de contraseña */}
            <div className="p-4 rounded-lg bg-accent-50 border border-accent-100">
              <p className="text-sm font-poppins font-medium text-primary-800 mb-2">
                Tu contraseña debe tener:
              </p>
              <ul className="text-sm text-neutral-700 font-poppins space-y-1">
                <li className="flex items-center gap-2">
                  <span
                    className={
                      password.length >= 8
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }
                  >
                    {password.length >= 8 ? '✓' : '○'}
                  </span>
                  Al menos 8 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[A-Z]/.test(password)
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }
                  >
                    {/[A-Z]/.test(password) ? '✓' : '○'}
                  </span>
                  Una letra mayúscula
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[a-z]/.test(password)
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }
                  >
                    {/[a-z]/.test(password) ? '✓' : '○'}
                  </span>
                  Una letra minúscula
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /\d/.test(password)
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }
                  >
                    {/\d/.test(password) ? '✓' : '○'}
                  </span>
                  Un número
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      password &&
                      confirmPassword &&
                      password === confirmPassword
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }
                  >
                    {password && confirmPassword && password === confirmPassword
                      ? '✓'
                      : '○'}
                  </span>
                  Las contraseñas coinciden
                </li>
              </ul>
            </div>

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
              disabled={isLoading || !password || !confirmPassword}
              className="w-full"
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-neutral-600 font-poppins">
            ¿Recordaste tu contraseña?{' '}
            <Link
              href="/login"
              className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
            >
              Inicia sesión
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

/**
 * Página de reseteo de contraseña
 * Captura el token del URL y permite al usuario establecer una nueva contraseña
 */
export default function ResetPasswordPage(): React.ReactNode {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
          <div className="text-white text-center">
            <div className="mx-auto w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-poppins">Cargando...</p>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
