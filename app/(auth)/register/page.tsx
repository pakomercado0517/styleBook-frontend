'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs';
import { register } from '@/lib/api/auth';
import { createProvider } from '@/lib/api/providers';
import { useAuthStore } from '@/store/authStore';
import { ProviderBusinessStep } from './components/ProviderBusinessStep';
import type { UserRole } from '@/lib/types/auth';
import type { CreateProviderInput } from '@/lib/schemas/provider.schema';
import { cn } from '@/lib/utils/cn';

export default function RegisterPage(): React.ReactNode {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client' as UserRole,
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);

  /**
   * Actualiza un campo del formulario
   */
  const handleChange = (
    field: string,
    value: string | UserRole | boolean
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    // Si cambia el rol a client, volver al paso 1
    if (field === 'role' && value === 'client' && currentStep === 2) {
      setCurrentStep(1);
    }
  };

  /**
   * Valida los datos del paso 1
   */
  const validateStep1 = (): boolean => {
    // Validación: términos y condiciones
    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    // Validación: contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    // Validación: longitud mínima
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validación: mayúscula, minúscula y número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener mayúscula, minúscula y número');
      return false;
    }

    return true;
  };

  /**
   * Maneja el envío del paso 1 (datos personales)
   * Si es proveedor, avanza al paso 2
   * Si es cliente, registra directamente
   */
  const handleStep1Submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateStep1()) {
      return;
    }

    // Si es cliente, registrar directamente
    if (formData.role === 'client') {
      await handleClientRegister();
      return;
    }

    // Si es proveedor, avanzar al paso 2
    setCurrentStep(2);
  };

  /**
   * Registra un cliente (flujo simple, sin step form)
   */
  const handleClientRegister = async (): Promise<void> => {
    setIsLoading(true);

    const registerData = {
      name: formData.name.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'client' as UserRole,
      phone: formData.phone.trim() || undefined,
    };

    const result = await register(registerData);

    if (!result.success) {
      setError(result.error || 'Error al crear la cuenta');
      toast.error(result.error || 'Error al crear la cuenta');
      setIsLoading(false);
      return;
    }

    toast.success(
      '¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta'
    );

    router.push(
      `/verify-email-pending?email=${encodeURIComponent(formData.email)}`
    );
  };

  /**
   * Maneja el envío del paso 2 (datos del negocio para proveedores)
   * Registra el usuario y crea el perfil del negocio
   */
  const handleStep2Submit = async (
    businessData: CreateProviderInput
  ): Promise<void> => {
    setIsLoading(true);
    setError('');

    // Si no tenemos token del paso 1, registrar primero
    if (!userToken) {
      const registerData = {
        name: formData.name.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'provider' as UserRole,
        phone: formData.phone.trim() || undefined,
      };

      const registerResult = await register(registerData);

      if (!registerResult.success) {
        setError(registerResult.error || 'Error al crear la cuenta');
        toast.error(registerResult.error || 'Error al crear la cuenta');
        setIsLoading(false);
        return;
      }

      // Guardar token para crear el perfil
      if (registerResult.data?.token && registerResult.data?.refreshToken) {
        setUserToken(registerResult.data.token);
        // Guardar en store y localStorage para usar en createProvider
        setAuth(
          registerResult.data.user,
          registerResult.data.token,
          registerResult.data.refreshToken
        );
      }
    }

    // Crear perfil del negocio (usa el token guardado en localStorage)
    const providerResult = await createProvider(businessData);

    if (!providerResult.success) {
      setError(providerResult.error || 'Error al crear el perfil del negocio');
      toast.error(
        providerResult.error || 'Error al crear el perfil del negocio'
      );
      setIsLoading(false);
      return;
    }

    // Éxito completo
    // NOTA: No limpiamos el token aquí porque el usuario aún no verificó email
    // El token se limpiará automáticamente si intenta usar la app sin verificar
    toast.success(
      '¡Cuenta y perfil creados exitosamente! Revisa tu email para verificar tu cuenta'
    );

    router.push(
      `/verify-email-pending?email=${encodeURIComponent(formData.email)}`
    );
  };

  /**
   * Vuelve al paso 1 desde el paso 2
   */
  const handleBackToStep1 = (): void => {
    setCurrentStep(1);
    setError('');
  };

  const isProvider = formData.role === 'provider';
  const totalSteps = isProvider ? 2 : 1;

  return (
    <main className="min-h-screen gradient-luxe flex items-center justify-center p-4 py-12">
      {/* Efectos decorativos dorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Card de Registro */}
      <div className="relative z-10 w-full max-w-md lg:max-w-2xl">
        <div className="bg-primary-900 rounded-2xl shadow-2xl shadow-accent-500/20 p-6 md:p-8 lg:p-10 border border-accent-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              Crear Cuenta StyleBook
            </h1>

            {/* Indicador de Progreso (solo para proveedores) */}
            {isProvider && totalSteps > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-poppins font-semibold text-sm transition-all',
                        step === currentStep
                          ? 'bg-accent-500 text-primary-900 border-2 border-accent-600'
                          : step < currentStep
                            ? 'bg-accent-600 text-white border-2 border-accent-700'
                            : 'bg-primary-800 text-neutral-400 border-2 border-primary-700'
                      )}
                    >
                      {step < currentStep ? '✓' : step}
                    </div>
                    {step < totalSteps && (
                      <div
                        className={cn(
                          'w-12 h-0.5 transition-all',
                          step < currentStep
                            ? 'bg-accent-500'
                            : 'bg-primary-700'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paso 1: Datos Personales */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              {/* Selector de Rol */}
              <div className="space-y-3">
                <Tabs
                  value={formData.role}
                  onValueChange={(value) =>
                    handleChange('role', value as UserRole)
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 gap-3 lg:gap-4 bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="client"
                      className="p-4 lg:p-5 text-base lg:text-lg w-full"
                    >
                      Soy Cliente
                    </TabsTrigger>
                    <TabsTrigger
                      value="provider"
                      className="p-4 lg:p-5 text-base lg:text-lg w-full"
                    >
                      Soy Proveedor
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Grid de campos para desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                    Nombre
                  </label>
                  <Input
                    type="text"
                    placeholder="Introduce tu nombre"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                    Apellido
                  </label>
                  <Input
                    type="text"
                    placeholder="Introduce tu apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
                  />
                </div>
              </div>

              {/* Número de Teléfono */}
              <div>
                <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                  Número de Teléfono
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={isLoading}
                  className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
                />
              </div>

              {/* Grid de contraseñas para desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                {/* Contraseña */}
                <div>
                  <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crea una contraseña segura"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500 pr-12"
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
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12m-5.71-5.71L12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm lg:text-base font-poppins font-medium text-white mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Vuelve a escribir la contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange('confirmPassword', e.target.value)
                      }
                      required
                      disabled={isLoading}
                      className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-accent-400 transition-colors"
                      tabIndex={0}
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12m-5.71-5.71L12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkbox Términos y Condiciones */}
              <div className="flex items-start gap-3 lg:gap-4">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 w-5 h-5 lg:w-6 lg:h-6 accent-accent-500 cursor-pointer"
                  required
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm lg:text-base text-neutral-300 font-poppins cursor-pointer"
                >
                  Acepto los{' '}
                  <Link
                    href="/terms"
                    className="text-accent-400 hover:text-accent-300 underline"
                    target="_blank"
                  >
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link
                    href="/privacy"
                    className="text-accent-400 hover:text-accent-300 underline"
                    target="_blank"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-900/50 border border-red-500/50">
                  <p className="text-sm text-red-200 font-poppins">{error}</p>
                </div>
              )}

              {/* Botón Siguiente/Registrarse */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isLoading}
                className="w-full mt-6 lg:mt-8 lg:py-4 lg:text-lg font-bold"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#1A1A1A',
                  borderColor: '#B8941F',
                }}
              >
                {isLoading
                  ? 'Procesando...'
                  : isProvider
                    ? 'Siguiente: Datos del Negocio'
                    : 'Registrarse'}
              </Button>
            </form>
          )}

          {/* Paso 2: Datos del Negocio (solo para proveedores) */}
          {currentStep === 2 && isProvider && (
            <div>
              <div className="mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">
                  Información del Negocio
                </h2>
                <p className="text-neutral-300 font-poppins text-sm md:text-base">
                  Completa los datos de tu negocio para finalizar el registro
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-900/50 border border-red-500/50">
                  <p className="text-sm text-red-200 font-poppins">{error}</p>
                </div>
              )}

              <ProviderBusinessStep
                onSubmit={handleStep2Submit}
                onBack={handleBackToStep1}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Footer */}
          {currentStep === 1 && (
            <p className="mt-6 lg:mt-8 text-center text-sm lg:text-base text-neutral-300 font-poppins">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="text-accent-400 hover:text-accent-300 font-semibold transition-colors underline"
              >
                Inicia sesión
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
