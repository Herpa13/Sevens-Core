// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback, useMemo, FC } from 'react';
// FIX: Correctly import Entity and EntityType from the types module
import type { Video, AppData, Product, EntityType, Entity } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { CountrySelector } from '../components/common/CountrySelector';
import { isEqual } from 'lodash-es';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { Icon } from '../components/common/Icon';

interface VideoDetailViewProps {
  initialData: Video;
  onSave: (data: Video) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  // FIX: Add setSaveHandler to props
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
}

const MiniFieldDisplay: FC<{ label: string; value: string | string[] | undefined }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    const textValue = Array.isArray(value) ? value.join('\n') : value;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textValue).catch(err => console.error("Failed to copy text:", err));
    };

    return (
        <div className="group relative py-1.5 border-b border-slate-600/50 last:border-b-0">
            <h5 className="text-xs font-bold uppercase text-slate-400 mb-1">{label}</h5>
            {Array.isArray(value) ? (
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {value.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            ) : (
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{value}</p>
            )}
            <button
                onClick={copyToClipboard}
                className="absolute top-1 right-0 text-cyan-400 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title={`Copiar ${label}`}
            >
                <Icon name="copy" />
            </button>
        </div>
    );
};

const LinkedProductInspector: FC<{
    product: Product | null;
    countryId: number | undefined;
    appData: AppData;
}> = ({ product, countryId, appData }) => {

    const regulatoryInfo = useMemo(() => {
        if (!product || !countryId || !product.composition) {
            return { claims: [], disclaimers: [] };
        }
    
        const allClaims = new Set<string>();
        const allDisclaimers = new Set<string>();
    
        product.composition.forEach(item => {
            const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
            const countryDetail = ingredient?.countryDetails.find(cd => cd.countryId === countryId);
            
            countryDetail?.permittedClaims.forEach(claim => allClaims.add(claim));
            countryDetail?.labelDisclaimers.forEach(disclaimer => allDisclaimers.add(disclaimer));
        });
    
        return { claims: Array.from(allClaims), disclaimers: Array.from(allDisclaimers) };
    }, [product, countryId, appData.ingredients]);

    if (!product) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t border-slate-600">
             <h3 className="text-base font-bold text-slate-200 mb-2">
                Resumen del Producto: <span className="text-cyan-400">{product.name}</span>
             </h3>
             <div className="space-y-1">
                <CollapsibleSection title="Mensaje Clave">
                    <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Público Objetivo" value={product.publicoObjetivo} />
                        <MiniFieldDisplay label="Key Selling Points" value={product.keySellingPoints} />
                        <MiniFieldDisplay label="Mini Narrativa" value={product.miniNarrativa} />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Contenido de Soporte">
                     <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Beneficios Genéricos" value={product.beneficiosGenericos} />
                        <MiniFieldDisplay label="Sugerencias de Uso" value={product.sugerenciasUso} />
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Regulatorio (Auto)">
                    <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Alegaciones Permitidas" value={regulatoryInfo.claims} />
                        <MiniFieldDisplay label="Advertencias de Etiqueta" value={regulatoryInfo.disclaimers} />
                    </div>
                </CollapsibleSection>
             </div>
        </div>
    );
}

export const VideoDetailView: React.FC<VideoDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler, onSelectItem }) => {
  const [data, setData] = useState<Video>(initialData);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
    if(onSuccess) onSuccess();
  }, [data, onSave]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
  };

  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);
  
  const associatedProduct = useMemo(() => {
      if (!data.productIds || data.productIds.length === 0) return null;
      // For simplicity, we'll show the inspector for the *first* associated product.
      return appData.products.find(p => p.id === data.productIds![0]) || null;
  }, [data.productIds, appData.products]);


  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Video' : `Editando: ${initialData.name}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nombre" htmlFor="name">
                <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
                </FormField>
                <FormField label="URL" htmlFor="url">
                <TextInput id="url" name="url" value={data.url} onChange={handleInputChange} />
                </FormField>
                <FormField label="Plataforma" htmlFor="platform">
                <TextInput id="platform" name="platform" value={data.platform} onChange={handleInputChange} placeholder="Ej: TikTok, Instagram, Amazon..."/>
                </FormField>
                <FormField label="Tipo" htmlFor="type">
                <Select id="type" name="type" value={data.type} onChange={handleInputChange}>
                    <option value="Producto">Producto</option>
                    <option value="Marca">Marca</option>
                    <option value="Testimonio">Testimonio</option>
                    <option value="Educativo">Educativo</option>
                </Select>
                </FormField>
                <FormField label="Duración (segundos)" htmlFor="duration">
                <TextInput type="number" id="duration" name="duration" value={data.duration} onChange={handleInputChange} />
                </FormField>
                <FormField label="País" htmlFor="countryId">
                    <CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(prev => ({...prev, countryId: id}))} />
                </FormField>
                <FormField label="Estado" htmlFor="status" className="md:col-span-2">
                    <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                        <option value="Planificado">Planificado</option>
                        <option value="Grabado">Grabado</option>
                        <option value="En Edición">En Edición</option>
                        <option value="Publicado">Publicado</option>
                        <option value="Archivado">Archivado</option>
                    </Select>
                </FormField>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
                {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
            </div>
        </div>
        <div className="lg:col-span-1">
            <div className="sticky top-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <LinkedProductInspector 
                  product={associatedProduct} 
                  countryId={data.countryId}
                  appData={appData}
                />
            </div>
        </div>
      </div>
    </div>
  );
};