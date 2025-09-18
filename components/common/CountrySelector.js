"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountrySelector = void 0;
const react_1 = __importDefault(require("react"));
const Select_1 = require("./Select");
const CountrySelector = ({ countries, selectedCountryId, onChange, className }) => {
    return (<Select_1.Select value={selectedCountryId ?? ''} onChange={(e) => onChange(Number(e.target.value))} className={className}>
      <option value="">Seleccionar país</option>
      {countries.map((country) => (<option key={country.id} value={country.id}>
          {country.name}
        </option>))}
    </Select_1.Select>);
};
exports.CountrySelector = CountrySelector;
