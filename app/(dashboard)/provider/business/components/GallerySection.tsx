'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface GallerySectionProps {
  coverUrl?: string;
}

/**
 * Sección de galería
 * Muestra grid 2x2 de imágenes
 */
export function GallerySection({ coverUrl }: GallerySectionProps): ReactNode {
  // Por ahora solo mostramos la imagen de portada si existe
  // TODO: Implementar galería completa cuando esté disponible en el backend
  const images = coverUrl ? [coverUrl] : [];
  const placeholderCount = 4 - images.length;

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white font-poppins mb-4">Galería</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Imágenes existentes */}
        {images.map((imageUrl, index) => (
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
          </div>
        ))}
        {/* Placeholders */}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="relative w-full aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 text-neutral-400 mx-auto mb-1" strokeWidth={2} />
              <p className="text-xs text-neutral-400 font-poppins">Agregar</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

