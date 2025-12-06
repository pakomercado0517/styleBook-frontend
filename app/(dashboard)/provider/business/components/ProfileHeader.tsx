'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Star, MoreVertical, Pencil } from 'lucide-react';

interface ProfileHeaderProps {
  businessName: string;
  rating: number;
  reviewsCount: number;
  onEdit?: () => void;
  editHref?: string;
}

/**
 * Header del perfil del proveedor
 * Mobile: título, nombre, rating y menú
 * Desktop: título, botón editar, nombre grande, rating y descripción
 */
export function ProfileHeader({
  businessName,
  rating,
  reviewsCount,
  onEdit,
  editHref,
}: ProfileHeaderProps): ReactNode {
  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-6 border-b border-white/10 md:hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white font-poppins mb-2">
              Mi Negocio
            </h1>
            <h2 className="text-xl font-semibold text-white font-poppins">
              {businessName}
            </h2>
          </div>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Más opciones"
            type="button"
          >
            <MoreVertical className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Star
            className="w-5 h-5"
            style={{ color: '#D4AF37' }}
            fill="#D4AF37"
            strokeWidth={2}
          />
          <span className="text-base font-semibold text-white font-poppins">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-neutral-300 font-poppins">
            ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-8 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white font-poppins">
            Mi Negocio
          </h1>
          {editHref ? (
            <Link
              href={editHref}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
            >
              <Pencil className="w-5 h-5" strokeWidth={2.5} />
              <span>Editar Negocio</span>
            </Link>
          ) : onEdit ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <Pencil className="w-5 h-5" strokeWidth={2.5} />
              <span>Editar Negocio</span>
            </button>
          ) : null}
        </div>
        <div className="mb-4">
          <h2 className="text-4xl font-bold text-white font-playfair mb-3">
            {businessName}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <Star
              className="w-6 h-6"
              style={{ color: '#D4AF37' }}
              fill="#D4AF37"
              strokeWidth={2}
            />
            <span className="text-xl font-semibold text-white font-poppins">
              {rating.toFixed(1)}
            </span>
            <span className="text-base text-neutral-300 font-poppins">
              ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
