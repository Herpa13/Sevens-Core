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
exports.UserDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const MultiSelect_1 = require("../components/common/MultiSelect");
const viewRegistry_1 = require("../utils/viewRegistry");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const lodash_es_1 = require("lodash-es");
const UserDetailView = ({ initialData, onSave, onDelete, onCancel, currentUser, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const isSelf = currentUser.id === data.id;
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        if (isSelf && data.role !== 'Administrador') {
            alert('Un administrador no puede cambiar su propio rol a uno inferior.');
            return;
        }
        onSave(data);
        if (onSuccess)
            onSuccess();
    }, [data, onSave, isSelf]);
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
        const { name, value } = e.target;
        let updatedData = { ...data, [name]: value };
        // If role is changed from Nivel 3, clear allowedViews
        if (name === 'role' && value !== 'Nivel 3') {
            updatedData.allowedViews = [];
        }
        setData(updatedData);
    };
    const handlePermissionsChange = (selectedViewKeys) => {
        // MultiSelect returns null for "all", but for permissions we need an explicit list
        const finalKeys = selectedViewKeys === null ? viewRegistry_1.AVAILABLE_VIEWS.map(v => v.key) : selectedViewKeys;
        setData(prev => ({ ...prev, allowedViews: finalKeys }));
    };
    const handleDeleteClick = () => {
        if (isSelf) {
            alert('No puedes eliminar tu propio usuario.');
            return;
        }
        // FIX: Call onDelete with the entity ID regardless of whether it's saved ('new') or not. The parent handler in App.tsx is designed to handle this, treating deletion of a new entity as a 'cancel' action.
        onDelete(data.id);
    };
    const roleOptions = ['Administrador', 'Nivel 2', 'Nivel 3'];
    const permissionOptions = viewRegistry_1.AVAILABLE_VIEWS.map(view => ({ id: view.key, name: view.label }));
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Usuario' : `Editando Usuario: ${initialData.name}`}</h2>
      
      <CollapsibleSection_1.CollapsibleSection title="Información de Usuario" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField_1.FormField label="Nombre Completo" htmlFor="name">
                <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Email" htmlFor="email">
                <TextInput_1.TextInput type="email" id="email" name="email" value={data.email} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Contraseña" htmlFor="password" helpText={data.id !== 'new' ? 'Dejar en blanco para no cambiar' : ''}>
                <TextInput_1.TextInput type="password" id="password" name="password" value={data.password || ''} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Rol de Usuario" htmlFor="role">
                <Select_1.Select id="role" name="role" value={data.role} onChange={handleInputChange} disabled={isSelf}>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                </Select_1.Select>
                 {isSelf && <p className="text-xs text-yellow-400 mt-1">No puedes cambiar tu propio rol.</p>}
            </FormField_1.FormField>
        </div>
      </CollapsibleSection_1.CollapsibleSection>

        {data.role === 'Nivel 3' && (<CollapsibleSection_1.CollapsibleSection title="Permisos Específicos (Nivel 3)" defaultOpen>
                <div className="p-4">
                    <FormField_1.FormField label="Vistas Permitidas" helpText="Selecciona las secciones a las que este usuario tendrá acceso.">
                        <MultiSelect_1.MultiSelect options={permissionOptions} selectedIds={data.allowedViews || []} onSelectionChange={(ids) => handlePermissionsChange(ids)} placeholder="Buscar vistas..."/>
                    </FormField_1.FormField>
                </div>
            </CollapsibleSection_1.CollapsibleSection>)}


      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold disabled:opacity-50" disabled={isSelf}>Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Usuario</button>
      </div>
    </div>);
};
exports.UserDetailView = UserDetailView;
