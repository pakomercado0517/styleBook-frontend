'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import { useDeleteService } from '@/lib/hooks/useServices';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/AlertDialog';
import type { Service } from '@/lib/types/services';
import { useState } from 'react';

interface ServiceCardProps {
  service: Service;
  onEdit: (serviceId: number) => void;
}

/**
 * Card de servicio - Diseño responsive
 * Mobile: diseño compacto sin imagen
 * Desktop: diseño con imagen, título grande, descripción completa
 */
export function ServiceCard({
  service,
  onEdit,
}: ServiceCardProps): ReactNode {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteService = useDeleteService();

  const handleDelete = (): void => {
    deleteService.mutate(service.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
      {/* Mobile: Diseño compacto */}
      <div className="md:hidden p-4">
        {/* Header con título */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-white font-poppins mb-2">
            {service.name}
          </h3>
          <p className="text-sm text-white font-poppins leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Duración y Precio */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: '#D4AF37' }} strokeWidth={2} />
            <span className="text-sm text-white font-poppins">
              {formatDuration(service.duration_minutes)}
            </span>
          </div>
          <span
            className="text-base font-semibold font-poppins"
            style={{ color: '#D4AF37' }}
          >
            {formatPrice(service.price)}
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/10">
          <button
            onClick={() => onEdit(service.id)}
            className="flex items-center gap-2 text-sm font-medium text-white font-poppins hover:text-neutral-300 transition-colors"
            type="button"
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
            <span>Editar</span>
          </button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm font-medium text-red-400 font-poppins hover:text-red-300 transition-colors"
                type="button"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                <span>Eliminar</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El servicio &quot;{service.name}&quot; será
                  eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </AlertDialogCancel>
                <button
                  onClick={handleDelete}
                  disabled={deleteService.isPending}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  type="button"
                >
                  {deleteService.isPending ? 'Eliminando...' : 'Eliminar'}
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Desktop: Diseño con imagen */}
      <div className="hidden md:block">
        {/* Imagen */}
        {service.image_url ? (
          <div className="relative w-full h-64">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
            <span className="text-white text-6xl font-playfair">
              {service.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6">
          {/* Título */}
          <h3 className="text-2xl font-bold text-white font-poppins mb-3">
            {service.name}
          </h3>

          {/* Descripción */}
          <p className="text-base text-white font-poppins mb-4 leading-relaxed">
            {service.description}
          </p>

          {/* Duración y Precio */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: '#D4AF37' }} strokeWidth={2} />
              <span className="text-base text-white font-poppins">
                {formatDuration(service.duration_minutes)}
              </span>
            </div>
            <span
              className="text-xl font-semibold font-poppins"
              style={{ color: '#D4AF37' }}
            >
              {formatPrice(service.price)}
            </span>
          </div>

          {/* Acciones: Editar y Eliminar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => onEdit(service.id)}
              className="flex items-center gap-2 text-sm font-medium text-white font-poppins hover:text-neutral-300 transition-colors"
              type="button"
            >
              <Pencil className="w-4 h-4" strokeWidth={2} />
              <span>Editar</span>
            </button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-2 text-sm font-medium text-red-400 font-poppins hover:text-red-300 transition-colors"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  <span>Eliminar</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El servicio &quot;{service.name}&quot; será
                    eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancelar
                  </AlertDialogCancel>
                  <button
                    onClick={handleDelete}
                    disabled={deleteService.isPending}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    type="button"
                  >
                    {deleteService.isPending ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

