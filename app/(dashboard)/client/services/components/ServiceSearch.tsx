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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchText);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <label className="flex flex-col min-w-40 h-14 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
          {/* Search Icon Container */}
          <div className="text-neutral-400 flex border-white/10 bg-white/5 items-center justify-center pl-4 rounded-l-xl border-r-0">
            <svg
              className="w-6 h-6"
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
              form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden 
              rounded-r-xl text-white focus:outline-0 focus:ring-0 border-none 
              bg-white/5 h-full placeholder:text-neutral-400 px-4 pl-2 
              text-base font-normal leading-normal font-poppins
            "
            aria-label="Buscar servicios"
          />
        </div>
      </label>
    </form>
  );
};
