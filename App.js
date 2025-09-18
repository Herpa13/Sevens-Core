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
const react_1 = __importStar(require("react"));
const initialAppData_1 = require("./data/initialAppData");
const Sidebar_1 = require("./components/layout/Sidebar");
// FIX: Import only the component from DetailView, not the types.
const DetailView_1 = require("./components/layout/DetailView");
const changeTracker_1 = require("./utils/changeTracker");
const fileUtils_1 = require("./utils/fileUtils");
const lodash_es_1 = require("lodash-es");
const formulaService_1 = require("./services/formulaService");
const pricingService_1 = require("./services/pricingService");
const LoginView_1 = require("./views/LoginView");
const authUtils_1 = require("./utils/authUtils");
const AccessDeniedView_1 = require("./views/AccessDeniedView");
const placeholderService_1 = require("./services/placeholderService");
const coreApi_1 = require("./services/coreApi");
// Import Dashboards
const NotificationsDashboard_1 = require("./dashboards/NotificationsDashboard");
const ContentMaturityDashboard_1 = require("./dashboards/ContentMaturityDashboard");
const ImportExportDashboard_1 = require("./views/ImportExportDashboard");
const PvprMatrixDashboard_1 = require("./dashboards/PvprMatrixDashboard");
const PricesByPlatformDashboard_1 = require("./dashboards/PricesByPlatformDashboard");
const TaskBoardDashboard_1 = require("./dashboards/TaskBoardDashboard");
const ProjectsDashboard_1 = require("./dashboards/ProjectsDashboard");
const VideoStudioDashboard_1 = require("./views/VideoStudioDashboard");
const PriceHistoryLogDashboard_1 = require("./dashboards/PriceHistoryLogDashboard");
const PricingDashboard_1 = require("./dashboards/PricingDashboard");
const AmazonFlashDealDashboard_1 = require("./dashboards/AmazonFlashDealDashboard");
const ReportsDashboard_1 = require("./dashboards/ReportsDashboard");
// Import Modals
const ExportModal_1 = require("./components/modals/ExportModal");
const ImportModal_1 = require("./components/modals/ImportModal");
const ImportPreviewModal_1 = require("./components/modals/ImportPreviewModal");
// Import View Components
const ProductDetailView_1 = require("./views/ProductDetailView");
const CountryDetailView_1 = require("./views/CountryDetailView");
const PlatformDetailView_1 = require("./views/PlatformDetailView");
const TicketDetailView_1 = require("./views/TicketDetailView");
const EnvaseDetailView_1 = require("./views/EnvaseDetailView");
const EtiquetaDetailView_1 = require("./views/EtiquetaDetailView");
const VideoDetailView_1 = require("./views/VideoDetailView");
const IngredientDetailView_1 = require("./views/IngredientDetailView");
const TranslationTermDetailView_1 = require("./views/TranslationTermDetailView");
const ProductNotificationDetailView_1 = require("./views/ProductNotificationDetailView");
const CompetitorBrandDetailView_1 = require("./views/CompetitorBrandDetailView");
const CompetitorProductDetailView_1 = require("./views/CompetitorProductDetailView");
const ProductNotificationListView_1 = require("./views/ProductNotificationListView");
const CompetitorBrandListView_1 = require("./views/CompetitorBrandListView");
const AllNotesListView_1 = require("./views/AllNotesListView");
const ContentRecipeDetailView_1 = require("./views/ContentRecipeDetailView");
const PromptTemplateDetailView_1 = require("./views/PromptTemplateDetailView");
const AllLogsView_1 = require("./views/AllLogsView");
const ImportExportTemplateDetailView_1 = require("./views/ImportExportTemplateDetailView");
const AISettingsView_1 = require("./views/AISettingsView");
const PricingRuleDetailView_1 = require("./views/PricingRuleDetailView");
const UserDetailView_1 = require("./views/UserDetailView");
const TaskDetailView_1 = require("./views/TaskDetailView");
const TaskSchemaDetailView_1 = require("./views/TaskSchemaDetailView");
const ProjectDetailView_1 = require("./views/ProjectDetailView");
const KnowledgeBaseView_1 = require("./views/KnowledgeBaseView");
const KnowledgeBaseEntryDetailView_1 = require("./views/KnowledgeBaseEntryDetailView");
const SequenceTemplateDetailView_1 = require("./views/SequenceTemplateDetailView");
const VideoTemplateDetailView_1 = require("./views/VideoTemplateDetailView");
const VideoProjectDetailView_1 = require("./views/VideoProjectDetailView");
const MediaAssetDetailView_1 = require("./views/MediaAssetDetailView");
const AmazonFlashDealDetailView_1 = require("./views/AmazonFlashDealDetailView");
const Icon_1 = require("./components/common/Icon");
const GlobalTranslationPanel_1 = require("./components/common/GlobalTranslationPanel");
const GlobalProductInspector_1 = require("./components/common/GlobalProductInspector");
const EtiquetaListView_1 = require("./views/EtiquetaListView");
const TRACKED_ENTITIES = ['products', 'etiquetas', 'ingredients', 'productNotifications', 'knowledgeBaseEntries', 'videos'];
const App = () => {
    const [appData, setAppData] = (0, react_1.useState)(initialAppData_1.INITIAL_APP_DATA);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, react_1.useState)(false);
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    const [activeView, setActiveView] = (0, react_1.useState)(null);
    const [isFormDirty, setIsFormDirty] = (0, react_1.useState)(false);
    const [deleteConfirmation, setDeleteConfirmation] = (0, react_1.useState)(null);
    const [unsavedChangesModal, setUnsavedChangesModal] = (0, react_1.useState)({
        isOpen: false,
        onConfirm: () => { },
        onDiscard: () => { },
    });
    // This ref will hold the save function of the currently active detail view
    const activeSaveHandler = (0, react_1.useRef)(null);
    const [isTranslationPanelOpen, setIsTranslationPanelOpen] = (0, react_1.useState)(false);
    const toggleTranslationPanel = () => setIsTranslationPanelOpen(prev => !prev);
    (0, react_1.useEffect)(() => {
        (0, coreApi_1.getHealth)().then(res => {
            console.log('CORE health:', res);
        }).catch(err => {
            console.warn('CORE health check failed', err);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        (0, coreApi_1.getAppData)().then(data => {
            setAppData(data);
        }).catch(err => {
            console.error('App data fetch failed', err);
        });
    }, []);
    const [isInspectorOpen, setIsInspectorOpen] = (0, react_1.useState)(false);
    const toggleInspectorPanel = () => setIsInspectorOpen(prev => !prev);
    const [pricingJobLog, setPricingJobLog] = (0, react_1.useState)(null);
    const [isPricingJobDone, setIsPricingJobDone] = (0, react_1.useState)(false);
    const [lastSavedEntity, setLastSavedEntity] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
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
    const handleLogin = (user) => {
        setCurrentUser(user);
        // Set a default view for all users upon login
        setActiveView({ type: 'dashboard', entityType: 'tasks' });
    };
    const handleLogout = () => {
        setCurrentUser(null);
        setActiveView(null);
    };
    const handleSelectView = (0, react_1.useCallback)((view) => {
        const navigate = () => {
            const key = view.type === 'dashboard' ? view.entityType : view.type === 'aiSettings' ? 'aiSettings' : view.type === 'list' ? view.entityType : view.type === 'detail' ? view.entityType : 'products';
            // FIX: Explicitly cast 'key' to string to satisfy 'hasPermission' function signature and avoid potential type errors.
            if (currentUser && (0, authUtils_1.hasPermission)(currentUser, String(key))) {
                setActiveView(view);
                setIsFormDirty(false);
                activeSaveHandler.current = null;
            }
            else {
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
                onConfirm: () => {
                    setUnsavedChangesModal({ isOpen: false, onConfirm: () => { }, onDiscard: () => { } });
                    if (activeSaveHandler.current) {
                        activeSaveHandler.current(navigate); // Pass navigate as the success callback
                    }
                },
                onDiscard: () => {
                    setUnsavedChangesModal({ isOpen: false, onConfirm: () => { }, onDiscard: () => { } });
                    navigate();
                },
            });
        }
        else {
            navigate();
        }
    }, [currentUser, isFormDirty]);
    const handleSave = (0, react_1.useCallback)((entityType, data) => {
        setIsFormDirty(false);
        const isNew = data.id === 'new';
        setAppData(prevData => {
            // FIX: Add guard to ensure user has a valid ID before creating log entries. This resolves potential type errors.
            if (typeof currentUser?.id !== 'number') {
                console.error("Save operation cancelled: current user does not have a valid numeric ID.");
                return prevData;
            }
            const newAppData = JSON.parse(JSON.stringify(prevData));
            const items = newAppData[entityType];
            let newLogEntries = [];
            let newTasksFromAutomation = [];
            let finalItems;
            let finalData = data;
            const now = new Date().toISOString();
            // FIX: Check if entity is an array before calling 'find' to satisfy TypeScript's strict type checking.
            const oldEntity = !isNew && Array.isArray(prevData[entityType]) ? prevData[entityType].find((item) => item.id === data.id) : null;
            // --- Special handler for Knowledge Base versioning ---
            if (entityType === 'knowledgeBaseEntries') {
                const kbEntry = data;
                if (!isNew && oldEntity && oldEntity.status === 'Aprobado') {
                    const oldEntry = oldEntity;
                    const newId = Math.max(0, ...items.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                    const newVersion = {
                        ...kbEntry,
                        id: newId,
                        version: oldEntry.version + 1,
                        parentId: oldEntry.parentId || oldEntry.id,
                        createdAt: now,
                        updatedAt: now,
                        status: 'Borrador',
                    };
                    const archivedOldVersion = {
                        ...oldEntry,
                        status: 'Archivado',
                        updatedAt: now,
                    };
                    finalItems = items.map(item => item.id === oldEntry.id ? archivedOldVersion : item).concat(newVersion);
                    finalData = newVersion;
                    newLogEntries.push({
                        id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser.name,
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
                if (TRACKED_ENTITIES.includes(entityType)) {
                    newLogEntries.push({
                        id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser.name,
                        actionType: 'Creación', entityType: entityType, entityId: finalData.id,
                        entityName: finalData.name || finalData.identifier || finalData.title || `ID: ${newId}`,
                    });
                }
            }
            else {
                finalItems = items.map(item => item.id === finalData.id ? finalData : item);
                if (oldEntity && TRACKED_ENTITIES.includes(entityType)) {
                    const changes = (0, changeTracker_1.generateChangeDetails)(entityType, oldEntity, finalData, prevData);
                    if (changes.length > 0) {
                        newLogEntries.push({
                            id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser.name,
                            actionType: 'Actualización', entityType: entityType, entityId: finalData.id,
                            entityName: finalData.name || finalData.identifier || finalData.title || `ID: ${finalData.id}`,
                            changes,
                        });
                    }
                }
            }
            newAppData[entityType] = finalItems;
            // --- Special handlers on the newAppData ---
            if (entityType === 'tasks' && oldEntity) {
                const oldTask = oldEntity;
                const newTask = finalData;
                //... dependency & recurrence logic on newAppData.tasks
            }
            // ... other special handlers
            // --- Finalize Logs & Tasks ---
            if (newTasksFromAutomation.length > 0) {
                //... add tasks to newAppData.tasks
            }
            let nextLogId = Math.max(0, ...newAppData.logs.map((l) => typeof l.id === 'number' ? l.id : 0)) + 1;
            newAppData.logs.push(...newLogEntries.map(log => ({ ...log, id: nextLogId++ })));
            // Trigger the useEffect to update the view
            setLastSavedEntity({ entityType, entity: finalData, isNew });
            return newAppData;
        });
    }, [currentUser]);
    (0, react_1.useEffect)(() => {
        if (lastSavedEntity) {
            const { entityType, entity, isNew } = lastSavedEntity;
            if (isNew) {
                setActiveView({ type: 'detail', entityType, entity });
            }
            else {
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
    const handleSubtaskChange = (0, react_1.useCallback)((updatedSubtask) => {
        setAppData(prev => {
            let newSubtasks;
            const existing = prev.subtasks.find(s => s.id === updatedSubtask.id);
            if (existing) {
                newSubtasks = prev.subtasks.map(s => s.id === updatedSubtask.id ? updatedSubtask : s);
            }
            else {
                const newId = Math.max(0, ...prev.subtasks.map(s => typeof s.id === 'number' ? s.id : 0)) + 1;
                newSubtasks = [...prev.subtasks, { ...updatedSubtask, id: newId }];
            }
            return { ...prev, subtasks: newSubtasks };
        });
    }, []);
    const handleDeleteSubtask = (0, react_1.useCallback)((subtaskId) => {
        setAppData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
        }));
    }, []);
    const handleSavePvprs = (0, react_1.useCallback)((updatedPvprs) => {
        setAppData(prev => {
            const newPvprs = [...prev.pvprs];
            updatedPvprs.forEach(updated => {
                const index = newPvprs.findIndex(p => p.id === updated.id);
                if (index > -1) {
                    newPvprs[index] = updated;
                }
                else {
                    // This logic assumes new entries have a temporary negative ID
                    const newId = Math.max(0, ...prev.pvprs.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
                    newPvprs.push({ ...updated, id: newId });
                }
            });
            return { ...prev, pvprs: newPvprs };
        });
        alert('PVPRs guardados correctamente.');
    }, []);
    const handleSavePrices = (0, react_1.useCallback)((updatedPrices) => {
        setAppData(prev => {
            const newPrices = [...prev.prices];
            const now = new Date().toISOString();
            const newPriceHistoryLogs = [];
            if (typeof currentUser?.id !== 'number')
                return prev;
            updatedPrices.forEach(updated => {
                const index = newPrices.findIndex(p => p.id === updated.id);
                if (index > -1) {
                    const oldPrice = newPrices[index];
                    const finalUpdated = { ...updated, lastUpdatedBy: 'manual' };
                    const hasChanged = (oldPrice.amount) !== (finalUpdated.amount) ||
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
                }
                else {
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
    const handleSaveAiSettings = (0, react_1.useCallback)((settings) => {
        setAppData(prev => ({ ...prev, aiSettings: settings }));
        alert("Ajustes de IA guardados.");
        // Optionally, redirect to another view or stay on the page
        setActiveView({ type: 'dashboard', entityType: 'importExport' });
    }, []);
    const confirmDelete = (0, react_1.useCallback)(() => {
        if (!deleteConfirmation)
            return;
        const { entityType, id } = deleteConfirmation;
        setAppData(prevData => {
            const items = prevData[entityType];
            const itemToDelete = items.find(item => item.id === id);
            let newLog = null;
            if (itemToDelete && TRACKED_ENTITIES.includes(entityType)) {
                newLog = {
                    id: 'new',
                    timestamp: new Date().toISOString(),
                    userId: currentUser?.id || 0,
                    userName: currentUser?.name || 'Sistema',
                    actionType: 'Eliminación',
                    entityType: entityType,
                    entityId: id,
                    // @ts-ignore
                    entityName: itemToDelete.name || itemToDelete.identifier || itemToDelete.title || `ID: ${id}`,
                };
            }
            const newLogs = newLog ? [...prevData.logs, { ...newLog, id: Math.max(0, ...prevData.logs.map(l => typeof l.id === 'number' ? l.id : 0)) + 1 }] : prevData.logs;
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
            }
            else if (entityType === 'productNotifications') {
                setActiveView({ type: 'dashboard', entityType: 'notifications' });
            }
            else if (entityType === 'videoProjects' || entityType === 'sequenceTemplates' || entityType === 'mediaAssets' || entityType === 'videoCompositionTemplates') {
                setActiveView({ type: 'dashboard', entityType: 'videoStudio' });
            }
            else {
                setActiveView({ type: 'list', entityType });
            }
        }
    }, [deleteConfirmation, currentUser]);
    // FIX: Update `id` parameter to accept `number | 'new'` and add a type guard to prevent attempting to delete unsaved entities. This resolves type errors at call sites.
    const handleDelete = (0, react_1.useCallback)((entityType, id) => {
        if (typeof id !== 'number') {
            // Cannot delete an item that hasn't been saved.
            // Silently return or show a message to the user.
            if (activeView?.type === 'detail' && activeView.entity.id === 'new') {
                // If it's a new entity, "deleting" is like canceling.
                if (entityType === 'proyectos') {
                    handleSelectView({ type: 'dashboard', entityType: 'proyectos' });
                }
                else if (entityType === 'knowledgeBaseEntries') {
                    handleSelectView({ type: 'list', entityType: 'knowledgeBaseEntries' });
                }
                else if (entityType === 'videoProjects') {
                    handleSelectView({ type: 'dashboard', entityType: 'videoStudio' });
                }
                else if (entityType === 'amazonFlashDeals') {
                    handleSelectView({ type: 'dashboard', entityType: 'amazonFlashDeals' });
                }
                else {
                    handleSelectView({ type: 'list', entityType: activeView.entityType });
                }
            }
            return;
        }
        const items = appData[entityType];
        const itemToDelete = items.find(item => item.id === id);
        if (!itemToDelete)
            return;
        setDeleteConfirmation({
            entityType,
            id,
            // @ts-ignore
            name: itemToDelete.name || itemToDelete.identifier || itemToDelete.title || `ID: ${id}`,
        });
    }, [appData, activeView, handleSelectView]);
    const handleNoteAdd = (0, react_1.useCallback)((note) => {
        const newId = Math.max(0, ...appData.notes.map(n => typeof n.id === 'number' ? n.id : 0)) + 1;
        const newNote = {
            ...note,
            id: newId,
            authorName: currentUser?.name || 'Sistema',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Activa',
        };
        setAppData(prev => ({ ...prev, notes: [...prev.notes, newNote] }));
    }, [appData.notes, currentUser]);
    const handleUsageAdd = (0, react_1.useCallback)((usage) => {
        setAppData(prev => {
            const newId = Math.max(0, ...(prev.knowledgeBaseUsages || []).map(u => typeof u.id === 'number' ? u.id : 0)) + 1;
            const newUsage = {
                ...usage,
                id: newId,
                userId: currentUser?.id,
                usedAt: new Date().toISOString(),
            };
            return { ...prev, knowledgeBaseUsages: [...(prev.knowledgeBaseUsages || []), newUsage] };
        });
    }, [currentUser]);
    const handleTaskCommentAdd = (0, react_1.useCallback)((comment) => {
        const newId = Math.max(0, ...appData.taskComments.map(c => typeof c.id === 'number' ? c.id : 0)) + 1;
        const newComment = {
            ...comment,
            id: newId,
            authorId: currentUser?.id,
            createdAt: new Date().toISOString(),
        };
        setAppData(prev => ({ ...prev, taskComments: [...prev.taskComments, newComment] }));
    }, [appData.taskComments, currentUser]);
    const handleNoteUpdate = (0, react_1.useCallback)((updatedNote) => {
        setAppData(prev => ({
            ...prev,
            notes: prev.notes.map(n => n.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString(), authorName: currentUser?.name || 'Sistema' } : n)
        }));
    }, [currentUser]);
    const handleNoteDelete = (0, react_1.useCallback)((noteId) => {
        if (typeof noteId === 'number') {
            setAppData(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
        }
    }, []);
    const handleNotificationStatusChange = (0, react_1.useCallback)((productId, countryId, status) => {
        setAppData(prevData => {
            const existingNotification = prevData.productNotifications.find(n => n.productId === productId && n.countryId === countryId);
            if (existingNotification) {
                // Update existing notification
                const updatedNotifications = prevData.productNotifications.map(n => n.id === existingNotification.id ? { ...n, status } : n);
                return { ...prevData, productNotifications: updatedNotifications };
            }
            else {
                // Create new notification
                const newId = Math.max(0, ...prevData.productNotifications.map(n => typeof n.id === 'number' ? n.id : 0)) + 1;
                const newNotification = {
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
    const handleEditNotificationDetails = (0, react_1.useCallback)((notification) => {
        handleSelectView({
            type: 'detail',
            entityType: 'productNotifications',
            entity: notification
        });
    }, [handleSelectView]);
    const handleSelectItem = (entityType, item) => {
        handleSelectView({ type: 'detail', entity: item, entityType });
    };
    // FIX: Changed parameter `etiquetaId` to accept `number | 'new'` to match its usage. Added a guard to handle the `'new'` case gracefully.
    const handleDuplicateEtiqueta = (0, react_1.useCallback)((etiquetaId) => {
        if (typeof etiquetaId !== 'number') {
            alert('No se puede duplicar una etiqueta no guardada.');
            return;
        }
        const originalEtiqueta = appData.etiquetas.find(e => e.id === etiquetaId);
        if (!originalEtiqueta) {
            alert('No se encontró la etiqueta original para duplicar.');
            return;
        }
        const duplicatedEtiqueta = {
            ...originalEtiqueta,
            id: 'new',
            identifier: `${originalEtiqueta.identifier} (Copia)`,
            createdAt: new Date().toISOString(),
            status: 'Pendiente enviar a imprenta',
        };
        handleSelectView({ type: 'detail', entity: duplicatedEtiqueta, entityType: 'etiquetas' });
    }, [appData.etiquetas, handleSelectView]);
    const handleAddNew = (entityType) => {
        if (!currentUser || !(0, authUtils_1.hasPermission)(currentUser, entityType)) {
            alert('No tienes permiso para crear este tipo de entidad.');
            return;
        }
        let newItem = null;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();
        switch (entityType) {
            case 'products':
                newItem = { id: 'new', name: '', sku: '', status: 'En Estudio', amazonContents: [], composition: [], videoIds: [] };
                break;
            case 'countries':
                newItem = { id: 'new', name: '', iso: '' };
                break;
            case 'platforms':
                newItem = { id: 'new', name: '', countryId: 0, type: '', status: 'En estudio', shipsBy: 'Platform' };
                break;
            case 'tickets':
                newItem = { id: 'new', customerName: '', channel: 'Email', status: 'Abierto', entryDate: today };
                break;
            case 'envases':
                newItem = { id: 'new', name: '' };
                break;
            case 'etiquetas':
                newItem = { id: 'new', identifier: '', createdAt: now, status: 'Pendiente enviar a imprenta', creationType: 'Etiqueta 0', contentByLanguage: [], ingredientSnapshot: [] };
                break;
            case 'videos':
                newItem = { id: 'new', name: '', url: '', platform: '', type: 'Producto', duration: 0, status: 'Planificado', countryId: 0 };
                break;
            case 'ingredients':
                newItem = { id: 'new', latinName: '', type: '', measureUnit: 'mg', countryDetails: [] };
                break;
            case 'notes':
                newItem = { id: 'new', entityType: 'products', entityId: 0, authorName: currentUser?.name || 'Sistema', text: '', createdAt: now, updatedAt: now, status: 'Activa' };
                break;
            // FIX: Correct `TranslationTerm` creation to use `spanish` property instead of `key`.
            case 'translationTerms':
                newItem = { id: 'new', spanish: '', translations: [] };
                break;
            case 'productNotifications':
                newItem = { id: 'new', productId: 0, countryId: 0, status: 'Pendiente', notifiedBy: '' };
                break;
            case 'competitorBrands':
                newItem = { id: 'new', name: '' };
                break;
            case 'competitorProducts':
                newItem = { id: 'new', competitorBrandId: null, countryId: 0, asin: '', name: '', snapshots: [] };
                break;
            case 'contentRecipes':
                newItem = { id: 'new', name: '', target: 'title', parts: [] };
                break;
            case 'promptTemplates':
                newItem = { id: 'new', name: '', category: 'Revisión', description: '', template: '', entityType: 'general' };
                break;
            case 'importExportTemplates':
                newItem = { id: 'new', name: '', entity: 'products', templateType: 'publication', fields: [] };
                break;
            case 'pricingRules':
                newItem = { id: 'new', name: '', isActive: true, scope: { productIds: null, platformIds: null, countryIds: null }, calculation: { method: 'USE_PVPR' } };
                break;
            case 'amazonFlashDeals':
                newItem = { id: 'new', name: '', productId: 0, platformId: 0, asin: '', startDate: now, endDate: now, dealPrice: 0, currency: 'EUR', status: 'Borrador' };
                break;
            case 'users':
                newItem = { id: 'new', name: '', email: '', role: 'Nivel 3', allowedViews: [] };
                break;
            case 'tasks':
                newItem = { id: 'new', name: '', description: '', status: 'Pendiente', priority: 'Media', assigneeId: currentUser?.id, creatorId: currentUser?.id, createdAt: now, updatedAt: now, linkedEntity: { entityType: 'products', entityId: 0, entityName: '' }, tags: [], blocks: [], isBlockedBy: [] };
                break;
            case 'taskSchemas':
                newItem = { id: 'new', name: '', description: '', trigger: { type: 'manual' }, templateTasks: [] };
                break;
            case 'proyectos':
                newItem = { id: 'new', name: '', taskSchemaId: 0, status: 'Activo', createdAt: now, ownerId: currentUser?.id };
                break;
            case 'knowledgeBaseEntries':
                newItem = { id: 'new', title: '', description: '', entryType: 'Texto', category: 'General', tags: [], content: {}, createdAt: now, updatedAt: now, status: 'Borrador', version: 1, parentId: null };
                break;
            case 'sequenceTemplates':
                newItem = { id: 'new', name: '', category: 'Genérico', description: '', defaultDuration: 5 };
                break;
            case 'videoCompositionTemplates':
                newItem = { id: 'new', name: '', description: '', sequenceTemplateIds: [] };
                break;
            case 'videoProjects':
                newItem = { id: 'new', name: '', status: 'Planificación', sequences: [], globalSettings: {}, createdAt: now, updatedAt: now };
                break;
            case 'mediaAssets':
                newItem = { id: 'new', name: '', tags: [], duration: 0, imageUrl: '', videoUrl: '' };
                break;
        }
        if (newItem) {
            handleSelectView({ type: 'detail', entity: newItem, entityType });
        }
    };
    // --- START IMPORT/EXPORT LOGIC ---
    const [isExportModalOpen, setIsExportModalOpen] = (0, react_1.useState)(false);
    const [isImportModalOpen, setIsImportModalOpen] = (0, react_1.useState)(false);
    const [importPreviewState, setImportPreviewState] = (0, react_1.useState)(null);
    const handleExport = (0, react_1.useCallback)((templateId, selectedIds) => {
        const template = appData.importExportTemplates.find(t => t.id === templateId);
        if (!template)
            return;
        const itemsToExport = appData[template.entity].filter(item => selectedIds.includes(item.id));
        const platformId = template.platformId;
        const rows = itemsToExport.map(item => {
            const row = {};
            const context = { [template.entity.slice(0, -1)]: item, appData, platformId };
            template.fields.forEach(field => {
                row[field.columnHeader] = (0, formulaService_1.resolveCellValue)(field, context);
            });
            return row;
        });
        const csv = (0, fileUtils_1.unparseCsv)({
            fields: template.fields.map(f => f.columnHeader),
            data: rows,
        });
        (0, fileUtils_1.triggerDownload)(csv, `${template.name}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
        // Log export job
        const newExportJob = {
            id: 'new',
            timestamp: new Date().toISOString(),
            userId: currentUser?.id,
            userName: currentUser?.name || 'Sistema',
            templateId,
            summary: `Exportados ${itemsToExport.length} registros de ${template.entity}`
        };
        handleSave('exportJobs', newExportJob);
        setIsExportModalOpen(false);
    }, [appData, currentUser, handleSave]);
    const handleImport = (0, react_1.useCallback)(async (templateId, file) => {
        const template = appData.importExportTemplates.find(t => t.id === templateId);
        if (!template) {
            alert("Plantilla no encontrada.");
            return;
        }
        try {
            const parsedData = await (0, fileUtils_1.parseCsv)(file);
            const { creations, updates, errors } = await processImportData(template, parsedData, appData);
            setImportPreviewState({ creations, updates, errors, templateId });
        }
        catch (error) {
            console.error(error);
            alert(`Error al procesar el fichero: ${error.message}`);
        }
        setIsImportModalOpen(false);
    }, [appData]);
    const processImportData = async (template, parsedData, appData) => {
        // This is a simplified validation and diffing logic
        const creations = [];
        const updates = [];
        const errors = [];
        const existingItems = appData[template.entity];
        for (const [index, row] of parsedData.entries()) {
            const rowNumber = index + 2; // +1 for header, +1 for 0-index
            const sku = row['item_sku'] || row['sku'];
            if (!sku) {
                errors.push({ rowNumber, message: 'La columna SKU es obligatoria.', rowContent: row });
                continue;
            }
            const existingItem = existingItems.find(item => item.sku === sku);
            let newData = existingItem ? { ...existingItem } : { id: 'new', sku, name: row['item_name'] || sku, status: 'Inactivo' }; // Basic new item
            // Apply changes from row to newData
            template.fields.forEach(field => {
                if (field.mappingType === 'mapped' && row[field.columnHeader] !== undefined) {
                    const path = field.value.replace(/[{}]/g, '');
                    (0, lodash_es_1.set)(newData, path, row[field.columnHeader]);
                }
            });
            if (existingItem) {
                const changes = (0, changeTracker_1.generateChangeDetails)(template.entity, existingItem, newData, appData);
                if (changes.length > 0) {
                    updates.push({ oldData: existingItem, newData, changes });
                }
            }
            else {
                creations.push(newData);
            }
        }
        return { creations, updates, errors };
    };
    const handleConfirmImport = (0, react_1.useCallback)((preview) => {
        let summary = '';
        const changes = [];
        setAppData(prevData => {
            const template = prevData.importExportTemplates.find(t => t.id === preview.templateId);
            if (!template)
                return prevData;
            let updatedItems = [...prevData[template.entity]];
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
            return { ...prevData, [template.entity]: updatedItems };
        });
        // Log the import job
        const newChangeLog = {
            id: Date.now(),
            jobId: 0, // Will be set next
            changes,
        };
        const newJob = {
            id: 'new',
            timestamp: new Date().toISOString(),
            userId: currentUser?.id,
            userName: currentUser?.name || 'Sistema',
            templateId: preview.templateId,
            status: 'Completado',
            summary,
            changeLogId: newChangeLog.id,
        };
        handleSave('importJobs', newJob);
        // In a real app, you'd save the change log too. Here we just add it.
        setAppData(prev => ({ ...prev, importJobChangeLogs: [...prev.importJobChangeLogs, newChangeLog] }));
        setImportPreviewState(null);
        alert("Importación completada con éxito.");
    }, [currentUser, handleSave]);
    const handleUndoImport = (0, react_1.useCallback)((jobId) => {
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
                const items = newData[entityType];
                if (action === 'Creación') {
                    // Undo creation by deleting the item
                    newData[entityType] = items.filter(item => item.id !== entityId);
                }
                else if (action === 'Actualización') {
                    // Undo update by restoring the beforeState
                    const index = items.findIndex(item => item.id === entityId);
                    if (index !== -1 && beforeState) {
                        items[index] = beforeState;
                    }
                }
            });
            const updatedJobs = prevData.importJobs.map(j => j.id === jobId ? { ...j, status: 'Deshecho' } : j);
            newData.importJobs = updatedJobs;
            return newData;
        });
        alert(`La importación ${jobId} ha sido deshecha.`);
    }, [appData]);
    // --- END IMPORT/EXPORT LOGIC ---
    const handleExecutePricingRule = (0, react_1.useCallback)(async (ruleId) => {
        const rule = appData.pricingRules.find(r => r.id === ruleId);
        if (!rule) {
            return;
        }
        setIsPricingJobDone(false);
        setPricingJobLog([`Iniciando ejecución de la regla "${rule.name}"...`]);
        await new Promise(resolve => setTimeout(resolve, 50));
        const allCalculationLogs = [];
        const newPrices = [...appData.prices];
        const newPriceHistoryLogs = [];
        const now = new Date().toISOString();
        let processedCount = 0;
        let changedCount = 0;
        const productScope = rule.scope.productIds === null ? appData.products.map(p => p.id) : rule.scope.productIds;
        const platformScope = rule.scope.platformIds === null ? appData.platforms.map(p => p.id) : rule.scope.platformIds;
        for (const productId of productScope) {
            for (const platformId of platformScope) {
                const platform = appData.platforms.find(p => p.id === platformId);
                if (!platform)
                    continue;
                const countryId = platform.countryId;
                if (rule.scope.countryIds && !rule.scope.countryIds.includes(countryId)) {
                    continue;
                }
                processedCount++;
                const { finalAmount, source, log } = (0, pricingService_1.calculatePrice)(productId, platformId, rule, appData, { logProcess: true });
                if (log) {
                    allCalculationLogs.push(...log);
                }
                const oldPriceIndex = newPrices.findIndex(p => p.productId === productId && p.platformId === platformId);
                if (oldPriceIndex > -1) {
                    const oldPrice = newPrices[oldPriceIndex];
                    if (oldPrice.amount !== finalAmount) {
                        changedCount++;
                        newPriceHistoryLogs.push({
                            id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser.name,
                            productId, platformId, countryId,
                            oldAmount: oldPrice.amount, newAmount: finalAmount, currency: 'EUR',
                            source,
                            trigger: 'manual_rule_execution'
                        });
                    }
                    newPrices[oldPriceIndex] = { ...oldPrice, amount: finalAmount, lastUpdatedBy: 'rule', discountInfo: source.name };
                }
                else if (finalAmount > 0) {
                    changedCount++;
                    newPrices.push({
                        id: 'new', productId, platformId, countryId,
                        amount: finalAmount, currency: 'EUR', discountInfo: source.name, lastUpdatedBy: 'rule'
                    });
                    newPriceHistoryLogs.push({
                        id: 'new', timestamp: now, userId: currentUser.id, userName: currentUser.name,
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
            const finalPrices = newPrices.map(p => p.id === 'new' ? { ...p, id: nextPriceId++ } : p);
            let nextLogId = Math.max(0, ...prevData.priceHistoryLogs.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const finalLogs = newPriceHistoryLogs.map(p => p.id === 'new' ? { ...p, id: nextLogId++ } : p);
            return { ...prevData, prices: finalPrices, priceHistoryLogs: [...prevData.priceHistoryLogs, ...finalLogs] };
        });
        const summaryMessage = `✅ Proceso completado. Se procesaron ${processedCount} precios. ${changedCount} precios fueron modificados.`;
        setPricingJobLog(prev => [...(prev || []), summaryMessage]);
        setIsPricingJobDone(true);
    }, [appData, currentUser]);
    const triggerSchema = (0, react_1.useCallback)((schema, initialContext) => {
        const now = new Date().toISOString();
        const projectName = initialContext['nombre_del_proyecto'] || schema.name;
        setAppData(prev => {
            const newProjectId = Math.max(0, ...prev.proyectos.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
            const newProject = {
                id: newProjectId,
                name: projectName,
                taskSchemaId: schema.id,
                status: 'Activo',
                createdAt: now,
                ownerId: currentUser?.id,
            };
            let nextTaskId = Math.max(0, ...prev.tasks.map(t => typeof t.id === 'number' ? t.id : 0)) + 1;
            const newTasks = schema.templateTasks.map(templateTask => {
                const resolvedTitle = (0, placeholderService_1.resolvePrompt)(templateTask.title, initialContext);
                const resolvedDescription = (0, placeholderService_1.resolvePrompt)(templateTask.description, initialContext);
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + templateTask.dueDaysOffset);
                return {
                    id: nextTaskId++,
                    name: resolvedTitle,
                    description: resolvedDescription,
                    status: 'Pendiente',
                    priority: 'Media',
                    assigneeId: templateTask.defaultAssigneeId || currentUser?.id,
                    creatorId: currentUser?.id,
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
            };
        });
    }, [appData, currentUser]);
    const handleTaskUpdate = (0, react_1.useCallback)((taskId, updates) => {
        setAppData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
        }));
    }, []);
    const handleBackupData = (0, react_1.useCallback)(() => {
        const dataStr = JSON.stringify(appData, null, 2);
        (0, fileUtils_1.triggerDownload)(dataStr, `pim-backup-${new Date().toISOString()}.json`, 'application/json');
    }, [appData]);
    const renderContent = () => {
        if (!currentUser) {
            return <LoginView_1.LoginView onLogin={handleLogin} users={appData.users}/>;
        }
        if (!activeView) {
            // Default to a dashboard if no view is selected after login
            return <TaskBoardDashboard_1.TaskBoardDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} currentUser={currentUser} onSaveSubtask={handleSubtaskChange} onStartProject={triggerSchema} onTaskUpdate={handleTaskUpdate}/>;
        }
        if (!(0, authUtils_1.hasPermission)(currentUser, activeView.type === 'dashboard' ? activeView.entityType : activeView.type === 'aiSettings' ? 'aiSettings' : activeView.entityType)) {
            return <AccessDeniedView_1.AccessDeniedView />;
        }
        const setSaveHandler = (handler) => {
            activeSaveHandler.current = handler;
        };
        switch (activeView.type) {
            case 'dashboard':
                switch (activeView.entityType) {
                    case 'notifications': return <NotificationsDashboard_1.NotificationsDashboard notifications={appData.productNotifications} products={appData.products} countries={appData.countries} onStatusChange={handleNotificationStatusChange} onEditDetails={handleEditNotificationDetails}/>;
                    case 'contentMaturity': return <ContentMaturityDashboard_1.ContentMaturityDashboard appData={appData} onSelectItem={handleSelectItem}/>;
                    case 'importExport': return <ImportExportDashboard_1.ImportExportDashboard appData={appData} onNewExport={() => setIsExportModalOpen(true)} onNewImport={() => setIsImportModalOpen(true)} onUndoImport={handleUndoImport} onManageTemplates={() => handleSelectView({ type: 'list', entityType: 'importExportTemplates' })}/>;
                    case 'pvprMatrix': return <PvprMatrixDashboard_1.PvprMatrixDashboard appData={appData} onSave={handleSavePvprs} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'pricesByPlatform': return <PricesByPlatformDashboard_1.PricesByPlatformDashboard appData={appData} onSave={handleSavePrices} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'priceHistoryLogs': return <PriceHistoryLogDashboard_1.PriceHistoryLogDashboard appData={appData}/>;
                    case 'pricingDashboard': return <PricingDashboard_1.PricingDashboard appData={appData}/>;
                    case 'amazonFlashDeals': return <AmazonFlashDealDashboard_1.AmazonFlashDealDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew}/>;
                    case 'tasks': return <TaskBoardDashboard_1.TaskBoardDashboard appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew} currentUser={currentUser} onSaveSubtask={handleSubtaskChange} onStartProject={triggerSchema}/>;
                    case 'proyectos': return <ProjectsDashboard_1.ProjectsDashboard appData={appData} onSelectItem={handleSelectItem}/>;
                    case 'videoStudio': return <VideoStudioDashboard_1.VideoStudioDashboard appData={appData} onSelectItem={handleSelectItem} onSaveProject={handleSave}/>;
                    case 'reports': return <ReportsDashboard_1.ReportsDashboard appData={appData}/>;
                    default: return <div>Dashboard not found</div>;
                }
            case 'list':
                if (activeView.entityType === 'productNotifications') {
                    return <ProductNotificationListView_1.ProductNotificationListView notifications={appData.productNotifications} products={appData.products} countries={appData.countries} onSelectItem={handleSelectItem} onAddNew={handleAddNew}/>;
                }
                if (activeView.entityType === 'competitorBrands') {
                    return <CompetitorBrandListView_1.CompetitorBrandListView brands={appData.competitorBrands} products={appData.competitorProducts} onSelectItem={handleSelectItem} onAddNew={handleAddNew}/>;
                }
                if (activeView.entityType === 'notes') {
                    return <AllNotesListView_1.AllNotesListView appData={appData} onSelectItem={handleSelectItem} onNoteUpdate={handleNoteUpdate}/>;
                }
                if (activeView.entityType === 'logs') {
                    return <AllLogsView_1.AllLogsView appData={appData}/>;
                }
                if (activeView.entityType === 'etiquetas') {
                    return <EtiquetaListView_1.EtiquetaListView appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew}/>;
                }
                if (activeView.entityType === 'knowledgeBaseEntries') {
                    return <KnowledgeBaseView_1.KnowledgeBaseView appData={appData} onSelectItem={handleSelectItem} onAddNew={handleAddNew}/>;
                }
                return <DetailView_1.DetailView entityType={activeView.entityType} items={appData[activeView.entityType]} onSelectItem={handleSelectItem} onAddNew={handleAddNew} onExecuteRule={handleExecutePricingRule} onDeleteItem={handleDelete} pricingJobLog={pricingJobLog} isPricingJobDone={isPricingJobDone} onPricingJobClose={() => setPricingJobLog(null)} appData={appData}/>;
            case 'detail':
                const onCancel = () => {
                    if (activeView.entityType === 'proyectos') {
                        handleSelectView({ type: 'dashboard', entityType: 'proyectos' });
                    }
                    else if (activeView.entityType === 'knowledgeBaseEntries') {
                        handleSelectView({ type: 'list', entityType: 'knowledgeBaseEntries' });
                    }
                    else if (activeView.entityType === 'videoProjects') {
                        handleSelectView({ type: 'dashboard', entityType: 'videoStudio' });
                    }
                    else if (activeView.entityType === 'amazonFlashDeals') {
                        handleSelectView({ type: 'dashboard', entityType: 'amazonFlashDeals' });
                    }
                    else {
                        handleSelectView({ type: 'list', entityType: activeView.entityType });
                    }
                };
                switch (activeView.entityType) {
                    // FIX: Changed `isDirty={isDirty}` to `isDirty={isFormDirty}` to pass the correct state variable.
                    case 'products': return <ProductDetailView_1.ProductDetailView initialData={activeView.entity} onSave={(d) => handleSave('products', d)} onDelete={(id) => handleDelete('products', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} isDirty={isFormDirty} setSaveHandler={setSaveHandler} onDuplicateEtiqueta={handleDuplicateEtiqueta} sidebarCollapsed={sidebarCollapsed}/>;
                    case 'countries': return <CountryDetailView_1.CountryDetailView initialData={activeView.entity} onSave={(d) => handleSave('countries', d)} onDelete={(id) => handleDelete('countries', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'platforms': return <PlatformDetailView_1.PlatformDetailView initialData={activeView.entity} onSave={(d) => handleSave('platforms', d)} onDelete={(id) => handleDelete('platforms', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'tickets': return <TicketDetailView_1.TicketDetailView initialData={activeView.entity} onSave={(d) => handleSave('tickets', d)} onDelete={(id) => handleDelete('tickets', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'envases': return <EnvaseDetailView_1.EnvaseDetailView initialData={activeView.entity} onSave={(d) => handleSave('envases', d)} onDelete={(id) => handleDelete('envases', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'etiquetas': return <EtiquetaDetailView_1.EtiquetaDetailView initialData={activeView.entity} onSave={(d) => handleSave('etiquetas', d)} onDelete={(id) => handleDelete('etiquetas', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onUsageAdd={handleUsageAdd} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} onDuplicate={handleDuplicateEtiqueta} onEntitySave={handleSave}/>;
                    case 'videos': return <VideoDetailView_1.VideoDetailView initialData={activeView.entity} onSave={(d) => handleSave('videos', d)} onDelete={(id) => handleDelete('videos', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler} onSelectItem={handleSelectItem}/>;
                    case 'ingredients': return <IngredientDetailView_1.IngredientDetailView initialData={activeView.entity} onSave={(d) => handleSave('ingredients', d)} onDelete={(id) => handleDelete('ingredients', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'translationTerms': return <TranslationTermDetailView_1.TranslationTermDetailView initialData={activeView.entity} onSave={(d) => handleSave('translationTerms', d)} onDelete={(id) => handleDelete('translationTerms', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'productNotifications': return <ProductNotificationDetailView_1.ProductNotificationDetailView initialData={activeView.entity} onSave={(d) => handleSave('productNotifications', d)} onDelete={(id) => handleDelete('productNotifications', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'competitorBrands': return <CompetitorBrandDetailView_1.CompetitorBrandDetailView initialData={activeView.entity} onSave={(d) => handleSave('competitorBrands', d)} onDelete={(id) => handleDelete('competitorBrands', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'competitorProducts': return <CompetitorProductDetailView_1.CompetitorProductDetailView initialData={activeView.entity} onSave={(d) => handleSave('competitorProducts', d)} onDelete={(id) => handleDelete('competitorProducts', id)} onCancel={onCancel} appData={appData} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'contentRecipes': return <ContentRecipeDetailView_1.ContentRecipeDetailView initialData={activeView.entity} onSave={(d) => handleSave('contentRecipes', d)} onDelete={(id) => handleDelete('contentRecipes', id)} onCancel={onCancel} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'promptTemplates': return <PromptTemplateDetailView_1.PromptTemplateDetailView initialData={activeView.entity} onSave={(d) => handleSave('promptTemplates', d)} onDelete={(id) => handleDelete('promptTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'importExportTemplates': return <ImportExportTemplateDetailView_1.PublicationTemplateDetailView initialData={activeView.entity} onSave={(d) => handleSave('importExportTemplates', d)} onDelete={(id) => handleDelete('importExportTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'pricingRules': return <PricingRuleDetailView_1.PricingRuleDetailView initialData={activeView.entity} onSave={(d) => handleSave('pricingRules', d)} onDelete={(id) => handleDelete('pricingRules', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'amazonFlashDeals': return <AmazonFlashDealDetailView_1.AmazonFlashDealDetailView initialData={activeView.entity} onSave={(d) => handleSave('amazonFlashDeals', d)} onDelete={(id) => handleDelete('amazonFlashDeals', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'users': return <UserDetailView_1.UserDetailView initialData={activeView.entity} onSave={(d) => handleSave('users', d)} onDelete={(id) => handleDelete('users', id)} onCancel={onCancel} currentUser={currentUser} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'tasks': return <TaskDetailView_1.TaskDetailView initialData={activeView.entity} onSave={(d) => handleSave('tasks', d)} onDelete={(id) => handleDelete('tasks', id)} onCancel={onCancel} appData={appData} currentUser={currentUser} onCommentAdd={handleTaskCommentAdd} onSaveSubtask={handleSubtaskChange} onDeleteSubtask={handleDeleteSubtask} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'taskSchemas': return <TaskSchemaDetailView_1.TaskSchemaDetailView initialData={activeView.entity} onSave={(data) => handleSave('taskSchemas', data)} onDelete={(id) => handleDelete('taskSchemas', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'proyectos': return <ProjectDetailView_1.ProjectDetailView initialData={activeView.entity} onSave={(d) => handleSave('proyectos', d)} onDelete={(id) => handleDelete('proyectos', id)} onCancel={onCancel} appData={appData} onTaskUpdate={handleTaskUpdate} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'knowledgeBaseEntries': return <KnowledgeBaseEntryDetailView_1.KnowledgeBaseEntryDetailView initialData={activeView.entity} onSave={(d) => handleSave('knowledgeBaseEntries', d)} onDelete={(id) => handleDelete('knowledgeBaseEntries', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'sequenceTemplates': return <SequenceTemplateDetailView_1.SequenceTemplateDetailView initialData={activeView.entity} onSave={(d) => handleSave('sequenceTemplates', d)} onDelete={(id) => handleDelete('sequenceTemplates', id)} onCancel={onCancel} onNavigate={handleSelectView} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'videoCompositionTemplates': return <VideoTemplateDetailView_1.VideoCompositionTemplateDetailView initialData={activeView.entity} onSave={(d) => handleSave('videoCompositionTemplates', d)} onDelete={(id) => handleDelete('videoCompositionTemplates', id)} onCancel={onCancel} appData={appData} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'videoProjects': return <VideoProjectDetailView_1.VideoProjectDetailView initialData={activeView.entity} onSave={(d) => handleSave('videoProjects', d)} onDelete={(id) => handleDelete('videoProjects', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} onEntitySave={handleSave} onNoteAdd={handleNoteAdd} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    case 'mediaAssets': return <MediaAssetDetailView_1.MediaAssetDetailView initialData={activeView.entity} onSave={(d) => handleSave('mediaAssets', d)} onDelete={(id) => handleDelete('mediaAssets', id)} onCancel={onCancel} appData={appData} onSelectItem={handleSelectItem} setIsDirty={setIsFormDirty} setSaveHandler={setSaveHandler}/>;
                    default: return <div>Detail view for {activeView.entityType} not implemented</div>;
                }
            case 'aiSettings':
                return <AISettingsView_1.AISettingsView initialData={appData.aiSettings} onSave={handleSaveAiSettings} onCancel={() => handleSelectView({ type: 'dashboard', entityType: 'importExport' })}/>;
            default: return <div>View not found</div>;
        }
    };
    return (<>
            {currentUser ? (<div className="flex">
                    <Sidebar_1.Sidebar appData={appData} setActiveView={handleSelectView} activeEntityType={activeView?.type === 'detail' ? activeView.entityType : activeView?.type === 'list' ? activeView.entityType : activeView?.type === 'dashboard' ? activeView.entityType : activeView?.type === 'aiSettings' ? 'aiSettings' : undefined} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} currentUser={currentUser} onLogout={handleLogout} onBackupData={handleBackupData} onSelectItem={handleSelectItem}/>
                    <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                        <div className="p-4 sm:p-6 lg:p-8">
                           {renderContent()}
                        </div>
                    </main>
                </div>) : (renderContent())}
            
            {/* --- START GLOBAL ELEMENTS --- */}
            {currentUser && (<>
                    <button onClick={toggleTranslationPanel} className="fixed bottom-6 right-20 z-30 w-12 h-12 bg-cyan-500 text-slate-900 rounded-full shadow-lg flex items-center justify-center hover:bg-cyan-600 transition-transform transform hover:scale-110" title="Asistente de Traducción (Ctrl+Shift+L)">
                        <Icon_1.Icon name="language" className="text-2xl"/>
                    </button>
                    <button onClick={toggleInspectorPanel} className="fixed bottom-6 right-6 z-30 w-12 h-12 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-transform transform hover:scale-110" title="Inspector de Producto (Ctrl+Shift+P)">
                        <Icon_1.Icon name="box-open" className="text-xl"/>
                    </button>
                    {isTranslationPanelOpen && (<GlobalTranslationPanel_1.GlobalTranslationPanel appData={appData} isOpen={isTranslationPanelOpen} onClose={() => setIsTranslationPanelOpen(false)}/>)}
                    {isInspectorOpen && (<GlobalProductInspector_1.GlobalProductInspector appData={appData} isOpen={isInspectorOpen} onClose={() => setIsInspectorOpen(false)}/>)}
                </>)}

            {/* --- START GLOBAL MODALS --- */}
            {deleteConfirmation && (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
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
                </div>)}
            {unsavedChangesModal.isOpen && (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-200">Cambios sin Guardar</h3>
                            <p className="text-sm text-slate-400 mt-2">
                                Tienes cambios sin guardar. ¿Qué te gustaría hacer?
                            </p>
                        </div>
                        <div className="p-4 bg-slate-700/50 flex justify-end space-x-2 rounded-b-lg">
                            <button onClick={() => setUnsavedChangesModal({ isOpen: false, onConfirm: () => { }, onDiscard: () => { } })} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                            <button onClick={unsavedChangesModal.onDiscard} className="px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-500 font-semibold">Salir sin Guardar</button>
                            <button onClick={unsavedChangesModal.onConfirm} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar y Salir</button>
                        </div>
                    </div>
                </div>)}
            {isExportModalOpen && <ExportModal_1.ExportModal appData={appData} onClose={() => setIsExportModalOpen(false)} onExport={handleExport}/>}
            {isImportModalOpen && <ImportModal_1.ImportModal appData={appData} onClose={() => setIsImportModalOpen(false)} onImport={handleImport}/>}
            {importPreviewState && <ImportPreviewModal_1.ImportPreviewModal previewState={importPreviewState} onClose={() => setImportPreviewState(null)} onConfirm={handleConfirmImport}/>}
        </>);
};
exports.default = App;
