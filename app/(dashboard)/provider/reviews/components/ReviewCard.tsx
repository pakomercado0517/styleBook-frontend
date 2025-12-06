'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Star, Reply, Send } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Review {
  id: number;
  clientName: string;
  clientPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

interface ReviewCardProps {
  review: Review;
  onReply?: (reviewId: number, response: string) => void;
}

/**
 * Card de reseña
 * Muestra información del cliente, rating, comentario y opción de responder
 */
export function ReviewCard({ review, onReply }: ReviewCardProps): ReactNode {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const clientInitial = review.clientName.charAt(0).toUpperCase();
  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const handleReply = (): void => {
    if (onReply && replyText.trim()) {
      onReply(review.id, replyText.trim());
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleStartReply = (): void => {
    setIsReplying(true);
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      {/* Header con foto, nombre, rating y fecha */}
      <div className="flex items-start gap-3 mb-3">
        {/* Foto de perfil */}
        <div className="relative shrink-0">
          {review.clientPhoto ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={review.clientPhoto}
                alt={review.clientName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white font-poppins">
                {clientInitial}
              </span>
            </div>
          )}
        </div>

        {/* Nombre, rating y fecha */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-white font-poppins truncate">
              {review.clientName}
            </h3>
            <span className="text-xs text-neutral-400 font-poppins shrink-0">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4"
                style={{ color: '#D4AF37' }}
                fill={star <= review.rating ? '#D4AF37' : 'transparent'}
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comentario */}
      <p className="text-sm text-white font-poppins leading-relaxed mb-3">
        {review.comment}
      </p>

      {/* Respuesta del proveedor (si existe) */}
      {review.response && (
        <div className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs font-semibold mb-2 font-poppins" style={{ color: '#D4AF37' }}>
            Tu respuesta
          </p>
          <p className="text-sm text-white font-poppins leading-relaxed">
            {review.response}
          </p>
        </div>
      )}

      {/* Campo de respuesta (si está respondiendo) */}
      {isReplying && !review.response && (
        <div className="mb-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors resize-none"
            rows={3}
            aria-label="Escribe tu respuesta"
          />
          {/* Mobile: Botón único */}
          <button
            onClick={handleReply}
            disabled={!replyText.trim()}
            className="mt-2 w-full md:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            <span>Enviar Respuesta</span>
          </button>
          {/* Desktop: Botones Cancelar y Enviar */}
          <div className="hidden md:flex items-center gap-3 mt-3">
            <button
              onClick={() => {
                setIsReplying(false);
                setReplyText('');
              }}
              className="flex-1 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors bg-white/5 border border-white/10 text-white hover:bg-white/10"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="flex-1 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" strokeWidth={2} />
                <span>Enviar Respuesta</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Botón Responder (si no hay respuesta y no está respondiendo) */}
      {!review.response && !isReplying && onReply && (
        <button
          onClick={handleStartReply}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          <Reply className="w-4 h-4" strokeWidth={2} />
          <span>Responder</span>
        </button>
      )}
    </div>
  );
}

