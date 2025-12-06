import { ServiceDetailsPage } from './components/ServiceDetailsPage';

interface ServiceDetailsPageRouteProps {
  params: Promise<{ id: string }>;
}

/**
 * Página de detalles del servicio
 * Muestra información completa del servicio, profesionales disponibles y proveedor
 */
export default async function ServiceDetailsPageRoute({
  params,
}: ServiceDetailsPageRouteProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#201d12]">
      <ServiceDetailsPage serviceId={parseInt(id)} />
    </div>
  );
}


