import { BookingWizard } from './components/BookingWizard';

interface BookingPageProps {
    params: Promise<{ serviceId: string }>;
    searchParams: Promise<{ reschedule?: string }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
    const { serviceId } = await params;
    const { reschedule } = await searchParams;
    const rescheduleId = reschedule ? parseInt(reschedule, 10) : null;

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
            <BookingWizard 
                serviceId={parseInt(serviceId)} 
                rescheduleAppointmentId={isNaN(rescheduleId || 0) ? null : rescheduleId}
            />
        </div>
    );
}
