'use client';

import { useMutation } from '@tanstack/react-query';
import { verifyEmail, resendVerificationEmail } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { VerifyEmailResponse } from '../types/auth';
import { Result } from '../types/common';

export function useVerifyEmail() {
  const router = useRouter();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [verificationStatus, setVerificationStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Efecto para manejar el contador cuando la verificación es exitosa
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      verificationStatus === 'success' &&
      !shouldRedirect &&
      redirectCountdown > 0
    ) {
      interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            clearInterval(interval);
            setShouldRedirect(true);
          }
          return newCount;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [verificationStatus, redirectCountdown, shouldRedirect]);

  // Efecto separado para manejar la redirección
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [shouldRedirect, router]);

  // Mutación para verificar email
  const verifyMutation = useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: async (token: string): Promise<Result<VerifyEmailResponse>> => {
      if (!token?.trim()) {
        throw new Error('Token no proporcionado');
      }

      const result = await verifyEmail(token.trim());

      if (!result.success) {
        throw new Error(result.error || 'Error al verificar email');
      }

      return result;
    },
    retry: 0,
    onMutate: () => {
      setVerificationStatus('pending');
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('¡Email verificado exitosamente!');
        setVerificationStatus('success');
      }
    },
    onError: (error: Error) => {
      setVerificationStatus('error');
      toast.error(error.message || 'Error al verificar email');
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('¡Email verificado exitosamente!');
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
        toast.error(response.error || 'Error al verificar email');
      }
    },
    onError: (error: Error) => {
      setVerificationStatus('error');
      toast.error(error.message || 'Error al verificar email');
    },
  });

  // Mutación para reenviar email
  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!email) {
        throw new Error('Email no proporcionado');
      }
      return await resendVerificationEmail({ email });
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Email reenviado. Revisa tu bandeja de entrada');
      } else {
        toast.error(response.error || 'Error al reenviar email');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al reenviar email');
    },
  });

  // Log del estado de la mutación cuando cambia
  useEffect(() => {
    const status = verifyMutation.status;

    // Si la verificación es exitosa, iniciar el contador
    if (status === 'success') {
      setVerificationStatus('success');
    } else if (status === 'error') {
      setVerificationStatus('error');
    } else if (status === 'pending') {
      setVerificationStatus('pending');
    }
  }, [verifyMutation.status]);

  return {
    verifyEmailMutation: verifyMutation,
    resendEmail: resendMutation.mutate,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    verifyError: verifyMutation.error,
    resendError: resendMutation.error,
    isSuccess: verifyMutation.isSuccess,
    redirectCountdown,
    verificationState: {
      status: verifyMutation.isPending
        ? 'verifying'
        : verifyMutation.isSuccess
          ? 'success'
          : verifyMutation.isError
            ? 'error'
            : 'idle',
      error: verifyMutation.error?.message,
      timestamp: Date.now(),
    },
  };
}
