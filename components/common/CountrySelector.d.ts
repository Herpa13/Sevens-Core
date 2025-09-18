import React from 'react';
import type { Country } from '../../types';
interface CountrySelectorProps {
    countries: Country[];
    selectedCountryId?: number;
    onChange: (countryId: number) => void;
    className?: string;
}
export declare const CountrySelector: React.FC<CountrySelectorProps>;
export {};
