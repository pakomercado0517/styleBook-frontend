import { AppointmentsList } from './components/AppointmentsList';
import { AppointmentsFilters } from './components/AppointmentsFilters';

export default function AppointmentsPage() {
  return (
    <main className="container-sm mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800">
            Mis Citas
          </h1>
          <p className="mt-2 text-neutral-600">Gestiona tus citas y reservas</p>
        </header>

        <AppointmentsFilters />
        <AppointmentsList />
      </div>
    </main>
  );
}
