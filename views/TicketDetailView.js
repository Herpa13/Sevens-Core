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
exports.TicketDetailView = void 0;
// FIX: Add useCallback to imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const lodash_es_1 = require("lodash-es");
const TicketDetailView = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess) {
            onSuccess();
        }
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Ticket' : `Editando Ticket de: ${initialData.customerName}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField_1.FormField label="Nombre del Cliente" htmlFor="customerName">
          <TextInput_1.TextInput id="customerName" name="customerName" value={data.customerName} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Canal" htmlFor="channel">
          <Select_1.Select id="channel" name="channel" value={data.channel} onChange={handleInputChange}>
            <option value="Email">Email</option>
            <option value="Amazon">Amazon</option>
            <option value="Web">Web</option>
            <option value="Redes Sociales">Redes Sociales</option>
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Estado" htmlFor="status">
          <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
            <option value="Abierto">Abierto</option>
            <option value="Respondido">Respondido</option>
            <option value="Cerrado">Cerrado</option>
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Fecha de Entrada" htmlFor="entryDate">
          <TextInput_1.TextInput type="date" id="entryDate" name="entryDate" value={data.entryDate} onChange={handleInputChange}/>
        </FormField_1.FormField>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.TicketDetailView = TicketDetailView;
