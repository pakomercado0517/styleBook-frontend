'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface EditEmployeeHeaderProps {
  onSave: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  employeeName?: string;
}

/**
 * Header de la página de edición de empleado
 * Mobile: flecha de regreso, título "Editar Empleado" y botón "Guardar"
 * Desktop: título grande, breadcrumb, botones "Cancelar" y "Guardar Cambios"
 */
export function EditEmployeeHeader({
  onSave,
  onCancel,
  isSaving = false,
  employeeName,
}: EditEmployeeHeaderProps): ReactNode {
  const router = useRouter();

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden px-4 py-4 border-b border-white/10 flex items-center justify-between">
        {/* Botón de regreso */}
        <button
          onClick={handleCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        {/* Título */}
        <h1 className="text-lg font-bold text-white font-poppins">
          Editar Empleado
        </h1>

        {/* Botón Guardar */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="text-base font-semibold font-poppins transition-opacity disabled:opacity-50"
          style={{ color: '#D4AF37' }}
          type="button"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Título */}
            <h1 className="text-4xl font-bold text-white font-playfair mb-2">
              Editar Empleado
            </h1>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-neutral-300 font-poppins">
              <span>Gestión de equipo</span>
              <span className="text-neutral-500">/</span>
              <span className="text-white">{employeeName || 'Empleado'}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-3 rounded-xl font-semibold font-poppins text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-poppins transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <Save className="w-5 h-5" strokeWidth={2} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
