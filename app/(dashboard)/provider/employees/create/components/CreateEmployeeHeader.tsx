'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

interface CreateEmployeeHeaderProps {
  onSave: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

/**
 * Header de la página de creación de empleado
 * Mobile: flecha de regreso, título "Añadir Empleado" y botón "Guardar" amarillo
 * Desktop: flecha, título y botones "Cancelar" y "✓ Crear Empleado"
 */
export function CreateEmployeeHeader({
  onSave,
  onCancel,
  isSaving = false,
}: CreateEmployeeHeaderProps): ReactNode {
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
          Añadir Empleado
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <h1 className="text-2xl font-bold text-white font-playfair">
              Añadir Empleado
            </h1>
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
              <Check className="w-5 h-5" strokeWidth={2.5} />
              {isSaving ? 'Creando...' : 'Crear Empleado'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

