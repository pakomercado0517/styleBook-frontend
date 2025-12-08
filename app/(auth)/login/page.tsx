'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { login, resendVerificationEmail } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage(): React.ReactNode {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);

  /**
   * Maneja el envío del formulario de login
   * Valida credenciales y redirige según el rol del usuario
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setShowResendButton(false); // Ocultar botón de reenvío al intentar login

    // Llamar a la API de login
    const result = await login({ email, password });

    if (!result.success) {
      // Verificar si el error es por email no verificado
      const isEmailNotVerified =
        result.error?.includes('verifica tu email') ||
        result.error?.includes('verificar') ||
        result.error?.includes('verify');

      if (isEmailNotVerified) {
        // Mostrar error y botón para reenviar verificación
        toast.error(
          'Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada'
        );
        setShowResendButton(true);
      } else {
        // Otros errores
        toast.error(result.error || 'Error al iniciar sesión');
      }

      setIsLoading(false);
      return;
    }

    // Guardar usuario y tokens en el store
    setAuth(result.data.user, result.data.token, result.data.refreshToken);

    // Mostrar éxito
    toast.success('¡Bienvenido de vuelta!');

    // Redirigir según el rol del usuario
    const redirectPath =
      result.data.user.role === 'client' ? '/client' : '/provider';
    router.push(redirectPath);
  };

  /**
   * Reenvía el email de verificación
   */
  const handleResendVerification = async (): Promise<void> => {
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setIsResending(true);

    const result = await resendVerificationEmail({ email });

    if (!result.success) {
      toast.error(result.error || 'Error al reenviar email de verificación');
      setIsResending(false);
      return;
    }

    toast.success(
      'Email de verificación enviado. Revisa tu bandeja de entrada'
    );
    setShowResendButton(false);
    setIsResending(false);
  };

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4 py-12 md:py-16">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg">
        <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              Iniciar Sesión StyleBook
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Campo Correo o Teléfono */}
            <div>
              <label className="block text-sm md:text-base font-poppins font-medium text-white mb-2">
                Correo o Teléfono
              </label>
              <input
                type="text"
                placeholder="Tu correo o teléfono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 md:py-4 rounded-xl bg-primary-800 border border-primary-700 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Correo o teléfono"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm md:text-base font-poppins font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Escribe tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 md:py-4 pr-12 rounded-xl bg-primary-800 border border-primary-700 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                  aria-label="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-accent-400 transition-colors"
                  tabIndex={0}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Link Olvidaste tu contraseña */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm md:text-base text-[#D4AF37] hover:text-[#FFD700] font-poppins font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de reenviar verificación (solo si email no verificado) */}
            {showResendButton && (
              <div className="p-4 rounded-lg bg-accent-500/10 border border-accent-500/30">
                <p className="text-sm text-white font-poppins mb-3">
                  ⚠️ Tu email no está verificado. Revisa tu bandeja de entrada o
                  reenvía el email de verificación.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending
                    ? 'Reenviando...'
                    : '📧 Reenviar Email de Verificación'}
                </Button>
              </div>
            )}

            {/* Botón Iniciar Sesión */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6 md:mt-8 md:py-4 md:text-lg font-bold"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
                borderColor: '#B8941F',
              }}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-neutral-300 font-poppins">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-[#D4AF37] hover:text-[#FFD700] font-semibold transition-colors"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
