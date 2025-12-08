'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { useVerifyEmail } from '@/lib/hooks/useVerifyEmail';
import { Shield, Check } from 'lucide-react';

/**
 * Componente interno que usa useSearchParams
 */
function VerifyEmailContent(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = searchParams.get('token');

  // Limpiar el token (a veces viene con la URL completa)
  const token = rawToken?.split('/verify-email')[0]?.trim();

  const [email, setEmail] = useState('');

  const {
    verifyEmailMutation,
    resendEmail,
    isVerifying,
    isResending,
    verifyError,
  } = useVerifyEmail();

  /**
   * Verifica el email al cargar la página
   */
  // Estado local para prevenir verificaciones duplicadas
  const [hasStartedVerification, setHasStartedVerification] = useState(false);

  // Iniciar verificación inmediatamente si tenemos token
  useEffect(() => {
    if (!token || hasStartedVerification) {
      return;
    }

    setHasStartedVerification(true);
    verifyEmailMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Solo depender del token para la verificación inicial

  /**
   * Reenvía el email de verificación
   */
  const handleResendEmail = () => {
    if (!email) {
      toast.error('Por favor ingresa tu email para reenviar la verificación');
      return;
    }
    resendEmail(email);
  };
  // Renderizar el estado apropiado
  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-lg">
        {isVerifying ? (
          // Estado: Verificando
          <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20 text-center">
            <div className="mb-6 md:mb-8">
              {/* Spinner animado */}
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Verificando email...
            </h1>
            <p className="font-poppins text-sm md:text-base text-neutral-400">
              Por favor espera mientras verificamos tu cuenta
            </p>
          </div>
        ) : verifyError ? (
          // Estado: Error
          <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20 text-center">
            {/* Ícono circular dorado con exclamación */}
            <div className="mb-6 md:mb-8">
              <div className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative" style={{ backgroundColor: '#B8941F' }}>
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4AF37' }}>
                  <span className="text-white text-4xl md:text-5xl font-bold">!</span>
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              ¡Error de Verificación!
            </h1>

            {/* Mensaje de error */}
            <p className="font-poppins text-sm md:text-base text-neutral-400 leading-relaxed max-w-md mx-auto mb-6 md:mb-8">
              Hubo un problema al verificar tu email. Es posible que el enlace haya caducado o sea incorrecto.
            </p>

            {/* Campo de email */}
            <div className="mb-6 md:mb-8">
              <input
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-primary-800 border border-primary-700 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Correo electrónico"
              />
            </div>

            {/* Botones */}
            <div className="space-y-3 md:space-y-4">
              {/* Botón Primario: Reenviar Email */}
              <Button
                variant="gold"
                size="md"
                onClick={handleResendEmail}
                disabled={isResending || !email}
                className="w-full font-bold"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#1A1A1A',
                  borderColor: '#B8941F',
                }}
              >
                {isResending ? 'Reenviando...' : 'Reenviar Email de Verificación'}
              </Button>

              {/* Botón Secundario: Volver a Login */}
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/login')}
                className="w-full bg-primary-800 hover:bg-primary-700 text-white border-2 border-white/10 hover:border-white/20"
              >
                Volver a Iniciar Sesión
              </Button>
            </div>
          </div>
        ) : (
          // Estado: Éxito
          <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20 text-center">
            {/* Ícono circular dorado con escudo y checkmark */}
            <div className="mb-6 md:mb-8">
              <div
                className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: '#D4AF37' }}
              >
                <Shield className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} fill="#D4AF37" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              ¡Cuenta Activada!
            </h1>

            {/* Texto descriptivo */}
            <p className="font-poppins text-sm md:text-base text-neutral-400 leading-relaxed max-w-md mx-auto mb-8 md:mb-10">
              Tu cuenta ha sido verificada con éxito. Ya puedes acceder a todas
              nuestras funciones.
            </p>

            {/* Botón */}
            <div className="space-y-3">
              <Button
                variant="gold"
                size="md"
                onClick={() => router.push('/login')}
                className="w-full font-bold"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#1A1A1A',
                  borderColor: '#B8941F',
                }}
              >
                Ir a Iniciar Sesión
              </Button>
            </div>
          </div>
        )}

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
 * Página de verificación de email
 * Captura el token del URL y verifica la cuenta del usuario
 */
export default function VerifyEmailPage(): React.ReactNode {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
