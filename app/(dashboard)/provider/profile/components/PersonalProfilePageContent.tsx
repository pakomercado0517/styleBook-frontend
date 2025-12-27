'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { PersonalProfileHeader } from './PersonalProfileHeader';
import { ProfilePictureSection } from './ProfilePictureSection';
import { PersonalInfoFields } from './PersonalInfoFields';
import { ChangePasswordButton } from './ChangePasswordButton';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ChangePasswordSection } from './ChangePasswordSection';
import { LogoutSection } from './LogoutSection';
import { updateProfile } from '@/lib/api/profile';
import { logout } from '@/lib/api/auth';

/**
 * Contenido principal de la página de perfil personal del proveedor
 * Diseño mobile-first según template
 */
export function PersonalProfilePageContent(): ReactNode {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Mutation para actualizar el perfil
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('Usuario no encontrado');
      }

      if (!user.id) {
        throw new Error('ID de usuario no encontrado');
      }

      // Preparar datos de actualización
      // UpdateProfileData requiere name como string obligatorio
      const updateData: {
        name: string;
        phone?: string;
      } = {
        name: user.name || '', // Mantener el nombre actual o string vacío
      };

      // Solo actualizar phone si hay cambios
      if (phone !== (user.phone || '')) {
        updateData.phone = phone || undefined;
      }

      // Nota: email no se puede actualizar desde UpdateProfileData según el tipo

      // Si no hay cambios, no hacer la petición
      const hasChanges = phone !== (user.phone || '') || email !== user.email;
      if (!hasChanges) {
        return null;
      }

      const result = await updateProfile(user.id, updateData);

      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success('Perfil actualizado', {
        description: 'Tu información personal se ha actualizado correctamente.',
      });
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', {
        description: error.message || 'No se pudo actualizar el perfil.',
      });
    },
  });

  const handleSave = (): void => {
    // Validaciones básicas
    if (!email.trim()) {
      toast.error('Error de validación', {
        description: 'El email es requerido.',
      });
      return;
    }

    updateMutation.mutate();
  };

  const handleChangePhoto = (): void => {
    // TODO: Implementar selector de imágenes
    toast.info('Función de cambiar foto próximamente');
  };

  const handleChangePassword = (): void => {
    // TODO: Implementar modal o página de cambio de contraseña
    toast.info('Función de cambiar contraseña próximamente');
  };

  const handleLogout = (): void => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white font-poppins">Mi Perfil Personal</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">No se pudo cargar el perfil del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#121212] flex flex-col">
      {/* Header */}
      <PersonalProfileHeader
        onSave={handleSave}
        isSaving={updateMutation.isPending}
      />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 space-y-6 overflow-y-auto">
        {/* Mobile: Layout vertical */}
        <div className="md:hidden space-y-6">
          {/* Foto de perfil */}
          <ProfilePictureSection
            photoUrl={undefined} // TODO: Obtener photo_url del usuario cuando esté disponible
            userName={user.name}
            onChangePhoto={handleChangePhoto}
          />

          {/* Campos de información personal */}
          <PersonalInfoFields
            email={email}
            phone={phone}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
          />

          {/* Botón Cambiar Contraseña */}
          <ChangePasswordButton onClick={handleChangePassword} />

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold font-poppins transition-colors bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10"
            type="button"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Desktop: Cards organizadas */}
        <div className="hidden md:block space-y-6">
          {/* Información Personal */}
          <PersonalInfoSection
            photoUrl={undefined} // TODO: Obtener photo_url del usuario cuando esté disponible
            userName={user.name}
            email={email}
            phone={phone}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onChangePhoto={handleChangePhoto}
          />

          {/* Cambiar Contraseña */}
          <ChangePasswordSection />

          {/* Cerrar Sesión */}
          <LogoutSection onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
}

