import React, { useState, useMemo, FC, useEffect, useCallback } from 'react';
// FIX: Import Entity and EntityType from their canonical source
import type { Etiqueta, AppData, Product, LabelContent, DocumentAttachment, Task, KnowledgeBaseUsage, LanguageCode, EtiquetaStatus, ProductNotification, LabelIngredient, Entity, EntityType, TranslationTerm, LabelIngredientTranslation } from '../types';
import { DEMO_LANGUAGES } from '../data/demoData';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { TextArea } from '../components/common/TextArea';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { FileUpload } from '../components/common/FileUpload';
import { Icon } from '../components/common/Icon';
import { ai } from '../services/geminiService';
import { DocumentManager } from '../components/common/DocumentManager';
import { AuditLogDisplay } from '../components/common/AuditLogDisplay';
import { KnowledgeBaseAssistantButton } from '../components/common/KnowledgeBaseAssistantButton';
import { isEqual } from 'lodash-es';
import { KeywordManager } from '../components/common/KeywordManager';


interface EtiquetaDetailViewProps {
  initialData: Etiqueta;
  onSave: (data: Etiqueta) => void;
  // FIX: The onDelete prop must accept `number | 'new'` to be compatible with the App component's handleDelete function.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onUsageAdd: (usage: Omit<KnowledgeBaseUsage, 'id' | 'userId' | 'usedAt'>) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onDuplicate: (id: number | 'new') => void;
  onEntitySave: (entityType: EntityType, data: Entity) => void;
}

const ETIQUETA_STATUSES: EtiquetaStatus[] = [
    'Pendiente enviar a imprenta',
    'Enviado a imprenta',
    'Aprobado en imprenta',
    'En el mercado',
    'Obsoleto'
];

const TabButton: React.FC<{ title: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ title, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
                ? 'border-cyan-500 text-cyan-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
    >
        <Icon name={icon} />
        <span>{title}</span>
    </button>
);

const StatusTracker: FC<{ currentStatus: EtiquetaStatus, onStatusChange: (status: EtiquetaStatus) => void }> = ({ currentStatus, onStatusChange }) => {
    const currentIndex = ETIQUETA_STATUSES.indexOf(currentStatus);
    
    return (
        <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-slate-300 mb-4">Ciclo de Estado de la Etiqueta</h4>
            <div className="flex items-center">
                {ETIQUETA_STATUSES.map((status, index) => (
                    <React.Fragment key={status}>
                        <div className="flex flex-col items-center text-center">
                            <button 
                                onClick={() => onStatusChange(status)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${index <= currentIndex ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-700 border-slate-600 hover:border-cyan-400'}`
                                }
                                title={`Cambiar a: ${status}`}
                            >
                                {index < currentIndex && <Icon name="check" className="text-white text-xs"/>}
                                {index === currentIndex && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                            </button>
                            <p className={`mt-2 text-xs w-24 ${index === currentIndex ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}>{status}</p>
                        </div>
                        {index < ETIQUETA_STATUSES.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 ${index < currentIndex ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const statusConfig: Record<ProductNotification['status'], { color: string; icon: string }> = {
    'Pendiente': { color: 'yellow', icon: 'hourglass-start' },
    'En proceso': { color: 'blue', icon: 'cogs' },
    'Notificado': { color: 'green', icon: 'check-circle' },
    'No necesario': { color: 'gray', icon: 'minus-circle' },
    'Espera de decision': { color: 'purple', icon: 'pause-circle' },
    'No Notificable': { color: 'gray', icon: 'ban' },
    'Pendiente nueva notificación': { color: 'yellow', icon: 'sync-alt' }
};

const colorVariants = {
    yellowBg: 'bg-yellow-500/10 text-yellow-300',
    blueBg: 'bg-blue-500/10 text-blue-300',
    greenBg: 'bg-green-500/10 text-green-300',
    grayBg: 'bg-slate-500/20 text-slate-400',
    purpleBg: 'bg-purple-500/10 text-purple-300',
};

const ProductNotificationStatusDisplay: FC<{ product: Product | undefined, appData: AppData }> = ({ product, appData }) => {
    if (!product) {
        return <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-sm text-slate-500">No hay un producto asociado.</div>;
    }
    
    const notificationsByCountry = appData.countries.map(country => {
        const notification = appData.productNotifications.find(n => n.productId === product.id && n.countryId === country.id);
        return {
            country,
            status: notification?.status || 'Pendiente'
        };
    });

    return (
        <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-slate-300 mb-3">Estado de Notificación Regulatoria del Producto: <span className="text-cyan-400">{product.name}</span></h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {notificationsByCountry.map(({ country, status }) => {
                    const config = statusConfig[status];
                    return (
                        <div key={country.id} className="flex items-center" title={`${country.name}: ${status}`}>
                            <img src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`} alt={country.name} className="w-5 h-auto mr-2 rounded-sm"/>
                            <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${colorVariants[(config.color + 'Bg') as keyof typeof colorVariants]}`}>
                                <Icon name={config.icon} className="mr-1.5" />
                                {status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- START TAB COMPONENTS ---

interface MainTabProps {
    data: Etiqueta;
    setData: React.Dispatch<React.SetStateAction<Etiqueta>>;
    appData: AppData;
    onUsageAdd: (usage: Omit<KnowledgeBaseUsage, 'id' | 'userId' | 'usedAt'>) => void;
    onEntitySave: (entityType: EntityType, data: Entity) => void;
}

const MainTab: FC<MainTabProps> = ({ data, setData, appData, onUsageAdd, onEntitySave }) => {
    const [activeLang, setActiveLang] = useState<LanguageCode>(DEMO_LANGUAGES[0].code);
    const [snapshotLang, setSnapshotLang] = useState<LanguageCode>('ES');
    const [isTranslating, setIsTranslating] = useState(false);
    const [expandedIngredientId, setExpandedIngredientId] = useState<number | null>(null);

    const selectedProduct = useMemo(() => {
        return appData.products.find(p => p.id === data.productId);
    }, [data.productId, appData.products]);

    const selectedEnvase = useMemo(() => {
        if (!selectedProduct || !selectedProduct.envaseId) return null;
        return appData.envases.find(e => e.id === selectedProduct.envaseId);
    }, [selectedProduct, appData.envases]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
        setData(prev => ({ ...prev, [name]: val }));
    };

    const handleContentChange = (lang: LanguageCode, field: keyof Omit<LabelContent, 'lang'>, value: any) => {
        setData(prev => {
            const existingContentIndex = prev.contentByLanguage.findIndex(c => c.lang === lang);
            let newContentByLanguage = [...prev.contentByLanguage];
    
            if (existingContentIndex > -1) {
                newContentByLanguage[existingContentIndex] = {
                    ...newContentByLanguage[existingContentIndex],
                    [field]: value
                };
            } else {
                const newContent: LabelContent = {
                    lang: lang,
                    productName: '',
                    [field]: value
                };
                newContentByLanguage.push(newContent);
            }
            
            return { ...prev, contentByLanguage: newContentByLanguage };
        });
    };
    
    const handleMainAttachmentChange = (file: File | null) => {
        if (file) {
          setData(prev => ({ ...prev, mainAttachment: { url: URL.createObjectURL(file), name: file.name } }));
        }
    };

    const activeLangContent = useMemo(() => {
        return data.contentByLanguage.find(c => c.lang === activeLang) || { lang: activeLang, productName: '' };
    }, [data.contentByLanguage, activeLang]);

    const handleFetchFromProduct = () => {
        if (!selectedProduct) {
            alert("Por favor, asocia un producto primero.");
            return;
        }

        const spanishContent: LabelContent = {
            lang: 'ES',
            productName: selectedProduct.name || '',
            contenido: selectedProduct.modoUso || '',
            alergenos: selectedProduct.alergenos || [],
        };

        handleContentChange('ES', 'productName', spanishContent.productName);
        handleContentChange('ES', 'contenido', spanishContent.contenido);
        handleContentChange('ES', 'alergenos', spanishContent.alergenos);
    };

    const handleTranslateAll = async () => {
        const spanishContent = data.contentByLanguage.find(c => c.lang === 'ES');
        if (!spanishContent) {
            alert("El contenido en Español debe existir para poder traducir.");
            return;
        }
        
        setIsTranslating(true);
        try {
            for (const lang of DEMO_LANGUAGES) {
                if (lang.code === 'ES') continue;

                const productNamePromise = ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Traduce a ${lang.name}: "${spanishContent.productName}"` });
                const contenidoPromise = ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Traduce a ${lang.name}: "${spanishContent.contenido}"` });
                const alergenosPromise = ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Traduce esta lista de alérgenos a ${lang.name}, devolviendo una lista separada por comas: "${(spanishContent.alergenos || []).join(', ')}"` });

                const [productNameRes, contenidoRes, alergenosRes] = await Promise.all([productNamePromise, contenidoPromise, alergenosPromise]);

                handleContentChange(lang.code, 'productName', productNameRes.text.trim());
                handleContentChange(lang.code, 'contenido', contenidoRes.text.trim());
                handleContentChange(lang.code, 'alergenos', alergenosRes.text.trim().split(',').map(s => s.trim()));
            }
        } catch (e) {
            console.error(e);
            alert("Ocurrió un error durante la traducción.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleGenerateSnapshot = () => {
        if (!selectedProduct || !selectedProduct.composition) {
            alert("El producto asociado no tiene una composición definida.");
            return;
        }

        const snapshot: LabelIngredient[] = selectedProduct.composition.map(item => {
            const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
            if (!ingredient) return null;

            const translations: LabelIngredientTranslation[] = DEMO_LANGUAGES.map(lang => {
                const country = appData.countries.find(c => c.iso === lang.code);
                const countryDetail = ingredient.countryDetails.find(cd => cd.countryId === country?.id);
                const vrnDetail = item.vrnPercentages.find(vp => vp.countryId === country?.id);
                
                return {
                    lang: lang.code,
                    name: countryDetail?.name || ingredient.latinName,
                    vrn: vrnDetail?.value ? `${vrnDetail.value}%` : '-',
                    permittedClaims: countryDetail?.permittedClaims || [],
                    labelDisclaimers: countryDetail?.labelDisclaimers || [],
                };
            });

            return {
                ingredientId: item.ingredientId,
                quantity: item.quantity,
                measureUnit: ingredient.measureUnit,
                translations
            };
        }).filter((item): item is LabelIngredient => item !== null);

        setData(prev => ({...prev, ingredientSnapshot: snapshot}));
        alert("Snapshot de composición generado con éxito.");
    };

    return (
        <>
             <div className="space-y-4 mb-6">
                <StatusTracker currentStatus={data.status} onStatusChange={(status) => setData(prev => ({...prev, status}))} />
                <ProductNotificationStatusDisplay product={selectedProduct} appData={appData} />
            </div>
            
            <CollapsibleSection title="Información General" defaultOpen>
                <div className="p-4">
                    {data.id === 'new' && (
                        <div className="bg-slate-800/60 p-3 rounded-lg border-slate-700 mb-6">
                            <FormField label="Tipo de Creación">
                                <div className="flex space-x-4">
                                    <label className="flex items-center text-slate-300">
                                        <input type="radio" name="creationType" value="Etiqueta 0" checked={data.creationType === 'Etiqueta 0'} onChange={handleInputChange} className="mr-2 h-4 w-4 bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"/> Etiqueta Inicial (Etiqueta 0)
                                    </label>
                                    <label className="flex items-center text-slate-300">
                                        <input type="radio" name="creationType" value="Remplazo" checked={data.creationType === 'Remplazo'} onChange={handleInputChange} className="mr-2 h-4 w-4 bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"/> Remplazo de Etiqueta Existente
                                    </label>
                                </div>
                            </FormField>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <FormField label="Identificador" htmlFor="identifier">
                        <TextInput id="identifier" name="identifier" value={data.identifier} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Producto Asociado" htmlFor="productId">
                        <Select id="productId" name="productId" value={data.productId || ''} onChange={handleInputChange}>
                            <option value="">Seleccionar producto</option>
                            {appData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Select>
                        </FormField>
                         <FormField label="Número de Lote (Opcional)" htmlFor="batchNumber">
                            <TextInput id="batchNumber" name="batchNumber" value={data.batchNumber || ''} onChange={handleInputChange} />
                        </FormField>
                    </div>

                     {selectedProduct && (
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-slate-800/60 border border-slate-700 rounded-lg">
                            {selectedEnvase && (
                                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                                    <h4 className="font-bold text-slate-200 mb-2">Envase Asociado</h4>
                                    <div className="flex items-start space-x-4">
                                        {selectedEnvase.fotoUrl && (
                                            <img src={selectedEnvase.fotoUrl} alt={selectedEnvase.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                                        )}
                                        <div className="flex-grow">
                                            <h5 className="font-semibold text-slate-300">{selectedEnvase.name}</h5>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
                                                <div><strong>Tipo:</strong> {selectedEnvase.tipo || 'N/A'}</div>
                                                <div><strong>Medidas:</strong> {selectedEnvase.height || 'N/A'}cm x {selectedEnvase.width || 'N/A'}cm x {selectedEnvase.length || 'N/A'}cm</div>
                                                <div><strong>Peso:</strong> {selectedEnvase.peso ? `${selectedEnvase.peso}g` : 'N/A'}</div>
                                                <div><strong>Capacidad:</strong> {selectedEnvase.capacidad || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                                <h4 className="font-bold text-slate-200 mb-2">Datos Clave Producto</h4>
                                <p className="text-sm text-slate-400"><strong>Peso Neto (Etiqueta):</strong> {selectedProduct.pesoNetoEtiqueta || 'N/A'}</p>
                                <p className="text-sm text-slate-400"><strong>Dosis Diaria Rec.:</strong> {selectedProduct.recommendedDailyDose || 'N/A'}</p>
                                <p className="text-sm text-slate-400"><strong>Conservación:</strong> {selectedProduct.conservacion || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Archivos de Diseño">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Arte Final Principal (PDF)">
                        {data.mainAttachment ? (
                             <div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                <a href={data.mainAttachment.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{data.mainAttachment.name}</a>
                                <button onClick={() => setData(p => ({...p, mainAttachment: undefined}))} className="text-red-400 hover:text-red-300"><Icon name="trash" /></button>
                            </div>
                        ) : <FileUpload onFileSelect={handleMainAttachmentChange} accept=".pdf"/>}
                    </FormField>
                </div>
                 <div className="p-4 border-t border-slate-700">
                     <DocumentManager
                        documents={data.additionalAttachments || []}
                        onDocumentsChange={(docs) => setData(prev => ({...prev, additionalAttachments: docs}))}
                        title="Archivos Adicionales"
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Contenido Multilenguaje de la Etiqueta">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="border-b border-slate-700">
                            <nav className="-mb-px flex space-x-4">
                                {DEMO_LANGUAGES.map(lang => (
                                    <button key={lang.code} onClick={() => setActiveLang(lang.code)}
                                        className={`py-2 px-3 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeLang === lang.code ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
                                        {lang.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="flex space-x-2">
                             <button onClick={handleFetchFromProduct} className="px-3 py-1.5 text-sm bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600">
                                <Icon name="download" className="mr-2"/> Traer desde Producto (ES)
                            </button>
                            <button onClick={handleTranslateAll} disabled={isTranslating} className="px-3 py-1.5 text-sm bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50">
                                <Icon name={isTranslating ? 'spinner' : 'language'} className={`mr-2 ${isTranslating ? 'fa-spin' : ''}`}/> {isTranslating ? 'Traduciendo...' : 'Traducir a Todos'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                         <FormField label="Nombre del Producto en Etiqueta">
                            <TextInput value={activeLangContent.productName} onChange={e => handleContentChange(activeLang, 'productName', e.target.value)} />
                        </FormField>
                        <FormField label="Contenido (Modo de uso, advertencias, etc.)">
                            <div className="relative">
                                <TextArea value={activeLangContent.contenido || ''} onChange={e => handleContentChange(activeLang, 'contenido', e.target.value)} rows={6} />
                                <div className="absolute top-2 right-2">
                                    <KnowledgeBaseAssistantButton appData={appData} onInsert={(text, entry) => {
                                        handleContentChange(activeLang, 'contenido', (activeLangContent.contenido || '') + '\n' + text);
                                        onUsageAdd({ entryId: entry.parentId || entry.id as number, entryVersion: entry.version, entityType: 'etiquetas', entityId: data.id as number });
                                    }}/>
                                </div>
                            </div>
                        </FormField>
                        <FormField label="Alérgenos">
                            <KeywordManager keywords={activeLangContent.alergenos || []} onChange={k => handleContentChange(activeLang, 'alergenos', k)} />
                        </FormField>
                    </div>
                </div>
            </CollapsibleSection>

             <CollapsibleSection title="Composición Congelada (Snapshot)">
                <div className="p-4">
                    <div className="flex justify-end items-center mb-4 space-x-2">
                        <Select value={snapshotLang} onChange={e => setSnapshotLang(e.target.value as LanguageCode)} className="w-48">
                            {DEMO_LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </Select>
                        <button onClick={handleGenerateSnapshot} className="px-4 py-2 bg-yellow-500 text-slate-900 font-semibold rounded-md hover:bg-yellow-600">
                            <Icon name="camera" className="mr-2"/> Generar / Actualizar Snapshot
                        </button>
                    </div>
                    {data.ingredientSnapshot.length > 0 ? (
                        <table className="min-w-full text-sm">
                            <thead className="border-b-2 border-slate-700">
                                <tr>
                                    <th className="p-2 text-left"></th>
                                    <th className="p-2 text-left">Ingrediente (Latín)</th>
                                    <th className="p-2 text-left">Cantidad</th>
                                    <th className="p-2 text-left">Nombre ({snapshotLang})</th>
                                    <th className="p-2 text-left">VRN % ({snapshotLang})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.ingredientSnapshot.map(item => {
                                    const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
                                    const translation = item.translations.find(t => t.lang === snapshotLang);
                                    const isExpanded = expandedIngredientId === item.ingredientId;
                                    return (
                                        <React.Fragment key={item.ingredientId}>
                                            <tr onClick={() => setExpandedIngredientId(isExpanded ? null : item.ingredientId)} className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer">
                                                <td className="p-2 text-center"><Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} className="text-slate-500"/></td>
                                                <td className="p-2 font-semibold text-slate-300">{ingredient?.latinName}</td>
                                                <td className="p-2">{item.quantity} {item.measureUnit}</td>
                                                <td className="p-2">{translation?.name}</td>
                                                <td className="p-2 font-mono">{translation?.vrn}</td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-slate-800/50">
                                                    <td colSpan={5} className="p-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h5 className="font-semibold text-xs text-slate-400 mb-1">Alegaciones Permitidas ({snapshotLang})</h5>
                                                                {(translation?.permittedClaims?.length || 0) > 0 ? (
                                                                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                                                                        {translation?.permittedClaims.map(claim => <li key={claim}>{claim}</li>)}
                                                                    </ul>
                                                                ) : <p className="text-slate-500 italic text-xs">Ninguna.</p>}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-xs text-slate-400 mb-1">Advertencias de Etiqueta ({snapshotLang})</h5>
                                                                {(translation?.labelDisclaimers?.length || 0) > 0 ? (
                                                                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                                                                        {translation?.labelDisclaimers.map(disclaimer => <li key={disclaimer}>{disclaimer}</li>)}
                                                                    </ul>
                                                                ) : <p className="text-slate-500 italic text-xs">Ninguna.</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No se ha generado ningún snapshot de composición.</p>
                    )}
                </div>
            </CollapsibleSection>
        </>
    );
};

const HistoryTab: FC<{ data: Etiqueta, appData: AppData }> = ({ data, appData }) => {
    if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda la etiqueta para ver su historial.</div>;
    }
    const logs = appData.logs
        .filter(l => l.entityType === 'etiquetas' && l.entityId === data.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return <AuditLogDisplay logs={logs} />;
};


export const EtiquetaDetailView: FC<EtiquetaDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onSelectItem, onUsageAdd, setIsDirty, setSaveHandler, onDuplicate, onEntitySave }) => {
    const [data, setData] = useState<Etiqueta>(initialData);
    const [activeTab, setActiveTab] = useState('main');

    const handleSaveClick = useCallback((onSuccess?: () => void) => {
        onSave(data);
        if (onSuccess) {
            onSuccess();
        }
    }, [data, onSave]);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        setIsDirty(!isEqual(initialData, data));
    }, [data, initialData, setIsDirty]);

    useEffect(() => {
        setSaveHandler(() => handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);

    const handleDeleteClick = () => {
        onDelete(data.id);
    };
    
    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nueva Etiqueta' : `Editando: ${initialData.identifier}`}</h2>
                <div className="flex space-x-2">
                    {data.id !== 'new' && (
                        <button onClick={() => onDuplicate(data.id)} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 font-semibold">Duplicar</button>
                    )}
                    {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                    <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
                </div>
            </div>

            <div className="border-b border-slate-700 bg-slate-800 px-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')} />
                    <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </nav>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
                {activeTab === 'main' && <MainTab data={data} setData={setData} appData={appData} onUsageAdd={onUsageAdd} onEntitySave={onEntitySave} />}
                {activeTab === 'history' && <HistoryTab data={data} appData={appData} />}
            </div>
        </div>
    );
};
