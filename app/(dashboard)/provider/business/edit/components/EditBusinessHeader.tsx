'use client';

import type { ReactNode } from 'react';

interface EditBusinessHeaderProps {
  onSave: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

/**
 * Header de la página de edición del negocio
 * Mobile: título y botón "Guardar Cambios"
 * Desktop: logo, título centrado, botones "Cancelar" y "Guardar Cambios"
 */
export function EditBusinessHeader({
  onSave,
  onCancel,
  isSaving = false,
}: EditBusinessHeaderProps): ReactNode {
  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-4 border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white font-poppins">Editar Negocio</h1>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        {/* Título */}
        <h1 className="text-2xl font-bold text-white font-poppins">Editar Negocio</h1>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl font-semibold font-poppins transition-colors bg-white/5 border border-white/10 text-white hover:bg-white/10"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </>
  );
}

