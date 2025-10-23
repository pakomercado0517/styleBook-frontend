'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { verifyEmail, resendVerificationEmail } from '@/lib/api/auth';

/**
 * Componente interno que usa useSearchParams
 */
function VerifyEmailContent(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  /**
   * Verifica el email al cargar la página
   */
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado en la URL');
      return;
    }

    handleVerifyEmail(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Llama a la API para verificar el email
   */
  const handleVerifyEmail = async (
    verificationToken: string
  ): Promise<void> => {
    const result = await verifyEmail(verificationToken);

    if (!result.success) {
      setStatus('error');
      setMessage(result.error || 'Error al verificar email');
      toast.error(result.error || 'Error al verificar email');
      return;
    }

    // Éxito
    setStatus('success');
    setMessage('¡Email verificado exitosamente! Ya puedes iniciar sesión');
    toast.success('¡Email verificado exitosamente!');

    // Redirigir a login después de 3 segundos
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

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
    setMessage(
      'Email de verificación reenviado. Revisa tu bandeja de entrada y haz clic en el nuevo enlace'
    );
    setIsResending(false);
  };

  // Estado: Verificando
  if (status === 'loading') {
    return (
      <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
        {/* Efectos decorativos dorados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200 text-center">
            <div className="mb-6">
              {/* Spinner animado */}
              <div className="mx-auto w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-2">
              Verificando email...
            </h1>
            <p className="font-poppins text-neutral-600">
              Por favor espera mientras verificamos tu cuenta
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Estado: Éxito
  if (status === 'success') {
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
              ✅ Verificación Exitosa
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
              ¡Email Verificado!
            </h1>
            <p className="font-poppins text-neutral-600 mb-6">{message}</p>

            <div className="space-y-3">
              <p className="text-sm text-neutral-500 font-poppins">
                Redirigiendo a iniciar sesión en 3 segundos...
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

  // Estado: Error
  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-4 bg-red-100 text-red-700">
              ❌ Error de Verificación
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
              No se pudo verificar
            </h1>
            <p className="font-poppins text-neutral-600 mb-6">{message}</p>
          </div>

          {/* Formulario para reenviar email */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-accent-50 border border-accent-200">
              <p className="text-sm text-primary-800 font-poppins mb-3">
                Si el enlace expiró o no funciona, ingresa tu email para recibir
                un nuevo enlace de verificación:
              </p>

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-accent-500 focus:outline-none font-poppins text-primary-800"
                />
                <Button
                  variant="gold"
                  size="md"
                  onClick={handleResendEmail}
                  disabled={isResending || !email}
                  className="w-full"
                >
                  {isResending
                    ? 'Reenviando...'
                    : '📧 Reenviar Email de Verificación'}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Volver a Iniciar Sesión
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
