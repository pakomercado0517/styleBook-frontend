'use client';

import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
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
import { useState } from 'react';

interface DeleteEmployeeButtonProps {
  onDelete: () => void;
}

/**
 * Botón para eliminar empleado
 * Muestra un diálogo de confirmación antes de eliminar
 */
export function DeleteEmployeeButton({
  onDelete,
}: DeleteEmployeeButtonProps): ReactNode {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (): void => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          type="button"
        >
          <Trash2 className="w-5 h-5 text-red-400" strokeWidth={2} />
          <span className="text-base font-semibold text-red-400 font-poppins">
            Eliminar Empleado
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El empleado será eliminado
            permanentemente.
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
  );
}

