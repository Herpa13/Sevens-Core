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
exports.PublicationTemplateDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const DataTreeView_1 = require("../components/common/DataTreeView");
const Icon_1 = require("../components/common/Icon");
const FormulaEditorModal_1 = require("../components/modals/FormulaEditorModal");
const formulaService_1 = require("../services/formulaService");
const HelpModal_1 = require("../components/modals/HelpModal");
const lodash_es_1 = require("lodash-es");
const PresetSelector = ({ presets, onSelect, onCancel }) => (<div className="text-center p-12 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg">
        <h3 className="text-xl font-bold text-slate-200">Crear Nueva Plantilla</h3>
        <p className="text-slate-400 mt-2 mb-6">Empieza desde cero o usa un preset de plataforma para acelerar el proceso.</p>
        <div className="flex justify-center space-x-4">
            <button onClick={onCancel} // Effectively "start from scratch"
 className="px-6 py-3 bg-slate-700 text-slate-200 font-semibold rounded-md hover:bg-slate-600">
                <Icon_1.Icon name="file" className="mr-2"/>
                Empezar desde Cero
            </button>
            <Select_1.Select onChange={(e) => {
        const preset = presets.find(p => p.id === Number(e.target.value));
        if (preset)
            onSelect(preset);
    }} className="w-64">
                <option value="">O selecciona un Preset...</option>
                {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select_1.Select>
        </div>
    </div>);
const PublicationTemplateDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [editingField, setEditingField] = (0, react_1.useState)(null);
    const [isPresetSelectorVisible, setIsPresetSelectorVisible] = (0, react_1.useState)(initialData.id === 'new');
    const [isHelpModalOpen, setIsHelpModalOpen] = (0, react_1.useState)(false);
    const presetTemplates = appData.importExportTemplates.filter(p => p.isPreset);
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
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    const handleAddField = () => {
        const newField = {
            id: Date.now().toString(),
            columnHeader: `Nueva Columna ${data.fields.length + 1}`,
            mappingType: 'static',
            value: '',
        };
        setData(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    };
    const updateField = (fieldId, updatedField) => {
        setData(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updatedField } : f),
        }));
    };
    const removeField = (fieldId) => {
        setData(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== fieldId) }));
    };
    const handleSelectPreset = (preset) => {
        setData(prev => ({
            ...prev,
            name: `${preset.name} (Copia)`,
            entity: preset.entity,
            fields: preset.fields.map(f => ({ ...f, id: `${f.id}-${Date.now()}` })) // Ensure unique IDs
        }));
        setIsPresetSelectorVisible(false);
    };
    const handleDragStart = (e, fieldId) => {
        e.dataTransfer.setData('fieldId', fieldId);
    };
    const handleDrop = (e, targetFieldId) => {
        e.preventDefault();
        const draggedFieldId = e.dataTransfer.getData('fieldId');
        if (draggedFieldId && draggedFieldId !== targetFieldId) {
            const fields = [...data.fields];
            const draggedIndex = fields.findIndex(f => f.id === draggedFieldId);
            const targetIndex = fields.findIndex(f => f.id === targetFieldId);
            const [draggedItem] = fields.splice(draggedIndex, 1);
            fields.splice(targetIndex, 0, draggedItem);
            setData(prev => ({ ...prev, fields }));
        }
    };
    const handlePlaceholderDrop = (e, targetFieldId) => {
        e.preventDefault();
        e.stopPropagation();
        const placeholder = e.dataTransfer.getData('text/plain');
        if (placeholder) {
            updateField(targetFieldId, { mappingType: 'mapped', value: placeholder });
        }
    };
    const sampleItemContext = (0, react_1.useMemo)(() => {
        const item = appData[data.entity]?.[0];
        if (!item)
            return {};
        return { [data.entity.slice(0, -1)]: item, appData };
    }, [data.entity, appData]);
    const previewData = (0, react_1.useMemo)(() => {
        const items = appData[data.entity]?.slice(0, 5) || [];
        return items.map(item => {
            const row = {};
            data.fields.forEach(field => {
                const context = { [data.entity.slice(0, -1)]: item, appData };
                row[field.columnHeader] = (0, formulaService_1.resolveCellValue)(field, context);
            });
            return row;
        });
    }, [data, appData]);
    const handleDeleteClick = () => onDelete(data.id);
    return (<div className="bg-slate-800 rounded-lg">
        {editingField && (<FormulaEditorModal_1.FormulaEditorModal isOpen={!!editingField} onClose={() => setEditingField(null)} onSave={(newValue) => {
                updateField(editingField.id, { value: newValue, mappingType: 'formula' });
                setEditingField(null);
            }} initialValue={editingField.value} appData={appData}/>)}
        {isHelpModalOpen && <HelpModal_1.HelpModal onClose={() => setIsHelpModalOpen(false)}/>}

      <div className="p-4 sm:p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-200">Publication 2.0: Composer</h2>
                <p className="text-sm text-slate-400 mt-1">{data.id === 'new' ? 'Creando nueva plantilla' : `Editando: ${initialData.name}`}</p>
            </div>
            <button onClick={() => setIsHelpModalOpen(true)} className="p-2 text-slate-400 bg-slate-700/50 rounded-full hover:bg-slate-700 hover:text-cyan-400" title="Ayuda">
                <Icon_1.Icon name="question-circle"/>
            </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {isPresetSelectorVisible ? (<PresetSelector presets={presetTemplates} onSelect={handleSelectPreset} onCancel={() => setIsPresetSelectorVisible(false)}/>) : (<>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField_1.FormField label="Nombre de la Plantilla" htmlFor="name">
                    <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
                </FormField_1.FormField>
                <FormField_1.FormField label="Entidad Principal" htmlFor="entity">
                    <Select_1.Select id="entity" name="entity" value={data.entity} onChange={handleInputChange} disabled>
                    <option value="products">Productos</option>
                    <option value="batches">Lotes</option>
                    </Select_1.Select>
                </FormField_1.FormField>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <DataTreeView_1.DataTreeView data={{ [data.entity.slice(0, -1)]: appData[data.entity][0] }} onSelect={(path) => { }} title="Paleta de Datos"/>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-slate-300 mb-3">Lienzo de Publicación</h3>
                        <div className="space-y-2 border border-slate-700 p-2 rounded-lg bg-slate-900/50 min-h-[300px]">
                            {data.fields.map(field => (<DestinationField key={field.id} field={field} sampleContext={sampleItemContext} onUpdate={updateField} onRemove={removeField} onEditFormula={() => setEditingField(field)} onDragStart={handleDragStart} onDrop={handleDrop} onPlaceholderDrop={handlePlaceholderDrop}/>))}
                            {data.fields.length === 0 && <p className="text-center text-slate-500 p-8">Arrastra campos desde la paleta de datos o añade una columna para empezar.</p>}
                        </div>
                        <button onClick={handleAddField} className="mt-4 px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">
                            <Icon_1.Icon name="plus" className="mr-2"/> Añadir Columna
                        </button>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Previsualización en Tiempo Real (Primeros 5)</h3>
                    <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-700">
                        <table className="min-w-full text-xs">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    {data.fields.map(f => <th key={f.id} className="p-2 text-left font-semibold">{f.columnHeader}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, i) => (<tr key={i} className="border-b border-slate-700">
                                        {data.fields.map(f => {
                    const mobileMaxLength = f.validation?.mobileMaxLength;
                    const cellValue = row[f.columnHeader];
                    const displayValue = (mobileMaxLength && cellValue && cellValue.length > mobileMaxLength)
                        ? `${cellValue.substring(0, mobileMaxLength)}...`
                        : cellValue;
                    return (<td key={f.id} className="p-2 text-slate-400 align-top" title={cellValue}>
                                                    {displayValue}
                                                </td>);
                })}
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>)}
      </div>

      <div className="p-6 mt-4 border-t border-slate-700 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Plantilla</button>
      </div>
    </div>);
};
exports.PublicationTemplateDetailView = PublicationTemplateDetailView;
// Sub-component for each destination field
const DestinationField = ({ field, sampleContext, onUpdate, onRemove, onEditFormula, onDragStart, onDrop, onPlaceholderDrop }) => {
    const [isEditingHeader, setIsEditingHeader] = (0, react_1.useState)(false);
    const [headerValue, setHeaderValue] = (0, react_1.useState)(field.columnHeader);
    const [dragOver, setDragOver] = (0, react_1.useState)(false);
    const handleHeaderBlur = () => {
        onUpdate(field.id, { columnHeader: headerValue });
        setIsEditingHeader(false);
    };
    const handleHeaderKeyDown = (e) => {
        if (e.key === 'Enter')
            handleHeaderBlur();
        if (e.key === 'Escape') {
            setHeaderValue(field.columnHeader);
            setIsEditingHeader(false);
        }
    };
    const validationResult = (0, react_1.useMemo)(() => {
        if (!field.validation)
            return null;
        const value = (0, formulaService_1.resolveCellValue)(field, sampleContext);
        const { maxLength, mobileMaxLength, required } = field.validation;
        let messages = [];
        if (required && (value === null || value === undefined || value === '')) {
            messages.push({ type: 'error', text: 'Requerido' });
        }
        if (maxLength) {
            const isOver = value.length > maxLength;
            messages.push({ type: isOver ? 'error' : 'info', text: `${value.length}/${maxLength}` });
        }
        if (mobileMaxLength) {
            const isOverMobile = value.length > mobileMaxLength;
            messages.push({ type: isOverMobile ? 'warning' : 'info', text: `M:${value.length}/${mobileMaxLength}` });
        }
        // Suggestion
        const sourcePath = field.mappingType === 'mapped' && field.value.replace(/[{}]/g, '');
        if (sourcePath && maxLength && value.length > maxLength) {
            messages.push({ type: 'suggestion', text: `Usa TRUNCATE(${field.value}, ${maxLength})` });
        }
        return messages;
    }, [field, sampleContext]);
    return (<div draggable onDragStart={(e) => onDragStart(e, field.id)} onDrop={(e) => onDrop(e, field.id)} onDragOver={(e) => e.preventDefault()} className="flex items-start space-x-2 bg-slate-800 p-2 rounded-md border border-slate-700 cursor-grab active:cursor-grabbing">
            <Icon_1.Icon name="grip-vertical" className="text-slate-500 flex-shrink-0 mt-2"/>
            <div className="flex-grow">
                <div className="flex items-center">
                    {isEditingHeader ? (<TextInput_1.TextInput value={headerValue} onChange={e => setHeaderValue(e.target.value)} onBlur={handleHeaderBlur} onKeyDown={handleHeaderKeyDown} autoFocus className="!py-1 text-sm flex-grow"/>) : (<div className="flex items-center flex-grow" onDoubleClick={() => setIsEditingHeader(true)}>
                            <span className="font-semibold text-slate-200">{field.columnHeader}</span>
                            <Icon_1.Icon name="pencil-alt" className="w-3 ml-2 text-slate-500 opacity-50"/>
                        </div>)}
                </div>
                 <div onDrop={(e) => onPlaceholderDrop(e, field.id)} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} className={`mt-1 p-2 rounded-md text-sm transition-colors ${dragOver ? 'bg-cyan-500/10' : 'bg-slate-900/50'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                           <button onClick={() => onUpdate(field.id, { mappingType: 'mapped', value: '' })} title="Mapeado" className={field.mappingType === 'mapped' ? 'text-cyan-400' : 'text-slate-500'}><Icon_1.Icon name="link"/></button>
                           <button onClick={() => onUpdate(field.id, { mappingType: 'static', value: '' })} title="Estático" className={field.mappingType === 'static' ? 'text-cyan-400' : 'text-slate-500'}><Icon_1.Icon name="font"/></button>
                           <button onClick={onEditFormula} title="Fórmula" className={field.mappingType === 'formula' ? 'text-cyan-400' : 'text-slate-500'}><Icon_1.Icon name="calculator"/></button>
                        </div>
                         <button onClick={() => onRemove(field.id)} className="text-red-500/70 hover:text-red-500"><Icon_1.Icon name="trash-alt"/></button>
                    </div>
                    {field.mappingType !== 'formula' ? (<TextInput_1.TextInput value={field.value} onChange={e => onUpdate(field.id, { value: e.target.value })} placeholder={field.mappingType === 'mapped' ? 'Arrastra un campo aquí o escribe un placeholder...' :
                field.mappingType === 'static' ? 'Escribe un valor estático...' : ''} className="!py-1 text-xs w-full mt-1"/>) : (<div className="mt-1 p-2 text-xs font-mono bg-slate-800 rounded-md text-yellow-300 truncate" onClick={onEditFormula}>
                            {field.value}
                        </div>)}
                </div>
                 {validationResult && (<div className="mt-1 flex flex-wrap gap-2 text-xs">
                         {validationResult.map((msg, i) => (<span key={i} className={`px-2 py-0.5 rounded-full
                                ${msg.type === 'error' ? 'bg-red-500/20 text-red-300' : ''}
                                ${msg.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                                ${msg.type === 'info' ? 'bg-slate-600 text-slate-300' : ''}
                                ${msg.type === 'suggestion' ? 'bg-blue-500/20 text-blue-300' : ''}
                             `}>
                                {msg.text}
                            </span>))}
                     </div>)}
            </div>
        </div>);
};
