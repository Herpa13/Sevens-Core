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
exports.MediaAssetDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const KeywordManager_1 = require("../components/common/KeywordManager");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const TabButton = ({ title, icon, isActive, onClick }) => (<button onClick={onClick} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
        ? 'border-cyan-500 text-cyan-400 bg-slate-900'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
        <Icon_1.Icon name={icon}/>
        <span>{title}</span>
    </button>);
const MediaAssetDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onSelectItem, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [activeTab, setActiveTab] = (0, react_1.useState)('details');
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
        const val = type === 'number' ? Number(value) : value;
        setData(prev => ({ ...prev, [name]: val }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    const usages = (0, react_1.useMemo)(() => {
        if (data.id === 'new')
            return [];
        return appData.videoProjects
            .filter(p => p.sequences.some(s => s.mediaAssetId === data.id))
            .map(p => ({ id: p.id, name: p.name }));
    }, [appData.videoProjects, data.id]);
    const DetailsTab = () => (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1 space-y-4">
            <FormField_1.FormField label="Nombre del Activo" htmlFor="name">
              <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Duración (s)" htmlFor="duration">
              <TextInput_1.TextInput type="number" id="duration" name="duration" value={data.duration} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="URL de Imagen de Partida" htmlFor="imageUrl">
              <TextInput_1.TextInput id="imageUrl" name="imageUrl" value={data.imageUrl} onChange={handleInputChange} placeholder="https://..."/>
            </FormField_1.FormField>
            <FormField_1.FormField label="URL del Vídeo Final" htmlFor="videoUrl">
              <TextInput_1.TextInput id="videoUrl" name="videoUrl" value={data.videoUrl} onChange={handleInputChange} placeholder="https://..."/>
            </FormField_1.FormField>
        </div>
         <div className="md:col-span-1 space-y-4">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Previsualización de Imagen</h4>
                <div className="w-full aspect-video bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                    {data.imageUrl ? <img src={data.imageUrl} alt="Previsualización de imagen" className="max-w-full max-h-full object-contain"/> : <Icon_1.Icon name="image" className="text-4xl text-slate-600"/>}
                </div>
            </div>
             <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Previsualización de Vídeo</h4>
                <div className="w-full aspect-video bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                    {data.videoUrl ? <video src={data.videoUrl} controls className="max-w-full max-h-full object-contain"/> : <Icon_1.Icon name="video" className="text-4xl text-slate-600"/>}
                </div>
            </div>
        </div>
         <FormField_1.FormField label="Descripción" htmlFor="description" className="md:col-span-2">
          <TextArea_1.TextArea id="description" name="description" value={data.description || ''} onChange={handleInputChange} rows={3}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Guion de Voz en Off Asociado" htmlFor="voiceoverScript" className="md:col-span-2">
          <TextArea_1.TextArea id="voiceoverScript" name="voiceoverScript" value={data.voiceoverScript || ''} onChange={handleInputChange} rows={3}/>
        </FormField_1.FormField>
         <FormField_1.FormField label="Etiquetas (Tags)" className="md:col-span-2">
            <KeywordManager_1.KeywordManager keywords={data.tags} onChange={tags => setData(prev => ({ ...prev, tags }))}/>
        </FormField_1.FormField>
      </div>);
    const UsageTab = () => (<div>
        {usages.length > 0 ? (<ul className="space-y-2">
                {usages.map(project => (<li key={project.id} onClick={() => onSelectItem('videoProjects', appData.videoProjects.find(p => p.id === project.id))} className="p-3 bg-slate-700/50 rounded-md border border-slate-700 hover:border-cyan-500 cursor-pointer flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{project.name}</span>
                        <Icon_1.Icon name="arrow-right" className="text-slate-400"/>
                    </li>))}
            </ul>) : (<div className="text-center p-12 text-slate-500">
                <Icon_1.Icon name="folder-open" className="text-4xl mb-4"/>
                <p>Este activo de medios aún no se ha utilizado en ningún proyecto.</p>
            </div>)}
      </div>);
    return (<div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Activo de Medios' : `Editando Activo: ${initialData.name}`}</h2>
        <div className="flex space-x-2">
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Activo</button>
        </div>
      </div>
      
      <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton title="Detalles del Activo" icon="file-alt" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')}/>
            <TabButton title={`Uso en Proyectos (${usages.length})`} icon="project-diagram" isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')}/>
        </nav>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
        {activeTab === 'details' && <DetailsTab />}
        {activeTab === 'usage' && <UsageTab />}
      </div>
    </div>);
};
exports.MediaAssetDetailView = MediaAssetDetailView;
