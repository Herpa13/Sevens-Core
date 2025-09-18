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
exports.IngredientDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const Icon_1 = require("../components/common/Icon");
const TextArea_1 = require("../components/common/TextArea");
const AuditLogDisplay_1 = require("../components/common/AuditLogDisplay");
const lodash_es_1 = require("lodash-es");
const KeywordManager_1 = require("../components/common/KeywordManager");
const NotesSection_1 = require("../components/common/NotesSection");
const TabButton = ({ title, icon, isActive, onClick }) => (<button onClick={onClick} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
        ? 'border-cyan-500 text-cyan-400 bg-slate-900'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
        <Icon_1.Icon name={icon}/>
        <span>{title}</span>
    </button>);
const CountryRegulationEditor = ({ country, detail, onDetailChange }) => {
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        onDetailChange(country.id, name, val);
    };
    const handleVrnChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        const newVrn = { ...(detail?.vrn || { baseQuantity: 0, baseUnit: 'mg', percentage: 100 }), [name]: val };
        onDetailChange(country.id, 'vrn', newVrn);
    };
    // FIX: Add missing optional properties 'vrn' and 'sourceInfo' to the fallback object to match the IngredientCountryDetail type.
    const d = detail || { countryId: country.id, name: '', status: 'En estudio', permittedClaims: [], labelDisclaimers: [], vrn: undefined, sourceInfo: undefined };
    return (<div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField_1.FormField label="Nombre en este País" htmlFor={`name-${country.id}`}><TextInput_1.TextInput id={`name-${country.id}`} name="name" value={d.name} onChange={handleInputChange}/></FormField_1.FormField>
                <FormField_1.FormField label="Estado Regulatorio" htmlFor={`status-${country.id}`}>
                    <Select_1.Select id={`status-${country.id}`} name="status" value={d.status} onChange={handleInputChange}>
                        <option value="Permitido">Permitido</option>
                        <option value="Prohibido">Prohibido</option>
                        <option value="Con restricciones">Con restricciones</option>
                        <option value="En estudio">En estudio</option>
                    </Select_1.Select>
                </FormField_1.FormField>
            </div>
            <CollapsibleSection_1.CollapsibleSection title="VRN (Valor de Referencia Nutricional)">
                <div className="grid grid-cols-3 gap-4 p-4">
                     <FormField_1.FormField label="Cantidad Base"><TextInput_1.TextInput type="number" name="baseQuantity" value={d.vrn?.baseQuantity || ''} onChange={handleVrnChange}/></FormField_1.FormField>
                     <FormField_1.FormField label="Unidad Base"><Select_1.Select name="baseUnit" value={d.vrn?.baseUnit || ''} onChange={handleVrnChange}><option value="mg">mg</option><option value="g">g</option><option value="µg">µg</option><option value="UI">UI</option></Select_1.Select></FormField_1.FormField>
                     <FormField_1.FormField label="Porcentaje (%)"><TextInput_1.TextInput type="number" name="percentage" value={d.vrn?.percentage || ''} onChange={handleVrnChange}/></FormField_1.FormField>
                </div>
            </CollapsibleSection_1.CollapsibleSection>
            <FormField_1.FormField label="Alegaciones de Salud Permitidas (Claims)">
                <KeywordManager_1.KeywordManager keywords={d.permittedClaims || []} onChange={k => onDetailChange(country.id, 'permittedClaims', k)}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Advertencias para Etiqueta (Disclaimers)">
                 <KeywordManager_1.KeywordManager keywords={d.labelDisclaimers || []} onChange={k => onDetailChange(country.id, 'labelDisclaimers', k)}/>
            </FormField_1.FormField>
             <FormField_1.FormField label="Fuente / Información Adicional"><TextArea_1.TextArea name="sourceInfo" value={d.sourceInfo || ''} onChange={handleInputChange} rows={2}/></FormField_1.FormField>
        </div>);
};
// --- START TAB COMPONENTS ---
const MainTab = ({ data, setData, appData }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    const handleCountryDetailChange = (countryId, field, value) => {
        setData(prev => {
            const countryDetails = [...prev.countryDetails];
            let detailIndex = countryDetails.findIndex(d => d.countryId === countryId);
            if (detailIndex === -1) {
                countryDetails.push({ countryId, name: '', status: 'En estudio', permittedClaims: [], labelDisclaimers: [] });
                detailIndex = countryDetails.length - 1;
            }
            const updatedDetail = { ...countryDetails[detailIndex], [field]: value };
            countryDetails[detailIndex] = updatedDetail;
            return { ...prev, countryDetails };
        });
    };
    return (<>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField_1.FormField label="Nombre Latín / Científico" htmlFor="latinName"><TextInput_1.TextInput id="latinName" name="latinName" value={data.latinName} onChange={handleInputChange}/></FormField_1.FormField>
                <FormField_1.FormField label="Tipo" htmlFor="type">
                    <Select_1.Select id="type" name="type" value={data.type} onChange={handleInputChange}>
                        <option value="">Seleccionar tipo</option>
                        <option value="Componente Activo">Componente Activo</option>
                        <option value="Excipiente">Excipiente</option>
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Unidad de Medida por Defecto" htmlFor="measureUnit">
                    <Select_1.Select id="measureUnit" name="measureUnit" value={data.measureUnit} onChange={handleInputChange}>
                        <option value="">Seleccionar unidad</option>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="µg">µg</option>
                        <option value="UI">UI</option>
                    </Select_1.Select>
                </FormField_1.FormField>
            </div>
            <CollapsibleSection_1.CollapsibleSection title="Regulación por País" defaultOpen>
                <div className="p-4 space-y-3">
                   {appData.countries.map(country => (<CollapsibleSection_1.CollapsibleSection key={country.id} title={country.name}>
                           <CountryRegulationEditor country={country} detail={data.countryDetails.find(d => d.countryId === country.id)} onDetailChange={handleCountryDetailChange}/>
                       </CollapsibleSection_1.CollapsibleSection>))}
                </div>
            </CollapsibleSection_1.CollapsibleSection>
        </>);
};
const HistoryTab = ({ data, appData }) => {
    if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda el ingrediente para ver su historial.</div>;
    }
    const logs = appData.logs
        .filter(l => l.entityType === 'ingredients' && l.entityId === data.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return <AuditLogDisplay_1.AuditLogDisplay logs={logs}/>;
};
const NotesTab = ({ data, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const ingredientNotes = typeof data.id === 'number'
        ? appData.notes.filter(n => n.entityType === 'ingredients' && n.entityId === data.id)
        : [];
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'ingredients',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    return (<div>
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={ingredientNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el ingrediente para poder añadir notas.</p>)}
        </div>);
};
// --- END TAB COMPONENTS ---
const IngredientDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [activeTab, setActiveTab] = (0, react_1.useState)('main');
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
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleDeleteClick = () => onDelete(data.id);
    return (<div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Ingrediente' : `Editando: ${initialData.latinName}`}</h2>
                    <div className="flex space-x-2">
                        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-700 bg-slate-800 px-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton title="Principal" icon="flask" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')}/>
                    <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')}/>
                    <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')}/>
                </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
                {activeTab === 'main' && <MainTab data={data} setData={setData} appData={appData}/>}
                {activeTab === 'notes' && <NotesTab data={data} appData={appData} onNoteAdd={onNoteAdd} onNoteUpdate={onNoteUpdate} onNoteDelete={onNoteDelete}/>}
                {activeTab === 'history' && <HistoryTab data={data} appData={appData}/>}
            </div>
        </div>);
};
exports.IngredientDetailView = IngredientDetailView;
