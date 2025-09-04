import React, { useRef, useEffect } from 'react';
import { Icon } from '../common/Icon';
import type { Product, Country, Platform, CustomerSupportTicket, Batch, Envase, Etiqueta, Video, Ingredient, Note, TranslationTerm, ProductNotification, CompetitorBrand, CompetitorProduct, PurchaseOrder, DeliveryNote, Invoice, ContentRecipe, LogEntry, PromptTemplate, ImportExportTemplate, ExportJob, ImportJob, ImportJobChangeLog, AppData, AISettings, Pvpr, Price, PricingRule, PriceHistoryLog, User, Task, TaskComment, TaskSchema, Subtask, Proyecto, KnowledgeBaseEntry, KnowledgeBaseUsage, SequenceTemplate, VideoProject, MediaAsset, VideoCompositionTemplate, Entity, EntityType, AmazonFlashDeal } from '../../types/index';


interface DetailViewProps<T extends Entity> {
  entityType: EntityType;
  items: T[];
  onSelectItem: (entityType: EntityType, item: T) => void;
  onAddNew: (entityType: EntityType) => void;
  onExecuteRule?: (id: number) => void;
  // FIX: Update prop type to accept 'number | "new"' to align with the robust handleDelete function in App.tsx.
  onDeleteItem?: (entityType: EntityType, id: number | 'new') => void;
  pricingJobLog?: string[] | null;
  isPricingJobDone?: boolean;
  onPricingJobClose?: () => void;
  appData: AppData;
}

const ENTITY_CONFIG: Record<keyof AppData, { title: string, mainField: string, secondaryField?: string, disableAdd?: boolean }> = {
    products: { title: 'Productos', mainField: 'name', secondaryField: 'sku' },
    countries: { title: 'Países', mainField: 'name', secondaryField: 'iso' },
    platforms: { title: 'Plataformas', mainField: 'name' },
    tickets: { title: 'Tickets de Soporte', mainField: 'customerName', secondaryField: 'status' },
    batches: { title: 'Lotes', mainField: 'batchNumber', secondaryField: 'status' },
    envases: { title: 'Envases', mainField: 'name' },
    etiquetas: { title: 'Etiquetas', mainField: 'identifier' },
    videos: { title: 'Videos', mainField: 'name' },
    ingredients: { title: 'Ingredientes', mainField: 'latinName' },
    notes: { title: 'Notas', mainField: 'text' },
    logs: { title: 'Registro de Actividad', mainField: 'entityName', secondaryField: 'actionType', disableAdd: true },
    translationTerms: { title: 'Términos de Traducción', mainField: 'spanish' },
    productNotifications: { title: 'Notificaciones de Producto', mainField: 'id' },
    productPlatformStatuses: { title: 'Estado en Plataforma', mainField: 'productId' },
    competitorBrands: { title: 'Marcas de Competencia', mainField: 'name' },
    competitorProducts: { title: 'Productos de Competencia', mainField: 'name', secondaryField: 'asin' },
    purchaseOrders: { title: 'Pedidos de Fabricación', mainField: 'orderNumber', secondaryField: 'status' },
    deliveryNotes: { title: 'Albaranes de Entrega', mainField: 'deliveryNoteNumber', secondaryField: 'receivedDate' },
    invoices: { title: 'Facturas de Fabricante', mainField: 'invoiceNumber', secondaryField: 'status' },
    contentRecipes: { title: 'Recetas de Contenido', mainField: 'name', secondaryField: 'target' },
    promptTemplates: { title: 'Plantillas de IA', mainField: 'name', secondaryField: 'category' },
    importExportTemplates: { title: 'Plantillas de Import/Export', mainField: 'name', secondaryField: 'entity' },
    importJobs: { title: 'Trabajos de Importación', mainField: 'id', secondaryField: 'status', disableAdd: true },
    exportJobs: { title: 'Trabajos de Exportación', mainField: 'id', secondaryField: 'summary', disableAdd: true },
    importJobChangeLogs: { title: 'Logs de Cambios de Importación', mainField: 'id', secondaryField: 'jobId', disableAdd: true },
    aiSettings: { title: 'Ajustes de IA', mainField: 'globalTranslationRules', disableAdd: true },
    pvprs: { title: 'PVPRs', mainField: 'productId', secondaryField: 'amount', disableAdd: true },
    prices: { title: 'Precios Calculados', mainField: 'productId', secondaryField: 'amount', disableAdd: true },
    pricingRules: { title: 'Reglas de Precios', mainField: 'name' },
    priceHistoryLogs: { title: 'Historial de Precios', mainField: 'timestamp', secondaryField: 'trigger', disableAdd: true },
    amazonFlashDeals: { title: 'Ofertas Flash de Amazon', mainField: 'name', secondaryField: 'status' },
    users: { title: 'Usuarios', mainField: 'name', secondaryField: 'role' },
    tasks: { title: 'Tareas', mainField: 'name', secondaryField: 'status' },
    taskComments: { title: 'Comentarios de Tareas', mainField: 'text', secondaryField: 'authorId', disableAdd: true },
    taskSchemas: { title: 'Esquemas de Trabajo', mainField: 'name' },
    subtasks: { title: 'Subtareas', mainField: 'name', secondaryField: 'taskId', disableAdd: true },
    proyectos: { title: 'Proyectos', mainField: 'name', secondaryField: 'status' },
    knowledgeBaseEntries: { title: 'Base de Conocimiento', mainField: 'title', secondaryField: 'category' },
    knowledgeBaseUsages: { title: 'Uso de Base de Conocimiento', mainField: 'entryId', secondaryField: 'entityType', disableAdd: true },
    sequenceTemplates: { title: 'Plantillas de Secuencia', mainField: 'name', secondaryField: 'category' },
    videoCompositionTemplates: { title: 'Plantillas de Vídeo', mainField: 'name', secondaryField: 'description' },
    videoProjects: { title: 'Proyectos de Vídeo', mainField: 'name', secondaryField: 'status' },
    mediaAssets: { title: 'Biblioteca de Medios', mainField: 'name', secondaryField: 'description' },
};

const renderLogEntry = (entry: string) => {
    if (entry.startsWith('  - ✅')) return <p className="text-green-400">{entry}</p>;
    if (entry.startsWith('  - ❗')) return <p className="text-yellow-400">{entry}</p>;
    if (entry.startsWith('✅')) return <p className="font-bold text-green-300 mt-2">{entry}</p>;
    return <p className="text-slate-400">{entry}</p>;
};

export function DetailView<T extends Entity>({ entityType, items, onAddNew, onSelectItem, onExecuteRule, onDeleteItem, pricingJobLog, isPricingJobDone, onPricingJobClose, appData }: DetailViewProps<T>) {
    const config = ENTITY_CONFIG[entityType];
    const isPricingRuleView = entityType === 'pricingRules';
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [pricingJobLog]);

    const header = (
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center gap-4 flex-wrap flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-200">{config.title}</h1>
            <div className="flex items-center space-x-2">
                {!config.disableAdd && (
                    <button
                        onClick={() => onAddNew(entityType)}
                        className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                    >
                        <Icon name="plus" className="mr-2" />
                        Añadir Nuevo
                    </button>
                )}
            </div>
        </div>
    );

    const table = (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                        {isPricingRuleView && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Activa</th>}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            {String(config.mainField)}
                        </th>
                        {config.secondaryField && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                {String(config.secondaryField)}
                            </th>
                        )}
                        {isPricingRuleView && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fecha Inicio</th>}
                        {isPricingRuleView && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fecha Fin</th>}
                        {isPricingRuleView && (
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {items.map((item) => {
                         const rule = isPricingRuleView ? (item as PricingRule) : null;
                         const noteCount = appData.notes.filter(n => n.entityType === entityType && n.entityId === item.id && n.status === 'Activa').length;

                         return (
                        <tr key={(item as any).id} className="hover:bg-slate-700/50" >
                            {isPricingRuleView && rule && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <Icon name={rule.isActive ? 'check-circle' : 'times-circle'} className={rule.isActive ? 'text-green-400' : 'text-red-400'} />
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200 cursor-pointer" onClick={() => onSelectItem(entityType, item)}>
                                <div className="flex items-center">
                                    <span>{(item as any)[config.mainField]}</span>
                                    {noteCount > 0 && <span title={`${noteCount} notas activas`} className="ml-2 flex items-center text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full"><Icon name="comment-dots" className="mr-1"/>{noteCount}</span>}
                                </div>
                            </td>
                            {config.secondaryField && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 cursor-pointer" onClick={() => onSelectItem(entityType, item)}>
                                    {(item as any)[config.secondaryField]}
                                </td>
                            )}
                            {isPricingRuleView && rule && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{rule.startDate || '-'}</td>}
                            {isPricingRuleView && rule && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{rule.endDate || '-'}</td>}
                            {isPricingRuleView && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={(e) => { e.stopPropagation(); onExecuteRule?.((item as any).id as number); }} className="px-3 py-1 bg-blue-500/80 text-white rounded-md hover:bg-blue-500 text-xs font-semibold">Ejecutar</button>
                                    <button onClick={(e) => { e.stopPropagation(); onSelectItem(entityType, item); }} className="px-3 py-1 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 text-xs font-semibold">Editar</button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteItem?.(entityType, (item as any).id); }} className="px-3 py-1 bg-red-500/80 text-white rounded-md hover:bg-red-500 text-xs font-semibold">Borrar</button>
                                </td>
                            )}
                        </tr>
                    )})}
                </tbody>
            </table>
            {items.length === 0 && (
                <div className="text-center p-12 text-slate-500">
                    <Icon name="folder-open" className="text-4xl mb-4" />
                    <p>No hay {config.title.toLowerCase()} para mostrar.</p>
                </div>
            )}
        </div>
    );
    
    const logPanel = (
        <div className="flex-shrink-0 border-t-2 border-slate-700 bg-slate-800">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-200 flex items-center">
                    <Icon name={isPricingJobDone ? 'check-circle' : 'cogs'} className={isPricingJobDone ? 'mr-2 text-green-400' : 'mr-2 text-cyan-400 fa-spin'} />
                    {isPricingJobDone ? "Proceso Completado" : "Procesando Regla de Precios..."}
                </h3>
                <button onClick={onPricingJobClose} className="text-slate-400 hover:text-white">
                    <Icon name="times" />
                </button>
            </div>
            <div ref={logContainerRef} className="p-4 h-48 overflow-y-auto font-mono text-xs space-y-1 bg-slate-900/50">
                {pricingJobLog?.map((entry, index) => (
                    <div key={index}>{renderLogEntry(entry)}</div>
                ))}
            </div>
        </div>
    );

    if (isPricingRuleView && pricingJobLog) {
        return (
            <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-800 rounded-lg overflow-hidden">
                <div className="flex-grow flex flex-col min-h-0">
                    {header}
                    <div className="flex-grow overflow-y-auto">
                        {table}
                    </div>
                </div>
                {logPanel}
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
            {header}
            {table}
        </div>
    );
}