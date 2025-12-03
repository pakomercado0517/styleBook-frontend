import type { ReactNode } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useUpdateService, useDeleteService } from '@/lib/hooks/useServices';
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
 * Card de servicio con acciones
 */
export function ServiceCard({
  service,
  onEdit,
}: ServiceCardProps): ReactNode {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const handleToggleActive = (): void => {
    updateService.mutate({
      serviceId: service.id,
      data: { is_active: !service.is_active },
    });
  };

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

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      corte: 'Corte',
      tinte: 'Tinte',
      peinado: 'Peinado',
      manicure: 'Manicure',
      pedicure: 'Pedicure',
      tratamiento_capilar: 'Tratamiento Capilar',
      barba: 'Barba',
      afeitado: 'Afeitado',
      masaje: 'Masaje',
      facial: 'Facial',
      corporal: 'Corporal',
      aromaterapia: 'Aromaterapia',
      limpieza_dental: 'Limpieza Dental',
      estetica_dental: 'Estética Dental',
    };
    return labels[category] || category;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 hover:border-accent-500/30 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-300">
      {/* Image */}
      {service.image_url ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-800 to-primary-900 rounded-xl mb-4 flex items-center justify-center">
          <span className="text-white text-4xl font-playfair">
            {service.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-playfair text-xl font-bold text-primary-800 flex-1">
            {service.name}
          </h3>
          <Badge
            variant={service.is_active ? 'primary' : 'secondary'}
            className="ml-2"
          >
            {service.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span>{getCategoryLabel(service.category)}</span>
          <span>•</span>
          <span>{formatDuration(service.duration_minutes)}</span>
          <span>•</span>
          <span className="font-bold text-accent-600">
            {formatPrice(service.price)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="md"
          onClick={() => onEdit(service.id)}
          className="flex-1"
        >
          ✏️ Editar
        </Button>
        <Button
          variant={service.is_active ? 'secondary' : 'primary'}
          size="md"
          onClick={handleToggleActive}
          disabled={updateService.isPending}
        >
          {service.is_active ? '⏸️' : '▶️'}
        </Button>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="md">
              🗑️
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El servicio "{service.name}" será
                eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <Button
                variant="primary"
                onClick={handleDelete}
                disabled={deleteService.isPending}
              >
                {deleteService.isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

