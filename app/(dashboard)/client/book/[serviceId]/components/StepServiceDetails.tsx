import type { Service } from '@/lib/types/services';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface StepServiceDetailsProps {
    service: Service;
    onContinue: () => void;
    onBack: () => void;
}

export function StepServiceDetails({ service, onContinue, onBack }: StepServiceDetailsProps) {
    // Formatear precio
    const formattedPrice = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(service.price);

    // Formatear duración
    const hours = Math.floor(service.duration_minutes / 60);
    const minutes = service.duration_minutes % 60;
    const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <Badge variant="secondary" className="mb-2">
                        {service.category}
                    </Badge>
                    <h2 className="text-3xl font-playfair font-bold text-primary-800">
                        {service.name}
                    </h2>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-accent-500">{formattedPrice}</p>
                    <p className="text-sm text-neutral-500">{formattedDuration}</p>
                </div>
            </div>

            {service.image_url && (
                <div className="w-full h-64 rounded-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-primary-800 mb-2">Descripción</h3>
                <p className="text-neutral-600 leading-relaxed">
                    {service.description}
                </p>
            </div>

            {service.provider && (
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <h3 className="text-sm font-semibold text-primary-800 mb-1">Ofrecido por</h3>
                    <p className="text-lg font-playfair">{service.provider.business_name}</p>
                    <p className="text-sm text-neutral-500">{service.provider.address}</p>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    Cancelar
                </Button>
                <Button onClick={onContinue} className="flex-1">
                    Continuar
                </Button>
            </div>
        </div>
    );
}
