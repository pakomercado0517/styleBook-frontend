'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { resendVerificationEmail } from '@/lib/api/auth';
import { Mail, Check } from 'lucide-react';

/**
 * Componente interno que usa useSearchParams
 */
function VerifyEmailPendingContent(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Si viene del registro, mostrar el email en el campo
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  /**
   * Reenvía el email de verificación
   */
  const handleResendEmail = async (): Promise<void> => {
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setIsResending(true);

    const result = await resendVerificationEmail({ email });

    if (!result.success) {
      toast.error(result.error || 'Error al reenviar email');
      setIsResending(false);
      return;
    }

    toast.success('Email reenviado. Revisa tu bandeja de entrada');
    setIsResending(false);
  };

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4 py-12 md:py-16">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-lg">
        <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            {/* Título */}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
              ¡Casi Listo!
            </h1>

            {/* Ícono circular dorado con sobre y checkmark */}
            <div className="mb-6 md:mb-8">
              <div
                className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: '#D4AF37' }}
              >
                <Mail className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} />
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6">
              Verifica tu correo electrónico
            </h2>

            {/* Instrucciones */}
            <p className="font-poppins text-sm md:text-base text-neutral-400 leading-relaxed max-w-md mx-auto">
              Hemos enviado un correo de verificación a{' '}
              {email ? (
                <span className="text-[#D4AF37] font-semibold">{email}</span>
              ) : (
                'tu dirección'
              )}
              . Haz clic en el enlace para activar tu cuenta. Si no aparece en tu
              bandeja de entrada, revisa también en spam.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3 md:space-y-4">
            {/* Botón Primario: Ya verifiqué, Iniciar Sesión */}
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
              Ya verifiqué, Iniciar Sesión
            </Button>

            {/* Botón Secundario: Reenviar Email */}
            <Button
              variant="primary"
              size="md"
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="w-full bg-primary-800 hover:bg-primary-700 text-white border-2 border-primary-700 hover:border-primary-600"
            >
              {isResending ? 'Reenviando...' : 'Reenviar Email'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Página de verificación pendiente
 * Muestra instrucciones para verificar el email después del registro
 */
export default function VerifyEmailPendingPage(): React.ReactNode {
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
      <VerifyEmailPendingContent />
    </Suspense>
  );
}
