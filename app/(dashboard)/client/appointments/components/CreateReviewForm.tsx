'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ArrowRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { createReviewSchema } from '@/lib/schemas/reviews.schema';
import type { CreateReviewInput } from '@/lib/schemas/reviews.schema';
import type { Appointment } from '@/lib/types/appointments';
import { cn } from '@/lib/utils/cn';

interface CreateReviewFormProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Textos dinámicos según el rating
 */
const ratingTexts: Record<number, string> = {
  1: 'MALO',
  2: 'REGULAR',
  3: 'BUENO',
  4: '¡MUY BUENO!',
  5: '¡EXCELENTE!',
};

/**
 * Formulario para crear una reseña
 * Diseño mobile-first basado en el template proporcionado
 */
export function CreateReviewForm({
  appointment,
  isOpen,
  onClose,
}: CreateReviewFormProps): ReactNode {
  const [rating, setRating] = useState<number>(0);
  const [isRecommended, setIsRecommended] = useState<boolean>(true);

  const createReviewMutation = useCreateReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      appointment_id: appointment.id,
      rating: 0,
      comment: '',
    },
  });

  const commentValue = watch('comment') || '';
  const commentLength = commentValue.length;

  // Información del servicio
  const serviceName = appointment.service?.name || `Servicio #${appointment.service_id}`;
  const serviceImage = appointment.service?.image_url;
  const providerName = appointment.provider?.business_name || 'Proveedor';
  const appointmentDate = new Date(appointment.start_date_local);
  const formattedDate = format(appointmentDate, "d MMM", { locale: es });

  const handleRatingClick = (selectedRating: number): void => {
    setRating(selectedRating);
    setValue('rating', selectedRating, { shouldValidate: true });
  };

  const handleToggleRecommend = (): void => {
    setIsRecommended(!isRecommended);
  };

  const onSubmit = async (data: CreateReviewInput): Promise<void> => {
    if (rating === 0) {
      return;
    }

    const reviewData = {
      appointment_id: appointment.id,
      rating,
      comment: data.comment || undefined,
    };

    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        reset();
        setRating(0);
        setIsRecommended(true);
        onClose();
      },
    });
  };

  const isLoading = createReviewMutation.isPending;
  const ratingText = rating > 0 ? ratingTexts[rating] : '';

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-50 bg-[#121212] flex flex-col',
            'md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%]',
            'md:w-full md:max-w-lg md:max-h-[90vh] md:rounded-2xl md:overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
              type="button"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <DialogPrimitive.Title className="text-lg font-bold text-white font-playfair">
              Dejar una Reseña
            </DialogPrimitive.Title>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={rating === 0 || isLoading}
              className="px-4 py-2 rounded-lg font-semibold font-poppins transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: rating > 0 && !isLoading ? '#D4AF37' : '#666666',
                color: '#1A1A1A',
              }}
              type="button"
            >
              {isLoading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Card con información del servicio */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-4">
                  {/* Imagen del servicio */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    {serviceImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={serviceImage}
                        alt={serviceName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                        <span className="text-2xl">💇</span>
                      </div>
                    )}
                  </div>

                  {/* Información del servicio */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white font-playfair mb-1">
                      {serviceName}
                    </h3>
                    <p className="text-sm text-neutral-300 font-poppins mb-1">
                      {providerName}
                    </p>
                    <p className="text-xs text-neutral-400 font-poppins">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección de Rating */}
              <div>
                <h3 className="text-base font-semibold text-white font-poppins mb-4">
                  Califica tu experiencia
                </h3>

                {/* Estrellas */}
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Calificar ${star} estrella${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={cn(
                          'w-10 h-10 transition-colors',
                          star <= rating
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-neutral-400 fill-transparent'
                        )}
                        strokeWidth={2}
                      />
                    </button>
                  ))}
                </div>

                {/* Texto dinámico según rating */}
                {rating > 0 && (
                  <p
                    className="text-lg font-bold font-poppins"
                    style={{ color: '#D4AF37' }}
                  >
                    {ratingText}
                  </p>
                )}
              </div>

              {/* Textarea para comentario */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-base font-semibold text-white font-poppins mb-2"
                >
                  Tu opinión
                </label>
                <textarea
                  {...register('comment')}
                  id="comment"
                  placeholder="Cuéntanos tu experiencia... ¿Qué fue lo que más te gustó?"
                  className={cn(
                    'w-full min-h-[120px] px-4 py-3 rounded-xl',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder:text-neutral-400',
                    'font-poppins text-sm',
                    'focus:outline-none focus:border-accent-500',
                    'transition-colors resize-none',
                    errors.comment && 'border-red-500'
                  )}
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  {errors.comment && (
                    <p className="text-sm text-red-400 font-poppins">
                      {errors.comment.message}
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-xs font-poppins ml-auto',
                      commentLength >= 500
                        ? 'text-red-400'
                        : 'text-neutral-400'
                    )}
                  >
                    {commentLength}/500
                  </p>
                </div>
              </div>

              {/* Toggle de recomendación */}
              <div className="flex items-center justify-between py-4 border-t border-white/10">
                <div className="flex-1">
                  <p className="text-base font-semibold text-white font-poppins mb-1">
                    ¿Lo recomiendas?
                  </p>
                  <p className="text-sm text-neutral-400 font-poppins">
                    Recomendar este profesional a otros
                  </p>
                </div>
                <button
                  onClick={handleToggleRecommend}
                  type="button"
                  className={cn(
                    'relative w-14 h-8 rounded-full transition-colors focus:outline-none',
                    isRecommended ? 'bg-[#D4AF37]' : 'bg-neutral-600'
                  )}
                  aria-label={isRecommended ? 'Recomendado' : 'No recomendado'}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform',
                      isRecommended ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Botón principal de envío */}
              <button
                type="submit"
                disabled={rating === 0 || isLoading}
                className={cn(
                  'w-full h-14 rounded-xl font-semibold font-poppins',
                  'flex items-center justify-center gap-2',
                  'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                  'shadow-lg hover:shadow-xl',
                  rating > 0 && !isLoading
                    ? 'bg-[#D4AF37] text-[#1A1A1A]'
                    : 'bg-neutral-600 text-neutral-400'
                )}
                style={
                  rating > 0 && !isLoading
                    ? {
                        boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                      }
                    : {}
                }
              >
                <span>Publicar Reseña</span>
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </button>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

