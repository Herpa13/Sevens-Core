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
exports.PricingRuleDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const MultiSelect_1 = require("../components/common/MultiSelect");
const lodash_es_1 = require("lodash-es");
const CALCULATION_METHODS = [
    { value: 'USE_PVPR', label: 'Usar PVPR Base', requiresValue: false },
    { value: 'FIXED_PRICE', label: 'Precio Fijo', requiresValue: true },
    { value: 'DISCOUNT_FROM_PVPR_PERCENTAGE', label: 'Descuento % sobre PVPR', requiresValue: true },
    { value: 'DISCOUNT_FROM_PVPR_AMOUNT', label: 'Descuento Fijo sobre PVPR', requiresValue: true },
    { value: 'MARKUP_FROM_COST', label: 'Margen sobre Coste', requiresValue: true },
];
const PricingRuleDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess)
            onSuccess();
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(() => handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const target = e.target;
        if (name === 'isActive') {
            setData(prev => ({ ...prev, isActive: target.checked }));
        }
        else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleScopeChange = (field, ids) => {
        setData(prev => ({
            ...prev,
            scope: {
                ...prev.scope,
                [field]: ids,
            }
        }));
    };
    const handleCalculationChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            calculation: {
                ...prev.calculation,
                [name]: value
            }
        }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    const calculationMethodConfig = CALCULATION_METHODS.find(m => m.value === data.calculation.method);
    return (<div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Regla de Precios' : `Editando Regla: ${initialData.name}`}</h2>
            
            <CollapsibleSection_1.CollapsibleSection title="Información General" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                    <FormField_1.FormField label="Nombre de la Regla" htmlFor="name" className="lg:col-span-3">
                        <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Fecha de Inicio">
                        <TextInput_1.TextInput type="date" name="startDate" value={data.startDate || ''} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Fecha de Fin">
                        <TextInput_1.TextInput type="date" name="endDate" value={data.endDate || ''} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                    <div className="flex items-center pt-6">
                        <input type="checkbox" id="isActive" name="isActive" checked={data.isActive} onChange={handleInputChange} className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-700 focus:ring-cyan-500"/>
                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-300">
                            Regla Activa
                        </label>
                    </div>
                </div>
            </CollapsibleSection_1.CollapsibleSection>

            <CollapsibleSection_1.CollapsibleSection title="Alcance (Scope)" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField_1.FormField label="Productos Afectados" helpText="Si no seleccionas ninguno, se aplica a TODOS.">
                        <MultiSelect_1.MultiSelect options={appData.products.map(p => ({ id: p.id, name: p.name }))} selectedIds={data.scope.productIds} onSelectionChange={(ids) => handleScopeChange('productIds', ids)} placeholder="Buscar productos..."/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Plataformas Afectadas" helpText="Si no seleccionas ninguna, se aplica a TODAS.">
                         <MultiSelect_1.MultiSelect options={appData.platforms.map(p => ({ id: p.id, name: p.name }))} selectedIds={data.scope.platformIds} onSelectionChange={(ids) => handleScopeChange('platformIds', ids)} placeholder="Buscar plataformas..."/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Países Afectados" helpText="Si no seleccionas ninguno, se aplica a TODOS.">
                         <MultiSelect_1.MultiSelect options={appData.countries.map(c => ({ id: c.id, name: c.name }))} selectedIds={data.scope.countryIds} onSelectionChange={(ids) => handleScopeChange('countryIds', ids)} placeholder="Buscar países..."/>
                    </FormField_1.FormField>
                </div>
            </CollapsibleSection_1.CollapsibleSection>
            
            <CollapsibleSection_1.CollapsibleSection title="Cálculo" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <FormField_1.FormField label="Método de Cálculo">
                        <Select_1.Select name="method" value={data.calculation.method} onChange={handleCalculationChange}>
                            {CALCULATION_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </Select_1.Select>
                    </FormField_1.FormField>
                    {calculationMethodConfig?.requiresValue && (<FormField_1.FormField label="Valor (Número o %)">
                            <TextInput_1.TextInput type="number" name="value" value={data.calculation.value || ''} onChange={handleCalculationChange}/>
                        </FormField_1.FormField>)}
                </div>
            </CollapsibleSection_1.CollapsibleSection>

            <div className="mt-8 flex justify-end space-x-4">
                {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Regla</button>
            </div>
        </div>);
};
exports.PricingRuleDetailView = PricingRuleDetailView;
