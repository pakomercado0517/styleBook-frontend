import { FavoritesList } from './components/FavoritesList';
import { FavoritesFilters } from './components/FavoritesFilters';

export default function FavoritesPage() {
  return (
    <main className="container-sm mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800">
            Mis Favoritos
          </h1>
          <p className="mt-2 text-neutral-600">
            Tus proveedores y servicios favoritos
          </p>
        </header>

        <FavoritesFilters />
        <FavoritesList />
      </div>
    </main>
  );
}
