import React, { useState, useCallback, FC, useEffect, useRef } from 'react';
// FIX: Corrected typo in type import from 'Etiquette' to 'Etiqueta'.
import type { AppData, Product, Country, Platform, CustomerSupportTicket, Envase, Etiqueta, Video, Ingredient, Note, TranslationTerm, ProductNotification, CompetitorBrand, CompetitorProduct, NoteAttachment, NoteEntityType, ContentRecipe, LoggedEntityType, LogEntry, PromptTemplate, ImportExportTemplate, ImportJob, ImportJobChangeLog, ShopifyContent, Layer2Content, PublicationField, AmazonContent, AmazonBulletPoint, AmazonInfographic, ImportJobChangeLogEntry, ExportJob, ChangeDetail, AISettings, Pvpr, PricingRule, Price, PriceHistoryLog, User, Task, TaskComment, TaskSchema, TemplateTask, Subtask, Proyecto, KnowledgeBaseEntry, KnowledgeBaseUsage, SequenceTemplate, VideoProject, MediaAsset, VideoCompositionTemplate, ProjectSequence, Entity, EntityType, AmazonFlashDeal, LinkedEntity } from './types/index';
import { DEMO_DATA } from './data/demoData';
import { Sidebar } from './components/layout/Sidebar';
// FIX: Import only the component from DetailView, not the types.
import { DetailView } from './components/layout/DetailView';
import { generateChangeDetails } from './utils/changeTracker';
import { createZip, parseCsv, triggerDownload, unparseCsv } from './utils/fileUtils';
import { get, set, isEqual } from 'lodash-es';
import { resolveCellValue } from './services/formulaService';
import { calculatePrice } from './services/pricingService';
import { LoginView } from './views/LoginView';
import { hasPermission } from './utils/authUtils';
import { AccessDeniedView } from './views/AccessDeniedView';
import { resolvePrompt } from './services/placeholderService';
import { calculateNextDueDate } from './utils/taskUtils';
import { getHealth } from './services/coreApi';


// Import Dashboards
import { NotificationsDashboard } from './dashboards/NotificationsDashboard';
import { ContentMaturityDashboard } from './dashboards/ContentMaturityDashboard';
import { ImportExportDashboard } from './views/ImportExportDashboard';
import { PvprMatrixDashboard } from './dashboards/PvprMatrixDashboard';
import { PricesByPlatformDashboard } from './dashboards/PricesByPlatformDashboard';
import { TaskBoardDashboard } from './dashboards/TaskBoardDashboard';
import { ProjectsDashboard } from './dashboards/ProjectsDashboard';
import { VideoStudioDashboard } from './views/VideoStudioDashboard';
import { PriceHistoryLogDashboard } from './dashboards/PriceHistoryLogDashboard';
import { PricingDashboard } from './dashboards/PricingDashboard';
import { AmazonFlashDealDashboard } from './dashboards/AmazonFlashDealDashboard';
import { ReportsDashboard } from './dashboards/ReportsDashboard';


// Import Modals
import { ExportModal } from './components/modals/ExportModal';
import { ImportModal } from './components/modals/ImportModal';
import { ImportPreviewModal, ImportPreviewState, UpdatePreview, ImportError } from './components/modals/ImportPreviewModal';

// Import View Components
import { ProductDetailView } from './views/ProductDetailView';
import { CountryDetailView } from './views/CountryDetailView';
import { PlatformDetailView } from './views/PlatformDetailView';
import { TicketDetailView } from './views/TicketDetailView';
import { EnvaseDetailView } from './views/EnvaseDetailView';
import { EtiquetaDetailView } from './views/EtiquetaDetailView';
import { VideoDetailView } from './views/VideoDetailView';
import { IngredientDetailView } from './views/IngredientDetailView';
import { TranslationTermDetailView } from './views/TranslationTermDetailView';
import { ProductNotificationDetailView } from './views/ProductNotificationDetailView';
import { CompetitorBrandDetailView } from './views/CompetitorBrandDetailView';
import { CompetitorProductDetailView } from './views/CompetitorProductDetailView';
import { ProductNotificationListView } from './views/ProductNotificationListView';
import { CompetitorBrandListView } from './views/CompetitorBrandListView';
import { AllNotesListView } from './views/AllNotesListView';
import { ContentRecipeDetailView } from './views/ContentRecipeDetailView';
import { PromptTemplateDetailView } from './views/PromptTemplateDetailView';
import { AllLogsView } from './views/AllLogsView';
import { PublicationTemplateDetailView } from './views/ImportExportTemplateDetailView';
import { AISettingsView } from './views/AISettingsView';
import { PricingRuleDetailView } from './views/PricingRuleDetailView';
import { UserDetailView } from './views/UserDetailView';
import { TaskDetailView } from './views/TaskDetailView';
import { TaskSchemaDetailView } from './views/TaskSchemaDetailView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { KnowledgeBaseEntryDetailView } from './views/KnowledgeBaseEntryDetailView';
import { SequenceTemplateDetailView } from './views/SequenceTemplateDetailView';
import { VideoCompositionTemplateDetailView } from './views/VideoTemplateDetailView';
import { VideoProjectDetailView } from './views/VideoProjectDetailView';
import { MediaAssetDetailView } from './views/MediaAssetDetailView';
import { AmazonFlashDealDetailView } from './views/AmazonFlashDealDetailView';
import { Icon } from './components/common/Icon';
import { GlobalTranslationPanel } from './components/common/GlobalTranslationPanel';
import { GlobalProductInspector } from './components/common/GlobalProductInspector';
import { EtiquetaListView } from './views/EtiquetaListView';


type DashboardId = 'notifications' | 'contentMaturity' | 'importExport' | 'pvprMatrix' | 'tasks' | 'proyectos' | 'videoStudio' | 'pricesByPlatform' | 'priceHistoryLogs' | 'pricingDashboard' | 'amazonFlashDeals' | 'reports';

type ActiveView =
  | { type: 'dashboard'; entityType: DashboardId }
  | { type: 'list'; entityType: EntityType }
  | { type: 'detail'; entityType: EntityType; entity: Entity }
  | { type: 'aiSettings' };


const TRACKED_ENTITIES: LoggedEntityType[] = ['products', 'etiquetas', 'ingredients', 'productNotifications', 'knowledgeBaseEntries', 'videos'];

type UnsavedChangesModalState = {
    isOpen: boolean;
    onConfirm: () => void;
    onDiscard: () => void;
}

const App: FC = () => {
    const [appData, setAppData] = useState<AppData>(DEMO_DATA);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<ActiveView | null>(null);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        entityType: EntityType;
        id: number;
        name: string;
    } | null>(null);
    
    const [unsavedChangesModal, setUnsavedChangesModal] = useState<UnsavedChangesModalState>({
        isOpen: false,
        onConfirm: () => {},
        onDiscard: () => {},
    });

    // This ref will hold the save function of the currently active detail view
    const activeSaveHandler = useRef<((onSuccess?: () => void) => void) | null>(null);

    const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
    const toggleTranslationPanel = () => setIsTranslationPanelOpen(prev => !prev);

    useEffect(() => {
        getHealth().then(res => {
            console.log('CORE health:', res);
        }).catch(err => {
            console.warn('CORE health check failed', err);
        });
    }, []);
    
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const toggleInspectorPanel = () => setIsInspectorOpen(prev => !prev);
    const [pricingJobLog, setPricingJobLog] = useState<string[] | null>(null);
    const [isPricingJobDone, setIsPricingJobDone] = useState<boolean>(false);

    const [lastSavedEntity, setLastSavedEntity] = useState<{ entityType: EntityType; entity: Entity; isNew: boolean } | null>(null);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey) {
                if (event.key === 'L') {
                    event.preventDefault();
                    toggleTranslationPanel();
                }
                if (event.key === 'P') {
                    event.preventDefault();
                    toggleInspectorPanel();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        // Set a default view for all users upon login
        setActiveView({ type: 'dashboard', entityType: 'tasks' });
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveView(null);
    };

    const handleSelectView = useCallback((view: ActiveView) => {
        const navigate = () => {
            const key = view.type === 'dashboard' ? view.entityType : view.type === 'aiSettings' ? 'aiSettings' : view.type === 'list' ? view.entityType : view.type === 'detail' ? view.entityType : 'products';
            // FIX: Explicitly cast 'key' to string to satisfy 'hasPermission' function signature and avoid potential type errors.
            if (currentUser && hasPermission(currentUser, String(key))) {
                setActiveView(view);
                setIsFormDirty(false);
                activeSaveHandler.current = null;
            } else {
                // FIX: Explicitly cast 'key' to string for the console warning to prevent potential runtime errors with symbols.
                console.warn(`Permission denied for view: ${String(key)}`);
                setActiveView({ type: 'list', entityType: 'products' }); // Redirect to a safe default
                setIsFormDirty(false);
                activeSaveHandler.current = null;
            }
        };

        if (isFormDirty) {
            setUnsavedChangesModal({
                isOpen: true,
                onConfirm: () => { // Save and Exit
                    setUnsavedChangesModal({ isOpen: false, onConfirm: () => {}, onDiscard: () => {} });
                    if (activeSaveHandler.current) {
                        activeSaveHandler.current(navigate); // Pass navigate as the success callback
                    }
                },
                onDiscard: () => { // Exit without Saving
                    setUnsavedChangesModal({ isOpen: false, onConfirm: () => {}, onDiscard: () => {} });
                    navigate();
                },
            });
        } else {
            navigate();
        }
    }, [currentUser, isFormDirty]);
    
    const handleSave = useCallback((entityType: EntityType, data: Entity) => {
        setIsFormDirty(false);
        const isNew = data.id === 'new';
        
        setAppData(prevData => {
            // FIX: Add guard to ensure user has a valid ID before creating log entries. This resolves potential type errors.
            if (typeof currentUser?.id !== 'number') {
                console.error("Save operation cancelled: current user does not have a valid numeric ID.");
                return prevData;
            }

            const newAppData = JSON.parse(JSON.stringify(prevData));
            const items = newAppData[entityType] as Entity[];
            let newLogEntries: LogEntry[] = [];
            let newTasksFromAutomation: Omit<Task, 'id'>[] = [];
            let finalItems: Entity[];
            let finalData: Entity = data;
            const now = new Date().toISOString();
            // FIX: Check if entity is an array before calling 'find' to satisfy TypeScript's strict type checking.
            const oldEntity = !isNew && Array.isArray(prevData[entityType]) ? (prevData[entityType] as Entity[]).find((item: any) => item.id === data.id) : null;
            
            // --- Special handler for Knowledge Base versioning ---
            if (entityType === 'knowledgeBaseEntries') {
                const kbEntry = data as KnowledgeBaseEntry;
                if (!isNew && oldEntity && (oldEntity as KnowledgeBaseEntry).status === 'Aprobado') {
                    const oldEntry = oldEntity as KnowledgeBaseEntry;
                    const newId = Math.max(0, ...items.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                    const newVersion: KnowledgeBaseEntry = {
                        ...kbEntry,
                        id: newId,
                        version: oldEntry.version + 1,
                        parentId: oldEntry.parentId || oldEntry.id as number,
                        createdAt: now,
                        updatedAt: now,
                        status: 'Borrador',
                    };
                    const archivedOldVersion: KnowledgeBaseEntry = {
                        ...oldEntry,
                        status: 'Archivado',
                        updatedAt: now,
                    };
                    finalItems = items.map(item => item.id === oldEntry.id ? archivedOldVersion : item).concat(newVersion);
                    finalData = newVersion;
                    newLogEntries.push({
                        id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser!.name,
                        actionType: 'Actualización', entityType: 'knowledgeBaseEntries', entityId: newId,
                        entityName: `${newVersion.title} (v${newVersion.version})`,
                        changes: [{ field: 'versioning', fieldName: 'Versionado', oldValue: `v${oldEntry.version}`, newValue: `v${newVersion.version}` }],
                    });
                }
            }

            if (!finalData.id || finalData.id === 'new') {
                const newId = Math.max(0, ...items.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                finalData = { ...data, id: newId };
                
                if (entityType === 'videoProjects') {
                    // ... video project logic ...
                }
                
                finalItems = [...items, finalData];
                if (TRACKED_ENTITIES.includes(entityType as LoggedEntityType)) {
                    newLogEntries.push({
                        id: 'new', timestamp: now, userId: currentUser!.id, userName: currentUser!.name,
                        actionType: 'Creación', entityType: entityType as LoggedEntityType, entityId: finalData.id,
                        entityName: (finalData as any).name || (finalData as any).identifier || (finalData as any).title || `ID: ${newId}`,
                    });
                }
            } else {
                finalItems = items.map(item => item.id === finalData.id ? finalData : item);
                if (oldEntity && TRACKED_ENTITIES.includes(entityType as LoggedEntityType)) {
                    const changes = generateChangeDetails(entityType, oldEntity, finalData, prevData);
                    if (changes.length > 0) {
                        newLogEntries.push({
                            id: 'new', timestamp: now, userId: currentUser!.id, userName: currentUser!.name,
                            actionType: 'Actualización', entityType: entityType as LoggedEntityType, entityId: finalData.id,
                            entityName: (finalData as any).name || (finalData as any).identifier || (finalData as any).title || `ID: ${finalData.id}`,
                            changes,
                        });
                    }
                }
            }
            
            newAppData[entityType] = finalItems;

            // --- Special handlers on the newAppData ---
            if (entityType === 'tasks' && oldEntity) {
                const oldTask = oldEntity as Task;
                const newTask = finalData as Task;
                //... dependency & recurrence logic on newAppData.tasks
            }
            // ... other special handlers

            // --- Finalize Logs & Tasks ---
            if (newTasksFromAutomation.length > 0) {
                 //... add tasks to newAppData.tasks
            }
            let nextLogId = Math.max(0, ...newAppData.logs.map((l: any) => typeof l.id === 'number' ? l.id : 0)) + 1;
            newAppData.logs.push(...newLogEntries.map(log => ({...log, id: nextLogId++})));
            
            // Trigger the useEffect to update the view
            setLastSavedEntity({ entityType, entity: finalData, isNew });
            
            return newAppData;
        });
    }, [currentUser]);

    useEffect(() => {
        if (lastSavedEntity) {
            const { entityType, entity, isNew } = lastSavedEntity;

            if (isNew) {
                setActiveView({ type: 'detail', entityType, entity });
            } else {
                setActiveView(prev => {
                    if (prev?.type === 'detail') {
                        return { ...prev, entity };
                    }
                    return prev;
                });
                alert('Cambios guardados correctamente.');
            }

            setLastSavedEntity(null); // Reset the trigger
        }
    }, [lastSavedEntity]);

    const handleSubtaskChange = useCallback((updatedSubtask: Subtask) => {
        setAppData(prev => {
            let newSubtasks;
            const existing = prev.subtasks.find(s => s.id === updatedSubtask.id);
            
            if (existing) {
                newSubtasks = prev.subtasks.map(s => s.id === updatedSubtask.id ? updatedSubtask : s);
            } else {
                 const newId = Math.max(0, ...prev.subtasks.map(s => typeof s.id === 'number' ? s.id : 0)) + 1;
                 newSubtasks = [...prev.subtasks, { ...updatedSubtask, id: newId }];
            }
            return { ...prev, subtasks: newSubtasks };
        });
    }, []);

    const handleDeleteSubtask = useCallback((subtaskId: number) => {
        setAppData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
        }));
    }, []);

    const handleSavePvprs = useCallback((updatedPvprs: Pvpr[]) => {
        setAppData(prev => {
            const newPvprs = [...prev.pvprs];
            updatedPvprs.forEach(updated => {
                const index = newPvprs.findIndex(p => p.id === updated.id);
                if (index > -1) {
                    newPvprs[index] = updated;
                } else {
                    // This logic assumes new entries have a temporary negative ID
                    const newId = Math.max(0, ...prev.pvprs.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                    newPvprs.push({ ...updated, id: newId });
                }
            });
            return { ...prev, pvprs: newPvprs };
        });
        alert('PVPRs guardados correctamente.');
    }, []);
    
    const handleSavePrices = useCallback((updatedPrices: Price[]) => {
        setAppData(prev => {
            const newPrices = [...prev.prices];
            const now = new Date().toISOString();
            const newPriceHistoryLogs: PriceHistoryLog[] = [];

            if (typeof currentUser?.id !== 'number') return prev;

            updatedPrices.forEach(updated => {
                const index = newPrices.findIndex(p => p.id === updated.id);
                if (index > -1) {
                    const oldPrice = newPrices[index];
                    const finalUpdated: Price = { ...updated, lastUpdatedBy: 'manual' };

                    const hasChanged = 
                        (oldPrice.amount) !== (finalUpdated.amount) ||
                        (oldPrice.discountPercentage ?? null) !== (finalUpdated.discountPercentage ?? null) ||
                        (oldPrice.couponPercentage ?? null) !== (finalUpdated.couponPercentage ?? null);

                    if (hasChanged) {
                        newPriceHistoryLogs.push({
                            id: 'new',
                            timestamp: now,
                            userId: currentUser.id,
                            userName: currentUser.name,
                            productId: finalUpdated.productId,
                            platformId: finalUpdated.platformId,
                            countryId: finalUpdated.countryId,
                            oldAmount: oldPrice.amount,
                            newAmount: finalUpdated.amount,
                            oldDiscountPercentage: oldPrice.discountPercentage,
                            newDiscountPercentage: finalUpdated.discountPercentage,
                            oldCouponPercentage: oldPrice.couponPercentage,
                            newCouponPercentage: finalUpdated.couponPercentage,
                            currency: finalUpdated.currency,
                            source: { type: 'manual', id: currentUser.id, name: `Ajuste por ${currentUser.name}` },
                            trigger: 'manual_override',
                        });
                    }
                    
                    newPrices[index] = finalUpdated;

                } else {
                    const newId = Math.max(0, ...prev.prices.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                    newPrices.push({ ...updated, id: newId, lastUpdatedBy: 'manual' });
                }
            });
            
            let nextLogId = Math.max(0, ...prev.priceHistoryLogs.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const finalLogs = newPriceHistoryLogs.map(p => p.id === 'new' ? { ...p, id: nextLogId++ } : p);

            return { ...prev, prices: newPrices, priceHistoryLogs: [...prev.priceHistoryLogs, ...finalLogs] };
        });
        alert('Precios guardados correctamente.');
    }, [currentUser]);

    const handleSaveAiSettings = useCallback((settings: AISettings) => {
        setAppData(prev => ({ ...prev, aiSettings: settings }));
        alert("Ajustes de IA guardados.");
        // Optionally, redirect to another view or stay on the page
        setActiveView({ type: 'dashboard', entityType: 'importExport' });
    }, []);

    const confirmDelete = useCallback(() => {
        if (!deleteConfirmation) return;
        const { entityType, id } = deleteConfirmation;

        setAppData(prevData => {
            const items = prevData[entityType] as Entity[];
            const itemToDelete = items.find(item => item.id === id);
            let newLog: LogEntry | null = null;
            
            if (itemToDelete && TRACKED_ENTITIES.includes(entityType as LoggedEntityType)) {
                newLog = {
                    id: 'new',
                    timestamp: new Date().toISOString(),
                    userId: currentUser?.id as number || 0,
                    userName: currentUser?.name || 'Sistema',
                    actionType: 'Eliminación',
                    entityType: entityType as LoggedEntityType,
                    entityId: id,
                    // @ts-ignore
                    entityName: itemToDelete.name || itemToDelete.identifier || itemToDelete.title || `ID: ${id}`,
                };
            }
            
            const newLogs = newLog ? [...prevData.logs, {...newLog, id: Math.max(0, ...prevData.logs.map(l => typeof l.id === 'number' ? l.id : 0)) + 1 }] : prevData.logs;

            return {
                ...prevData,
                [entityType]: items.filter(item => item.id !== id),
                logs: newLogs
            };
        });
        
        setDeleteConfirmation(null); // Close modal
        setIsFormDirty(false); // Reset dirty flag

        if (entityType !== 'notes') {
             if (entityType === 'tasks' || entityType === 'taskSchemas') {
                setActiveView({ type: 'dashboard', entityType: 'tasks' });
            } else if (entityType === 'productNotifications') {
                setActiveView({ type: 'dashboard', entityType: 'notifications' });
            } else if (entityType === 'videoProjects' || entityType === 'sequenceTemplates' || entityType === 'mediaAssets' || entityType === 'videoCompositionTemplates') {
                setActiveView({ type: 'dashboard', entityType: 'videoStudio' });
            } else {
                setActiveView({ type: 'list', entityType });
            }
        }
    }, [deleteConfirmation, currentUser]);

    // FIX: Update `id` parameter to accept `number | 'new'` and add a type guard to prevent attempting to delete unsaved entities. This resolves type errors at call sites.
    const handleDelete = useCallback((entityType: EntityType, id: number | 'new') => {
        if (typeof id !== 'number') {
            // Cannot delete an item that hasn't been saved.
            // Silently return or show a message to the user.
            if (activeView?.type === 'detail' && activeView.entity.id === 'new') {
                // If it's a new entity, "deleting" is like canceling.
                if (entityType === 'proyectos') {
                    handleSelectView({ type: 'dashboard', entityType: 'proyectos' });
                } else if (entityType === 'knowledgeBaseEntries') {
                     handleSelectView({ type: 'list', entityType: 'knowledgeBaseEntries' });
                } else if (entityType === 'videoProjects') {
                    handleSelectView({ type: 'dashboard', entityType: 'videoStudio' });
                } else if (entityType === 'amazonFlashDeals') {
                    handleSelectView({ type: 'dashboard', entityType: 'amazonFlashDeals' });
                } else {
                    handleSelectView({ type: 'list', entityType: activeView.entityType });
                }
            }
            return;
        }

        const items = appData[entityType] as Entity[];
        const itemToDelete = items.find(item => item.id === id);
        if (!itemToDelete) return;

        setDeleteConfirmation({
            entityType,
            id,
            // @ts-ignore
            name: itemToDelete.name || itemToDelete.identifier || itemToDelete.title || `ID: ${id}`,
        });
    }, [appData, activeView, handleSelectView]);

    const handleNoteAdd = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => {
        const newId = Math.max(0, ...appData.notes.map(n => typeof n.id === 'number' ? n.id : 0)) + 1;
        const newNote: Note = {
            ...note,
            id: newId,
            authorName: currentUser?.name || 'Sistema',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Activa',
        };
        setAppData(prev => ({...prev, notes: [...prev.notes, newNote]}));
    }, [appData.notes, currentUser]);
    
    const handleUsageAdd = useCallback((usage: Omit<KnowledgeBaseUsage, 'id'>) => {
        setAppData(prev => {
            const newId = Math.max(0, ...(prev.knowledgeBaseUsages || []).map(u => typeof u.id === 'number' ? u.id : 0)) + 1;
            const newUsage: KnowledgeBaseUsage = {
                ...usage,
                id: newId,
                userId: currentUser?.id as number,
                usedAt: new Date().toISOString(),
            };
            return { ...prev, knowledgeBaseUsages: [...(prev.knowledgeBaseUsages || []), newUsage]};
        });
    }, [currentUser]);
    
    const handleTaskCommentAdd = useCallback((comment: Omit<TaskComment, 'id' | 'createdAt'>) => {
        const newId = Math.max(0, ...appData.taskComments.map(c => typeof c.id === 'number' ? c.id : 0)) + 1;
        const newComment: TaskComment = {
            ...comment,
            id: newId,
            authorId: currentUser?.id as number,
            createdAt: new Date().toISOString(),
        };
        setAppData(prev => ({ ...prev, taskComments: [...prev.taskComments, newComment] }));
    }, [appData.taskComments, currentUser]);

    const handleNoteUpdate = useCallback((updatedNote: Note) => {
        setAppData(prev => ({
            ...prev,
            notes: prev.notes.map(n => n.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString(), authorName: currentUser?.name || 'Sistema' } : n)
        }));
    }, [currentUser]);

    const handleNoteDelete = useCallback((noteId: number | 'new') => {
        if (typeof noteId === 'number') {
            setAppData(prev => ({...prev, notes: prev.notes.filter(n => n.id !== noteId)}));
        }
    }, []);
    
    const handleNotificationStatusChange = useCallback((productId: number, countryId: number, status: ProductNotification['status']) => {
        setAppData(prevData => {
            const existingNotification = prevData.productNotifications.find(
                n => n.productId === productId && n.countryId === countryId
            );

            if (existingNotification) {
                // Update existing notification
                const updatedNotifications = prevData.productNotifications.map(n =>
                    n.id === existingNotification.id ? { ...n, status } : n
                );
                return { ...prevData, productNotifications: updatedNotifications };
            } else {
                // Create new notification
                const newId = Math.max(0, ...prevData.productNotifications.map(n => typeof n.id === 'number' ? n.id : 0)) + 1;
                const newNotification: ProductNotification = {
                    id: newId,
                    productId,
                    countryId,
                    status,
                    notifiedBy: '', // Default value
                };
                return { ...prevData, productNotifications: [...prevData.productNotifications, newNotification] };
            }
        });
    }, []);

    const handleEditNotificationDetails = useCallback((notification: ProductNotification) => {
        handleSelectView({
            type: 'detail',
            entityType: 'productNotifications',
            entity: notification
        });
    }, [handleSelectView]);


    const handleSelectItem = (entityType: EntityType, item: Entity) => {
        handleSelectView({ type: 'detail', entity: item, entityType });
    };
    
    // FIX: Changed parameter `etiquetaId` to accept `number | 'new'` to match its usage. Added a guard to handle the `'new'` case gracefully.
    const handleDuplicateEtiqueta = useCallback((etiquetaId: number | 'new') => {
        if (typeof etiquetaId !== 'number') {
            alert('No se puede duplicar una etiqueta no guardada.');
            return;
        }

        const originalEtiqueta = appData.etiquetas.find(e => e.id === etiquetaId);
        if (!originalEtiqueta) {
            alert('No se encontró la etiqueta original para duplicar.');
            return;
        }

        const duplicatedEtiqueta: Etiqueta = {
            ...originalEtiqueta,
            id: 'new',
            identifier: `${originalEtiqueta.identifier} (Copia)`,
            createdAt: new Date().toISOString(),
            status: 'Pendiente enviar a imprenta',
        };

        handleSelectView({ type: 'detail', entity: duplicatedEtiqueta, entityType: 'etiquetas' });
    }, [appData.etiquetas, handleSelectView]);

    const handleAddNew = (entityType: EntityType) => {
        if (!currentUser || !hasPermission(currentUser, entityType)) {
            alert('No tienes permiso para crear este tipo de entidad.');
            return;
        }
        let newItem: Entity | null = null;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();

        switch (entityType) {
            case 'products': newItem = { id: 'new', name: '', sku: '', status: 'En Estudio', amazonContents: [], composition: [], videoIds: [] } as Product; break;
            case 'countries': newItem = { id: 'new', name: '', iso: '' } as Country; break;
            case 'platforms': newItem = { id: 'new', name: '', countryId: 0, type: '', status: 'En estudio', shipsBy: 'Platform' } as Platform; break;
            case 'tickets': newItem = { id: 'new', customerName: '', channel: 'Email', status: 'Abierto', entryDate: today} as CustomerSupportTicket; break;
            case 'envases': newItem = { id: 'new', name: '' } as Envase; break;
            case 'etiquetas': newItem = { id: 'new', identifier: '', createdAt: now, status: 'Pendiente enviar a imprenta', creationType: 'Etiqueta 0', contentByLanguage: [], ingredientSnapshot: [] } as Etiqueta; break;
            case 'videos': newItem = { id: 'new', name: '', url: '', platform: '', type: 'Producto', duration: 0, status: 'Planificado', countryId: 0 } as Video; break;
            case 'ingredients': newItem = { id: 'new', latinName: '', type: '', measureUnit: 'mg', countryDetails: [] } as Ingredient; break;
            case 'notes': newItem = {id: 'new', entityType: 'products', entityId: 0, authorName: currentUser?.name || 'Sistema', text: '', createdAt: now, updatedAt: now, status: 'Activa'} as Note; break;
            // FIX: Correct `TranslationTerm` creation to use `spanish` property instead of `key`.
            case 'translationTerms': newItem = { id: 'new', spanish: '', translations: [] } as TranslationTerm; break;
            case 'productNotifications': newItem = { id: 'new', productId: 0, countryId: 0, status: 'Pendiente', notifiedBy: ''} as ProductNotification; break;
            case 'competitorBrands': newItem = { id: 'new', name: '' } as CompetitorBrand; break;
            case 'competitorProducts': newItem = { id: 'new', competitorBrandId: null, countryId: 0, asin: '', name: '', snapshots: [] } as CompetitorProduct; break;
            case 'contentRecipes': newItem = { id: 'new', name: '', target: 'title', parts: [] } as ContentRecipe; break;
            case 'promptTemplates': newItem = { id: 'new', name: '', category: 'Revisión', description: '', template: '', entityType: 'general' } as PromptTemplate; break;
            case 'importExportTemplates': newItem = { id: 'new', name: '', entity: 'products', templateType: 'publication', fields: [] } as ImportExportTemplate; break;
            case 'pricingRules': newItem = { id: 'new', name: '', isActive: true, scope: { productIds: null, platformIds: null, countryIds: null }, calculation: { method: 'USE_PVPR' } } as PricingRule; break;
            case 'amazonFlashDeals': newItem = { id: 'new', name: '', productId: 0, platformId: 0, asin: '', startDate: now, endDate: now, dealPrice: 0, currency: 'EUR', status: 'Borrador' } as AmazonFlashDeal; break;
            case 'users': newItem = { id: 'new', name: '', email: '', role: 'Nivel 3', allowedViews: [] } as User; break;
            case 'tasks': newItem = { id: 'new', name: '', description: '', status: 'Pendiente', priority: 'Media', assigneeId: currentUser?.id as number, creatorId: currentUser?.id as number, createdAt: now, updatedAt: now, linkedEntity: { entityType: 'products', entityId: 0, entityName: ''}, tags: [], blocks: [], isBlockedBy: [] } as Task; break;
            case 'taskSchemas': newItem = { id: 'new', name: '', description: '', trigger: { type: 'manual' }, templateTasks: [] } as TaskSchema; break;
            case 'proyectos': newItem = { id: 'new', name: '', taskSchemaId: 0, status: 'Activo', createdAt: now, ownerId: currentUser?.id as number } as Proyecto; break;
            case 'knowledgeBaseEntries': newItem = { id: 'new', title: '', description: '', entryType: 'Texto', category: 'General', tags: [], content: {}, createdAt: now, updatedAt: now, status: 'Borrador', version: 1, parentId: null } as KnowledgeBaseEntry; break;
            case 'sequenceTemplates': newItem = { id: 'new', name: '', category: 'Genérico', description: '', defaultDuration: 5 } as SequenceTemplate; break;
            case 'videoCompositionTemplates': newItem = { id: 'new', name: '', description: '', sequenceTemplateIds: [] } as VideoCompositionTemplate; break;
            case 'videoProjects': newItem = { id: 'new', name: '', status: 'Planificación', sequences: [], globalSettings: {}, createdAt: now, updatedAt: now } as VideoProject; break;
            case 'mediaAssets': newItem = { id: 'new', name: '', tags: [], duration: 0, imageUrl: '', videoUrl: '' } as MediaAsset; break;
        }
        if (newItem) {
            handleSelectView({ type: 'detail', entity: newItem, entityType });
        }
    };
    
    // --- START IMPORT/EXPORT LOGIC ---
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importPreviewState, setImportPreviewState] = useState<ImportPreviewState | null>(null);

    const handleExport = useCallback((templateId: number, selectedIds: number[]) => {
        const template = appData.importExportTemplates.find(t => t.id === templateId);
        if (!template) return;

        const itemsToExport = (appData[template.entity] as Entity[]).filter(item => selectedIds.includes(item.id as number));
        const platformId = template.platformId;
        
        const rows = itemsToExport.map(item => {
            const row: Record<string, string> = {};
            const context = { [template.entity.slice(0, -1)]: item, appData, platformId };
            template.fields.forEach(field => {
                row[field.columnHeader] = resolveCellValue(field, context);
            });
            return row;
        });

        const csv = unparseCsv({
            fields: template.fields.map(f => f.columnHeader),
            data: rows,
        });
        
        triggerDownload(csv, `${template.name}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
        
        // Log export job
        const newExportJob: ExportJob = {
            id: 'new',
            timestamp: new Date().toISOString(),
            userId: currentUser?.id as number,
            userName: currentUser?.name || 'Sistema',
            templateId,
            summary: `Exportados ${itemsToExport.length} registros de ${template.entity}`
        };
        handleSave('exportJobs', newExportJob);

        setIsExportModalOpen(false);
    }, [appData, currentUser, handleSave]);
    
    const handleImport = useCallback(async (templateId: number, file: File) => {
        const template = appData.importExportTemplates.find(t => t.id === templateId);
        if (!template) {
            alert("Plantilla no encontrada.");
            return;
        }
        
        try {
            const parsedData = await parseCsv(file);
            const { creations, updates, errors } = await processImportData(template, parsedData, appData);
            setImportPreviewState({ creations, updates, errors, templateId });
        } catch (error) {
            console.error(error);
            alert(`Error al procesar el fichero: ${(error as Error).message}`);
        }

        setIsImportModalOpen(false);
    }, [appData]);
    
    const processImportData = async (template: ImportExportTemplate, parsedData: any[], appData: AppData) => {
        // This is a simplified validation and diffing logic
        const creations: any[] = [];
        const updates: UpdatePreview[] = [];
        const errors: ImportError[] = [];
        
        const existingItems = appData[template.entity] as (Product[]);
        
        for (const [index, row] of parsedData.entries()) {
            const rowNumber = index + 2; // +1 for header, +1 for 0-index
            const sku = row['item_sku'] || row['sku'];
            if (!sku) {
                errors.push({ rowNumber, message: 'La columna SKU es obligatoria.', rowContent: row });
                continue;
            }

            const existingItem = (existingItems as any[]).find(item => item.sku === sku);
            let newData = existingItem ? { ...existingItem } : { id: 'new', sku, name: row['item_name'] || sku, status: 'Inactivo' }; // Basic new item
            
            // Apply changes from row to newData
            template.fields.forEach(field => {
                if(field.mappingType === 'mapped' && row[field.columnHeader] !== undefined) {
                    const path = field.value.replace(/[{}]/g, '');
                    set(newData, path, row[field.columnHeader]);
                }
            });

            if (existingItem) {
                const changes = generateChangeDetails(template.entity, existingItem, newData, appData);
                if (changes.length > 0) {
                    updates.push({ oldData: existingItem, newData, changes });
                }
            } else {
                creations.push(newData);
            }
        }
        return { creations, updates, errors };
    };
    
    const handleConfirmImport = useCallback((preview: ImportPreviewState) => {
         let summary = '';
         const changes: ImportJobChangeLogEntry[] = [];
         
         setAppData(prevData => {
            const template = prevData.importExportTemplates.find(t => t.id === preview.templateId);
            if (!template) return prevData;

            let updatedItems = [...(prevData[template.entity] as Entity[])];

            // Process updates
            preview.updates.forEach(update => {
                const index = updatedItems.findIndex(item => item.id === update.newData.id);
                if (index !== -1) {
                    changes.push({ action: 'Actualización', entityType: template.entity, entityId: update.newData.id, beforeState: updatedItems[index] });
                    updatedItems[index] = update.newData;
                }
            });
            
            // Process creations
            let nextId = Math.max(0, ...updatedItems.map(i => typeof i.id === 'number' ? i.id : 0)) + 1;
            preview.creations.forEach(creation => {
                const newItem = { ...creation, id: nextId };
                updatedItems.push(newItem);
                changes.push({ action: 'Creación', entityType: template.entity, entityId: nextId });
                nextId++;
            });

            summary = `${preview.creations.length} creados, ${preview.updates.length} actualizados.`;

            // FIX: Cast `updatedItems` to 'any' to prevent a type mismatch when updating a dynamic key on the AppData state object.
            return { ...prevData, [template.entity]: updatedItems as any };
         });
         
         // Log the import job
         const newChangeLog: ImportJobChangeLog = {
            id: Date.now(),
            jobId: 0, // Will be set next
            changes,
         };
         const newJob: ImportJob = {
             id: 'new',
             timestamp: new Date().toISOString(),
             userId: currentUser?.id as number,
             userName: currentUser?.name || 'Sistema',
             templateId: preview.templateId,
             status: 'Completado',
             summary,
             changeLogId: newChangeLog.id,
         };
         handleSave('importJobs', newJob);
         // In a real app, you'd save the change log too. Here we just add it.
         setAppData(prev => ({...prev, importJobChangeLogs: [...prev.importJobChangeLogs, newChangeLog]}));

         setImportPreviewState(null);
         alert("Importación completada con éxito.");
    }, [currentUser, handleSave]);
    
    const handleUndoImport = useCallback((jobId: number) => {
        if (!window.confirm("¿Estás seguro de que quieres deshacer esta importación? Esta acción restaurará los datos a su estado anterior.")) {
            return;
        }

        const job = appData.importJobs.find(j => j.id === jobId);
        const changeLog = appData.importJobChangeLogs.find(log => log.id === job?.changeLogId);

        if (!job || !changeLog) {
            alert("No se encontró el registro de cambios. No se puede deshacer.");
            return;
        }
        
        setAppData(prevData => {
            let newData = { ...prevData };
            
            changeLog.changes.reverse().forEach(change => {
                const { action, entityType, entityId, beforeState } = change;
                const items = newData[entityType] as Entity[];

                if (action === 'Creación') {
                    // Undo creation by deleting the item
                    newData[entityType] = items.filter(item => item.id !== entityId) as any;
                } else if (action === 'Actualización') {
                    // Undo update by restoring the beforeState
                    const index = items.findIndex(item => item.id === entityId);
                    if (index !== -1 && beforeState) {
                        items[index] = beforeState;
                    }
                }
            });
            
            const updatedJobs = prevData.importJobs.map(j => j.id === jobId ? {...j, status: 'Deshecho' as 'Deshecho'} : j);
            newData.importJobs = updatedJobs;
            
            return newData;
        });

        alert(`La importación ${jobId} ha sido deshecha.`);

    }, [appData]);
    // --- END IMPORT/EXPORT LOGIC ---
    
    const handleExecutePricingRule = useCallback(async (ruleId: number) => {
        const rule = appData.pricingRules.find(r => r.id === ruleId);
        if (!rule) {
            return;
        }
        
        setIsPricingJobDone(false);
        setPricingJobLog([`Iniciando ejecución de la regla "${rule.name}"...`]);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const allCalculationLogs: string[] = [];
        const newPrices = [...appData.prices];
        const newPriceHistoryLogs: PriceHistoryLog[] = [];
        const now = new Date().toISOString();
        let processedCount = 0;
        let changedCount = 0;

        const productScope = rule.scope.productIds === null ? appData.products.map(p => p.id as number) : rule.scope.productIds;
        const platformScope = rule.scope.platformIds === null ? appData.platforms.map(p => p.id as number) : rule.scope.platformIds;

        for (const productId of productScope) {
            for (const platformId of platformScope) {
                const platform = appData.platforms.find(p => p.id === platformId);
                if (!platform) continue;
                
                const countryId = platform.countryId;
                if (rule.scope.countryIds && !rule.scope.countryIds.includes(countryId)) {
                    continue;
                }

                processedCount++;
                const { finalAmount, source, log } = calculatePrice(productId, platformId, rule, appData, { logProcess: true });
                
                if (log) {
                    allCalculationLogs.push(...log);
                }

                const oldPriceIndex = newPrices.findIndex(p => p.productId === productId && p.platformId === platformId);

                if (oldPriceIndex > -1) {
                    const oldPrice = newPrices[oldPriceIndex];
                    if (oldPrice.amount !== finalAmount) {
                        changedCount++;
                        newPriceHistoryLogs.push({
                            id: 'new', timestamp: now, userId: currentUser!.id as number, userName: currentUser!.name, 
                            productId, platformId, countryId,
                            oldAmount: oldPrice.amount, newAmount: finalAmount, currency: 'EUR', 
                            source, 
                            trigger: 'manual_rule_execution'
                        });
                    }
                    newPrices[oldPriceIndex] = { ...oldPrice, amount: finalAmount, lastUpdatedBy: 'rule', discountInfo: source.name };
                } else if (finalAmount > 0) {
                    changedCount++;
                    newPrices.push({
                        id: 'new', productId, platformId, countryId,
                        amount: finalAmount, currency: 'EUR', discountInfo: source.name, lastUpdatedBy: 'rule'
                    });
                    newPriceHistoryLogs.push({
                        id: 'new', timestamp: now, userId: currentUser!.id as number, userName: currentUser!.name, 
                        productId, platformId, countryId,
                        oldAmount: null, newAmount: finalAmount, currency: 'EUR', 
                        source, 
                        trigger: 'manual_rule_execution'
                    });
                }
            }
        }
        
        setPricingJobLog(prev => [...(prev || []), ...allCalculationLogs]);

        setAppData(prevData => {
            let nextPriceId = Math.max(0, ...prevData.prices.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const finalPrices = newPrices.map(p => p.id === 'new' ? {...p, id: nextPriceId++} : p);
            
            let nextLogId = Math.max(0, ...prevData.priceHistoryLogs.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const finalLogs = newPriceHistoryLogs.map(p => p.id === 'new' ? { ...p, id: nextLogId++ } : p);

            return { ...prevData, prices: finalPrices, priceHistoryLogs: [...prevData.priceHistoryLogs, ...finalLogs] };
        });
        
        const summaryMessage = `✅ Proceso completado. Se procesaron ${processedCount} precios. ${changedCount} precios fueron modificados.`;
        setPricingJobLog(prev => [...(prev || []), summaryMessage]);
        setIsPricingJobDone(true);

    }, [appData, currentUser]);
    
    const triggerSchema = useCallback((schema: TaskSchema, initialContext: Record<string, string>) => {
        const now = new Date().toISOString();
        const projectName = initialContext['nombre_del_proyecto'] || schema.name;

        setAppData(prev => {
            const newProjectId = Math.max(0, ...prev.proyectos.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const newProject: Proyecto = {
                id: newProjectId,
                name: projectName,
                taskSchemaId: schema.id as number,
                status: 'Activo',
                createdAt: now,
                ownerId: currentUser?.id as number,
            };

            let nextTaskId = Math.max(0, ...prev.tasks.map(t => typeof t.id === 'number' ? t.id : 0)) + 1;
            const newTasks: Task[] = schema.templateTasks.map(templateTask => {
                const resolvedTitle = resolvePrompt(templateTask.title, initialContext);
                const resolvedDescription = resolvePrompt(templateTask.description, initialContext);
                
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + templateTask.dueDaysOffset);

                return {
                    id: nextTaskId++,
                    name: resolvedTitle,
                    description: resolvedDescription,
                    status: 'Pendiente',
                    priority: 'Media',
                    assigneeId: templateTask.defaultAssigneeId || currentUser?.id as number,
                    creatorId: currentUser?.id as number,
                    dueDate: dueDate.toISOString().split('T')[0],
                    createdAt: now,
                    updatedAt: now,
                    linkedEntity: {
                        entityType: 'proyectos',
                        entityId: newProjectId,
                        entityName: projectName,
                    }
                };
            });

            alert(`Proyecto "${projectName}" iniciado con ${newTasks.length} tareas.`);
            
            return {
                ...prev,
                proyectos: [...prev.proyectos, newProject],
                tasks: [...prev.tasks, ...newTasks],
            }
        });

    }, [appData, currentUser]);
    
    const handleTaskUpdate = useCallback((taskId: number, updates: Partial<Task>) => {
        setAppData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
        }));
    }, []);
    
    const handleBackupData = useCallback(() => {
        const dataStr = JSON.stringify(appData, null, 2);
        triggerDownload(dataStr, `pim-backup-${new Date().toISOString()}.json`, 'application/json');
    }, [appData]);


    const renderContent = () => {
        if (!currentUser) {
            return <LoginView onLogin={handleLogin} users={appData.users} />;
        }
        if (!activeView) {
            // Default to a dashboard if no view is selected after login
            return <TaskBoardDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} currentUser={currentUser} onSaveSubtask={handleSubtaskChange} onStartProject={triggerSchema} onTaskUpdate={handleTaskUpdate} />;
        }
        if (!hasPermission(currentUser, activeView.type === 'dashboard' ? activeView.entityType : activeView.type === 'aiSettings' ? 'aiSettings' : activeView.entityType)) {
            return <AccessDeniedView />;
        }

        const setSaveHandler = (handler: ((onSuccess?: () => void) => void) | null) => {
            activeSaveHandler.current = handler;
        };

        switch (activeView.type) {
            case 'dashboard':
                switch (activeView.entityType) {
                    case 'notifications': return <NotificationsDashboard notifications={appData.productNotifications} products={appData.products} countries={appData.countries} onStatusChange={handleNotificationStatusChange} onEditDetails={handleEditNotificationDetails} />;
                    case 'contentMaturity': return <ContentMaturityDashboard appData={appData} onSelectItem={handleSelectItem} />;
                    case 'importExport': return <ImportExportDashboard appData={appData} onNewExport={() => setIsExportModalOpen(true)} onNewImport={() => setIsImportModalOpen(true)} onUndoImport={handleUndoImport} onManageTemplates={() => handleSelectView({type: 'list', entityType: 'importExportTemplates'})} />;
                    case 'pvprMatrix': return <PvprMatrixDashboard appData={appData} onSave={handleSavePvprs} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'pricesByPlatform': return <PricesByPlatformDashboard appData={appData} onSave={handleSavePrices} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'priceHistoryLogs': return <PriceHistoryLogDashboard appData={appData} />;
                    case 'pricingDashboard': return <PricingDashboard appData={appData} />;
                    case 'amazonFlashDeals': return <AmazonFlashDealDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
                    case 'tasks': return <TaskBoardDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} currentUser={currentUser} onSaveSubtask={handleSubtaskChange} onStartProject={triggerSchema}/>;
                    case 'proyectos': return <ProjectsDashboard appData={appData} onSelectItem={handleSelectItem} />;
                    case 'videoStudio': return <VideoStudioDashboard appData={appData} onSelectItem={handleSelectItem} onSaveProject={handleSave as any} />;
                    case 'reports': return <ReportsDashboard appData={appData} />;
                    default: return <div>Dashboard not found</div>;
                }
            case 'list':
                 if (activeView.entityType === 'productNotifications') {
                    return <ProductNotificationListView notifications={appData.productNotifications} products={appData.products} countries={appData.countries} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
                }
                 if (activeView.entityType === 'competitorBrands') {
                    return <CompetitorBrandListView brands={appData.competitorBrands} products={appData.competitorProducts} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
                }
                if (activeView.entityType === 'notes') {
                    return <AllNotesListView appData={appData} onSelectItem={handleSelectItem} onNoteUpdate={handleNoteUpdate}/>;
                }
                if (activeView.entityType === 'logs') {
                    return <AllLogsView appData={appData} />;
                }
                 if (activeView.entityType === 'etiquetas') {
                    return <EtiquetaListView appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
                }
                if (activeView.entityType === 'knowledgeBaseEntries') {
                    return <KnowledgeBaseView appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
                }
                return <DetailView 
                            entityType={activeView.entityType} 
                            items={appData[activeView.entityType] as Entity[]} 
                            onSelectItem={handleSelectItem} 
                            onAddNew={handleAddNew} 
                            onExecuteRule={handleExecutePricingRule} 
                            onDeleteItem={handleDelete}
                            pricingJobLog={pricingJobLog}
                            isPricingJobDone={isPricingJobDone}
                            onPricingJobClose={() => setPricingJobLog(null)}
                            appData={appData}
                        />;
            case 'detail':
                const onCancel = () => {
                    if (activeView.entityType === 'proyectos') {
                        handleSelectView({ type: 'dashboard', entityType: 'proyectos' });
                    } else if (activeView.entityType === 'knowledgeBaseEntries') {
                         handleSelectView({ type: 'list', entityType: 'knowledgeBaseEntries' });
                    } else if (activeView.entityType === 'videoProjects') {
                        handleSelectView({ type: 'dashboard', entityType: 'videoStudio' });
                    } else if (activeView.entityType === 'amazonFlashDeals') {
                        handleSelectView({ type: 'dashboard', entityType: 'amazonFlashDeals' });
                    } else {
                        handleSelectView({ type: 'list', entityType: activeView.entityType });
                    }
                };

                switch (activeView.entityType) {
                    // FIX: Changed `isDirty={isDirty}` to `isDirty={isFormDirty}` to pass the correct state variable.
                    case 'products': return <ProductDetailView initialData={activeView.entity as Product} onSave={(d) => handleSave('products', d)} onDelete={(id) => handleDelete('products', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} isDirty={isFormDirty} setSaveHandler={setSaveHandler} onDuplicateEtiqueta={handleDuplicateEtiqueta} sidebarCollapsed={sidebarCollapsed} />;
                    case 'countries': return <CountryDetailView initialData={activeView.entity as Country} onSave={(d) => handleSave('countries', d)} onDelete={(id) => handleDelete('countries', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'platforms': return <PlatformDetailView initialData={activeView.entity as Platform} onSave={(d) => handleSave('platforms', d)} onDelete={(id) => handleDelete('platforms', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'tickets': return <TicketDetailView initialData={activeView.entity as CustomerSupportTicket} onSave={(d) => handleSave('tickets', d)} onDelete={(id) => handleDelete('tickets', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'envases': return <EnvaseDetailView initialData={activeView.entity as Envase} onSave={(d) => handleSave('envases', d)} onDelete={(id) => handleDelete('envases', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'etiquetas': return <EtiquetaDetailView initialData={activeView.entity as Etiqueta} onSave={(d) => handleSave('etiquetas', d)} onDelete={(id) => handleDelete('etiquetas', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onUsageAdd={handleUsageAdd} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} onDuplicate={handleDuplicateEtiqueta} onEntitySave={handleSave} />;
                    case 'videos': return <VideoDetailView initialData={activeView.entity as Video} onSave={(d) => handleSave('videos', d)} onDelete={(id) => handleDelete('videos', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} onSelectItem={handleSelectItem}/>;
                    case 'ingredients': return <IngredientDetailView initialData={activeView.entity as Ingredient} onSave={(d) => handleSave('ingredients', d)} onDelete={(id) => handleDelete('ingredients', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'translationTerms': return <TranslationTermDetailView initialData={activeView.entity as TranslationTerm} onSave={(d) => handleSave('translationTerms', d)} onDelete={(id) => handleDelete('translationTerms', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'productNotifications': return <ProductNotificationDetailView initialData={activeView.entity as ProductNotification} onSave={(d) => handleSave('productNotifications', d)} onDelete={(id) => handleDelete('productNotifications', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'competitorBrands': return <CompetitorBrandDetailView initialData={activeView.entity as CompetitorBrand} onSave={(d) => handleSave('competitorBrands', d)} onDelete={(id) => handleDelete('competitorBrands', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'competitorProducts': return <CompetitorProductDetailView initialData={activeView.entity as CompetitorProduct} onSave={(d) => handleSave('competitorProducts', d)} onDelete={(id) => handleDelete('competitorProducts', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'contentRecipes': return <ContentRecipeDetailView initialData={activeView.entity as ContentRecipe} onSave={(d) => handleSave('contentRecipes', d)} onDelete={(id) => handleDelete('contentRecipes', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'promptTemplates': return <PromptTemplateDetailView initialData={activeView.entity as PromptTemplate} onSave={(d) => handleSave('promptTemplates', d)} onDelete={(id) => handleDelete('promptTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'importExportTemplates': return <PublicationTemplateDetailView initialData={activeView.entity as ImportExportTemplate} onSave={(d) => handleSave('importExportTemplates', d)} onDelete={(id) => handleDelete('importExportTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'pricingRules': return <PricingRuleDetailView initialData={activeView.entity as PricingRule} onSave={(d) => handleSave('pricingRules', d)} onDelete={(id) => handleDelete('pricingRules', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'amazonFlashDeals': return <AmazonFlashDealDetailView initialData={activeView.entity as AmazonFlashDeal} onSave={(d) => handleSave('amazonFlashDeals', d)} onDelete={(id) => handleDelete('amazonFlashDeals', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'users': return <UserDetailView initialData={activeView.entity as User} onSave={(d) => handleSave('users', d)} onDelete={(id) => handleDelete('users', id)} onCancel={onCancel} currentUser={currentUser} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'tasks': return <TaskDetailView initialData={activeView.entity as Task} onSave={(d) => handleSave('tasks', d)} onDelete={(id) => handleDelete('tasks', id)} onCancel={onCancel} appData={appData} currentUser={currentUser} onCommentAdd={handleTaskCommentAdd} onSaveSubtask={handleSubtaskChange} onDeleteSubtask={handleDeleteSubtask} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'taskSchemas': return <TaskSchemaDetailView initialData={activeView.entity as TaskSchema} onSave={(data) => handleSave('taskSchemas', data)} onDelete={(id) => handleDelete('taskSchemas', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'proyectos': return <ProjectDetailView initialData={activeView.entity as Proyecto} onSave={(d) => handleSave('proyectos', d)} onDelete={(id) => handleDelete('proyectos', id)} onCancel={onCancel} appData={appData} onTaskUpdate={handleTaskUpdate} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'knowledgeBaseEntries': return <KnowledgeBaseEntryDetailView initialData={activeView.entity as KnowledgeBaseEntry} onSave={(d) => handleSave('knowledgeBaseEntries', d)} onDelete={(id) => handleDelete('knowledgeBaseEntries', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'sequenceTemplates': return <SequenceTemplateDetailView initialData={activeView.entity as SequenceTemplate} onSave={(d) => handleSave('sequenceTemplates', d)} onDelete={(id) => handleDelete('sequenceTemplates', id)} onCancel={onCancel} onNavigate={handleSelectView} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'videoCompositionTemplates': return <VideoCompositionTemplateDetailView initialData={activeView.entity as VideoCompositionTemplate} onSave={(d) => handleSave('videoCompositionTemplates', d)} onDelete={(id) => handleDelete('videoCompositionTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'videoProjects': return <VideoProjectDetailView initialData={activeView.entity as VideoProject} onSave={(d) => handleSave('videoProjects', d)} onDelete={(id) => handleDelete('videoProjects', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onEntitySave={handleSave} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    case 'mediaAssets': return <MediaAssetDetailView initialData={activeView.entity as MediaAsset} onSave={(d) => handleSave('mediaAssets', d)} onDelete={(id) => handleDelete('mediaAssets', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} />;
                    default: return <div>Detail view for {activeView.entityType} not implemented</div>;
                }
            case 'aiSettings':
                return <AISettingsView initialData={appData.aiSettings} onSave={handleSaveAiSettings} onCancel={() => handleSelectView({ type: 'dashboard', entityType: 'importExport' })} />;
            default: return <div>View not found</div>;
        }
    };
    
    return (
        <>
            {currentUser ? (
                <div className="flex">
                    <Sidebar
                        appData={appData}
                        setActiveView={handleSelectView}
                        activeEntityType={activeView?.type === 'detail' ? activeView.entityType : activeView?.type === 'list' ? activeView.entityType : activeView?.type === 'dashboard' ? activeView.entityType : activeView?.type === 'aiSettings' ? 'aiSettings' : undefined}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        onBackupData={handleBackupData}
                        onSelectItem={handleSelectItem}
                    />
                    <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                        <div className="p-4 sm:p-6 lg:p-8">
                           {renderContent()}
                        </div>
                    </main>
                </div>
            ) : (
                renderContent()
            )}
            
            {/* --- START GLOBAL ELEMENTS --- */}
            {currentUser && (
                <>
                    <button
                        onClick={toggleTranslationPanel}
                        className="fixed bottom-6 right-20 z-30 w-12 h-12 bg-cyan-500 text-slate-900 rounded-full shadow-lg flex items-center justify-center hover:bg-cyan-600 transition-transform transform hover:scale-110"
                        title="Asistente de Traducción (Ctrl+Shift+L)"
                    >
                        <Icon name="language" className="text-2xl" />
                    </button>
                    <button
                        onClick={toggleInspectorPanel}
                        className="fixed bottom-6 right-6 z-30 w-12 h-12 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-transform transform hover:scale-110"
                        title="Inspector de Producto (Ctrl+Shift+P)"
                    >
                        <Icon name="box-open" className="text-xl" />
                    </button>
                    {isTranslationPanelOpen && (
                        <GlobalTranslationPanel
                            appData={appData}
                            isOpen={isTranslationPanelOpen}
                            onClose={() => setIsTranslationPanelOpen(false)}
                        />
                    )}
                    {isInspectorOpen && (
                        <GlobalProductInspector
                            appData={appData}
                            isOpen={isInspectorOpen}
                            onClose={() => setIsInspectorOpen(false)}
                        />
                    )}
                </>
            )}

            {/* --- START GLOBAL MODALS --- */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-200">Confirmar Eliminación</h3>
                            <p className="text-sm text-slate-400 mt-2">
                                ¿Estás seguro de que quieres eliminar <strong className="text-slate-200">{deleteConfirmation.name}</strong>? Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-700/50 flex justify-end space-x-2 rounded-b-lg">
                            <button onClick={() => setDeleteConfirmation(null)} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            {unsavedChangesModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-200">Cambios sin Guardar</h3>
                            <p className="text-sm text-slate-400 mt-2">
                                Tienes cambios sin guardar. ¿Qué te gustaría hacer?
                            </p>
                        </div>
                        <div className="p-4 bg-slate-700/50 flex justify-end space-x-2 rounded-b-lg">
                            <button onClick={() => setUnsavedChangesModal({ isOpen: false, onConfirm: () => {}, onDiscard: () => {} })} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                            <button onClick={unsavedChangesModal.onDiscard} className="px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-500 font-semibold">Salir sin Guardar</button>
                            <button onClick={unsavedChangesModal.onConfirm} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar y Salir</button>
                        </div>
                    </div>
                </div>
            )}
            {isExportModalOpen && <ExportModal appData={appData} onClose={() => setIsExportModalOpen(false)} onExport={handleExport} />}
            {isImportModalOpen && <ImportModal appData={appData} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />}
            {importPreviewState && <ImportPreviewModal previewState={importPreviewState} onClose={() => setImportPreviewState(null)} onConfirm={handleConfirmImport} />}
        </>
    );
};

export default App;