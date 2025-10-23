'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { forgotPassword } from '@/lib/api/auth';

type FormState = 'idle' | 'loading' | 'success';

export default function ForgotPasswordPage(): React.ReactNode {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');

  /**
   * Maneja el envío de solicitud de recuperación de contraseña
   * Envía email con enlace de recuperación
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormState('loading');

    // Llamar a la API de forgot password
    const result = await forgotPassword({ email });

    if (!result.success) {
      // Mostrar error si falla
      toast.error(result.error || 'Error al enviar el email');
      setFormState('idle');
      return;
    }

    // Mostrar éxito
    toast.success('Email enviado! Revisa tu bandeja de entrada');
    setFormState('success');
  };

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Recuperación */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-accent-500/10 p-8 md:p-10 border border-neutral-200">
          {formState !== 'success' ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <Badge variant="primary" className="mb-4">
                  🔑 Recuperación
                </Badge>
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-2">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="font-poppins text-neutral-600">
                  Ingresa tu email y te enviaremos un enlace para recuperarla
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
                  disabled={formState === 'loading'}
                />

                {/* Info adicional */}
                <div className="p-4 rounded-lg bg-accent-50 border border-accent-100">
                  <p className="text-sm text-neutral-700 font-poppins">
                    💡 Recibirás un email con las instrucciones para restablecer
                    tu contraseña. Revisa también tu carpeta de spam.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={formState === 'loading'}
                  className="w-full"
                >
                  {formState === 'loading'
                    ? 'Enviando...'
                    : 'Enviar Enlace de Recuperación'}
                </Button>
              </form>

              {/* Links */}
              <div className="mt-8 text-center space-y-3">
                <p className="text-sm text-neutral-600 font-poppins">
                  ¿Recordaste tu contraseña?{' '}
                  <Link
                    href="/login"
                    className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Estado de Éxito */}
              <div className="text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <span className="text-3xl">✅</span>
                </div>
                <h1 className="font-playfair text-3xl font-bold text-primary-800 mb-3">
                  ¡Email Enviado!
                </h1>
                <p className="font-poppins text-neutral-600 mb-6">
                  Hemos enviado un enlace de recuperación a{' '}
                  <span className="font-semibold text-primary-800">
                    {email}
                  </span>
                </p>

                <div className="p-4 rounded-lg bg-accent-50 border border-accent-100 mb-8">
                  <p className="text-sm text-neutral-700 font-poppins">
                    El enlace expirará en 1 hora. Si no recibes el email en los
                    próximos minutos, revisa tu carpeta de spam.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={() => setFormState('idle')}
                  >
                    Enviar Nuevamente
                  </Button>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full">
                      Volver al Login
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
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
