"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISettingsView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextArea_1 = require("../components/common/TextArea");
const AISettingsView = ({ initialData, onSave, onCancel }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    const handleSaveClick = () => onSave(data);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Ajustes Globales de Inteligencia Artificial</h2>
      
      <FormField_1.FormField label="Reglas Globales de Traducción" htmlFor="globalTranslationRules" helpText="Estas reglas se aplicarán a TODAS las traducciones realizadas con plantillas de IA que usen el placeholder {global_rules}. Escribe una regla por línea.">
        <TextArea_1.TextArea id="globalTranslationRules" name="globalTranslationRules" value={data.globalTranslationRules} onChange={handleInputChange} rows={10} className="font-mono text-sm" placeholder="- NUNCA traduzcas el nombre de la marca 'MiMarca'.&#10;- Siempre usa un tono formal para el mercado alemán (DE)."/>
      </FormField_1.FormField>

      <div className="mt-8 flex justify-end space-x-4">
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={handleSaveClick} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Ajustes</button>
      </div>
    </div>);
};
exports.AISettingsView = AISettingsView;
