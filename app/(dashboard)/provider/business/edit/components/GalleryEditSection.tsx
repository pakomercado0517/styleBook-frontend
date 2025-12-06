'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { X, FolderOpen, Plus } from 'lucide-react';

interface GalleryEditSectionProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  onAddImage: () => void;
}

/**
 * Sección de galería editable
 * Mobile: scroll horizontal
 * Desktop: grid 2x2 con botón "Subir Archivos"
 */
export function GalleryEditSection({
  images,
  onRemoveImage,
  onAddImage,
}: GalleryEditSectionProps): ReactNode {
  // Asegurar que siempre tengamos 4 slots (3 imágenes + 1 botón añadir)
  const displayImages = images.slice(0, 3);
  const remainingSlots = 4 - displayImages.length;

  return (
    <div>
      <h2 className="text-sm font-semibold text-white font-poppins mb-4 md:text-xl md:mb-6">
        Galería Multimedia
      </h2>

      {/* Mobile: Scroll horizontal */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
        {displayImages.map((imageUrl, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0"
          >
            <Image
              src={imageUrl}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              aria-label={`Eliminar imagen ${index + 1}`}
              type="button"
            >
              <X className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddImage}
          className="w-24 h-24 rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          type="button"
        >
          <Plus className="w-6 h-6 text-neutral-400" strokeWidth={2.5} />
          <span className="text-xs text-neutral-400 font-poppins mt-1">Añadir más</span>
        </button>
      </div>

      {/* Desktop: Botón Subir Archivos y Grid */}
      <div className="hidden md:block">
        <button
          onClick={onAddImage}
          className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          <FolderOpen className="w-5 h-5" strokeWidth={2} />
          <span>Subir Archivos</span>
        </button>
        <div className="grid grid-cols-2 gap-4">
          {/* Imágenes existentes */}
          {displayImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative w-full aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                aria-label={`Eliminar imagen ${index + 1}`}
                type="button"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2.5} />
              </button>
            </div>
          ))}
          {/* Botón Añadir más */}
          {remainingSlots > 0 && (
            <button
              onClick={onAddImage}
              className="w-full aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
              type="button"
            >
              <Plus className="w-8 h-8 text-neutral-400 mb-2" strokeWidth={2.5} />
              <span className="text-sm text-neutral-400 font-poppins">Añadir más</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

