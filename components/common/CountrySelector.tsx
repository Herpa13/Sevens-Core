
import React from 'react';
import type { Country } from '../../types';
import { Select } from './Select';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountryId?: number;
  onChange: (countryId: number) => void;
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ countries, selectedCountryId, onChange, className }) => {
  return (
    <Select
      value={selectedCountryId ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className}
    >
      <option value="">Seleccionar país</option>
      {countries.map((country) => (
        <option key={country.id} value={country.id}>
          {country.name}
        </option>
      ))}
    </Select>
  );
};
