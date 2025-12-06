'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
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
import type { Employee } from '@/lib/types/employees';
import { useState } from 'react';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employeeId: number) => void;
  onDelete: (employeeId: number) => void;
}

/**
 * Card de empleado - Diseño mobile
 * Muestra foto, nombre, especialidad y acciones
 */
export function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps): ReactNode {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (): void => {
    onDelete(employee.id);
    setIsDeleteDialogOpen(false);
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-4">
        {/* Foto de perfil */}
        <div className="flex-shrink-0">
          {employee.photo_url ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={employee.photo_url}
                alt={employee.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(employee.name)}
              </span>
            </div>
          )}
        </div>

        {/* Información del empleado */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white font-poppins mb-1 truncate">
            {employee.name}
          </h3>
          {employee.specialty && (
            <p className="text-sm text-neutral-300 font-poppins truncate">
              {employee.specialty}
            </p>
          )}
        </div>

        {/* Acciones: Editar y Eliminar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => onEdit(employee.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label={`Editar ${employee.name}`}
            type="button"
          >
            <Pencil className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label={`Eliminar ${employee.name}`}
                type="button"
              >
                <Trash2 className="w-5 h-5 text-red-400" strokeWidth={2} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El empleado "{employee.name}" será
                  eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </AlertDialogCancel>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  type="button"
                >
                  Eliminar
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

