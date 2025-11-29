"use client"

import { useState, type ReactNode } from 'react';

interface ServiceSearchProps {
  onSearch: (searchText: string) => void;
  placeholder?: string;
  initialValue?: string;
}

/**
 * ServiceSearch - Barra de búsqueda para servicios
 * Permite buscar servicios por nombre o descripción
 */
export const ServiceSearch = ({
  onSearch,
  placeholder = 'Buscar servicios...',
  initialValue = '',
}: ServiceSearchProps): ReactNode => {
  const [searchText, setSearchText] = useState<string>(initialValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleClearSearch = (): void => {
    setSearchText('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchText);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-12 py-3 md:py-4
            bg-white border-2 border-neutral-200
            rounded-lg
            font-poppins text-sm md:text-base
            text-primary-800
            placeholder:text-neutral-400
            hover:border-accent-500/50
            focus:border-accent-500
            focus:outline-none
            focus:ring-2 focus:ring-accent-500/20
            transition-all duration-200
          "
          aria-label="Buscar servicios"
        />

        {/* Clear Button */}
        {searchText.length > 0 && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              w-6 h-6
              flex items-center justify-center
              text-neutral-400
              hover:text-neutral-600
              transition-colors duration-200
            "
            aria-label="Limpiar búsqueda"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};
