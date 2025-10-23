'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { resendVerificationEmail } from '@/lib/api/auth';

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
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">
              📧 Verifica tu Email
            </Badge>

            {/* Ícono de email */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-3">
              ¡Revisa tu email!
            </h1>
            <p className="font-poppins text-neutral-600 mb-6">
              Te hemos enviado un correo con un enlace de verificación. Haz clic
              en el enlace para activar tu cuenta.
            </p>

            {emailParam && (
              <div className="p-3 rounded-lg bg-accent-50 border border-accent-200 mb-6">
                <p className="text-sm font-poppins text-primary-800">
                  📬 Email enviado a:
                </p>
                <p className="font-poppins font-semibold text-accent-700 mt-1">
                  {emailParam}
                </p>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-poppins text-sm text-primary-800 font-medium">
                  Abre tu correo electrónico
                </p>
                <p className="font-poppins text-xs text-neutral-600">
                  Revisa tu bandeja de entrada (y spam)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-poppins text-sm text-primary-800 font-medium">
                  Busca el email de StyleBook
                </p>
                <p className="font-poppins text-xs text-neutral-600">
                  Asunto: &ldquo;Verifica tu cuenta de StyleBook&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-poppins text-sm text-primary-800 font-medium">
                  Haz clic en el enlace de verificación
                </p>
                <p className="font-poppins text-xs text-neutral-600">
                  Serás redirigido para completar la verificación
                </p>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-neutral-500 font-poppins">
                ¿No recibiste el email?
              </span>
            </div>
          </div>

          {/* Reenviar email */}
          <div className="space-y-4">
            <p className="text-sm text-center text-neutral-600 font-poppins">
              Ingresa tu email para recibir un nuevo enlace:
            </p>

            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-accent-500 focus:outline-none font-poppins text-primary-800"
            />

            <Button
              variant="gold"
              size="lg"
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="w-full"
            >
              {isResending
                ? 'Reenviando...'
                : '📧 Reenviar Email de Verificación'}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Ya verificado - Ir a Iniciar Sesión
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
