import React, { useState, FC, useMemo, useCallback, useEffect } from 'react';
// FIX: Correctly import Entity and EntityType from the types module
import type { Product, AppData, AmazonContent, ShopifyContent, AmazonInfographic, AmazonVideo, ProductCompositionItem, Note, NoteAttachment, AmazonBulletPoint, AmazonAttributes, AmazonAttributeUnitLength, AmazonAttributeUnitWeight, AmazonAttributeAgeRange, AmazonAttributeContainerType, AmazonAttributeDietType, AmazonAttributeDoseReleaseMethod, AmazonAttributeExpiryType, AmazonAttributeFulfillmentCenterShelfLifeUnit, AmazonAttributeGender, AmazonAttributeItemForm, AmazonAttributeMaterialFeature, AmazonAttributePillCoating, AmazonAttributeServingUnit, AmazonAttributeSupplementFormulation, AmazonAttributeUnitCountType, AmazonAttributeComplianceStatus, NoteEntityType, Layer2Content, Task, ShopifyFAQ, ShopifyPost, AmazonContentVersion, User, Country, Envase, AmazonUnversionedContent, Etiqueta, EtiquetaStatus, AmazonAttributeStorageTemperature, Entity, EntityType, AmazonContentPlanningStatus, AmazonContentPlanningItem, PublicationPlanning } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { KeywordManager } from '../components/common/KeywordManager';
import { CountrySelector } from '../components/common/CountrySelector';
import { NotesSection } from '../components/common/NotesSection';
import { Icon } from '../components/common/Icon';
import { FileUpload } from '../components/common/FileUpload';
import { ai } from '../services/geminiService';
import { Layer2ContentTab } from './Layer2ContentTab';
import { AuditLogDisplay } from '../components/common/AuditLogDisplay';
import { AIAssistantButton } from '../components/common/AIAssistantButton';
import { CharacterCountTextInput } from '../components/common/CharacterCountTextInput';
import { HighlightingTextArea } from '../components/common/HighlightingTextArea';
import { isEqual } from 'lodash-es';
import { MultiSelect } from '../components/common/MultiSelect';
import { SaveVersionModal } from '../components/modals/SaveVersionModal';

// FIX: Added missing properties to the interface to match component usage.
interface ProductDetailViewProps {
  initialData: Product;
  onSave: (data: Product) => void;
  // FIX: In ProductDetailViewProps, updated the `onDelete` prop to accept `number | 'new'` to match the type of the entity ID, resolving a type mismatch where it was being called in App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onDuplicateEtiqueta: (id: number | 'new') => void;
  sidebarCollapsed: boolean;
  isDirty: boolean;
}

// Simple word-based diff implementation
const simpleDiff = (oldText: string = '', newText: string = '') => {
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    const dp = Array(oldWords.length + 1).fill(null).map(() => Array(newWords.length + 1).fill(0));

    for (let i = 1; i <= oldWords.length; i++) {
        for (let j = 1; j <= newWords.length; j++) {
            if (oldWords[i - 1] === newWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const result = [];
    let i = oldWords.length, j = newWords.length;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
            result.unshift({ text: oldWords[i - 1], type: 'equal' });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({ text: newWords[j - 1], type: 'added' });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            result.unshift({ text: oldWords[i - 1], type: 'removed' });
            i--;
        } else {
            break;
        }
    }
    return result;
};

const DiffViewer: React.FC<{ oldText?: string; newText?: string }> = ({ oldText = '', newText = '' }) => {
    const diffs = useMemo(() => simpleDiff(oldText, newText), [oldText, newText]);
    return (
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {diffs.map((diff, i) => (
                <span key={i} className={
                    diff.type === 'added' ? 'bg-green-500/30' : 
                    diff.type === 'removed' ? 'bg-red-500/30 line-through' : ''
                }>
                    {diff.text}
                </span>
            ))}
        </p>
    );
};

const InfographicDiffViewer: React.FC<{ oldInfographics?: AmazonInfographic[], newInfographics?: AmazonInfographic[] }> = ({ oldInfographics = [], newInfographics = [] }) => {
    const maxLength = Math.max(oldInfographics.length, newInfographics.length);

    if (oldInfographics.length === 0 && newInfographics.length === 0) {
        return <p className="text-sm text-slate-500">Sin infografías en ninguna versión.</p>;
    }

    return (
        <div className="space-y-4">
            {Array.from({ length: maxLength }).map((_, i) => {
                const oldInfo = oldInfographics[i];
                const newInfo = newInfographics[i];

                if (!oldInfo && newInfo) { // Added
                    return (
                        <div key={i} className="bg-green-500/10 p-2 rounded border border-green-500/30">
                            <h5 className="font-semibold text-sm text-green-300">Infografía #{i+1} Añadida</h5>
                            <div className="mt-2 text-xs space-y-1">
                                <div><strong>URL:</strong> <span className="text-slate-300">{newInfo.imageUrl}</span></div>
                                <div><strong>Comentario:</strong> <span className="text-slate-300">{newInfo.comment}</span></div>
                            </div>
                        </div>
                    );
                }

                if (oldInfo && !newInfo) { // Removed
                     return (
                        <div key={i} className="bg-red-500/10 p-2 rounded border border-red-500/30">
                            <h5 className="font-semibold text-sm text-red-300">Infografía #{i+1} Eliminada</h5>
                            <div className="mt-2 text-xs space-y-1">
                                <div><strong>URL:</strong> <span className="text-slate-300">{oldInfo.imageUrl}</span></div>
                                <div><strong>Comentario:</strong> <span className="text-slate-300">{oldInfo.comment}</span></div>
                            </div>
                        </div>
                    );
                }
                
                if (oldInfo && newInfo && !isEqual(oldInfo, newInfo)) { // Modified
                    return (
                        <div key={i} className="bg-yellow-500/10 p-2 rounded border border-yellow-500/30">
                             <h5 className="font-semibold text-sm text-yellow-300">Infografía #{i+1} Modificada</h5>
                             <div className="mt-2 text-xs space-y-2">
                                 {oldInfo.imageUrl !== newInfo.imageUrl && <div><strong>URL:</strong> <DiffViewer oldText={oldInfo.imageUrl} newText={newInfo.imageUrl} /></div>}
                                 {oldInfo.comment !== newInfo.comment && <div><strong>Comentario:</strong> <DiffViewer oldText={oldInfo.comment} newText={newInfo.comment} /></div>}
                                 {oldInfo.cosmoAnalysis !== newInfo.cosmoAnalysis && <div><strong>Análisis Cosmo:</strong> <DiffViewer oldText={oldInfo.cosmoAnalysis} newText={newInfo.cosmoAnalysis} /></div>}
                                 {oldInfo.referenceImageUrl !== newInfo.referenceImageUrl && <div><strong>URL Ref:</strong> <DiffViewer oldText={oldInfo.referenceImageUrl} newText={newInfo.referenceImageUrl} /></div>}
                             </div>
                        </div>
                    );
                }

                return null; // Unchanged or invalid state
            })}
        </div>
    );
};


const TabButton: FC<{ title: string; icon: string; isActive: boolean; onClick: () => void; className?: string; }> = ({ title, icon, isActive, onClick, className }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
                ? 'border-cyan-500 text-cyan-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
    >
        <Icon name={icon} className={className} />
        <span>{title}</span>
    </button>
);

const KeywordStatusIcon: FC<{ status: 'safe' | 'risk' | 'missing' }> = ({ status }) => {
    const config = {
        safe: { icon: 'check-circle', color: 'text-green-400', label: 'Segura (Visible en móvil)' },
        risk: { icon: 'exclamation-triangle', color: 'text-yellow-400', label: 'En Riesgo (No visible en móvil)' },
        missing: { icon: 'times-circle', color: 'text-red-400', label: 'Ausente en el título' }
    };
    const { icon, color, label } = config[status];
    return <Icon name={icon} className={`w-4 ${color}`} title={label} />;
};

// --- START TAB COMPONENTS ---

interface AmazonTabProps {
    data: Product;
    setData: React.Dispatch<React.SetStateAction<Product>>;
    appData: AppData;
    currentUser: User;
}

const KeywordDiffViewer: React.FC<{ oldKeywords: string[], newKeywords: string[] }> = ({ oldKeywords = [], newKeywords = [] }) => {
    const added = newKeywords.filter(k => !oldKeywords.includes(k));
    const removed = oldKeywords.filter(k => !newKeywords.includes(k));

    if (added.length === 0 && removed.length === 0) {
        return <p className="text-sm text-slate-500">Sin cambios.</p>;
    }

    return (
        <div className="text-sm space-y-1">
            {added.map(k => <div key={k} className="bg-green-500/20 p-1 rounded">+ {k}</div>)}
            {removed.map(k => <div key={k} className="bg-red-500/20 p-1 rounded line-through">- {k}</div>)}
        </div>
    );
};

const AmazonTab: FC<AmazonTabProps> = ({ data, setData, appData, currentUser }) => {
    const [amazonCountryId, setAmazonCountryId] = useState<number | undefined>(appData.countries[0]?.id as number);
    const [highlightedKeyword, setHighlightedKeyword] = useState('');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyDiff, setHistoryDiff] = useState<{ oldVersion?: AmazonContentVersion, newVersion: AmazonContentVersion } | null>(null);
    
    const activeCountryContent = useMemo(() => 
        data.amazonContents.find(c => c.countryId === amazonCountryId),
    [data.amazonContents, amazonCountryId]);

    const activeVersion = useMemo(() => 
        activeCountryContent?.versions.find(v => v.versionId === activeCountryContent.currentVersionId),
    [activeCountryContent]);

    const keywordAnalysis = useMemo(() => {
        if (!activeVersion) return { searchTerms: [], backendKeywords: [], atRiskKeywords: [] };

        const { title, description, bulletPoints, searchTerms } = activeVersion.content;
        const bulletsText = (bulletPoints || []).map(b => b.text).join(' ').toLowerCase();
        const titleLower = title.toLowerCase();

        const countOccurrences = (text: string, keyword: string) => {
            if (!text || !keyword) return 0;
            return text.toLowerCase().split(keyword.toLowerCase()).length - 1;
        };

        const analyzeKeywords = (keywords: string[]) => {
            return (keywords || []).map(kw => {
                if (!kw) return null;
                const kwLower = kw.toLowerCase();
                const isInTitle = titleLower.includes(kwLower);
                let status: 'safe' | 'risk' | 'missing' = 'missing';

                if (isInTitle) {
                    const position = titleLower.indexOf(kwLower);
                    status = (position + kwLower.length) <= 80 ? 'safe' : 'risk';
                }

                const titleCount = countOccurrences(title, kw);
                const descCount = countOccurrences(description, kw);
                const bulletsCount = countOccurrences(bulletsText, kw);

                return {
                    name: kw,
                    status,
                    total: titleCount + descCount + bulletsCount,
                    title: titleCount,
                    desc: descCount,
                    bullets: bulletsCount,
                };
            }).filter((item): item is NonNullable<typeof item> => item !== null);
        };
        
        return {
            searchTerms: analyzeKeywords(searchTerms),
            backendKeywords: analyzeKeywords(activeVersion.content.backendKeywords || []),
        };

    }, [activeVersion]);
    
    const updateAmazonContent = (updates: Partial<AmazonContentVersion['content']>) => {
        setData(prev => {
            const newAmazonContents = [...prev.amazonContents];
            let countryContentIndex = newAmazonContents.findIndex(c => c.countryId === amazonCountryId);
    
            if (countryContentIndex === -1) {
                const newVersionId = Date.now();
                const newCountryContent: AmazonContent = {
                    countryId: amazonCountryId as number,
                    currentVersionId: newVersionId,
                    versions: [{
                        versionId: newVersionId,
                        createdAt: new Date().toISOString(),
                        authorName: currentUser.name,
                        changeReason: 'Creación inicial',
                        content: { title: '', description: '', bulletPoints: Array(5).fill({ text: '', associatedBenefits: [] }), searchTerms: [], backendKeywords: [], infographics: [], ...updates }
                    }],
                    unversionedContent: { amazonVideos: [], amazonBenefits: [] },
                };
                newAmazonContents.push(newCountryContent);
                countryContentIndex = newAmazonContents.length - 1;
            }
            
            const countryContent = newAmazonContents[countryContentIndex];
            let currentVersion = countryContent.versions.find(v => v.versionId === countryContent.currentVersionId);
            
            if (currentVersion) {
                const updatedVersion = { ...currentVersion, content: { ...currentVersion.content, ...updates } };
                const updatedVersions = countryContent.versions.map(v => v.versionId === countryContent.currentVersionId ? updatedVersion : v);
                newAmazonContents[countryContentIndex] = { ...countryContent, versions: updatedVersions };
            } else { // Should not happen with the logic above, but as a safeguard
                const newVersionId = Date.now();
                const newVersion: AmazonContentVersion = {
                    versionId: newVersionId,
                    createdAt: new Date().toISOString(),
                    authorName: currentUser.name,
                    changeReason: 'Creación inicial',
                    content: { title: '', description: '', bulletPoints: Array(5).fill({ text: '', associatedBenefits: [] }), searchTerms: [], backendKeywords: [], infographics: [], ...updates },
                };
                newAmazonContents[countryContentIndex] = { ...countryContent, versions: [...countryContent.versions, newVersion], currentVersionId: newVersionId };
            }
            
            return { ...prev, amazonContents: newAmazonContents };
        });
    };

    const handleAddInfographic = () => {
        const currentInfographics = activeVersion?.content.infographics || [];
        const newInfographic: AmazonInfographic = { imageUrl: '', comment: '', cosmoAnalysis: '', referenceImageUrl: '' };
        updateAmazonContent({ infographics: [...currentInfographics, newInfographic] });
    };

    const handleInfographicChange = (index: number, field: keyof AmazonInfographic, value: string) => {
        const currentInfographics = [...(activeVersion?.content.infographics || [])];
        if(!currentInfographics[index]) { // Ensure infographic exists if we're starting from scratch
             while (currentInfographics.length <= index) {
                currentInfographics.push({ imageUrl: '', comment: '', cosmoAnalysis: '', referenceImageUrl: '' });
            }
        }
        currentInfographics[index] = { ...currentInfographics[index], [field]: value };
        updateAmazonContent({ infographics: currentInfographics });
    };

    const handleRemoveInfographic = (index: number) => {
        const currentInfographics = (activeVersion?.content.infographics || []).filter((_, i) => i !== index);
        updateAmazonContent({ infographics: currentInfographics });
    };
    
    const handleShowHistory = (version: AmazonContentVersion) => {
        if (!activeCountryContent) return;
        const versions = activeCountryContent.versions.sort((a,b) => b.versionId - a.versionId);
        const currentIndex = versions.findIndex(v => v.versionId === version.versionId);
        const previousVersion = versions[currentIndex + 1];
        setHistoryDiff({ oldVersion: previousVersion, newVersion: version });
        setIsHistoryModalOpen(true);
    };

    const handleRestoreVersion = (versionToRestore: AmazonContentVersion) => {
        if (!activeCountryContent) return;
        
        if (!window.confirm(`¿Estás seguro de que quieres cargar el contenido de la versión del ${new Date(versionToRestore.createdAt).toLocaleDateString()} en los editores? Deberás guardar los cambios para crear una nueva versión con este contenido.`)) {
            return;
        }

        updateAmazonContent(versionToRestore.content);
    };

    const KeywordAnalysisTable: FC<{ title: string; analysis: any[]; onHover: (kw: string) => void; onLeave: () => void }> = ({ title, analysis, onHover, onLeave }) => (
        <div>
            <h4 className="font-semibold text-slate-300 mb-2">{title}</h4>
            <div className="overflow-x-auto max-h-60">
                <table className="min-w-full text-xs">
                    <thead className="bg-slate-700/50 sticky top-0">
                        <tr><th className="p-1.5 text-left">Título</th><th className="p-1.5 text-left">Keyword</th><th className="p-1.5 text-left">Total</th><th className="p-1.5 text-left">Tít.</th><th className="p-1.5 text-left">Desc.</th><th className="p-1.5 text-left">B.P.</th></tr>
                    </thead>
                    <tbody>
                        {analysis.map(kw => (
                            <tr key={kw.name} onMouseEnter={() => onHover(kw.name)} onMouseLeave={onLeave} className="border-b border-slate-700/50">
                                <td className="p-1.5 text-center"><KeywordStatusIcon status={kw.status} /></td>
                                <td className="p-1.5 font-medium text-slate-300">{kw.name}</td>
                                <td className="p-1.5">{kw.total}</td><td className="p-1.5">{kw.title}</td><td className="p-1.5">{kw.desc}</td><td className="p-1.5">{kw.bullets}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {isHistoryModalOpen && historyDiff && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                     <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl border border-slate-700 max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-200">Comparando Versiones</h3>
                                <p className="text-xs text-slate-400">{historyDiff.newVersion.authorName} - {new Date(historyDiff.newVersion.createdAt).toLocaleString()} - Razón: {historyDiff.newVersion.changeReason}</p>
                            </div>
                            <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <CollapsibleSection title="Título" defaultOpen><DiffViewer oldText={historyDiff.oldVersion?.content.title} newText={historyDiff.newVersion.content.title} /></CollapsibleSection>
                             <CollapsibleSection title="Descripción" defaultOpen><DiffViewer oldText={historyDiff.oldVersion?.content.description} newText={historyDiff.newVersion.content.description} /></CollapsibleSection>
                             <CollapsibleSection title="Bullet Points" defaultOpen>
                                <div className="space-y-2">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <div key={i}>
                                            <h4 className="font-semibold text-xs text-slate-400 mb-1">Bullet Point {i+1}</h4>
                                            <DiffViewer oldText={historyDiff.oldVersion?.content.bulletPoints?.[i]?.text} newText={historyDiff.newVersion.content.bulletPoints?.[i]?.text} />
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>
                             <CollapsibleSection title="Términos de Búsqueda" defaultOpen>
                                <DiffViewer 
                                    oldText={(historyDiff.oldVersion?.content.searchTerms || []).join(', ')}
                                    newText={(historyDiff.newVersion.content.searchTerms || []).join(', ')}
                                />
                            </CollapsibleSection>
                             <CollapsibleSection title="Backend Keywords" defaultOpen>
                                <DiffViewer 
                                    oldText={(historyDiff.oldVersion?.content.backendKeywords || []).join(', ')}
                                    newText={(historyDiff.newVersion.content.backendKeywords || []).join(', ')}
                                />
                            </CollapsibleSection>
                             <CollapsibleSection title="Infografías" defaultOpen>
                                <InfographicDiffViewer 
                                    oldInfographics={historyDiff.oldVersion?.content.infographics} 
                                    newInfographics={historyDiff.newVersion.content.infographics} 
                                />
                            </CollapsibleSection>
                        </div>
                     </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                <CountrySelector countries={appData.countries} selectedCountryId={amazonCountryId} onChange={(id) => setAmazonCountryId(id)} />
            </div>

            <CollapsibleSection title="Keywords y SEO">
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField label="Términos de Búsqueda (Search Terms)" helpText="Palabras clave principales que los clientes usan para encontrar el producto."><KeywordManager keywords={activeVersion?.content.searchTerms || []} onChange={k => updateAmazonContent({ searchTerms: k })} /></FormField>
                        <FormField label="Palabras Clave Backend (Keywords)" helpText="Palabras clave adicionales, sinónimos, etc. No visibles para el cliente."><KeywordManager keywords={activeVersion?.content.backendKeywords || []} onChange={k => updateAmazonContent({ backendKeywords: k })} byteLimit={250} /></FormField>
                    </div>
                    <div className="md:col-span-1 bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                        <KeywordAnalysisTable title="Análisis de Keywords" analysis={keywordAnalysis.searchTerms} onHover={setHighlightedKeyword} onLeave={() => setHighlightedKeyword('')}/>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Título y Descripción">
                <div className="p-4 space-y-4">
                    <FormField label="Título para Amazon"><CharacterCountTextInput maxLength={200} criticalLength={80} value={activeVersion?.content.title || ''} onChange={(e) => updateAmazonContent({ title: e.target.value })} highlightedKeyword={highlightedKeyword} allKeywordsToHighlight={keywordAnalysis.searchTerms}/></FormField>
                    <FormField label="Descripción del Producto"><HighlightingTextArea rows={8} value={activeVersion?.content.description || ''} onChange={(e) => updateAmazonContent({ description: e.target.value })} highlightedKeyword={highlightedKeyword} allKeywordsToHighlight={keywordAnalysis.searchTerms}/></FormField>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Beneficios y Bullet Points">
                 <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FormField key={i} label={`Bullet Point ${i + 1}`}>
                            <CharacterCountTextInput 
                                maxLength={500}
                                value={activeVersion?.content.bulletPoints?.[i]?.text || ''} 
                                onChange={(e) => {
                                    const newBulletPoints = [...(activeVersion?.content.bulletPoints || [])];
                                    while (newBulletPoints.length <= i) { newBulletPoints.push({ text: '', associatedBenefits: [] }); }
                                    newBulletPoints[i] = { ...newBulletPoints[i], text: e.target.value };
                                    updateAmazonContent({ bulletPoints: newBulletPoints });
                                }}
                                highlightedKeyword={highlightedKeyword}
                                allKeywordsToHighlight={keywordAnalysis.searchTerms}
                                rows={2}
                            />
                        </FormField>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Infografías y Contenido A+">
                <div className="p-4 space-y-4">
                    {(activeVersion?.content.infographics || []).map((info, index) => (
                        <div key={index} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 relative">
                             <button onClick={() => handleRemoveInfographic(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Icon name="trash-alt" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1 space-y-2">
                                    <div className="w-full aspect-square bg-slate-700/50 rounded-md flex items-center justify-center">{info.imageUrl ? <img src={info.imageUrl} alt="Infografía" className="w-full h-full object-cover rounded-md"/> : <Icon name="image" className="text-4xl text-slate-600"/>}</div>
                                    <TextInput placeholder="URL de la imagen..." value={info.imageUrl} onChange={e => handleInfographicChange(index, 'imageUrl', e.target.value)} />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <FormField label="Guía de creación (comentarios)"><TextArea value={info.comment} onChange={e => handleInfographicChange(index, 'comment', e.target.value)} rows={3}/></FormField>
                                    <FormField label="Análisis Cosmo"><TextArea value={info.cosmoAnalysis} onChange={e => handleInfographicChange(index, 'cosmoAnalysis', e.target.value)} rows={3}/></FormField>
                                    <FormField label="URL de Referencia"><TextInput value={info.referenceImageUrl || ''} onChange={e => handleInfographicChange(index, 'referenceImageUrl', e.target.value)} placeholder="URL de imagen de inspiración..."/></FormField>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAddInfographic} className="w-full px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700"><Icon name="plus" className="mr-2"/> Añadir Infografía</button>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title={`Historial de Versiones (${activeCountryContent?.versions.length || 0})`}>
                 <div className="p-4">
                    <ul className="space-y-2">
                        {(activeCountryContent?.versions || []).sort((a,b) => b.versionId - a.versionId).map(version => (
                            <li key={version.versionId} className="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                                <div><p className="text-sm font-semibold">{version.changeReason}</p><p className="text-xs text-slate-400">{version.authorName} - {new Date(version.createdAt).toLocaleString()}</p></div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleRestoreVersion(version)} className="text-xs font-semibold text-yellow-400 hover:underline flex items-center"><Icon name="undo" className="mr-1.5"/>Restaurar</button>
                                    <button onClick={() => handleShowHistory(version)} className="text-xs text-cyan-400 hover:underline">Ver Cambios</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CollapsibleSection>
        </div>
    );
};

const PublicationPlanningTab: FC<{ data: Product; setData: React.Dispatch<React.SetStateAction<Product>>; appData: AppData; currentUser: User; }> = ({ data, setData, appData, currentUser }) => {
    const [selectedCountryId, setSelectedCountryId] = useState<number>(appData.countries[0]?.id as number);

    const activePlanning = useMemo(() => 
        (data.publicationPlanning || []).find(p => p.countryId === selectedCountryId),
    [data.publicationPlanning, selectedCountryId]);

    const handlePlanningChange = useCallback((
        field: keyof PublicationPlanning['planningStatus'],
        updates: Partial<AmazonContentPlanningItem>
    ) => {
        setData(prevData => {
            const newData: Product = JSON.parse(JSON.stringify(prevData));
            let publicationPlanning = newData.publicationPlanning || [];
            let planningForCountry = publicationPlanning.find(p => p.countryId === selectedCountryId);

            if (!planningForCountry) {
                planningForCountry = {
                    countryId: selectedCountryId,
                    planningStatus: {
                        textContent: { status: 'Pendiente Modificacion' },
                        aPlusContent: { status: 'Pendiente Modificacion' },
                        publishedInStore: { status: 'Pendiente Modificacion' },
                        videos: { status: 'Pendiente Modificacion' }
                    }
                };
                publicationPlanning.push(planningForCountry);
            }
            
            const currentStatusItem = planningForCountry.planningStatus[field] || { status: 'Pendiente Modificacion' };
            planningForCountry.planningStatus[field] = { ...currentStatusItem, ...updates };
            
            newData.publicationPlanning = publicationPlanning;
            return newData;
        });
    }, [selectedCountryId, setData]);

    const planningStatusFields: (keyof PublicationPlanning['planningStatus'])[] = ['textContent', 'aPlusContent', 'publishedInStore', 'videos'];
    const planningStatusLabels: Record<keyof PublicationPlanning['planningStatus'], string> = {
      textContent: 'Contenido de Texto',
      aPlusContent: 'Contenido A+ / Infos',
      publishedInStore: 'Publicado en Store',
      videos: 'Vídeos'
    };

    return (
        <div className="space-y-4">
            <CountrySelector countries={appData.countries} selectedCountryId={selectedCountryId} onChange={(id) => setSelectedCountryId(id)} />
            
            <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Panel de Estado de Planificación</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {planningStatusFields.map(field => {
                        const currentStatusItem = activePlanning?.planningStatus?.[field];
                        const status = currentStatusItem?.status || 'Pendiente Modificacion';
                        const observaciones = currentStatusItem?.observaciones || '';
                        
                        return (
                            <FormField key={field} label={planningStatusLabels[field]}>
                                <div className="space-y-2">
                                    <Select 
                                        value={status} 
                                        onChange={(e) => handlePlanningChange(field, { status: e.target.value as AmazonContentPlanningStatus })}
                                    >
                                        <option value="Pendiente Modificacion">Pendiente</option>
                                        <option value="Publicado">Publicado</option>
                                    </Select>
                                    <TextInput 
                                        placeholder="Observaciones..." 
                                        value={observaciones}
                                        onChange={(e) => handlePlanningChange(field, { observaciones: e.target.value })}
                                        className="!text-xs"
                                    />
                                </div>
                            </FormField>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const MarketingTab: FC<{ data: Product; setData: React.Dispatch<React.SetStateAction<Product>> }> = ({ data, setData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className="space-y-6">
      <CollapsibleSection title="Análisis y Estrategia" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Puntos Fuertes"><TextArea name="puntosFuertes" value={data.puntosFuertes || ''} onChange={handleInputChange} /></FormField>
          <FormField label="Puntos Débiles"><TextArea name="puntosDebiles" value={data.puntosDebiles || ''} onChange={handleInputChange} /></FormField>
          <FormField label="Análisis de la Competencia" className="md:col-span-2"><TextArea name="analisisCompetencia" value={data.analisisCompetencia || ''} onChange={handleInputChange} rows={4} /></FormField>
          <FormField label="Resumen IA de Reseñas Amazon" className="md:col-span-2"><TextArea name="resenasIaAmazon" value={data.resenasIaAmazon || ''} onChange={handleInputChange} rows={4} /></FormField>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Público y Mensaje Clave" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Público Objetivo"><TextArea name="publicoObjetivo" value={data.publicoObjetivo || ''} onChange={handleInputChange} /></FormField>
          <FormField label="Key Selling Points"><TextArea name="keySellingPoints" value={data.keySellingPoints || ''} onChange={handleInputChange} /></FormField>
          <FormField label="Mini Narrativa (Elevator Pitch)" className="md:col-span-2"><TextArea name="miniNarrativa" value={data.miniNarrativa || ''} onChange={handleInputChange} rows={3} /></FormField>
        </div>
      </CollapsibleSection>
       <CollapsibleSection title="Contenido de Soporte" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Sugerencias de Uso"><TextArea name="sugerenciasUso" value={data.sugerenciasUso || ''} onChange={handleInputChange} /></FormField>
            <FormField label="Ideas de Contenido para Redes Sociales"><TextArea name="ideasContenidoRedes" value={data.ideasContenidoRedes || ''} onChange={handleInputChange} rows={4} /></FormField>
            <FormField label="Ejemplos de Testimonios" className="md:col-span-2"><TextArea name="ejemplosTestimonios" value={data.ejemplosTestimonios || ''} onChange={handleInputChange} rows={4} /></FormField>
        </div>
      </CollapsibleSection>
    </div>
  );
};

const CompositionTab: FC<{
    product: Product;
    setData: React.Dispatch<React.SetStateAction<Product>>;
    appData: AppData;
}> = ({ product, setData, appData }) => {
    const [newIngredientId, setNewIngredientId] = useState<number | ''>('');
    const [newQuantity, setNewQuantity] = useState<number | ''>('');
    const [newForm, setNewForm] = useState('');

    const handleAddIngredient = () => {
        if (!newIngredientId || newQuantity === '') {
            alert('Por favor, selecciona un ingrediente y especifica una cantidad.');
            return;
        }

        const ingredient = appData.ingredients.find(i => i.id === newIngredientId);
        if (!ingredient) return;

        // VRN Calculation Logic
        const vrnPercentages = appData.countries.map(country => {
            const countryDetail = ingredient.countryDetails.find(cd => cd.countryId === country.id);
            if (countryDetail?.vrn?.baseQuantity && countryDetail.vrn.baseQuantity > 0) {
                const value = (Number(newQuantity) / countryDetail.vrn.baseQuantity) * 100;
                return { countryId: country.id as number, value: parseFloat(value.toFixed(2)) };
            }
            return { countryId: country.id as number, value: null };
        });

        const newCompositionItem: ProductCompositionItem = {
            ingredientId: newIngredientId,
            quantity: Number(newQuantity),
            form: newForm,
            vrnPercentages,
        };
        
        const currentComposition = product.composition || [];
        // Check if ingredient already exists
        if (currentComposition.some(item => item.ingredientId === newIngredientId)) {
            alert('Este ingrediente ya está en la composición.');
            return;
        }

        setData(prev => ({
            ...prev,
            composition: [...currentComposition, newCompositionItem],
        }));
        
        // Reset form
        setNewIngredientId('');
        setNewQuantity('');
        setNewForm('');
    };

    const handleRemoveIngredient = (ingredientIdToRemove: number) => {
        setData(prev => ({
            ...prev,
            composition: (prev.composition || []).filter(item => item.ingredientId !== ingredientIdToRemove),
        }));
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Ingrediente</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Cantidad</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Forma</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">VRN (%)</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(product.composition || []).map((item, index) => {
                            const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
                            return (
                                <tr key={index}>
                                    <td className="px-4 py-2">{ingredient?.latinName || 'Desconocido'}</td>
                                    <td className="px-4 py-2">{item.quantity} {ingredient?.measureUnit}</td>
                                    <td className="px-4 py-2">{item.form}</td>
                                    <td className="px-4 py-2 text-xs">
                                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                                            {item.vrnPercentages.filter(vrn => vrn.value !== null).map(vrn => {
                                                const country = appData.countries.find(c => c.id === vrn.countryId);
                                                return (
                                                    <span key={vrn.countryId} className="bg-slate-700 px-1.5 py-0.5 rounded">
                                                        {country?.iso}: <span className="font-semibold text-slate-200">{vrn.value}%</span>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <button onClick={() => handleRemoveIngredient(item.ingredientId)} className="text-red-400 hover:text-red-300">
                                            <Icon name="trash-alt" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                         {(!product.composition || product.composition.length === 0) && (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-slate-500">No hay ingredientes en la composición.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
                <h4 className="font-semibold text-slate-300 mb-2">Añadir Ingrediente</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <FormField label="Ingrediente" className="md:col-span-2 mb-0">
                        <Select value={newIngredientId} onChange={e => setNewIngredientId(e.target.value ? Number(e.target.value) : '')}>
                            <option value="">Seleccionar ingrediente...</option>
                            {appData.ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.latinName}</option>)}
                        </Select>
                    </FormField>
                    <FormField label="Cantidad" className="mb-0">
                        <TextInput type="number" value={newQuantity} onChange={e => setNewQuantity(e.target.value ? Number(e.target.value) : '')} />
                    </FormField>
                     <FormField label="Forma (Opcional)" className="mb-0">
                        <TextInput value={newForm} onChange={e => setNewForm(e.target.value)} />
                    </FormField>
                </div>
                <div className="flex justify-end mt-3">
                     <button onClick={handleAddIngredient} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600">
                        <Icon name="plus" className="mr-2"/>
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

const ShopifyTab: FC<{ data: ShopifyContent; setData: (content: ShopifyContent) => void; product: Product; }> = ({ data, setData, product }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleFaqChange = (index: number, field: keyof ShopifyFAQ, value: string) => {
        const newFaqs = [...(data.faqs || [])];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setData({ ...data, faqs: newFaqs });
    };

    const handleAddFaq = () => {
        const newFaqs = [...(data.faqs || []), { id: `faq-${Date.now()}`, question: '', answer: '' }];
        setData({ ...data, faqs: newFaqs });
    };

    const handleRemoveFaq = (id: string) => {
        const newFaqs = (data.faqs || []).filter(faq => faq.id !== id);
        setData({ ...data, faqs: newFaqs });
    };

    const handlePostChange = (index: number, value: string) => {
        const newPosts = [...(data.relatedPosts || [])];
        newPosts[index] = { ...newPosts[index], title: value };
        setData({ ...data, relatedPosts: newPosts });
    };

    const handleAddPost = () => {
        const newPosts = [...(data.relatedPosts || []), { id: `post-${Date.now()}`, title: '' }];
        setData({ ...data, relatedPosts: newPosts });
    };
    
    const handleRemovePost = (id: string) => {
        const newPosts = (data.relatedPosts || []).filter(post => post.id !== id);
        setData({ ...data, relatedPosts: newPosts });
    };

    const handleBenefitSelect = (index: number, benefit: string) => {
        setData({ ...data, [`highlightBenefit${index}` as keyof ShopifyContent]: benefit });
        const summaryElement = document.querySelector(`#benefit-details-${index}`);
        if (summaryElement && summaryElement.parentElement) {
            (summaryElement.parentElement as HTMLDetailsElement).open = false;
        }
    };

    const usedBenefits = [
        data.highlightBenefit1,
        data.highlightBenefit2,
        data.highlightBenefit3,
        data.highlightBenefit4,
        data.highlightBenefit5,
    ].filter(Boolean);

    const availableBenefits = product.beneficiosGenericos?.filter(b => !usedBenefits.includes(b)) || [];

    return (
        <div className="space-y-6">
            <CollapsibleSection title="Contenido Principal" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Título para Shopify" htmlFor="titleShopify"><TextInput id="titleShopify" name="titleShopify" value={data.titleShopify || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Resumen Enfocado" htmlFor="focusSummaryShopify"><TextInput id="focusSummaryShopify" name="focusSummaryShopify" value={data.focusSummaryShopify || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Descripción" htmlFor="descriptionShopify" className="md:col-span-2">
                        <TextArea id="descriptionShopify" name="descriptionShopify" value={data.descriptionShopify || ''} onChange={handleInputChange} rows={6} />
                    </FormField>
                    <FormField label="Beneficios (General)" htmlFor="benefitsShopify" className="md:col-span-2">
                        <TextArea id="benefitsShopify" name="benefitsShopify" value={data.benefitsShopify || ''} onChange={handleInputChange} rows={4} />
                    </FormField>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Beneficios Destacados">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({length: 5}).map((_, i) => {
                        const fieldName = `highlightBenefit${i+1}` as keyof ShopifyContent;
                        const hasValue = !!data[fieldName];

                        return (
                            <FormField key={i} label={`Beneficio Destacado ${i+1}`}>
                                <div className="flex items-center space-x-2">
                                    <TextInput name={fieldName} value={(data[fieldName] as string) || ''} onChange={handleInputChange} className="flex-grow"/>
                                    {!hasValue && availableBenefits.length > 0 && (
                                        <details className="relative" id={`benefit-details-${i+1}`}>
                                            <summary className="px-3 py-2 bg-slate-600 text-slate-200 rounded-md text-sm cursor-pointer list-none flex items-center hover:bg-slate-500">
                                                <Icon name="plus" className="mr-1.5"/> Traer
                                            </summary>
                                            <div className="absolute z-10 right-0 mt-2 w-56 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                {availableBenefits.map(benefit => (
                                                    <button key={benefit} type="button" onClick={() => handleBenefitSelect(i+1, benefit)} className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-600 text-slate-200">
                                                        {benefit}
                                                    </button>
                                                ))}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            </FormField>
                        )
                    })}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Preguntas Frecuentes (FAQs)">
                <div className="p-4 space-y-3">
                    {(data.faqs || []).map((faq, index) => (
                        <div key={faq.id} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 relative">
                             <button onClick={() => handleRemoveFaq(faq.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Icon name="trash-alt" /></button>
                             <FormField label="Pregunta"><TextInput value={faq.question} onChange={e => handleFaqChange(index, 'question', e.target.value)} /></FormField>
                             <FormField label="Respuesta" className="mb-0"><TextArea value={faq.answer} onChange={e => handleFaqChange(index, 'answer', e.target.value)} rows={2} /></FormField>
                        </div>
                    ))}
                    <button onClick={handleAddFaq} className="w-full px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">
                        <Icon name="plus" className="mr-2"/> Añadir FAQ
                    </button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Posts del Blog Relacionados">
                 <div className="p-4 space-y-3">
                    {(data.relatedPosts || []).map((post, index) => (
                        <div key={post.id} className="flex items-center space-x-2">
                            <TextInput value={post.title} onChange={e => handlePostChange(index, e.target.value)} className="flex-grow"/>
                            <button onClick={() => handleRemovePost(post.id)} className="p-2 bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30"><Icon name="trash-alt" /></button>
                        </div>
                    ))}
                    <button onClick={handleAddPost} className="w-full px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">
                        <Icon name="plus" className="mr-2"/> Añadir Post Relacionado
                    </button>
                </div>
            </CollapsibleSection>
        </div>
    );
};

const AMAZON_MATERIAL_FEATURES: AmazonAttributeMaterialFeature[] = ['Bajo en carbohidratos', 'Bajo en sodio', 'Certificado orgánico', 'Natural', 'Sin colorantes artificiales', 'Sin conservantes artificiales', 'Sin crueldad', 'Sin edulcorantes artificiales', 'Sin OGM', 'Sin saborizantes artificiales'];
const AMAZON_STORAGE_TEMPERATURES: AmazonAttributeStorageTemperature[] = ['Ambiente: Temperatura de la habitación', 'Congelado: 0 grados', 'Refrigerado: entre 33 y 38 grados'];
const AMAZON_SERVING_UNITS: AmazonAttributeServingUnit[] = ['Ampolla', 'Bar', 'cápsula(s)', 'Cucharada(s)', 'Gramos', 'Microgramos', 'Miligramos', 'Mililitros', 'Onzas de líquido', 'píldoras', 'Porcentaje de la cantidad diaria', 'Porción(es)', 'teaspoon(s)'];
const AMAZON_EXPIRY_TYPES: AmazonAttributeExpiryType[] = ['Does Not Expire', 'Expiration Date Required', 'Expiration On Package', 'Production Date Required', 'Shelf Life'];
const AMAZON_SUPPLEMENT_FORMULATIONS: AmazonAttributeSupplementFormulation[] = ['Multisuplemento', 'Suplemento único'];
const AMAZON_PILL_COATINGS: AmazonAttributePillCoating[] = ['Azúcar', 'Compresión', 'Entérico', 'Gelatina', 'Película', 'Sin recubrimiento'];
const AMAZON_DOSE_RELEASE_METHODS: AmazonAttributeDoseReleaseMethod[] = ['Liberación dirigida', 'Liberación extendida', 'Liberación inmediata', 'Liberación osmótica', 'Liberación pulsátil', 'Liberación retrasada'];
const AMAZON_COMPLIANCE_STATUSES: AmazonAttributeComplianceStatus[] = ['En conformidad', 'Exento', 'No conformado'];


const AmazonAttributesTab: FC<{ data: Product; setData: React.Dispatch<React.SetStateAction<Product>>; appData: AppData; }> = ({ data, setData, appData }) => {
    const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        let finalValue: string | number | boolean | undefined;
        
        if (name === 'isProductExpirable') {
            if (value === 'true') finalValue = true;
            else if (value === 'false') finalValue = false;
            else finalValue = undefined;
        } else if (type === 'checkbox') {
            finalValue = target.checked;
        } else if (type === 'number') {
            finalValue = value === '' ? undefined : Number(value);
        } else {
            finalValue = value === '' ? undefined : value;
        }

        setData(prev => ({
            ...prev,
            amazonAttributes: {
                ...prev.amazonAttributes,
                [name]: finalValue,
            }
        }));
    };
    
    const attrs = data.amazonAttributes || {};

    return (
        <div className="space-y-4">
            <CollapsibleSection title="Dimensiones y Peso">
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField label="Largo"><TextInput type="number" name="itemLength" value={attrs.itemLength || ''} onChange={handleAttributeChange}/></FormField>
                    <FormField label="Unidad"><Select name="itemLengthUnit" value={attrs.itemLengthUnit || ''} onChange={handleAttributeChange}><option>Milímetros</option><option>Centímetros</option></Select></FormField>
                    <FormField label="Ancho"><TextInput type="number" name="itemWidth" value={attrs.itemWidth || ''} onChange={handleAttributeChange}/></FormField>
                    <FormField label="Unidad"><Select name="itemWidthUnit" value={attrs.itemWidthUnit || ''} onChange={handleAttributeChange}><option>Milímetros</option><option>Centímetros</option></Select></FormField>
                    <FormField label="Alto"><TextInput type="number" name="itemHeight" value={attrs.itemHeight || ''} onChange={handleAttributeChange}/></FormField>
                    <FormField label="Unidad"><Select name="itemHeightUnit" value={attrs.itemHeightUnit || ''} onChange={handleAttributeChange}><option>Milímetros</option><option>Centímetros</option></Select></FormField>
                    <FormField label="Peso Paquete"><TextInput type="number" name="packageWeight" value={attrs.packageWeight || ''} onChange={handleAttributeChange}/></FormField>
                    <FormField label="Unidad"><Select name="packageWeightUnit" value={attrs.packageWeightUnit || ''} onChange={handleAttributeChange}><option>Miligramos</option><option>Gramos</option><option>Kilográmos</option></Select></FormField>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Información General de Venta">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField label="Advertencia de Seguridad" className="md:col-span-3"><TextArea name="safetyWarning" value={attrs.safetyWarning || ''} onChange={handleAttributeChange} rows={2}/></FormField>
                    <FormField label="País de Origen"><CountrySelector countries={appData.countries} selectedCountryId={attrs.countryOfOrigin} onChange={(id) => handleAttributeChange({ target: { name: 'countryOfOrigin', value: id, type: 'number'} } as any)} /></FormField>
                    <FormField label="Categoría"><TextInput name="category" value={attrs.category || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Navigation Node"><TextInput name="navigationNode" value={attrs.navigationNode || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Género"><Select name="gender" value={attrs.gender || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option><option>Femenino</option><option>Masculino</option><option>Unisex</option></Select></FormField>
                    <FormField label="Rango de Edad"><Select name="ageRangeDescription" value={attrs.ageRangeDescription || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option><option>Adolescente</option><option>Adulto</option><option>Infant</option><option>Neonato</option><option>Niño</option><option>Toddler</option></Select></FormField>
                    <FormField label="Número de Artículos"><TextInput type="number" name="numberOfItems" value={attrs.numberOfItems || ''} onChange={handleAttributeChange} /></FormField>
                </div>
            </CollapsibleSection>

             <CollapsibleSection title="Beneficios y Marketing">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({length: 5}).map((_, i) => (
                        <FormField key={i} label={`Beneficio ${i+1}`}>
                            <TextInput name={`benefit${i+1}`} value={attrs[`benefit${i+1}` as keyof AmazonAttributes] as string || ''} onChange={handleAttributeChange}/>
                        </FormField>
                    ))}
                    <FormField label="Ingredientes Especiales" className="md:col-span-2"><TextArea name="specialIngredients" value={attrs.specialIngredients || ''} onChange={handleAttributeChange} rows={2}/></FormField>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Características del Producto">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Ración Recomendada"><TextInput name="recommendedServing" value={attrs.recommendedServing || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Características del Material"><Select name="materialFeatures" value={attrs.materialFeatures || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_MATERIAL_FEATURES.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Temperatura Almacenamiento"><Select name="storageTemperature" value={attrs.storageTemperature || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_STORAGE_TEMPERATURES.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Sabor"><TextInput name="flavor" value={attrs.flavor || ''} onChange={handleAttributeChange} /></FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Cantidad Ración"><TextInput type="number" name="servingSize" value={attrs.servingSize || ''} onChange={handleAttributeChange} /></FormField>
                        <FormField label="Unidad"><Select name="servingSizeUnit" value={attrs.servingSizeUnit || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_SERVING_UNITS.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    </div>
                    <div></div>
                    <FormField label="Ingredientes" className="md:col-span-2"><TextArea name="ingredients" value={attrs.ingredients || ''} onChange={handleAttributeChange} rows={3}/></FormField>
                    <FormField label="Información Alergénica" className="md:col-span-2"><TextArea name="allergenInfo" value={attrs.allergenInfo || ''} onChange={handleAttributeChange} rows={3}/></FormField>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Caducidad y Cumplimiento">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField label="¿El producto caduca?"><Select name="isProductExpirable" value={attrs.isProductExpirable === undefined ? '' : String(attrs.isProductExpirable)} onChange={handleAttributeChange}><option value="">Seleccionar...</option><option value="true">Sí</option><option value="false">No</option></Select></FormField>
                    <FormField label="Tipo de Caducidad"><Select name="productExpiryType" value={attrs.productExpiryType || ''} onChange={handleAttributeChange} disabled={!attrs.isProductExpirable}><option value="">Seleccionar...</option>{AMAZON_EXPIRY_TYPES.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <div className="grid grid-cols-2 gap-4">
                       <FormField label="Vida Útil (Almacén)"><TextInput type="number" name="fulfillmentCenterShelfLife" value={attrs.fulfillmentCenterShelfLife || ''} onChange={handleAttributeChange} disabled={!attrs.isProductExpirable} /></FormField>
                       <FormField label="Unidad"><Select name="fulfillmentCenterShelfLifeUnit" value={attrs.fulfillmentCenterShelfLifeUnit || ''} onChange={handleAttributeChange} disabled={!attrs.isProductExpirable}><option value="Días">Días</option></Select></FormField>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Detalles del Suplemento">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FormField label="Forma del Artículo"><Select name="itemForm" value={attrs.itemForm || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{['Aerosol', 'Barrita', 'Capleta', 'Cápsula', 'Cápsula blanda', 'Copo', 'Crema', 'Gel', 'Gominola', 'Gránulo', 'Líquido', 'Masticable', 'Oblea', 'Pastilla', 'Polvo'].map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Recuento de Unidades"><TextInput type="number" name="unitCount" value={attrs.unitCount || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Tipo Recuento Unidades"><Select name="unitCountType" value={attrs.unitCountType || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option><option>gramo</option><option>miligramo</option><option>unidad</option></Select></FormField>
                    <FormField label="Usos Específicos"><TextInput name="specificUses" value={attrs.specificUses || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Tipo Contenedor"><Select name="containerType" value={attrs.containerType || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{['Barreño', 'Blister', 'Bolsa', 'Botella', 'Caja', 'Paquete de palitos', 'Tarro', 'Tuba'].map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Tipo de Dieta"><Select name="dietType" value={attrs.dietType || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{['A base de plantas', 'Halal', 'Keto', 'Kosher', 'Paleo', 'sin gluten', 'Vegano', 'Vegetariano'].map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Forma de Dosificación"><TextInput name="dosageForm" value={attrs.dosageForm || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Tipo Suplemento Primario"><TextInput name="primarySupplementType" value={attrs.primarySupplementType || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Raciones por Envase"><TextInput type="number" name="servingsPerContainer" value={attrs.servingsPerContainer || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Formulación Suplemento"><Select name="supplementFormulation" value={attrs.supplementFormulation || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_SUPPLEMENT_FORMULATIONS.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Recubrimiento Píldora"><Select name="pillCoating" value={attrs.pillCoating || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_PILL_COATINGS.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Método Liberación Dosis"><Select name="doseReleaseMethod" value={attrs.doseReleaseMethod || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_DOSE_RELEASE_METHODS.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Certificación y Direcciones">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Estado de Certificación"><Select name="complianceCertificationStatus" value={attrs.complianceCertificationStatus || ''} onChange={handleAttributeChange}><option value="">Seleccionar...</option>{AMAZON_COMPLIANCE_STATUSES.map(o => <option key={o} value={o}>{o}</option>)}</Select></FormField>
                    <FormField label="Organismo Regulador"><TextInput name="regulatoryBodyName" value={attrs.regulatoryBodyName || ''} onChange={handleAttributeChange} /></FormField>
                    <FormField label="Certificaciones" className="md:col-span-2"><TextArea name="complianceCertifications" value={attrs.complianceCertifications || ''} onChange={handleAttributeChange} rows={3}/></FormField>
                    <FormField label="Direcciones" className="md:col-span-2"><TextArea name="directions" value={attrs.directions || ''} onChange={handleAttributeChange} rows={3}/></FormField>
                </div>
            </CollapsibleSection>
        </div>
    );
};

const GeneralTab: FC<{ data: Product; setData: React.Dispatch<React.SetStateAction<Product>>; appData: AppData; }> = ({ data, setData, appData }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;
        let finalValue: any;
        if(type === 'checkbox'){
            finalValue = target.checked;
        } else if (type === 'number') {
            finalValue = value === '' ? undefined : Number(value);
        } else {
            finalValue = value;
        }
        setData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleDurationChange = (field: 'valor' | 'unidad', value: string | number) => {
        setData(prev => ({
            ...prev,
            duracionProducto: {
                ...prev.duracionProducto,
                valor: prev.duracionProducto?.valor || 0,
                unidad: prev.duracionProducto?.unidad || 'dias',
                [field]: value
            }
        }));
    };
    
    const selectedEnvase = useMemo(() => {
        if (!data.envaseId) return null;
        return appData.envases.find(e => e.id === data.envaseId);
    }, [data.envaseId, appData.envases]);

    return (
        <div className="space-y-6">
            <CollapsibleSection title="Información Principal" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField label="Nombre del Producto" htmlFor="name"><TextInput id="name" name="name" value={data.name} onChange={handleInputChange} /></FormField>
                    <FormField label="Marca" htmlFor="marca"><TextInput id="marca" name="marca" value={data.marca || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="SKU" htmlFor="sku"><TextInput id="sku" name="sku" value={data.sku} onChange={handleInputChange} /></FormField>
                    <FormField label="EAN" htmlFor="ean"><TextInput id="ean" name="ean" value={data.ean || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="ASIN" htmlFor="asin"><TextInput id="asin" name="asin" value={data.asin || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Estado" htmlFor="status">
                        <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                            <option value="En Estudio">En Estudio</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </Select>
                    </FormField>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Detalles del Formato y Beneficios" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField label="Formato" htmlFor="format">
                        <Select id="format" name="format" value={data.format || ''} onChange={handleInputChange}>
                            <option value="">Seleccionar formato</option>
                            <option value="Comprimido(s)">Comprimido(s)</option>
                            <option value="Cápsula(s)">Cápsula(s)</option>
                            <option value="Polvo">Polvo</option>
                            <option value="Softgel">Softgel</option>
                            <option value="gominola(s)">Gominola(s)</option>
                        </Select>
                    </FormField>
                    <FormField label="Unidades" htmlFor="units"><TextInput type="number" id="units" name="units" value={data.units || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Beneficios Genéricos" className="md:col-span-2">
                        <KeywordManager
                            keywords={data.beneficiosGenericos || []}
                            onChange={(keywords) => setData(prev => ({ ...prev, beneficiosGenericos: keywords }))}
                        />
                    </FormField>
                </div>
            </CollapsibleSection>

             <CollapsibleSection title="Uso, Conservación y Características" defaultOpen>
                <div className="p-4 space-y-4">
                    <FormField label="Modo de Uso"><TextArea name="modoUso" value={data.modoUso || ''} onChange={handleInputChange} rows={3}/></FormField>
                    <FormField label="Conservación"><TextArea name="conservacion" value={data.conservacion || ''} onChange={handleInputChange} rows={3}/></FormField>
                    <FormField label="Características del Producto">
                        <KeywordManager keywords={data.caracteristicasProducto || []} onChange={k => setData(prev => ({...prev, caracteristicasProducto: k}))} />
                    </FormField>
                </div>
            </CollapsibleSection>
            
             <CollapsibleSection title="Pesos y Medidas" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField label="Peso Neto (Etiqueta)" htmlFor="pesoNetoEtiqueta" helpText="Ej: 120g"><TextInput id="pesoNetoEtiqueta" name="pesoNetoEtiqueta" value={data.pesoNetoEtiqueta || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Peso Neto (numérico en g)" htmlFor="pesoNeto"><TextInput type="number" id="pesoNeto" name="pesoNeto" value={data.pesoNeto || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Peso por Unidad (g)" htmlFor="unitWeight"><TextInput type="number" step="0.01" id="unitWeight" name="unitWeight" value={data.unitWeight || ''} onChange={handleInputChange} /></FormField>
                    <FormField label="Peso para Envío (g)" htmlFor="pesoEnvio" className="md:col-span-1"><TextInput type="number" id="pesoEnvio" name="pesoEnvio" value={data.pesoEnvio || ''} onChange={handleInputChange} /></FormField>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Envase y Caducidad" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField label="Envase Asociado" htmlFor="envaseId">
                            <Select id="envaseId" name="envaseId" value={data.envaseId || ''} onChange={handleInputChange}>
                                <option value="">Seleccionar envase</option>
                                {appData.envases.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                        </FormField>
                        <FormField label="Caducidad (meses)" htmlFor="expiryInMonths"><TextInput type="number" id="expiryInMonths" name="expiryInMonths" value={data.expiryInMonths || ''} onChange={handleInputChange} /></FormField>
                        <FormField label="Duración del Producto">
                            <div className="flex items-center space-x-2">
                                <TextInput type="number" value={data.duracionProducto?.valor || ''} onChange={e => handleDurationChange('valor', Number(e.target.value))} className="w-24"/>
                                <Select value={data.duracionProducto?.unidad || 'dias'} onChange={e => handleDurationChange('unidad', e.target.value)}>
                                    <option value="dias">Días</option>
                                    <option value="semanas">Semanas</option>
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </Select>
                            </div>
                        </FormField>
                         <div className="flex items-center space-x-4 pt-2">
                            <label className="flex items-center text-slate-300 text-sm"><input type="checkbox" name="hasRepercap" checked={data.hasRepercap || false} onChange={handleInputChange} className="mr-2 h-4 w-4 bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"/> ¿Tiene Repercap?</label>
                            <label className="flex items-center text-slate-300 text-sm"><input type="checkbox" name="isRepercapScreenPrinted" checked={data.isRepercapScreenPrinted || false} onChange={handleInputChange} className="mr-2 h-4 w-4 bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"/> ¿Repercap Serigrafiado?</label>
                        </div>
                    </div>
                    {selectedEnvase && (
                        <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/60">
                            <h4 className="font-bold text-slate-200 mb-2">Previsualización del Envase</h4>
                            <div className="flex items-start space-x-4">
                                {selectedEnvase.fotoUrl && <img src={selectedEnvase.fotoUrl} alt={selectedEnvase.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />}
                                <div className="text-sm text-slate-400 space-y-1">
                                    <p><strong>Tipo:</strong> {selectedEnvase.tipo || 'N/A'}</p>
                                    <p><strong>Medidas:</strong> {selectedEnvase.height || 'N/A'}cm x {selectedEnvase.width || 'N/A'}cm</p>
                                    <p><strong>Peso:</strong> {selectedEnvase.peso ? `${selectedEnvase.peso}g` : 'N/A'}</p>
                                    <p><strong>Capacidad:</strong> {selectedEnvase.capacidad || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
};

const HistoryTab: FC<{ data: Product; appData: AppData }> = ({ data, appData }) => {
    if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda el producto para ver su historial.</div>;
    }
    const logs = appData.logs
      .filter(l => l.entityType === 'products' && l.entityId === data.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return <AuditLogDisplay logs={logs} />;
};

const TasksTab: FC<{ data: Product; appData: AppData; onSelectItem: (entityType: EntityType, item: Entity) => void; }> = ({ data, appData, onSelectItem }) => {
     if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda el producto para ver sus tareas.</div>;
    }
    const tasks = appData.tasks
      .filter(t => t.linkedEntity.entityType === 'products' && t.linkedEntity.entityId === data.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

     if (tasks.length === 0) {
        return <div className="text-center text-slate-500 p-8">No hay tareas vinculadas a este producto.</div>;
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => {
                const assignee = appData.users.find(u => u.id === task.assigneeId);
                return (
                    <div 
                        key={task.id}
                        onClick={() => onSelectItem('tasks', task)}
                        className="bg-slate-800/60 p-3 rounded-md border border-slate-700 hover:border-cyan-500 cursor-pointer flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-slate-200">{task.name}</p>
                            <p className="text-sm text-slate-400">{task.status} - Prioridad: {task.priority}</p>
                        </div>
                        <div className="text-sm">Asignado a: {assignee?.name || 'N/A'}</div>
                    </div>
                )
            })}
        </div>
    )
};

const NotesTab: FC<{
    data: Product;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}> = ({ data, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const productNotes = typeof data.id === 'number'
      ? appData.notes.filter(n => n.entityType === 'products' && n.entityId === data.id)
      : [];

    const handleAddNote = (noteText: string, attachments: File[]) => {
        // FIX: Added a guard to ensure a note is only added to a saved product with a numeric ID.
        if (typeof data.id !== 'number') {
            alert("Por favor, guarda el producto antes de añadir una nota.");
            return;
        }
        const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'products',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };

    return (
        <div>
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={productNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda el producto para poder añadir notas.</p>
            )}
        </div>
    );
};

const etiquetaStatusConfig: Record<EtiquetaStatus, { color: string; text: string }> = {
    'Pendiente enviar a imprenta': { color: 'bg-yellow-500/20 text-yellow-300', text: 'Pendiente Imprenta' },
    'Enviado a imprenta': { color: 'bg-blue-500/20 text-blue-300', text: 'Enviado a Imprenta' },
    'Aprobado en imprenta': { color: 'bg-cyan-500/20 text-cyan-300', text: 'Aprobado Imprenta' },
    'En el mercado': { color: 'bg-green-500/20 text-green-300', text: 'En Mercado' },
    'Obsoleto': { color: 'bg-slate-500/20 text-slate-400', text: 'Obsoleto' },
};

const ProductLabelsTab: FC<{
  product: Product;
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onDuplicateEtiqueta: (id: number | 'new') => void;
}> = ({ product, appData, onSelectItem, onDuplicateEtiqueta }) => {
    const productLabels = useMemo(() => {
        if (typeof product.id !== 'number') return [];
        return appData.etiquetas
            .filter(e => e.productId === product.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [product.id, appData.etiquetas]);

    const handleAddNewEtiqueta = () => {
        if (typeof product.id !== 'number') return;
        const latestVersion = productLabels.length > 0 ?
            Math.max(0, ...productLabels.map(l => {
                const match = l.identifier.match(/-v(\d+)$/);
                return match ? parseInt(match[1], 10) : 0;
            })) : 0;
        
        const newVersionNumber = (latestVersion + 1).toString().padStart(2, '0');

        const newEtiqueta: Etiqueta = {
            id: 'new',
            identifier: `${product.sku}-v${newVersionNumber}`,
            productId: product.id as number,
            createdAt: new Date().toISOString(),
            status: 'Pendiente enviar a imprenta',
            creationType: 'Etiqueta 0',
            contentByLanguage: [],
            ingredientSnapshot: [],
        };
        onSelectItem('etiquetas', newEtiqueta);
    };

    if (typeof product.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda el producto para poder añadir y ver sus etiquetas.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={handleAddNewEtiqueta} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 flex items-center">
                    <Icon name="plus" className="mr-2" />
                    Añadir Nueva Etiqueta
                </button>
            </div>
            <div className="overflow-x-auto bg-slate-800/60 rounded-lg border border-slate-700">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Identificador</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tipo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Lote Asociado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fecha Creación</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {productLabels.map(label => {
                            const statusConf = etiquetaStatusConfig[label.status];
                            const batch = appData.batches.find(b => b.labelId === label.id);
                            return (
                                <tr key={label.id} className="hover:bg-slate-700/50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-200">{label.identifier}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                                            {statusConf.text}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{label.creationType}</td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{batch?.batchNumber || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{new Date(label.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        {/* FIX: Removed unsafe 'as number' cast and disabled button for new, unsaved labels. */}
                                        <button onClick={() => onDuplicateEtiqueta(label.id)} disabled={label.id === 'new'} title="Duplicar" className="p-2 text-slate-400 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"><Icon name="copy"/></button>
                                        <button onClick={() => onSelectItem('etiquetas', label)} title="Ver / Editar" className="p-2 text-slate-400 hover:text-cyan-400"><Icon name="edit"/></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {productLabels.length === 0 && (
                    <div className="text-center p-8 text-slate-500">No hay etiquetas asociadas a este producto.</div>
                )}
            </div>
        </div>
    );
};

// --- END TAB COMPONENTS ---


export const ProductDetailView: FC<ProductDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onNoteAdd, onNoteUpdate, onNoteDelete, onSelectItem, setIsDirty, setSaveHandler, onDuplicateEtiqueta, sidebarCollapsed, isDirty }) => {
  const [data, setData] = useState<Product>(initialData);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveVersionModal, setSaveVersionModal] = useState<{
    isOpen: boolean;
    onSuccess?: () => void;
  }>({ isOpen: false });

  const currentUser = appData.users.find(u => u.role === 'Administrador'); // Mock current user for now

  const handleConfirmSaveVersion = (reason: string) => {
    setIsSaving(true);
    setSaveVersionModal(prev => ({ ...prev, isOpen: false })); // Close modal

    const changedCountryIds = new Set<number>();
    // Re-run change detection to be safe
    data.amazonContents.forEach(currentCountryContent => {
        const initialCountryContent = initialData.amazonContents.find(c => c.countryId === currentCountryContent.countryId);
        const currentActiveVersion = currentCountryContent.versions.find(v => v.versionId === currentCountryContent.currentVersionId);
        const initialActiveVersion = initialCountryContent?.versions.find(v => v.versionId === initialCountryContent.currentVersionId);
        if (!initialActiveVersion || !currentActiveVersion) {
            changedCountryIds.add(currentCountryContent.countryId);
            return;
        }
        const hasChanged = !isEqual(currentActiveVersion.content, initialActiveVersion.content);
        if (hasChanged) {
            changedCountryIds.add(currentCountryContent.countryId);
        }
    });

    let productToSave = JSON.parse(JSON.stringify(data));
    const now = new Date().toISOString();
    
    productToSave.amazonContents = productToSave.amazonContents.map((countryContent: AmazonContent) => {
        if (!changedCountryIds.has(countryContent.countryId)) {
            return countryContent;
        }
        const currentVersionWithChanges = countryContent.versions.find(v => v.versionId === countryContent.currentVersionId);
        if (currentVersionWithChanges) {
            const newVersionId = Date.now();
            const newVersion: AmazonContentVersion = {
                versionId: newVersionId,
                createdAt: now,
                authorName: currentUser?.name || 'Sistema',
                changeReason: reason,
                content: currentVersionWithChanges.content,
            };
            return {
                ...countryContent,
                versions: [...countryContent.versions, newVersion],
                currentVersionId: newVersionId,
            };
        }
        return countryContent;
    });

    onSave(productToSave);
    if (saveVersionModal.onSuccess) {
        saveVersionModal.onSuccess();
    }
  };


  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    const productToSave = JSON.parse(JSON.stringify(data));
    const changedCountryIds = new Set<number>();

    // 1. Detect which countries have changes in versioned content
    data.amazonContents.forEach(currentCountryContent => {
        const initialCountryContent = initialData.amazonContents.find(c => c.countryId === currentCountryContent.countryId);
        const currentActiveVersion = currentCountryContent.versions.find(v => v.versionId === currentCountryContent.currentVersionId);
        const initialActiveVersion = initialCountryContent?.versions.find(v => v.versionId === initialCountryContent.currentVersionId);

        if (!initialActiveVersion || !currentActiveVersion) {
            changedCountryIds.add(currentCountryContent.countryId);
            return;
        }

        const hasChanged = !isEqual(currentActiveVersion.content, initialActiveVersion.content);
        
        if (hasChanged) {
            changedCountryIds.add(currentCountryContent.countryId);
        }
    });
    
    // 2. If there are changes, open modal. Otherwise, save directly.
    if (changedCountryIds.size > 0) {
        setSaveVersionModal({ isOpen: true, onSuccess });
    } else {
        setIsSaving(true);
        onSave(productToSave);
        if (onSuccess) {
            onSuccess();
        }
    }
  }, [data, initialData, onSave, currentUser]);


  useEffect(() => {
    // When initialData changes (likely after a save), reset the saving flag.
    setIsSaving(false);
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isSaving) return; // Don't mark as dirty while a save is in progress
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty, isSaving]);

  useEffect(() => {
    setSaveHandler(() => handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);


  const handleDeleteClick = () => {
    onDelete(data.id);
  };

  return (
    <div className="bg-slate-800 rounded-lg pb-20">
      {saveVersionModal.isOpen && (
        <SaveVersionModal
            onClose={() => setSaveVersionModal({ isOpen: false })}
            onConfirm={handleConfirmSaveVersion}
        />
      )}
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Producto' : `Editando: ${initialData.name}`}</h2>
      </div>
      
      <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          <TabButton title="General" icon="box-open" isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          <TabButton title="Marketing" icon="bullhorn" isActive={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} />
          <TabButton title="Planificación Publicación" icon="calendar-check" isActive={activeTab === 'planning'} onClick={() => setActiveTab('planning')} />
          <TabButton title="Contenido Amazon" icon="amazon" className="fab" isActive={activeTab === 'amazon'} onClick={() => setActiveTab('amazon')} />
          <TabButton title="Contenido Shopify" icon="shopify" className="fab" isActive={activeTab === 'shopify'} onClick={() => setActiveTab('shopify')} />
          <TabButton title="Composición" icon="flask" isActive={activeTab === 'composition'} onClick={() => setActiveTab('composition')} />
          <TabButton title="Etiquetas" icon="tags" isActive={activeTab === 'labels'} onClick={() => setActiveTab('labels')} />
          <TabButton title="Atributos Amazon" icon="at" isActive={activeTab === 'attributes'} onClick={() => setActiveTab('attributes')} />
          <TabButton title="Contenido Layer2" icon="layer-group" isActive={activeTab === 'layer2'} onClick={() => setActiveTab('layer2')} />
          <TabButton title="Tareas" icon="tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
          <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
        {activeTab === 'general' && <GeneralTab data={data} setData={setData} appData={appData} />}
        {activeTab === 'marketing' && <MarketingTab data={data} setData={setData} />}
        {activeTab === 'planning' && currentUser && <PublicationPlanningTab data={data} setData={setData} appData={appData} currentUser={currentUser} />}
        {activeTab === 'amazon' && currentUser && <AmazonTab data={data} setData={setData} appData={appData} currentUser={currentUser} />}
        {activeTab === 'shopify' && <ShopifyTab data={data.shopifyContent || { titleShopify: '', descriptionShopify: '', benefitsShopify: '', focusSummaryShopify: '' }} setData={(shopifyData) => setData(prev => ({ ...prev, shopifyContent: shopifyData }))} product={data} />}
        {activeTab === 'composition' && <CompositionTab product={data} setData={setData} appData={appData} />}
        {activeTab === 'labels' && <ProductLabelsTab product={data} appData={appData} onSelectItem={onSelectItem} onDuplicateEtiqueta={onDuplicateEtiqueta} />}
        {activeTab === 'attributes' && <AmazonAttributesTab data={data} setData={setData} appData={appData} />}
        {activeTab === 'layer2' && <Layer2ContentTab product={data} appData={appData} onContentChange={(layer2Data) => setData(prev => ({ ...prev, layer2Content: layer2Data }))} />}
        {/* FIX: Pass appData and onSelectItem props to TasksTab */}
        {activeTab === 'tasks' && <TasksTab data={data} appData={appData} onSelectItem={onSelectItem} />}
        {activeTab === 'notes' && <NotesTab data={data} appData={appData} onNoteAdd={onNoteAdd} onNoteUpdate={onNoteUpdate} onNoteDelete={onNoteDelete} />}
        {activeTab === 'history' && <HistoryTab data={data} appData={appData} />}
      </div>
    </div>
  );
};