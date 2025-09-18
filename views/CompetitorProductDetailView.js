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
exports.CompetitorProductDetailView = void 0;
// FIX: Add useCallback and useEffect imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const CountrySelector_1 = require("../components/common/CountrySelector");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const CompetitorProductDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [activeSnapshotId, setActiveSnapshotId] = (0, react_1.useState)(initialData.snapshots[initialData.snapshots.length - 1]?.id || null);
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
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' && value !== '' ? parseInt(value) : value;
        setData(prev => ({ ...prev, [name]: val === '' ? null : val }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    const handleTakeSnapshot = () => {
        // In a real app, this would trigger a backend process.
        // Here, we simulate it by adding a new snapshot with demo analysis.
        const newSnapshot = {
            id: -Date.now(),
            competitorProductId: typeof data.id === 'number' ? data.id : undefined,
            createdAt: new Date().toISOString(),
            amazonTitle: `(Nuevo) ${data.name} - ${new Date().toLocaleDateString()}`,
            amazonDescription: 'Descripción capturada en la nueva fecha. La competencia ha añadido más detalles sobre los ingredientes.',
            amazonBulletPoints: ['NUEVO BENEFICIO 1', 'NUEVO BENEFICIO 2', 'NUEVO BENEFICIO 3'],
            amazonPhotos: [{ url: 'https://images.unsplash.com/photo-1575464383418-c33116c0b398?q=80&w=200' }],
            titleAnalysis: 'Análisis IA (Nuevo): Han añadido la palabra "Rápida Absorción" al título. Esto indica una nueva estrategia de marketing.',
            descriptionAnalysis: 'Análisis IA (Nuevo): La descripción ahora es más larga y detalla el proceso de fabricación. Intentan justificar un precio más alto.',
            aPlusAnalysis: 'Análisis IA (Nuevo): Han implementado contenido A+ básico con dos módulos. Sigue siendo una oportunidad para nosotros crear un A+ superior.',
            infographicsAnalysis: 'Análisis IA (Nuevo): Han cambiado la segunda infografía para mostrar un gráfico de "satisfacción del cliente".',
            reviewsAnalysis: 'Análisis IA (Nuevo): Las últimas reseñas son positivas sobre la nueva fórmula, pero mencionan que el precio ha subido.',
        };
        setData(prev => ({
            ...prev,
            snapshots: [...prev.snapshots, newSnapshot]
        }));
        setActiveSnapshotId(newSnapshot.id);
    };
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'competitorProducts',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    const activeSnapshot = data.snapshots.find(s => s.id === activeSnapshotId);
    const competitorProductNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'competitorProducts' && n.entityId === data.id) : [];
    return (<div className="bg-slate-800 rounded-lg">
        <div className="p-4 sm:p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Producto Competidor' : `Análisis: ${initialData.name}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField_1.FormField label="Nombre Interno" htmlFor="name"><TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/></FormField_1.FormField>
                <FormField_1.FormField label="ASIN" htmlFor="asin"><TextInput_1.TextInput id="asin" name="asin" value={data.asin} onChange={handleInputChange}/></FormField_1.FormField>
                 <FormField_1.FormField label="Marca Competidora" htmlFor="competitorBrandId">
                    <Select_1.Select id="competitorBrandId" name="competitorBrandId" value={data.competitorBrandId || ''} onChange={handleInputChange}>
                        <option value="">Seleccionar marca</option>
                        {appData.competitorBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="País" htmlFor="countryId">
                    <CountrySelector_1.CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(p => ({ ...p, countryId: id }))}/>
                </FormField_1.FormField>
                <FormField_1.FormField label="Tipología de producto" htmlFor="typology">
                    <TextInput_1.TextInput id="typology" name="typology" value={data.typology || ''} onChange={handleInputChange} placeholder="Ej: Suplementos vitamínicos"/>
                </FormField_1.FormField>
                <FormField_1.FormField label="Compite con" htmlFor="competesWith">
                    <TextInput_1.TextInput id="competesWith" name="competesWith" value={data.competesWith || ''} onChange={handleInputChange} placeholder="Ej: Productos para el sueño"/>
                </FormField_1.FormField>
            </div>
             <div className="mt-8 flex justify-end space-x-4">
                {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Cambios</button>
            </div>
        </div>

      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg space-y-6">
        <CollapsibleSection_1.CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={competitorProductNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el producto para poder añadir notas.</p>)}
         </div>
      </CollapsibleSection_1.CollapsibleSection>
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-200">Snapshots de Contenido</h3>
                <button onClick={handleTakeSnapshot} className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                    <Icon_1.Icon name="camera-retro" className="mr-2"/>
                    Tomar Snapshot con IA
                </button>
            </div>
        
            {data.snapshots.length > 0 ? (<>
                    <div className="border-b border-slate-700 mb-4">
                        <nav className="flex space-x-4 -mb-px overflow-x-auto">
                            {data.snapshots.map(snap => (<button key={snap.id} onClick={() => setActiveSnapshotId(snap.id)} className={`py-2 px-3 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeSnapshotId === snap.id ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
                                    Snapshot {new Date(snap.createdAt).toLocaleDateString()}
                                </button>))}
                        </nav>
                    </div>
                    {activeSnapshot && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-slate-200 mb-2">Contenido Capturado</h4>
                                    <p className="text-sm text-slate-400"><strong>Título:</strong> {activeSnapshot.amazonTitle}</p>
                                    <p className="text-sm text-slate-400 mt-2"><strong>Descripción:</strong> {activeSnapshot.amazonDescription}</p>
                                    <ul className="text-sm text-slate-400 list-disc list-inside mt-2 space-y-1">
                                        <strong>Bulletpoints:</strong>
                                        {activeSnapshot.amazonBulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-slate-200 mb-2">Fotos del Competidor</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                    {activeSnapshot.amazonPhotos.map((photo, i) => (<img key={i} src={photo.url} alt={`Foto competidor ${i + 1}`} className="w-full h-auto object-cover rounded-md"/>))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <CollapsibleSection_1.CollapsibleSection title="Análisis IA: Título">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.titleAnalysis}</p>
                                </CollapsibleSection_1.CollapsibleSection>
                                <CollapsibleSection_1.CollapsibleSection title="Análisis IA: Descripción">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.descriptionAnalysis}</p>
                                </CollapsibleSection_1.CollapsibleSection>
                                <CollapsibleSection_1.CollapsibleSection title="Análisis IA: Contenido A+">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.aPlusAnalysis}</p>
                                </CollapsibleSection_1.CollapsibleSection>
                                <CollapsibleSection_1.CollapsibleSection title="Análisis IA: Infografías">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.infographicsAnalysis}</p>
                                </CollapsibleSection_1.CollapsibleSection>
                                <CollapsibleSection_1.CollapsibleSection title="Análisis IA: Reseñas">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.reviewsAnalysis}</p>
                                </CollapsibleSection_1.CollapsibleSection>
                            </div>
                        </div>)}
                </>) : (<div className="text-center p-12 text-slate-500">
                    <Icon_1.Icon name="folder-open" className="text-4xl mb-4"/>
                    <p>No hay snapshots para este producto.</p>
                </div>)}
        </div>
      </div>
    </div>);
};
exports.CompetitorProductDetailView = CompetitorProductDetailView;
