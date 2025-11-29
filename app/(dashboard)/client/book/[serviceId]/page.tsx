import { BookingWizard } from './components/BookingWizard';

interface BookingPageProps {
    params: Promise<{ serviceId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { serviceId } = await params;

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
            <BookingWizard serviceId={parseInt(serviceId)} />
        </div>
    );
}
